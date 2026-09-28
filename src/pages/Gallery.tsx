import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { AnimatePresence, LayoutGroup, motion, MotionConfig, type Variants } from "framer-motion";
import PageHero from "@/components/common/PageHero";
import Media from "@/components/common/Media";
import { usePage } from "@/hooks/usePage";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { mediaService, postsService } from "@/services/cms.service";
import { storage } from "@/services/storage";
import "./gallery.css";

interface Photo {
  id: string;
  url: string;
  caption: string;
  /** Uploaded videos share the grid and viewer with photos. */
  video?: boolean;
}

interface Album {
  id: string;
  title: string;
  photos: Photo[];
}

/**
 * Albums are assembled from images the CMS already manages, so editors never
 * maintain a second copy: campus photos (Settings → Experience @ISML), stage
 * covers (Settings → K–12 programs), news and event covers, and any image
 * or video uploaded to the Media library. Empty albums are dropped.
 */
function useAlbums(): Album[] {
  const { settings } = useSiteSettings();
  const [version, setVersion] = useState(0);
  useEffect(() => storage.subscribe(() => setVersion((v) => v + 1)), []);

  return useMemo(() => {
    const albums: Album[] = [
      {
        id: "campus",
        title: "Campus life",
        photos: settings.experienceImages
          .filter((img) => img.url)
          .map((img) => ({ id: img.id, url: img.url!, caption: img.caption ?? "" })),
      },
      {
        id: "events",
        title: "News & events",
        photos: postsService
          .listPublished()
          .filter((p) => p.coverUrl)
          .map((p) => ({ id: p.id, url: p.coverUrl!, caption: p.title })),
      },
      {
        id: "academics",
        title: "Academics",
        photos: settings.k12Programs
          .filter((p) => p.coverUrl)
          .map((p) => ({ id: p.id, url: p.coverUrl!, caption: `${p.title} · ${p.grades}` })),
      },
      {
        id: "uploads",
        title: "Uploads",
        photos: mediaService
          .list()
          .filter((m) => m.type === "image")
          .map((m) => ({ id: m.id, url: m.url, caption: m.name })),
      },
      {
        id: "videos",
        title: "Videos",
        photos: mediaService
          .list()
          .filter((m) => m.type === "video")
          .map((m) => ({ id: m.id, url: m.url, caption: m.name, video: true })),
      },
    ];
    return albums.filter((a) => a.photos.length > 0);
    // `version` re-reads posts and media when the CMS store changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, version]);
}

/** "All" lists each item once, even if it appears in two albums. */
function allPhotos(albums: Album[]): Photo[] {
  const seen = new Set<string>();
  return albums
    .flatMap((a) => a.photos)
    .filter((p) => (seen.has(p.url) ? false : (seen.add(p.url), true)));
}

/** "12 photos · 2 videos" — only the kinds the list actually holds. */
function countLabel(items: Photo[]): string {
  const videos = items.filter((p) => p.video).length;
  const photos = items.length - videos;
  const part = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  if (!videos) return part(photos, "photo");
  if (!photos) return part(videos, "video");
  return `${part(photos, "photo")} · ${part(videos, "video")}`;
}

const EASE = [0.2, 0.8, 0.2, 1] as const;

/** A tile's image, or a video's first frame. The parent owns shape and overflow. */
function Thumb({ item, className }: { item: Photo; className?: string }) {
  if (!item.video) return <Media src={item.url} alt="" className={className} />;
  return (
    <video
      src={`${item.url}#t=0.1`}
      muted
      playsInline
      preload="metadata"
      className={clsx("h-full w-full object-cover", className)}
    />
  );
}

/**
 * Two rows of thumbnails drifting in opposite directions — a film-reel
 * teaser above the albums. Purely decorative; the grid below is the
 * accessible way in.
 */
function Showreel({ items }: { items: Photo[] }) {
  const rows = [items, [...items].reverse()];
  return (
    <div aria-hidden className="space-y-3" data-parallax="off">
      {rows.map((row, r) => (
        <div key={r} className="gallery-reel">
          <div
            className={clsx("gallery-reel__track", r === 1 && "gallery-reel__track--reverse")}
            style={{ ["--reel-duration" as string]: `${Math.max(30, row.length * 6)}s` }}
          >
            {[...row, ...row].map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className="gallery-reel__item"
                style={{ aspectRatio: (i + r) % 3 === 0 ? "4 / 3" : "1 / 1" }}
              >
                <Thumb item={item} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Bento rhythm: every seventh tile is large, with a tall and a wide one between. */
function spanFor(i: number): string {
  switch (i % 7) {
    case 0:
      return "col-span-2 row-span-2";
    case 3:
      return "row-span-2";
    case 5:
      return "col-span-2";
    default:
      return "";
  }
}

/** Tilts a tile toward the pointer through CSS variables; no re-render. */
function tilt(e: PointerEvent<HTMLButtonElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--rx", `${x * 8}deg`);
  el.style.setProperty("--ry", `${-y * 8}deg`);
}

function untilt(e: PointerEvent<HTMLButtonElement>) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}

const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 80, scale: 0.96 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -80, scale: 0.96 }),
};

function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];
  const count = photos.length;
  const [dir, setDir] = useState(1);
  const go = (step: number) => {
    setDir(step);
    onIndex((index + step + count) % count);
  };
  const stripRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (count > 1 && e.key === "ArrowLeft") go(-1);
      if (count > 1 && e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Keep the active thumbnail in view as the item changes.
  useEffect(() => {
    stripRef.current
      ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  // Portalled to <body> so it sits above the fixed header and the chat
  // launcher instead of inside the page's own stacking context.
  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || "Gallery viewer"}
      className="fixed inset-0 z-[180] flex flex-col overflow-hidden bg-black/95 text-white"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {/* The current image, blurred and dimmed, tints the whole viewer. */}
      <AnimatePresence initial={false}>
        {!photo.video && (
          <motion.img
            key={photo.url}
            src={photo.url}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full scale-110 object-cover opacity-30 blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
      >
        <p className="vc-label text-sm text-white/70" aria-live="polite">
          <span className="text-white">{String(index + 1).padStart(2, "0")}</span> /{" "}
          {String(count).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close viewer"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-2xl leading-none transition hover:rotate-90 hover:bg-white/20"
        >
          ×
        </button>
      </motion.div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null || count < 2) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={photo.url}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: EASE }}
            className="flex max-h-full max-w-full items-center justify-center"
          >
            {photo.video ? (
              <video
                src={photo.url}
                controls
                autoPlay
                playsInline
                aria-label={photo.caption || "Video from the school gallery"}
                className="max-h-[calc(100vh-12rem)] max-w-full rounded-lg shadow-2xl"
              />
            ) : (
              <motion.img
                src={photo.url}
                alt={photo.caption || "Photograph from the school gallery"}
                className="max-h-[calc(100vh-12rem)] max-w-full select-none rounded-lg object-contain shadow-2xl"
                draggable={false}
                // Slow Ken Burns drift while the photo is on screen.
                initial={{ scale: 1 }}
                animate={{ scale: 1.04 }}
                transition={{ duration: 12, ease: "linear" }}
              />
            )}
          </motion.div>
        </AnimatePresence>
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous item"
              className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl leading-none backdrop-blur transition hover:-translate-x-1 hover:bg-white/25 sm:grid"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next item"
              className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl leading-none backdrop-blur transition hover:translate-x-1 hover:bg-white/25 sm:grid"
            >
              ›
            </button>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {photo.caption && (
          <motion.p
            key={photo.caption}
            className="px-4 pt-3 text-center text-sm text-white/85"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {photo.caption}
          </motion.p>
        )}
      </AnimatePresence>

      {count > 1 && (
        <motion.div
          ref={stripRef}
          className="flex gap-1.5 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:justify-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
        >
          {photos.map((p, i) => (
            <button
              key={`${p.id}-${i}`}
              type="button"
              data-index={i}
              onClick={() => {
                setDir(i > index ? 1 : -1);
                onIndex(i);
              }}
              aria-label={`Show ${p.video ? "video" : "photograph"} ${i + 1}`}
              aria-current={i === index}
              className={clsx(
                "relative h-14 w-14 shrink-0 overflow-hidden rounded-md transition duration-300 sm:h-16 sm:w-16",
                i === index
                  ? "-translate-y-1 opacity-100 ring-2 ring-white"
                  : "opacity-45 hover:-translate-y-0.5 hover:opacity-80",
              )}
            >
              <Thumb item={p} />
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>,
    document.body,
  );
}

/**
 * Photos and videos as an animated bento wall: a drifting two-row showreel,
 * album chips with a sliding highlight, tiles that rise in as they scroll into
 * view, reflow smoothly between albums and tilt toward the pointer, and a
 * full-screen viewer that slides between items. Honours reduced motion.
 */
export default function Gallery() {
  const page = usePage("gallery");
  const { settings } = useSiteSettings();
  const albums = useAlbums();
  const all = useMemo(() => allPhotos(albums), [albums]);
  const [albumId, setAlbumId] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(null);

  const active = albums.find((a) => a.id === albumId);
  const photos = active?.photos ?? all;

  // The chosen album can disappear if an editor empties it.
  useEffect(() => {
    if (albumId !== "all" && !active) setAlbumId("all");
  }, [albumId, active]);
  useEffect(() => {
    if (open !== null && open >= photos.length) setOpen(null);
  }, [open, photos.length]);

  const tabs = [{ id: "all", title: "All", photos: all }, ...albums];
  const reel = useMemo(() => all.filter((p) => !p.video).slice(0, 16), [all]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate overflow-hidden bg-paper">
        <PageHero
          title={page?.title ?? "Gallery"}
          hideTitle
          subtitle={
            settings.experienceBody || "Classrooms, fields and events across the school year."
          }
        />

        {reel.length >= 4 && (
          <motion.section
            className="pb-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          >
            <Showreel items={reel} />
          </motion.section>
        )}

        {page?.content && (
          <section className="section">
            <div className="container">
              <div className="cms-prose">{page.content}</div>
            </div>
          </section>
        )}

        {all.length === 0 ? (
          <section className="section-lg">
            <div className="container">
              <h2 className="font-display text-xl font-semibold">Nothing here yet</h2>
              <p className="body-copy mt-3">
                Photographs added in Settings and news posts, and photos or videos uploaded to the
                Media library, appear here.
              </p>
            </div>
          </section>
        ) : (
          <section className={clsx("section-lg", (page?.content || reel.length >= 4) && "!pt-0")}>
            <div className="container">
              <LayoutGroup>
                <ul
                  className="flex flex-wrap gap-2"
                  role="tablist"
                  aria-label="Gallery albums"
                  data-parallax="off"
                >
                  {tabs.map((album, i) => {
                    const selected = album.id === albumId;
                    return (
                      <motion.li
                        key={album.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
                      >
                        <button
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          onClick={() => {
                            setAlbumId(album.id);
                            setOpen(null);
                          }}
                          className={clsx(
                            "relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300",
                            selected
                              ? "border-transparent text-white"
                              : "border-paper-line text-ink hover:border-ink/40",
                          )}
                        >
                          {selected && (
                            <motion.span
                              layoutId="gallery-chip"
                              className="absolute inset-0 -z-10 rounded-full bg-school-red"
                              transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            />
                          )}
                          {album.title}
                          <span
                            className={clsx(
                              "rounded-full px-1.5 text-xs tabular-nums",
                              selected ? "bg-white/20" : "bg-paper-band text-ink-muted",
                            )}
                          >
                            {album.photos.length}
                          </span>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </LayoutGroup>

              <div className="mt-8 flex items-baseline justify-between gap-4 border-b border-paper-line pb-3">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={active?.title ?? "All"}
                    className="text-[1.5rem] sm:text-[1.75rem]"
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {active?.title ?? "All"}
                  </motion.h2>
                </AnimatePresence>
                <p className="text-sm text-ink-muted">{countLabel(photos)}</p>
              </div>

              <motion.ul
                layout
                className="mt-6 grid grid-flow-dense auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:grid-cols-3 lg:auto-rows-[12rem] lg:grid-cols-4"
                data-parallax="off"
              >
                <AnimatePresence mode="popLayout">
                  {photos.map((photo, i) => (
                    <motion.li
                      key={photo.id + photo.url}
                      layout
                      className={spanFor(i)}
                      initial={{ opacity: 0, y: 40, scale: 0.92 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                      transition={{
                        duration: 0.7,
                        delay: Math.min(i % 8, 7) * 0.05,
                        ease: EASE,
                        layout: { duration: 0.6, ease: EASE },
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpen(i)}
                        onPointerMove={tilt}
                        onPointerLeave={untilt}
                        aria-label={`Open ${photo.caption || `${photo.video ? "video" : "photograph"} ${i + 1}`}`}
                        className="gallery-tile text-left"
                      >
                        <Thumb item={photo} className="gallery-tile__media" />
                        <span aria-hidden className="gallery-tile__shade" />
                        {photo.video && (
                          <span aria-hidden className="gallery-play">
                            ▶
                          </span>
                        )}
                        {photo.caption && (
                          <span aria-hidden className="gallery-tile__caption">
                            <span className="line-clamp-2 text-sm font-semibold leading-snug">
                              {photo.caption}
                            </span>
                            <span className="gallery-tile__rule w-10" />
                          </span>
                        )}
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </div>
          </section>
        )}

        <AnimatePresence>
          {open !== null && photos[open] && (
            <Lightbox
              key="lightbox"
              photos={photos}
              index={open}
              onIndex={setOpen}
              onClose={() => setOpen(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
