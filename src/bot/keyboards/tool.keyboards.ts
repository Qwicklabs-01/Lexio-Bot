import { InlineKeyboard } from 'grammy';
import { getValidHttpsMiniAppUrl } from '../../config/env.js';

export function getMediaDownloadKeyboard(downloadId: string): InlineKeyboard {
  return new InlineKeyboard()
    .webApp('🚀 Open Downloader in Bot Page', getValidHttpsMiniAppUrl('?tab=media'))
    .row()
    .text('🎬 1080p HD Video', `dl_${downloadId}_1080p`)
    .text('📹 720p Video', `dl_${downloadId}_720p`)
    .row()
    .text('🎵 High-Quality MP3', `dl_${downloadId}_mp3`)
    .text('ℹ️ Inspect Info', `dl_${downloadId}_info`)
    .row()
    .text('🔙 Back to Downloader', 'menu_nexus')
    .text('🏠 Main Menu', 'menu_main');
}

export function getFeediggerActionsKeyboard(handle: string): InlineKeyboard {
  return new InlineKeyboard()
    .webApp('🚀 Open Creator Suite in Bot Page', getValidHttpsMiniAppUrl('?tab=social'))
    .row()
    .text('👁️ Top Views', `fd_sort_${handle}_views`)
    .text('❤️ Top Likes', `fd_sort_${handle}_likes`)
    .row()
    .text('💬 Top Comments', `fd_sort_${handle}_comments`)
    .text('🔥 Highest ER %', `fd_sort_${handle}_er`)
    .row()
    .text('🏷️ Viral Hashtags', `fd_tags_${handle}`)
    .text('🎣 Viral Hooks', `fd_hook_${handle}`)
    .row()
    .text('📥 Export Full CSV', `fd_export_${handle}`)
    .row()
    .text('🔙 Back to Analytics', 'menu_feedigger')
    .text('🏠 Main Menu', 'menu_main');
}

export function getToolBoxCategoriesKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .webApp('🚀 Open 100,000+ Tools Page (In-Bot)', getValidHttpsMiniAppUrl('?tab=toolbox'))
    .row()
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
    .text('📖 Task Directory', 'menu_help')
    .row()
    .text('🏠 Back to Task Menu', 'menu_main');
}

export function getToolBoxDevKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .webApp('🚀 Open Dev Tools in Bot Page', getValidHttpsMiniAppUrl('?tab=toolbox&cat=dev'))
    .row()
    .text('🔤 JSON Formatter', 'tb_tool_json')
    .text('📱 QR Generator', 'tb_tool_qr')
    .row()
    .text('🆔 UUID Generator', 'tb_tool_uuid')
    .text('🔑 Hash Generator', 'tb_tool_hash')
    .row()
    .text('🔐 Base64 Tool', 'tb_tool_base64')
    .text('🌐 URL Encoder', 'tb_tool_url')
    .row()
    .text('🔗 Slug Maker', 'tb_tool_slug')
    .text('💻 SQL Formatter', 'tb_tool_sql')
    .row()
    .text('0️⃣1️⃣ Text to Binary', 'tb_tool_binary')
    .text('🏷️ Markdown to HTML', 'tb_tool_md2html')
    .row()
    .text('🗜️ HTML Minifier', 'tb_tool_minhtml')
    .text('🔍 JWT Inspector', 'tb_tool_jwt')
    .row()
    .text('🔙 Back to Task Menu', 'menu_main');
}

export function getToolBoxCalcKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .webApp('🚀 Open Calculators in Bot Page', getValidHttpsMiniAppUrl('?tab=toolbox&cat=calc'))
    .row()
    .text('💰 Loan EMI Calc', 'tb_tool_emi')
    .text('⚖️ BMI Calculator', 'tb_tool_bmi')
    .row()
    .text('🎂 Age Calculator', 'tb_tool_age')
    .text('📊 Percentage Calc', 'tb_tool_percent')
    .row()
    .text('🏷️ Discount Calc', 'tb_tool_discount')
    .text('🪙 Tip & Bill Split', 'tb_tool_tip')
    .row()
    .text('📈 Compound Interest', 'tb_tool_compound')
    .text('🧾 GST / Sales Tax', 'tb_tool_tax')
    .row()
    .text('🔄 Unit Converter', 'tb_tool_unit')
    .text('📊 Statistics Calc', 'tb_tool_stats')
    .row()
    .text('🎓 GPA Calculator', 'tb_tool_gpa')
    .text('🔬 Scientific Calc', 'tb_tool_sci')
    .row()
    .text('🔙 Back to Task Menu', 'menu_main');
}

export function getToolBoxTextKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .webApp('🚀 Open Text Tools in Bot Page', getValidHttpsMiniAppUrl('?tab=toolbox&cat=text'))
    .row()
    .text('🔠 Case Converter', 'tb_tool_case')
    .text('📊 Word & Char Count', 'tb_tool_count')
    .row()
    .text('🔄 Text Reverser', 'tb_tool_reverse')
    .text('🔡 Text Sorter', 'tb_tool_sort')
    .row()
    .text('📻 Morse Code', 'tb_tool_morse')
    .text('📜 Lorem Ipsum Gen', 'tb_tool_lorem')
    .row()
    .text('✂️ Character Remover', 'tb_tool_removechar')
    .row()
    .text('🔙 Back to Task Menu', 'menu_main');
}

export function getToolBoxSeoKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .webApp('🚀 Open SEO Tools in Bot Page', getValidHttpsMiniAppUrl('?tab=toolbox&cat=seo'))
    .row()
    .text('🏷️ Meta Tag Gen', 'tb_tool_meta')
    .text('🤖 Robots.txt Gen', 'tb_tool_robots')
    .row()
    .text('🗺️ Sitemap Gen', 'tb_tool_sitemap')
    .text('🚥 HTTP Status Codes', 'tb_tool_http')
    .row()
    .text('📊 Keyword Density', 'tb_tool_keywords')
    .row()
    .text('🔙 Back to Task Menu', 'menu_main');
}

export function getToolBoxDesignKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .webApp('🚀 Open Design Tools in Bot Page', getValidHttpsMiniAppUrl('?tab=toolbox&cat=design'))
    .row()
    .text('🎨 HEX to RGB / RGBA', 'tb_tool_hextorgb')
    .text('🌈 CSS Gradient Gen', 'tb_tool_gradient')
    .row()
    .text('📦 Box Shadow Gen', 'tb_tool_shadow')
    .text('🎨 Material Palette', 'tb_tool_palette')
    .row()
    .text('🔙 Back to Task Menu', 'menu_main');
}

export function getToolBoxProductivityKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .webApp('🚀 Open Productivity in Bot Page', getValidHttpsMiniAppUrl('?tab=toolbox&cat=prod'))
    .row()
    .text('🔐 Password Gen', 'tb_tool_password')
    .text('⏱️ Pomodoro Timer', 'tb_tool_pomodoro')
    .row()
    .text('📝 Quick Task Keeper', 'tb_tool_todo')
    .text('📜 Lorem Ipsum', 'tb_tool_lorem')
    .row()
    .text('🔙 Back to Task Menu', 'menu_main');
}

export function getToolBoxFunKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .webApp('🚀 Open Games in Bot Page', getValidHttpsMiniAppUrl('?tab=toolbox&cat=fun'))
    .row()
    .text('🪙 3D Coin Flip', 'tb_tool_coin')
    .text('🎲 Roll Dice', 'tb_tool_dice')
    .row()
    .text('🎱 Magic 8-Ball', 'tb_tool_8ball')
    .text('💬 Daily Quote', 'tb_tool_quote')
    .row()
    .text('🎯 Choice Picker', 'tb_tool_pick')
    .text('🎮 Rock Paper Scissors', 'tb_tool_rps')
    .row()
    .text('🔙 Back to Task Menu', 'menu_main');
}

export function getBackToCategoryKeyboard(
  category: string,
  extraRows?: { text: string; data: string }[][]
): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  if (extraRows && extraRows.length > 0) {
    for (const row of extraRows) {
      for (const btn of row) {
        keyboard.text(btn.text, btn.data);
      }
      keyboard.row();
    }
  }

  const catNames: Record<string, string> = {
    dev: '💻 Dev Tasks',
    calc: '🧮 Math Tasks',
    text: '📝 Text Tasks',
    seo: '🔍 SEO Tasks',
    design: '🎨 Design Tasks',
    prod: '⚡ Productivity',
    fun: '🎲 Fun & Games',
  };

  const backLabel = catNames[category] ? `🔙 ${catNames[category]}` : '🔙 Tasks';

  keyboard
    .webApp('🚀 Open in Bot Page', getValidHttpsMiniAppUrl(`?tab=toolbox&cat=${category}`))
    .row()
    .text(backLabel, `tb_cat_${category}`)
    .text('🏠 Task Menu', 'menu_main');

  return keyboard;
}

export function getBackToMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .webApp('🚀 Open 100,000+ Tools Page (In-Bot)', getValidHttpsMiniAppUrl('?tab=toolbox'))
    .row()
    .text('🏠 Back to Main Menu', 'menu_main');
}
