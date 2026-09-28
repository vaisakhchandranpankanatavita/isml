import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useReveal } from "@/components/motion/reveal";
import Media from "@/components/common/Media";
import type { K12Program } from "@/types";

export const STAGE_DESCRIPTIONS: Record<string, string> = {
  foundational: "A confident first step, built on wonder.",
  preparatory: "Growing ideas, skills and independence.",
  middle: "Finding new interests. Asking bigger questions.",
  senior: "Preparing for the path that comes next.",
};

export default function ProgramGrid({ programs }: { programs: K12Program[] }) {
  const reveal = useReveal();
  if (programs.length === 0) return null;

  return (
    <section
      className="home-section home-section--alt k12-journey"
      aria-labelledby="k12-journey-title"
    >
      <div className="container">
        <div className="home-head">
          <motion.div {...reveal()}>
            <p className="home-eyebrow">
              <span className="home-eyebrow__index">02</span> The learning
              journey
            </p>
            <h2
              id="k12-journey-title"
              className="home-title home-title--stacked"
            >
              <span>Room to grow.</span>
              <span className="home-accent">Every step.</span>
            </h2>
          </motion.div>
          <motion.div className="home-head__aside" {...reveal(0.12)}>
            <p className="home-body">
              Every age brings a new way of seeing the world. We meet each stage
              with the right mix of challenge, care and discovery.
            </p>
            <Link to="/academics" className="home-link">
              Explore academics <span aria-hidden="true">↗</span>
            </Link>
          </motion.div>
        </div>

        <ol className="k12-journey__list">
          {programs.map((program, index) => {
            const description =
              STAGE_DESCRIPTIONS[program.title.trim().toLowerCase()] ??
              "A strong foundation for the next stage of learning.";

            return (
              <motion.li
                key={program.id}
                className="k12-journey__item"
                {...reveal(Math.min(index, 5) * 0.08, 12)}
              >
                <Link
                  to="/academics"
                  className="k12-journey__row"
                  aria-label={`${program.title}, ${program.grades}. ${description}`}
                >
                  <span className="k12-journey__cover" aria-hidden="true">
                    <Media src={program.coverUrl} alt="" />
                    <span className="k12-journey__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="k12-journey__stage">{program.title}</span>
                  <span className="k12-journey__grades">{program.grades}</span>
                  <span className="k12-journey__description">
                    {description}
                  </span>
                  <span className="k12-journey__arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
