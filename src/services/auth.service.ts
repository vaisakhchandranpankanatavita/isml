import type { User } from '@/types';
import {
  storage,
  saveCurrentUserId,
  readCurrentUserId,
  clearCurrentUserId,
} from './storage';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export const authService = {
  async login({ email, password }: LoginPayload): Promise<LoginResponse> {
    const db = storage.read();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!user) {
      throw { status: 401, message: 'Invalid email or password.' } as const;
    }
    saveCurrentUserId(user.id);
    return { user };
  },

  logout() {
    clearCurrentUserId();
  },

  currentUser(): User | null {
    const id = readCurrentUserId();
    if (!id) return null;
    const db = storage.read();
    return db.users.find((u) => u.id === id) ?? null;
  },
};
