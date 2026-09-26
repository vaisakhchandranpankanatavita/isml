import { useContext } from 'react';
import { SettingsContext } from '@/context/SettingsContext';

export function useSiteSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSiteSettings must be used within a SettingsProvider');
  return ctx;
}
