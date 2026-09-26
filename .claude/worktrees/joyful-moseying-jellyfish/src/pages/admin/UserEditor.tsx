import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Select, TextInput } from '@/components/admin/FormFields';
import { usersService } from '@/services/users.service';
import type { UserRole } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function UserEditor() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { push } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('editor');
  const [password, setPassword] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const u = usersService.get(id);
    if (!u) {
      setNotFound(true);
      return;
    }
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
  }, [id]);

  if (!hasRole(['admin'])) {
    return (
      <div>
        <AdminPageHeader title="Not authorised" />
        <p className="text-slate-600">Only administrators can manage users.</p>
        <Link to="/admin/users" className="btn-outline mt-4">
          Back
        </Link>
      </div>
    );
  }

  if (notFound) {
    return (
      <div>
        <AdminPageHeader title="User not found" />
        <Link to="/admin/users" className="btn-outline">
          Back to users
        </Link>
      </div>
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        usersService.update(id, {
          name,
          email,
          role,
          password: password || undefined,
        });
        push('success', 'User updated.');
      } else {
        if (!password) {
          push('error', 'Password is required for new users.');
          return;
        }
        usersService.create({ name, email, role, password });
        push('success', `User "${name}" created.`);
      }
      navigate('/admin/users');
    } catch (err) {
      push('error', err instanceof Error ? err.message : 'Could not save user.');
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? 'Edit user' : 'New user'}
        breadcrumbs={[{ label: 'Users', to: '/admin/users' }, { label: isEdit ? 'Edit' : 'New' }]}
      />

      <form onSubmit={onSubmit} className="card max-w-xl space-y-5 p-6">
        <TextInput
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="off"
        />
        <Select label="Role" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
          <option value="admin">Admin — full access</option>
          <option value="editor">Editor — content only</option>
          <option value="author">Author — write posts</option>
          <option value="viewer">Viewer — read only</option>
        </Select>
        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!isEdit}
          hint={isEdit ? 'Leave empty to keep the current password' : ''}
          autoComplete="new-password"
        />

        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Link to="/admin/users" className="btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn-primary">
            {isEdit ? 'Save changes' : 'Create user'}
          </button>
        </div>
      </form>
    </div>
  );
}
