import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Media from '@/components/common/Media';
import type { K12Program, Post } from '@/types';
import './news-showcase.css';

/**
 * Second section of the homepage — news and events, rebuilt as a scroll-driven
 * scene rather than a grid of cards.
 *
 * One scroll timeline (`useScroll` on the section) is the playhead. Everything
 * that moves reads from it, and every movement is a compositor-only transform
 * (`translate3d` / `scale` / `opacity`, via Framer's motion values) so nothing
 * triggers layout while scrubbing:
 *
 *   background  the oversized section index numeral, drifting slowest
 *   midground   the two heading lines, sliding in opposite directions
 *   foreground  the lead photograph (counter-scaling inside its frame) and the
 *               caption plate, which travels faster than the photo behind it
 *
 * This section deliberately does not use the site's rule-and-whitespace
 * system: it has its own dark canvas and `nx-` tokens in `news-showcase.css`.
 * Under `prefers-reduced-motion` the transforms are pinned to their resting
 * values and the section is simply static.
 *
 * The section grows to fit its content (`min-height`, matching the site's
 * `.snap-section` convention) rather than being locked to one screen's
 * height — a fixed-height/overflow-hidden box here would clip the news
 * list, lead story or journey strip whenever they didn't add up to exactly
 * one viewport.
 */

const CATEGORY_LABEL: Record<Post['category'], string> = {
  news: 'News',
  event: 'Event',
  announcement: 'Circular',
};

// Broadcast-style category chips — a fixed colour per desk, the way a real
// newsroom's lower-third graphics never change hue mid-bulletin.
const CATEGORY_TAG: Record<Post['category'], string> = {
  news: 'nx__tag--news',
  event: 'nx__tag--event',
  announcement: 'nx__tag--live',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const pad = (n: number) => String(n).padStart(2, '0');

// One-line descriptors for the four standard CBSE stages — the homepage's
// own copy, not from CMS data, since `K12Program` only carries a title and a
// grade range. Falls back to nothing for a stage title outside this set.
const STAGE_BLURB: Record<string, string> = {
  Foundational: 'Play-based learning that builds curiosity, language and social confidence.',
  Preparatory: 'Structured foundations in literacy, numeracy and inquiry-led learning.',
  Middle: 'Subject specialisation begins, building independence and critical thinking.',
  Senior: 'CBSE board preparation, backed by academic and career guidance.',
};

interface Props {
  posts: Post[];
  programs?: K12Program[];
  journeyHeading?: string;
}

export default function NewsShowcase({ posts, programs = [], journeyHeading }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // A touch of spring so the scrubbing has weight instead of tracking the
  // wheel's steps one-to-one.
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  // Midground — the heading lines converge on the middle of the section then
  // part again as it leaves, like a shutter.
  const lineA = useTransform(p, [0, 0.5, 1], ['-9%', '0%', '6%']);
  // Foreground — photo lags, caption leads.
  const photoY = useTransform(p, [0, 1], ['-9%', '9%']);
  const photoScale = useTransform(p, [0, 0.5, 1], [1.22, 1.08, 1.0]);
  const plateY = useTransform(p, [0, 1], [56, -56]);

  const [lead, ...rest] = posts;
  const list = rest.slice(0, 4);
  if (!lead) return null;

  const still = reduced ? { y: 0, x: 0, scale: 1 } : undefined;

  return (
    <section ref={ref} data-dark-ground className="snap-section nx" aria-labelledby="nx-title">
      {/* News grid, plus the K-12 journey strip below it — both flow
          naturally (min-height, not a fixed height), so long titles/lists
          grow the section instead of getting clipped. */}
      <div className="nx__viewport">
        {/* Backdrop marquee — an oversized word running behind everything,
            decorative only (aria-hidden), decoupled from the scroll
            timeline like the headline ticker in front of it. */}
        <div className="nx__marquee" aria-hidden="true">
          <div className="nx__marquee-track">
            {[0, 1].map((rep) => (
              <div className="nx__marquee-set" key={rep}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <span className="nx__marquee-item" key={i}>
                    News
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Breaking-news ticker — a real, always-running marquee (not tied to
            the scroll timeline), sat at the top of the section. */}
        <div className="nx__ticker" role="marquee" aria-label="Latest headlines">
          <span className="nx__ticker-flag">Latest</span>
          <div className="nx__ticker-track">
            {[0, 1].map((rep) => (
              <div className="nx__ticker-set" aria-hidden={rep === 1} key={rep}>
                {posts.slice(0, 8).map((post) => (
                  <Link
                    key={`${rep}-${post.id}`}
                    to={`/news/${post.slug}`}
                    tabIndex={rep === 1 ? -1 : 0}
                    className="nx__ticker-item"
                  >
                    <i />
                    {CATEGORY_LABEL[post.category]}
                    <b>{post.title}</b>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="nx__inner">
          {/* ----------------------------------------------------- left column */}
          <div className="nx__col">
            <p className="rule-label rule-label--brand">Campus journal</p>

            <h2 id="nx-title" className="nx__title">
              <motion.span style={reduced ? still : { x: lineA }} className="nx__line-in">
                News
              </motion.span>
            </h2>

            <ol className="nx__list">
              {list.map((post, i) => (
                <motion.li
                  key={post.id}
                  initial={reduced ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={`/news/${post.slug}`} className="nx__row">
                    <span className="nx__idx">{pad(i + 2)}</span>
                    <span className="nx__row-body">
                      <span className="nx__row-title">{post.title}</span>
                      <span className="nx__row-meta">
                        <span className={`nx__tag ${CATEGORY_TAG[post.category]}`}>
                          {CATEGORY_LABEL[post.category]}
                        </span>
                        <i /> <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      </span>
                    </span>
                    <span className="nx__arrow" aria-hidden>
                      →
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ol>

            <Link to="/news" className="nx__all">
              <span>All news and circulars</span>
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* ---------------------------------------------------- lead story */}
          <Link to={`/news/${lead.slug}`} className="nx__lead" aria-label={lead.title}>
            <div className="nx__frame">
              <motion.div
                className="nx__photo"
                style={reduced ? undefined : { y: photoY, scale: photoScale }}
              >
                <Media src={lead.coverUrl} alt={lead.title} />
              </motion.div>
              <span className="nx__badge">
                <i />
                On air — Lead story
              </span>
            </div>

            <motion.div className="nx__plate" style={reduced ? undefined : { y: plateY }}>
              <p className="nx__plate-meta">
                <span className={`nx__tag ${CATEGORY_TAG[lead.category]}`}>
                  {CATEGORY_LABEL[lead.category]}
                </span>
                <i />
                <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time>
              </p>
              <h3 className="nx__plate-title">{lead.title}</h3>
              {lead.excerpt && <p className="nx__plate-excerpt">{lead.excerpt}</p>}
              <span className="nx__read">
                Read the story <span aria-hidden>→</span>
              </span>
            </motion.div>
          </Link>
        </div>

        {/* K-12 journey — folded into the same viewport-locked box as the
            news grid above, rather than running on past the fold. */}
        {programs.length > 0 && (
          <div className="nx__journey">
            <div className="nx__journey-inner">
              <div className="nx__journey-visual">
                <span className="nx__journey-tag">
                  <i /> Student life · K-12
                </span>
                {/* Minimal, flat strip — a plain continuous scroll of
                    photographs, no drag/3D interaction, in place of the
                    inside-perspective carousel used elsewhere on the site. */}
                <div
                  className="nx__journey-strip"
                  role="img"
                  aria-label={`Photographs from every stage of ${journeyHeading || 'Kindergarten to Grade 12'}.`}
                >
                  <div className="nx__journey-strip-track">
                    {[0, 1].map((rep) => (
                      <div className="nx__journey-strip-set" aria-hidden={rep === 1} key={rep}>
                        {programs.map((program) => (
                          <div className="nx__journey-strip-item" key={`${rep}-${program.id}`}>
                            <Media src={program.coverUrl} alt={program.title} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="nx__journey-head">
                <p className="rule-label">The journey</p>
                <h3 className="nx__journey-title">{journeyHeading || 'Kindergarten to Grade 12'}</h3>
                <p className="nx__journey-body">
                  Four stages, one continuous path — each building directly on the one before it, so
                  a student who joins in Kindergarten never meets a seam.
                </p>

                <ol className="nx__stages">
                  {programs.map((program, i) => (
                    <li key={program.id} className="nx__stage">
                      <span className="nx__stage-num">{pad(i + 1)}</span>
                      <span className="nx__stage-body">
                        <span className="nx__stage-title">{program.title}</span>
                        <span className="nx__stage-grades">{program.grades}</span>
                        {STAGE_BLURB[program.title] && (
                          <span className="nx__stage-desc">{STAGE_BLURB[program.title]}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>

                <Link to="/academics" className="nx__journey-link">
                  Academics in full <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
