import type { User } from '@/types';
import { nowIso, storage, uid } from './storage';

export const usersService = {
  list(): User[] {
    return [...storage.read().users].sort((a, b) => a.name.localeCompare(b.name));
  },
  get(id: string): User | undefined {
    return storage.read().users.find((u) => u.id === id);
  },
  create(input: Omit<User, 'id' | 'createdAt'>): User {
    const db = storage.read();
    if (db.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error('A user with that email already exists.');
    }
    const user: User = { ...input, id: uid(), createdAt: nowIso() };
    db.users.push(user);
    storage.write(db);
    return user;
  },
  update(id: string, patch: Partial<Omit<User, 'id' | 'createdAt'>>): User | undefined {
    const db = storage.read();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    if (
      patch.email &&
      db.users.some(
        (u) => u.id !== id && u.email.toLowerCase() === patch.email!.toLowerCase(),
      )
    ) {
      throw new Error('Another user with that email already exists.');
    }
    // Preserve existing password when the patch omits it or sends an empty value
    const current = db.users[idx];
    const nextPassword =
      patch.password === undefined || patch.password === '' ? current.password : patch.password;
    const next: User = { ...current, ...patch, password: nextPassword };
    db.users[idx] = next;
    storage.write(db);
    return next;
  },
  remove(id: string): void {
    const db = storage.read();
    if (db.users.length <= 1) throw new Error('Cannot delete the last remaining user.');
    db.users = db.users.filter((u) => u.id !== id);
    storage.write(db);
  },
};
