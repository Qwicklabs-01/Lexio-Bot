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
  handleInfoCommand,
  handleAudioCommand,
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
  handleUnitCommand,
  handleStatsCommand,
  handleGpaCommand,
  handleScientificCommand,
  handleBinaryCommand,
  handleMarkdownToHtmlCommand,
  handleMinifyHtmlCommand,
  handleKeywordDensityCommand,
  handleMaterialPaletteCommand,
  handlePomodoroCommand,
  handleTodoCommand,
  handleRemoveCharCommand,
  handleOcrCommand,
  handleNeumorphismCommand,
  handleMeshGradientCommand,
  handleEssayWriterCommand,
  handleHumanizerCommand,
  handleLinkedInCommand,
  handleOutlierCommand,
  handleScraperCommand,
  handleArchiverCommand,
  handleStixCommand,
  handleDesignLibCommand,
  handleMultiAgentCommand,
  handleNumerologyCommand,
} from './handlers/toolbox.js';
import { getMainMenuKeyboard } from './keyboards/main.menu.js';
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
  bot.command('tasks', handleMenu);

  bot.command(['media', 'nexus'], handleNexusMenu);
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
  bot.command('audio', async (ctx) => handleAudioCommand(ctx, ctx.match || ''));
  bot.command('info', async (ctx) => handleInfoCommand(ctx, ctx.match || ''));

  // Creator & Social Analytics Commands
  bot.command(['excavate', 'ig'], async (ctx) => {
    const handle = ctx.match || '';
    await handleExcavateCommand(ctx, handle);
  });
  bot.command('hashtags', async (ctx) => handleHashtagsCommand(ctx, ctx.match || 'tech'));
  bot.command('hook', async (ctx) => handleHookCommand(ctx, ctx.match || 'viral video'));

  // Multi-Tools Commands (100+ Complete Suite)
  bot.command('tools', handleToolBoxMenu);
  bot.command('json', async (ctx) => handleJsonCommand(ctx, ctx.match || ''));
  bot.command('qr', async (ctx) => handleQrCommand(ctx, ctx.match || ''));
  bot.command('uuid', handleUuidCommand);
  bot.command('hash', async (ctx) => handleHashCommand(ctx, ctx.match || ''));
  bot.command('b64', async (ctx) => handleBase64Command(ctx, ctx.match || ''));
  bot.command('b64d', async (ctx) => handleBase64DecodeCommand(ctx, ctx.match || ''));
  bot.command('binary', async (ctx) => handleBinaryCommand(ctx, ctx.match || ''));
  bot.command('urlencode', async (ctx) => handleUrlEncodeCommand(ctx, ctx.match || ''));
  bot.command('urldecode', async (ctx) => handleUrlDecodeCommand(ctx, ctx.match || ''));
  bot.command('slug', async (ctx) => handleSlugCommand(ctx, ctx.match || ''));
  bot.command('sql', async (ctx) => handleSqlFormatCommand(ctx, ctx.match || ''));
  bot.command('md2html', async (ctx) => handleMarkdownToHtmlCommand(ctx, ctx.match || ''));
  bot.command('minhtml', async (ctx) => handleMinifyHtmlCommand(ctx, ctx.match || ''));
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
  bot.command('unit', async (ctx) => {
    const parts = (ctx.match || '').split(' ').filter(Boolean);
    await handleUnitCommand(ctx, parts[0], parts[1], parts[2]);
  });
  bot.command('stats', async (ctx) => handleStatsCommand(ctx, ctx.match || ''));
  bot.command('gpa', async (ctx) => handleGpaCommand(ctx, ctx.match || ''));
  bot.command('sci', async (ctx) => handleScientificCommand(ctx, ctx.match || ''));

  // Text Utilities
  bot.command('case', async (ctx) => handleCaseCommand(ctx, ctx.match || ''));
  bot.command('count', async (ctx) => handleCountCommand(ctx, ctx.match || ''));
  bot.command('reverse', async (ctx) => handleReverseCommand(ctx, ctx.match || ''));
  bot.command('sort', async (ctx) => handleSortCommand(ctx, ctx.match || ''));
  bot.command('morse', async (ctx) => handleMorseCommand(ctx, ctx.match || ''));
  bot.command('lorem', async (ctx) => handleLoremCommand(ctx, ctx.match || '1'));
  bot.command('removechar', async (ctx) => handleRemoveCharCommand(ctx, ctx.match || ''));

  // SEO & Web
  bot.command('meta', async (ctx) => handleMetaCommand(ctx, ctx.match || ''));
  bot.command('robots', async (ctx) => handleRobotsCommand(ctx, ctx.match || ''));
  bot.command('sitemap', async (ctx) => handleSitemapCommand(ctx, ctx.match || ''));
  bot.command('keywords', async (ctx) => handleKeywordDensityCommand(ctx, ctx.match || ''));
  bot.command('http', async (ctx) => handleHttpStatusCommand(ctx, ctx.match || '200'));

  // Color & Design
  bot.command('hex', async (ctx) => handleHexToRgbCommand(ctx, ctx.match || '#38bdf8'));
  bot.command('gradient', handleGradientCommand);
  bot.command('shadow', handleShadowCommand);
  bot.command('palette', async (ctx) => handleMaterialPaletteCommand(ctx, ctx.match || 'blue'));

  // Productivity & Tasks
  bot.command('password', async (ctx) => handlePasswordCommand(ctx, ctx.match || ''));
  bot.command('pomodoro', handlePomodoroCommand);
  bot.command('todo', async (ctx) => handleTodoCommand(ctx, ctx.match || ''));

  // Random & Games
  bot.command('coin', handleCoinCommand);
  bot.command('dice', async (ctx) => handleDiceCommand(ctx, ctx.match || '6'));
  bot.command('8ball', async (ctx) => handle8BallCommand(ctx, ctx.match || ''));
  bot.command('quote', handleQuoteCommand);
  bot.command('pick', async (ctx) => handlePickCommand(ctx, ctx.match || ''));
  bot.command('rps', async (ctx) => handleRpsCommand(ctx, ctx.match || 'rock'));

  // Admin Commands
  // Specialized PDF, Writing & Design Tools
  bot.command('ocr', handleOcrCommand);
  bot.command(['neo', 'neumorphism'], handleNeumorphismCommand);
  bot.command(['mesh', 'meshgradient'], handleMeshGradientCommand);
  bot.command('essay', async (ctx) => handleEssayWriterCommand(ctx, ctx.match || ''));
  bot.command('humanize', async (ctx) => handleHumanizerCommand(ctx, ctx.match || ''));

  // Multiple-Tool-2 Intelligence Suite
  bot.command(['linkedin', 'drafter'], async (ctx) => handleLinkedInCommand(ctx, ctx.match || ''));
  bot.command(['outlier', 'breakout'], async (ctx) => handleOutlierCommand(ctx, ctx.match || ''));
  bot.command(['scrape', 'scraper'], async (ctx) => handleScraperCommand(ctx, ctx.match || ''));
  bot.command(['archiver', 'webarchive'], async (ctx) => handleArchiverCommand(ctx, ctx.match || ''));
  bot.command(['stix', 'threatintel'], async (ctx) => handleStixCommand(ctx, ctx.match || ''));
  bot.command(['designlib', 'tokens'], async (ctx) => handleDesignLibCommand(ctx, ctx.match || ''));
  bot.command(['agent', 'multiagent', 'pipeline'], async (ctx) => handleMultiAgentCommand(ctx, ctx.match || ''));
  bot.command(['numerology', 'num', 'losho'], async (ctx) => {
    const raw = ctx.match || '';
    const parts = raw.split(/\s+/).filter(Boolean);
    const dob = parts[0] || '1998-05-15';
    const name = parts[1] || 'Sakshi';
    const gender = parts[2] || 'female';
    await handleNumerologyCommand(ctx, dob, name, gender);
  });

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

  // New Specialized Tool Callbacks
  bot.callbackQuery('tb_tool_ocr', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleOcrCommand(ctx);
  });
  bot.callbackQuery('tb_tool_neumorphism', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleNeumorphismCommand(ctx);
  });
  bot.callbackQuery('tb_tool_meshgrad', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleMeshGradientCommand(ctx);
  });
  bot.callbackQuery('tb_tool_essay', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleEssayWriterCommand(ctx);
  });
  bot.callbackQuery('tb_tool_humanizer', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleHumanizerCommand(ctx);
  });
  bot.callbackQuery('tb_tool_linkedin', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleLinkedInCommand(ctx);
  });
  bot.callbackQuery('tb_tool_outlier', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleOutlierCommand(ctx);
  });
  bot.callbackQuery('tb_tool_scraper', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleScraperCommand(ctx);
  });
  bot.callbackQuery('tb_tool_archiver', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleArchiverCommand(ctx);
  });
  bot.callbackQuery('tb_tool_stix', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleStixCommand(ctx);
  });
  bot.callbackQuery('tb_tool_designlib', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleDesignLibCommand(ctx);
  });
  bot.callbackQuery('tb_tool_multiagent', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleMultiAgentCommand(ctx);
  });
  bot.callbackQuery('tb_tool_numerology', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleNumerologyCommand(ctx);
  });

  // Dynamic fallback for any other tb_tool_*
  bot.callbackQuery(/^tb_tool_(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const toolId = ctx.match[1];
    const { getValidHttpsMiniAppUrl } = await import('../config/env.js');
    const { InlineKeyboard } = await import('grammy');
    const url = getValidHttpsMiniAppUrl(`?tab=toolbox&tool=${toolId}`);
    await ctx.reply(
      '⚡ *Tool Ready:* `' + toolId.toUpperCase() + '`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nExecute this tool directly inside your in-bot Telegram page:',
      {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard().webApp('🚀 Open Tool in Bot Page', url)
      }
    );
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
    await handlePasswordCommand(ctx, '16');
  });
  bot.callbackQuery('tb_tool_rps', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleRpsCommand(ctx, 'rock');
  });

  // Additional Task Callbacks
  bot.callbackQuery('tb_tool_binary', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleBinaryCommand(ctx, 'Lexio');
  });
  bot.callbackQuery('tb_tool_md2html', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleMarkdownToHtmlCommand(ctx);
  });
  bot.callbackQuery('tb_tool_minhtml', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleMinifyHtmlCommand(ctx);
  });
  bot.callbackQuery('tb_tool_unit', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleUnitCommand(ctx, '5', 'mi', 'km');
  });
  bot.callbackQuery('tb_tool_stats', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleStatsCommand(ctx, '12, 15, 23, 45, 12, 30, 18');
  });
  bot.callbackQuery('tb_tool_gpa', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleGpaCommand(ctx, 'A, A-, B+, A, B');
  });
  bot.callbackQuery('tb_tool_sci', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleScientificCommand(ctx, 'sqrt(144) + pow(2, 6)');
  });
  bot.callbackQuery('tb_tool_keywords', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleKeywordDensityCommand(ctx);
  });
  bot.callbackQuery('tb_tool_palette', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleMaterialPaletteCommand(ctx, 'blue');
  });
  bot.callbackQuery('tb_tool_pomodoro', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handlePomodoroCommand(ctx);
  });
  bot.callbackQuery('tb_tool_todo', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleTodoCommand(ctx);
  });
  bot.callbackQuery('tb_tool_removechar', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleRemoveCharCommand(ctx);
  });

  // Media & Social Demo Callbacks
  bot.callbackQuery('dl_sample_yt', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleIncomingMediaUrl(ctx, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  });
  bot.callbackQuery('dl_sample_ig', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleIncomingMediaUrl(ctx, 'https://www.instagram.com/reel/C7x90ABc1/');
  });
  bot.callbackQuery('fd_demo_mrbeast', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleExcavateCommand(ctx, 'mrbeast');
  });
  bot.callbackQuery('fd_demo_instagram', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleExcavateCommand(ctx, 'instagram');
  });

  // Dynamic Rerun & Preset Tool Actions (Instant in-chat execution)
  bot.callbackQuery(/^tb_run_(.+)$/, async (ctx) => {
    const action = ctx.match[1];
    if (action === 'coin') return handleCoinCommand(ctx);
    if (action.startsWith('dice_')) return handleDiceCommand(ctx, action.replace('dice_', ''));
    if (action.startsWith('pw_')) return handlePasswordCommand(ctx, action.replace('pw_', ''));
    if (action === 'quote') return handleQuoteCommand(ctx);
    if (action === 'uuid') return handleUuidCommand(ctx);
    if (action === 'gradient') return handleGradientCommand(ctx);
    if (action === 'shadow') return handleShadowCommand(ctx);
    if (action === '8ball') return handle8BallCommand(ctx, '');
    if (action.startsWith('rps_')) return handleRpsCommand(ctx, action.replace('rps_', ''));
    if (action === 'bmi_65_172') return handleBmiCommand(ctx, '65', '172');
    if (action === 'bmi_85_180') return handleBmiCommand(ctx, '85', '180');
    if (action === 'age_1998') return handleAgeCommand(ctx, '1998-05-15');
    if (action === 'age_2002') return handleAgeCommand(ctx, '2002-10-20');
    if (action === 'emi_25_7_3') return handleEmiCommand(ctx, '25000', '7', '3');
    if (action === 'emi_100_9_10') return handleEmiCommand(ctx, '100000', '9', '10');
    if (action === 'pct_15_200') return handlePercentCommand(ctx, '15', '200');
    if (action === 'pct_25_800') return handlePercentCommand(ctx, '25', '800');
    if (action === 'disc_80_20') return handleDiscountCommand(ctx, '80', '20');
    if (action === 'disc_250_50') return handleDiscountCommand(ctx, '250', '50');
    if (action === 'tip_100_15_2') return handleTipCommand(ctx, '100', '15', '2');
    if (action === 'tip_200_20_4') return handleTipCommand(ctx, '200', '20', '4');
    if (action === 'comp_5_8_5') return handleCompoundCommand(ctx, '5000', '8', '5');
    if (action === 'comp_20_10_15') return handleCompoundCommand(ctx, '20000', '10', '15');
    if (action === 'tax_500_10') return handleTaxCommand(ctx, '500', '10');
    if (action === 'tax_2000_18') return handleTaxCommand(ctx, '2000', '18');
    if (action === 'u_5mi_km') return handleUnitCommand(ctx, '5', 'mi', 'km');
    if (action === 'u_100cm_in') return handleUnitCommand(ctx, '100', 'cm', 'in');
    if (action === 'u_70kg_lbs') return handleUnitCommand(ctx, '70', 'kg', 'lbs');
    if (action === 'u_37c_f') return handleUnitCommand(ctx, '37', 'c', 'f');
    if (action === 'stats_a') return handleStatsCommand(ctx, '10, 25, 40, 15, 30, 25');
    if (action === 'stats_b') return handleStatsCommand(ctx, '5, 8, 12, 19, 24, 30, 45');
    if (action === 'gpa_top') return handleGpaCommand(ctx, 'A, A, A, A-');
    if (action === 'gpa_mid') return handleGpaCommand(ctx, 'B+, B, B-, A-');
    if (action === 'sci_sqrt') return handleScientificCommand(ctx, 'sqrt(144)');
    if (action === 'sci_pow') return handleScientificCommand(ctx, 'pow(2, 10)');
    if (action === 'sci_sin') return handleScientificCommand(ctx, 'sin(90)');
    if (action === 'bin_hello') return handleBinaryCommand(ctx, 'Hello');
    if (action === 'bin_code') return handleBinaryCommand(ctx, 'Code');
    if (action === 'pal_blue') return handleMaterialPaletteCommand(ctx, 'blue');
    if (action === 'pal_green') return handleMaterialPaletteCommand(ctx, 'green');
    if (action === 'pal_purple') return handleMaterialPaletteCommand(ctx, 'purple');
    if (action === 'pal_amber') return handleMaterialPaletteCommand(ctx, 'amber');
    if (action === 'pomo_25') return handlePomodoroCommand(ctx);
    if (action === 'pomo_5') return handlePomodoroCommand(ctx);
    if (action === 'pomo_15') return handlePomodoroCommand(ctx);
    if (action === 'todo_demo') return handleTodoCommand(ctx, 'Review project tools');
    if (action.startsWith('lorem_')) return handleLoremCommand(ctx, action.replace('lorem_', ''));
    if (action.startsWith('http_')) return handleHttpStatusCommand(ctx, action.replace('http_', ''));
    if (action.startsWith('hex_')) return handleHexToRgbCommand(ctx, '#' + action.replace('hex_', ''));
    if (action === 'hash_lexio') return handleHashCommand(ctx, 'Lexio');
    if (action === 'hash_pass') return handleHashCommand(ctx, 'Password123');
    if (action.startsWith('li_')) return handleLinkedInCommand(ctx);
    if (action === 'outlier_refresh') return handleOutlierCommand(ctx);
    if (action === 'scraper_csv' || action === 'scraper_refresh') return handleScraperCommand(ctx);
    if (action === 'archiver_refresh') return handleArchiverCommand(ctx);
    if (action.startsWith('dslib_')) return handleDesignLibCommand(ctx, action.replace('dslib_', ''));
    if (action === 'multiagent_run') return handleMultiAgentCommand(ctx);
    if (action === 'num_sample') return handleNumerologyCommand(ctx, '1998-05-15', 'Sakshi', 'female');
    if (action === 'num_2000') return handleNumerologyCommand(ctx, '2000-01-01', 'Alexander', 'male');
  });

  bot.callbackQuery(/^fd_tags_(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleHashtagsCommand(ctx, 'creator');
  });
  bot.callbackQuery(/^fd_hook_(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleHookCommand(ctx, 'creator content');
  });

  bot.callbackQuery('dl_sample_yt', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleIncomingMediaUrl(ctx, 'https://youtube.com/watch?v=sample1080p');
  });
  bot.callbackQuery('dl_sample_ig', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleIncomingMediaUrl(ctx, 'https://instagram.com/reel/sample_reel');
  });
  bot.callbackQuery('dl_sample_tt', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleIncomingMediaUrl(ctx, 'https://tiktok.com/@creator/video/sample_hd');
  });
  bot.callbackQuery('dl_sample_tw', async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleIncomingMediaUrl(ctx, 'https://x.com/creator/status/sample_clip');
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

  // 6. Generic Text Listener (Smart Task Intent Detector)
  bot.on('message:text', async (ctx) => {
    const text = ctx.message.text.trim();
    const lower = text.toLowerCase();

    // Fast-path for menu shortcuts
    if (
      text === '🧰 Choose Task / Tool' ||
      text === '🧰 All Tools' ||
      text === '🧰 All Tool Categories' ||
      text === '🧰 100+ Multi-Tools' ||
      lower === 'tools' ||
      lower === 'tasks' ||
      lower === 'menu'
    ) {
      return handleMenu(ctx);
    }
    if (text === '🎬 Media Downloader' || lower === 'download') {
      return handleNexusMenu(ctx);
    }
    if (text === '📊 Creator Analytics' || text === '📊 Social Analytics' || lower === 'social' || lower === 'analytics') {
      return handleFeediggerMenu(ctx);
    }
    if (text === '📖 Task Directory' || text === '❓ Help & Commands' || lower === 'help') {
      return handleHelp(ctx);
    }

    // Natural conversation greetings
    if (['hi', 'hello', 'hey', 'start', 'yo', 'hola'].includes(lower)) {
      const firstName = ctx.from?.first_name || 'Friend';
      return ctx.reply(
        `⚡ *LEXIO MULTI-TOOL ASSISTANT*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👋 Hello, *${firstName}*! What task do you need to complete today?\n\n` +
        `Select your task category below to run any tool inside this chat:`,
        {
          parse_mode: 'Markdown',
          reply_markup: getMainMenuKeyboard(ctx.state?.isAdmin || false),
        }
      );
    }

    // Auto-detect math expressions (e.g. 150 * 20 or 25 + 40 / 2)
    if (/^[0-9+\-*/().% ]+$/.test(text) && /[+\-*/%]/.test(text) && !isNaN(Number(text.charAt(0)))) {
      return handleCalcCommand(ctx, text);
    }

    // Smart Task Intent Matching
    if (lower.includes('emi') || lower.includes('loan')) {
      return handleEmiCommand(ctx);
    }
    if (lower.includes('bmi') || lower.includes('body mass')) {
      return handleBmiCommand(ctx);
    }
    if (lower.includes('age') || lower.includes('birthday')) {
      return handleAgeCommand(ctx);
    }
    if (lower.includes('unit') || lower.includes('convert miles') || lower.includes('convert km')) {
      return handleUnitCommand(ctx);
    }
    if (lower.includes('stats') || lower.includes('mean') || lower.includes('median')) {
      return handleStatsCommand(ctx);
    }
    if (lower.includes('gpa') || lower.includes('grade')) {
      return handleGpaCommand(ctx);
    }
    if (lower.includes('qr') || lower.includes('barcode')) {
      return handleQrCommand(ctx, text);
    }
    if (lower.includes('password') || lower.includes('pass')) {
      return handlePasswordCommand(ctx, '16');
    }
    if (lower.includes('json')) {
      return handleJsonCommand(ctx, text);
    }
    if (lower.includes('binary')) {
      return handleBinaryCommand(ctx, text);
    }
    if (lower.includes('hex') || lower.includes('rgb') || lower.startsWith('#')) {
      return handleHexToRgbCommand(ctx, text.includes('#') ? text : '#38bdf8');
    }
    if (lower.includes('gradient')) {
      return handleGradientCommand(ctx);
    }
    if (lower.includes('shadow')) {
      return handleShadowCommand(ctx);
    }
    if (lower.includes('coin') || lower.includes('flip')) {
      return handleCoinCommand(ctx);
    }
    if (lower.includes('dice') || lower.includes('roll')) {
      return handleDiceCommand(ctx, '6');
    }
    if (lower.includes('quote')) {
      return handleQuoteCommand(ctx);
    }
    if (lower.includes('pomodoro') || lower.includes('focus')) {
      return handlePomodoroCommand(ctx);
    }
    if (lower.includes('todo') || lower.includes('task')) {
      return handleTodoCommand(ctx, text);
    }
    if (lower.includes('hashtag')) {
      return handleHashtagsCommand(ctx, 'creator');
    }
    if (lower.includes('hook')) {
      return handleHookCommand(ctx, 'viral video');
    }
    if (lower.includes('linkedin') || lower.includes('drafter')) {
      return handleLinkedInCommand(ctx, text);
    }
    if (lower.includes('outlier') || lower.includes('viral ratio')) {
      return handleOutlierCommand(ctx, text);
    }
    if (lower.includes('scrape') || lower.includes('scraper')) {
      return handleScraperCommand(ctx, text);
    }
    if (lower.includes('archiver') || lower.includes('archive web')) {
      return handleArchiverCommand(ctx, text);
    }
    if (lower.includes('stix') || lower.includes('threat intel')) {
      return handleStixCommand(ctx, text);
    }
    if (lower.includes('designlib') || lower.includes('design system')) {
      return handleDesignLibCommand(ctx, text);
    }
    if (lower.includes('multiagent') || lower.includes('agent pipeline')) {
      return handleMultiAgentCommand(ctx, text);
    }
    if (
      lower.includes('numerology') ||
      lower.includes('mulank') ||
      lower.includes('bhagyank') ||
      lower.includes('lo shu') ||
      lower.includes('kua number')
    ) {
      return handleNumerologyCommand(ctx, text);
    }

    if (isMediaUrl(text)) {
      await handleIncomingMediaUrl(ctx, text);
    } else {
      await ctx.reply(
        `💡 *WHAT TASK DO YOU WANT TO COMPLETE?*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `• 💻 *Code & Dev:* Format JSON/SQL, QR generator, UUID, Hashes\n` +
        `• 🧮 *Math & Finance:* Calculate Loan EMI, BMI, Age, Units, Stats\n` +
        `• 🎬 *Media Downloads:* Paste any YouTube, Reel, or TikTok video link\n` +
        `• 📊 *Creator Analytics:* Type \`/excavate @username\`\n\n` +
        `👇 Select a task suite below to proceed:`,
        {
          parse_mode: 'Markdown',
          reply_markup: getMainMenuKeyboard(ctx.state?.isAdmin || false),
        }
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
