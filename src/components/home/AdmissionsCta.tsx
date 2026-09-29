import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";

const TOUR_VIDEO = new URL("../../cideo3.mp4", import.meta.url).href;

/** Closing dark section: scrambling headline, video panel, tour link. */
export default function AdmissionsCta({
  tourHeading,
  tourBody,
  tourLink,
}: {
  tourHeading: string;
  tourBody: string;
  tourLink: string;
}) {
  const external = /^https?:\/\//.test(tourLink);

  return (
    <section
      id="admissions-cta"
      data-role-section="dark"
      className="home-section"
      aria-labelledby="cta-title"
    >
      <div className="container grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="flex flex-col justify-between gap-12 lg:col-span-7">
          <div>
            <p data-r="fade-up" className="vc-label">
              Admissions · 2026–27
            </p>
            <h2
              id="cta-title"
              data-r="scramble"
              data-chars="ISMLOMAN0123456789"
              className="mt-6 text-[clamp(2.75rem,10vw,10rem)] leading-[1.02] tracking-[-0.02em]"
            >
              Let&rsquo;s find the right next step.
            </h2>
            <p data-r="fade-up" data-delay="0.6" className="body-copy mt-6">
              Tell us your child&rsquo;s grade and the admissions team will help you understand the process.
            </p>
          </div>
          <div data-r="fade-up" data-delay="0.8" className="flex flex-wrap items-center gap-5">
            <Button as="a" to="/admissions#enquire" variant="accent">
              Enquire about admissions
            </Button>
            <Link to="/students" className="r-nav-link">
              Student resources ↗
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div data-r="image" className="r-img relative aspect-[4/5] !rounded-[0.5rem]" data-parallax="off">
            <video
              src={TOUR_VIDEO}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="font-display text-4xl uppercase leading-none text-neutral-1">
                {tourHeading || "Explore the campus"}
              </p>
              {tourBody && <p className="mt-3 text-base font-medium text-neutral-2">{tourBody}</p>}
              <div className="mt-6">
                <Button
                  as="a"
                  to={tourLink}
                  variant="on-image"
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  Take the tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
