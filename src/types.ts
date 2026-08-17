export interface LearningCenterInfo {
  name: string;
  tagline: string;
  description: string;
  openingTime: string;
  closingTime: string;
  workDays: string;
  address: string;
  landmark: string;
  phone: string;
  phoneSecondary: string;
  telegramUsername: string;
  channelUrl: string;
  instagramUrl: string;
  websiteUrl: string;
  aiPromptContext: string;
  welcomeMessageTemplate: string;
}

export interface Course {
  id: string;
  title: string;
  category: 'it' | 'languages' | 'design' | 'math' | 'kids' | 'other';
  price: number;
  priceFormatted: string;
  duration: string;
  lessonDuration: string;
  description: string;
  topics: string[];
  level: string;
  teacherId: string;
  isActive: boolean;
  icon: string;
  schedule: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  experience: string;
  degree: string;
  bio: string;
  photoUrl: string;
  phone: string;
  rating: number;
  studentsCount: number;
}

export interface BotUser {
  id: string;
  telegramId: number | string;
  firstName: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  status: 'new' | 'contacted' | 'enrolled' | 'cancelled';
  registeredAt: string;
  lastActiveAt: string;
  interestedCourseId?: string;
  interestedCourseTitle?: string;
  notes?: string;
  source: 'telegram_bot' | 'simulator' | 'manual';
  messagesCount: number;
}

export interface BroadcastMessage {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  sentAt: string;
  targetCount: number;
  successCount: number;
  failedCount: number;
  status: 'sent' | 'draft' | 'failed';
  targetFilter: 'all' | 'new' | 'contacted' | 'enrolled';
}

export interface BotMessageLog {
  id: string;
  userId: string;
  userName: string;
  telegramId: number | string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isAiGenerated: boolean;
  source: 'telegram' | 'simulator';
}

export interface TelegramBotConfig {
  token: string;
  botUsername: string;
  botName: string;
  isWebhookSet: boolean;
  webhookUrl: string;
  autoReplyWithAI: boolean;
  hasCustomToken: boolean;
}

export interface CenterStats {
  totalUsers: number;
  totalMessages: number;
  totalBroadcasts: number;
  totalCourses: number;
  totalTeachers: number;
  enrolledUsers: number;
  todayMessages: number;
}

export type DashboardStats = CenterStats;
