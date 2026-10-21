import { BotContext } from '../types.js';
import { getMainMenuKeyboard } from '../keyboards/main.menu.js';

export async function handleMenu(ctx: BotContext): Promise<void> {
  const isAdmin = ctx.state?.isAdmin || false;
  const menuText =
    `🧭 *CHOOSE YOUR TASK / TOOL TYPE*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `What type of task do you need to complete?\n\n` +
    `Select a suite below to use any tool instantly inside this chat:`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(menuText, {
        parse_mode: 'Markdown',
        reply_markup: getMainMenuKeyboard(isAdmin),
      });
      await ctx.answerCallbackQuery();
      return;
    } catch {}
  }
  await ctx.reply(menuText, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(isAdmin),
  });
}

