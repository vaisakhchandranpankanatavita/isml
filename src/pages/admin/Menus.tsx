import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { menusService, type MenuNode } from '@/services/menus.service';
import { storage } from '@/services/storage';
import { useToast } from '@/hooks/useToast';

export default function MenusAdmin() {
  const [tree, setTree] = useState<MenuNode[]>([]);
  const [toDelete, setToDelete] = useState<MenuNode | null>(null);
  const { push } = useToast();

  useEffect(() => {
    const refresh = () => setTree(menusService.tree());
    refresh();
    return storage.subscribe(refresh);
  }, []);

  const toggleActive = (node: MenuNode) => {
    menusService.update(node.id, { active: !node.active });
    push('success', `${node.label} ${node.active ? 'hidden' : 'made visible'}.`);
  };

  const move = (node: MenuNode, dir: 'up' | 'down') => {
    menusService.move(node.id, dir);
  };

  const handleDelete = () => {
    if (!toDelete) return;
    menusService.remove(toDelete.id);
    push('success', `Menu item "${toDelete.label}" deleted.`);
    setToDelete(null);
  };

  return (
    <div>
      <AdminPageHeader
        title="Menus"
        description="Manage the public site navigation. Drag with the arrow buttons to reorder, or nest items to create submenus."
        actions={
          <>
            <Link to="/admin/menus/new" className="btn-primary">
              + New menu item
            </Link>
          </>
        }
      />

      {tree.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          No menu items yet. Add your first one to build the site navigation.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {tree.map((node, i) => (
              <MenuRow
                key={node.id}
                node={node}
                depth={0}
                isFirst={i === 0}
                isLast={i === tree.length - 1}
                onToggle={toggleActive}
                onMove={move}
                onDelete={setToDelete}
              />
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 text-xs text-slate-500">
        Tip: To create a submenu item, add a new item and choose an existing item as its "parent".
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete menu item?"
        message={`This will remove "${toDelete?.label}" and any of its children from the site menu.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

interface RowProps {
  node: MenuNode;
  depth: number;
  isFirst: boolean;
  isLast: boolean;
  onToggle: (n: MenuNode) => void;
  onMove: (n: MenuNode, dir: 'up' | 'down') => void;
  onDelete: (n: MenuNode) => void;
}

function MenuRow({ node, depth, isFirst, isLast, onToggle, onMove, onDelete }: RowProps) {
  return (
    <>
      <li
        className="flex flex-wrap items-center gap-3 px-4 py-3"
        style={{ paddingLeft: 16 + depth * 24 }}
      >
        <span className="text-slate-300">{depth > 0 ? '↳' : '•'}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-slate-900">{node.label}</span>
            {!node.active && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                hidden
              </span>
            )}
            {node.newTab && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                new tab
              </span>
            )}
          </div>
          <div className="truncate text-xs text-slate-500">{node.url}</div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(node, 'up')}
            disabled={isFirst}
            className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(node, 'down')}
            disabled={isLast}
            className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => onToggle(node)}
            className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            {node.active ? 'Hide' : 'Show'}
          </button>
          <Link
            to={`/admin/menus/${node.id}/edit`}
            className="rounded-md border border-slate-200 px-2 py-1 text-xs text-brand-700 hover:bg-brand-50"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(node)}
            className="rounded-md border border-slate-200 px-2 py-1 text-xs text-school-red hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </li>
      {node.children.map((child, i) => (
        <MenuRow
          key={child.id}
          node={child}
          depth={depth + 1}
          isFirst={i === 0}
          isLast={i === node.children.length - 1}
          onToggle={onToggle}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
