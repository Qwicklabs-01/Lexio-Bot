import { MiddlewareFn } from 'grammy';
import { BotContext } from '../types.js';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const userRequestMap = new Map<number, RateLimitEntry>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // Max 30 updates per minute per user

export const rateLimitMiddleware: MiddlewareFn<BotContext> = async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) {
    return next();
  }

  const now = Date.now();
  let entry = userRequestMap.get(userId);

  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    userRequestMap.set(userId, entry);
  } else {
    entry.count += 1;
  }

  if (entry.count > MAX_REQUESTS) {
    console.warn(`⚠️ Rate limit exceeded for Telegram user ${userId} (${entry.count} requests)`);
    if (entry.count === MAX_REQUESTS + 1) {
      await ctx.reply(
        '⚠️ *Rate limit reached*\n\nYou are sending requests too quickly. Please pause for a few seconds before trying again.',
        { parse_mode: 'Markdown' }
      );
    }
    return; // Drop update
  }

  return next();
};
