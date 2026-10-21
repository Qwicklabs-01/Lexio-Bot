# ⚡ OmniPlatform — Unified Telegram Bot & Mini App Platform
> Integrates **Nexus Universal Media Intelligence**, **Feedigger Social Analytics**, and **ToolBox Pro (100+ Multi-Tools)** into a single production-ready Telegram Bot & Telegram Mini App.

---

## 📑 Table of Contents
1. [Platform Overview & Features](#-platform-overview--features)
2. [Project Architecture & Tech Stack](#-project-architecture--tech-stack)
3. [Project File Structure](#-project-file-structure)
4. [BotFather Setup Checklist](#-botfather-setup-checklist)
5. [Local Development Setup](#-local-development-setup)
6. [Telegram Mini App Setup](#-telegram-mini-app-setup)
7. [Production Deployment & Webhook Setup](#-production-deployment--webhook-setup)
8. [Testing & Verification Checklist](#-testing--verification-checklist)

---

## 🌟 Platform Overview & Features

This platform unifies the functionality of your websites and repositories into one cohesive Telegram experience:

| Module | Website / Source | Telegram Bot Modality | Mini App Modality |
| :--- | :--- | :--- | :--- |
| **⚡ Nexus Media Intelligence** | [nexus-media-platform](https://github.com/Qwicklabs-01/nexus-media-platform.git) | Auto-detects pasted links, `/download <url>`, format selector (1080p, 720p, MP3) | Live video preview, stream analyzer, format selector, download manager |
| **🔍 Feedigger Social Intel** | [Feedigger-](https://github.com/Qwicklabs-01/Feedigger-.git) | `/excavate @username`, rank by Views/Likes/Comments/ER%, 1-click CSV file export | Visual creator studio, profile cards, ranking filters, animated ER% gauge |
| **🧰 ToolBox Pro (100+ Tools)** | [ToolBox Pro / Nest Hub Tools](https://multiple-tools-two.vercel.app/) | `/tools`, `/qr <text>`, `/calc <math>`, `/password <len>`, `/bmi <wt> <ht>`, `/b64 <text>` | Interactive web tools: JSON beautifier, QR generator, Base64, BMI slider |
| **👑 Admin & Security** | Core Engine | `/admin` stats, `/broadcast <msg>` with 2-step confirmation preview, rate limiting | Session audit, HMAC-SHA256 signature verification, role gating |

---

## 🛠️ Project Architecture & Tech Stack

- **Bot Framework**: Node.js + TypeScript with [grammY](https://grammy.dev/) (fastest, most type-safe Telegram framework with native session and rate-limiting support).
- **Telegram Mini App**: React 18, Vite, TypeScript, and Vanilla CSS with custom glassmorphism and `--tg-theme-*` variables.
- **Backend API & Webhook Server**: Express.js with cryptographic HMAC-SHA256 `initData` validator.
- **Database ORM**: PostgreSQL with Prisma ORM (`prisma/schema.prisma`).
- **Containerization**: Multi-stage Docker & Docker Compose.

---

## 📁 Project File Structure

```
d:\tools\
├── package.json                   # Root package dependencies and scripts
├── tsconfig.json                  # Root TypeScript configuration
├── .env.example                   # Environment variable template
├── Dockerfile                     # Multi-stage production container build
├── docker-compose.yml             # PostgreSQL + Bot server composition
├── README.md                      # Complete setup & operational documentation
│
├── prisma/
│   └── schema.prisma              # Database schema (Users, Downloads, Scrapes, Tools)
│
├── src/
│   ├── config/
│   │   └── env.ts                 # Strongly-typed environment validator
│   ├── database/
│   │   └── client.ts              # Resilient Prisma Client singleton
│   ├── bot/
│   │   ├── index.ts               # Primary bot router and plugin assembly
│   │   ├── types.ts               # Bot context, session & conversation types
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts       # User auto-registration & admin resolution
│   │   │   ├── rateLimit.middleware.ts  # Sliding window rate limiter (anti-abuse)
│   │   │   └── logger.middleware.ts     # Audit and latency logger
│   │   ├── keyboards/
│   │   │   ├── main.menu.ts             # Main inline menu with Mini App launch
│   │   │   └── tool.keyboards.ts        # Format selection, Feedigger & tool keyboards
│   │   └── handlers/
│   │       ├── start.ts           # Onboarding & greeting
│   │       ├── menu.ts            # Main navigation
│   │       ├── help.ts            # Command reference
│   │       ├── nexus.ts           # Universal media downloader & format selector
│   │       ├── feedigger.ts       # Instagram profile excavation & CSV generation
│   │       ├── toolbox.ts         # QR, Password, Calc, BMI & Base64 tools
│   │       └── admin.ts           # Admin dashboard & 2-step broadcast system
│   │
│   ├── server/
│   │   ├── index.ts               # Express bootstrap (Webhook + API + Static Mini App)
│   │   ├── utils/
│   │   │   └── verifyTelegramInitData.ts # Server-side HMAC-SHA256 signature verification
│   │   └── routes/
│   │       ├── webhook.ts         # Secure Telegram webhook endpoint
│   │       ├── auth.ts            # Mini App cryptographic session endpoint
│   │       └── api.ts             # REST endpoints for Mini App data
│   │
│   └── mini-app/                  # High-End Telegram Mini App (Webview)
│       ├── package.json           # Mini App dependencies
│       ├── vite.config.ts         # Vite bundler configuration
│       ├── index.html             # HTML entry with telegram-web-app.js
│       └── src/
│           ├── main.tsx           # React mounting
│           ├── App.tsx            # 4-tab interactive studio
│           ├── telegram.ts        # Typed Telegram WebApp SDK wrapper
│           └── styles.css         # Glassmorphism dark/light luxury theme
│
└── tests/
    └── initData.test.ts           # HMAC cryptographic signature unit tests
```

---

## 🤖 BotFather Setup Checklist

Follow these steps with [@BotFather](https://t.me/botfather) on Telegram:

1. **Create the Bot**:
   - Send `/newbot`.
   - Choose a name: `OmniPlatform Studio`.
   - Choose a username: e.g. `OmniPlatformBot`.
   - Copy the API token provided and paste it into `.env` as `BOT_TOKEN`.

2. **Configure Bot Menu Button (Launches Mini App)**:
   - Send `/setmenubutton` to @BotFather.
   - Select your bot.
   - Enter button title: `🚀 Launch App`.
   - Enter your Mini App URL (e.g. `https://your-domain.com/app` or your Vercel deployment).

3. **Register Bot Commands**:
   - Send `/setcommands` to @BotFather and paste this list:
   ```text
   start - Launch onboarding and main menu
   menu - Open navigation dashboard
   help - View command and usage guide
   download - Download media from YouTube, IG, TikTok
   excavate - Analyze Instagram creator Reels & ER%
   tools - Open 100+ utilities collection
   qr - Generate instant QR code
   password - Generate secure random password
   calc - Calculate mathematical expression
   bmi - Calculate Body Mass Index report
   b64 - Encode text into Base64
   admin - Open administrator control center
   ```

4. **Set Inline Mode (Optional)**:
   - Send `/setinline` to enable inline lookups.

---

## 💻 Local Development Setup

### 1. Install Dependencies
```bash
# In project root:
npm install

# In mini-app folder:
cd src/mini-app
npm install
cd ../..
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your `BOT_TOKEN` from BotFather and your Telegram user ID in `ADMIN_IDS`.

### 3. Start Database & Run Migrations
```bash
# Push Prisma schema to database:
npx prisma db push
```

### 4. Run the Dev Server
```bash
# Starts backend server + Bot in polling mode (zero tunnel needed for local testing):
npm run dev
```

### 5. Run the Mini App (Vite Dev Server)
In a second terminal:
```bash
cd src/mini-app
npm run dev
```
Open `http://localhost:5173` to test the Mini App directly in your browser or through the Telegram desktop client!

---

## 🌐 Production Deployment & Webhook Setup

### Method A: Docker Deployment (Recommended)
1. Configure your `.env` with:
   - `WEBHOOK_DOMAIN=https://your-bot-domain.com`
   - `TELEGRAM_WEBHOOK_SECRET=your-secret-token`
   - `MINI_APP_URL=https://your-bot-domain.com/app`
2. Run:
   ```bash
   docker compose up -d --build
   ```
3. The server automatically issues `setWebhook` to Telegram with your secret token.

### Method B: Railway / Render / VPS
1. Connect this repository to Railway or Render.
2. Set environment variables from `.env.example`.
3. Build command: `npm run build`
4. Start command: `node dist/server/index.js`

---

## 🧪 Testing & Verification Checklist

- [x] **HMAC Cryptographic Verification Test**: Run `npx vitest run` to verify that Mini App `initData` signatures are correctly validated and tampered data is rejected.
- [x] **Rate Limiter Test**: Send >30 messages in under 60 seconds; verify bot issues a warning and prevents server flooding.
- [x] **Nexus Media Download Flow**: Paste a YouTube/Instagram link into the chat; verify title detection and format selection keyboard (1080p, 720p, MP3).
- [x] **Feedigger Instagram Excavator**: Run `/excavate @mrbeast`; verify profile metrics, ER% calculation, and click **Export CSV** to receive the `.csv` spreadsheet file.
- [x] **ToolBox Utilities**: Run `/qr https://example.com`, `/calc 50*12+100`, `/password 20`, `/bmi 75 180`.
- [x] **Admin Broadcast Flow**: Run `/broadcast Test announcement` as admin; verify the 2-step preview and confirmation modal.
- [x] **Mini App Native Bridge**: Launch Mini App in Telegram; verify viewport expansion (`expand()`), haptic vibration on buttons, and dynamic theme synchronization.
