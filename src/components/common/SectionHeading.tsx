interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Draws a hairline rule beneath the heading. */
  ruled?: boolean;
}

/** Section masthead for inner pages: eyebrow, Anton heading, lead. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  ruled = false,
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-measure text-center" : ""}>
      {eyebrow && (
        <p data-r="fade-up" className="vc-label text-signal-deep">
          {eyebrow}
        </p>
      )}
      <h2
        data-r="words"
        className={[
          "t-h2 break-words",
          eyebrow ? "mt-4" : "",
          ruled ? "border-b border-paper-line pb-4" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {title}
      </h2>
      {description && (
        <p data-r="fade-up" className="body-copy mt-5">
          {description}
        </p>
      )}
    </div>
  );
}
