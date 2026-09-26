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
      text: 'Hello! I can help you with **Admissions**, **Programmes**, **Fees**, **News**, and **Contact**. \\n\\nWhat would you like to know first?',
      chips: WELCOME_CHIPS,
    }),
  },
  {
    id: 'thanks',
    keys: [/\b(thanks|thank|thx|cheers|great|awesome|perfect)\b/],
    answer: () => ({
      text: "You're welcome! \\n\\nIs there **anything else** I can help you find today?",
      chips: ['Admissions', 'Latest news', 'Contact'],
    }),
  },
  {
    id: 'docs',
    keys: [/\b(documents?|papers?|certificates?|passport|visa|required|requirements?|checklist)\b/],
    answer: () => ({
      text:
        'To start your **Admission**, please ensure you have these documents ready: \\n\\n' +
        '- **Application:** Completed form \\n' +
        '- **Identity:** Child\'s birth certificate \\n' +
        '- **Academic:** Previous school records \\n' +
        '- **Legal:** Transfer certificate (if applicable) \\n' +
        '- **Travel:** Passport & visa copies \\n' +
        '- **Photos:** Passport-size photographs \\n\\n' +
        'Would you like to know about the **application deadline**?',
      links: [{ label: 'Admissions page', to: '/admissions' }],
      chips: ['Admission process', 'Fees'],
    }),
  },
  {
    id: 'fees',
    keys: [/\b(fees?|tuition|cost|price|charges?|payment|pay|concession|scholarship)\b/],
    answer: ({ settings }) => ({
      text:
        'Our **Fee Structure** is revised every academic year. It includes **admission fees**, **termly tuition**, and **exam levies**. \\n\\n' +
        'For current figures and **concessions**, please contact the accounts office directly. \\n\\n' +
        'Are you inquiring about a **specific grade**?',
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
        '**Admissions 2026–27** are now open for **Pre-KG through Grade 12**, subject to seat availability. \\n\\n' +
        '- **Step 1: Enquire** — Send the form or email for the prospectus \\n' +
        '- **Step 2: Documents** — Submit application and records \\n' +
        '- **Step 3: Interaction** — Meet the admissions team \\n' +
        '- **Step 4: Offer** — Issued based on availability \\n' +
        '- **Step 5: Confirm** — Pay fees to secure the place \\n\\n' +
        'What **grade** are you applying for?',
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
      const list = settings.k12Programs.map((p) => `- **${p.title}:** ${p.grades}`).join('\\n');
      return {
        text:
          `We follow a continuous **CBSE curriculum** from Kindergarten to Grade 12, ensuring a seamless academic journey.` +
          (list ? `\\n\\n${list}\\n\\nWhich **grade level** are you interested in?` : ''),
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
          text: 'There are **no published stories** right now. Please check back soon! \\n\\nWould you like to see our **Gallery** instead?',
          links: [{ label: 'News page', to: '/news' }],
        };
      return {
        text:
          'Here is the **latest news** from our school: \\n\\n' +
          top.map((p) => `- **${p.title}:** ${fmtDate(p.publishedAt)}`).join('\\n') +
          '\\n\\nWould you like to read the **full details** of any of these?',
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
        settings.contactPhone && `📞 **Phone:** ${settings.contactPhone}`,
        settings.contactEmails.length > 0 && `✉️ **Email:** ${settings.contactEmails.join(', ')}`,
        settings.contactAddress && `📍 **Address:** ${settings.contactAddress}`,
      ].filter(Boolean);
      return {
        text: lines.length
          ? `Here is how you can **reach us**: \\n\\n${lines.join('\\n')}\\n\\nDo you need **directions** to the campus?`
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
      text: "I don't have the published **school-hour timetable** available. To avoid any mistakes, the **School Office** can confirm the exact visiting hours. \\n\\nWould you like their **contact details**?",
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
      text: `**${settings.siteName}** was founded in 1981 in Al Muladha. \\n\\n- **Community:** Home to ~2,200 students \\n- **Campus:** 16 acres of facilities \\n- **Curriculum:** Continuous CBSE (KG to Grade 12) \\n\\nWould you like to see the **Photo Gallery**?`,
      links: [{ label: 'About the school', to: '/about' }],
      chips: ['Principal', 'Photo gallery', 'Campus tour'],
    }),
  },
  {
    id: 'principal',
    keys: [/\b(principal|head|headmaster|headmistress|leadership|message)\b/],
    answer: ({ settings }) => ({
      text: `${settings.principalName}, **${settings.principalTitle}**, leads the school. \\n\\n"${settings.principalMessage.length > 220 ? settings.principalMessage.slice(0, 217) + '…' : settings.principalMessage}" \\n\\nWould you like to read the **complete message**?`,
      links: [{ label: 'Read the full message', to: '/about#principal' }],
      chips: ['About the school'],
    }),
  },
  {
    id: 'gallery',
    keys: [/\b(photos?|gallery|pictures?|images?|videos?|life|activities)\b/],
    answer: () => ({
      text: 'Our **Photo Gallery** showcases campus life and student activities. You can also find the **3D film strip** on the home page. \\n\\nAre you interested in **student achievements**?',
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
          'You can explore the campus via our **Virtual Tour**, or book a **Guided Visit** through the admissions office. \\n\\nWould you like to **book a visit** now?',
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
      text: 'The **Students Area** provides everything in one place: \\n\\n- **Schedules:** Timetables \\n- **Studies:** Syllabus & Homework \\n- **Outcomes:** CBSE Results \\n\\nDo you need help accessing the **portal**?',
      links: [{ label: 'Open student resources', to: '/students' }],
      chips: ['Programmes', 'Latest news'],
    }),
  },
  {
    id: 'alumni',
    keys: [/\b(alumni|alumnus|alumna|old\s?students?|graduates?)\b/],
    answer: () => ({
      text: 'Our **Alumni Community** is a vital part of the school. You can reconnect and share updates on the **Alumni Page**. \\n\\nAre you a **former student**?',
      links: [{ label: 'Alumni', to: '/alumni' }],
    }),
  },
  {
    id: 'human',
    keys: [
      /\b(human|person|staff|agent|representative|someone|talk|speak|complaint|grievance|help)\b/,
    ],
    answer: ({ settings }) => ({
      text: 'Of course. The **School Office** is the best route for anything personal or specific. They will get back to you shortly. \\n\\nDo you have a **specific query** for the administration?',
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
    text: "I'm not sure I have that information — I'd rather not guess. \\n\\n- **Try:** One of the options below \\n- **Direct:** Ask the school office directly \\n\\nWhat **topic** are you looking for?",
    links: contactLinks(ctx.settings),
    chips: WELCOME_CHIPS.slice(0, 4),
  };
}
