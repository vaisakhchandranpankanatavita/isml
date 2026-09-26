const DEFAULT_MEDIA_SRC = '/news-placeholder.svg';

/**
 * An image that fills its container and falls back to the site's default
 * editorial image when a CMS field is empty or the URL cannot be loaded.
 *
 * The parent owns the aspect ratio and `overflow-hidden`; this component only
 * fills it. That keeps one element responsible for shape.
 */
export default function Media({
  src,
  alt = '',
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src={src || DEFAULT_MEDIA_SRC}
      alt={src ? alt : ''}
      loading="lazy"
      onError={(event) => {
        const image = event.currentTarget;
        if (image.src.endsWith(DEFAULT_MEDIA_SRC)) return;
        image.onerror = null;
        image.src = DEFAULT_MEDIA_SRC;
      }}
      className={`h-full w-full object-cover ${className ?? ''}`}
    />
  );
}
