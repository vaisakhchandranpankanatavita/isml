import { useId, useState, type ReactNode } from "react";
import clsx from "clsx";

interface KineticAccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * Curriculum module accordion. Three moving parts on open:
 *   1. the title's `font-weight` sweeps 400→700 in real time — smooth only
 *      if Monument Grotesk's variable file is present (see `index.css`);
 *      a static fallback just jump-cuts the weight, which is an acceptable
 *      degrade, not a broken one.
 *   2. `.kinetic-progress` scales in under it like a loading bar.
 *   3. the body reveals via a `grid-template-rows: 0fr → 1fr` transition —
 *      the CSS-only auto-height technique, so no `scrollHeight` measuring.
 */
export default function KineticAccordion({
  title,
  children,
  defaultOpen = false,
}: KineticAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-paper-line">
      <button
        type="button"
        data-cursor-magnetic
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span
          className="font-display text-xl text-ink transition-[font-weight] duration-500 md:text-2xl"
          style={{ fontWeight: open ? 700 : 400 }}
        >
          {title}
        </span>
        <span
          aria-hidden
          className={clsx(
            "shrink-0 font-display text-2xl leading-none text-ink-muted transition-transform duration-300",
            open && "rotate-45",
          )}
        >
          +
        </span>
      </button>

      <div
        className="kinetic-progress"
        style={{ transform: `scaleX(${open ? 1 : 0})` }}
      />

      <div
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div id={id} className="overflow-hidden">
          <div className="pb-6 pt-4 pr-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
