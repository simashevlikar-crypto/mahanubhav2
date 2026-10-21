/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Chapter {
  id: string;
  bookId: string;
  number: number;
  title: string;
  titleEn?: string;
  content: string; // Marathi/Hindi text of the leela or sutra
  explanation?: string; // Spiritual meaning/commentary
  audioUrl?: string; // Optional audio file link
}

export interface Book {
  id: string;
  title: string;
  titleEn: string;
  author: string;
  description: string;
  descriptionEn?: string;
  category: string;
  chaptersCount: number;
  coverImage?: string;
}

export interface Bhajan {
  id: string;
  title: string;
  language: string;
  lyrics: string;
  singer?: string;
  audioUrl?: string; // Demo audio
  videoUrl?: string; // YouTube embed link or video id
  category?: string;
}

export interface Pravachan {
  id: string;
  title: string;
  speaker: string;
  date: string;
  category: 'leela' | 'sutra' | 'achara' | 'general';
  duration: string;
  audioUrl?: string;
  videoUrl?: string; // YouTube ID or embed link
  thumbnailUrl?: string;
}

export interface Temple {
  id: string;
  name: string;
  nameEn: string;
  type: 'temple' | 'ashram' | 'sthan';
  location: string;
  description: string;
  history?: string;
  photoUrl: string;
  contact?: string;
  darshanTimings?: string;
  latitude?: number;
  longitude?: number;
  state?: string;
  district?: string;
  taluka?: string;
}

export interface EventKaryakram {
  id: string;
  title: string;
  date: string;
  type: 'utsav' | 'yatra' | 'sabha' | 'kirtan';
  location: string;
  description: string;
  contact?: string;
}

export interface Samachar {
  id: string;
  title: string;
  date: string;
  content: string;
  category: 'announcement' | 'update' | 'news';
  imageUrl?: string;
}

export interface CommunityMessage {
  id: string;
  userName: string;
  userRole: 'user' | 'admin' | 'vishwajeet shevlikar';
  message: string;
  timestamp: string;
  likes: number;
  replies?: Array<{
    id: string;
    userName: string;
    userRole: 'user' | 'admin' | 'vishwajeet shevlikar';
    message: string;
    timestamp: string;
  }>;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  category: 'granth' | 'bhajan' | 'event' | 'general';
}

export interface NiwasItem {
  id: string;
  name: string;
  nameEn: string;
  location: string;
  state: string; // "महाराष्ट्र" | "राजस्थान" | "गुजरात"
  district: string;
  taluka: string;
  village?: string; // Manually added village name
  facilities: { mr: string[]; hi: string[]; en: string[] };
  rooms: { mr: string[]; hi: string[]; en: string[] };
  contactPerson: string;
  phone: string;
  sevaCharge: { mr: string; hi: string; en: string };
  imageUrl: string;
  rating: number;
  bhikshuk?: number;
  tapasvini?: number;
  children?: number;
  totalMembers?: number;
  isAdminAdded?: boolean;
  createdAt?: string;
}

export interface AnalyticsData {
  appOpens: number;
  mostReadBooks: Record<string, number>;
  mostPlayedBhajans: Record<string, number>;
  activeUsersToday: number;
}

export interface GranthReference {
  bookName: 'लीळाचरित्र' | 'सूत्रपाठ' | 'दृष्टांतपाठ' | 'स्थानपोथी' | 'इतर ग्रंथ' | string;
  chapter: string;
  pageNumber: string;
}

export interface SthanDarshanPlace {
  id: string;
  number: number;
  title: string;
  titleEn?: string;
  content: string; // Marathi/Hindi text describing history & mahatva
  explanation?: string; // Guidance on how to reach / travel
  latitude: number;
  longitude: number;
  photoUrl?: string;
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
  
  // Phase 3 fields
  spiritualImportance?: string;
  history?: string;
  leela?: string;
  specialInfo?: string;
  granthReferences?: string[];
  elevation?: string;
  images?: string[];
  videos?: string[];
  audioUrl?: string;
  
  // Phase 3 additional complete fields
  architecture?: string;
  festivals?: string;
  darshanTiming?: string;
  contactNumber?: string;
  website?: string;
  granthRefs?: GranthReference[];
}

export interface Place {
  id?: string;
  placeNameMr: string;
  placeNameEn: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  category: string;
  latitude: number;
  longitude: number;
  history: string;
  leela: string;
  specialInfo: string;
  status: string;
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Community Types
export type CommunityPostType = 'question' | 'discussion' | 'information' | 'photo';

export type CommunityCategory =
  | '📖 लीळा व ग्रंथ'
  | '🙏 धर्म व तत्त्वज्ञान'
  | '🛕 स्थान / देवस्थान'
  | '🎵 भजन / आरती'
  | '📅 कार्यक्रम'
  | '📷 फोटो'
  | '💬 सामान्य चर्चा'
  | '❓ इतर';

export interface CommunityUserProfile {
  uid: string;
  name: string;
  username: string;
  phoneNumber?: string;
  photoURL?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  answersCount: number;
  role: 'user' | 'admin' | 'moderator' | 'vishwajeet shevlikar';
  isBlocked?: boolean;
}

export interface CommunityPost {
  id: string;
  type: CommunityPostType;
  authorId: string;
  authorName: string;
  authorUsername?: string;
  authorPhoto?: string;
  authorRole?: string;
  title: string;
  content: string;
  category: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  answersCount: number;
  viewsCount?: number;
  sharesCount?: number;
  isPinned?: boolean;
  isDeleted?: boolean;
  isReported?: boolean;
  savedBy?: string[];
}

export interface CommunityAnswer {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername?: string;
  authorPhoto?: string;
  authorRole?: string;
  content: string;
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  repliesCount?: number;
  isAccepted?: boolean;
  isDeleted?: boolean;
  isReported?: boolean;
}

export interface CommunityReply {
  id: string;
  postId: string;
  answerId: string;
  authorId: string;
  authorName: string;
  authorUsername?: string;
  authorPhoto?: string;
  content: string;
  imageUrls?: string[];
  createdAt: string;
  likesCount?: number;
  isDeleted?: boolean;
}

export interface CommunityReport {
  id: string;
  reporterId: string;
  reporterName?: string;
  targetType: 'post' | 'answer' | 'reply' | 'user';
  targetId: string;
  postId?: string;
  reason: string;
  description?: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
}

export interface CommunityNotification {
  id: string;
  type: 'answer' | 'reply' | 'like' | 'follow' | 'accepted_answer';
  fromUserId: string;
  fromUserName: string;
  fromUserPhoto?: string;
  postId?: string;
  answerId?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

