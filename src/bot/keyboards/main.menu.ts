import { InlineKeyboard } from 'grammy';

export function getMainMenuKeyboard(isAdmin = false): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  // Native Lexio Tool Suites directly in Telegram (No external website links)
  keyboard
    .text('🧰 100+ Multi-Tools', 'menu_toolbox')
    .row()
    .text('🎬 Media Downloader', 'menu_nexus')
    .row()
    .text('📊 Social & Creator Analytics', 'menu_feedigger')
    .row();

  // User Stats & Help
  keyboard
    .text('📈 My Activity & Stats', 'user_stats')
    .text('❓ Help & Commands', 'menu_help');

  if (isAdmin) {
    keyboard.row().text('👑 Admin Control Center', 'admin_panel');
  }

  return keyboard;
}
