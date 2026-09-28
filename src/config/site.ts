import type { ChatSuggestions } from '@/types';

export const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'Indian School Muladha';
export const SITE_TAGLINE = 'In Pursuit of Excellence';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const SCHOOL_CONTACT = {
  address: 'P.O. Box 42, Postal Code 314, Al Muladha, Sultanate of Oman',
  phone: '+968 26811234',
  fax: '+968 26815140',
  emails: ['principal@isml-oman.com', 'ismloman@gmail.com'],
  social: {
    facebook: '#',
    instagram: '#',
    twitter: '#',
    youtube: '#',
  },
};

export interface NavItem {
  to: string;
  label: string;
  children?: NavItem[];
}

export const CHAT_SUGGESTIONS: ChatSuggestions = {
  welcome: ['Admissions', 'Programmes', 'Latest news', 'Fees', 'Contact', 'Campus tour'],
  admissions: ['Admission process', 'Documents needed', 'Fees', 'Campus tour'],
  programs: ['Admissions', 'Student resources', 'Latest news'],
  fees: ['Admission process', 'Contact'],
  news: ['Admissions', 'Photo gallery'],
  contact: ['Admissions', 'Campus tour'],
  campus: ['Photo gallery', 'Campus tour', 'Latest news'],
  students: ['Syllabus', 'Results', 'Latest news'],
  alumni: ['Alumni registration', 'Contact'],
  transport: ['Admissions', 'Contact'],
  fallback: ['Admissions', 'Fees', 'Contact', 'Talk to the office'],
};

export const PUBLIC_NAV: NavItem[] = [
  { to: '/', label: 'Home' },
  {
    to: '/about',
    label: 'About Us',
    children: [
      { to: '/vision-mission', label: 'Vision & Mission' },
      { to: '/school-management', label: 'School Management' },
      {
        to: '/board-of-directors',
        label: 'Board Of Directors',
        children: [{ to: '/bod-guidelines', label: 'BOD Guidelines' }],
      },
      { to: '/mandatory-public-disclosure', label: 'Mandatory Public Disclosure' },
      { to: '/academics', label: 'Academics' },
      { to: '/faculty', label: 'Faculty' },
      { to: '/infrastructure', label: 'Infrastructure' },
    ],
  },
  {
    to: '/admissions',
    label: 'Admission',
    children: [
      { to: '/admission-procedures', label: 'Admission Procedures' },
      { to: '/fee-structure', label: 'Fee Structure' },
      { to: '/transfer-certificate', label: 'Transfer Certificate' },
    ],
  },
  {
    to: '/news',
    label: 'News & Events',
    children: [
      { to: '/circulars', label: 'Circulars' },
      { to: '/results', label: 'Results' },
      { to: '/e-magazine', label: 'E-Magazine' },
      { to: '/press-release', label: 'Press release' },
      { to: '/school-calendar', label: 'School Calendar' },
      { to: '/gallery', label: 'Gallery' },
    ],
  },
  {
    to: '/students',
    label: 'Students Resources',
    children: [
      { to: '/syllabus-2026-2027', label: 'Syllabus 2026 – 2027' },
      { to: '/upcoming-events', label: 'Upcoming Events /Activities' },
      { to: '/question-bank', label: 'QUESTION BANK' },
      { to: '/vle-portal', label: 'VLE Portal' },
      { to: '/useful-links', label: 'Useful Links' },
    ],
  },
  {
    to: '/alumni',
    label: 'Alumni',
    children: [
      { to: '/about-alumni', label: 'About ALUMNI' },
      { to: '/alumni-objective', label: 'ALUMNI Objective' },
      { to: '/alumni-registration', label: 'ALUMNI Registration' },
    ],
  },
  {
    to: '/contact',
    label: 'Contact Us',
    children: [
      { to: '/contact', label: 'Contact Us' },
      { to: '/careers-tenders', label: 'Careers & Tenders at ISML' },
      { to: '/grievance-redressal', label: 'Grievance Redressal System' },
    ],
  },
];

export const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'grid' },
  { to: '/admin/pages', label: 'Pages', icon: 'file' },
  { to: '/admin/posts', label: 'News & Posts', icon: 'newspaper' },
  { to: '/admin/menus', label: 'Menus', icon: 'menu' },
  { to: '/admin/media', label: 'Media', icon: 'image' },
  { to: '/admin/users', label: 'Users', icon: 'users' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
] as const;

export const ADMIN_NAV_SECTIONS = [
  {
    heading: 'Overview',
    items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: 'grid' }],
  },
  {
    heading: 'Content',
    items: [
      { to: '/admin/pages', label: 'Pages', icon: 'file' },
      { to: '/admin/posts', label: 'News & Posts', icon: 'newspaper' },
      { to: '/admin/menus', label: 'Menus', icon: 'menu' },
      { to: '/admin/media', label: 'Media', icon: 'image' },
    ],
  },
  {
    heading: 'Configuration',
    items: [
      { to: '/admin/users', label: 'Users', icon: 'users' },
      { to: '/admin/settings', label: 'Settings', icon: 'settings' },
    ],
  },
] as const;
