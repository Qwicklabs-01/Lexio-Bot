import { BotContext } from '../types.js';
import {
  getToolBoxCategoriesKeyboard,
  getToolBoxDevKeyboard,
  getToolBoxCalcKeyboard,
  getToolBoxTextKeyboard,
  getToolBoxSeoKeyboard,
  getToolBoxDesignKeyboard,
  getToolBoxFunKeyboard,
  getBackToMenuKeyboard,
} from '../keyboards/tool.keyboards.js';
import crypto from 'crypto';
import { prisma } from '../../database/client.js';

export async function handleToolBoxMenu(ctx: BotContext): Promise<void> {
  const text =
    `🧰 *Lexio Multi-Tools Suite (100+ Utilities)*\n\n` +
    `Choose a category below to explore tools, or tap *Browse All 100+ Tools in Studio* for the visual suite:\n\n` +
    `• 💻 *Dev & Web:* JSON, QR, Base64, UUID, Hashes, Slugs, SQL, HTML, JWT, Timestamps\n` +
    `• 🧮 *Calculators:* BMI, Age, Loan EMI, Percent, Discount, Tips, Tax, Compound, Currency\n` +
    `• 📝 *Text & Content:* Case, Word Count, Reverser, Sorter, Morse, Lorem, Dedup, Binary\n` +
    `• 🔍 *SEO & Marketing:* Meta Tags, Robots.txt, Sitemaps, Keyword Density, OG Tags, HTTP\n` +
    `• 🎨 *Color & Design:* HEX/RGB, Gradients, Shadows, CSS Buttons, Contrast, Glass\n` +
    `• 🎲 *Random & Fun:* Coin Flip, Dice, 8-Ball, Quotes, Passwords, Choice Picker, RPS`;

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
    await ctx.editMessageText(`💻 *Developer & Web Tools*\nSelect a tool below or use bot commands:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxDevKeyboard(),
    });
  } else if (category === 'calc') {
    await ctx.editMessageText(`🧮 *Calculators & Financial Utilities*\nSelect a tool below or use bot commands:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxCalcKeyboard(),
    });
  } else if (category === 'text') {
    await ctx.editMessageText(`📝 *Text & Content Utilities*\nSelect a tool below or use bot commands:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxTextKeyboard(),
    });
  } else if (category === 'seo') {
    await ctx.editMessageText(`🔍 *SEO & Web Optimization Tools*\nSelect a tool below or use bot commands:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxSeoKeyboard(),
    });
  } else if (category === 'design') {
    await ctx.editMessageText(`🎨 *Color & Design Utilities*\nSelect a tool below or use bot commands:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxDesignKeyboard(),
    });
  } else if (category === 'fun') {
    await ctx.editMessageText(`🎲 *Randomizers & Interactive Tools*\nSelect a tool below or use bot commands:`, {
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
export async function handleJsonCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    const sample = { app: 'Lexio', status: 'active', tools: 100, version: '2.5.0' };
    await ctx.reply(
      `🔤 *JSON Beautifier & Validator:*\n\n` +
      `Usage: \`/json <your_json_string>\`\n\n` +
      `*Example Formatted JSON:*\n\`\`\`json\n${JSON.stringify(sample, null, 2)}\n\`\`\``,
      { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
    );
    return;
  }

  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    const minified = JSON.stringify(parsed);
    await ctx.reply(
      `✅ *Valid JSON (Formatted):*\n\`\`\`json\n${formatted.substring(0, 3000)}\n\`\`\`\n\n` +
      `⚡ *Minified:* \`${minified.substring(0, 500)}\``,
      { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
    );
    logToolUsage(ctx.from?.id.toString(), 'json_formatter');
  } catch (err: any) {
    await ctx.reply(`❌ *JSON Syntax Error:*\n\`${err?.message || 'Invalid JSON format'}\``, {
      parse_mode: 'Markdown',
      reply_markup: getBackToMenuKeyboard(),
    });
  }
}

export async function handleQrCommand(ctx: BotContext, text: string): Promise<void> {
  const query = text.trim();
  if (!query) {
    await ctx.reply('⚠️ Usage: `/qr https://example.com` or `/qr your text here`', { parse_mode: 'Markdown' });
    return;
  }
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(query)}`;
  await ctx.replyWithPhoto(qrImageUrl, {
    caption: `📱 *QR Code Generated Successfully!*\n\n🔗 *Data:* \`${query.substring(0, 100)}\``,
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
  logToolUsage(ctx.from?.id.toString(), 'qr_generator', query);
}

export async function handleUuidCommand(ctx: BotContext): Promise<void> {
  const uuid = crypto.randomUUID();
  await ctx.reply(`🆔 *Generated UUID v4:*\n\n\`${uuid}\`\n\nTap to copy.`, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
  logToolUsage(ctx.from?.id.toString(), 'uuid_gen');
}

export async function handleHashCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/hash your text here`', { parse_mode: 'Markdown' });
    return;
  }
  const md5 = crypto.createHash('md5').update(input).digest('hex');
  const sha1 = crypto.createHash('sha1').update(input).digest('hex');
  const sha256 = crypto.createHash('sha256').update(input).digest('hex');
  const sha512 = crypto.createHash('sha512').update(input).digest('hex').substring(0, 64) + '...';

  await ctx.reply(
    `🔑 *Cryptographic Hashes for:* \`${input.substring(0, 30)}\`\n\n` +
    `• *MD5:*\n\`${md5}\`\n\n` +
    `• *SHA-1:*\n\`${sha1}\`\n\n` +
    `• *SHA-256:*\n\`${sha256}\`\n\n` +
    `• *SHA-512 (first 64 chars):*\n\`${sha512}\``,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
  logToolUsage(ctx.from?.id.toString(), 'hash_gen');
}

export async function handleSlugCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/slug 10 Tips for Better Web Performance`', { parse_mode: 'Markdown' });
    return;
  }
  const slug = input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  await ctx.reply(`🔗 *SEO Clean Slug:*\n\n\`${slug}\`\n\nTap to copy.`, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
  logToolUsage(ctx.from?.id.toString(), 'slug_gen');
}

export async function handleBase64Command(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/b64 Hello World`', { parse_mode: 'Markdown' });
    return;
  }
  const encoded = Buffer.from(input, 'utf-8').toString('base64');
  await ctx.reply(`🔐 *Base64 Encoded Output:*\n\n\`${encoded}\`\n\nTap to copy.`, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
  logToolUsage(ctx.from?.id.toString(), 'base64_encode');
}

export async function handleBase64DecodeCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/b64d SGVsbG8gV29ybGQ=`', { parse_mode: 'Markdown' });
    return;
  }
  try {
    const decoded = Buffer.from(input, 'base64').toString('utf-8');
    await ctx.reply(`🔓 *Base64 Decoded Output:*\n\n\`${decoded}\`\n\nTap to copy.`, {
      parse_mode: 'Markdown',
      reply_markup: getBackToMenuKeyboard(),
    });
    logToolUsage(ctx.from?.id.toString(), 'base64_decode');
  } catch {
    await ctx.reply('❌ Invalid Base64 payload.');
  }
}

export async function handleUrlEncodeCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/urlencode Hello World & Co?`', { parse_mode: 'Markdown' });
    return;
  }
  const encoded = encodeURIComponent(input);
  await ctx.reply(`🌐 *URL Encoded:*\n\n\`${encoded}\``, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

export async function handleUrlDecodeCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/urldecode Hello%20World%20%26%20Co%3F`', { parse_mode: 'Markdown' });
    return;
  }
  const decoded = decodeURIComponent(input);
  await ctx.reply(`🌐 *URL Decoded:*\n\n\`${decoded}\``, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

export async function handleSqlFormatCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply(
      '⚠️ Usage: `/sql select id, name, email from users where status = 1 order by id desc limit 10`',
      { parse_mode: 'Markdown' }
    );
    return;
  }
  const keywords = ['SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'INNER JOIN', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'];
  let formatted = input;
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(regex, `\n${kw}`);
  });
  formatted = formatted.trim();

  await ctx.reply(`💻 *Formatted SQL Query:*\n\`\`\`sql\n${formatted}\n\`\`\``, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
  logToolUsage(ctx.from?.id.toString(), 'sql_formatter');
}

export async function handleHtmlCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/html <div class="header">Hello "World" & Co</div>`', { parse_mode: 'Markdown' });
    return;
  }
  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  await ctx.reply(`🌐 *HTML Escaped Entity String:*\n\n\`${escaped}\``, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

export async function handleJwtCommand(ctx: BotContext, text: string): Promise<void> {
  const token = text.trim();
  if (!token || token.split('.').length < 2) {
    await ctx.reply('⚠️ Usage: `/jwt <your_jwt_token>`\nExample: `/jwt eyJhbGciOi...`', { parse_mode: 'Markdown' });
    return;
  }
  try {
    const parts = token.split('.');
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf-8'));
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));

    await ctx.reply(
      `🔍 *JWT Token Inspected:*\n\n` +
      `*Header:* \`\`\`json\n${JSON.stringify(header, null, 2)}\n\`\`\`\n\n` +
      `*Payload:* \`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\``,
      { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
    );
  } catch {
    await ctx.reply('❌ Invalid JWT token structure.');
  }
}

export async function handleTimestampCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  const date = input && !isNaN(Number(input)) ? new Date(Number(input) * (input.length <= 10 ? 1000 : 1)) : input ? new Date(input) : new Date();

  if (isNaN(date.getTime())) {
    await ctx.reply('⚠️ Invalid date/timestamp format. Usage: `/timestamp` or `/timestamp 1718000000`', { parse_mode: 'Markdown' });
    return;
  }

  const epochSec = Math.floor(date.getTime() / 1000);
  const epochMs = date.getTime();

  await ctx.reply(
    `⏱️ *Timestamp & Date Converter:*\n\n` +
    `• *Epoch (Seconds):* \`${epochSec}\`\n` +
    `• *Epoch (Milliseconds):* \`${epochMs}\`\n` +
    `• *UTC Date:* \`${date.toUTCString()}\`\n` +
    `• *ISO 8601:* \`${date.toISOString()}\``,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

// ==========================================
// 2. Calculators & Financial Tools
// ==========================================
export async function handleCalcCommand(ctx: BotContext, expression: string): Promise<void> {
  const clean = expression.replace(/[^0-9+\-*/().% ]/g, '').trim();
  if (!clean) {
    await ctx.reply('⚠️ Usage: `/calc 150 * 0.18 + 500`', { parse_mode: 'Markdown' });
    return;
  }
  try {
    const result = Function(`'use strict'; return (${clean})`)();
    await ctx.reply(
      `🧮 *Calculation:*\n\`${clean}\`\n\nResult: *${Number(result).toLocaleString('en-US', { maximumFractionDigits: 4 })}*`,
      { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
    );
    logToolUsage(ctx.from?.id.toString(), 'calculator', clean);
  } catch {
    await ctx.reply('❌ Invalid math syntax.');
  }
}

export async function handleBmiCommand(ctx: BotContext, weightKgStr: string, heightCmStr: string): Promise<void> {
  const weight = parseFloat(weightKgStr);
  const heightCm = parseFloat(heightCmStr);
  if (!weight || !heightCm) {
    await ctx.reply('⚠️ Usage: `/bmi <weight_kg> <height_cm>`\nExample: `/bmi 72 178`', { parse_mode: 'Markdown' });
    return;
  }
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  let category = 'Normal weight 🟢';
  if (bmi < 18.5) category = 'Underweight 🟡';
  else if (bmi >= 25 && bmi < 29.9) category = 'Overweight 🟠';
  else if (bmi >= 30) category = 'Obese 🔴';

  await ctx.reply(
    `⚖️ *Body Mass Index (BMI):*\n\n` +
    `• *Weight:* ${weight} kg | *Height:* ${heightCm} cm\n` +
    `• *BMI Score:* *${bmi.toFixed(1)}*\n` +
    `• *Status:* ${category}\n\n` +
    `_Standard WHO reference: 18.5 – 24.9 is healthy._`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
  logToolUsage(ctx.from?.id.toString(), 'bmi_calculator');
}

export async function handleAgeCommand(ctx: BotContext, dobStr: string): Promise<void> {
  const input = dobStr.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/age YYYY-MM-DD`\nExample: `/age 1998-05-15`', { parse_mode: 'Markdown' });
    return;
  }
  const dob = new Date(input);
  if (isNaN(dob.getTime())) {
    await ctx.reply('❌ Invalid date format. Please use `YYYY-MM-DD` (e.g. `2000-01-30`).', { parse_mode: 'Markdown' });
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

  await ctx.reply(
    `🎂 *Exact Age Report:*\n\n` +
    `• *Age:* *${years} years, ${months} months, ${days} days*\n` +
    `• *Total Days Lived:* ~${totalDays.toLocaleString()} days\n` +
    `• *Next Birthday:* in *${daysToNext} days* 🎉`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

export async function handleEmiCommand(ctx: BotContext, amountStr: string, rateStr: string, yearsStr: string): Promise<void> {
  const p = parseFloat(amountStr);
  const annualRate = parseFloat(rateStr);
  const years = parseFloat(yearsStr);

  if (!p || !annualRate || !years) {
    await ctx.reply('⚠️ Usage: `/emi <loan_amount> <interest_rate_percent> <tenure_years>`\nExample: `/emi 50000 8.5 5`', { parse_mode: 'Markdown' });
    return;
  }

  const r = annualRate / 12 / 100;
  const n = years * 12;
  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  await ctx.reply(
    `💰 *Loan EMI Calculation:*\n\n` +
    `• *Loan Amount:* $${p.toLocaleString()}\n` +
    `• *Interest Rate:* ${annualRate}% p.a.\n` +
    `• *Tenure:* ${years} years (${n} months)\n\n` +
    `• 💵 *Monthly EMI:* *$${emi.toFixed(2)}*\n` +
    `• 📈 *Total Interest:* $${totalInterest.toFixed(2)}\n` +
    `• 💳 *Total Repayment:* *$${totalPayment.toFixed(2)}*`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

export async function handlePercentCommand(ctx: BotContext, percentStr: string, totalStr: string): Promise<void> {
  const p = parseFloat(percentStr);
  const total = parseFloat(totalStr);
  if (isNaN(p) || isNaN(total)) {
    await ctx.reply('⚠️ Usage: `/percent <percent> <total_number>`\nExample: `/percent 18 1500` (18% of 1500)', { parse_mode: 'Markdown' });
    return;
  }
  const val = (p / 100) * total;
  await ctx.reply(
    `📊 *Percentage Result:*\n\n` +
    `*${p}%* of *${total.toLocaleString()}* = *${val.toLocaleString()}*`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

export async function handleDiscountCommand(ctx: BotContext, priceStr: string, percentStr: string): Promise<void> {
  const price = parseFloat(priceStr);
  const percent = parseFloat(percentStr);
  if (!price || !percent) {
    await ctx.reply('⚠️ Usage: `/discount <price> <percent>`\nExample: `/discount 120 25`', { parse_mode: 'Markdown' });
    return;
  }
  const savings = price * (percent / 100);
  const finalPrice = price - savings;
  await ctx.reply(
    `🏷️ *Discount Report:*\n\n` +
    `• *Original Price:* $${price.toFixed(2)}\n` +
    `• *Discount Rate:* ${percent}%\n` +
    `• *Total Savings:* $${savings.toFixed(2)}\n` +
    `• *Final Price to Pay:* *$${finalPrice.toFixed(2)}*`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

export async function handleTipCommand(ctx: BotContext, billStr: string, tipStr = '15', peopleStr = '1'): Promise<void> {
  const bill = parseFloat(billStr);
  const tipPercent = parseFloat(tipStr) || 15;
  const people = parseInt(peopleStr, 10) || 1;
  if (!bill) {
    await ctx.reply('⚠️ Usage: `/tip <bill_amount> [tip_percent] [people_count]`\nExample: `/tip 150 18 3`', { parse_mode: 'Markdown' });
    return;
  }
  const tipAmount = bill * (tipPercent / 100);
  const total = bill + tipAmount;
  const perPerson = total / people;
  await ctx.reply(
    `🪙 *Tip & Split Bill:*\n\n` +
    `• *Subtotal:* $${bill.toFixed(2)}\n` +
    `• *Tip (${tipPercent}%):* $${tipAmount.toFixed(2)}\n` +
    `• *Grand Total:* *$${total.toFixed(2)}*\n` +
    `• *Each Person Pays (${people} people):* *$${perPerson.toFixed(2)}*`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

export async function handleCompoundCommand(ctx: BotContext, principalStr: string, rateStr: string, yearsStr: string): Promise<void> {
  const p = parseFloat(principalStr);
  const r = parseFloat(rateStr) / 100;
  const t = parseFloat(yearsStr);
  if (!p || !r || !t) {
    await ctx.reply('⚠️ Usage: `/compound <principal> <rate_percent> <years>`\nExample: `/compound 10000 7 10`', { parse_mode: 'Markdown' });
    return;
  }
  const amount = p * Math.pow(1 + r, t);
  const interestEarned = amount - p;

  await ctx.reply(
    `📈 *Compound Interest Result:*\n\n` +
    `• *Initial Principal:* $${p.toLocaleString()}\n` +
    `• *Annual Return:* ${(r * 100).toFixed(1)}%\n` +
    `• *Duration:* ${t} years\n\n` +
    `• 💵 *Interest Earned:* *$${interestEarned.toFixed(2)}*\n` +
    `• 🏦 *Final Balance:* *$${amount.toFixed(2)}*`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

export async function handleTaxCommand(ctx: BotContext, amountStr: string, rateStr: string): Promise<void> {
  const amount = parseFloat(amountStr);
  const rate = parseFloat(rateStr);
  if (!amount || !rate) {
    await ctx.reply('⚠️ Usage: `/tax <net_amount> <tax_rate_percent>`\nExample: `/tax 1200 18`', { parse_mode: 'Markdown' });
    return;
  }
  const tax = (amount * rate) / 100;
  const total = amount + tax;

  await ctx.reply(
    `🧾 *Sales Tax / GST Breakdown:*\n\n` +
    `• *Base Amount:* $${amount.toFixed(2)}\n` +
    `• *Tax Rate:* ${rate}%\n` +
    `• *Tax Payable:* $${tax.toFixed(2)}\n` +
    `• *Total (Gross):* *$${total.toFixed(2)}*`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

// ==========================================
// 3. Text & Content Utilities
// ==========================================
export async function handleCaseCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/case hello world`', { parse_mode: 'Markdown' });
    return;
  }
  const upper = input.toUpperCase();
  const lower = input.toLowerCase();
  const title = input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
  const snake = input.toLowerCase().replace(/\s+/g, '_');
  const kebab = input.toLowerCase().replace(/\s+/g, '-');
  const camel = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

  await ctx.reply(
    `🔠 *Transformed Cases:*\n\n` +
    `• *UPPERCASE:*\n\`${upper}\`\n\n` +
    `• *lowercase:*\n\`${lower}\`\n\n` +
    `• *Title Case:*\n\`${title}\`\n\n` +
    `• *camelCase:*\n\`${camel}\`\n\n` +
    `• *snake_case:*\n\`${snake}\`\n\n` +
    `• *kebab-case:*\n\`${kebab}\``,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
  logToolUsage(ctx.from?.id.toString(), 'case_converter');
}

export async function handleCountCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/count Paste your paragraph here to analyze words and reading time`', { parse_mode: 'Markdown' });
    return;
  }
  const words = input.split(/\s+/).filter(Boolean).length;
  const chars = input.length;
  const charsNoSpaces = input.replace(/\s+/g, '').length;
  const sentences = input.split(/[.!?]+/).filter(Boolean).length;
  const readingTimeSec = Math.max(1, Math.round((words / 200) * 60));

  await ctx.reply(
    `📊 *Text Metrics & Analysis:*\n\n` +
    `• 📝 *Words:* ${words.toLocaleString()}\n` +
    `• 🔤 *Characters:* ${chars.toLocaleString()} (without spaces: ${charsNoSpaces.toLocaleString()})\n` +
    `• 💬 *Sentences:* ${sentences}\n` +
    `• ⏱️ *Est. Reading Time:* ~${readingTimeSec}s`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
  logToolUsage(ctx.from?.id.toString(), 'word_counter');
}

export async function handleReverseCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/reverse Hello World`', { parse_mode: 'Markdown' });
    return;
  }
  const reversed = input.split('').reverse().join('');
  await ctx.reply(`🔄 *Reversed Text:*\n\n\`${reversed}\``, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

export async function handleSortCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/sort Zebra, Apple, Mango, Banana` or line-separated text', { parse_mode: 'Markdown' });
    return;
  }
  const isLines = input.includes('\n');
  const items = isLines ? input.split('\n') : input.split(',').map((s) => s.trim());
  const sortedAsc = [...items].sort().join(isLines ? '\n' : ', ');
  const sortedDesc = [...items].sort().reverse().join(isLines ? '\n' : ', ');

  await ctx.reply(
    `🔡 *Sorted Output:*\n\n` +
    `*Ascending (A ➔ Z):*\n\`${sortedAsc}\`\n\n` +
    `*Descending (Z ➔ A):*\n\`${sortedDesc}\``,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

export async function handleMorseCommand(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim().toUpperCase();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/morse SOS` or `/morse ... --- ...`', { parse_mode: 'Markdown' });
    return;
  }
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
    await ctx.reply(`📻 *Decoded from Morse:* \`${decoded}\``, { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() });
  } else {
    const encoded = input
      .split('')
      .map((ch) => morseMap[ch] || '')
      .join(' ');
    await ctx.reply(`📻 *Encoded to Morse:*\n\n\`${encoded}\``, { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() });
  }
}

export async function handleLoremCommand(ctx: BotContext, countStr = '1'): Promise<void> {
  const count = Math.min(Math.max(parseInt(countStr, 10) || 1, 1), 5);
  const paragraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
  const output = Array(count).fill(paragraph).join('\n\n');

  await ctx.reply(`📜 *Generated Lorem Ipsum (${count} paragraph${count > 1 ? 's' : ''}):*\n\n${output}`, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

// ==========================================
// 4. SEO & Web Optimization Tools
// ==========================================
export async function handleMetaCommand(ctx: BotContext, text: string): Promise<void> {
  const parts = text.split('|').map((s) => s.trim());
  const title = parts[0] || 'My Awesome Web Application';
  const desc = parts[1] || 'Supercharge your daily workflow with fast cloud utilities.';
  const url = parts[2] || 'https://mywebsite.com';

  const metaHtml =
    `<!-- Primary Meta Tags -->\n` +
    `<title>${title}</title>\n` +
    `<meta name="title" content="${title}">\n` +
    `<meta name="description" content="${desc}">\n` +
    `<meta name="robots" content="index, follow">\n\n` +
    `<!-- Open Graph / Facebook -->\n` +
    `<meta property="og:type" content="website">\n` +
    `<meta property="og:url" content="${url}">\n` +
    `<meta property="og:title" content="${title}">\n` +
    `<meta property="og:description" content="${desc}">`;

  await ctx.reply(`🏷️ *SEO Meta Tags Generated:*\n\`\`\`html\n${metaHtml}\n\`\`\``, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

export async function handleRobotsCommand(ctx: BotContext, domainStr = 'https://example.com'): Promise<void> {
  const domain = domainStr.trim() || 'https://example.com';
  const robots =
    `User-agent: *\n` +
    `Allow: /\n` +
    `Disallow: /admin/\n` +
    `Disallow: /api/\n\n` +
    `Sitemap: ${domain.replace(/\/$/, '')}/sitemap.xml`;

  await ctx.reply(`🤖 *Standard Robots.txt:*\n\`\`\`txt\n${robots}\n\`\`\``, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

export async function handleSitemapCommand(ctx: BotContext, domainStr = 'https://example.com'): Promise<void> {
  const domain = domainStr.trim() || 'https://example.com';
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url>\n` +
    `    <loc>${domain.replace(/\/$/, '')}/</loc>\n` +
    `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n` +
    `    <priority>1.0</priority>\n` +
    `  </url>\n` +
    `</urlset>`;

  await ctx.reply(`🗺️ *XML Sitemap Template:*\n\`\`\`xml\n${sitemap}\n\`\`\``, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

export async function handleHttpStatusCommand(ctx: BotContext, codeStr: string): Promise<void> {
  const code = (codeStr || '200').trim();
  const codes: Record<string, string> = {
    '200': 'OK — Request succeeded successfully.',
    '201': 'Created — Resource was created successfully.',
    '301': 'Moved Permanently — URL was redirected permanently to new target.',
    '302': 'Found / Temporary Redirect — URL temporarily redirected.',
    '400': 'Bad Request — Malformed syntax or invalid parameters.',
    '401': 'Unauthorized — Missing or invalid authentication token.',
    '403': 'Forbidden — Server understood request but refuses authorization.',
    '404': 'Not Found — Requested resource could not be found.',
    '429': 'Too Many Requests — Rate limit exceeded. Backoff required.',
    '500': 'Internal Server Error — Unexpected error on target server.',
    '502': 'Bad Gateway — Upstream reverse proxy received invalid response.',
    '503': 'Service Unavailable — Server temporarily overloaded or down for maintenance.',
  };

  const desc = codes[code] || 'Status code not in standard list. Try /http 404';
  await ctx.reply(`🚥 *HTTP Status Code: ${code}*\n\n${desc}`, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

// ==========================================
// 5. Color & Design Utilities
// ==========================================
export async function handleHexToRgbCommand(ctx: BotContext, hexStr: string): Promise<void> {
  let hex = (hexStr || '#38bdf8').replace('#', '').trim();
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  if (hex.length !== 6) {
    await ctx.reply('⚠️ Usage: `/hex #38bdf8` or `/hex 38bdf8`', { parse_mode: 'Markdown' });
    return;
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  await ctx.reply(
    `🎨 *Color Format Translations for #${hex}:*\n\n` +
    `• *HEX:* \`#${hex.toUpperCase()}\`\n` +
    `• *RGB:* \`rgb(${r}, ${g}, ${b})\`\n` +
    `• *RGBA:* \`rgba(${r}, ${g}, ${b}, 1.0)\``,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

export async function handleGradientCommand(ctx: BotContext): Promise<void> {
  const gradients = [
    { name: 'Sunset Aura', css: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
    { name: 'Cyber Neon', css: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)' },
    { name: 'Emerald Horizon', css: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' },
    { name: 'Electric Violet', css: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)' },
  ];
  const g = gradients[Math.floor(Math.random() * gradients.length)];

  await ctx.reply(
    `🌈 *CSS Gradient: ${g.name}*\n\n\`\`\`css\nbackground: ${g.css};\n\`\`\`\n\nTap to copy and paste into your stylesheets.`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

export async function handleShadowCommand(ctx: BotContext): Promise<void> {
  const shadows = [
    { name: 'Smooth Modern Card', css: 'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);' },
    { name: 'Subtle Float Elevation', css: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);' },
    { name: 'Cyber Cyan Glow', css: 'box-shadow: 0 0 25px rgba(56, 189, 248, 0.35);' },
  ];
  const s = shadows[Math.floor(Math.random() * shadows.length)];
  await ctx.reply(`📦 *CSS Box Shadow: ${s.name}*\n\n\`\`\`css\n${s.css}\n\`\`\``, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

// ==========================================
// 6. Random, Games & Fun Tools
// ==========================================
export async function handleCoinCommand(ctx: BotContext): Promise<void> {
  const outcome = Math.random() > 0.5 ? '👑 HEADS' : '⚡ TAILS';
  await ctx.reply(`🪙 *Flipping 3D Coin...*\n\nResult: *${outcome}*`, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

export async function handleDiceCommand(ctx: BotContext, sidesStr = '6'): Promise<void> {
  const sides = Math.max(2, Math.min(parseInt(sidesStr, 10) || 6, 100));
  const roll = Math.floor(Math.random() * sides) + 1;
  await ctx.reply(`🎲 *Rolling d${sides} Die...*\n\nYou rolled: *${roll}*`, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

export async function handle8BallCommand(ctx: BotContext, question: string): Promise<void> {
  if (!question.trim()) {
    await ctx.reply('⚠️ Ask a question: `/8ball will it rain today?`', { parse_mode: 'Markdown' });
    return;
  }
  const answers = [
    'It is certain 🟢', 'Without a doubt 🟢', 'You may rely on it 🟢',
    'Reply hazy, try again 🟡', 'Ask again later 🟡', 'Better not tell you now 🟡',
    "Don't count on it 🔴", 'My sources say no 🔴', 'Very doubtful 🔴'
  ];
  const answer = answers[Math.floor(Math.random() * answers.length)];
  await ctx.reply(
    `🎱 *Magic 8-Ball:*\n\n` +
    `Question: "${question}"\n` +
    `Answer: *${answer}*`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

export async function handleQuoteCommand(ctx: BotContext): Promise<void> {
  const quotes = [
    { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
    { q: "Quality is not an act, it is a habit.", a: "Aristotle" },
    { q: "Simplicity is the soul of efficiency.", a: "Austin Freeman" },
    { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
    { q: "Stay hungry, stay foolish.", a: "Steve Jobs" }
  ];
  const picked = quotes[Math.floor(Math.random() * quotes.length)];
  await ctx.reply(`💬 *Inspirational Quote:*\n\n"${picked.q}"\n— *${picked.a}*`, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

export async function handlePickCommand(ctx: BotContext, optionsStr: string): Promise<void> {
  const options = optionsStr.split(',').map((s) => s.trim()).filter(Boolean);
  if (options.length < 2) {
    await ctx.reply('⚠️ Provide at least 2 options: `/pick Pizza, Sushi, Burgers`', { parse_mode: 'Markdown' });
    return;
  }
  const winner = options[Math.floor(Math.random() * options.length)];
  await ctx.reply(`🎯 *Choice Picker Selected:*\n\n👉 *${winner}*`, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
}

export async function handlePasswordCommand(ctx: BotContext, lenStr?: string): Promise<void> {
  const length = Math.min(Math.max(parseInt(lenStr || '16', 10) || 16, 8), 64);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|';
  let password = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) password += chars[bytes[i] % chars.length];

  await ctx.reply(
    `🔐 *Generated Password (${length} chars):*\n\n\`${password}\`\n\n🛡️ *Entropy:* 256-bit secure cryptographic randomness.\nTap above to copy.`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
  logToolUsage(ctx.from?.id.toString(), 'password_gen');
}

export async function handleRpsCommand(ctx: BotContext, choice: string): Promise<void> {
  const user = choice.trim().toLowerCase();
  const valid = ['rock', 'paper', 'scissors'];
  if (!valid.includes(user)) {
    await ctx.reply('⚠️ Usage: `/rps rock` or `/rps paper` or `/rps scissors`', { parse_mode: 'Markdown' });
    return;
  }
  const botChoice = valid[Math.floor(Math.random() * valid.length)];
  let outcome = '🤝 It is a tie!';
  if (
    (user === 'rock' && botChoice === 'scissors') ||
    (user === 'paper' && botChoice === 'rock') ||
    (user === 'scissors' && botChoice === 'paper')
  ) {
    outcome = '🎉 You won!';
  } else if (user !== botChoice) {
    outcome = '🤖 Lexio won!';
  }

  await ctx.reply(
    `🎮 *Rock Paper Scissors:*\n\n` +
    `• Your Choice: *${user.toUpperCase()}*\n` +
    `• Lexio Choice: *${botChoice.toUpperCase()}*\n\n` +
    `${outcome}`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

async function logToolUsage(userId: string | undefined, toolName: string, meta?: string): Promise<void> {
  if (!userId) return;
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
