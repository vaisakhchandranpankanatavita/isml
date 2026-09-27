import ScaffoldedText from "@/components/motion/ScaffoldedText";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Renders a rule beneath the heading, matching the homepage sections. */
  ruled?: boolean;
}

/**
 * Section masthead for inner pages.
 *
 * `ruled` draws the underline that the homepage sections use, so a page can
 * match the landing page's structure where it has several sections, and stay
 * quieter where it has one.
 *
 * Shared by nearly every inner page, which makes it the highest-leverage
 * place to wire up the scaffolded text reveal — every `<SectionHeading>` on
 * the site now cascades into view as the reader scrolls to it, with no
 * per-page change required.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  ruled = false,
}: SectionHeadingProps) {
  return (
    <div
      className={align === "center" ? "mx-auto max-w-measure text-center" : ""}
    >
      {eyebrow && <p className="vc-label text-school-red">{eyebrow}</p>}
      <ScaffoldedText
        as="h2"
        text={title}
        by="word"
        className={[
          "text-2xl sm:text-3xl lg:text-4xl",
          eyebrow ? "mt-4" : "",
          ruled ? "border-b border-paper-line pb-6" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
      {description && <p className="body-copy mt-5">{description}</p>}
    </div>
  );
}
