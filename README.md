# ⚡ Lexio — Universal Telegram Bot

> 100+ tools running directly inside Telegram. Zero external redirects.

---

## 🚀 Features

| Suite | Tools |
|---|---|
| 🎬 **Media Downloader** | YouTube, Instagram, TikTok, Twitter/X |
| 📊 **Creator Analytics** | Instagram profile audit, ER%, viral hooks, CSV export |
| 💻 **Developer** | JSON, QR, UUID, Hash, Base64, SQL, JWT, Binary |
| 🧮 **Finance & Math** | EMI, BMI, Age, Compound, Tax, GPA, Stats |
| 📝 **Text & Writing** | Case, Count, Reverse, Morse, Lorem, LinkedIn drafter |
| 🔍 **SEO** | Meta tags, Robots.txt, Sitemap, Keywords |
| 🎨 **Design & CSS** | Gradients, Shadows, HEX→RGB, Neumorphism, Mesh |
| 📄 **PDF Suite** | OCR, PDF↔Word/Excel/PPT, Translate, Audio |
| ⚡ **Productivity** | Password, Pomodoro, Todo, Multi-Agent AI |
| 🎲 **Games** | Coin, Dice, 8-Ball, Quote, Rock-Paper-Scissors |

---

## 🛠️ Stack

- **Bot:** [grammY](https://grammy.dev/) + TypeScript + Node.js
- **Server:** Express.js (Webhook + REST API)
- **Mini App:** React 18 + Vite (Telegram WebApp)
- **Database:** PostgreSQL + Prisma ORM
- **Deploy:** Docker + Vercel

---

## ⚙️ Quick Start

```bash
git clone https://github.com/Qwicklabs-01/Lexio-Bot.git
cd Lexio-Bot
npm install
cp .env.example .env   # fill in BOT_TOKEN, ADMIN_IDS, etc.
npm run dev
```

### Environment Variables (`.env`)
```env
BOT_TOKEN=your_telegram_bot_token
ADMIN_IDS=your_telegram_user_id
PORT=3000
NODE_ENV=development
MINI_APP_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lexio
```

### Docker
```bash
docker compose up -d --build
docker compose exec bot-server npx prisma db push
```

---

## 📁 Structure

```
src/
├── bot/
│   ├── handlers/    # start, menu, toolbox, nexus, feedigger, admin
│   ├── keyboards/   # inline & reply keyboards
│   ├── middleware/  # auth, logger, rate-limiter
│   └── utils/       # markdown helpers
├── mini-app/        # React 18 Telegram WebApp
├── server/          # Express webhook & API routes
└── config/env.ts    # typed env config
prisma/schema.prisma
```

---

## 📄 License

MIT © 2026 **Sakshi Developer** · [qwicklabs2@gmail.com](mailto:qwicklabs2@gmail.com)
