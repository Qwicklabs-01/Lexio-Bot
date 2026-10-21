import { Router, Request, Response } from 'express';
import { Bot } from 'grammy';
import { BotContext } from '../../bot/types.js';
import { config } from '../../config/env.js';

export function createWebhookRouter(bot: Bot<BotContext>): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response): Promise<void> => {
    // 1. Verify Telegram Webhook Secret Token
    const secretToken = req.headers['x-telegram-bot-api-secret-token'];

    if (config.nodeEnv === 'production' && secretToken !== config.webhookSecret) {
      console.warn('⚠️ Webhook request rejected: Invalid or missing secret token');
      res.status(403).json({ error: 'Unauthorized webhook request' });
      return;
    }

    // 2. Feed update to grammY bot
    try {
      await bot.handleUpdate(req.body);
      res.sendStatus(200);
    } catch (error) {
      console.error('❌ Error handling Telegram webhook update:', error);
      res.sendStatus(500);
    }
  });

  return router;
}
