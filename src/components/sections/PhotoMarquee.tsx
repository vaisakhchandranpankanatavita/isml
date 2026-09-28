const photo = (name: string) => `${import.meta.env.BASE_URL}home/${name}.jpg`;

const ROWS: { src: string; caption: string }[][] = [
  [
    { src: photo("annual-day"), caption: "35th Annual Day" },
    { src: photo("youth-festival"), caption: "Youth Festival" },
    { src: photo("independence-day"), caption: "Independence Day" },
    { src: photo("science-forum"), caption: "Science Forum" },
    { src: photo("foundational-fest"), caption: "Foundational Fest" },
    { src: photo("scouts"), caption: "Scouts & Guides" },
    { src: photo("sports-day"), caption: "Sports Day" },
  ],
  [
    { src: photo("onam-boat"), caption: "Onam" },
    { src: photo("foundational-dance"), caption: "Foundational Fest" },
    { src: photo("independence-parade"), caption: "Independence Day" },
    { src: photo("youth-festival-dance"), caption: "Youth Festival" },
    { src: photo("kg-park"), caption: "KG Park" },
    { src: photo("sports-march"), caption: "Sports Day" },
    { src: photo("onam"), caption: "Onam" },
  ],
];

/**
 * A compact band of school-life photos drifting in two rows, opposite
 * directions. Each row is rendered twice back to back and translated by
 * half its width, so the loop is seamless. Decorative: the photos are
 * already reachable in the gallery, so the band is hidden from assistive
 * tech. Hover pauses; reduced motion stops it (see index.css).
 */
export default function PhotoMarquee() {
  return (
    <section className="home-marquee" aria-hidden="true">
      {ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`home-marquee__row${rowIndex % 2 ? " home-marquee__row--reverse" : ""}`}
        >
          <div className="home-marquee__track">
            {[...row, ...row].map((item, index) => (
              <figure key={index} className="home-marquee__item">
                <img src={item.src} alt="" loading="lazy" />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
