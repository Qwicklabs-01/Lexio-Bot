import { InlineKeyboard, Keyboard } from 'grammy';

export function getMainMenuKeyboard(isAdmin = false): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  // Task-Driven Selector directly in Telegram (Zero website names)
  keyboard
    .text('💻 Code & Dev Tasks', 'tb_cat_dev')
    .text('🧮 Math & Finance Tasks', 'tb_cat_calc')
    .row()
    .text('📝 Text & Writing Tasks', 'tb_cat_text')
    .text('🔍 SEO & Web Tasks', 'tb_cat_seo')
    .row()
    .text('🎨 Color & Design Tasks', 'tb_cat_design')
    .text('⚡ Productivity Tasks', 'tb_cat_prod')
    .row()
    .text('🎲 Fun & Games', 'tb_cat_fun')
    .text('🎬 Media Downloader', 'menu_nexus')
    .row()
    .text('📊 Creator Analytics', 'menu_feedigger')
    .text('📖 Task Directory', 'menu_help');

  if (isAdmin) {
    keyboard.row().text('👑 Admin Dashboard', 'admin_panel');
  }

  return keyboard;
}

export function getPersistentReplyKeyboard(): Keyboard {
  return new Keyboard()
    .text('🧰 Choose Task / Tool')
    .text('🎬 Media Downloader')
    .row()
    .text('📊 Creator Analytics')
    .text('📖 Task Directory')
    .resized()
    .persistent();
}


