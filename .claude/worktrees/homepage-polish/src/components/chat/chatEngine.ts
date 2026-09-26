import type { Post, SiteSettings } from '@/types';

/**
 * The assistant's brain. There is no backend, so this is a deliberate,
 * transparent rule engine: keyword intents over the site's own data
 * (settings + published posts) and the admissions facts the school publishes.
 * It never invents facts — anything it can't ground in that data is routed to
 * the school office rather than guessed.
 */

export interface ChatLink {
  label: string;
  to?: string; // in-app route
  href?: string; // external / tel: / mailto:
}

export interface BotReply {
  text: string;
  links?: ChatLink[];
  chips?: string[];
}

interface Ctx {
  settings: SiteSettings;
  posts: Post[];
}

export const WELCOME_CHIPS = [
  'Admissions',
  'Programmes',
  'Latest news',
  'Fees',
  'Contact',
  'Campus tour',
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s@.-]/g, ' ');

interface Intent {
  id: string;
  /** Whole-word / stem patterns; each distinct hit adds to the score. */
  keys: RegExp[];
  answer: (c: Ctx) => BotReply;
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const contactLinks = (s: SiteSettings): ChatLink[] => {
  const out: ChatLink[] = [{ label: 'Contact page', to: '/contact' }];
  if (s.contactPhone)
    out.push({
      label: `Call ${s.contactPhone}`,
      href: `tel:${s.contactPhone.replace(/\s+/g, '')}`,
    });
  return out;
};

const INTENTS: Intent[] = [
  {
    id: 'greet',
    keys: [/\b(hi|hello|hey|hola|salam|namaste|greetings|morning|afternoon|evening)\b/],
    answer: () => ({
      text: 'Hello! I can help with admissions, programmes, fees, news and getting in touch. What would you like to know?',
      chips: WELCOME_CHIPS,
    }),
  },
  {
    id: 'thanks',
    keys: [/\b(thanks|thank|thx|cheers|great|awesome|perfect)\b/],
    answer: () => ({
      text: "You're welcome! Anything else I can help you find?",
      chips: ['Admissions', 'Latest news', 'Contact'],
    }),
  },
  {
    id: 'docs',
    keys: [/\b(documents?|papers?|certificates?|passport|visa|required|requirements?|checklist)\b/],
    answer: () => ({
      text:
        'For admission, please have these ready:\n' +
        '• Completed application form\n' +
        "• Child's birth certificate\n" +
        '• Previous school records\n' +
        '• Transfer certificate (if applicable)\n' +
        '• Passport & visa copies\n' +
        '• Passport-size photographs',
      links: [{ label: 'Admissions page', to: '/admissions' }],
      chips: ['Admission process', 'Fees'],
    }),
  },
  {
    id: 'fees',
    keys: [/\b(fees?|tuition|cost|price|charges?|payment|pay|concession|scholarship)\b/],
    answer: ({ settings }) => ({
      text:
        'The fee structure is revised every academic year and covers the admission fee, termly tuition, examination fee and other applicable levies. ' +
        "I don't have the current figures, so the accounts office is the place to confirm them (and any concessions).",
      links: [
        { label: 'Email accounts', href: 'mailto:accounts@isml-oman.com' },
        ...contactLinks(settings).slice(0, 1),
      ],
      chips: ['Admission process', 'Contact'],
    }),
  },
  {
    id: 'admissions',
    keys: [
      /\b(admissions?|admit|apply|application|enrol+|enroll+|join|joining|seats?|register|registration|enquir\w*|inquir\w*|2026|prospectus)\b/,
    ],
    answer: ({ settings }) => ({
      text:
        'Admissions for 2026–27 are open for Pre-KG through Grade 12, subject to seat availability.\n\n' +
        '1. Enquire — send the enquiry form or email us for the prospectus\n' +
        '2. Documents — submit the application and records\n' +
        '3. Interaction — meet the admissions team / grade coordinator\n' +
        '4. Offer — issued subject to seats\n' +
        '5. Confirm — pay the fees to secure the place',
      links: [
        { label: 'Admissions page', to: '/admissions' },
        { label: `Email ${settings.admissionEmail}`, href: `mailto:${settings.admissionEmail}` },
      ],
      chips: ['Documents needed', 'Fees', 'Campus tour'],
    }),
  },
  {
    id: 'programs',
    keys: [
      /\b(programs?|programmes?|academics?|grades?|class(es)?|kg|kindergarten|pre-?kg|primary|secondary|curriculum|cbse|subjects?|stages?|syllabus|k-?12|senior|junior)\b/,
    ],
    answer: ({ settings }) => {
      const list = settings.k12Programs.map((p) => `• ${p.title} — ${p.grades}`).join('\n');
      return {
        text:
          `We follow one continuous CBSE curriculum from Kindergarten to Grade 12, so a child never meets a seam between stages.` +
          (list ? `\n\n${list}` : ''),
        links: [{ label: 'Academics in full', to: '/academics' }],
        chips: ['Admissions', 'Student resources'],
      };
    },
  },
  {
    id: 'news',
    keys: [
      /\b(news|events?|circulars?|announcements?|latest|updates?|holiday|reopening|sports|festival|results?)\b/,
    ],
    answer: ({ posts }) => {
      const top = posts.slice(0, 3);
      if (!top.length)
        return {
          text: 'There are no published stories right now — check back soon.',
          links: [{ label: 'News page', to: '/news' }],
        };
      return {
        text:
          'Here is what is new at the school:\n' +
          top.map((p) => `• ${p.title} (${fmtDate(p.publishedAt)})`).join('\n'),
        links: [
          ...top.map((p) => ({ label: p.title, to: `/news/${p.slug}` })),
          { label: 'All news and circulars', to: '/news' },
        ],
        chips: ['Admissions', 'Photo gallery'],
      };
    },
  },
  {
    id: 'contact',
    keys: [
      /\b(contact|phone|call|number|email|mail|address|location|where|reach|directions?|map|fax|office)\b/,
    ],
    answer: ({ settings }) => {
      const lines = [
        settings.contactPhone && `📞 ${settings.contactPhone}`,
        settings.contactEmails.length > 0 && `✉️ ${settings.contactEmails.join(', ')}`,
        settings.contactAddress && `📍 ${settings.contactAddress}`,
      ].filter(Boolean);
      return {
        text: lines.length
          ? `Here's how to reach the school:\n${lines.join('\n')}`
          : 'You can reach the school office through the contact page.',
        links: contactLinks(settings),
        chips: ['Admissions', 'Campus tour'],
      };
    },
  },
  {
    id: 'hours',
    keys: [/\b(timings?|hours|open|opening|closing|schedule|when|working|days?)\b/],
    answer: ({ settings }) => ({
      text: "I don't have the published school-hour timetable, so I'd rather not guess. The school office can confirm timings and visiting hours.",
      links: contactLinks(settings),
      chips: ['Contact', 'Campus tour'],
    }),
  },
  {
    id: 'about',
    keys: [
      /\b(about|history|founded|established|since|1981|campus|acres?|size|students?|enrol\w*ment|strength|muladha|isml)\b/,
    ],
    answer: ({ settings }) => ({
      text: `${settings.siteName} was founded in 1981 in Al Muladha. Today it is home to about 2,200 students across sixteen acres of campus, on one continuous CBSE curriculum from KG to Grade 12.`,
      links: [{ label: 'About the school', to: '/about' }],
      chips: ['Principal', 'Photo gallery', 'Campus tour'],
    }),
  },
  {
    id: 'principal',
    keys: [/\b(principal|head|headmaster|headmistress|leadership|message)\b/],
    answer: ({ settings }) => ({
      text: `${settings.principalName}, ${settings.principalTitle}, leads the school.\n\n"${settings.principalMessage.length > 220 ? settings.principalMessage.slice(0, 217) + '…' : settings.principalMessage}"`,
      links: [{ label: 'Read the full message', to: '/about#principal' }],
      chips: ['About the school'],
    }),
  },
  {
    id: 'gallery',
    keys: [/\b(photos?|gallery|pictures?|images?|videos?|life|activities)\b/],
    answer: () => ({
      text: 'The photo gallery has the campus and school life — you can also browse the 3D film strip on the home page.',
      links: [{ label: 'Full photo gallery', to: '/gallery' }],
      chips: ['Campus tour', 'Latest news'],
    }),
  },
  {
    id: 'tour',
    keys: [/\b(tour|visit|walk|virtual|see|show)\b/],
    answer: ({ settings }) => {
      const external = /^https?:\/\//.test(settings.tourLink);
      return {
        text:
          settings.tourBody ||
          'You can explore the campus with a virtual tour, or book a guided visit through the admissions office.',
        links: [
          ...(external ? [{ label: 'Walk the campus', href: settings.tourLink }] : []),
          { label: 'Book a visit', to: '/contact' },
        ],
        chips: ['Admissions', 'Contact'],
      };
    },
  },
  {
    id: 'students',
    keys: [/\b(timetable|time-table|homework|resources?|portal|student)\b/],
    answer: () => ({
      text: 'The students area has the timetable, syllabus, homework and CBSE results for the current session in one place.',
      links: [{ label: 'Open student resources', to: '/students' }],
      chips: ['Programmes', 'Latest news'],
    }),
  },
  {
    id: 'alumni',
    keys: [/\b(alumni|alumnus|alumna|old\s?students?|graduates?)\b/],
    answer: () => ({
      text: 'Our alumni community keeps in touch through the alumni page.',
      links: [{ label: 'Alumni', to: '/alumni' }],
    }),
  },
  {
    id: 'human',
    keys: [
      /\b(human|person|staff|agent|representative|someone|talk|speak|complaint|grievance|help)\b/,
    ],
    answer: ({ settings }) => ({
      text: 'Of course — the school office is the best route for anything personal or specific. They will get back to you.',
      links: contactLinks(settings),
      chips: ['Admissions', 'Fees'],
    }),
  },
];

const ALIASES: Record<string, string> = {
  'admission process': 'admissions',
  'documents needed': 'documents required',
  'about the school': 'about',
  'student resources': 'student resources',
  'photo gallery': 'photo gallery',
  'campus tour': 'virtual tour',
};

export function reply(input: string, ctx: Ctx): BotReply {
  const q = norm(ALIASES[input.trim().toLowerCase()] ?? input);
  let best: { intent: Intent; score: number } | null = null;
  for (const intent of INTENTS) {
    let score = 0;
    for (const k of intent.keys) {
      const m = q.match(new RegExp(k.source, 'g'));
      if (m) score += m.length;
    }
    // Specific intents beat the chatty ones when they tie.
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }
  if (best) return best.intent.answer(ctx);

  return {
    text: "I'm not sure I have that one — I'd rather not guess. Try one of these, or ask the school office directly.",
    links: contactLinks(ctx.settings),
    chips: WELCOME_CHIPS.slice(0, 4),
  };
}
