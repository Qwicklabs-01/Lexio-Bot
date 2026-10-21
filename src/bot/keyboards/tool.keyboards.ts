import { InlineKeyboard } from 'grammy';
import { getValidHttpsMiniAppUrl } from '../../config/env.js';

export function getMediaDownloadKeyboard(downloadId: string): InlineKeyboard {
  return new InlineKeyboard()
    .text('🎬 1080p HD Video', `dl_${downloadId}_1080p`)
    .text('📹 720p Video', `dl_${downloadId}_720p`)
    .row()
    .text('🎵 High-Quality MP3', `dl_${downloadId}_mp3`)
    .text('ℹ️ Inspect Info', `dl_${downloadId}_info`)
    .row()
    .webApp('⚡ Open in Lexio Studio', getValidHttpsMiniAppUrl('?tab=media'))
    .row()
    .text('🔙 Back to Menu', 'menu_main');
}

export function getFeediggerActionsKeyboard(handle: string): InlineKeyboard {
  return new InlineKeyboard()
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
    .webApp('🔍 Open in Lexio Studio', getValidHttpsMiniAppUrl(`?tab=social&user=${handle}`))
    .row()
    .text('🔙 Back to Menu', 'menu_main');
}

export function getToolBoxCategoriesKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('💻 Dev & Code', 'tb_cat_dev')
    .text('🧮 Calculators', 'tb_cat_calc')
    .row()
    .text('📝 Text & Content', 'tb_cat_text')
    .text('🔍 SEO & Web', 'tb_cat_seo')
    .row()
    .text('🎨 Color & Design', 'tb_cat_design')
    .text('🎲 Random & Fun', 'tb_cat_fun')
    .row()
    .webApp('🧰 Browse All 100+ Tools in Studio', getValidHttpsMiniAppUrl('?tab=toolbox'))
    .row()
    .text('🔙 Back to Main Menu', 'menu_main');
}

export function getToolBoxDevKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('🔤 JSON Beautifier', 'tb_tool_json')
    .text('📱 QR Generator', 'tb_tool_qr')
    .row()
    .text('🆔 UUID Generator', 'tb_tool_uuid')
    .text('🔑 Hash Generator', 'tb_tool_hash')
    .row()
    .text('🔐 Base64 Tool', 'tb_tool_base64')
    .text('🌐 URL Encoder', 'tb_tool_url')
    .row()
    .text('🔗 Slug Generator', 'tb_tool_slug')
    .text('💻 SQL Formatter', 'tb_tool_sql')
    .row()
    .text('🔙 All Categories', 'menu_toolbox')
    .text('🏠 Main Menu', 'menu_main');
}

export function getToolBoxCalcKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('⚖️ BMI Calculator', 'tb_tool_bmi')
    .text('🎂 Age Calculator', 'tb_tool_age')
    .row()
    .text('💰 Loan EMI Calc', 'tb_tool_emi')
    .text('📊 Percentage Calc', 'tb_tool_percent')
    .row()
    .text('🏷️ Discount Calc', 'tb_tool_discount')
    .text('🪙 Tip & Bill Split', 'tb_tool_tip')
    .row()
    .text('📈 Compound Interest', 'tb_tool_compound')
    .text('🧾 GST / Sales Tax', 'tb_tool_tax')
    .row()
    .text('🔙 All Categories', 'menu_toolbox')
    .text('🏠 Main Menu', 'menu_main');
}

export function getToolBoxTextKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('🔠 Case Converter', 'tb_tool_case')
    .text('📊 Word & Char Count', 'tb_tool_count')
    .row()
    .text('🔄 Text Reverser', 'tb_tool_reverse')
    .text('🔡 Text Sorter', 'tb_tool_sort')
    .row()
    .text('📻 Morse Code', 'tb_tool_morse')
    .text('📜 Lorem Ipsum Gen', 'tb_tool_lorem')
    .row()
    .text('🔙 All Categories', 'menu_toolbox')
    .text('🏠 Main Menu', 'menu_main');
}

export function getToolBoxSeoKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('🏷️ Meta Tag Gen', 'tb_tool_meta')
    .text('🤖 Robots.txt Gen', 'tb_tool_robots')
    .row()
    .text('🗺️ Sitemap Gen', 'tb_tool_sitemap')
    .text('🔎 Keyword Density', 'tb_tool_keyword')
    .row()
    .text('🌐 OpenGraph (OG) Gen', 'tb_tool_og')
    .text('🚥 HTTP Status Codes', 'tb_tool_http')
    .row()
    .text('🔙 All Categories', 'menu_toolbox')
    .text('🏠 Main Menu', 'menu_main');
}

export function getToolBoxDesignKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('🎨 HEX to RGB / HSL', 'tb_tool_hextorgb')
    .text('🌈 Gradient Gen', 'tb_tool_gradient')
    .row()
    .text('📦 Box Shadow Gen', 'tb_tool_shadow')
    .text('🔘 CSS Button Gen', 'tb_tool_button')
    .row()
    .text('👁️ Contrast Checker', 'tb_tool_contrast')
    .text('🎭 CSS Filters', 'tb_tool_filters')
    .row()
    .text('🔙 All Categories', 'menu_toolbox')
    .text('🏠 Main Menu', 'menu_main');
}

export function getToolBoxFunKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('🪙 3D Coin Flip', 'tb_tool_coin')
    .text('🎲 Roll Dice', 'tb_tool_dice')
    .row()
    .text('🎱 Magic 8-Ball', 'tb_tool_8ball')
    .text('💬 Random Quote', 'tb_tool_quote')
    .row()
    .text('🎯 Choice Picker', 'tb_tool_pick')
    .text('🔐 Password Gen', 'tb_tool_password')
    .row()
    .text('🔙 All Categories', 'menu_toolbox')
    .text('🏠 Main Menu', 'menu_main');
}

export function getBackToMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard().text('🔙 Back to Main Menu', 'menu_main');
}
