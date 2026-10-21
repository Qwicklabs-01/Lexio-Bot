import { BotContext } from '../types.js';
import { getMainMenuKeyboard } from '../keyboards/main.menu.js';

export async function handleStart(ctx: BotContext): Promise<void> {
  const firstName = ctx.from?.first_name || 'Friend';
  const isAdmin = ctx.state?.isAdmin || false;

  const welcomeMessage =
    `👋 *Welcome to Lexio, ${firstName}!* ⚡\n` +
    `_Your Universal Multi-Tool Assistant_\n\n` +
    `All tools are built directly inside this bot:\n\n` +
    `🧰 *1. 100+ Multi-Tools Suite*\n` +
    `• Developer formatters (JSON, SQL, HTML), QR generator, Base64, secure password generator, calculators (BMI, Age, EMI, Discount, Tips, Tax), and text utilities.\n\n` +
    `🎬 *2. Universal Media Downloader*\n` +
    `• Send any video or reel link (YouTube, Instagram, TikTok, Twitter/X) to download HD video (1080p/720p) or MP3 audio directly.\n\n` +
    `📊 *3. Social & Creator Analytics*\n` +
    `• Type \`/excavate @username\` to analyze viral Instagram Reels, calculate real Engagement Rates (ER%), and download full CSV spreadsheets.\n\n` +
    `👉 *Select a tool category below to start immediately!*`;

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(isAdmin),
  });
}
