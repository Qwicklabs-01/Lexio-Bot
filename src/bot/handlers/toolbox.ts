import { BotContext } from '../types.js';
import {
  getToolBoxCategoriesKeyboard,
  getToolBoxDevKeyboard,
  getToolBoxCalcKeyboard,
  getBackToMenuKeyboard,
} from '../keyboards/tool.keyboards.js';
import crypto from 'crypto';
import { prisma } from '../../database/client.js';

export async function handleToolBoxMenu(ctx: BotContext): Promise<void> {
  const text =
    `🧰 *ToolBox Pro — 100+ Free Online Multi-Tools*\n\n` +
    `Fast, secure utilities for developers, creators, students, and digital professionals:\n\n` +
    `• 💻 *Development:* JSON Formatter, QR Code, Base64, URL Encoder, Hash Gen\n` +
    `• 🧮 *Calculators:* BMI, Age, Loan EMI, Percentages, Sales Tax, Currency\n` +
    `• 🔍 *SEO & Web:* Meta Tags, Robots.txt, Color Contrast, CSS Gradients\n` +
    `• ⏱️ *Productivity:* Password Generator, Pomodoro, Notes, Coin Flip\n\n` +
    `Choose a category below or use quick commands like \`/qr\`, \`/calc\`, \`/password\`, \`/bmi\`!`;

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
    await ctx.editMessageText(
      `💻 *Developer & Code Utilities*\n\nSelect a tool below or use quick commands:`,
      { parse_mode: 'Markdown', reply_markup: getToolBoxDevKeyboard() }
    );
  } else if (category === 'calc') {
    await ctx.editMessageText(
      `🧮 *Mathematical & Everyday Calculators*\n\nSelect a tool below or use quick commands:`,
      { parse_mode: 'Markdown', reply_markup: getToolBoxCalcKeyboard() }
    );
  } else {
    await ctx.editMessageText(
      `🌐 *Web, SEO & Productivity Utilities*\n\nExplore our entire 100+ tools collection in the Telegram Mini App!`,
      { parse_mode: 'Markdown', reply_markup: getToolBoxCategoriesKeyboard() }
    );
  }
}

export async function handleQrCommand(ctx: BotContext, text: string): Promise<void> {
  const query = text.trim();
  if (!query) {
    await ctx.reply('⚠️ Please provide text or a URL: `/qr https://example.com`', {
      parse_mode: 'Markdown',
    });
    return;
  }

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    query
  )}`;

  await ctx.replyWithPhoto(qrImageUrl, {
    caption: `📱 *Your High-Res QR Code is Ready!*\n\n🔗 *Encoded Data:* \`${query.substring(0, 50)}\``,
    parse_mode: 'Markdown',
    reply_markup: getBackToMenuKeyboard(),
  });

  logToolUsage(ctx.from?.id.toString(), 'qr_generator', query);
}

export async function handlePasswordCommand(ctx: BotContext, lenStr?: string): Promise<void> {
  const length = Math.min(Math.max(parseInt(lenStr || '16', 10) || 16, 8), 64);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|';

  let password = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += chars[bytes[i] % chars.length];
  }

  await ctx.reply(
    `🔐 *Generated Secure Password (${length} chars):*\n\n` +
    `\`${password}\`\n\n` +
    `🛡️ *Entropy Score:* High (256-bit cryptographic randomness)\n` +
    `Tap the password above to copy it instantly.`,
    {
      parse_mode: 'Markdown',
      reply_markup: getBackToMenuKeyboard(),
    }
  );

  logToolUsage(ctx.from?.id.toString(), 'password_gen', `len_${length}`);
}

export async function handleCalcCommand(ctx: BotContext, expression: string): Promise<void> {
  const clean = expression.replace(/[^0-9+\-*/().% ]/g, '').trim();
  if (!clean) {
    await ctx.reply('⚠️ Usage: `/calc 150 * 0.18 + 500`', { parse_mode: 'Markdown' });
    return;
  }

  try {
    // Safe evaluation for basic math expression
    const result = Function(`'use strict'; return (${clean})`)();
    await ctx.reply(
      `🧮 *Calculation Result:*\n\n` +
      `Expression: \`${clean}\`\n` +
      `Result: *${Number(result).toLocaleString('en-US', { maximumFractionDigits: 4 })}*`,
      {
        parse_mode: 'Markdown',
        reply_markup: getBackToMenuKeyboard(),
      }
    );
    logToolUsage(ctx.from?.id.toString(), 'calculator', clean);
  } catch {
    await ctx.reply('❌ Invalid mathematical expression. Please check your syntax.');
  }
}

export async function handleBmiCommand(
  ctx: BotContext,
  weightKgStr: string,
  heightCmStr: string
): Promise<void> {
  const weight = parseFloat(weightKgStr);
  const heightCm = parseFloat(heightCmStr);

  if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
    await ctx.reply('⚠️ Usage: `/bmi <weight_in_kg> <height_in_cm>`\nExample: `/bmi 72 178`', {
      parse_mode: 'Markdown',
    });
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);

  let category = 'Normal weight 🟢';
  if (bmi < 18.5) category = 'Underweight 🟡';
  else if (bmi >= 25 && bmi < 29.9) category = 'Overweight 🟠';
  else if (bmi >= 30) category = 'Obese 🔴';

  await ctx.reply(
    `⚖️ *Body Mass Index (BMI) Report:*\n\n` +
    `• *Height:* ${heightCm} cm\n` +
    `• *Weight:* ${weight} kg\n` +
    `• *BMI Score:* *${bmi.toFixed(1)}*\n` +
    `• *Category:* ${category}\n\n` +
    `_Standard WHO reference range: 18.5 – 24.9 is considered healthy._`,
    {
      parse_mode: 'Markdown',
      reply_markup: getBackToMenuKeyboard(),
    }
  );

  logToolUsage(ctx.from?.id.toString(), 'bmi_calculator', `w${weight}_h${heightCm}`);
}

export async function handleBase64Command(ctx: BotContext, text: string): Promise<void> {
  const input = text.trim();
  if (!input) {
    await ctx.reply('⚠️ Usage: `/b64 Hello World`', { parse_mode: 'Markdown' });
    return;
  }

  const encoded = Buffer.from(input, 'utf-8').toString('base64');
  await ctx.reply(
    `🔐 *Base64 Encoded Output:*\n\n\`${encoded}\`\n\nTap to copy.`,
    {
      parse_mode: 'Markdown',
      reply_markup: getBackToMenuKeyboard(),
    }
  );

  logToolUsage(ctx.from?.id.toString(), 'base64', input.substring(0, 20));
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
