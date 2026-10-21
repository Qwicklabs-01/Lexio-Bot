import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyTelegramInitData } from '../utils/verifyTelegramInitData.js';
import { config } from '../../config/env.js';
import { prisma } from '../../database/client.js';

export function createAuthRouter(): Router {
  const router = Router();

  /**
   * POST /api/auth/telegram-init
   * Authenticates Telegram Mini App users using cryptographic initData
   */
  router.post('/telegram-init', async (req: Request, res: Response): Promise<void> => {
    try {
      const { initData } = req.body;
      if (!initData) {
        res.status(400).json({ error: 'Missing initData payload' });
        return;
      }

      // Verify cryptographic signature server-side
      const validated = verifyTelegramInitData(initData, config.botToken);
      const user = validated.user;
      const telegramId = user.id.toString();
      const isAdmin = config.adminIds.includes(telegramId);

      // Upsert user in database
      try {
        await prisma.user.upsert({
          where: { telegramId },
          update: {
            username: user.username || null,
            firstName: user.first_name,
            lastName: user.last_name || null,
          },
          create: {
            telegramId,
            username: user.username || null,
            firstName: user.first_name,
            lastName: user.last_name || null,
            languageCode: user.language_code || 'en',
            role: isAdmin ? 'ADMIN' : 'USER',
          },
        });
      } catch {}

      // Issue signed JWT token
      const token = jwt.sign(
        {
          id: telegramId,
          username: user.username,
          firstName: user.first_name,
          role: isAdmin ? 'ADMIN' : 'USER',
        },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          telegramId,
          username: user.username,
          firstName: user.first_name,
          isAdmin,
        },
      });
    } catch (error) {
      console.error('❌ Mini App authentication failed:', (error as Error).message);
      res.status(401).json({ error: (error as Error).message });
    }
  });

  return router;
}
