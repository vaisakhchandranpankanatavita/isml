import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useReveal } from "@/components/motion/reveal";

const STATS: { value: number; label: string }[] = [
  { value: 1981, label: "Serving families in Oman since" },
  { value: 2200, label: "Students learning with us today" },
  { value: 56, label: "Sections, Pre-KG to Grade 12" },
  { value: 16, label: "Acres of campus in Al Muladha" },
];

const YEARS = new Date().getFullYear() - 1981;

const photo = (name: string) => `${import.meta.env.BASE_URL}home/${name}.jpg`;

const COLLAGE = [
  { src: photo("sports-march"), alt: "Students marching on sports day" },
  { src: photo("onam"), alt: "Students performing at the Onam celebration" },
  { src: photo("kg-park"), alt: "Opening of the kindergarten park" },
];

function formatStat(n: number, isYear: boolean) {
  return isYear ? String(Math.round(n)) : Math.round(n).toLocaleString("en-US");
}

/** Counts up to `value` the first time it scrolls into view. Years are
 *  printed without a thousands separator, everything else with one. */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const isYear = value > 1900 && value < 2100;

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduce) return;
    const controls = animate(isYear ? value - 45 : 0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => {
        node.textContent = formatStat(n, isYear);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, isYear]);

  return <span ref={ref}>{formatStat(value, isYear)}</span>;
}

export default function OurStory() {
  const reveal = useReveal();

  return (
    <section
      className="home-section our-story"
      aria-labelledby="our-story-title"
    >
      <div className="container">
        <div className="our-story__main">
          <div>
            <motion.div {...reveal()}>
              <p className="home-eyebrow">
                <span className="home-eyebrow__index">01</span> Our story
              </p>
              <h2
                id="our-story-title"
                className="home-title home-title--stacked our-story__title"
              >
                <span>A beginning</span>
                <span>that keeps</span>
                <span className="home-accent">becoming.</span>
              </h2>
            </motion.div>

            <motion.div className="our-story__copy" {...reveal(0.12)}>
              <p className="home-lead">
                From a beginning with 9 teachers and 90 students, ISML has grown
                into one of the largest schools outside Muscat&apos;s capital
                area.
              </p>
              <p className="home-body">
                Indian Schools in Oman, established by the Board of Directors,
                aim primarily to educate the students of the Indian community
                residing within the Sultanate of Oman, as non-political,
                secular, non-profit-making, self-sustaining institutions.
              </p>
              <p className="home-body">
                Today, students from Pre-KG to Grade 12 learn in a school shaped
                by care, ambition and belonging (Affiliation No. 6130007, School
                Code 90170). We are grateful to His Majesty Sultan Haitham bin
                Tarik and the Government of Oman for the support that made this
                growth possible.
              </p>
              <Link to="/about" className="home-link">
                The story of ISML <span aria-hidden="true">↗</span>
              </Link>
            </motion.div>
          </div>

          <div className="our-story__collage">
            {COLLAGE.map((image, index) => (
              <motion.figure
                key={image.src}
                className="our-story__photo"
                {...reveal(0.1 + index * 0.12, 24)}
              >
                <img src={image.src} alt={image.alt} loading="lazy" />
              </motion.figure>
            ))}
            <div className="our-story__seal" aria-hidden="true">
              <svg viewBox="0 0 120 120">
                <defs>
                  <path
                    id="our-story-seal-path"
                    d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"
                  />
                </defs>
                <text>
                  <textPath href="#our-story-seal-path">
                    Indian School Muladha · Since 1981 ·
                  </textPath>
                </text>
              </svg>
              <span>
                {YEARS}
                <small>years</small>
              </span>
            </div>
          </div>
        </div>

        <dl className="home-stats">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="home-stats__item"
              {...reveal(0.08 * index, 12)}
            >
              <dt className="home-stats__label">{stat.label}</dt>
              <dd className="home-stats__value">
                <CountUp value={stat.value} />
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
