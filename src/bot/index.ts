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
  handleHashtagsCommand,
  handleHookCommand,
} from './handlers/feedigger.js';
import {
  handleToolBoxMenu,
  handleToolCategory,
  handleJsonCommand,
  handleQrCommand,
  handlePasswordCommand,
  handleCalcCommand,
  handleBmiCommand,
  handleAgeCommand,
  handleEmiCommand,
  handlePercentCommand,
  handleBase64Command,
  handleBase64DecodeCommand,
  handleUrlEncodeCommand,
  handleUrlDecodeCommand,
  handleUuidCommand,
  handleHashCommand,
  handleSlugCommand,
  handleSqlFormatCommand,
  handleHtmlCommand,
  handleJwtCommand,
  handleTimestampCommand,
  handleCaseCommand,
  handleCountCommand,
  handleReverseCommand,
  handleSortCommand,
  handleMorseCommand,
  handleLoremCommand,
  handleMetaCommand,
  handleRobotsCommand,
  handleSitemapCommand,
  handleHttpStatusCommand,
  handleHexToRgbCommand,
  handleGradientCommand,
  handleShadowCommand,
  handleDiscountCommand,
  handleTipCommand,
  handleCompoundCommand,
  handleTaxCommand,
  handleCoinCommand,
  handleDiceCommand,
  handle8BallCommand,
  handleQuoteCommand,
  handlePickCommand,
  handleRpsCommand,
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

  // 4. Core Navigation Commands
  bot.command('start', handleStart);
  bot.command('menu', handleMenu);
  bot.command('help', handleHelp);

  // Universal Media Commands
  bot.command('download', async (ctx) => {
    const text = ctx.match || '';
    if (!text) {
      await ctx.reply('⚠️ Please provide a video link: `/download https://youtube.com/...`', {
        parse_mode: 'Markdown',
      });
      return;
    }
    await handleIncomingMediaUrl(ctx, text);
  });

  // Creator & Social Analytics Commands
  bot.command(['excavate', 'ig'], async (ctx) => {
    const handle = ctx.match || '';
    await handleExcavateCommand(ctx, handle);
  });
  bot.command('hashtags', async (ctx) => handleHashtagsCommand(ctx, ctx.match || 'tech'));
  bot.command('hook', async (ctx) => handleHookCommand(ctx, ctx.match || 'viral video'));

  // Multi-Tools Commands (Comprehensive 100+ Suite)
  bot.command('tools', handleToolBoxMenu);
  bot.command('json', async (ctx) => handleJsonCommand(ctx, ctx.match || ''));
  bot.command('qr', async (ctx) => handleQrCommand(ctx, ctx.match || ''));
  bot.command('uuid', handleUuidCommand);
  bot.command('hash', async (ctx) => handleHashCommand(ctx, ctx.match || ''));
  bot.command('b64', async (ctx) => handleBase64Command(ctx, ctx.match || ''));
  bot.command('b64d', async (ctx) => handleBase64DecodeCommand(ctx, ctx.match || ''));
  bot.command('urlencode', async (ctx) => handleUrlEncodeCommand(ctx, ctx.match || ''));
  bot.command('urldecode', async (ctx) => handleUrlDecodeCommand(ctx, ctx.match || ''));
  bot.command('slug', async (ctx) => handleSlugCommand(ctx, ctx.match || ''));
  bot.command('sql', async (ctx) => handleSqlFormatCommand(ctx, ctx.match || ''));
  bot.command('html', async (ctx) => handleHtmlCommand(ctx, ctx.match || ''));
  bot.command('jwt', async (ctx) => handleJwtCommand(ctx, ctx.match || ''));
  bot.command('timestamp', async (ctx) => handleTimestampCommand(ctx, ctx.match || ''));

  // Calculators & Financial
  bot.command('calc', async (ctx) => handleCalcCommand(ctx, ctx.match || ''));
  bot.command('bmi', async (ctx) => {
    const parts = (ctx.match || '').split(' ').filter(Boolean);
    await handleBmiCommand(ctx, parts[0], parts[1]);
  });
  bot.command('age', async (ctx) => handleAgeCommand(ctx, ctx.match || ''));
  bot.command('emi', async (ctx) => {
    const parts = (ctx.match || '').split(' ').filter(Boolean);
    await handleEmiCommand(ctx, parts[0], parts[1], parts[2]);
  });
  bot.command('percent', async (ctx) => {
    const parts = (ctx.match || '').split(' ').filter(Boolean);
    await handlePercentCommand(ctx, parts[0], parts[1]);
  });
  bot.command('discount', async (ctx) => {
    const parts = (ctx.match || '').split(' ').filter(Boolean);
    await handleDiscountCommand(ctx, parts[0], parts[1]);
  });
  bot.command('tip', async (ctx) => {
    const parts = (ctx.match || '').split(' ').filter(Boolean);
    await handleTipCommand(ctx, parts[0], parts[1], parts[2]);
  });
  bot.command('compound', async (ctx) => {
    const parts = (ctx.match || '').split(' ').filter(Boolean);
    await handleCompoundCommand(ctx, parts[0], parts[1], parts[2]);
  });
  bot.command('tax', async (ctx) => {
    const parts = (ctx.match || '').split(' ').filter(Boolean);
    await handleTaxCommand(ctx, parts[0], parts[1]);
  });

  // Text Utilities
  bot.command('case', async (ctx) => handleCaseCommand(ctx, ctx.match || ''));
  bot.command('count', async (ctx) => handleCountCommand(ctx, ctx.match || ''));
  bot.command('reverse', async (ctx) => handleReverseCommand(ctx, ctx.match || ''));
  bot.command('sort', async (ctx) => handleSortCommand(ctx, ctx.match || ''));
  bot.command('morse', async (ctx) => handleMorseCommand(ctx, ctx.match || ''));
  bot.command('lorem', async (ctx) => handleLoremCommand(ctx, ctx.match || '1'));

  // SEO & Web
  bot.command('meta', async (ctx) => handleMetaCommand(ctx, ctx.match || ''));
  bot.command('robots', async (ctx) => handleRobotsCommand(ctx, ctx.match || ''));
  bot.command('sitemap', async (ctx) => handleSitemapCommand(ctx, ctx.match || ''));
  bot.command('http', async (ctx) => handleHttpStatusCommand(ctx, ctx.match || '200'));

  // Color & Design
  bot.command('hex', async (ctx) => handleHexToRgbCommand(ctx, ctx.match || '#38bdf8'));
  bot.command('gradient', handleGradientCommand);
  bot.command('shadow', handleShadowCommand);

  // Random & Games
  bot.command('password', async (ctx) => handlePasswordCommand(ctx, ctx.match || ''));
  bot.command('coin', handleCoinCommand);
  bot.command('dice', async (ctx) => handleDiceCommand(ctx, ctx.match || '6'));
  bot.command('8ball', async (ctx) => handle8BallCommand(ctx, ctx.match || ''));
  bot.command('quote', handleQuoteCommand);
  bot.command('pick', async (ctx) => handlePickCommand(ctx, ctx.match || ''));
  bot.command('rps', async (ctx) => handleRpsCommand(ctx, ctx.match || 'rock'));

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

  // Dynamic Tool Categories
  bot.callbackQuery(/^tb_cat_(.+)$/, async (ctx) => {
    const category = ctx.match[1];
    await handleToolCategory(ctx, category);
  });

  // Dynamic Single Tool Callbacks with live executions
  bot.callbackQuery('tb_tool_json', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleJsonCommand(ctx, '');
  });
  bot.callbackQuery('tb_tool_qr', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleQrCommand(ctx, 'https://t.me/LexioUniversalBot');
  });
  bot.callbackQuery('tb_tool_uuid', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleUuidCommand(ctx);
  });
  bot.callbackQuery('tb_tool_hash', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleHashCommand(ctx, 'Lexio Platform');
  });
  bot.callbackQuery('tb_tool_base64', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleBase64Command(ctx, 'Lexio Universal Assistant');
  });
  bot.callbackQuery('tb_tool_url', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleUrlEncodeCommand(ctx, 'Lexio & Multi-Tools Studio');
  });
  bot.callbackQuery('tb_tool_slug', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleSlugCommand(ctx, '10 Best Features in Lexio Bot');
  });
  bot.callbackQuery('tb_tool_sql', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleSqlFormatCommand(ctx, 'select id, name, created_at from tools where active = 1 order by id desc limit 5');
  });

  bot.callbackQuery('tb_tool_bmi', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleBmiCommand(ctx, '72', '178');
  });
  bot.callbackQuery('tb_tool_age', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleAgeCommand(ctx, '2000-01-01');
  });
  bot.callbackQuery('tb_tool_emi', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleEmiCommand(ctx, '50000', '8.5', '5');
  });
  bot.callbackQuery('tb_tool_percent', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handlePercentCommand(ctx, '20', '450');
  });
  bot.callbackQuery('tb_tool_discount', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleDiscountCommand(ctx, '120', '25');
  });
  bot.callbackQuery('tb_tool_tip', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleTipCommand(ctx, '150', '18', '3');
  });
  bot.callbackQuery('tb_tool_compound', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleCompoundCommand(ctx, '10000', '7', '10');
  });
  bot.callbackQuery('tb_tool_tax', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleTaxCommand(ctx, '1200', '18');
  });

  bot.callbackQuery('tb_tool_case', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleCaseCommand(ctx, 'lexio universal assistant');
  });
  bot.callbackQuery('tb_tool_count', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleCountCommand(ctx, 'Lexio is your all-in-one assistant powered by advanced artificial intelligence.');
  });
  bot.callbackQuery('tb_tool_reverse', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleReverseCommand(ctx, 'Universal Intelligence');
  });
  bot.callbackQuery('tb_tool_sort', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleSortCommand(ctx, 'Zebra, Apple, Mango, Banana, Orange');
  });
  bot.callbackQuery('tb_tool_morse', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleMorseCommand(ctx, 'SOS LEXIO');
  });
  bot.callbackQuery('tb_tool_lorem', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleLoremCommand(ctx, '1');
  });

  bot.callbackQuery('tb_tool_meta', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleMetaCommand(ctx, 'Lexio Studio | Universal Assistant | https://t.me/LexioUniversalBot');
  });
  bot.callbackQuery('tb_tool_robots', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleRobotsCommand(ctx, 'https://lexio.bot');
  });
  bot.callbackQuery('tb_tool_sitemap', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleSitemapCommand(ctx, 'https://lexio.bot');
  });
  bot.callbackQuery('tb_tool_keyword', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleCountCommand(ctx, 'Lexio bot tools assistant universal multi tools platform intelligence');
  });
  bot.callbackQuery('tb_tool_og', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleMetaCommand(ctx, 'Lexio Studio | Universal Tools | https://t.me/LexioUniversalBot');
  });
  bot.callbackQuery('tb_tool_http', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleHttpStatusCommand(ctx, '200');
  });

  bot.callbackQuery('tb_tool_hextorgb', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleHexToRgbCommand(ctx, '#38bdf8');
  });
  bot.callbackQuery('tb_tool_gradient', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleGradientCommand(ctx);
  });
  bot.callbackQuery('tb_tool_shadow', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleShadowCommand(ctx);
  });
  bot.callbackQuery('tb_tool_button', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleShadowCommand(ctx);
  });
  bot.callbackQuery('tb_tool_contrast', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleHexToRgbCommand(ctx, '#ffffff');
  });
  bot.callbackQuery('tb_tool_filters', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleGradientCommand(ctx);
  });

  bot.callbackQuery('tb_tool_coin', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleCoinCommand(ctx);
  });
  bot.callbackQuery('tb_tool_dice', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleDiceCommand(ctx, '6');
  });
  bot.callbackQuery('tb_tool_8ball', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handle8BallCommand(ctx, 'Will Lexio assist millions of users worldwide?');
  });
  bot.callbackQuery('tb_tool_quote', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleQuoteCommand(ctx);
  });
  bot.callbackQuery('tb_tool_pick', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handlePickCommand(ctx, 'Build an app, Learn TypeScript, Deploy to Cloud');
  });
  bot.callbackQuery('tb_tool_password', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handlePasswordCommand(ctx, '18');
  });

  bot.callbackQuery(/^fd_tags_(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleHashtagsCommand(ctx, 'creator');
  });
  bot.callbackQuery(/^fd_hook_(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleHookCommand(ctx, 'creator content');
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
        `• Type \`/tools\` to open the 100+ utilities directory.\n` +
        `• Type \`/help\` to view all commands & shortcuts.\n` +
        `• Type \`/menu\` to open the main navigation.`,
        { parse_mode: 'Markdown' }
      );
    }
  });

  // 7. Resilient Global Error Handler
  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`❌ Error while handling update ${ctx.update.update_id}:`, err.error);
    try {
      ctx.reply('⚠️ An unexpected error occurred while processing your request. Please try again or use /menu.');
    } catch {}
  });

  return bot;
}
