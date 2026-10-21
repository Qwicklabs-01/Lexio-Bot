import { InlineKeyboard } from 'grammy';
import { getValidHttpsMiniAppUrl } from '../../config/env.js';

export function getMainMenuKeyboard(isAdmin = false): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  // Primary Action: Telegram Mini App
  keyboard.webApp('🚀 Open Lexio Studio', getValidHttpsMiniAppUrl()).row();

  // Native Lexio Modules
  keyboard
    .text('🎬 Media Downloader', 'menu_nexus')
    .row()
    .text('📊 Social & Creator Analytics', 'menu_feedigger')
    .row()
    .text('🧰 100+ Multi-Tools', 'menu_toolbox')
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
