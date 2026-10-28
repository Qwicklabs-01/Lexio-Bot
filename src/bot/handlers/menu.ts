import { BotContext } from '../types.js';
import { getMainMenuKeyboard } from '../keyboards/main.menu.js';

export async function handleMenu(ctx: BotContext): Promise<void> {
  const isAdmin = ctx.state?.isAdmin || false;
  const menuText =
    `🧭 *LEXIO COMMAND CENTER*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `⚡ *126+ Instant Tools & Web Utilities*\n` +
    `Tap any suite below to run tools directly in this chat,\n` +
    `or launch *Lexio Studio* for the interactive visual workspace:`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(menuText, {
        parse_mode: 'Markdown',
        reply_markup: getMainMenuKeyboard(isAdmin),
      });
      await ctx.answerCallbackQuery();
      return;
    } catch (err: any) {
      await ctx.answerCallbackQuery().catch(() => {});
      if (err?.description?.includes('message is not modified')) {
        return;
      }
      try {
        await ctx.editMessageText(menuText.replace(/[*_`]/g, ''), {
          reply_markup: getMainMenuKeyboard(isAdmin),
        });
        return;
      } catch {}
    }
  }

  try {
    await ctx.reply(menuText, {
      parse_mode: 'Markdown',
      reply_markup: getMainMenuKeyboard(isAdmin),
    });
  } catch {
    await ctx.reply(menuText.replace(/[*_`]/g, ''), {
      reply_markup: getMainMenuKeyboard(isAdmin),
    });
  }
}


