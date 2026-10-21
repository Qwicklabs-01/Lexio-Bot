import { BotContext } from '../types.js';
import { getMainMenuKeyboard, getPersistentReplyKeyboard } from '../keyboards/main.menu.js';

export async function handleStart(ctx: BotContext): Promise<void> {
  const firstName = ctx.from?.first_name || 'Friend';
  const isAdmin = ctx.state?.isAdmin || false;

  const welcomeMessage =
    `⚡ *LEXIO MULTI-TOOL ASSISTANT*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `Welcome, *${firstName}*! All tools run directly inside this chat.\n\n` +
    `What type of task do you need to complete today?\n\n` +
    `• 💻 *Code & Dev:* Format JSON/SQL, QR code, UUID, Hashes, Base64, Binary\n` +
    `• 🧮 *Math & Finance:* Loan EMI, BMI, Age, Percent, Discount, Unit Converter, Stats\n` +
    `• 📝 *Text & Copy:* Word count, Case converter, Reverser, Sorter, Morse, Lorem\n` +
    `• 🔍 *SEO & Web:* Meta tags, Robots.txt, Sitemap, HTTP codes, Keyword density\n` +
    `• 🎨 *Color & Design:* HEX to RGB, CSS Gradients, Box Shadows, Material Palette\n` +
    `• ⚡ *Productivity:* 256-Bit Passwords, Pomodoro focus timer, Quick Task Keeper\n` +
    `• 🎲 *Fun & Games:* 3D Coin flip, Dice, Magic 8-Ball, Daily Quotes, RPS Game\n` +
    `• 🎬 *Media Downloads:* Paste any YouTube, Reel, or TikTok video link\n` +
    `• 📊 *Creator Analytics:* Analyze Instagram profiles, ER% & CSV export\n\n` +
    `👇 *Select your task category below to run any tool:*`;

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(isAdmin),
  });

  // Activate Telegram's persistent bottom slide bar / reply keyboard
  await ctx.reply('💡 *Tip:* You can also tap the quick menu options on your keyboard below at any time.', {
    parse_mode: 'Markdown',
    reply_markup: getPersistentReplyKeyboard(),
  });
}

