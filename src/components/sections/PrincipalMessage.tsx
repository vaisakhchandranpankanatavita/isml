import { motion, useReducedMotion } from "framer-motion";
import Media from "@/components/common/Media";
import { Button } from "@/components/common/Button";
import { useReveal } from "@/components/motion/reveal";

interface PrincipalMessageProps {
  message: string;
  name: string;
  title: string;
  imageUrl?: string;
}

/**
 * The principal's message on the night band, written as a letter: the words
 * set in a handwritten face on a glass sheet with faint ruled lines, signed
 * with a gold stroke that draws itself in. Soft drifting light sits behind
 * it. The portrait is framed at no more than its natural width (440px) so
 * it stays sharp instead of being stretched across the viewport.
 */
export default function PrincipalMessage({
  message,
  name,
  title,
  imageUrl,
}: PrincipalMessageProps) {
  const reveal = useReveal();
  const reduce = useReducedMotion();
  if (!message || !name || !title) return null;

  return (
    <section
      id="principal"
      className="home-section home-section--night home-principal"
      aria-labelledby="principal-title"
    >
      <div className="home-aura" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="container grid items-center gap-14 lg:grid-cols-[minmax(0,46rem)_minmax(0,400px)] lg:justify-center lg:gap-24">
        <motion.div {...reveal()}>
          <p id="principal-title" className="home-eyebrow">
            <span className="home-eyebrow__index">03</span> From the Principal
          </p>

          <figure className="home-principal__letter">
            <span aria-hidden="true" className="home-principal__mark">
              “
            </span>
            <blockquote className="home-principal__quote">{message}</blockquote>
            <figcaption className="home-principal__sign">
              <span className="home-principal__signature">
                {name}
                <svg
                  viewBox="0 0 220 18"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M2 12 C 40 4, 80 16, 120 9 S 190 5, 218 11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    {...(reduce
                      ? {}
                      : {
                          initial: { pathLength: 0 },
                          whileInView: { pathLength: 1 },
                          viewport: { once: true, amount: 0.6 },
                          transition: {
                            duration: 1.4,
                            delay: 0.5,
                            ease: "easeInOut",
                          },
                        })}
                  />
                </svg>
              </span>
              <span className="home-principal__role">{title}</span>
            </figcaption>
          </figure>

          <div className="mt-10">
            <Button variant="secondary" as="a" to="/about#principal">
              Read the full message
            </Button>
          </div>
        </motion.div>

        {imageUrl && (
          <motion.figure
            className="home-principal__portrait"
            {...reveal(0.15, 28)}
          >
            <div className="home-principal__photo">
              <Media
                src={imageUrl}
                alt={`${name}, ${title}`}
                className="object-top"
              />
            </div>
          </motion.figure>
        )}
      </div>
    </section>
  );
}
