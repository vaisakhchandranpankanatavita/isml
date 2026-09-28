import type { SiteSettings } from '@/types';
import { CHAT_SUGGESTIONS } from '@/config/site';
import { storage } from './storage';

/** Settings saved before a chat field existed pick up its default. */
function withDefaultChatSuggestions(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    chatSuggestions: {
      ...CHAT_SUGGESTIONS,
      ...settings.chatSuggestions,
    },
    chatFaqs: settings.chatFaqs ?? [],
  };
}

export const settingsService = {
  get(): SiteSettings {
    return withDefaultChatSuggestions(storage.read().settings);
  },
  update(patch: Partial<SiteSettings>): SiteSettings {
    const db = storage.read();
    db.settings = withDefaultChatSuggestions({ ...db.settings, ...patch });
    storage.write(db);
    return db.settings;
  },
};
