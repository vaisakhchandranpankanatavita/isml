import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Select, TextArea, TextInput } from "@/components/admin/FormFields";
import { mediaService, pagesService } from "@/services/cms.service";
import { slugify } from "@/services/storage";
import { useToast } from "@/hooks/useToast";

export default function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { push } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);
  const [slugTouched, setSlugTouched] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const page = pagesService.get(id);
    if (!page) {
      setNotFound(true);
      return;
    }
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content);
    setStatus(page.status);
    setCoverUrl(page.coverUrl);
    setSlugTouched(true);
  }, [id]);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const item = await mediaService.upload(file);
      setCoverUrl(item.url);
      push("success", "Cover image uploaded.");
    } catch {
      push("error", "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { title, slug, content, status, coverUrl };
      if (isEdit && id) {
        pagesService.update(id, payload);
        push("success", "Page updated.");
      } else {
        const created = pagesService.create(payload);
        push("success", `Page "${created.title}" created.`);
      }
      navigate("/admin/pages");
    } catch (err) {
      push(
        "error",
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  };

  if (notFound) {
    return (
      <div>
        <AdminPageHeader title="Page not found" />
        <Link to="/admin/pages" className="btn-outline">
          Back to pages
        </Link>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? "Edit page" : "New page"}
        breadcrumbs={[
          { label: "Pages", to: "/admin/pages" },
          { label: isEdit ? "Edit" : "New" },
        ]}
      />

      <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="card space-y-5 p-6">
          <TextInput
            label="Title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="e.g. About Us"
          />
          <TextInput
            label="Slug"
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
            required
            hint="URL segment"
            placeholder="about-us"
          />
          <TextArea
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={12}
            placeholder="Write the page content (plain text or HTML)…"
          />
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>

          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
            <Link to="/admin/pages" className="btn-outline">
              Cancel
            </Link>
            <button type="submit" className="btn-primary">
              {isEdit ? "Save changes" : "Create page"}
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card space-y-3 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Cover image
            </h3>
            {coverUrl ? (
              <img
                src={coverUrl}
                alt=""
                className="aspect-video w-full rounded-md object-cover"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-500">
                No image
              </div>
            )}
            <label className="btn-outline w-full cursor-pointer text-center">
              {uploading
                ? "Uploading…"
                : coverUrl
                  ? "Replace image"
                  : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>
            <TextInput
              label="Or paste image URL"
              value={coverUrl ?? ""}
              onChange={(e) => setCoverUrl(e.target.value || undefined)}
              placeholder="https://…"
            />
            {coverUrl && (
              <button
                type="button"
                onClick={() => setCoverUrl(undefined)}
                className="text-xs text-school-red hover:underline"
              >
                Remove image
              </button>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}
