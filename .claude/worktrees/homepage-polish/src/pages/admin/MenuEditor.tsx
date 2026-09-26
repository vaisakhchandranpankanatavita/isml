import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Select, TextInput } from '@/components/admin/FormFields';
import { menusService } from '@/services/menus.service';
import type { MenuItem } from '@/types';
import { useToast } from '@/hooks/useToast';

export default function MenuEditor() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { push } = useToast();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('/');
  const [parentId, setParentId] = useState<string>('');
  const [active, setActive] = useState(true);
  const [newTab, setNewTab] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setItems(menusService.list());
    if (!id) return;
    const item = menusService.get(id);
    if (!item) {
      setNotFound(true);
      return;
    }
    setLabel(item.label);
    setUrl(item.url);
    setParentId(item.parentId ?? '');
    setActive(item.active);
    setNewTab(item.newTab);
  }, [id]);

  // Prevent parenting to self or descendants.
  const parentOptions = useMemo(() => {
    if (!id) return items.filter((m) => m.parentId === null);
    const forbidden = new Set<string>([id]);
    const collect = (parent: string) => {
      items
        .filter((m) => m.parentId === parent)
        .forEach((c) => {
          forbidden.add(c.id);
          collect(c.id);
        });
    };
    collect(id);
    return items.filter((m) => m.parentId === null && !forbidden.has(m.id));
  }, [items, id]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        label: label.trim(),
        url: url.trim() || '/',
        parentId: parentId || null,
        active,
        newTab,
      };
      if (isEdit && id) {
        menusService.update(id, payload);
        push('success', 'Menu item updated.');
      } else {
        menusService.create(payload);
        push('success', `Menu item "${payload.label}" added.`);
      }
      navigate('/admin/menus');
    } catch (err) {
      push('error', err instanceof Error ? err.message : 'Could not save menu item.');
    }
  };

  if (notFound) {
    return (
      <div>
        <AdminPageHeader title="Menu item not found" />
        <Link to="/admin/menus" className="btn-outline">
          Back to menus
        </Link>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? 'Edit menu item' : 'New menu item'}
        breadcrumbs={[
          { label: 'Menus', to: '/admin/menus' },
          { label: isEdit ? 'Edit' : 'New' },
        ]}
      />

      <form onSubmit={onSubmit} className="card max-w-2xl space-y-5 p-6">
        <TextInput
          label="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          placeholder="e.g. About Us"
        />
        <TextInput
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="/about or https://example.com"
          hint="Use a relative path (/about) for internal links or a full URL for external links."
        />
        <Select
          label="Parent menu"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          hint="Leave empty to make this a top-level item."
        >
          <option value="">— No parent (top level) —</option>
          {parentOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </Select>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            <span>
              <span className="font-medium text-slate-800">Visible</span>
              <span className="ml-1 text-slate-500">— show on the public site</span>
            </span>
          </label>
          <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
            <input
              type="checkbox"
              checked={newTab}
              onChange={(e) => setNewTab(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            <span>
              <span className="font-medium text-slate-800">Open in new tab</span>
              <span className="ml-1 text-slate-500">— useful for external links</span>
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Link to="/admin/menus" className="btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn-primary">
            {isEdit ? 'Save changes' : 'Add menu item'}
          </button>
        </div>
      </form>
    </div>
  );
}
