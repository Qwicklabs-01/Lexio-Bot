import { Bot, session } from 'grammy';
import { conversations } from '@grammyjs/conversations';
import { BotContext, SessionData } from './types.js';
import { config } from '../config/env.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { rateLimitMiddleware } from './middleware/rateLimit.middleware.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { handleStart } from './handlers/start.js';
import { handleMenu } from './handlers/menu.js';
import { handleHelp } from './handlers/help.js';
import {
  handleNexusMenu,
  handleIncomingMediaUrl,
  handleMediaDownloadAction,
  isMediaUrl,
} from './handlers/nexus.js';
import {
  handleFeediggerMenu,
  handleExcavateCommand,
  handleFeediggerSort,
  handleFeediggerCsvExport,
} from './handlers/feedigger.js';
import {
  handleToolBoxMenu,
  handleToolCategory,
  handleQrCommand,
  handlePasswordCommand,
  handleCalcCommand,
  handleBmiCommand,
  handleBase64Command,
} from './handlers/toolbox.js';
import {
  handleAdminPanel,
  handleBroadcastPrompt,
  handleBroadcastCommand,
  handleBroadcastConfirm,
} from './handlers/admin.js';

export function createBot(): Bot<BotContext> {
  const bot = new Bot<BotContext>(config.botToken);

  // 1. Session Storage
  bot.use(
    session({
      initial: (): SessionData => ({
        language: 'en',
      }),
    })
  );

  // 2. Plugins
  bot.use(conversations());

  // 3. Middlewares
  bot.use(loggerMiddleware);
  bot.use(rateLimitMiddleware);
  bot.use(authMiddleware);

  // 4. Command Handlers
  bot.command('start', handleStart);
  bot.command('menu', handleMenu);
  bot.command('help', handleHelp);

  // Nexus Media
  bot.command('download', async (ctx) => {
    const text = ctx.match || '';
    if (!text) {
      await ctx.reply('⚠️ Please provide a URL: `/download https://youtube.com/...`', {
        parse_mode: 'Markdown',
      });
      return;
    }
    await handleIncomingMediaUrl(ctx, text);
  });

  // Feedigger Intel
  bot.command(['excavate', 'ig'], async (ctx) => {
    const handle = ctx.match || '';
    await handleExcavateCommand(ctx, handle);
  });

  // ToolBox Pro
  bot.command('tools', handleToolBoxMenu);
  bot.command('qr', async (ctx) => handleQrCommand(ctx, ctx.match || ''));
  bot.command('password', async (ctx) => handlePasswordCommand(ctx, ctx.match || ''));
  bot.command('calc', async (ctx) => handleCalcCommand(ctx, ctx.match || ''));
  bot.command('bmi', async (ctx) => {
    const parts = (ctx.match || '').split(' ').filter(Boolean);
    await handleBmiCommand(ctx, parts[0], parts[1]);
  });
  bot.command('b64', async (ctx) => handleBase64Command(ctx, ctx.match || ''));

  // Admin Commands
  bot.command('admin', handleAdminPanel);
  bot.command('broadcast', async (ctx) => handleBroadcastCommand(ctx, ctx.match || ''));

  // 5. Callback Handlers
  bot.callbackQuery('menu_main', handleMenu);
  bot.callbackQuery('menu_help', handleHelp);
  bot.callbackQuery('menu_nexus', handleNexusMenu);
  bot.callbackQuery('menu_feedigger', handleFeediggerMenu);
  bot.callbackQuery('menu_toolbox', handleToolBoxMenu);
  bot.callbackQuery('admin_panel', handleAdminPanel);
  bot.callbackQuery('admin_broadcast_prompt', handleBroadcastPrompt);
  bot.callbackQuery('admin_broadcast_confirm', handleBroadcastConfirm);

  // Dynamic Callbacks
  bot.callbackQuery(/^tb_cat_(.+)$/, async (ctx) => {
    const category = ctx.match[1];
    await handleToolCategory(ctx, category);
  });

  bot.callbackQuery(/^dl_([^_]+)_(.+)$/, async (ctx) => {
    const downloadId = ctx.match[1];
    const format = ctx.match[2] as '1080p' | '720p' | 'mp3' | 'info';
    await handleMediaDownloadAction(ctx, downloadId, format);
  });

  bot.callbackQuery(/^fd_sort_([^_]+)_(.+)$/, async (ctx) => {
    const handle = ctx.match[1];
    const metric = ctx.match[2] as 'views' | 'likes' | 'comments' | 'er';
    await handleFeediggerSort(ctx, handle, metric);
  });

  bot.callbackQuery(/^fd_export_(.+)$/, async (ctx) => {
    const handle = ctx.match[1];
    await handleFeediggerCsvExport(ctx, handle);
  });

  // 6. Generic Text Listener (Auto-detect pasted media links)
  bot.on('message:text', async (ctx) => {
    const text = ctx.message.text;
    if (isMediaUrl(text)) {
      await handleIncomingMediaUrl(ctx, text);
    } else {
      await ctx.reply(
        `💬 *Message received!*\n\n` +
        `• Send a video link (YouTube, IG, TikTok) to download media.\n` +
        `• Type \`/excavate @username\` to analyze an Instagram profile.\n` +
        `• Type \`/menu\` to open the navigation.`,
        { parse_mode: 'Markdown' }
      );
    }
  });

  // 7. Resilient Error Handler
  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`❌ Error while handling update ${ctx.update.update_id}:`, err.error);
    try {
      ctx.reply('⚠️ An unexpected error occurred while processing your request. Please try again or use /menu.');
    } catch {}
  });

  return bot;
}
