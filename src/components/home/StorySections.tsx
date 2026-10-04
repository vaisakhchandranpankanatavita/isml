import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import Media from "@/components/common/Media";

const FACTS = [
  { value: "1991", label: "Founded" },
  { value: "~2,200", label: "Students" },
  { value: "56", label: "Sections" },
  { value: "16 acres", label: "Al Muladha campus" },
];

const STAGES = [
  { name: "Foundational", note: "Pre-KG to Grade 2" },
  { name: "Preparatory", note: "Grades 3 to 5" },
  { name: "Middle", note: "Grades 6 to 8" },
  { name: "Senior", note: "Grades 9 to 12" },
];

const LANDSCAPE = {
  src: `${import.meta.env.BASE_URL}home/campus-landscape.svg`,
  alt: "Illustration of the Indian School Muladha campus beneath the Hajar mountains at golden hour.",
};

const STORY_IMAGE_2 = {
  src: `${import.meta.env.BASE_URL}home/science-forum.jpg`,
  alt: "Students presenting projects at the ISML science forum.",
};

const STORY_IMAGE = {
  src: `${import.meta.env.BASE_URL}home/campus-community.png`,
  alt: "Students in uniform walk across the ISML campus in front of the main school building.",
};

/** Big-type story statement, image scale-in and a scrambling stats row. */
export function Story() {
  return (
    <section id="story" className="container home-section" aria-labelledby="story-title">
      <p data-r="fade-up" className="vc-label">
        Our story
      </p>
      <h2
        id="story-title"
        data-r="words"
        className="mt-6 max-w-[13ch] text-[clamp(2.75rem,10vw,10rem)] leading-[1.02] tracking-[-0.02em]"
      >
        Rooted in Oman. Ready for what&rsquo;s next.
      </h2>

      <div className="home-gap grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p data-r="fade-up" className="text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">
            Since 1991, Indian School Muladha has helped generations of children learn, grow and find their next step.
          </p>
          <p data-r="fade-up" data-delay="0.6" className="body-copy mt-6">
            What began with 9 teachers and 90 students is now an English-medium, co-educational CBSE school for Pre-KG
            through Grade 12, set on a 16-acre campus in Al Muladha.
          </p>
          <div data-r="fade-up" data-delay="0.8" className="mt-10">
            <Button as="a" to="/about" variant="accent">
              Discover our school
            </Button>
          </div>
          <div data-r="image" className="r-img mt-8 aspect-[16/10] !rounded-[0.5rem]" data-parallax="off">
            <img src={STORY_IMAGE_2.src} alt={STORY_IMAGE_2.alt} loading="lazy" />
          </div>
        </div>
        <figure className="lg:col-span-7">
          <div data-r="image" className="r-img aspect-[4/3] !rounded-[0.5rem]" data-parallax="off">
            <img src={STORY_IMAGE.src} alt={STORY_IMAGE.alt} loading="lazy" />
          </div>
          <figcaption data-r="fade-up" className="mt-4 flex justify-between text-sm font-semibold text-ink-soft">
            <span>Indian School Muladha</span>
            <span>Al Muladha · Oman</span>
          </figcaption>
        </figure>
      </div>

      <div data-r="image" className="r-img home-gap aspect-[16/9] sm:aspect-[21/9]" data-parallax="off">
        <img src={LANDSCAPE.src} alt={LANDSCAPE.alt} loading="lazy" />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm font-semibold text-ink-soft">
        <span>Affiliated to CBSE, India · Affiliation no. 6130007</span>
        <Link to="/admissions" className="r-nav-link">
          Admissions open for 2026–2027 ↗
        </Link>
      </div>

      <div className="home-gap overflow-hidden rounded-[0.5rem] border border-paper-line bg-paper-line">
        <dl className="grid grid-cols-2 gap-px lg:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label} data-r="fade-up" className="flex items-baseline justify-between gap-3 bg-ink px-5 py-3 text-paper">
              <dd className="font-display text-2xl leading-none md:text-3xl">{fact.value}</dd>
              <dt className="text-right text-sm font-semibold opacity-70">{fact.label}</dt>
            </div>
          ))}
        </dl>
        <ul className="mt-px grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((stage, i) => (
            <li key={stage.name} data-r="fade-up" data-delay={i * 0.1} className="bg-paper p-6">
              <p className="vc-label">Stage {i + 1}</p>
              <p className="mt-3 font-display text-3xl uppercase leading-none">{stage.name}</p>
              <p className="mt-2 text-base font-semibold text-ink-soft">{stage.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

interface PrincipalProps {
  message: string;
  name: string;
  title: string;
  imageUrl: string;
}

/** Dark section: portrait scale-in, blurred quote reveal. */
export function Principal({ message, name, title, imageUrl }: PrincipalProps) {
  return (
    <section
      id="principal"
      data-role-section="dark"
      className="home-section"
      aria-labelledby="principal-title"
    >
      <div className="container grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div data-r="image" className="r-img aspect-[4/5] !rounded-[0.5rem]" data-parallax="off">
            <Media src={imageUrl} alt={`${name}, ${title}`} />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-12 lg:col-span-7">
          <div>
            <p data-r="fade-up" className="vc-label">
              From the principal
            </p>
            <h2
              id="principal-title"
              data-r="words"
              className="mt-6 text-[clamp(2.5rem,7.5vw,7.5rem)] leading-[1] tracking-[-0.02em]"
            >
              A note on what we believe.
            </h2>
            <blockquote data-r="fade" data-delay="0.4" className="mt-7 max-w-[44ch] whitespace-pre-line text-xl font-medium leading-snug text-ink-soft md:text-2xl">
              {message}
            </blockquote>
          </div>
          <div data-r="fade-up" className="flex flex-wrap items-end justify-between gap-6 border-t border-paper-line pt-6">
            <div>
              <p className="font-display text-3xl uppercase leading-none">{name}</p>
              <p className="mt-2 text-base font-semibold text-ink-muted">{title}</p>
            </div>
            <Link to="/about#principal" className="r-nav-link">
              Read the full message ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
