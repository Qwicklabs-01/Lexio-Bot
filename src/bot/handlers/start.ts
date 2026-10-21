import { BotContext } from '../types.js';
import { getMainMenuKeyboard } from '../keyboards/main.menu.js';

export async function handleStart(ctx: BotContext): Promise<void> {
  const firstName = ctx.from?.first_name || 'Friend';
  const isAdmin = ctx.state?.isAdmin || false;

  const welcomeMessage =
    `👋 *Welcome to Lexio, ${firstName}!* ⚡\n` +
    `_Your Universal Knowledge & Multi-Tool Assistant_\n\n` +
    `I bring together universal media downloads, creator analytics, and 100+ utilities into one seamless bot:\n\n` +
    `⚡ *1. Nexus Media Downloader*\n` +
    `• Paste any video link from YouTube, Instagram, TikTok, or Twitter/X to download HD video (1080p/720p) or MP3 audio.\n\n` +
    `🔍 *2. Feedigger Social Intelligence*\n` +
    `• Type \`/excavate @username\` to sort Reels by Views, Likes, Comments & ER%, and export structured CSV reports.\n\n` +
    `🧰 *3. ToolBox Pro (100+ Utilities)*\n` +
    `• Instant code formatters (JSON, SQL), QR generator, Base64, Password Generator, and financial/health calculators.\n\n` +
    `🚀 *Tap 'Open Lexio Studio' below* to launch the full mobile & desktop Mini App!`;

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(isAdmin),
  });
}
