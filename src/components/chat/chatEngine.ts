import type { ChatFaq, Post, SiteSettings } from '@/types';
import { CHAT_SUGGESTIONS } from '@/config/site';

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

export const WELCOME_CHIPS = CHAT_SUGGESTIONS.welcome;

export function getChatSuggestions(
  settings: SiteSettings,
  group: keyof typeof CHAT_SUGGESTIONS,
): string[] {
  return settings.chatSuggestions?.[group] ?? CHAT_SUGGESTIONS[group];
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s@.-]/g, ' ');

interface Intent {
  id: string;
  /** Whole-word / stem patterns; each distinct hit adds to the score. */
  keys: RegExp[];
  /**
   * Small talk (hello / thanks). Only answers when no real topic matched, so
   * "Hi, what is the admission process?" gets the admissions answer rather
   * than a second greeting.
   */
  chatty?: boolean;
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
    chatty: true,
    answer: ({ settings }) => ({
      text: 'Hello! I can help you with **Admissions**, **Programmes**, **Fees**, **News**, and **Contact**. \\n\\nWhat would you like to know first?',
      chips: getChatSuggestions(settings, 'welcome'),
    }),
  },
  {
    id: 'thanks',
    keys: [/\b(thanks|thank|thx|cheers|great|awesome|perfect|ok|okay)\b/],
    chatty: true,
    answer: ({ settings }) => ({
      text: "You're welcome! \\n\\nIs there **anything else** I can help you find today?",
      chips: getChatSuggestions(settings, 'welcome'),
    }),
  },
  {
    id: 'docs',
    keys: [/\b(documents?|papers?|certificates?|passport|visa|required|requirements?|checklist)\b/],
    answer: ({ settings }) => ({
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
      chips: getChatSuggestions(settings, 'admissions'),
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
      chips: getChatSuggestions(settings, 'fees'),
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
      chips: getChatSuggestions(settings, 'admissions'),
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
        chips: getChatSuggestions(settings, 'programs'),
      };
    },
  },
  {
    id: 'news',
    keys: [
      /\b(news|events?|circulars?|announcements?|latest|updates?|holiday|reopening|sports|festival|results?)\b/,
    ],
    answer: ({ posts, settings }) => {
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
        chips: getChatSuggestions(settings, 'news'),
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
        chips: getChatSuggestions(settings, 'contact'),
      };
    },
  },
  {
    id: 'hours',
    keys: [/\b(timings?|hours|open|opening|closing|schedule|when|working|days?)\b/],
    answer: ({ settings }) => ({
      text: "I don't have the published **school-hour timetable** available. To avoid any mistakes, the **School Office** can confirm the exact visiting hours. \\n\\nWould you like their **contact details**?",
      links: contactLinks(settings),
      chips: getChatSuggestions(settings, 'contact'),
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
      chips: getChatSuggestions(settings, 'campus'),
    }),
  },
  {
    id: 'principal',
    keys: [/\b(principal|head|headmaster|headmistress|leadership|message)\b/],
    answer: ({ settings }) => ({
      text: `${settings.principalName}, **${settings.principalTitle}**, leads the school. \\n\\n"${settings.principalMessage.length > 220 ? settings.principalMessage.slice(0, 217) + '…' : settings.principalMessage}" \\n\\nWould you like to read the **complete message**?`,
      links: [{ label: 'Read the full message', to: '/about#principal' }],
      chips: getChatSuggestions(settings, 'campus'),
    }),
  },
  {
    id: 'gallery',
    keys: [/\b(photos?|gallery|pictures?|images?|videos?|life|activities)\b/],
    answer: ({ settings }) => ({
      text: 'Our **Photo Gallery** showcases campus life and student activities. You can also find the **3D film strip** on the home page. \\n\\nAre you interested in **student achievements**?',
      links: [{ label: 'Full photo gallery', to: '/gallery' }],
      chips: getChatSuggestions(settings, 'campus'),
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
        chips: getChatSuggestions(settings, 'contact'),
      };
    },
  },
  {
    id: 'students',
    keys: [
      /\b(timetable|time-table|homework|resources?|portal|student|vle|question\s?bank|sample\s?papers?)\b/,
    ],
    answer: ({ settings }) => ({
      text: 'The **Students Area** provides everything in one place: \\n\\n- **Schedules:** Timetables \\n- **Studies:** Syllabus & Homework \\n- **Outcomes:** CBSE Results \\n\\nDo you need help accessing the **portal**?',
      links: [
        { label: 'Open student resources', to: '/students' },
        { label: 'VLE Portal', to: '/vle-portal' },
      ],
      chips: getChatSuggestions(settings, 'students'),
    }),
  },
  {
    id: 'alumni',
    keys: [/\b(alumni|alumnus|alumna|old\s?students?|graduates?)\b/],
    answer: ({ settings }) => ({
      text: 'Our **Alumni Community** is a vital part of the school. You can reconnect and share updates on the **Alumni Page**. \\n\\nAre you a **former student**?',
      links: [
        { label: 'Alumni', to: '/alumni' },
        { label: 'Alumni registration', to: '/alumni-registration' },
      ],
      chips: getChatSuggestions(settings, 'alumni'),
    }),
  },
  // The topics below never state specifics the site doesn't publish — each
  // routes to the page or office that owns the answer.
  {
    id: 'transport',
    keys: [/\b(bus|buses|transport\w*|van|pick\s?up|drop|route|commute)\b/],
    answer: ({ settings }) => ({
      text: 'School **transport** routes, timings and charges are arranged through the **School Office** and change with each academic year. \\n\\nThey can tell you whether your area is covered and how to register.',
      links: contactLinks(settings),
      chips: getChatSuggestions(settings, 'transport'),
    }),
  },
  {
    id: 'age',
    keys: [/\b(age|ages|eligib\w*|criteria|born|birth)\b/],
    answer: ({ settings }) => ({
      text: "**Age criteria** for each grade follow the CBSE and Indian Schools in Oman guidelines for the admission year. \\n\\nThe admissions team will confirm the exact cut-off date for your child's grade.",
      links: [
        { label: 'Admission procedures', to: '/admission-procedures' },
        { label: `Email ${settings.admissionEmail}`, href: `mailto:${settings.admissionEmail}` },
      ],
      chips: getChatSuggestions(settings, 'admissions'),
    }),
  },
  {
    id: 'tc',
    // The phrase scores twice, so it beats the generic 'certificate' hit in `docs`.
    keys: [/\b(tc|transfer|leaving|withdraw\w*)\b/, /\btransfer\s+certificates?\b/],
    answer: ({ settings }) => ({
      text: 'Requests for a **Transfer Certificate** are handled by the School Office. The Transfer Certificate page explains the process.',
      links: [{ label: 'Transfer certificate', to: '/transfer-certificate' }, ...contactLinks(settings)],
      chips: getChatSuggestions(settings, 'admissions'),
    }),
  },
  {
    id: 'careers',
    keys: [/\b(jobs?|careers?|vacanc\w*|hiring|recruit\w*|tenders?|cv|resume)\b/],
    answer: ({ settings }) => ({
      text: 'Current **job openings** and **tenders** are listed on the Careers & Tenders page. You can also send your CV to the school for future openings.',
      links: [{ label: 'Careers & Tenders', to: '/careers-tenders' }, ...contactLinks(settings).slice(0, 1)],
      chips: getChatSuggestions(settings, 'contact'),
    }),
  },
  {
    id: 'facilities',
    keys: [
      /\b(facilit\w*|infrastructure|labs?|laborator\w*|library|canteen|playground|sports?|computers?)\b/,
    ],
    answer: ({ settings }) => ({
      text: 'The **16-acre campus** has science and computer labs, a library, dance, music and art rooms, sports grounds and a dedicated KG play area. \\n\\nWould you like to see them in the **gallery**?',
      links: [
        { label: 'Infrastructure', to: '/infrastructure' },
        { label: 'Photo gallery', to: '/gallery' },
      ],
      chips: getChatSuggestions(settings, 'campus'),
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
      chips: getChatSuggestions(settings, 'contact'),
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
  'talk to the office': 'talk to someone',
  'alumni registration': 'alumni register',
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * School-written answers (Settings → Assistant). Each comma-separated keyword
 * is a word or phrase matched on word boundaries; the FAQ with the most
 * keyword hits wins.
 */
function matchFaq(q: string, faqs: ChatFaq[] = []): ChatFaq | null {
  let best: { faq: ChatFaq; score: number } | null = null;
  for (const faq of faqs) {
    if (!faq.answer.trim()) continue;
    const score = faq.keywords
      .split(',')
      .map((k) => norm(k).trim())
      .filter(Boolean)
      .filter((k) => new RegExp(`\\b${escapeRe(k).replace(/\s+/g, '\\s+')}\\b`).test(q)).length;
    if (score > 0 && (!best || score > best.score)) best = { faq, score };
  }
  return best?.faq ?? null;
}

function faqLinks(faq: ChatFaq): ChatLink[] {
  const url = faq.linkUrl?.trim();
  if (!url) return [];
  const label = faq.linkLabel?.trim() || 'Find out more';
  return url.startsWith('/') ? [{ label, to: url }] : [{ label, href: url }];
}

function answer(q: string, ctx: Ctx): BotReply {
  const faq = matchFaq(q, ctx.settings.chatFaqs);
  if (faq) {
    return {
      text: faq.answer,
      links: faqLinks(faq),
      chips: getChatSuggestions(ctx.settings, 'welcome'),
    };
  }

  let best: { intent: Intent; score: number } | null = null;
  for (const intent of INTENTS) {
    let score = 0;
    for (const k of intent.keys) {
      const m = q.match(new RegExp(k.source, 'g'));
      if (m) score += m.length;
    }
    if (score === 0) continue;
    // Any real topic outranks small talk; among topics more hits win, and the
    // earlier (more specific) intent keeps a tie.
    const rank = (i: Intent, n: number) => (i.chatty ? 0 : 1000) + n;
    if (!best || rank(intent, score) > rank(best.intent, best.score)) best = { intent, score };
  }
  if (best) return best.intent.answer(ctx);

  return {
    text:
      ctx.settings.chatFallback?.trim() ||
      "I'm not sure I have that information — I'd rather not guess. \\n\\n- **Try:** One of the options below \\n- **Direct:** Ask the school office directly \\n\\nWhat **topic** are you looking for?",
    links: contactLinks(ctx.settings),
    chips: getChatSuggestions(ctx.settings, 'fallback'),
  };
}

export function reply(input: string, ctx: Ctx): BotReply {
  const asked = input.trim().toLowerCase();
  const r = answer(norm(ALIASES[asked] ?? input), ctx);
  // Never offer the question that was just asked as the next suggestion.
  return { ...r, chips: r.chips?.filter((c) => c.trim().toLowerCase() !== asked) };
}

export function greeting(settings: SiteSettings): BotReply {
  return {
    text:
      settings.chatGreeting?.trim() ||
      `Hi, I'm the ${settings.siteName || 'ISML'} assistant. I can help with admissions, programmes, fees, news and getting in touch. What would you like to know?`,
    chips: getChatSuggestions(settings, 'welcome'),
  };
}
