import { InlineKeyboard } from 'grammy';
import { getValidHttpsMiniAppUrl } from '../../config/env.js';

export function getMainMenuKeyboard(isAdmin = false): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  // Primary CTA: Telegram Mini App (Strictly HTTPS for Telegram WebApp)
  keyboard.webApp('🚀 Open Lexio Studio', getValidHttpsMiniAppUrl()).row();

  // Secondary Core Features
  keyboard
    .text('⚡ Nexus Media Downloader', 'menu_nexus')
    .row()
    .text('🔍 Feedigger Social Intel', 'menu_feedigger')
    .row()
    .text('🧰 100+ Free Multi-Tools', 'menu_toolbox')
    .row();

  // User History & Settings
  keyboard
    .text('📊 My Activity & Stats', 'user_stats')
    .text('❓ Help & Guide', 'menu_help');

  if (isAdmin) {
    keyboard.row().text('👑 Admin Control Center', 'admin_panel');
  }

  return keyboard;
}
