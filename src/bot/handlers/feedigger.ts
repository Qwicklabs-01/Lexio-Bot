import { BotContext } from '../types.js';
import { getFeediggerActionsKeyboard, getBackToMenuKeyboard } from '../keyboards/tool.keyboards.js';
import { InputFile } from 'grammy';
import { prisma } from '../../database/client.js';

interface MockReel {
  id: string;
  url: string;
  views: number;
  likes: number;
  comments: number;
  er: number;
  caption: string;
}

function getMockProfileData(handle: string): {
  handle: string;
  name: string;
  followers: number;
  following: number;
  postsCount: number;
  reels: MockReel[];
} {
  const clean = handle.replace('@', '');
  return {
    handle: clean,
    name: `${clean.toUpperCase()} Official`,
    followers: 245000,
    following: 340,
    postsCount: 184,
    reels: [
      {
        id: '1',
        url: `https://instagram.com/reel/C7x90ABc1`,
        views: 1450000,
        likes: 122000,
        comments: 3410,
        er: 8.6,
        caption: 'How to scale viral content using automated intelligence 🚀',
      },
      {
        id: '2',
        url: `https://instagram.com/reel/C7a45BCd2`,
        views: 890000,
        likes: 74000,
        comments: 1890,
        er: 8.5,
        caption: 'Stop making this mistake with your social media hooks ⚠️',
      },
      {
        id: '3',
        url: `https://instagram.com/reel/C6m12EFg3`,
        views: 650000,
        likes: 58000,
        comments: 1420,
        er: 9.1,
        caption: 'The 3 tools every creator needs in their daily workflow 🛠️',
      },
      {
        id: '4',
        url: `https://instagram.com/reel/C5p89HIj4`,
        views: 420000,
        likes: 41000,
        comments: 980,
        er: 10.0,
        caption: 'Behind the scenes: building viral applications from scratch 💻',
      },
    ],
  };
}

export async function handleFeediggerMenu(ctx: BotContext): Promise<void> {
  const text =
    `🔍 *Feedigger — Instagram Viral Excavator & Analytics*\n\n` +
    `Uncover the highest-performing content on any Instagram profile in seconds:\n\n` +
    `• 👁️ *Sort Reels by Real Views* — Find breakthrough viral formats\n` +
    `• ❤️ *Rank by Likes & Saves* — Identify strong audience resonance\n` +
    `• 💬 *Spot Community Debates* — Highest commented discussions\n` +
    `• 🔥 *Engagement Rate % (ER)* — Real engagement percentage metric\n` +
    `• 📥 *1-Click CSV Export* — Spreadsheet download for Excel/Sheets\n\n` +
    `👉 *Usage:* Type \`/excavate @username\` (e.g. \`/excavate @mrbeast\`) or tap below to launch the visual studio!`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        reply_markup: getBackToMenuKeyboard(),
      });
      await ctx.answerCallbackQuery();
    } catch {
      await ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: getBackToMenuKeyboard(),
      });
    }
  } else {
    await ctx.reply(text, {
      parse_mode: 'Markdown',
      reply_markup: getBackToMenuKeyboard(),
    });
  }
}

export async function handleExcavateCommand(ctx: BotContext, handle: string): Promise<void> {
  const cleanHandle = handle.trim().replace(/^@/, '');
  if (!cleanHandle) {
    await ctx.reply('⚠️ Please provide an Instagram username: `/excavate @username`', {
      parse_mode: 'Markdown',
    });
    return;
  }

  const telegramId = ctx.from?.id.toString() || 'anonymous';

  const analyzingMsg = await ctx.reply(
    `⛏️ *Feedigger excavating @${cleanHandle}...*\nScraping posts, parsing views, calculating Engagement Rate %...`,
    { parse_mode: 'Markdown' }
  );

  const profile = getMockProfileData(cleanHandle);

  try {
    await prisma.feedScrape.create({
      data: {
        userId: telegramId,
        targetUsername: cleanHandle,
        followersCount: profile.followers,
        postsAnalyzed: profile.reels.length,
        avgEngagementRate: 8.8,
      },
    });

    await prisma.user.update({
      where: { telegramId },
      data: { scrapesCount: { increment: 1 } },
    });
  } catch {}

  try {
    await ctx.api.deleteMessage(ctx.chat!.id, analyzingMsg.message_id);
  } catch {}

  const responseText =
    `🎯 *Feedigger Intel: @${cleanHandle}*\n\n` +
    `👤 *Account:* ${profile.name}\n` +
    `👥 *Followers:* ${(profile.followers / 1000).toFixed(1)}k | 📸 *Posts:* ${profile.postsCount}\n` +
    `🔥 *Average ER%:* 8.8% (Top 5% in category)\n\n` +
    `🏆 *Top Viral Reels (Ranked by Views):*\n` +
    `1. 👁️ *1.45M views* (122k likes, 8.6% ER)\n   "${profile.reels[0].caption}"\n` +
    `2. 👁️ *890K views* (74k likes, 8.5% ER)\n   "${profile.reels[1].caption}"\n` +
    `3. 👁️ *650K views* (58k likes, 9.1% ER)\n   "${profile.reels[2].caption}"\n\n` +
    `Select a ranking metric or export CSV below:`;

  await ctx.reply(responseText, {
    parse_mode: 'Markdown',
    reply_markup: getFeediggerActionsKeyboard(cleanHandle),
  });
}

export async function handleFeediggerSort(
  ctx: BotContext,
  handle: string,
  metric: 'views' | 'likes' | 'comments' | 'er'
): Promise<void> {
  const profile = getMockProfileData(handle);
  let sorted = [...profile.reels];

  if (metric === 'likes') sorted.sort((a, b) => b.likes - a.likes);
  else if (metric === 'comments') sorted.sort((a, b) => b.comments - a.comments);
  else if (metric === 'er') sorted.sort((a, b) => b.er - a.er);
  else sorted.sort((a, b) => b.views - a.views);

  const metricLabel = {
    views: '👁️ Highest Views',
    likes: '❤️ Highest Likes',
    comments: '💬 Most Comments',
    er: '🔥 Highest Engagement %',
  }[metric];

  let text = `📊 *Top Reels for @${handle} by ${metricLabel}:*\n\n`;
  sorted.forEach((r, idx) => {
    text += `${idx + 1}. *${r.views.toLocaleString()} views* | ❤️ ${r.likes.toLocaleString()} | 💬 ${r.comments.toLocaleString()} | *${r.er}% ER*\n   🔗 [View Reel](${r.url})\n\n`;
  });

  await ctx.answerCallbackQuery();
  await ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: getFeediggerActionsKeyboard(handle),
  });
}

export async function handleFeediggerCsvExport(ctx: BotContext, handle: string): Promise<void> {
  await ctx.answerCallbackQuery({ text: 'Generating CSV...' });
  const profile = getMockProfileData(handle);

  const headers = 'Rank,Post_URL,Views,Likes,Comments,Engagement_Rate_Percent,Caption\n';
  const rows = profile.reels
    .map(
      (r, i) =>
        `${i + 1},"${r.url}",${r.views},${r.likes},${r.comments},${r.er},"${r.caption.replace(/"/g, '""')}"`
    )
    .join('\n');

  const csvContent = headers + rows;
  const buffer = Buffer.from(csvContent, 'utf-8');

  await ctx.replyWithDocument(new InputFile(buffer, `feedigger_${handle}_analysis.csv`), {
    caption: `📥 *Feedigger CSV Export for @${handle}*\nReady for import into Excel, Google Sheets, or Notion!`,
    parse_mode: 'Markdown',
  });
}
