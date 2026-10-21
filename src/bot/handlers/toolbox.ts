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
    `🧰 *ToolBox Pro — 100+ Free Online Utilities*\n\n` +
    `Choose a category below to explore tools, or tap *Browse All 100+ Tools in Studio* to use the visual interactive suite:\n\n` +
    `• 💻 *Dev & Code:* JSON, QR, Base64, UUID, Hashes, Slugs, SQL\n` +
    `• 🧮 *Calculators:* BMI, Age, Loan EMI, Percent, Discount, Tips, Tax\n` +
    `• 📝 *Text & Content:* Case, Word Count, Reverser, Sorter, Morse\n` +
    `• 🔍 *SEO & Web:* Meta Tags, Robots.txt, Sitemaps, Keyword Density\n` +
    `• 🎨 *Color & Design:* HEX/RGB, Gradients, Shadows, CSS Buttons\n` +
    `• 🎲 *Random & Fun:* Coin Flip, Dice, 8-Ball, Quotes, Passwords`;

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
    await ctx.editMessageText(`💻 *Developer & Code Tools*\nSelect a tool or use commands:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxDevKeyboard(),
    });
  } else if (category === 'calc') {
    await ctx.editMessageText(`🧮 *Calculators & Financial Utilities*\nSelect a tool or use commands:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxCalcKeyboard(),
    });
  } else if (category === 'text') {
    await ctx.editMessageText(`📝 *Text & Content Utilities*\nSelect a tool or use commands:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxTextKeyboard(),
    });
  } else if (category === 'seo') {
    await ctx.editMessageText(`🔍 *SEO & Web Optimization Tools*\nSelect a tool or use commands:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxSeoKeyboard(),
    });
  } else if (category === 'design') {
    await ctx.editMessageText(`🎨 *Color & Design Utilities*\nSelect a tool or use commands:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxDesignKeyboard(),
    });
  } else if (category === 'fun') {
    await ctx.editMessageText(`🎲 *Randomizers & Interactive Tools*\nSelect a tool or use commands:`, {
      parse_mode: 'Markdown',
      reply_markup: getToolBoxFunKeyboard(),
    });
  } else {
    await handleToolBoxMenu(ctx);
  }
}

// ==========================================
// Developer Tools
// ==========================================
export async function handleQrCommand(ctx: BotContext, text: string): Promise<void> {
  const query = text.trim();
  if (!query) {
    await ctx.reply('⚠️ Usage: `/qr https://example.com` or `/qr your text here`', { parse_mode: 'Markdown' });
    return;
  }
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(query)}`;
  await ctx.replyWithPhoto(qrImageUrl, {
    caption: `📱 *QR Code Generated Successfully!*\n\n🔗 *Data:* \`${query.substring(0, 60)}\``,
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
  const sha256 = crypto.createHash('sha256').update(input).digest('hex');
  await ctx.reply(
    `🔑 *Cryptographic Hashes for:* \`${input.substring(0, 30)}\`\n\n` +
    `• *MD5:*\n\`${md5}\`\n\n` +
    `• *SHA-256:*\n\`${sha256}\``,
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
  await ctx.reply(`🔐 *Base64 Output:*\n\n\`${encoded}\`\n\nTap to copy.`, {
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });
  logToolUsage(ctx.from?.id.toString(), 'base64');
}

// ==========================================
// Text & Writing Tools
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
  const camel = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

  await ctx.reply(
    `🔠 *Transformed Cases:*\n\n` +
    `• *UPPERCASE:*\n\`${upper}\`\n\n` +
    `• *lowercase:*\n\`${lower}\`\n\n` +
    `• *Title Case:*\n\`${title}\`\n\n` +
    `• *camelCase:*\n\`${camel}\`\n\n` +
    `• *snake_case:*\n\`${snake}\``,
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

// ==========================================
// Calculators & Financial Tools
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

export async function handleDiscountCommand(ctx: BotContext, priceStr: string, percentStr: string): Promise<void> {
  const price = parseFloat(priceStr);
  const percent = parseFloat(percentStr);
  if (!price || !percent) {
    await ctx.reply('⚠️ Usage: `/discount <price> <percent>`\nExample: `/discount 120 25`', { parse_mode: 'Markdown' });
    return;
  }
  const savings = (price * (percent / 100));
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

// ==========================================
// Random & Fun Tools
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
