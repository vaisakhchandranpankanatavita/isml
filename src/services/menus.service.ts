import type { MenuItem } from '@/types';
import { nowIso, storage, uid } from './storage';

export interface MenuNode extends MenuItem {
  children: MenuNode[];
}

function normalizeUrl(url: string): string {
  return url.replace(/^\/p(?=\/)/, '') || '/';
}

function buildTree(items: MenuItem[]): MenuNode[] {
  const byParent = new Map<string | null, MenuNode[]>();
  items
    .slice()
    .sort((a, b) => a.order - b.order)
    .forEach((item) => {
      const node: MenuNode = { ...item, url: normalizeUrl(item.url), children: [] };
      const bucket = byParent.get(item.parentId) ?? [];
      bucket.push(node);
      byParent.set(item.parentId, bucket);
    });
  const attach = (parentId: string | null): MenuNode[] =>
    (byParent.get(parentId) ?? []).map((n) => ({ ...n, children: attach(n.id) }));
  return attach(null);
}

function nextOrder(items: MenuItem[], parentId: string | null): number {
  const siblings = items.filter((m) => m.parentId === parentId);
  if (siblings.length === 0) return 1;
  return Math.max(...siblings.map((s) => s.order)) + 1;
}

export const menusService = {
  list(): MenuItem[] {
    return storage
      .read()
      .menus.slice()
      .sort((a, b) => a.order - b.order)
      .map((item) => ({ ...item, url: normalizeUrl(item.url) }));
  },
  tree(): MenuNode[] {
    return buildTree(storage.read().menus);
  },
  activeTree(): MenuNode[] {
    return buildTree(storage.read().menus.filter((m) => m.active));
  },
  get(id: string): MenuItem | undefined {
    const item = storage.read().menus.find((m) => m.id === id);
    return item ? { ...item, url: normalizeUrl(item.url) } : undefined;
  },
  create(input: Omit<MenuItem, 'id' | 'order'> & { order?: number }): MenuItem {
    const db = storage.read();
    const item: MenuItem = {
      id: uid(),
      label: input.label,
      url: normalizeUrl(input.url),
      parentId: input.parentId,
      active: input.active,
      newTab: input.newTab,
      order: input.order ?? nextOrder(db.menus, input.parentId),
    };
    db.menus.push(item);
    storage.write(db);
    return item;
  },
  update(id: string, patch: Partial<Omit<MenuItem, 'id'>>): MenuItem | undefined {
    const db = storage.read();
    const idx = db.menus.findIndex((m) => m.id === id);
    if (idx === -1) return undefined;
    // Prevent circular parenting: item cannot be a child of itself or its own descendants.
    if (patch.parentId && patch.parentId === id) {
      throw new Error('A menu item cannot be its own parent.');
    }
    if (patch.parentId) {
      const isDescendant = (candidateParentId: string): boolean => {
        if (candidateParentId === id) return true;
        const parent = db.menus.find((m) => m.id === candidateParentId);
        if (!parent || !parent.parentId) return false;
        return isDescendant(parent.parentId);
      };
      if (isDescendant(patch.parentId)) {
        throw new Error('Cannot move an item under one of its own descendants.');
      }
    }
    const next: MenuItem = {
      ...db.menus[idx],
      ...patch,
      ...(patch.url ? { url: normalizeUrl(patch.url) } : {}),
    };
    db.menus[idx] = next;
    storage.write(db);
    return next;
  },
  remove(id: string): void {
    const db = storage.read();
    const idsToRemove = new Set<string>([id]);
    const collect = (parentId: string) => {
      db.menus
        .filter((m) => m.parentId === parentId)
        .forEach((c) => {
          idsToRemove.add(c.id);
          collect(c.id);
        });
    };
    collect(id);
    db.menus = db.menus.filter((m) => !idsToRemove.has(m.id));
    storage.write(db);
  },
  move(id: string, direction: 'up' | 'down'): void {
    const db = storage.read();
    const item = db.menus.find((m) => m.id === id);
    if (!item) return;
    const siblings = db.menus
      .filter((m) => m.parentId === item.parentId)
      .sort((a, b) => a.order - b.order);
    const idx = siblings.findIndex((s) => s.id === id);
    const swapWith = direction === 'up' ? siblings[idx - 1] : siblings[idx + 1];
    if (!swapWith) return;
    const tmp = item.order;
    item.order = swapWith.order;
    swapWith.order = tmp;
    storage.write(db);
  },
  reindex(): void {
    // Normalise `order` to sequential 1..N per parent bucket.
    const db = storage.read();
    const groups = new Map<string | null, MenuItem[]>();
    db.menus.forEach((m) => {
      const bucket = groups.get(m.parentId) ?? [];
      bucket.push(m);
      groups.set(m.parentId, bucket);
    });
    groups.forEach((items) => {
      items
        .sort((a, b) => a.order - b.order)
        .forEach((item, i) => {
          item.order = i + 1;
        });
    });
    storage.write(db);
  },
};

export const _internal = { buildTree };

// Timestamps are stored on other collections but menus don't currently need them.
export const _nowIso = nowIso;
