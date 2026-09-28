import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useReveal } from "@/components/motion/reveal";

const STATS = [
  { value: "1981", label: "Founded" },
  { value: "Nearly 2,200", label: "Students" },
  { value: "56", label: "Sections" },
  { value: "16 acres", label: "Campus in Al Muladha" },
];

const YEARS_AT_ISML = new Date().getFullYear() - 1981;

const STORY_IMAGE = {
  src: `${import.meta.env.BASE_URL}home/campus-community.png`,
  alt: "Students in uniform walk across the ISML campus in front of the main school building.",
};

export default function OurStory() {
  const reveal = useReveal();

  return (
    <section
      className="home-section our-story"
      aria-labelledby="our-story-title"
    >
      <div className="container">
        <div className="our-story__main">
          <div className="our-story__content">
            <motion.div {...reveal()}>
              <p className="home-eyebrow">
                <span className="home-eyebrow__index">01</span> Our story
              </p>
              <h2
                id="our-story-title"
                className="home-title home-title--stacked our-story__title"
              >
                <span>Rooted in Oman.</span>
                <span className="home-accent">Ready for what’s next.</span>
              </h2>
            </motion.div>

            <motion.div className="our-story__copy" {...reveal(0.12)}>
              <p className="home-lead">
                Since 1981, Indian School Muladha has helped generations of
                children learn, grow and find their next step.
              </p>
              <p className="home-body">
                What began with 9 teachers and 90 students is now an
                English-medium, co-educational CBSE school for Pre-KG through
                Grade 12, set on a 16-acre campus in Al Muladha.
              </p>
              <div className="our-story__action">
                <Link to="/about" className="our-story__btn">
                  <span>Discover our school</span>
                  <span className="our-story__btn-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="our-story__collage">
            <motion.figure className="our-story__photo" {...reveal(0.1, 24)}>
              <img src={STORY_IMAGE.src} alt={STORY_IMAGE.alt} loading="lazy" />
              <figcaption className="our-story__caption">
                <span className="our-story__caption-name">
                  Indian School Muladha
                </span>
                <span className="our-story__caption-loc">
                  Al Muladha · Oman
                </span>
              </figcaption>
            </motion.figure>
            <div
              className="our-story__seal"
              aria-label={`${YEARS_AT_ISML} years of learning at ISML`}
            >
              <span className="our-story__seal-years">{YEARS_AT_ISML}</span>
              <span className="our-story__seal-label">years</span>
              <span className="our-story__seal-since">Since 1981</span>
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
              <dd className="home-stats__value">{stat.value}</dd>
              <dt className="home-stats__label">{stat.label}</dt>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
