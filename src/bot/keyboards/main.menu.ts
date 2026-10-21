import { InlineKeyboard, Keyboard } from 'grammy';
import { getValidHttpsMiniAppUrl } from '../../config/env.js';

export function getMainMenuKeyboard(isAdmin = false): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  const miniAppUrl = getValidHttpsMiniAppUrl('?tab=toolbox');

  // Launch 100,000+ tools directly inside Telegram bot page
  keyboard
    .webApp('🚀 Open 100,000+ Tools Page (In-Bot)', miniAppUrl)
    .row();

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
  const miniAppUrl = getValidHttpsMiniAppUrl('?tab=toolbox');
  return new Keyboard()
    .webApp('🚀 Open Tools Page', miniAppUrl)
    .text('🧰 Choose Task / Tool')
    .row()
    .text('🎬 Media Downloader')
    .text('📊 Creator Analytics')
    .row()
    .text('📖 Task Directory')
    .resized()
    .persistent();
}
