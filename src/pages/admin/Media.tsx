import { useEffect, useRef, useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { mediaService } from '@/services/cms.service';
import { storage } from '@/services/storage';
import type { MediaItem } from '@/types';
import { useToast } from '@/hooks/useToast';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaAdmin() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState<MediaItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  useEffect(() => {
    const refresh = () => setItems(mediaService.list());
    refresh();
    return storage.subscribe(refresh);
  }, []);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await mediaService.upload(file);
      }
      push('success', `Uploaded ${files.length} file(s).`);
    } catch (err) {
      push('error', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      push('success', 'URL copied to clipboard.');
    } catch {
      push('error', 'Could not copy URL.');
    }
  };

  const handleDelete = () => {
    if (!toDelete) return;
    mediaService.remove(toDelete.id);
    push('success', `Deleted "${toDelete.name}".`);
    setToDelete(null);
  };

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Upload and manage images, videos, and documents used across the site."
        actions={
          <label className="btn-primary cursor-pointer">
            {uploading ? 'Uploading…' : '+ Upload files'}
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
          </label>
        }
      />

      {items.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          <p>No media yet. Upload your first image to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item.id} className="card overflow-hidden">
              <div className="aspect-square w-full bg-slate-100">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">📄</div>
                )}
              </div>
              <div className="p-3 text-xs">
                <p className="truncate font-medium text-slate-800" title={item.name}>
                  {item.name}
                </p>
                <p className="text-slate-500">
                  {item.type} · {formatSize(item.size)}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.url)}
                    className="text-brand-700 hover:underline"
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setToDelete(item)}
                    className="text-school-red hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete file?"
        message={`This will permanently remove "${toDelete?.name}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
