import { BotContext } from '../types.js';
import { getBackToMenuKeyboard } from '../keyboards/tool.keyboards.js';

export async function handleHelp(ctx: BotContext): Promise<void> {
  const helpText =
    `📖 *Lexio Universal Assistant Guide*\n\n` +
    `🎬 *Media Downloader Commands:*\n` +
    `• \`/download <url>\` — Download video or audio from YouTube, TikTok, Instagram, X, etc.\n` +
    `• Or simply *paste any video link* directly into the chat!\n\n` +
    `📊 *Social & Creator Commands:*\n` +
    `• \`/excavate <@username>\` — Uncover viral Reels, views, likes, and ER% rankings.\n` +
    `• \`/ig <@username>\` — Quick profile reach and follower metrics.\n\n` +
    `🧰 *Multi-Tools Commands:*\n` +
    `• \`/tools\` — Open categorized directory of 100+ utilities.\n` +
    `• \`/qr <text/url>\` — Generate high-resolution QR codes.\n` +
    `• \`/password <length>\` — Generate 256-bit secure cryptographic passwords.\n` +
    `• \`/case <text>\` — Convert cases (UPPER, lower, Title, camel, snake).\n` +
    `• \`/count <text>\` — Analyze words, characters & reading time.\n` +
    `• \`/calc <expression>\` — Calculate math expressions (e.g., \`/calc 25 * 400 / 5\`).\n` +
    `• \`/bmi <weight_kg> <height_cm>\` — Calculate Body Mass Index.\n` +
    `• \`/discount <price> <percent>\` — Calculate sale savings & final price.\n` +
    `• \`/tip <bill> <percent> [people]\` — Calculate tip and split check.\n` +
    `• \`/coin\` — 3D coin toss decision maker.\n` +
    `• \`/dice [sides]\` — Roll a 6-sided or custom die.\n` +
    `• \`/uuid\` — Generate a unique UUID v4.\n` +
    `• \`/hash <text>\` — Generate MD5 & SHA-256 hashes.\n` +
    `• \`/b64 <text>\` — Encode text to Base64.\n` +
    `• \`/quote\` — Get an inspirational quote.\n\n` +
    `👑 *Admin Commands (Authorized users only):*\n` +
    `• \`/admin\` — Platform stats, analytics & broadcast system.\n\n` +
    `💡 *Pro Tip:* Tap *Open Lexio Studio* anytime to access the full visual app!`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(helpText, {
        parse_mode: 'Markdown',
        reply_markup: getBackToMenuKeyboard(),
      });
      await ctx.answerCallbackQuery();
    } catch {
      await ctx.reply(helpText, {
        parse_mode: 'Markdown',
        reply_markup: getBackToMenuKeyboard(),
      });
    }
  } else {
    await ctx.reply(helpText, {
      parse_mode: 'Markdown',
      reply_markup: getBackToMenuKeyboard(),
    });
  }
}
