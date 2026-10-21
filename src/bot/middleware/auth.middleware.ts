import { MiddlewareFn } from 'grammy';
import { BotContext, UserState } from '../types.js';
import { config } from '../../config/env.js';
import { prisma } from '../../database/client.js';

export const authMiddleware: MiddlewareFn<BotContext> = async (ctx, next) => {
  ctx.state = ctx.state || {};

  const from = ctx.from;
  if (!from) {
    return next();
  }

  const telegramId = from.id.toString();
  const isAdmin = config.adminIds.includes(telegramId);

  let dbUser: UserState;

  try {
    const existing = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (existing) {
      if (existing.isBlocked) {
        await ctx.reply('🚫 *Your account has been suspended.* Contact support for inquiries.', {
          parse_mode: 'Markdown',
        });
        return;
      }

      // Update username or name if changed
      if (existing.username !== from.username || existing.firstName !== from.first_name) {
        await prisma.user.update({
          where: { telegramId },
          data: {
            username: from.username || null,
            firstName: from.first_name || null,
            lastName: from.last_name || null,
          },
        });
      }

      dbUser = {
        id: existing.id,
        telegramId: existing.telegramId,
        username: existing.username,
        firstName: existing.firstName,
        role: isAdmin ? 'ADMIN' : (existing.role as any),
        isAdmin: isAdmin || existing.role === 'ADMIN',
      };
    } else {
      // First-time registration
      const created = await prisma.user.create({
        data: {
          telegramId,
          username: from.username || null,
          firstName: from.first_name || null,
          lastName: from.last_name || null,
          languageCode: from.language_code || 'en',
          role: isAdmin ? 'ADMIN' : 'USER',
        },
      });

      dbUser = {
        id: created.id,
        telegramId: created.telegramId,
        username: created.username,
        firstName: created.firstName,
        role: created.role as any,
        isAdmin,
      };
    }
  } catch (err) {
    // Fallback if DB is disconnected in mock/local mode
    dbUser = {
      id: `local-${telegramId}`,
      telegramId,
      username: from.username || null,
      firstName: from.first_name || null,
      role: isAdmin ? 'ADMIN' : 'USER',
      isAdmin,
    };
  }

  ctx.state.user = dbUser;
  ctx.state.isAdmin = dbUser.isAdmin;

  return next();
};
