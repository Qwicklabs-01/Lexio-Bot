import { MiddlewareFn } from 'grammy';
import { BotContext } from '../types.js';

export const loggerMiddleware: MiddlewareFn<BotContext> = async (ctx, next) => {
  const start = Date.now();
  const userId = ctx.from?.id;
  const username = ctx.from?.username ? `@${ctx.from.username}` : 'anonymous';
  const updateType = Object.keys(ctx.update).filter((k) => k !== 'update_id')[0] || 'unknown';

  let summary = `[Update ${ctx.update.update_id}] Type: ${updateType} | User: ${userId} (${username})`;

  if (ctx.message?.text) {
    summary += ` | Text: "${ctx.message.text.substring(0, 30)}"`;
  } else if (ctx.callbackQuery?.data) {
    summary += ` | Callback: "${ctx.callbackQuery.data}"`;
  }

  console.log(`➡️  ${summary}`);

  try {
    await next();
  } catch (error) {
    console.error(`❌ Error processing update ${ctx.update.update_id}:`, error);
    throw error;
  } finally {
    const duration = Date.now() - start;
    console.log(`⬅️  [Update ${ctx.update.update_id}] Processed in ${duration}ms`);
  }
};
