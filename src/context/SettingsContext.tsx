import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { SiteSettings } from '@/types';
import { settingsService } from '@/services/settings.service';
import { storage } from '@/services/storage';

interface SettingsContextValue {
  settings: SiteSettings;
  update: (patch: Partial<SiteSettings>) => SiteSettings;
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => settingsService.get());

  useEffect(() => storage.subscribe(() => setSettings(settingsService.get())), []);

  const update = useCallback((patch: Partial<SiteSettings>) => {
    const next = settingsService.update(patch);
    setSettings(next);
    return next;
  }, []);

  const value = useMemo(() => ({ settings, update }), [settings, update]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
