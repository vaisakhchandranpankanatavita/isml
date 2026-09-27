import type { MediaItem, MenuItem, Page, Post, SiteSettings, User } from '@/types';
import { CHAT_SUGGESTIONS } from '@/config/site';

const DB_KEY = 'isml.cms.v10';
const CURRENT_USER_KEY = 'isml.cms.currentUser';

interface Database {
  users: User[];
  pages: Page[];
  posts: Post[];
  media: MediaItem[];
  menus: MenuItem[];
  settings: SiteSettings;
}

const nowIso = () => new Date().toISOString();
export const uid = () =>
  (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36));

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function seed(): Database {
  const createdAt = nowIso();
  return {
    users: [
      {
        id: uid(),
        name: 'Site Admin',
        email: 'admin@isml-oman.com',
        role: 'admin',
        password: 'admin123',
        createdAt,
      },
      {
        id: uid(),
        name: 'Editor Demo',
        email: 'editor@isml-oman.com',
        role: 'editor',
        password: 'editor123',
        createdAt,
      },
    ],
    pages: [
      {
        id: uid(),
        title: 'About Us',
        slug: 'about',
        content:
          'Indian School Muladha (ISML) started in 1981 as an English-medium, co-educational school affiliated to CBSE. From a humble beginning with 9 teachers and 90 students, ISML is now one of the largest schools outside the capital area with nearly 2200 students and 98 staff.\n\nLocated on a sprawling 16-acre campus of lush greenery, the school has 56 sections from KG to XII. Facilities include well-equipped laboratories, a library, junior/senior/super-senior computer labs, dance/music/arts rooms and a dedicated KG play area. Science and commerce streams are offered at the senior-secondary level.\n\nThe school has a rich culture of inter-house sports and cultural activities, and has pioneered inter-school festivals in the Sultanate of Oman.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Admissions',
        slug: 'admissions',
        content:
          'Admissions for the 2026–27 academic year are now open. Applications are accepted for Pre-KG through Grade 12, subject to available seats.\n\nThe process:\n1. Enquire — submit the enquiry form and our team will reach out.\n2. Visit — take a guided tour of the campus.\n3. Apply — complete the application and share the required documents.\n4. Confirm — accept your offer and complete the fee payment.\n\nFor age criteria, fee structure and required documents, please contact the admissions office.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Academics',
        slug: 'academics',
        content:
          'Our curriculum is aligned to CBSE and progresses through Foundational, Preparatory, Middle and Senior stages — nurturing curiosity, competence and character at every level.\n\nSubjects offered at the senior-secondary level include English, Physics, Chemistry, Mathematics, Biology, Computer Science, Informatics Practices, Accountancy, Business Studies, Economics and Marketing.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Students Resources',
        slug: 'students',
        content:
          'A one-stop hub for students — syllabi, upcoming events, question banks, VLE portal and useful links.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Alumni',
        slug: 'alumni',
        content:
          'Register with our alumni network to stay connected with batchmates, share updates and mentor current students.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Gallery',
        slug: 'gallery',
        content:
          'Glimpses of vibrant campus life — classrooms, sports fields, laboratories, cultural events and student achievements.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Vision & Mission',
        slug: 'vision-mission',
        content:
          'Vision — To empower every learner with knowledge, skills and values that enable them to lead purposeful and responsible lives.\n\nMission — To provide a nurturing, safe and inclusive environment that inspires academic excellence, ethical leadership and lifelong learning.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'School Management',
        slug: 'school-management',
        content:
          'The School Management Committee provides strategic direction, governance and oversight to ensure Indian School Muladha delivers on its mission.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Board Of Directors',
        slug: 'board-of-directors',
        content:
          'The Board of Directors of Indian Schools in Oman comprises distinguished members representing parent bodies, the community and educational leadership.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Mandatory Public Disclosure',
        slug: 'mandatory-public-disclosure',
        content:
          'As per CBSE guidelines, Indian School Muladha publishes mandatory disclosures including affiliation details, governance documents, staff information, infrastructure and results.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Faculty',
        slug: 'faculty',
        content:
          'Meet our dedicated faculty — experienced educators committed to nurturing every student through academic rigour, mentorship and care.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Infrastructure',
        slug: 'infrastructure',
        content:
          'Spread across 16 acres of lush green campus, Indian School Muladha offers modern classrooms, science and computer labs, a well-stocked library, play areas, dance and music rooms, an art studio and dedicated sports facilities that nurture holistic learning.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Career at ISML',
        slug: 'career-at-isml',
        content:
          'Join our team of passionate educators. We periodically recruit teachers, administrative staff and support roles. Send your CV to hr@isml-oman.com to be considered for upcoming openings.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Circulars',
        slug: 'circulars',
        content:
          'Latest circulars, notices and communications from the school office will appear here.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Results',
        slug: 'results',
        content: 'CBSE Grade X and XII results, toppers and school academic performance.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'E-Magazine',
        slug: 'e-magazine',
        content:
          'Read the latest editions of our school e-magazine featuring student creations, achievements and events.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Press Release',
        slug: 'press-release',
        content: 'Official press releases and announcements from Indian School Muladha.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'School Calendar',
        slug: 'school-calendar',
        content:
          'View our annual academic calendar including terms, holidays, exams and school events.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Syllabus 2026 – 2027',
        slug: 'syllabus-2026-2027',
        content: 'Curriculum and syllabus documents for the 2026–2027 academic year.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Upcoming Events / Activities',
        slug: 'upcoming-events',
        content: 'Stay informed about upcoming school events, competitions and student activities.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Question Bank',
        slug: 'question-bank',
        content: 'Curated question banks and practice papers for our students.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'VLE Portal',
        slug: 'vle-portal',
        content: 'Access the Virtual Learning Environment (VLE) portal for online resources.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Useful Links',
        slug: 'useful-links',
        content: 'A curated list of useful academic, career and reference links for our students.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Careers & Tenders at ISML',
        slug: 'careers-tenders',
        content:
          'Current openings, teacher recruitment drives and open tenders for services and supplies at Indian School Muladha will be listed here. Please email hr@isml-oman.com for staff enquiries and admin@isml-oman.com for tender enquiries.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Grievance Redressal System',
        slug: 'grievance-redressal',
        content:
          'Indian School Muladha is committed to providing a safe, respectful and transparent learning environment. Parents, students and staff can raise concerns through the grievance redressal system by writing to grievance@isml-oman.com. Every complaint is acknowledged within 48 hours and addressed by the grievance committee in accordance with CBSE guidelines.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'About ALUMNI',
        slug: 'about-alumni',
        content:
          'The Indian School Muladha Alumni Association brings together former students from across the world. Founded to keep the ISML spirit alive beyond the classroom, the association organises reunions, mentoring sessions and community initiatives, and celebrates the achievements of our graduates.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'ALUMNI Objective',
        slug: 'alumni-objective',
        content:
          'Our objectives:\n\n• Build a lifelong network of ISML graduates across professions and geographies.\n• Give back to the school through mentorship, guest lectures and career guidance for current students.\n• Support scholarships and student welfare initiatives.\n• Preserve and promote the values, culture and heritage of Indian School Muladha.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'ALUMNI Registration',
        slug: 'alumni-registration',
        content:
          'Register with the ISML Alumni Association to stay connected with your batchmates, receive invites to reunions and school events, and contribute to student mentoring programmes. Please share your name, batch year, current profession and contact details to alumni@isml-oman.com and our team will get in touch.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Admission Procedures',
        slug: 'admission-procedures',
        content:
          'Admission procedure for 2026–27:\n\n1. Enquire — submit the enquiry form or email admission@isml-oman.com and our team will reach out with the prospectus.\n2. Documents — submit the completed application form along with the child\'s birth certificate, previous school records, transfer certificate (if applicable), passport & visa copies, and passport-size photographs.\n3. Interaction — parent and student interaction with the admissions team / grade coordinator.\n4. Offer — offer letter is issued subject to seat availability.\n5. Confirm — pay the admission and term fees within the stipulated window to confirm the seat.\n\nAdmissions remain open through the year subject to available seats.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Fee Structure',
        slug: 'fee-structure',
        content:
          'The fee structure is revised each academic year and communicated to parents through the school office. The published structure covers admission fee, tuition fee (payable termly), examination fee and other applicable levies.\n\nFor the current fee schedule and any concessions applicable, please contact the school accounts office or email accounts@isml-oman.com.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Transfer Certificate',
        slug: 'transfer-certificate',
        content:
          'Parents seeking a Transfer Certificate (TC) for their ward may submit a written request to the school office at least two weeks in advance. TCs are issued after all dues are cleared and library / lab / transport records are settled.\n\nRequired: written request signed by the parent, ID copy, and the last-issued fee receipt. TCs are issued as per CBSE guidelines and may be verified online where applicable.',
        status: 'published',
        createdAt,
        updatedAt: createdAt,
      },
    ],
    posts: [
      {
        id: uid(),
        title: 'Admissions Open for 2026–27',
        slug: 'admissions-open-2026-27',
        excerpt:
          'Applications for the 2026–27 academic session are now open for Pre-KG through Grade 12.',
        content:
          'Indian School Muladha invites applications for the 2026–27 academic year. Please contact the admissions office or write to admission@isml-oman.com for details on the process, required documents and available seats.',
        coverUrl: 'https://isml-oman.com/wp-content/uploads/2025/03/MAIN-GATE-2-980x653.jpeg',
        category: 'announcement',
        status: 'published',
        author: 'Admissions Office',
        publishedAt: createdAt,
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Circular: Reopening after mid-term break',
        slug: 'circular-reopening-mid-term',
        excerpt:
          'School reopens on Sunday, 22 September 2026 after the mid-term break.',
        content:
          'Dear parents, this is to inform you that the school will reopen on Sunday, 22 September 2026 after the mid-term break. Regular timings will resume from that day. — Principal',
        coverUrl: 'https://isml-oman.com/wp-content/uploads/2025/03/KG-PARK2-980x653.jpeg',
        category: 'announcement',
        status: 'published',
        author: 'Principal',
        publishedAt: createdAt,
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Annual Sports Day 2026',
        slug: 'annual-sports-day-2026',
        excerpt: 'Cheer on our young athletes at the biggest event of the year.',
        content:
          'The Annual Sports Day will be held on 12 December 2026 at the school ground. Track events, field events and inter-house championships will take place through the day. Parents are cordially invited.',
        coverUrl: 'https://isml-oman.com/wp-content/uploads/2025/03/LIVE-GREEN-980x653.jpeg',
        category: 'event',
        status: 'published',
        author: 'Physical Education Dept.',
        publishedAt: createdAt,
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Inter-School Arts Festival',
        slug: 'inter-school-arts-festival',
        excerpt:
          'ISML hosts the annual inter-school arts festival with 20+ participating schools.',
        content:
          'The inter-school arts festival returns to ISML on 5–7 November 2026 with music, dance, drama, painting and quiz competitions. Registration is open until 20 October.',
        coverUrl: 'https://isml-oman.com/wp-content/uploads/2025/03/5-980x653.jpeg',
        category: 'event',
        status: 'published',
        author: 'Cultural Council',
        publishedAt: createdAt,
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'CBSE Board Results 2025–26 — congratulations!',
        slug: 'cbse-results-2025-26',
        excerpt:
          'ISML students post another year of outstanding CBSE Grade X and XII results.',
        content:
          'Congratulations to our Grade X and XII students on outstanding board results this year. Every student cleared their exams, with several achieving distinctions across multiple subjects. Full details and toppers list on the Results page.',
        coverUrl: 'https://isml-oman.com/wp-content/uploads/2026/05/senior-2-980x551.jpg',
        category: 'news',
        status: 'published',
        author: 'Academic Board',
        publishedAt: createdAt,
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: uid(),
        title: 'Science Fair Winners Announced',
        slug: 'science-fair-winners-announced',
        excerpt: 'Congratulations to the students who wowed our judges this year.',
        content:
          'A recap of the standout projects and the awards ceremony from this year’s science fair. Special mention to the Grade 9 team for their sustainable-water project.',
        coverUrl: 'https://isml-oman.com/wp-content/uploads/2026/05/middle-980x551.jpeg',
        category: 'news',
        status: 'published',
        author: 'Science Dept.',
        publishedAt: createdAt,
        createdAt,
        updatedAt: createdAt,
      },
    ],
    media: [],
    menus: seedMenus(),
    settings: {
      siteName: 'Indian School Muladha',
      tagline: 'In Pursuit of Excellence',
      admissionEmail: 'admission@isml-oman.com',
      announcementText: 'Admissions Open 2026–27',
      announcementLinkLabel: 'Register today',
      heroCaption: 'ISML felicitated for its excellence in academics 2025–26',
      heroImageUrl:
        'https://isml-oman.com/wp-content/uploads/2025/03/1-980x653.jpeg',
      welcomeHeading: 'Welcome to Indian School Muladha',
      welcomeBody:
        'Indian Schools in Oman, established by the Board of Directors, aim primarily to educate the students of the Indian community residing within the Sultanate of Oman. The Schools function as non-political, secular, non-profit making, self-sustaining institutions.',
      welcomeImageUrl:
        'https://isml-oman.com/wp-content/uploads/2025/03/1-980x653.jpeg',
      campusImageUrl:
        'https://isml-oman.com/wp-content/uploads/2025/03/MAIN-GATE-2.jpeg',
      principalName: 'Dr Nayer Iqbal',
      principalTitle: 'Principal, Indian School Muladha',
      principalMessage:
        'It is with great pleasure that I welcome you to our school website. At ISML we believe every child is unique, and we strive to nurture curiosity, character and confidence in every learner who walks through our gates.',
      principalImageUrl: 'https://isml-oman.com/wp-content/uploads/2026/08/Nayer.jpg',
      k12Heading: 'K–12 journey of your child',
      k12Programs: [
        {
          id: uid(),
          title: 'Foundational',
          grades: 'Pre-KG – Grade 2',
          coverUrl:
            'https://isml-oman.com/wp-content/uploads/2026/05/foun-1-980x653.jpeg',
        },
        {
          id: uid(),
          title: 'Preparatory',
          grades: 'Grade 3 – Grade 5',
          coverUrl:
            'https://isml-oman.com/wp-content/uploads/2026/05/IMG_7128-3-980x545.jpg',
        },
        {
          id: uid(),
          title: 'Middle',
          grades: 'Grade 6 – Grade 8',
          coverUrl:
            'https://isml-oman.com/wp-content/uploads/2026/05/middle-980x551.jpeg',
        },
        {
          id: uid(),
          title: 'Senior',
          grades: 'Grade 9 – Grade 12',
          coverUrl:
            'https://isml-oman.com/wp-content/uploads/2026/05/senior-2-980x551.jpg',
        },
      ],
      experienceHeading: 'EXPERIENCE\n@ISML',
      experienceBody:
        'Get a glimpse of the vibrant and engaging environment of Indian School Muladha and visit the places where our students grow, learn and thrive.',
      chatSuggestions: {
        welcome: [...CHAT_SUGGESTIONS.welcome],
        admissions: [...CHAT_SUGGESTIONS.admissions],
        programs: [...CHAT_SUGGESTIONS.programs],
        fees: [...CHAT_SUGGESTIONS.fees],
        news: [...CHAT_SUGGESTIONS.news],
        contact: [...CHAT_SUGGESTIONS.contact],
        campus: [...CHAT_SUGGESTIONS.campus],
      },
      experienceImages: [
        {
          id: uid(),
          url: 'https://isml-oman.com/wp-content/uploads/2025/03/WhatsApp-Image-2022-12-13-at-4.04.12-AM-1-980x546.jpeg',
          caption: 'Campus life',
        },
        {
          id: uid(),
          url: 'https://isml-oman.com/wp-content/uploads/2025/03/MAIN-GATE-2-980x653.jpeg',
          caption: 'Main gate',
        },
        {
          id: uid(),
          url: 'https://isml-oman.com/wp-content/uploads/2025/03/5-980x653.jpeg',
          caption: 'Learning spaces',
        },
        {
          id: uid(),
          url: 'https://isml-oman.com/wp-content/uploads/2025/03/KG-PARK2-980x653.jpeg',
          caption: 'KG park',
        },
        {
          id: uid(),
          url: 'https://isml-oman.com/wp-content/uploads/2025/03/CANTEEN1-1-980x653.jpeg',
          caption: 'Canteen',
        },
        {
          id: uid(),
          url: 'https://isml-oman.com/wp-content/uploads/2025/03/LIVE-GREEN-980x653.jpeg',
          caption: 'Live green',
        },
      ],
      tourHeading: 'Take a virtual tour',
      tourBody:
        'Take a virtual tour of our school and get a feel for Indian School Muladha, Oman from the comfort of your own home.',
      tourLink: '#tour',
      contactPhone: '+968 26811234',
      contactFax: '+968 26815140',
      contactEmails: ['principal@isml-oman.com', 'ismloman@gmail.com'],
      contactAddress: 'P.O. Box 42, Postal Code 314, Al Muladha, Sultanate of Oman',
      socialFacebook: 'https://www.facebook.com/ISMLFacebook',
      socialInstagram: 'https://www.instagram.com/indianschoolmuladha_official',
      socialTwitter: 'https://twitter.com/IndianMuladha',
      socialYoutube: 'https://www.youtube.com/channel/UC3VdvAMksGIgrWF_xx9ABUw',
    },
  };
}

function seedMenus(): MenuItem[] {
  const roots: Array<Omit<MenuItem, 'id' | 'parentId'> & { children?: Array<Omit<MenuItem, 'id' | 'parentId' | 'order'>> }> = [
    { label: 'Home', url: '/', order: 1, active: true, newTab: false },
    {
      label: 'About Us',
      url: '/about',
      order: 2,
      active: true,
      newTab: false,
      children: [
        { label: 'Vision & Mission', url: '/p/vision-mission', active: true, newTab: false },
        { label: 'School Management', url: '/p/school-management', active: true, newTab: false },
        { label: 'Board Of Directors', url: '/p/board-of-directors', active: true, newTab: false },
        {
          label: 'Mandatory Public Disclosure',
          url: '/p/mandatory-public-disclosure',
          active: true,
          newTab: false,
        },
        { label: 'Academics', url: '/academics', active: true, newTab: false },
        { label: 'Faculty', url: '/p/faculty', active: true, newTab: false },
        { label: 'Infrastructure', url: '/p/infrastructure', active: true, newTab: false },
      ],
    },
    {
      label: 'Admission',
      url: '/admissions',
      order: 3,
      active: true,
      newTab: false,
      children: [
        { label: 'Admission Procedures', url: '/p/admission-procedures', active: true, newTab: false },
        { label: 'Fee Structure', url: '/p/fee-structure', active: true, newTab: false },
        { label: 'Transfer Certificate', url: '/p/transfer-certificate', active: true, newTab: false },
      ],
    },
    {
      label: 'News & Events',
      url: '/news',
      order: 4,
      active: true,
      newTab: false,
      children: [
        { label: 'Circulars', url: '/p/circulars', active: true, newTab: false },
        { label: 'Results', url: '/p/results', active: true, newTab: false },
        { label: 'E-Magazine', url: '/p/e-magazine', active: true, newTab: false },
        { label: 'Press release', url: '/p/press-release', active: true, newTab: false },
        { label: 'School Calendar', url: '/p/school-calendar', active: true, newTab: false },
        { label: 'Gallery', url: '/gallery', active: true, newTab: false },
      ],
    },
    {
      label: 'Students Resources',
      url: '/students',
      order: 5,
      active: true,
      newTab: false,
      children: [
        { label: 'Syllabus 2026 – 2027', url: '/p/syllabus-2026-2027', active: true, newTab: false },
        { label: 'Upcoming Events / Activities', url: '/p/upcoming-events', active: true, newTab: false },
        { label: 'QUESTION BANK', url: '/p/question-bank', active: true, newTab: false },
        { label: 'VLE Portal', url: '/p/vle-portal', active: true, newTab: false },
        { label: 'Useful Links', url: '/p/useful-links', active: true, newTab: false },
      ],
    },
    {
      label: 'Alumni',
      url: '/alumni',
      order: 6,
      active: true,
      newTab: false,
      children: [
        { label: 'About ALUMNI', url: '/p/about-alumni', active: true, newTab: false },
        { label: 'ALUMNI Objective', url: '/p/alumni-objective', active: true, newTab: false },
        { label: 'ALUMNI Registration', url: '/p/alumni-registration', active: true, newTab: false },
      ],
    },
    {
      label: 'Contact Us',
      url: '/contact',
      order: 7,
      active: true,
      newTab: false,
      children: [
        { label: 'Contact Us', url: '/contact', active: true, newTab: false },
        { label: 'Careers & Tenders at ISML', url: '/p/careers-tenders', active: true, newTab: false },
        { label: 'Grievance Redressal System', url: '/p/grievance-redressal', active: true, newTab: false },
      ],
    },
  ];

  const menus: MenuItem[] = [];
  roots.forEach((root) => {
    const parentId = uid();
    menus.push({
      id: parentId,
      label: root.label,
      url: root.url,
      order: root.order,
      parentId: null,
      active: root.active,
      newTab: root.newTab,
    });
    root.children?.forEach((child, idx) => {
      menus.push({
        id: uid(),
        parentId,
        label: child.label,
        url: child.url,
        order: idx + 1,
        active: child.active,
        newTab: child.newTab,
      });
    });
  });
  return menus;
}

function read(): Database {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const seeded = seed();
      localStorage.setItem(DB_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as Database;
  } catch {
    const seeded = seed();
    localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function write(db: Database): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new CustomEvent('isml:db-change'));
}

export const storage = {
  read,
  write,
  resetToSeed(): Database {
    const seeded = seed();
    write(seeded);
    return seeded;
  },
  subscribe(listener: () => void): () => void {
    const handler = () => listener();
    window.addEventListener('isml:db-change', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('isml:db-change', handler);
      window.removeEventListener('storage', handler);
    };
  },
};

// Current-user session helpers
export function saveCurrentUserId(id: string) {
  localStorage.setItem(CURRENT_USER_KEY, id);
}
export function readCurrentUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}
export function clearCurrentUserId() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export { nowIso };
