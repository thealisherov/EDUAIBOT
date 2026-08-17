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
  status: 'sent' | 'failed';
}

export interface TelegramBotConfig {
  token: string;
  botUsername: string;
  botName: string;
  isWebhookSet: boolean;
  webhookUrl: string;
  rawTokenProvided?: boolean;
  appUrl?: string;
}

export interface BroadcastStats {
  totalSubscribers: number;
  totalBroadcasts: number;
  botUsername: string;
  isWebhookSet: boolean;
}
