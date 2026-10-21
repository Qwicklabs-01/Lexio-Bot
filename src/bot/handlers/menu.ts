import { BotContext } from '../types.js';
import { getMainMenuKeyboard } from '../keyboards/main.menu.js';

export async function handleMenu(ctx: BotContext): Promise<void> {
  const isAdmin = ctx.state?.isAdmin || false;
  const menuText =
    `🧭 *Main Navigation Menu*\n\n` +
    `Choose an action below or tap *Open All-In-One Web App* to access the full interactive interface:`;

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
