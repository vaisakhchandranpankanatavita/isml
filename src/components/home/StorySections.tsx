import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import Media from "@/components/common/Media";

const STATS = [
  { value: "1981", label: "Founded" },
  { value: "2200", label: "Students" },
  { value: "56", label: "Sections" },
  { value: "16", label: "Acres of campus" },
];

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
            Since 1981, Indian School Muladha has helped generations of children learn, grow and find their next step.
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

      <dl className="home-gap grid grid-cols-2 gap-y-10 border-t border-paper-line pt-10 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <dd
              data-r="scramble"
              data-chars="0123456789"
              className="font-display text-[clamp(3.5rem,8vw,8rem)] leading-none tracking-[-0.02em]"
            >
              {stat.value}
            </dd>
            <dt data-r="fade-up" className="mt-2 text-base font-semibold text-ink-soft">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
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
