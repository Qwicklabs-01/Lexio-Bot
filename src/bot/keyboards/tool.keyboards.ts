import { InlineKeyboard } from 'grammy';

export function getMediaDownloadKeyboard(downloadId: string): InlineKeyboard {
  return new InlineKeyboard()
    .text('🎬 1080p HD Video', `dl_${downloadId}_1080p`)
    .text('📹 720p Video', `dl_${downloadId}_720p`)
    .row()
    .text('🎵 High-Quality MP3', `dl_${downloadId}_mp3`)
    .text('ℹ️ Inspect Info', `dl_${downloadId}_info`)
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
    .row()
    .text('🔙 Back to Menu', 'menu_main');
}

export function getToolBoxCategoriesKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('💻 Dev & Code Tools', 'tb_cat_dev')
    .text('🧮 Calculators & Finance', 'tb_cat_calc')
    .row()
    .text('📝 Text & Content Tools', 'tb_cat_text')
    .text('🔍 SEO & Web Utilities', 'tb_cat_seo')
    .row()
    .text('🎨 Color & Design Tools', 'tb_cat_design')
    .text('🎲 Random & Fun Games', 'tb_cat_fun')
    .row()
    .text('🎬 Media Downloader', 'menu_nexus')
    .text('📊 Creator Analytics', 'menu_feedigger')
    .row()
    .text('🏠 Back to Main Menu', 'menu_main');
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
    .text('🎮 Rock Paper Scissors', 'tb_tool_rps')
    .row()
    .text('🔙 All Categories', 'menu_toolbox')
    .text('🏠 Main Menu', 'menu_main');
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
    dev: '💻 Dev Tools',
    calc: '🧮 Calculators',
    text: '📝 Text Tools',
    seo: '🔍 SEO Tools',
    design: '🎨 Design Tools',
    fun: '🎲 Fun Tools',
  };

  const backLabel = catNames[category] ? `🔙 ${catNames[category]}` : '🔙 Category Menu';

  keyboard.text(backLabel, `tb_cat_${category}`).text('🏠 Main Menu', 'menu_main');
  return keyboard;
}

export function getBackToMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard().text('🔙 Back to Main Menu', 'menu_main');
}
