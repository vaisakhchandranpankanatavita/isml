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

export const PUBLIC_NAV: NavItem[] = [
  { to: '/', label: 'Home' },
  {
    to: '/about',
    label: 'About Us',
    children: [
      { to: '/about', label: 'About the School' },
      { to: '/about#principal', label: "Principal's Message" },
      { to: '/about#management', label: 'Management' },
      { to: '/about#vision', label: 'Vision & Mission' },
      { to: '/about#infrastructure', label: 'Infrastructure' },
    ],
  },
  {
    to: '/admissions',
    label: 'Admission',
    children: [
      { to: '/admissions', label: 'Admission Process' },
      { to: '/admissions#fees', label: 'Fee Structure' },
      { to: '/admissions#age', label: 'Age Criteria' },
      { to: '/admissions#tc', label: 'TC / Withdrawal' },
    ],
  },
  {
    to: '/news',
    label: 'News & Events',
    children: [
      { to: '/news', label: 'Latest News' },
      { to: '/news?category=event', label: 'Events' },
      { to: '/news?category=announcement', label: 'Circulars' },
      { to: '/gallery', label: 'Gallery' },
    ],
  },
  {
    to: '/students',
    label: 'Students Resources',
    children: [
      { to: '/students#timetable', label: 'Time Table' },
      { to: '/students#homework', label: 'Home Work' },
      { to: '/students#syllabus', label: 'Syllabus' },
      { to: '/students#downloads', label: 'Downloads' },
      { to: '/students#results', label: 'CBSE Results' },
    ],
  },
  {
    to: '/alumni',
    label: 'Alumni',
    children: [
      { to: '/alumni#register', label: 'Register' },
      { to: '/alumni#directory', label: 'Directory' },
      { to: '/alumni#events', label: 'Alumni Events' },
    ],
  },
  {
    to: '/contact',
    label: 'Contact Us',
    children: [
      { to: '/contact', label: 'Contact' },
      { to: '/contact#locate', label: 'Locate Us' },
      { to: '/contact#feedback', label: 'Feedback' },
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
