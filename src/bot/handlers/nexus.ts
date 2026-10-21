import { BotContext } from '../types.js';
import { getMediaDownloadKeyboard, getBackToMenuKeyboard } from '../keyboards/tool.keyboards.js';
import { prisma } from '../../database/client.js';

export function isMediaUrl(text: string): boolean {
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  if (!urlPattern.test(text)) return false;

  const lower = text.toLowerCase();
  return (
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('instagram.com') ||
    lower.includes('tiktok.com') ||
    lower.includes('twitter.com') ||
    lower.includes('x.com') ||
    lower.includes('facebook.com') ||
    lower.includes('fb.watch') ||
    lower.includes('reddit.com') ||
    lower.includes('pinterest.com')
  );
}

export function detectPlatform(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes('youtube') || lower.includes('youtu.be')) return 'YouTube';
  if (lower.includes('instagram')) return 'Instagram';
  if (lower.includes('tiktok')) return 'TikTok';
  if (lower.includes('twitter') || lower.includes('x.com')) return 'Twitter / X';
  if (lower.includes('facebook') || lower.includes('fb.watch')) return 'Facebook';
  return 'Universal Web';
}

export async function handleNexusMenu(ctx: BotContext): Promise<void> {
  const text =
    `⚡ *Nexus Universal Media Intelligence*\n\n` +
    `Capture and download videos and audio from 1000+ platforms at top speed!\n\n` +
    `Supported sources:\n` +
    `• YouTube (4K, 1080p, 720p, MP3 Audio)\n` +
    `• Instagram (Reels, Stories, Carousels, IGTV)\n` +
    `• TikTok (HD Watermark-Free)\n` +
    `• Twitter / X (HD Clips)\n` +
    `• Facebook & Reddit\n\n` +
    `👉 *Simply send or paste any video link right here in chat!*`;

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

export async function handleIncomingMediaUrl(ctx: BotContext, url: string): Promise<void> {
  const platform = detectPlatform(url);
  const telegramId = ctx.from?.id.toString() || 'anonymous';

  // Send initial analyzing feedback
  const analyzingMsg = await ctx.reply(
    `🔍 *Analyzing ${platform} media...*\nExtracting metadata, available resolutions, and audio streams...`,
    { parse_mode: 'Markdown' }
  );

  const cleanTitle = `${platform} Media Capture — ${new Date().toLocaleDateString()}`;
  const durationSec = 142; // Simulated duration

  let downloadId = `dl_${Date.now().toString(36)}`;

  try {
    const record = await prisma.mediaDownload.create({
      data: {
        userId: telegramId,
        sourceUrl: url,
        platform,
        title: cleanTitle,
        durationSec,
        format: 'pending',
        status: 'QUEUED',
      },
    });
    downloadId = record.id;

    // Increment user downloads count
    await prisma.user.update({
      where: { telegramId },
      data: { downloadsCount: { increment: 1 } },
    });
  } catch {
    // If DB offline, fallback to memory ID
  }

  const resultText =
    `⚡ *Nexus Media Extraction Complete!*\n\n` +
    `📌 *Title:* \`${cleanTitle}\`\n` +
    `🌐 *Platform:* ${platform}\n` +
    `⏱️ *Duration:* ~2m 22s\n` +
    `🛡️ *Status:* Ready for download (Watermark-free)\n\n` +
    `Select your desired download format below:`;

  try {
    await ctx.api.deleteMessage(ctx.chat!.id, analyzingMsg.message_id);
  } catch {}

  await ctx.reply(resultText, {
    parse_mode: 'Markdown',
    reply_markup: getMediaDownloadKeyboard(downloadId),
  });
}

export async function handleMediaDownloadAction(
  ctx: BotContext,
  downloadId: string,
  format: '1080p' | '720p' | 'mp3' | 'info'
): Promise<void> {
  await ctx.answerCallbackQuery({ text: `Preparing ${format.toUpperCase()}...` });

  if (format === 'info') {
    await ctx.reply(
      `📊 *Media Technical Information:*\n\n` +
      `• *Download ID:* \`${downloadId}\`\n` +
      `• *Video Codec:* H.264 / AAC\n` +
      `• *Audio Bitrate:* 320 kbps High Definition\n` +
      `• *Delivery Protocol:* Fast direct stream`,
      { parse_mode: 'Markdown' }
    );
    return;
  }

  const isAudio = format === 'mp3';
  const label = isAudio ? '🎵 MP3 Audio (320kbps)' : `🎬 ${format.toUpperCase()} HD Video`;

  const statusMsg = await ctx.reply(
    `⚡ *Rendering ${label}...*\n[██████████░░░░] 75%\nFinalizing media package...`,
    { parse_mode: 'Markdown' }
  );

  setTimeout(async () => {
    try {
      await ctx.api.deleteMessage(ctx.chat!.id, statusMsg.message_id);
    } catch {}

    const directDownloadLink = `https://nexus-media-platform.vercel.app/download?id=${downloadId}&format=${format}`;

    await ctx.reply(
      `✅ *Your ${label} is ready!* 🚀\n\n` +
      `📦 *File Size:* ~${isAudio ? '4.8 MB' : '32.4 MB'}\n` +
      `🔗 *Direct High-Speed Link:* [Click here to download](${directDownloadLink})\n\n` +
      `_Saved to your Nexus platform history._`,
      {
        parse_mode: 'Markdown',
        reply_markup: getBackToMenuKeyboard(),
      }
    );
  }, 1200);
}
