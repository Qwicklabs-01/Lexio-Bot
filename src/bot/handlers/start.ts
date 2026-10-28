import { BotContext } from '../types.js';
import { getMainMenuKeyboard, getPersistentReplyKeyboard } from '../keyboards/main.menu.js';
import { escapeMarkdown } from '../utils/markdown.js';

export async function handleStart(ctx: BotContext): Promise<void> {
  const firstName = escapeMarkdown(ctx.from?.first_name || 'Friend');
  const isAdmin = ctx.state?.isAdmin || false;

  const welcomeMessage =
    `⚡ *LEXIO UNIVERSAL ASSISTANT*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👋 Welcome, *${firstName}*! Over 126+ powerful tools running directly inside Telegram.\n\n` +
    `🌟 *Featured Suites:*\n` +
    `• 🎬 *Media Grabber:* 1080p HD & 320kbps MP3 (YouTube, Reels, TikTok)\n` +
    `• 📊 *Creator Intel:* Instagram analytics, viral ER% audit & CSV export\n` +
    `• 💻 *Developer Suite:* JSON, QR, UUID, Hashes, Base64, SQL, STIX\n` +
    `• 🧮 *Math & Finance:* Loan EMI, BMI, Currency, Unit conversions & Stats\n` +
    `• 📄 *PDF Master:* OCR extraction, document conversion & compression\n` +
    `• ✍️ *AI Writing & Polish:* Anti-AI humanizer, Essay outlines, LinkedIn hooks\n` +
    `• 🎨 *Design & CSS:* Modern gradients, box-shadows, palettes, Neumorphism\n` +
    `• ⚡ *Productivity:* 256-bit passwords, Pomodoro timer, Task keeper\n\n` +
    `👇 *Tap 'Launch Lexio Studio' for full WebApp, or choose a category below:*`;

  try {
    await ctx.reply(welcomeMessage, {
      parse_mode: 'Markdown',
      reply_markup: getMainMenuKeyboard(isAdmin),
    });
  } catch {
    await ctx.reply(welcomeMessage.replace(/[*_`]/g, ''), {
      reply_markup: getMainMenuKeyboard(isAdmin),
    });
  }

  // Enable persistent quick-dock seamlessly
  try {
    await ctx.reply('⚡ *Quick Dock Ready* — You can also tap the buttons below anytime:', {
      parse_mode: 'Markdown',
      disable_notification: true,
      reply_markup: getPersistentReplyKeyboard(),
    });
  } catch {
    await ctx.reply('⚡ Quick Dock Ready — You can also tap the buttons below anytime:', {
      disable_notification: true,
      reply_markup: getPersistentReplyKeyboard(),
    }).catch(() => {});
  }
}


