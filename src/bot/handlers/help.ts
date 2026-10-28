import { BotContext } from '../types.js';
import { InlineKeyboard } from 'grammy';

import { getValidHttpsMiniAppUrl } from '../../config/env.js';

export async function handleHelp(ctx: BotContext): Promise<void> {
  const helpText =
    `📖 *LEXIO COMMAND & TASK DIRECTORY*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `All tools execute 100% inside this chat. Tap any copyable command below:\n\n` +
    `🚀 *Featured Tools:*\n` +
    `• \`/tools\` — Open 126+ WebApp catalog\n` +
    `• \`/download <url>\` — Download YouTube, Reel, TikTok\n` +
    `• \`/excavate @username\` — Instagram analytics & CSV\n\n` +
    `💻 *Code & Developer:*\n` +
    `• \`/json <data>\` — Format, validate & minify JSON\n` +
    `• \`/qr <text/url>\` — High-resolution QR code generator\n` +
    `• \`/uuid\` — Cryptographic UUID v4 identifier\n` +
    `• \`/hash <text>\` — MD5, SHA-1, SHA-256 hashes\n` +
    `• \`/b64 <text>\` & \`/b64d <data>\` — Base64 encode & decode\n` +
    `• \`/binary <text>\` · \`/jwt <token>\` · \`/sql <query>\`\n` +
    `• \`/scrape <url>\` · \`/archiver <url>\` · \`/stix <log>\`\n\n` +
    `🧮 *Math, Finance & Science:*\n` +
    `• \`/calc <expression>\` (e.g. \`/calc 250 * 1.18\`)\n` +
    `• \`/emi <amount> <rate> <years>\` — Loan EMI breakdown\n` +
    `• \`/unit <amt> <from> <to>\` — Length, Weight & Temp\n` +
    `• \`/stats <numbers>\` — Mean, Median, Mode & Range\n` +
    `• \`/discount <price> <rate>\` · \`/compound <amt> <rate> <yr>\`\n` +
    `• \`/bmi <wt_kg> <ht_cm>\` · \`/age <YYYY-MM-DD>\`\n\n` +
    `✍️ *Content & Copywriting:*\n` +
    `• \`/humanize <text>\` — Anti-AI natural humanizer\n` +
    `• \`/linkedin <topic>\` — Viral hook & post drafter\n` +
    `• \`/essay <topic>\` — Academic essay outliner\n` +
    `• \`/case <text>\` · \`/count <text>\` · \`/morse <text>\`\n\n` +
    `🎨 *Design & CSS:*\n` +
    `• \`/gradient\` — Modern CSS linear gradient generator\n` +
    `• \`/shadow\` — Modern CSS box-shadow generator\n` +
    `• \`/hex <#code>\` · \`/palette [color]\` · \`/designlib\`\n\n` +
    `⚡ *Productivity & Focus:*\n` +
    `• \`/password [length]\` — 256-bit secure password\n` +
    `• \`/pomodoro\` — Focus sprint timer (25m / 5m)\n` +
    `• \`/todo [task]\` — In-chat task keeper\n` +
    `• \`/coin\` · \`/dice\` · \`/8ball <question>\` · \`/quote\`\n\n` +
    `📞 *Developer & Support:*\n` +
    `• Built with ❤️ by *Sakshi Developer*\n` +
    `• Direct Email: \`qwicklabs2@gmail.com\`\n` +
    `• Phone Support: \`6290873841\``;

  const keyboard = new InlineKeyboard()
    .webApp('⚡ Launch Lexio Studio (126+ Web Tools)', getValidHttpsMiniAppUrl('?tab=toolbox'))
    .row()
    .text('🎬 Media Downloader', 'menu_nexus')
    .text('📊 Creator Intel', 'menu_feedigger')
    .row()
    .text('💻 Developer', 'tb_cat_dev')
    .text('🧮 Math & Finance', 'tb_cat_calc')
    .row()
    .text('✍️ AI & Writing', 'tb_cat_writer')
    .text('🎨 Design & CSS', 'tb_cat_design')
    .row()
    .text('⚡ Productivity', 'tb_cat_prod')
    .text('🔍 SEO & Web', 'tb_cat_seo')
    .row()
    .text('🏠 Back to Main Menu', 'menu_main');

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(helpText, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
      await ctx.answerCallbackQuery();
      return;
    } catch (err: any) {
      await ctx.answerCallbackQuery().catch(() => {});
      if (err?.description?.includes('message is not modified')) {
        return;
      }
      try {
        await ctx.editMessageText(helpText.replace(/[*_`]/g, ''), {
          reply_markup: keyboard,
        });
        return;
      } catch {}
    }
  }
  await ctx.reply(helpText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  }).catch(async () => {
    await ctx.reply(helpText.replace(/[*_`]/g, ''), {
      reply_markup: keyboard,
    });
  });
}

