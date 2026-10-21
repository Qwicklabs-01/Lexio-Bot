import { BotContext } from '../types.js';
import { getBackToMenuKeyboard } from '../keyboards/tool.keyboards.js';

export async function handleHelp(ctx: BotContext): Promise<void> {
  const helpText =
    `📖 *OmniPlatform Bot Command Guide*\n\n` +
    `⚡ *Nexus Media Commands:*\n` +
    `• \`/download <url>\` — Download video or audio from YouTube, TikTok, Instagram, etc.\n` +
    `• Or just *paste any media link* directly in the chat!\n\n` +
    `🔍 *Feedigger Social Commands:*\n` +
    `• \`/excavate <@username>\` — Analyze viral Instagram posts, Reels & engagement metrics.\n` +
    `• \`/ig <@username>\` — Quick profile reach & follower overview.\n\n` +
    `🧰 *ToolBox Pro Utility Commands:*\n` +
    `• \`/tools\` — Open categories for 100+ utilities.\n` +
    `• \`/qr <text/url>\` — Generate instant high-res QR code.\n` +
    `• \`/password <length>\` — Generate ultra-secure random password.\n` +
    `• \`/calc <expression>\` — Calculate math (e.g., \`/calc 25 * 400 / 5\`).\n` +
    `• \`/bmi <weight_kg> <height_cm>\` — Calculate your Body Mass Index.\n` +
    `• \`/b64 <text>\` — Encode text to Base64.\n\n` +
    `👑 *Admin Commands (Authorized users only):*\n` +
    `• \`/admin\` — Platform stats, analytics & broadcast system.\n\n` +
    `💡 *Pro Tip:* Tap *Open All-In-One Web App* anytime for the visual experience!`;

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
