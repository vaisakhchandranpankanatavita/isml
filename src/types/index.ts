export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // demo-only, plain text; replace with hashed value on real backend
  avatarUrl?: string;
  createdAt: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl?: string;
  status: 'draft' | 'published';
  updatedAt: string;
  createdAt: string;
}

export type PostCategory = 'news' | 'event' | 'announcement';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl?: string;
  category: PostCategory;
  status: 'draft' | 'published';
  publishedAt: string;
  author: string;
  updatedAt: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  url: string; // data URL for demo storage
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  parentId: string | null;
  active: boolean;
  newTab: boolean;
}

export interface K12Program {
  id: string;
  title: string;
  grades: string;
  coverUrl?: string;
}

export interface HomeGalleryImage {
  id: string;
  url?: string;
  caption?: string;
}

export interface ChatSuggestions {
  welcome: string[];
  admissions: string[];
  programs: string[];
  fees: string[];
  news: string[];
  contact: string[];
  campus: string[];
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  admissionEmail: string;
  // Header announcement bar
  announcementText: string;
  announcementLinkLabel: string;
  // Hero
  heroCaption: string;
  heroImageUrl?: string;
  // Welcome
  welcomeHeading: string;
  welcomeBody: string;
  welcomeImageUrl?: string;
  // Campus
  campusImageUrl?: string;
  // Principal
  principalName: string;
  principalTitle: string;
  principalMessage: string;
  principalImageUrl?: string;
  // K-12 programs
  k12Heading: string;
  k12Programs: K12Program[];
  // Experience @ISML
  experienceHeading: string;
  experienceBody: string;
  experienceImages: HomeGalleryImage[];
  chatSuggestions?: ChatSuggestions;
  // Virtual tour
  tourHeading: string;
  tourBody: string;
  tourLink: string;
  // Contact block
  contactPhone: string;
  contactFax: string;
  contactEmails: string[];
  contactAddress: string;
  // Social
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  socialYoutube: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
