import { InlineKeyboard, Keyboard } from 'grammy';
import { getValidHttpsMiniAppUrl } from '../../config/env.js';

export function getMainMenuKeyboard(isAdmin = false): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  const miniAppUrl = getValidHttpsMiniAppUrl('?tab=toolbox');

  // Hero: Launch full WebApp studio directly inside Telegram
  keyboard
    .webApp('⚡ Launch Lexio Studio (126+ Web Tools)', miniAppUrl)
    .row();

  // Flagship Actions: Media Capture & Social Intel
  keyboard
    .text('🎬 Media Grabber', 'menu_nexus')
    .text('📊 Creator Intel', 'menu_feedigger')
    .row();

  // Tool Suites in clean 2-column balanced grid
  keyboard
    .text('💻 Developer Suite', 'tb_cat_dev')
    .text('🧮 Math & Finance', 'tb_cat_calc')
    .row()
    .text('📄 PDF & Docs', 'tb_cat_pdf')
    .text('✍️ AI & Writing', 'tb_cat_writer')
    .row()
    .text('🎨 Design & CSS', 'tb_cat_design')
    .text('⚡ Productivity', 'tb_cat_prod')
    .row()
    .text('🔍 SEO & Web', 'tb_cat_seo')
    .text('🎲 Fun & Games', 'tb_cat_fun')
    .row()
    .text('📐 CAD & 3D', 'tb_cat_cad')
    .text('📖 Directory', 'menu_help');

  if (isAdmin) {
    keyboard.row().text('👑 Admin Dashboard', 'admin_panel');
  }

  return keyboard;
}

export function getPersistentReplyKeyboard(): Keyboard {
  const miniAppUrl = getValidHttpsMiniAppUrl('?tab=toolbox');
  return new Keyboard()
    .webApp('⚡ Open Lexio Studio', miniAppUrl)
    .text('🧰 All Tools')
    .row()
    .text('🎬 Media Downloader')
    .text('📊 Creator Intel')
    .row()
    .text('🧭 Menu')
    .text('📖 Directory')
    .resized()
    .persistent();
}

