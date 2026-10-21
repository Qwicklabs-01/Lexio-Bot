import { BotContext } from '../types.js';
import { getMainMenuKeyboard } from '../keyboards/main.menu.js';

export async function handleStart(ctx: BotContext): Promise<void> {
  const firstName = ctx.from?.first_name || 'Friend';
  const isAdmin = ctx.state?.isAdmin || false;

  const welcomeMessage =
    `👋 *Welcome to Lexio, ${firstName}!* ⚡\n` +
    `_Your Universal Knowledge & Multi-Tool Assistant_\n\n` +
    `Everything you need is built right into this bot:\n\n` +
    `🎬 *1. Universal Media Downloader*\n` +
    `• Paste any video or reel link (YouTube, Instagram, TikTok, Twitter/X) to download HD video (1080p/720p) or MP3 audio.\n\n` +
    `📊 *2. Social & Creator Analytics*\n` +
    `• Type \`/excavate @username\` to analyze viral Instagram Reels, calculate real Engagement Rates (ER%), and download full CSV spreadsheets.\n\n` +
    `🧰 *3. 100+ Multi-Tools*\n` +
    `• Developer formatters (JSON, SQL, HTML), QR generator, Base64, secure password generator, calculators (BMI, Age, EMI, Discount, Tips), and text utilities.\n\n` +
    `🚀 *Tap 'Open Lexio Studio' below* to use the full visual app inside Telegram!`;

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(isAdmin),
  });
}
