import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config, validateConfig, getValidHttpsMiniAppUrl } from '../config/env.js';
import { connectDatabase } from '../database/client.js';
import { createBot } from '../bot/index.js';
import { createWebhookRouter } from './routes/webhook.js';
import { createAuthRouter } from './routes/auth.js';
import { createApiRouter } from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer(): Promise<void> {
  validateConfig();
  await connectDatabase();

  const app = express();
  const bot = createBot();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health-check endpoint
  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
    });
  });

  // API Routes
  app.use('/api/webhook', createWebhookRouter(bot));
  app.use('/api/auth', createAuthRouter());
  app.use('/api', createApiRouter());

  // Serve Mini App Static Files
  const miniAppDistPath = path.resolve(__dirname, '../../src/mini-app/dist');
  app.use('/app', express.static(miniAppDistPath));

  // Serve Universal Tool Suite from tool repo
  const toolsSuitePath = path.resolve(__dirname, '../../src/tools-suite');
  app.use('/tools-suite', express.static(toolsSuitePath));
  app.use('/app/tools-suite', express.static(toolsSuitePath));
  app.get('/app/*', (_req, res) => {
    res.sendFile(path.join(miniAppDistPath, 'index.html'), (err) => {
      if (err) {
        res.status(200).send(`
          <html>
            <head><title>Telegram Mini App</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="font-family: sans-serif; background: #0f172a; color: #fff; padding: 2rem; text-align: center;">
              <h2>⚡ Telegram Mini App Dev Mode</h2>
              <p>Run <code>npm run dev:miniapp</code> or <code>npm run build:miniapp</code> to build the React Mini App bundle.</p>
              <p><a href="/" style="color: #38bdf8;">Return Home</a></p>
            </body>
          </html>
        `);
      }
    });
  });

  // Root welcome route
  app.get('/', (_req, res) => {
    res.json({
      name: 'Lexio Universal Assistant & Studio Server',
      status: 'running',
      features: ['Lexio Media Downloader', 'Lexio Creator & Social Intel', 'Lexio 100+ Multi-Tools Suite'],
      miniApp: `${config.miniAppUrl}`,
    });
  });

  // Start HTTP listener
  app.listen(config.port, async () => {
    console.log(`🚀 Server listening on port ${config.port} (${config.nodeEnv})`);

    // Webhook vs Polling Mode Selection
    if (config.webhookDomain && config.nodeEnv === 'production') {
      const webhookUrl = `${config.webhookDomain}/api/webhook`;
      console.log(`🌐 Setting Telegram Webhook to: ${webhookUrl}`);
      try {
        await bot.api.setWebhook(webhookUrl, {
          secret_token: config.webhookSecret,
          drop_pending_updates: true,
        });
        console.log('✅ Webhook successfully established with Telegram API');
      } catch (err) {
        console.error('❌ Failed to set Telegram webhook:', (err as Error).message);
      }
    } else {
      console.log('🔄 Development mode detected: Starting Telegram long polling...');

      // Configure in-bot Menu Button & Commands
      try {
        await bot.api.setChatMenuButton({
          menu_button: {
            type: 'web_app',
            text: '⚡ Studio',
            web_app: { url: getValidHttpsMiniAppUrl('?tab=toolbox') },
          },
        });
        console.log('✅ Telegram Bot Menu Button set to Lexio Studio WebApp');
      } catch (e) {
        console.warn('⚠️ Menu button note:', (e as Error).message);
      }

      try {
        await bot.api.setMyCommands([
          { command: 'start', description: '⚡ Launch Lexio Assistant' },
          { command: 'tools', description: '🧰 Open 126+ Web Tools' },
          { command: 'menu', description: '🧭 Choose Task Suite' },
          { command: 'download', description: '🎬 Media Downloader (YT/IG/TT)' },
          { command: 'excavate', description: '📊 Creator & Social Intel' },
          { command: 'calc', description: '🧮 Fast Math & Calculators' },
          { command: 'json', description: '💻 Format, Minify & Inspect JSON' },
          { command: 'qr', description: '📱 High-Res QR Code Generator' },
          { command: 'unit', description: '📐 Unit & Measurement Converter' },
          { command: 'stats', description: '📈 Statistical Mean/Median/Mode' },
          { command: 'password', description: '🛡️ 256-Bit Password Generator' },
          { command: 'pomodoro', description: '⏳ Focus Sprint & Break Timer' },
          { command: 'help', description: '📖 Full Command Directory' },
        ]);
        console.log('✅ Bot commands registered with Telegram API');
      } catch (e) {
        console.warn('⚠️ Commands registration note:', (e as Error).message);
      }

      bot.start({
        onStart: (info) => {
          console.log(`🤖 Bot @${info.username} started successfully via long-polling!`);
        },
      }).catch((err) => {
        console.warn('⚠️ Polling start warning (check BOT_TOKEN if testing live updates):', (err as Error).message);
      });
    }
  });
}

startServer().catch((error) => {
  console.error('💥 Fatal bootstrap error:', error);
  process.exit(1);
});
