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
    .webApp('⚡ Open in Nexus Web App', getValidHttpsMiniAppUrl('?tab=nexus'))
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
    .text('📥 Export Full CSV', `fd_export_${handle}`)
    .webApp('🔍 Open Feedigger Studio', getValidHttpsMiniAppUrl(`?tab=feedigger&user=${handle}`))
    .row()
    .text('🔙 Back to Menu', 'menu_main');
}

export function getToolBoxCategoriesKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('💻 Dev & Code Tools', 'tb_cat_dev')
    .text('🧮 Fast Calculators', 'tb_cat_calc')
    .row()
    .text('🔍 SEO & Web Tools', 'tb_cat_seo')
    .text('⏱️ Productivity & Fun', 'tb_cat_prod')
    .row()
    .webApp('🧰 Browse 100+ Tools in Mini App', getValidHttpsMiniAppUrl('?tab=toolbox'))
    .row()
    .text('🔙 Back to Menu', 'menu_main');
}

export function getToolBoxDevKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('🔤 JSON Formatter', 'tb_tool_json')
    .text('📱 QR Code Gen', 'tb_tool_qr')
    .row()
    .text('🔐 Base64 Tool', 'tb_tool_base64')
    .text('🌐 URL Encoder', 'tb_tool_url')
    .row()
    .text('🔙 All Tools', 'menu_toolbox')
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
    .text('🔙 All Tools', 'menu_toolbox')
    .text('🏠 Main Menu', 'menu_main');
}

export function getBackToMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard().text('🔙 Back to Main Menu', 'menu_main');
}
