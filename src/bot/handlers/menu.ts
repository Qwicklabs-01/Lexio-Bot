import { BotContext } from '../types.js';
import { getMainMenuKeyboard } from '../keyboards/main.menu.js';

export async function handleMenu(ctx: BotContext): Promise<void> {
  const isAdmin = ctx.state?.isAdmin || false;
  const menuText =
    `🧭 *Main Navigation Menu*\n\n` +
    `Select a tool suite below to run directly in Telegram:`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(menuText, {
        parse_mode: 'Markdown',
        reply_markup: getMainMenuKeyboard(isAdmin),
      });
      await ctx.answerCallbackQuery();
    } catch {
      await ctx.reply(menuText, {
        parse_mode: 'Markdown',
        reply_markup: getMainMenuKeyboard(isAdmin),
      });
    }
  } else {
    await ctx.reply(menuText, {
      parse_mode: 'Markdown',
      reply_markup: getMainMenuKeyboard(isAdmin),
    });
  }
}
