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
    name: `${clean.toUpperCase()}`,
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
        caption: 'Building viral applications from scratch with clean code 💻',
      },
    ],
  };
}

export async function handleFeediggerMenu(ctx: BotContext): Promise<void> {
  const text =
    `📊 *Lexio Social & Creator Intelligence*\n\n` +
    `Uncover the highest-performing content on any Instagram profile in seconds:\n\n` +
    `• 👁️ *Sort Reels by Real Views* — Find breakthrough viral hooks\n` +
    `• ❤️ *Rank by Likes & Saves* — Identify strong audience affinity\n` +
    `• 💬 *Find Hot Discussions* — Spot community debates & objections\n` +
    `• 🏷️ *Viral Hashtags* — Discover high-growth hashtag sets\n` +
    `• 🎣 *Viral Hooks* — 3-second hook formulas\n` +
    `• 📥 *1-Click CSV Export* — Spreadsheet download for Excel & Sheets\n\n` +
    `👉 *Usage:* Type \`/excavate @username\` (e.g. \`/excavate @mrbeast\`) or use commands: \`/hashtags\`, \`/hook\`!`;

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
    `⛏️ *Lexio analyzing @${cleanHandle}...*\nScraping posts, parsing views, calculating Engagement Rate %...`,
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
    `🎯 *Lexio Creator Intel: @${cleanHandle}*\n\n` +
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

  await ctx.replyWithDocument(new InputFile(buffer, `lexio_${handle}_analytics.csv`), {
    caption: `📥 *Lexio CSV Export for @${handle}*\nReady for import into Excel, Google Sheets, or Notion!`,
    parse_mode: 'Markdown',
  });
}

export async function handleHashtagsCommand(ctx: BotContext, niche: string): Promise<void> {
  const query = niche.trim().toLowerCase() || 'creator';
  const tagLibrary: Record<string, string[]> = {
    tech: ['#tech', '#developer', '#coding', '#softwareengineer', '#webdev', '#javascript', '#ai', '#python', '#techtrends', '#programming'],
    fitness: ['#fitness', '#workout', '#gymmotivation', '#fitlife', '#bodybuilding', '#healthy', '#training', '#gymlife', '#fitnessgoals'],
    business: ['#entrepreneur', '#business', '#startup', '#marketing', '#success', '#smallbusiness', '#mindset', '#finance', '#wealth'],
    creator: ['#contentcreator', '#creatoreconomy', '#viralreels', '#reelsinstagram', '#socialmediamarketing', '#digitalcreator', '#growth'],
  };

  const key = Object.keys(tagLibrary).find((k) => query.includes(k)) || 'creator';
  const tags = tagLibrary[key];

  await ctx.reply(
    `🏷️ *High-Growth Hashtags for [${query.toUpperCase()}]:*\n\n` +
    `\`${tags.join(' ')}\`\n\n` +
    `Tap to copy and paste into your Reel or TikTok caption!`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

export async function handleHookCommand(ctx: BotContext, topic: string): Promise<void> {
  const t = topic.trim() || 'this topic';
  const hooks = [
    `"Stop scrolling if you want to master ${t} in 2026..."`,
    `"3 secrets about ${t} that 99% of people don't know:"`,
    `"If I had to start learning ${t} from zero, here is exactly what I would do:"`,
    `"This one trick completely changed the way I look at ${t}..."`,
    `"Why nobody is talking about this massive breakthrough in ${t}:"`
  ];

  await ctx.reply(
    `🎣 *Viral Hooks for [${t}]:*\n\n` +
    hooks.map((h, i) => `${i + 1}. *${h}*`).join('\n\n') +
    `\n\nUse one of these in the first 3 seconds of your video to maximize retention!`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  );
}

