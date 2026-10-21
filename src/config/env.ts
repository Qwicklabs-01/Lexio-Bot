import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export interface AppConfig {
  botToken: string;
  databaseUrl: string;
  port: number;
  nodeEnv: string;
  webhookDomain: string;
  webhookSecret: string;
  miniAppUrl: string;
  jwtSecret: string;
  adminIds: string[];
  paymentProviderToken?: string;
}

const adminIdsRaw = process.env.ADMIN_IDS || '';
const adminIds = adminIdsRaw
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

export const config: AppConfig = {
  botToken: process.env.BOT_TOKEN || '123456789:TEST_BOT_TOKEN_REPLACE_ME',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/telegram_platform?schema=public',
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  webhookDomain: process.env.WEBHOOK_DOMAIN || '',
  webhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET || 'secret-webhook-token-random-hex-32-chars',
  miniAppUrl: process.env.MINI_APP_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-signing-key-minimum-32-chars',
  adminIds: adminIds.length > 0 ? adminIds : ['123456789'],
  paymentProviderToken: process.env.PAYMENT_PROVIDER_TOKEN || '',
};

export function getValidHttpsMiniAppUrl(queryOrPath = ''): string {
  let base = config.miniAppUrl.trim();
  if (!base.startsWith('https://')) {
    base = 'https://nest-hub-tools.vercel.app';
  }
  if (!queryOrPath) return base;
  if (queryOrPath.startsWith('?') || queryOrPath.startsWith('/')) {
    return `${base.replace(/\/$/, '')}${queryOrPath}`;
  }
  return `${base.replace(/\/$/, '')}/${queryOrPath}`;
}

export function validateConfig(): void {
  const missing: string[] = [];
  if (!process.env.BOT_TOKEN && config.nodeEnv === 'production') {
    missing.push('BOT_TOKEN');
  }
  if (!process.env.DATABASE_URL && config.nodeEnv === 'production') {
    missing.push('DATABASE_URL');
  }
  if (missing.length > 0) {
    throw new Error(`Missing mandatory environment variables in production: ${missing.join(', ')}`);
  }
}


