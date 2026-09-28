import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useReveal } from "@/components/motion/reveal";
import type { K12Program } from "@/types";

export const STAGE_DESCRIPTIONS: Record<string, string> = {
  foundational: "A confident first step, built on wonder.",
  preparatory: "Growing ideas, skills and independence.",
  middle: "Finding new interests. Asking bigger questions.",
  senior: "Preparing for the path that comes next.",
};

export default function ProgramGrid({ programs }: { programs: K12Program[] }) {
  const reveal = useReveal();
  const reducedMotion = useReducedMotion();
  if (programs.length === 0) return null;

  return (
    <section
      className="home-section home-section--alt k12-journey"
      aria-labelledby="k12-journey-title"
    >
      <div className="container">
        <div className="k12-journey__header">
          <motion.div className="k12-journey__heading" {...reveal()}>
            <p className="home-eyebrow">
              <span className="home-eyebrow__index">02</span> The learning
              journey
            </p>
            <h2 id="k12-journey-title" className="home-title">
              Room to grow.
              <br />
              <span className="home-accent">Every step.</span>
            </h2>
          </motion.div>
          <motion.div className="k12-journey__intro" {...reveal(0.12)}>
            <p className="home-body">
              Every age brings a new way of seeing the world. We meet each stage
              with the right mix of challenge, care and discovery.
            </p>
            <Link to="/academics" className="home-link">
              Explore academics <span aria-hidden="true">↗</span>
            </Link>
          </motion.div>
        </div>

        <div
          className="k12-journey__path"
          role="group"
          aria-labelledby="k12-journey-title"
          aria-describedby="k12-journey-stages"
        >
          <video
            className="k12-journey__video"
            src={new URL("../../cideo3.mp4", import.meta.url).href}
            poster={`${import.meta.env.BASE_URL}home/learning-journey-art.png`}
            autoPlay={reducedMotion === false}
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <ol id="k12-journey-stages" className="sr-only">
            {programs.map((program) => {
              const description =
                STAGE_DESCRIPTIONS[program.title.trim().toLowerCase()] ??
                "A strong foundation for the next stage of learning.";

              return (
                <li key={program.id}>
                  {program.title}, {program.grades}. {description}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
