import { BotContext } from '../types.js';
import { getMainMenuKeyboard } from '../keyboards/main.menu.js';

export async function handleMenu(ctx: BotContext): Promise<void> {
  const isAdmin = ctx.state?.isAdmin || false;
  const menuText =
    `🧭 *LEXIO COMMAND CENTER*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `Select a task suite below to run any tool directly in this chat,\n` +
    `or launch the full-screen *Lexio Studio* web app:`;

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
    }
  }
  await ctx.reply(menuText, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(isAdmin),
  });
}

