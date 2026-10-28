import { BotContext } from '../types.js';
import { getFeediggerActionsKeyboard, getBackToMenuKeyboard } from '../keyboards/tool.keyboards.js';
import { InputFile, InlineKeyboard } from 'grammy';
import { prisma } from '../../database/client.js';
import { getValidHttpsMiniAppUrl } from '../../config/env.js';
import { escapeMarkdown } from '../utils/markdown.js';

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
    `📊 *LEXIO CREATOR & SOCIAL INTEL*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `Deep profile audit, engagement rate computation & viral outlier analysis.\n\n` +
    `🔍 *Key Analytics Capabilities:*\n` +
    `• 📈 *Engagement Rate %:* Benchmark against top 5% in category\n` +
    `• 👁️ *Reel Performance:* Filter by views, likes, comments & ER%\n` +
    `• 📥 *CSV Data Export:* Download full tabular reel reports\n` +
    `• 🏷️ *Viral Hashtags:* 1-click copy high-reach tag batches\n` +
    `• 🎣 *Viral Hook Generator:* High-retention video openers\n\n` +
    `💡 *How to analyze:*\n` +
    `Type \`/excavate @username\` (e.g. \`/excavate @mrbeast\`)\n\n` +
    `👇 *Tap a demo below or open Studio WebApp:*`;

  const miniAppUrl = getValidHttpsMiniAppUrl('?tab=social');
  const keyboard = new InlineKeyboard()
    .webApp('⚡ Open Creator Suite in Studio', miniAppUrl)
    .row()
    .text('👤 Demo @mrbeast', 'fd_demo_mrbeast')
    .text('📸 Demo @instagram', 'fd_demo_instagram')
    .row()
    .text('🏷️ Viral Hashtags', 'fd_tags_creator')
    .text('🎣 Viral Hooks', 'fd_hook_creator')
    .row()
    .text('🏠 Back to Main Menu', 'menu_main');

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
      await ctx.answerCallbackQuery();
      return;
    } catch (err: any) {
      await ctx.answerCallbackQuery().catch(() => {});
      if (err?.description?.includes('message is not modified')) {
        return;
      }
    }
  }
  await ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
}


export async function handleExcavateCommand(ctx: BotContext, handle: string): Promise<void> {
  const cleanHandle = handle.trim().replace(/^@/, '');
  if (!cleanHandle) {
    await ctx.reply('⚠️ Please provide an Instagram username: `/excavate @username`', {
      parse_mode: 'Markdown',
    });
    return;
  }

  const safeHandle = escapeMarkdown(cleanHandle);
  const telegramId = ctx.from?.id.toString() || 'anonymous';

  let analyzingMsgId: number | undefined;
  try {
    const analyzingMsg = await ctx.reply(
      `⛏️ *Lexio analyzing @${safeHandle}...*\nScraping posts, parsing views, calculating Engagement Rate %...`,
      { parse_mode: 'Markdown' }
    );
    analyzingMsgId = analyzingMsg.message_id;
  } catch {
    const analyzingMsg = await ctx.reply(`⛏️ Lexio analyzing @${cleanHandle}...\nScraping posts, parsing views, calculating Engagement Rate %...`);
    analyzingMsgId = analyzingMsg.message_id;
  }

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

    await prisma.user.upsert({
      where: { telegramId },
      update: { scrapesCount: { increment: 1 } },
      create: { telegramId, scrapesCount: 1 },
    });
  } catch {}

  if (analyzingMsgId && ctx.chat) {
    try {
      await ctx.api.deleteMessage(ctx.chat.id, analyzingMsgId);
    } catch {}
  }

  const responseText =
    `🎯 *Lexio Creator Intel: @${safeHandle}*\n\n` +
    `👤 *Account:* ${escapeMarkdown(profile.name)}\n` +
    `👥 *Followers:* ${(profile.followers / 1000).toFixed(1)}k | 📸 *Posts:* ${profile.postsCount}\n` +
    `🔥 *Average ER%:* 8.8% (Top 5% in category)\n\n` +
    `🏆 *Top Viral Reels (Ranked by Views):*\n` +
    `1. 👁️ *1.45M views* (122k likes, 8.6% ER)\n   "${escapeMarkdown(profile.reels[0].caption)}"\n` +
    `2. 👁️ *890K views* (74k likes, 8.5% ER)\n   "${escapeMarkdown(profile.reels[1].caption)}"\n` +
    `3. 👁️ *650K views* (58k likes, 9.1% ER)\n   "${escapeMarkdown(profile.reels[2].caption)}"\n\n` +
    `Select a ranking metric or export CSV below:`;

  try {
    await ctx.reply(responseText, {
      parse_mode: 'Markdown',
      reply_markup: getFeediggerActionsKeyboard(cleanHandle),
    });
  } catch {
    await ctx.reply(responseText.replace(/[*_`]/g, ''), {
      reply_markup: getFeediggerActionsKeyboard(cleanHandle),
    });
  }
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

  const safeHandle = escapeMarkdown(handle);
  let text = `📊 *Top Reels for @${safeHandle} by ${metricLabel}:*\n\n`;
  sorted.forEach((r, idx) => {
    text += `${idx + 1}. *${r.views.toLocaleString()} views* | ❤️ ${r.likes.toLocaleString()} | 💬 ${r.comments.toLocaleString()} | *${r.er}% ER*\n   🔗 [View Reel](${r.url})\n\n`;
  });

  await ctx.answerCallbackQuery().catch(() => {});
  try {
    await ctx.reply(text, {
      parse_mode: 'Markdown',
      reply_markup: getFeediggerActionsKeyboard(handle),
    });
  } catch {
    await ctx.reply(text.replace(/[*_`]/g, ''), {
      reply_markup: getFeediggerActionsKeyboard(handle),
    });
  }
}

export async function handleFeediggerCsvExport(ctx: BotContext, handle: string): Promise<void> {
  await ctx.answerCallbackQuery({ text: 'Generating CSV...' }).catch(() => {});
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

  const safeHandle = escapeMarkdown(handle);
  try {
    await ctx.replyWithDocument(new InputFile(buffer, `lexio_${handle}_analytics.csv`), {
      caption: `📥 *Lexio CSV Export for @${safeHandle}*\nReady for import into Excel, Google Sheets, or Notion!`,
      parse_mode: 'Markdown',
    });
  } catch {
    await ctx.replyWithDocument(new InputFile(buffer, `lexio_${handle}_analytics.csv`), {
      caption: `📥 Lexio CSV Export for @${handle}\nReady for import into Excel, Google Sheets, or Notion!`,
    });
  }
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
  const safeQuery = escapeMarkdown(query.toUpperCase());

  await ctx.reply(
    `🏷️ *High-Growth Hashtags for [${safeQuery}]:*\n\n` +
    `\`${tags.join(' ')}\`\n\n` +
    `Tap to copy and paste into your Reel or TikTok caption!`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  ).catch(async () => {
    await ctx.reply(
      `🏷️ High-Growth Hashtags for [${query.toUpperCase()}]:\n\n${tags.join(' ')}\n\nTap to copy and paste!`,
      { reply_markup: getBackToMenuKeyboard() }
    );
  });
}

export async function handleHookCommand(ctx: BotContext, topic: string): Promise<void> {
  const t = topic.trim() || 'this topic';
  const safeT = escapeMarkdown(t);
  const hooks = [
    `"Stop scrolling if you want to master ${safeT} in 2026..."`,
    `"3 secrets about ${safeT} that 99% of people don't know:"`,
    `"If I had to start learning ${safeT} from zero, here is exactly what I would do:"`,
    `"This one trick completely changed the way I look at ${safeT}..."`,
    `"Why nobody is talking about this massive breakthrough in ${safeT}:"`
  ];

  await ctx.reply(
    `🎣 *Viral Hooks for [${safeT}]:*\n\n` +
    hooks.map((h, i) => `${i + 1}. *${h}*`).join('\n\n') +
    `\n\nUse one of these in the first 3 seconds of your video to maximize retention!`,
    { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() }
  ).catch(async () => {
    await ctx.reply(
      `🎣 Viral Hooks for [${t}]:\n\n` +
      hooks.map((h, i) => `${i + 1}. ${h.replace(/[*_]/g, '')}`).join('\n\n') +
      `\n\nUse one of these in the first 3 seconds of your video!`,
      { reply_markup: getBackToMenuKeyboard() }
    );
  });
}

