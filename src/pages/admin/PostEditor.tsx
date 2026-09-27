import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Select, TextArea, TextInput } from "@/components/admin/FormFields";
import { postsService } from "@/services/cms.service";
import { mediaService } from "@/services/cms.service";
import { slugify } from "@/services/storage";
import type { PostCategory } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { push } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>("news");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [author, setAuthor] = useState("");
  const [publishedAt, setPublishedAt] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) {
      setAuthor(user?.name ?? "");
      return;
    }
    const post = postsService.get(id);
    if (!post) {
      setNotFound(true);
      return;
    }
    setTitle(post.title);
    setSlug(post.slug);
    setSlugTouched(true);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCategory(post.category);
    setStatus(post.status);
    setAuthor(post.author);
    setPublishedAt(post.publishedAt.slice(0, 10));
    setCoverUrl(post.coverUrl);
  }, [id, user]);

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
      const payload = {
        title,
        slug,
        excerpt,
        content,
        category,
        status,
        author,
        coverUrl,
        publishedAt: new Date(publishedAt).toISOString(),
      };
      if (isEdit && id) {
        postsService.update(id, payload);
        push("success", "Post updated.");
      } else {
        const created = postsService.create(payload);
        push("success", `Post "${created.title}" created.`);
      }
      navigate("/admin/posts");
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
        <AdminPageHeader title="Post not found" />
        <Link to="/admin/posts" className="btn-outline">
          Back to posts
        </Link>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? "Edit post" : "New post"}
        breadcrumbs={[
          { label: "News & Posts", to: "/admin/posts" },
          { label: isEdit ? "Edit" : "New" },
        ]}
      />

      <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="card space-y-5 p-6">
          <TextInput
            label="Title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="Post title"
          />
          <TextInput
            label="Slug"
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
            required
            placeholder="post-slug"
          />
          <TextArea
            label="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder="A short summary shown in listings."
          />
          <TextArea
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={12}
            placeholder="Write the full story…"
          />
        </div>

        <div className="space-y-6">
          <div className="card space-y-4 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Publishing
            </h3>
            <Select
              label="Status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "draft" | "published")
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
            >
              <option value="news">News</option>
              <option value="event">Event</option>
              <option value="announcement">Circular / Announcement</option>
            </Select>
            <TextInput
              label="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <TextInput
              label="Publish date"
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              required
            />
          </div>

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

          <div className="flex justify-end gap-2">
            <Link to="/admin/posts" className="btn-outline">
              Cancel
            </Link>
            <button type="submit" className="btn-primary">
              {isEdit ? "Save changes" : "Create post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
