import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { usersService } from '@/services/users.service';
import { storage } from '@/services/storage';
import type { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [toDelete, setToDelete] = useState<User | null>(null);
  const { user: current, hasRole } = useAuth();
  const { push } = useToast();
  const canManage = hasRole(['admin']);

  useEffect(() => {
    const refresh = () => setUsers(usersService.list());
    refresh();
    return storage.subscribe(refresh);
  }, []);

  const handleDelete = () => {
    if (!toDelete) return;
    try {
      usersService.remove(toDelete.id);
      push('success', `User "${toDelete.name}" deleted.`);
    } catch (err) {
      push('error', err instanceof Error ? err.message : 'Could not delete user.');
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description={canManage ? 'Manage CMS users and their roles.' : 'You are viewing users in read-only mode.'}
        actions={
          canManage ? (
            <Link to="/admin/users/new" className="btn-primary">
              + New user
            </Link>
          ) : null
        }
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
                {canManage && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {u.name}
                    {current?.id === u.id && (
                      <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                        you
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 capitalize text-slate-600">{u.role}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  {canManage && (
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/users/${u.id}/edit`}
                        className="text-brand-700 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setToDelete(u)}
                        disabled={current?.id === u.id}
                        className="ml-4 text-school-red hover:underline disabled:opacity-40"
                        title={current?.id === u.id ? 'You cannot delete your own account.' : ''}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete user?"
        message={`This will permanently remove "${toDelete?.name}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
