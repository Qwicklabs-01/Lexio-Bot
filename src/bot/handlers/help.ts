import { BotContext } from '../types.js';
import { getBackToMenuKeyboard } from '../keyboards/tool.keyboards.js';

export async function handleHelp(ctx: BotContext): Promise<void> {
  const helpText =
    `📖 *Lexio Universal Assistant — Command Directory*\n\n` +
    `🎬 *Media Downloader:*\n` +
    `• \`/download <url>\` — Download 1080p/720p HD video or 320kbps MP3 audio.\n` +
    `• Or simply *paste any video link* directly into the chat!\n\n` +
    `📊 *Creator & Social Intelligence:*\n` +
    `• \`/excavate <@username>\` — Viral Reels ranking, views, likes, and ER% metrics.\n` +
    `• \`/hashtags <niche>\` — High-growth viral hashtags (e.g. \`/hashtags tech\`).\n` +
    `• \`/hook <topic>\` — Viral video hook ideas (e.g. \`/hook productivity\`).\n\n` +
    `💻 *Developer & Web:*\n` +
    `• \`/json <data>\` — Format, validate & minify JSON.\n` +
    `• \`/qr <text/url>\` — Generate high-resolution QR codes.\n` +
    `• \`/uuid\` — Cryptographic UUID v4 identifier.\n` +
    `• \`/hash <text>\` — MD5, SHA-1, SHA-256, SHA-512 hashes.\n` +
    `• \`/b64 <text>\` & \`/b64d <data>\` — Base64 encode & decode.\n` +
    `• \`/slug <title>\` — Clean SEO URL slug.\n` +
    `• \`/sql <query>\` — Format & beautify SQL queries.\n` +
    `• \`/jwt <token>\` — Decode and inspect JWT claims.\n` +
    `• \`/timestamp [epoch]\` — Unix epoch / date converter.\n\n` +
    `🧮 *Calculators & Finance:*\n` +
    `• \`/calc <expression>\` — Math calculator (e.g. \`/calc 250 * 1.18\`).\n` +
    `• \`/bmi <weight_kg> <height_cm>\` — Body Mass Index & health category.\n` +
    `• \`/age <YYYY-MM-DD>\` — Exact age, days lived & birthday countdown.\n` +
    `• \`/emi <amount> <rate> <years>\` — Loan EMI & total interest.\n` +
    `• \`/percent <rate> <total>\` — Percentage calculation.\n` +
    `• \`/discount <price> <percent>\` — Sale savings & final price.\n` +
    `• \`/tip <bill> <percent> [people]\` — Tip & bill split.\n` +
    `• \`/compound <principal> <rate> <years>\` — Compound interest growth.\n` +
    `• \`/tax <amount> <rate>\` — GST / Sales Tax breakdown.\n\n` +
    `📝 *Text & Content:*\n` +
    `• \`/case <text>\` — UPPER, lower, Title, camel, snake, kebab.\n` +
    `• \`/count <text>\` — Word, char count & reading time.\n` +
    `• \`/reverse <text>\` — Reverse characters or words.\n` +
    `• \`/sort <items>\` — Alphabetical line or list sorter.\n` +
    `• \`/morse <text>\` — International Morse code translator.\n` +
    `• \`/lorem [paragraphs]\` — Lorem Ipsum placeholder text.\n\n` +
    `🔍 *SEO & Design:*\n` +
    `• \`/meta <title | desc | url>\` — HTML meta tags generator.\n` +
    `• \`/robots [domain]\` — Clean robots.txt generator.\n` +
    `• \`/sitemap [domain]\` — XML sitemap template.\n` +
    `• \`/http <code>\` — HTTP status code explanation.\n` +
    `• \`/hex <#code>\` — HEX to RGB & RGBA translator.\n` +
    `• \`/gradient\` — Modern CSS linear gradient generator.\n` +
    `• \`/shadow\` — Modern CSS box-shadow generator.\n\n` +
    `🎲 *Random & Games:*\n` +
    `• \`/password [length]\` — 256-bit secure password generator.\n` +
    `• \`/coin\` — 3D coin toss.\n` +
    `• \`/dice [sides]\` — Dice roller.\n` +
    `• \`/8ball <question>\` — Magic 8-Ball oracle.\n` +
    `• \`/quote\` — Daily inspirational quote.\n` +
    `• \`/pick <a, b, c>\` — Choice picker from options.\n` +
    `• \`/rps <rock|paper|scissors>\` — Play Rock Paper Scissors vs Lexio.\n\n` +
    `👑 *Admin Commands:* \`/admin\` | \`/broadcast <text>\`\n\n` +
    `⚡ *Tip:* Tap any button in \`/menu\` or \`/tools\` to calculate or generate results instantly in chat!`;

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
