import { BotContext } from '../types.js';
import { getMainMenuKeyboard, getPersistentReplyKeyboard } from '../keyboards/main.menu.js';

export async function handleStart(ctx: BotContext): Promise<void> {
  const firstName = ctx.from?.first_name || 'Friend';
  const isAdmin = ctx.state?.isAdmin || false;

  const welcomeMessage =
    `⚡ *LEXIO UNIVERSAL ASSISTANT*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👋 Welcome, *${firstName}*! All tools run directly inside Telegram with zero external redirects.\n\n` +
    `🌟 *Featured Capabilities:*\n` +
    `• 🎬 *Media Grabber:* 1080p Video & 320kbps MP3 (YouTube, Reels, TikTok)\n` +
    `• 📊 *Creator Intel:* Instagram analytics, viral ER% audit & CSV export\n` +
    `• 💻 *Developer Suite:* JSON, QR, UUID, Hashes, Base64, SQL, STIX\n` +
    `• 🧮 *Math & Finance:* Loan EMI, BMI, Currency, Unit conversions & Stats\n` +
    `• 📄 *PDF Master:* OCR extraction, document conversion & compression\n` +
    `• ✍️ *AI Writing & Polish:* Anti-AI humanizer, Essay outlines, LinkedIn hooks\n` +
    `• 🎨 *Design & CSS:* Modern gradients, box-shadows, palettes\n` +
    `• ⚡ *Productivity:* 256-bit passwords, Pomodoro timer, Task keeper\n\n` +
    `👇 *Tap 'Launch Lexio Studio' for full WebApp, or choose a category below:*`;

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(isAdmin),
  });

  // Activate Telegram's persistent bottom reply keyboard silently (no audio interruption)
  await ctx.reply('⚡ *Quick-access dock active.* You can also tap the keyboard buttons below at any time.', {
    parse_mode: 'Markdown',
    disable_notification: true,
    reply_markup: getPersistentReplyKeyboard(),
  });
}

