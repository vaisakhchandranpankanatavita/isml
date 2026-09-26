import type { SiteSettings } from '@/types';
import { storage } from './storage';

export const settingsService = {
  get(): SiteSettings {
    return storage.read().settings;
  },
  update(patch: Partial<SiteSettings>): SiteSettings {
    const db = storage.read();
    db.settings = { ...db.settings, ...patch };
    storage.write(db);
    return db.settings;
  },
};
