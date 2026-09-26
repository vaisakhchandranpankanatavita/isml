import { Link } from 'react-router-dom';
import PageHero from '@/components/common/PageHero';
import SectionHeading from '@/components/common/SectionHeading';
import { usePage } from '@/hooks/usePage';

/**
 * The resource index.
 *
 * Each `id` here is an anchor the main navigation already links to
 * (`/students#timetable`, `#syllabus`, `#results`, …). Those links were live
 * before the targets existed, so the ids are load-bearing — renaming one
 * silently breaks a menu item.
 */
const RESOURCES: { id: string; title: string; description: string; to: string }[] = [
  {
    id: 'timetable',
    title: 'Time table',
    description: 'Class and examination timetables for the current session.',
    to: '/p/time-table',
  },
  {
    id: 'homework',
    title: 'Home work',
    description: 'Daily and weekly assignments, posted by class teachers.',
    to: '/p/home-work',
  },
  {
    id: 'syllabus',
    title: 'Syllabus 2026 – 2027',
    description: 'Subject-wise syllabus for Kindergarten through Grade 12.',
    to: '/p/syllabus-2026-2027',
  },
  {
    id: 'downloads',
    title: 'Downloads and useful links',
    description: 'Forms, circulars and the portals students are asked to use.',
    to: '/p/useful-links',
  },
  {
    id: 'results',
    title: 'CBSE results',
    description: 'Board results as published by the Central Board of Secondary Education.',
    to: '/p/results',
  },
  {
    id: 'question-bank',
    title: 'Question bank',
    description: 'Past papers and practice questions by subject and grade.',
    to: '/p/question-bank',
  },
  {
    id: 'vle',
    title: 'VLE portal',
    description: 'The virtual learning environment used for coursework.',
    to: '/p/vle-portal',
  },
  {
    id: 'events',
    title: 'Upcoming events and activities',
    description: 'What is scheduled across the school this term.',
    to: '/p/upcoming-events',
  },
];

export default function Students() {
  const page = usePage('students');

  return (
    <>
      <PageHero
        title={page?.title ?? 'Students resources'}
        subtitle="Timetables, syllabus, homework and results for the current session."
      />

      {page?.content && (
        <section className="section">
          <div className="container">
            <div className="cms-prose">{page.content}</div>
          </div>
        </section>
      )}

      <section className="section-lg">
        <div className="container">
          <SectionHeading title="Open a resource" ruled />

          {/* A list with rules rather than a grid of cards: these are index
              entries, and an index is read down. */}
          <ul className="divide-y divide-paper-line border-b border-paper-line">
            {RESOURCES.map((r) => (
              <li key={r.id} id={r.id} className="scroll-mt-32">
                <Link
                  to={r.to}
                  data-cursor-magnetic={r.id === 'timetable' || r.id === 'results' ? true : undefined}
                  className="group grid gap-1 py-6 transition-colors hover:bg-paper-sunk/70 md:grid-cols-[22rem_1fr] md:gap-8"
                >
                  <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-brand-700">
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{r.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
