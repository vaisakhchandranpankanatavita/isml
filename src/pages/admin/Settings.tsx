import { useEffect, useState, type FormEvent } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { TextArea, TextInput } from '@/components/admin/FormFields';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { storage, uid } from '@/services/storage';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import type { ChatSuggestions, K12Program, HomeGalleryImage } from '@/types';
import { CHAT_SUGGESTIONS } from '@/config/site';

export default function Settings() {
  const { settings, update } = useSiteSettings();
  const { push } = useToast();
  const { hasRole } = useAuth();
  const [form, setForm] = useState(settings);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => setForm(settings), [settings]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const updateChatSuggestions = (group: keyof ChatSuggestions, value: string) => {
    const suggestions = form.chatSuggestions ?? CHAT_SUGGESTIONS;
    set('chatSuggestions', {
      ...suggestions,
      [group]: value
        .split(/\r?\n/)
        .map((suggestion) => suggestion.trim())
        .filter(Boolean),
    });
  };

  // K-12 programs helpers
  const addProgram = () =>
    set('k12Programs', [
      ...form.k12Programs,
      { id: uid(), title: 'New Stage', grades: 'Grades', coverUrl: '' } as K12Program,
    ]);
  const updateProgram = (id: string, patch: Partial<K12Program>) =>
    set(
      'k12Programs',
      form.k12Programs.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  const removeProgram = (id: string) =>
    set(
      'k12Programs',
      form.k12Programs.filter((p) => p.id !== id),
    );

  // Experience images helpers
  const addExperienceImage = () =>
    set('experienceImages', [
      ...form.experienceImages,
      { id: uid(), url: '', caption: '' } as HomeGalleryImage,
    ]);
  const updateExperienceImage = (id: string, patch: Partial<HomeGalleryImage>) =>
    set(
      'experienceImages',
      form.experienceImages.map((img) => (img.id === id ? { ...img, ...patch } : img)),
    );
  const removeExperienceImage = (id: string) =>
    set(
      'experienceImages',
      form.experienceImages.filter((img) => img.id !== id),
    );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    update(form);
    push('success', 'Settings saved.');
  };

  const onReset = () => {
    storage.resetToSeed();
    push('info', 'All CMS data has been reset to defaults.');
    setConfirmReset(false);
  };

  return (
    <div>
      <AdminPageHeader
        title="Site settings"
        description="Content and branding that appears across the public website."
        actions={
          hasRole(['admin']) ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="btn-outline"
              title="Wipe all CMS data and restore initial demo content"
            >
              Reset demo data
            </button>
          ) : null
        }
      />

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2">
        {/* General */}
        <section className="card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            General
          </h2>
          <TextInput
            label="Site name"
            value={form.siteName}
            onChange={(e) => set('siteName', e.target.value)}
          />
          <TextInput
            label="Tagline"
            value={form.tagline}
            onChange={(e) => set('tagline', e.target.value)}
          />
          <TextInput
            label="Admission email"
            type="email"
            value={form.admissionEmail}
            onChange={(e) => set('admissionEmail', e.target.value)}
          />
        </section>

        {/* Announcement bar */}
        <section className="card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Announcement bar
          </h2>
          <TextInput
            label="Main text"
            hint="Shown in the green banner across the top"
            value={form.announcementText}
            onChange={(e) => set('announcementText', e.target.value)}
          />
          <TextInput
            label="Secondary label"
            hint='e.g. "Register today at"'
            value={form.announcementLinkLabel}
            onChange={(e) => set('announcementLinkLabel', e.target.value)}
          />
        </section>

        {/* Hero */}
        <section className="card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Homepage — Hero
          </h2>
          <TextArea
            label="Hero caption"
            rows={2}
            value={form.heroCaption}
            onChange={(e) => set('heroCaption', e.target.value)}
          />
          <TextInput
            label="Hero image URL"
            hint="Optional. Leave blank for the default gradient."
            value={form.heroImageUrl ?? ''}
            onChange={(e) => set('heroImageUrl', e.target.value)}
          />
        </section>

        {/* Welcome */}
        <section className="card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Homepage — Welcome
          </h2>
          <TextInput
            label="Welcome heading"
            value={form.welcomeHeading}
            onChange={(e) => set('welcomeHeading', e.target.value)}
          />
          <TextArea
            label="Welcome body"
            rows={6}
            value={form.welcomeBody}
            onChange={(e) => set('welcomeBody', e.target.value)}
          />
          <TextInput
            label="Welcome image URL"
            value={form.welcomeImageUrl ?? ''}
            onChange={(e) => set('welcomeImageUrl', e.target.value)}
          />
          <TextInput
            label="Campus image URL"
            hint="Shown on the About page campus card."
            value={form.campusImageUrl ?? ''}
            onChange={(e) => set('campusImageUrl', e.target.value)}
          />
        </section>

        {/* Principal */}
        <section className="card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Principal
          </h2>
          <TextInput
            label="Name"
            value={form.principalName}
            onChange={(e) => set('principalName', e.target.value)}
          />
          <TextInput
            label="Title"
            value={form.principalTitle}
            onChange={(e) => set('principalTitle', e.target.value)}
          />
          <TextArea
            label="Message"
            rows={4}
            value={form.principalMessage}
            onChange={(e) => set('principalMessage', e.target.value)}
          />
          <TextInput
            label="Photo URL"
            value={form.principalImageUrl ?? ''}
            onChange={(e) => set('principalImageUrl', e.target.value)}
          />
        </section>

        {/* Virtual tour */}
        <section className="card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Virtual tour
          </h2>
          <TextInput
            label="Heading"
            value={form.tourHeading}
            onChange={(e) => set('tourHeading', e.target.value)}
          />
          <TextArea
            label="Body"
            rows={3}
            value={form.tourBody}
            onChange={(e) => set('tourBody', e.target.value)}
          />
          <TextInput
            label="Link"
            value={form.tourLink}
            onChange={(e) => set('tourLink', e.target.value)}
          />
        </section>

        <section className="card space-y-4 p-6 lg:col-span-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Assistant suggestions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Edit the quick-reply suggestions shown for each topic. Enter one
              suggestion per line.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                ['welcome', 'Welcome'],
                ['admissions', 'Admissions'],
                ['programs', 'Programmes'],
                ['fees', 'Fees'],
                ['news', 'News'],
                ['contact', 'Contact'],
                ['campus', 'Campus and gallery'],
              ] as const
            ).map(([group, label]) => (
              <TextArea
                key={group}
                label={label}
                rows={4}
                value={(form.chatSuggestions?.[group] ?? CHAT_SUGGESTIONS[group]).join('\n')}
                onChange={(e) => updateChatSuggestions(group, e.target.value)}
              />
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Contact
          </h2>
          <TextInput
            label="Phone"
            value={form.contactPhone}
            onChange={(e) => set('contactPhone', e.target.value)}
          />
          <TextInput
            label="Fax"
            value={form.contactFax}
            onChange={(e) => set('contactFax', e.target.value)}
          />
          <TextInput
            label="Emails (comma-separated)"
            value={form.contactEmails.join(', ')}
            onChange={(e) =>
              set(
                'contactEmails',
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
          <TextArea
            label="Address"
            rows={3}
            value={form.contactAddress}
            onChange={(e) => set('contactAddress', e.target.value)}
          />
        </section>

        {/* Social */}
        <section className="card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Social links
          </h2>
          <TextInput
            label="Facebook URL"
            value={form.socialFacebook}
            onChange={(e) => set('socialFacebook', e.target.value)}
          />
          <TextInput
            label="Instagram URL"
            value={form.socialInstagram}
            onChange={(e) => set('socialInstagram', e.target.value)}
          />
          <TextInput
            label="Twitter / X URL"
            value={form.socialTwitter}
            onChange={(e) => set('socialTwitter', e.target.value)}
          />
          <TextInput
            label="YouTube URL"
            value={form.socialYoutube}
            onChange={(e) => set('socialYoutube', e.target.value)}
          />
        </section>

        {/* K-12 Programs (repeatable) */}
        <section className="card space-y-4 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              K–12 programs
            </h2>
            <button type="button" className="btn-outline" onClick={addProgram}>
              + Add program
            </button>
          </div>
          <TextInput
            label="Section heading"
            value={form.k12Heading}
            onChange={(e) => set('k12Heading', e.target.value)}
          />

          <div className="grid gap-4 md:grid-cols-2">
            {form.k12Programs.map((p, i) => (
              <div key={p.id} className="rounded-md border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-500">
                    Program #{i + 1}
                  </span>
                  <button
                    type="button"
                    className="text-xs font-medium text-school-red hover:underline"
                    onClick={() => removeProgram(p.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <TextInput
                    label="Title"
                    value={p.title}
                    onChange={(e) => updateProgram(p.id, { title: e.target.value })}
                  />
                  <TextInput
                    label="Grades"
                    value={p.grades}
                    onChange={(e) => updateProgram(p.id, { grades: e.target.value })}
                  />
                  <TextInput
                    label="Cover image URL"
                    value={p.coverUrl ?? ''}
                    onChange={(e) => updateProgram(p.id, { coverUrl: e.target.value })}
                  />
                </div>
              </div>
            ))}
            {form.k12Programs.length === 0 && (
              <p className="text-sm text-slate-500">
                No programs yet. Click "Add program" to create one.
              </p>
            )}
          </div>
        </section>

        {/* Experience @ISML gallery (repeatable) */}
        <section className="card space-y-4 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Experience @ISML
            </h2>
            <button type="button" className="btn-outline" onClick={addExperienceImage}>
              + Add image
            </button>
          </div>
          <TextInput
            label="Heading"
            hint="Use \n for line breaks"
            value={form.experienceHeading}
            onChange={(e) => set('experienceHeading', e.target.value)}
          />
          <TextArea
            label="Body"
            rows={3}
            value={form.experienceBody}
            onChange={(e) => set('experienceBody', e.target.value)}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {form.experienceImages.map((img, i) => (
              <div key={img.id} className="rounded-md border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-500">
                    Image #{i + 1}
                  </span>
                  <button
                    type="button"
                    className="text-xs font-medium text-school-red hover:underline"
                    onClick={() => removeExperienceImage(img.id)}
                  >
                    Remove
                  </button>
                </div>
                <TextInput
                  label="URL"
                  value={img.url ?? ''}
                  onChange={(e) => updateExperienceImage(img.id, { url: e.target.value })}
                />
                <div className="mt-3">
                  <TextInput
                    label="Caption"
                    value={img.caption ?? ''}
                    onChange={(e) =>
                      updateExperienceImage(img.id, { caption: e.target.value })
                    }
                  />
                </div>
              </div>
            ))}
            {form.experienceImages.length === 0 && (
              <p className="text-sm text-slate-500">No images yet.</p>
            )}
          </div>
        </section>

        <div className="flex justify-end lg:col-span-2">
          <button type="submit" className="btn-primary">
            Save settings
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all CMS data?"
        message="This will delete every page, post, media file and user, then restore the seeded demo content. Are you sure?"
        confirmLabel="Reset"
        destructive
        onConfirm={onReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
