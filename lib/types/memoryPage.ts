export type MemoryPageStatus = 'draft' | 'published' | 'unpublished';

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'elegant';

export interface Memory {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnailUrl?: string;
  date: Date;
  description: string;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryPageSettings {
  template: TemplateId;
  backgroundColor: string;
  accentColor: string;
  fontFamily: string;
  layout: 'grid' | 'timeline' | 'carousel';
  showDates: boolean;
  allowComments: boolean;
}

export interface MemoryPage {
  id: string;
  userId: string;
  name: string;
  birthDate?: Date;
  deathDate?: Date;
  bio: string;
  profilePhoto?: string;
  coverPhoto?: string;
  memories: Memory[];
  settings: MemoryPageSettings;
  status: MemoryPageStatus;
  slug: string;
  viewCount: number;
  qrScans: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  preview: string;
  settings: Partial<MemoryPageSettings>;
}

export const TEMPLATES: Template[] = [
  {
    id: 'classic',
    name: 'Klasik',
    description: 'Zamansız ve zarif bir tasarım',
    preview: '/templates/classic.png',
    settings: {
      backgroundColor: '#ffffff',
      accentColor: '#1d1d1f',
      fontFamily: 'serif',
      layout: 'timeline',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Çağdaş ve minimalist görünüm',
    preview: '/templates/modern.png',
    settings: {
      backgroundColor: '#fbfbfd',
      accentColor: '#0071e3',
      fontFamily: 'sans-serif',
      layout: 'grid',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Sade ve odaklanmış tasarım',
    preview: '/templates/minimal.png',
    settings: {
      backgroundColor: '#fafafa',
      accentColor: '#333333',
      fontFamily: 'sans-serif',
      layout: 'carousel',
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Şık ve sofistike bir deneyim',
    preview: '/templates/elegant.png',
    settings: {
      backgroundColor: '#f5f5f0',
      accentColor: '#8b7355',
      fontFamily: 'serif',
      layout: 'timeline',
    },
  },
];

export const MAX_PHOTOS = 8;
export const MAX_VIDEOS = 2;
export const MAX_VIDEO_SIZE_MB = 50;
export const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;
