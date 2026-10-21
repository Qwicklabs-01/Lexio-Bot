import { BotContext } from '../types.js';
import {
  getToolBoxCategoriesKeyboard,
  getToolBoxDevKeyboard,
  getToolBoxCalcKeyboard,
  getToolBoxTextKeyboard,
  getToolBoxSeoKeyboard,
  getToolBoxDesignKeyboard,
  getToolBoxFunKeyboard,
  getBackToCategoryKeyboard,
  getBackToMenuKeyboard,
} from '../keyboards/tool.keyboards.js';
import { InlineKeyboard } from 'grammy';
import crypto from 'crypto';
import { prisma, isDatabaseConnected } from '../../database/client.js';

async function sendInteractiveToolMessage(ctx: BotContext, text: string, reply_markup: InlineKeyboard): Promise<void> {
  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        reply_markup,
      });
      await ctx.answerCallbackQuery();
      return;
    } catch {}
  }
  await ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup,
  });
}

export async function handleToolBoxMenu(ctx: BotContext): Promise<void> {
  const text =
    `🧰 *Lexio Multi-Tools Suite (100+ Utilities)*\n\n` +
    `Choose a category below to access all utilities directly in this chat:\n\n` +
    `• 💻 *Dev & Web:* JSON, QR, Base64, UUID, Hashes, Slugs, SQL, HTML, JWT, Timestamps\n` +
    `• 🧮 *Calculators:* BMI, Age, Loan EMI, Percent, Discount, Tips, Tax, Compound\n` +
    `• 📝 *Text & Content:* Case, Word Count, Reverser, Sorter, Morse, Lorem\n` +
    `• 🔍 *SEO & Marketing:* Meta Tags, Robots.txt, Sitemaps, HTTP Status Codes\n` +
    `• 🎨 *Color & Design:* HEX/RGB, Gradients, Shadows, Buttons\n` +
    `• 🎲 *Random & Fun:* Coin Flip, Dice, 8-Ball, Quotes, Passwords, RPS`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        reply_markup: getToolBoxCategoriesKeyboard(),
      });
      await ctx.answerCallbackQuery();
    } catch {
      await ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: getToolBoxCategoriesKeyboard(),
      });
    }
  } else {
    await ctx.reply(text, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxCategoriesKeyboard(),
    });
  }
}

export async function handleToolCategory(ctx: BotContext, category: string): Promise<void> {
  await ctx.answerCallbackQuery();

  if (category === 'dev') {
    await ctx.editMessageText(`💻 *Developer & Web Tools*\nSelect a tool below to run it immediately in this chat:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxDevKeyboard(),
    });
  } else if (category === 'calc') {
    await ctx.editMessageText(`🧮 *Calculators & Financial Utilities*\nSelect a tool below to calculate immediately in this chat:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxCalcKeyboard(),
    });
  } else if (category === 'text') {
    await ctx.editMessageText(`📝 *Text & Content Utilities*\nSelect a tool below to transform text in this chat:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxTextKeyboard(),
    });
  } else if (category === 'seo') {
    await ctx.editMessageText(`🔍 *SEO & Web Optimization Tools*\nSelect a tool below to generate SEO code in this chat:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxSeoKeyboard(),
    });
  } else if (category === 'design') {
    await ctx.editMessageText(`🎨 *Color & Design Utilities*\nSelect a tool below to generate CSS in this chat:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxDesignKeyboard(),
    });
  } else if (category === 'fun') {
    await ctx.editMessageText(`🎲 *Randomizers & Interactive Games*\nSelect a tool below to play or randomize in this chat:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxFunKeyboard(),
    });
  } else {
    await handleToolBoxMenu(ctx);
  }
}

// ==========================================
// 1. Developer & Web Tools
// ==========================================
export async function handleJsonCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || '';
  if (!input) {
    const sample = { app: 'Lexio', status: 'active', tools: 100, mode: 'telegram' };
    const formatted = JSON.stringify(sample, null, 2);
    const msg =
      `🔤 *JSON Beautifier & Validator:*\n\n` +
      `*Sample Validated JSON:*\n\`\`\`json\n${formatted}\n\`\`\`\n\n` +
      `👉 Send \`/json <your_json>\` to format your custom JSON directly in this chat!`;
    const keyboard = getBackToCategoryKeyboard('dev');
    await sendInteractiveToolMessage(ctx, msg, keyboard);
    return;
  }

  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    const minified = JSON.stringify(parsed);
    const msg =
      `✅ *Valid JSON Output:*\n\`\`\`json\n${formatted.substring(0, 3000)}\n\`\`\`\n\n` +
      `⚡ *Minified:* \`${minified.substring(0, 500)}\``;
    const keyboard = getBackToCategoryKeyboard('dev');
    await sendInteractiveToolMessage(ctx, msg, keyboard);
    logToolUsage(ctx.from?.id.toString(), 'json_formatter');
  } catch (err: any) {
    const msg = `❌ *JSON Syntax Error:*\n\`${err?.message || 'Invalid JSON syntax'}\``;
    const keyboard = getBackToCategoryKeyboard('dev');
    await sendInteractiveToolMessage(ctx, msg, keyboard);
  }
}

export async function handleQrCommand(ctx: BotContext, text?: string): Promise<void> {
  const query = text?.trim() || 'https://t.me/LexioUniversalBot';
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(query)}`;
  const keyboard = getBackToCategoryKeyboard('dev');

  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }
  await ctx.replyWithPhoto(qrImageUrl, {
    caption: `📱 *QR Code Generated Successfully!*\n\n🔗 *Data:* \`${query.substring(0, 100)}\`\n\n👉 Send \`/qr <your_text>\` to create any QR code!`,
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
  logToolUsage(ctx.from?.id.toString(), 'qr_generator', query);
}

export async function handleUuidCommand(ctx: BotContext): Promise<void> {
  const uuid = crypto.randomUUID();
  const msg = `🆔 *Generated UUID v4:*\n\n\`${uuid}\`\n\nTap code above to copy.`;
  const keyboard = getBackToCategoryKeyboard('dev', [
    [{ text: '🔄 Generate New UUID', data: 'tb_run_uuid' }],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
  logToolUsage(ctx.from?.id.toString(), 'uuid_gen');
}

export async function handleHashCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || 'Lexio Platform';
  const md5 = crypto.createHash('md5').update(input).digest('hex');
  const sha1 = crypto.createHash('sha1').update(input).digest('hex');
  const sha256 = crypto.createHash('sha256').update(input).digest('hex');

  const msg =
    `🔑 *Cryptographic Hashes for:* \`${input.substring(0, 30)}\`\n\n` +
    `• *MD5:*\n\`${md5}\`\n\n` +
    `• *SHA-1:*\n\`${sha1}\`\n\n` +
    `• *SHA-256:*\n\`${sha256}\`\n\n` +
    `👉 Send \`/hash <text>\` to hash your own text!`;

  const keyboard = getBackToCategoryKeyboard('dev', [
    [
      { text: '🔑 Hash "Lexio"', data: 'tb_run_hash_lexio' },
      { text: '🔑 Hash "Password"', data: 'tb_run_hash_pass' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
  logToolUsage(ctx.from?.id.toString(), 'hash_gen');
}

export async function handleSlugCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || '10 Best Features in Lexio Bot';
  const slug = input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const msg = `🔗 *SEO Clean Slug:*\n\n\`${slug}\`\n\nTap code above to copy.\n👉 Send \`/slug <title>\` for custom slugs.`;
  const keyboard = getBackToCategoryKeyboard('dev');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
  logToolUsage(ctx.from?.id.toString(), 'slug_gen');
}

export async function handleBase64Command(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || 'Lexio Universal Assistant';
  const encoded = Buffer.from(input, 'utf-8').toString('base64');
  const msg =
    `🔐 *Base64 Encoded Output:*\n\n\`${encoded}\`\n\n` +
    `Original text: \`${input}\`\n` +
    `👉 Send \`/b64 <text>\` to encode, or \`/b64d <encoded>\` to decode!`;
  const keyboard = getBackToCategoryKeyboard('dev');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
  logToolUsage(ctx.from?.id.toString(), 'base64_encode');
}

export async function handleBase64DecodeCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || 'TGV4aW8gVW5pdmVyc2FsIEFzc2lzdGFudA==';
  try {
    const decoded = Buffer.from(input, 'base64').toString('utf-8');
    const msg = `🔓 *Base64 Decoded Output:*\n\n\`${decoded}\`\n\nTap code above to copy.`;
    const keyboard = getBackToCategoryKeyboard('dev');
    await sendInteractiveToolMessage(ctx, msg, keyboard);
    logToolUsage(ctx.from?.id.toString(), 'base64_decode');
  } catch {
    await sendInteractiveToolMessage(ctx, '❌ Invalid Base64 payload.', getBackToCategoryKeyboard('dev'));
  }
}

export async function handleUrlEncodeCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || 'Lexio & Multi-Tools Suite 2026';
  const encoded = encodeURIComponent(input);
  const msg = `🌐 *URL Encoded:*\n\n\`${encoded}\`\n\n👉 Send \`/urlencode <text>\` or \`/urldecode <text>\``;
  const keyboard = getBackToCategoryKeyboard('dev');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleUrlDecodeCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || 'Lexio%20%26%20Multi-Tools%20Suite%202026';
  const decoded = decodeURIComponent(input);
  const msg = `🌐 *URL Decoded:*\n\n\`${decoded}\``;
  const keyboard = getBackToCategoryKeyboard('dev');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleSqlFormatCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || 'select id, name, created_at from tools where active = 1 order by id desc limit 5';
  const keywords = ['SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'INNER JOIN', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'];
  let formatted = input;
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(regex, `\n${kw}`);
  });
  formatted = formatted.trim();

  const msg =
    `💻 *Formatted SQL Query:*\n\`\`\`sql\n${formatted}\n\`\`\`\n\n` +
    `👉 Send \`/sql <your_query>\` to format any SQL code directly in this chat!`;
  const keyboard = getBackToCategoryKeyboard('dev');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
  logToolUsage(ctx.from?.id.toString(), 'sql_formatter');
}

export async function handleHtmlCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || '<div class="banner">Welcome "Lexio" & Friends</div>';
  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const msg = `🌐 *HTML Escaped Entity String:*\n\n\`${escaped}\``;
  const keyboard = getBackToCategoryKeyboard('dev');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleJwtCommand(ctx: BotContext, text?: string): Promise<void> {
  const token = text?.trim() || '';
  if (!token || token.split('.').length < 2) {
    const msg =
      `🔍 *JWT Token Inspector:*\n\n` +
      `Usage: \`/jwt <your_jwt_token>\`\n` +
      `Example: \`/jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\``;
    const keyboard = getBackToCategoryKeyboard('dev');
    await sendInteractiveToolMessage(ctx, msg, keyboard);
    return;
  }
  try {
    const parts = token.split('.');
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf-8'));
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));

    const msg =
      `🔍 *JWT Claims Decoded:*\n\n` +
      `*Header:* \`\`\`json\n${JSON.stringify(header, null, 2)}\n\`\`\`\n\n` +
      `*Payload:* \`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\``;
    const keyboard = getBackToCategoryKeyboard('dev');
    await sendInteractiveToolMessage(ctx, msg, keyboard);
  } catch {
    await sendInteractiveToolMessage(ctx, '❌ Invalid JWT token structure.', getBackToCategoryKeyboard('dev'));
  }
}

export async function handleTimestampCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || '';
  const date = input && !isNaN(Number(input)) ? new Date(Number(input) * (input.length <= 10 ? 1000 : 1)) : input ? new Date(input) : new Date();

  if (isNaN(date.getTime())) {
    await sendInteractiveToolMessage(ctx, '⚠️ Invalid date format. Usage: `/timestamp` or `/timestamp 1718000000`', getBackToCategoryKeyboard('dev'));
    return;
  }

  const epochSec = Math.floor(date.getTime() / 1000);
  const msg =
    `⏱️ *Timestamp & Date Converter:*\n\n` +
    `• *Epoch (Seconds):* \`${epochSec}\`\n` +
    `• *UTC Date:* \`${date.toUTCString()}\`\n` +
    `• *ISO 8601:* \`${date.toISOString()}\``;
  const keyboard = getBackToCategoryKeyboard('dev');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

// ==========================================
// 2. Calculators & Financial Tools
// ==========================================
export async function handleCalcCommand(ctx: BotContext, expression?: string): Promise<void> {
  const clean = (expression || '').replace(/[^0-9+\-*/().% ]/g, '').trim();
  if (!clean) {
    const msg =
      `🧮 *Math Calculator:*\n\n` +
      `Usage: \`/calc <math_expression>\`\n` +
      `Example: \`/calc 150 * 0.18 + 500\``;
    await sendInteractiveToolMessage(ctx, msg, getBackToCategoryKeyboard('calc'));
    return;
  }
  try {
    const result = Function(`'use strict'; return (${clean})`)();
    const msg =
      `🧮 *Calculation Result:*\n\`${clean}\`\n\n` +
      `Result = *${Number(result).toLocaleString('en-US', { maximumFractionDigits: 4 })}*`;
    await sendInteractiveToolMessage(ctx, msg, getBackToCategoryKeyboard('calc'));
    logToolUsage(ctx.from?.id.toString(), 'calculator', clean);
  } catch {
    await sendInteractiveToolMessage(ctx, '❌ Invalid math syntax.', getBackToCategoryKeyboard('calc'));
  }
}

export async function handleBmiCommand(ctx: BotContext, weightKgStr = '72', heightCmStr = '178'): Promise<void> {
  const weight = parseFloat(weightKgStr) || 72;
  const heightCm = parseFloat(heightCmStr) || 178;
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);

  let category = 'Normal weight 🟢';
  if (bmi < 18.5) category = 'Underweight 🟡';
  else if (bmi >= 25 && bmi < 29.9) category = 'Overweight 🟠';
  else if (bmi >= 30) category = 'Obese 🔴';

  const msg =
    `⚖️ *Body Mass Index (BMI) Calculator:*\n\n` +
    `• *Weight:* ${weight} kg | *Height:* ${heightCm} cm\n` +
    `• *BMI Score:* *${bmi.toFixed(1)}*\n` +
    `• *Health Category:* ${category}\n\n` +
    `_Standard WHO reference: 18.5 – 24.9 is healthy._\n\n` +
    `👉 Send \`/bmi <weight_kg> <height_cm>\` for your custom score!`;

  const keyboard = getBackToCategoryKeyboard('calc', [
    [
      { text: '⚖️ Test (65kg/172cm)', data: 'tb_run_bmi_65_172' },
      { text: '⚖️ Test (85kg/180cm)', data: 'tb_run_bmi_85_180' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
  logToolUsage(ctx.from?.id.toString(), 'bmi_calculator');
}

export async function handleAgeCommand(ctx: BotContext, dobStr = '2000-01-01'): Promise<void> {
  const input = dobStr.trim() || '2000-01-01';
  const dob = new Date(input);
  if (isNaN(dob.getTime())) {
    await sendInteractiveToolMessage(ctx, '❌ Invalid date format. Use `YYYY-MM-DD` (e.g. `/age 1998-05-15`).', getBackToCategoryKeyboard('calc'));
    return;
  }

  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
  const nextBirthday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);
  const daysToNext = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const msg =
    `🎂 *Exact Age & Birthday Report:*\n\n` +
    `• *Date of Birth:* ${dob.toDateString()}\n` +
    `• *Age:* *${years} years, ${months} months, ${days} days*\n` +
    `• *Total Days Lived:* ~${totalDays.toLocaleString()} days\n` +
    `• *Next Birthday:* in *${daysToNext} days* 🎉\n\n` +
    `👉 Send \`/age YYYY-MM-DD\` (e.g. \`/age 1998-05-15\`) for your exact age!`;

  const keyboard = getBackToCategoryKeyboard('calc', [
    [
      { text: '🎂 Test (1998-05-15)', data: 'tb_run_age_1998' },
      { text: '🎂 Test (2002-10-20)', data: 'tb_run_age_2002' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleEmiCommand(ctx: BotContext, amountStr = '50000', rateStr = '8.5', yearsStr = '5'): Promise<void> {
  const p = parseFloat(amountStr) || 50000;
  const annualRate = parseFloat(rateStr) || 8.5;
  const years = parseFloat(yearsStr) || 5;

  const r = annualRate / 12 / 100;
  const n = years * 12;
  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  const msg =
    `💰 *Loan EMI Calculation:*\n\n` +
    `• *Loan Amount:* $${p.toLocaleString()}\n` +
    `• *Interest Rate:* ${annualRate}% p.a.\n` +
    `• *Tenure:* ${years} years (${n} monthly payments)\n\n` +
    `• 💵 *Monthly EMI:* *$${emi.toFixed(2)}*\n` +
    `• 📈 *Total Interest:* $${totalInterest.toFixed(2)}\n` +
    `• 💳 *Total Repayment:* *$${totalPayment.toFixed(2)}*\n\n` +
    `👉 Send \`/emi <amount> <rate> <years>\` for custom loan calculations!`;

  const keyboard = getBackToCategoryKeyboard('calc', [
    [
      { text: '💰 $25k @ 7% 3yr', data: 'tb_run_emi_25_7_3' },
      { text: '💰 $100k @ 9% 10yr', data: 'tb_run_emi_100_9_10' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handlePercentCommand(ctx: BotContext, percentStr = '20', totalStr = '450'): Promise<void> {
  const p = parseFloat(percentStr) || 20;
  const total = parseFloat(totalStr) || 450;
  const val = (p / 100) * total;

  const msg =
    `📊 *Percentage Calculator:*\n\n` +
    `*${p}%* of *${total.toLocaleString()}* = *${val.toLocaleString()}*\n\n` +
    `👉 Send \`/percent <rate> <total>\` (e.g. \`/percent 18 1500\`)`;

  const keyboard = getBackToCategoryKeyboard('calc', [
    [
      { text: '📊 15% of $200', data: 'tb_run_pct_15_200' },
      { text: '📊 25% of $800', data: 'tb_run_pct_25_800' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleDiscountCommand(ctx: BotContext, priceStr = '120', percentStr = '25'): Promise<void> {
  const price = parseFloat(priceStr) || 120;
  const percent = parseFloat(percentStr) || 25;
  const savings = price * (percent / 100);
  const finalPrice = price - savings;

  const msg =
    `🏷️ *Discount & Sale Price Report:*\n\n` +
    `• *Original Price:* $${price.toFixed(2)}\n` +
    `• *Discount Rate:* ${percent}%\n` +
    `• *Total Savings:* $${savings.toFixed(2)}\n` +
    `• *Final Price to Pay:* *$${finalPrice.toFixed(2)}*\n\n` +
    `👉 Send \`/discount <price> <percent>\` (e.g. \`/discount 250 30\`)`;

  const keyboard = getBackToCategoryKeyboard('calc', [
    [
      { text: '🏷️ 20% off $80', data: 'tb_run_disc_80_20' },
      { text: '🏷️ 50% off $250', data: 'tb_run_disc_250_50' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleTipCommand(ctx: BotContext, billStr = '150', tipStr = '18', peopleStr = '3'): Promise<void> {
  const bill = parseFloat(billStr) || 150;
  const tipPercent = parseFloat(tipStr) || 18;
  const people = parseInt(peopleStr, 10) || 3;

  const tipAmount = bill * (tipPercent / 100);
  const total = bill + tipAmount;
  const perPerson = total / people;

  const msg =
    `🪙 *Restaurant Tip & Split Bill:*\n\n` +
    `• *Subtotal:* $${bill.toFixed(2)}\n` +
    `• *Tip (${tipPercent}%):* $${tipAmount.toFixed(2)}\n` +
    `• *Grand Total:* *$${total.toFixed(2)}*\n` +
    `• *Each Person Pays (${people} people):* *$${perPerson.toFixed(2)}*\n\n` +
    `👉 Send \`/tip <bill> <percent> [people]\` (e.g. \`/tip 100 15 2\`)`;

  const keyboard = getBackToCategoryKeyboard('calc', [
    [
      { text: '🪙 15% Tip (2p)', data: 'tb_run_tip_100_15_2' },
      { text: '🪙 20% Tip (4p)', data: 'tb_run_tip_200_20_4' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleCompoundCommand(ctx: BotContext, principalStr = '10000', rateStr = '7', yearsStr = '10'): Promise<void> {
  const p = parseFloat(principalStr) || 10000;
  const r = (parseFloat(rateStr) || 7) / 100;
  const t = parseFloat(yearsStr) || 10;

  const amount = p * Math.pow(1 + r, t);
  const interestEarned = amount - p;

  const msg =
    `📈 *Compound Interest Result:*\n\n` +
    `• *Initial Principal:* $${p.toLocaleString()}\n` +
    `• *Annual Return:* ${(r * 100).toFixed(1)}%\n` +
    `• *Duration:* ${t} years\n\n` +
    `• 💵 *Interest Earned:* *$${interestEarned.toFixed(2)}*\n` +
    `• 🏦 *Final Balance:* *$${amount.toFixed(2)}*\n\n` +
    `👉 Send \`/compound <principal> <rate> <years>\``;

  const keyboard = getBackToCategoryKeyboard('calc', [
    [
      { text: '📈 $5k @ 8% 5yr', data: 'tb_run_comp_5_8_5' },
      { text: '📈 $20k @ 10% 15yr', data: 'tb_run_comp_20_10_15' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleTaxCommand(ctx: BotContext, amountStr = '1200', rateStr = '18'): Promise<void> {
  const amount = parseFloat(amountStr) || 1200;
  const rate = parseFloat(rateStr) || 18;
  const tax = (amount * rate) / 100;
  const total = amount + tax;

  const msg =
    `🧾 *Sales Tax / GST Breakdown:*\n\n` +
    `• *Base Amount:* $${amount.toFixed(2)}\n` +
    `• *Tax Rate:* ${rate}%\n` +
    `• *Tax Payable:* $${tax.toFixed(2)}\n` +
    `• *Total (Gross):* *$${total.toFixed(2)}*\n\n` +
    `👉 Send \`/tax <amount> <rate>\` (e.g. \`/tax 500 12\`)`;

  const keyboard = getBackToCategoryKeyboard('calc', [
    [
      { text: '🧾 $500 @ 10%', data: 'tb_run_tax_500_10' },
      { text: '🧾 $2000 @ 18%', data: 'tb_run_tax_2000_18' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

// ==========================================
// 3. Text & Content Utilities
// ==========================================
export async function handleCaseCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || 'lexio universal assistant';
  const upper = input.toUpperCase();
  const lower = input.toLowerCase();
  const title = input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
  const snake = input.toLowerCase().replace(/\s+/g, '_');
  const kebab = input.toLowerCase().replace(/\s+/g, '-');
  const camel = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

  const msg =
    `🔠 *Transformed Cases for:* \`${input}\`\n\n` +
    `• *UPPERCASE:*\n\`${upper}\`\n\n` +
    `• *lowercase:*\n\`${lower}\`\n\n` +
    `• *Title Case:*\n\`${title}\`\n\n` +
    `• *camelCase:*\n\`${camel}\`\n\n` +
    `• *snake_case:*\n\`${snake}\`\n\n` +
    `• *kebab-case:*\n\`${kebab}\`\n\n` +
    `👉 Send \`/case <your_text>\` for custom text!`;

  const keyboard = getBackToCategoryKeyboard('text');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
  logToolUsage(ctx.from?.id.toString(), 'case_converter');
}

export async function handleCountCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || 'Lexio is your universal multi-tool platform powered by advanced AI and instant cloud utilities.';
  const words = input.split(/\s+/).filter(Boolean).length;
  const chars = input.length;
  const charsNoSpaces = input.replace(/\s+/g, '').length;
  const sentences = input.split(/[.!?]+/).filter(Boolean).length;
  const readingTimeSec = Math.max(1, Math.round((words / 200) * 60));

  const msg =
    `📊 *Text Metrics & Analysis:*\n\n` +
    `• 📝 *Words:* ${words.toLocaleString()}\n` +
    `• 🔤 *Characters:* ${chars.toLocaleString()} (without spaces: ${charsNoSpaces.toLocaleString()})\n` +
    `• 💬 *Sentences:* ${sentences}\n` +
    `• ⏱️ *Est. Reading Time:* ~${readingTimeSec}s\n\n` +
    `👉 Send \`/count <your_paragraph>\` to analyze any text!`;

  const keyboard = getBackToCategoryKeyboard('text');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
  logToolUsage(ctx.from?.id.toString(), 'word_counter');
}

export async function handleReverseCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || 'Universal Intelligence';
  const reversed = input.split('').reverse().join('');
  const msg =
    `🔄 *Reversed Text:*\n\n\`${reversed}\`\n\n` +
    `👉 Send \`/reverse <your_text>\``;
  const keyboard = getBackToCategoryKeyboard('text');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleSortCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = text?.trim() || 'Zebra, Apple, Mango, Banana, Orange';
  const isLines = input.includes('\n');
  const items = isLines ? input.split('\n') : input.split(',').map((s) => s.trim());
  const sortedAsc = [...items].sort().join(isLines ? '\n' : ', ');
  const sortedDesc = [...items].sort().reverse().join(isLines ? '\n' : ', ');

  const msg =
    `🔡 *Alphabetically Sorted:*\n\n` +
    `*Ascending (A ➔ Z):*\n\`${sortedAsc}\`\n\n` +
    `*Descending (Z ➔ A):*\n\`${sortedDesc}\`\n\n` +
    `👉 Send \`/sort <items>\``;
  const keyboard = getBackToCategoryKeyboard('text');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleMorseCommand(ctx: BotContext, text?: string): Promise<void> {
  const input = (text?.trim() || 'SOS LEXIO').toUpperCase();
  const morseMap: Record<string, string> = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
    I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
    Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
    Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    ' ': '/',
  };
  const isMorse = /^[\.\-\s\/]+$/.test(input);

  if (isMorse) {
    const reverseMap = Object.entries(morseMap).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {} as Record<string, string>);
    const decoded = input
      .split(' ')
      .map((code) => reverseMap[code] || (code === '/' ? ' ' : '?'))
      .join('');
    const msg = `📻 *Decoded from Morse:* \`${decoded}\``;
    await sendInteractiveToolMessage(ctx, msg, getBackToCategoryKeyboard('text'));
  } else {
    const encoded = input
      .split('')
      .map((ch) => morseMap[ch] || '')
      .join(' ');
    const msg =
      `📻 *Encoded to Morse:*\n\n\`${encoded}\`\n\n` +
      `👉 Send \`/morse <text>\` or \`/morse <dots_and_dashes>\``;
    await sendInteractiveToolMessage(ctx, msg, getBackToCategoryKeyboard('text'));
  }
}

export async function handleLoremCommand(ctx: BotContext, countStr = '1'): Promise<void> {
  const count = Math.min(Math.max(parseInt(countStr, 10) || 1, 1), 5);
  const paragraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
  const output = Array(count).fill(paragraph).join('\n\n');

  const msg =
    `📜 *Generated Lorem Ipsum (${count} paragraph${count > 1 ? 's' : ''}):*\n\n${output}`;
  const keyboard = getBackToCategoryKeyboard('text', [
    [
      { text: '📜 1 Paragraph', data: 'tb_run_lorem_1' },
      { text: '📜 3 Paragraphs', data: 'tb_run_lorem_3' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

// ==========================================
// 4. SEO & Web Optimization Tools
// ==========================================
export async function handleMetaCommand(ctx: BotContext, text?: string): Promise<void> {
  const parts = (text || 'My Website | Supercharge your productivity | https://mywebsite.com').split('|').map((s) => s.trim());
  const title = parts[0] || 'My Awesome Web Application';
  const desc = parts[1] || 'Supercharge your daily workflow with fast utilities.';
  const url = parts[2] || 'https://mywebsite.com';

  const metaHtml =
    `<!-- Primary Meta Tags -->\n` +
    `<title>${title}</title>\n` +
    `<meta name="title" content="${title}">\n` +
    `<meta name="description" content="${desc}">\n` +
    `<meta name="robots" content="index, follow">\n\n` +
    `<!-- Open Graph / Social -->\n` +
    `<meta property="og:type" content="website">\n` +
    `<meta property="og:url" content="${url}">\n` +
    `<meta property="og:title" content="${title}">\n` +
    `<meta property="og:description" content="${desc}">`;

  const msg =
    `🏷️ *SEO Meta Tags Generated:*\n\`\`\`html\n${metaHtml}\n\`\`\`\n\n` +
    `👉 Send \`/meta Title | Description | URL\` for custom tags!`;
  const keyboard = getBackToCategoryKeyboard('seo');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleRobotsCommand(ctx: BotContext, domainStr = 'https://mywebsite.com'): Promise<void> {
  const domain = domainStr.trim() || 'https://mywebsite.com';
  const robots =
    `User-agent: *\n` +
    `Allow: /\n` +
    `Disallow: /admin/\n` +
    `Disallow: /api/\n\n` +
    `Sitemap: ${domain.replace(/\/$/, '')}/sitemap.xml`;

  const msg = `🤖 *Standard Robots.txt:*\n\`\`\`txt\n${robots}\n\`\`\``;
  const keyboard = getBackToCategoryKeyboard('seo');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleSitemapCommand(ctx: BotContext, domainStr = 'https://mywebsite.com'): Promise<void> {
  const domain = domainStr.trim() || 'https://mywebsite.com';
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url>\n` +
    `    <loc>${domain.replace(/\/$/, '')}/</loc>\n` +
    `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n` +
    `    <priority>1.0</priority>\n` +
    `  </url>\n` +
    `</urlset>`;

  const msg = `🗺️ *XML Sitemap Template:*\n\`\`\`xml\n${sitemap}\n\`\`\``;
  const keyboard = getBackToCategoryKeyboard('seo');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleHttpStatusCommand(ctx: BotContext, codeStr = '200'): Promise<void> {
  const code = codeStr.trim() || '200';
  const codes: Record<string, string> = {
    '200': 'OK — Standard successful HTTP response.',
    '201': 'Created — Resource was successfully created.',
    '301': 'Moved Permanently — URL was redirected permanently.',
    '302': 'Found / Temporary Redirect — URL temporarily redirected.',
    '400': 'Bad Request — Malformed request syntax or parameters.',
    '401': 'Unauthorized — Missing or invalid authentication token.',
    '403': 'Forbidden — Server refuses authorization.',
    '404': 'Not Found — Requested resource could not be located.',
    '429': 'Too Many Requests — Rate limit exceeded.',
    '500': 'Internal Server Error — Unexpected server failure.',
    '502': 'Bad Gateway — Upstream reverse proxy received invalid response.',
    '503': 'Service Unavailable — Server temporarily overloaded or down.',
  };

  const desc = codes[code] || 'Status code received. Try /http 404 or /http 500';
  const msg =
    `🚥 *HTTP Status Code: ${code}*\n\n${desc}\n\n` +
    `👉 Send \`/http <code>\` (e.g. \`/http 404\`)`;

  const keyboard = getBackToCategoryKeyboard('seo', [
    [
      { text: '🚥 200 OK', data: 'tb_run_http_200' },
      { text: '🚥 404 Not Found', data: 'tb_run_http_404' },
      { text: '🚥 500 Error', data: 'tb_run_http_500' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

// ==========================================
// 5. Color & Design Utilities
// ==========================================
export async function handleHexToRgbCommand(ctx: BotContext, hexStr = '#38bdf8'): Promise<void> {
  let hex = hexStr.replace('#', '').trim() || '38bdf8';
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  if (hex.length !== 6) hex = '38bdf8';

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const msg =
    `🎨 *Color Formats for #${hex.toUpperCase()}:*\n\n` +
    `• *HEX:* \`#${hex.toUpperCase()}\`\n` +
    `• *RGB:* \`rgb(${r}, ${g}, ${b})\`\n` +
    `• *RGBA:* \`rgba(${r}, ${g}, ${b}, 1.0)\`\n\n` +
    `👉 Send \`/hex #color\` (e.g. \`/hex #f97316\`)`;

  const keyboard = getBackToCategoryKeyboard('design', [
    [
      { text: '🎨 #10b981 (Emerald)', data: 'tb_run_hex_10b981' },
      { text: '🎨 #f97316 (Orange)', data: 'tb_run_hex_f97316' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleGradientCommand(ctx: BotContext): Promise<void> {
  const gradients = [
    { name: 'Sunset Aura', css: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
    { name: 'Cyber Neon', css: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)' },
    { name: 'Emerald Horizon', css: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' },
    { name: 'Electric Violet', css: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)' },
  ];
  const g = gradients[Math.floor(Math.random() * gradients.length)];

  const msg =
    `🌈 *CSS Gradient: ${g.name}*\n\n\`\`\`css\nbackground: ${g.css};\n\`\`\`\n\n` +
    `Tap code above to copy directly into your styles.`;

  const keyboard = getBackToCategoryKeyboard('design', [
    [{ text: '🌈 Next Gradient ➔', data: 'tb_run_gradient' }],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleShadowCommand(ctx: BotContext): Promise<void> {
  const shadows = [
    { name: 'Smooth Modern Card', css: 'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);' },
    { name: 'Subtle Float Elevation', css: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);' },
    { name: 'Cyber Cyan Glow', css: 'box-shadow: 0 0 25px rgba(56, 189, 248, 0.35);' },
  ];
  const s = shadows[Math.floor(Math.random() * shadows.length)];

  const msg =
    `📦 *CSS Box Shadow: ${s.name}*\n\n\`\`\`css\n${s.css}\n\`\`\`\n\n` +
    `Tap code above to copy.`;

  const keyboard = getBackToCategoryKeyboard('design', [
    [{ text: '📦 Next Shadow Preset ➔', data: 'tb_run_shadow' }],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

// ==========================================
// 6. Random, Games & Fun Tools
// ==========================================
export async function handleCoinCommand(ctx: BotContext): Promise<void> {
  const outcome = Math.random() > 0.5 ? '👑 HEADS' : '⚡ TAILS';
  const msg = `🪙 *3D Coin Toss:*\n\nResult: *${outcome}*`;
  const keyboard = getBackToCategoryKeyboard('fun', [
    [{ text: '🪙 Flip Again!', data: 'tb_run_coin' }],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleDiceCommand(ctx: BotContext, sidesStr = '6'): Promise<void> {
  const sides = Math.max(2, Math.min(parseInt(sidesStr, 10) || 6, 100));
  const roll = Math.floor(Math.random() * sides) + 1;
  const msg = `🎲 *Dice Roller:*\n\nYou rolled: *${roll}* (on d${sides})`;

  const keyboard = getBackToCategoryKeyboard('fun', [
    [
      { text: '🎲 Roll d6', data: 'tb_run_dice_6' },
      { text: '🎲 Roll d20', data: 'tb_run_dice_20' },
      { text: '🎲 Roll d100', data: 'tb_run_dice_100' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handle8BallCommand(ctx: BotContext, question = ''): Promise<void> {
  const q = question.trim() || 'Will today be a great day?';
  const answers = [
    'It is certain 🟢', 'Without a doubt 🟢', 'You may rely on it 🟢',
    'Reply hazy, try again 🟡', 'Ask again later 🟡', 'Better not tell you now 🟡',
    "Don't count on it 🔴", 'My sources say no 🔴', 'Very doubtful 🔴',
  ];
  const answer = answers[Math.floor(Math.random() * answers.length)];
  const msg =
    `🎱 *Magic 8-Ball Oracle:*\n\n` +
    `• Question: "${q}"\n` +
    `• Answer: *${answer}*\n\n` +
    `👉 Send \`/8ball <your_question>\``;

  const keyboard = getBackToCategoryKeyboard('fun', [
    [{ text: '🎱 Shake Again', data: 'tb_run_8ball' }],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handleQuoteCommand(ctx: BotContext): Promise<void> {
  const quotes = [
    { q: 'The secret of getting ahead is getting started.', a: 'Mark Twain' },
    { q: 'Quality is not an act, it is a habit.', a: 'Aristotle' },
    { q: 'Simplicity is the soul of efficiency.', a: 'Austin Freeman' },
    { q: "It always seems impossible until it's done.", a: 'Nelson Mandela' },
    { q: 'Stay hungry, stay foolish.', a: 'Steve Jobs' },
  ];
  const picked = quotes[Math.floor(Math.random() * quotes.length)];
  const msg = `💬 *Inspirational Quote:*\n\n"${picked.q}"\n— *${picked.a}*`;

  const keyboard = getBackToCategoryKeyboard('fun', [
    [{ text: '💬 Next Quote ➔', data: 'tb_run_quote' }],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handlePickCommand(ctx: BotContext, optionsStr = 'Pizza, Burger, Sushi'): Promise<void> {
  const options = optionsStr.split(',').map((s) => s.trim()).filter(Boolean);
  const picked = options[Math.floor(Math.random() * options.length)] || 'Option 1';

  const msg =
    `🎯 *Random Choice Picker:*\n\n` +
    `Options: _${options.join(', ')}_\n` +
    `Selected: 👉 *${picked}*\n\n` +
    `👉 Send \`/pick option 1, option 2, option 3\``;

  const keyboard = getBackToCategoryKeyboard('fun');
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

export async function handlePasswordCommand(ctx: BotContext, lenStr = '16'): Promise<void> {
  const length = Math.min(Math.max(parseInt(lenStr, 10) || 16, 8), 64);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|';
  let password = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) password += chars[bytes[i] % chars.length];

  const msg =
    `🔐 *256-Bit Cryptographic Password (${length} chars):*\n\n` +
    `\`${password}\`\n\n` +
    `🛡️ *Entropy:* High cryptographic randomness.\nTap code above to copy.\n\n` +
    `👉 Send \`/password <length>\` (e.g. \`/password 24\`)`;

  const keyboard = getBackToCategoryKeyboard('fun', [
    [
      { text: '🔄 16 Chars', data: 'tb_run_pw_16' },
      { text: '🔄 24 Chars', data: 'tb_run_pw_24' },
      { text: '🔄 32 Chars', data: 'tb_run_pw_32' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
  logToolUsage(ctx.from?.id.toString(), 'password_gen');
}

export async function handleRpsCommand(ctx: BotContext, choice = 'rock'): Promise<void> {
  const user = choice.trim().toLowerCase();
  const valid = ['rock', 'paper', 'scissors'];
  const userChoice = valid.includes(user) ? user : 'rock';
  const botChoice = valid[Math.floor(Math.random() * valid.length)];

  let outcome = '🤝 It is a tie!';
  if (
    (userChoice === 'rock' && botChoice === 'scissors') ||
    (userChoice === 'paper' && botChoice === 'rock') ||
    (userChoice === 'scissors' && botChoice === 'paper')
  ) {
    outcome = '🎉 You won!';
  } else if (userChoice !== botChoice) {
    outcome = '🤖 Lexio won!';
  }

  const msg =
    `🎮 *Rock Paper Scissors Game:*\n\n` +
    `• Your Choice: *${userChoice.toUpperCase()}*\n` +
    `• Lexio Choice: *${botChoice.toUpperCase()}*\n\n` +
    `${outcome}`;

  const keyboard = getBackToCategoryKeyboard('fun', [
    [
      { text: '🪨 Rock', data: 'tb_run_rps_rock' },
      { text: '📄 Paper', data: 'tb_run_rps_paper' },
      { text: '✂️ Scissors', data: 'tb_run_rps_scissors' },
    ],
  ]);
  await sendInteractiveToolMessage(ctx, msg, keyboard);
}

async function logToolUsage(userId: string | undefined, toolName: string, meta?: string): Promise<void> {
  if (!userId || !isDatabaseConnected) return;
  try {
    await prisma.toolUsageLog.create({
      data: {
        userId,
        toolName,
        inputMeta: meta?.substring(0, 100),
      },
    });
    await prisma.user.update({
      where: { telegramId: userId },
      data: { toolsUsedCount: { increment: 1 } },
    });
  } catch {}
}
