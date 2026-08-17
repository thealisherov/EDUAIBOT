import path from 'path';
import fs from 'fs';

export interface TelegramSubscriber {
  id: string;
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  joinedAt: string;
}

export interface BroadcastRecord {
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

export interface TelegramConfigState {
  token: string;
  botUsername: string;
  botName: string;
  isWebhookSet: boolean;
  webhookUrl: string;
}

export interface LeanDBState {
  subscribers: TelegramSubscriber[];
  broadcasts: BroadcastRecord[];
  telegramConfig: TelegramConfigState;
}

let dbInstance: LeanDBState = {
  subscribers: [],
  broadcasts: [],
  telegramConfig: {
    token: process.env.TELEGRAM_BOT_TOKEN || "",
    botUsername: "@testmarkaz123bot",
    botName: "EVEREST Academy Bot",
    isWebhookSet: false,
    webhookUrl: ""
  }
};

const getDBPaths = (): string[] => {
  const paths: string[] = [];
  try {
    paths.push(path.join('/tmp', 'data_store.json'));
  } catch {}
  try {
    paths.push(path.join(process.cwd(), 'data_store.json'));
  } catch {}
  return paths;
};

export function loadDB(): LeanDBState {
  const envToken = process.env.TELEGRAM_BOT_TOKEN || "";
  for (const filePath of getDBPaths()) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        dbInstance = {
          ...dbInstance,
          subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers : (Array.isArray(parsed.users) ? parsed.users.map((u: any) => ({
            id: u.id,
            telegramId: Number(u.telegramId),
            firstName: u.firstName || 'Foydalanuvchi',
            lastName: u.lastName,
            username: u.username,
            joinedAt: u.registeredAt || new Date().toISOString()
          })) : []),
          broadcasts: Array.isArray(parsed.broadcasts) ? parsed.broadcasts : [],
          telegramConfig: {
            ...dbInstance.telegramConfig,
            ...(parsed.telegramConfig || {}),
            token: envToken || parsed.telegramConfig?.token || dbInstance.telegramConfig.token || ""
          }
        };
        return dbInstance;
      }
    } catch {}
  }

  if (envToken) {
    dbInstance.telegramConfig.token = envToken;
  }
  return dbInstance;
}

export function saveDB(): void {
  const data = JSON.stringify(dbInstance, null, 2);
  for (const filePath of getDBPaths()) {
    try {
      fs.writeFileSync(filePath, data, 'utf-8');
    } catch {}
  }
}

export function getDB(): LeanDBState {
  return dbInstance;
}

export function addOrUpdateSubscriber(from: any): void {
  if (!from || !from.id) return;
  const existing = dbInstance.subscribers.find(s => s.telegramId === Number(from.id));
  if (!existing) {
    dbInstance.subscribers.unshift({
      id: `sub_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      telegramId: Number(from.id),
      firstName: from.first_name || 'Foydalanuvchi',
      lastName: from.last_name || '',
      username: from.username || '',
      joinedAt: new Date().toISOString()
    });
  } else {
    existing.firstName = from.first_name || existing.firstName;
    existing.lastName = from.last_name || existing.lastName;
    existing.username = from.username || existing.username;
  }
  saveDB();
}

loadDB();
