import { BotContext } from '../types.js';
import { InlineKeyboard } from 'grammy';

export async function handleHelp(ctx: BotContext): Promise<void> {
  const helpText =
    `📖 *LEXIO UNIVERSAL TASK & TOOL DIRECTORY*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `All tools run 100% inside this chat. Select any category below or run commands directly:\n\n` +
    `💻 *Code & Developer Tasks:*\n` +
    `• \`/json <data>\` — Format, validate & minify JSON\n` +
    `• \`/qr <text/url>\` — Generate high-resolution QR codes\n` +
    `• \`/uuid\` — Cryptographic UUID v4 identifier\n` +
    `• \`/hash <text>\` — MD5, SHA-1, SHA-256 hashes\n` +
    `• \`/b64 <text>\` & \`/b64d <data>\` — Base64 encode & decode\n` +
    `• \`/binary <text>\` — Text to Binary & Binary to Text\n` +
    `• \`/slug <title>\` — Clean SEO URL slug maker\n` +
    `• \`/sql <query>\` — Format & beautify SQL queries\n` +
    `• \`/md2html <markdown>\` — Convert Markdown to HTML\n` +
    `• \`/minhtml <code>\` — Minify HTML & CSS\n` +
    `• \`/jwt <token>\` — Decode and inspect JWT claims\n` +
    `• \`/scrape <url>\` — Auto-scraper: extract tables & lists into JSON/CSV\n` +
    `• \`/archiver <url>\` — Web archiver: complete source & asset bundle\n` +
    `• \`/stix <log_json>\` — STIX 2.1 Threat Intel bundle generator\n` +
    `• \`/timestamp [epoch]\` — Unix epoch / date converter\n\n` +
    `🧮 *Math, Financial & Science Tasks:*\n` +
    `• \`/calc <expression>\` — Quick math (e.g. \`/calc 250 * 1.18\`)\n` +
    `• \`/emi <amount> <rate> <years>\` — Loan monthly EMI & interest\n` +
    `• \`/unit <amt> <from> <to>\` — Length, Weight & Temp conversions\n` +
    `• \`/stats <numbers>\` — Mean, Median, Mode & Range statistics\n` +
    `• \`/gpa <grades>\` — Semester GPA on 4.0 scale\n` +
    `• \`/sci <expr>\` — Scientific math (sqrt, pow, sin, cos, log)\n` +
    `• \`/bmi <wt_kg> <ht_cm>\` — Body Mass Index & health badge\n` +
    `• \`/age <YYYY-MM-DD>\` — Exact age & birthday countdown\n` +
    `• \`/percent <rate> <total>\` — Percentage calculation\n` +
    `• \`/discount <price> <rate>\` — Sale discount savings\n` +
    `• \`/tip <bill> <rate> [people]\` — Tip & bill split\n` +
    `• \`/compound <amt> <rate> <yr>\` — Compound interest growth\n` +
    `• \`/tax <amount> <rate>\` — GST / Sales Tax breakdown\n\n` +
    `📝 *Text & Copywriting Tasks:*\n` +
    `• \`/linkedin <topic>\` — Viral hook drafter with 5 tone presets\n` +
    `• \`/essay <topic>\` — Academic essay outliner & thesis generator\n` +
    `• \`/humanize <text>\` — Anti-AI natural humanizer\n` +
    `• \`/case <text>\` — UPPER, lower, Title, camel, snake, kebab\n` +
    `• \`/count <text>\` — Word, char count & reading time\n` +
    `• \`/reverse <text>\` — Reverse characters or words\n` +
    `• \`/sort <items>\` — Alphabetical line or list sorter\n` +
    `• \`/morse <text>\` — International Morse code translator\n` +
    `• \`/removechar <text>\` — Strip symbols, punctuation, numbers\n` +
    `• \`/lorem [paragraphs]\` — Lorem Ipsum placeholder text\n\n` +
    `🔍 *SEO & Marketing Tasks:*\n` +
    `• \`/outlier <@handle>\` — Viral outlier detector & 10x breakout ratio\n` +
    `• \`/meta <title | desc | url>\` — HTML meta tags & OpenGraph\n` +
    `• \`/robots [domain]\` — Clean robots.txt generator\n` +
    `• \`/sitemap [domain]\` — XML sitemap template\n` +
    `• \`/keywords <text>\` — Keyword density & frequency count\n` +
    `• \`/http <code>\` — HTTP status code explanation (e.g. 200, 404)\n\n` +
    `🎨 *Color & Design Tasks:*\n` +
    `• \`/designlib [preset]\` — 8 design systems, tokens & DESIGN.md\n` +
    `• \`/hex <#code>\` — HEX to RGB & RGBA translator\n` +
    `• \`/gradient\` — Modern CSS linear gradient generator\n` +
    `• \`/shadow\` — Modern CSS box-shadow generator\n` +
    `• \`/palette [color]\` — Material Design color palettes\n\n` +
    `⚡ *Productivity Tasks:*\n` +
    `• \`/agent <objective>\` — Composable AI multi-agent pipeline\n` +
    `• \`/password [length]\` — 256-bit secure password generator\n` +
    `• \`/pomodoro\` — Focus sprint & break intervals\n` +
    `• \`/todo [task]\` — In-chat task keeper\n\n` +
    `🎲 *Randomizers & Games:*\n` +
    `• \`/coin\` — 3D coin toss (Heads/Tails)\n` +
    `• \`/dice [sides]\` — Roll d6, d20, d100 dice\n` +
    `• \`/8ball <question>\` — Magic 8-Ball oracle\n` +
    `• \`/quote\` — Daily inspirational quote\n` +
    `• \`/pick <a, b, c>\` — Choice picker from options\n` +
    `• \`/rps <choice>\` — Rock Paper Scissors vs Lexio\n\n` +
    `🎬 *Media Downloads:* Paste any YouTube, Reel, or TikTok video link\n` +
    `📊 *Creator Analytics:* \`/excavate @username\` | \`/hashtags\` | \`/hook\`\n\n` +
    `📞 *Support & Contact:*\n` +
    `Phone: \`6290873841\`\n` +
    `Email: \`qwicklabs2@gmail.com\`\n` +
    `Made by *Sakshi Developer*`;

  const keyboard = new InlineKeyboard()
    .text('💻 Dev Tasks', 'tb_cat_dev')
    .text('🧮 Math Tasks', 'tb_cat_calc')
    .row()
    .text('📝 Text Tasks', 'tb_cat_text')
    .text('🔍 SEO Tasks', 'tb_cat_seo')
    .row()
    .text('🎨 Design Tasks', 'tb_cat_design')
    .text('⚡ Productivity', 'tb_cat_prod')
    .row()
    .text('🎬 Media Downloader', 'menu_nexus')
    .text('📊 Creator Analytics', 'menu_feedigger')
    .row()
    .text('🏠 Back to Task Menu', 'menu_main');

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(helpText, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
      await ctx.answerCallbackQuery();
      return;
    } catch {}
  }
  await ctx.reply(helpText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
}

