import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types';

interface Props {
  roles: User['role'][];
  fallback?: ReactNode;
  children: ReactNode;
}

export default function RoleGuard({ roles, fallback = null, children }: Props) {
  const { hasRole } = useAuth();
  return hasRole(roles) ? <>{children}</> : <>{fallback}</>;
}
