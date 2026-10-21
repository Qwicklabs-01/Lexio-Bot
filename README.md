# ⚡ Lexio — Universal Multi-Tool Telegram Assistant
> Production-ready, high-speed Telegram Bot executing 100+ utilities, media downloaders, and creator analytics directly inside Telegram chat. **Zero external websites, zero redirects, 100% native execution.**

---

## 📑 Table of Contents
1. [Overview & Philosophy](#-overview--philosophy)
2. [Task Suites & Tool Directory](#-task-suites--tool-directory)
3. [Smart Task Intent Detection](#-smart-task-intent-detection)
4. [Architecture & Tech Stack](#-architecture--tech-stack)
5. [Project File Structure](#-project-file-structure)
6. [Getting Started (Local Development)](#-getting-started-local-development)
7. [Environment Configuration](#-environment-configuration)
8. [Docker & Production Deployment](#-docker--production-deployment)
9. [BotFather Configuration](#-botfather-configuration)
10. [📞 Support & Contact](#-support--contact)
11. [License](#-license)

---

## 🌟 Overview & Philosophy

**Lexio** eliminates the need to visit external utility websites or webapps. Users interact directly inside Telegram chat with:
- **Instant In-Chat Execution**: Calculations, formatters, QR codes, and analytics render in milliseconds within chat messages.
- **Task-Oriented UI/UX**: Clean categorized menus prompt the user for what task they need to complete.
- **In-Place Message Updates**: Uses `ctx.editMessageText` to avoid message spamming.
- **Smart Intent Matching**: Understands natural language requests (e.g., *"calculate loan"*, *"convert unit"*, *"make qr code"*) without requiring exact command syntax.
- **Privacy & Security**: Cryptographic password generation, offline hash calculation, and zero external telemetry.

---

## 🧰 Task Suites & Tool Directory

### 💻 1. Code & Developer Tasks
| Tool | Command | Description |
| :--- | :--- | :--- |
| **JSON Formatter** | `/json <data>` | Beautify, validate, and minify JSON payloads |
| **QR Code Generator** | `/qr <text/url>` | Generate high-resolution QR codes delivered as Telegram photos |
| **UUID Generator** | `/uuid` | Generate cryptographic UUID v4 identifiers |
| **Hash Generator** | `/hash <text>` | Generate MD5, SHA-1, SHA-256, and SHA-512 hashes |
| **Base64 Tool** | `/b64 <text>` / `/b64d <data>` | Base64 string encoding and decoding |
| **Binary Converter** | `/binary <text>` | Translate text to binary (`01001000...`) and binary to text |
| **Slug Maker** | `/slug <text>` | Clean SEO URL slug generator |
| **SQL Formatter** | `/sql <query>` | Beautify SQL queries with indented clauses |
| **Markdown to HTML** | `/md2html <text>` | Convert Markdown formatting into valid HTML tags |
| **HTML / CSS Minifier** | `/minhtml <code>` | Remove whitespace and comments to compress markup |
| **JWT Inspector** | `/jwt <token>` | Decode and inspect JWT header and claims payload |
| **Timestamp Converter** | `/timestamp [epoch]` | Convert Unix epoch seconds to UTC ISO 8601 strings |

---

### 🧮 2. Math, Financial & Science Tasks
| Tool | Command | Description |
| :--- | :--- | :--- |
| **Loan EMI Calculator** | `/emi <amt> <rate> <yr>` | Calculate monthly payments, total interest, and gross payback |
| **BMI Calculator** | `/bmi <wt_kg> <ht_cm>` | Body Mass Index calculation with WHO health badges |
| **Age Calculator** | `/age <YYYY-MM-DD>` | Exact years, months, days lived & next birthday countdown |
| **Percentage Calculator** | `/percent <rate> <total>` | Calculate percentage shares and values |
| **Discount Calculator** | `/discount <price> <rate>` | Compute savings and final price during sales |
| **Tip & Bill Split** | `/tip <bill> <rate> [p]` | Calculate restaurant tips and split bills per person |
| **Compound Interest** | `/compound <amt> <rate> <yr>` | Compound investment returns and final balance |
| **Sales Tax / GST** | `/tax <amount> <rate>` | Compute net price, tax payable, and gross total |
| **Unit Converter** | `/unit <amt> <from> <to>` | Length (km/mi), Weight (kg/lbs), Temperature (°C/°F) |
| **Statistics Calculator** | `/stats <numbers>` | Compute Mean (average), Median, Mode, Range, Sum, Count |
| **GPA Calculator** | `/gpa <grades>` | Calculate semester GPA on 4.0 scale (`A, B+, A-`) |
| **Scientific Calculator** | `/sci <expr>` | Advanced math: `sqrt`, `pow`, `sin`, `cos`, `log`, `pi`, `e` |

---

### 📝 3. Text & Copywriting Tasks
| Tool | Command | Description |
| :--- | :--- | :--- |
| **Case Converter** | `/case <text>` | UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case |
| **Word & Char Counter** | `/count <text>` | Count words, characters, sentences, and estimated reading time |
| **Text Reverser** | `/reverse <text>` | Reverse characters and words |
| **Text Sorter** | `/sort <items>` | Alphabetical line or comma-separated list sorter |
| **Morse Code** | `/morse <text>` | International Morse code translator |
| **Character Remover** | `/removechar <text>` | Strip symbols, punctuation, or numbers from strings |
| **Lorem Ipsum** | `/lorem [paragraphs]` | Generate placeholder dummy text |

---

### 🔍 4. SEO & Marketing Tasks
| Tool | Command | Description |
| :--- | :--- | :--- |
| **Meta Tag Generator** | `/meta <title \| desc \| url>` | Generate HTML meta tags and OpenGraph / Twitter Cards |
| **Robots.txt Generator** | `/robots [domain]` | Generate clean robots.txt crawler directives |
| **Sitemap Generator** | `/sitemap [domain]` | Generate clean XML sitemap templates |
| **Keyword Density** | `/keywords <text>` | Frequency analysis and keyword density percentages |
| **HTTP Status Codes** | `/http <code>` | Quick lookup and guide for HTTP response codes (200, 404, 500) |

---

### 🎨 5. Color & Design Tasks
| Tool | Command | Description |
| :--- | :--- | :--- |
| **HEX to RGB / RGBA** | `/hex <#hex>` | Translate hexadecimal color codes to CSS RGB & RGBA |
| **CSS Gradient Gen** | `/gradient` | Modern linear gradient CSS generator with preset palettes |
| **Box Shadow Gen** | `/shadow` | CSS box-shadow elevation generator (soft, neon, floating) |
| **Material Palette** | `/palette [color]` | Material Design 50–900 shades with 1-tap copy |

---

### ⚡ 6. Productivity Tasks
| Tool | Command | Description |
| :--- | :--- | :--- |
| **Password Generator** | `/password [length]` | 256-Bit cryptographic secure random passwords |
| **Pomodoro Timer** | `/pomodoro` | 25m Focus / 5m Break / 15m Long Break intervals |
| **Task Keeper** | `/todo [task]` | In-chat quick task and goal logger |

---

### 🎲 7. Randomizers & Interactive Games
| Tool | Command | Description |
| :--- | :--- | :--- |
| **3D Coin Flip** | `/coin` | Fair coin toss with heads/tails outcomes |
| **Dice Roller** | `/dice [sides]` | Roll d6, d20, d100 dice with random outcomes |
| **Magic 8-Ball** | `/8ball <question>` | Oracle answering yes/no questions |
| **Daily Quote** | `/quote` | Daily inspirational quotes from renowned minds |
| **Choice Picker** | `/pick <a, b, c>` | Fair selection among comma-separated options |
| **Rock Paper Scissors** | `/rps <choice>` | Interactive Rock-Paper-Scissors game vs the bot |

---

### 🎬 8. Universal Media Downloader
- **Supported Platforms**: YouTube (1080p, 720p, 320kbps MP3), Instagram Reels, TikTok (watermark-free), Twitter / X clips.
- **Instant Usage**: Paste or send any video link directly into chat.
- **Interactive Resolution Picker**: Choose between 1080p HD, 720p, or high-bitrate MP3 audio with one tap.

---

### 📊 9. Creator & Social Analytics
- **Instagram Profile Excavation**: `/excavate @username`
- **Metric Sorting**: Rank Reels by Views, Likes, Comments, or True Engagement Rate (ER%).
- **Viral Growth**: `/hashtags <niche>` and `/hook <topic>`.
- **Direct CSV Export**: Download complete analytics spreadsheets directly inside Telegram for Excel and Google Sheets.

---

## 🧠 Smart Task Intent Detection

Lexio automatically recognizes what task the user wants to accomplish from plain text:
- Typing *"calculate loan"* or *"emi"* ➔ Launches **Loan EMI Calculator**
- Typing *"bmi"* or *"body mass"* ➔ Launches **BMI Calculator**
- Typing *"convert unit"* ➔ Launches **Unit Converter**
- Typing *"password"* ➔ Launches **Password Generator**
- Typing *"make qr"* ➔ Launches **QR Generator**
- Typing any math expression like `150 * 18% + 50` ➔ Computes result immediately
- Typing *"hi"* or *"hello"* ➔ Greets with the Task Selection Control Center

---

## 🛠️ Architecture & Tech Stack

```
                               ┌─────────────────────────────────┐
                               │     Telegram Cloud Servers      │
                               └────────────────┬────────────────┘
                                                │ Long Polling / Webhook
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Lexio Bot Engine                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Framework: grammY (TypeScript) with Native Sessions                      │
│  • Rate Limiting: In-Memory Sliding Window Leaky Bucket                     │
│  • Database: PostgreSQL with Prisma ORM (Graceful Degradation for Local)    │
│  • Server: Express.js REST API & Webhook Handler                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Runtime**: Node.js 20+ / TypeScript
- **Bot Framework**: [grammY](https://grammy.dev/)
- **Database ORM**: Prisma ORM with PostgreSQL
- **Security**: Cryptographic HMAC-SHA256 & Node crypto

---

## 📁 Project File Structure

```
d:\tools\
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript compiler settings
├── .env.example                   # Environment configuration template
├── LICENSE                        # MIT License
├── README.md                      # Comprehensive documentation
│
├── prisma/
│   └── schema.prisma              # PostgreSQL schema
│
├── src/
│   ├── config/
│   │   └── env.ts                 # Strongly-typed environment validation
│   ├── database/
│   │   └── client.ts              # Resilient Prisma client singleton
│   ├── bot/
│   │   ├── index.ts               # Primary bot router & plugin assembly
│   │   ├── types.ts               # BotContext & Session typing
│   │   ├── middleware/            # Auth, RateLimiter, and Logger
│   │   ├── keyboards/
│   │   │   ├── main.menu.ts       # Task-driven category keyboards
│   │   │   └── tool.keyboards.ts  # In-chat tool execution keyboards
│   │   └── handlers/
│   │       ├── start.ts           # Onboarding & Task Suite greeting
│   │       ├── menu.ts            # Task category selector
│   │       ├── help.ts            # Full command directory
│   │       ├── toolbox.ts         # 100+ native in-chat tools & presets
│   │       ├── nexus.ts           # Media downloader handler
│   │       ├── feedigger.ts       # Social analytics & CSV export
│   │       └── admin.ts           # Admin dashboard & broadcasting
│   │
│   └── server/
│       └── index.ts               # Express bootstrap & webhook server
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- Node.js 20 or higher
- Git
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Qwicklabs-01/Lexio-Bot.git
cd Lexio-Bot

# Install dependencies
npm install
```

### 3. Configure Environment
Create `.env` file based on `.env.example`:
```env
BOT_TOKEN=your_telegram_bot_token_here
ADMIN_USER_IDS=your_telegram_id_here
PORT=3000
NODE_ENV=development
```

### 4. Start the Bot
```bash
# Start bot in development mode with live reload
npm run dev
```

---

## ⚙️ Environment Configuration

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `BOT_TOKEN` | **Yes** | — | Telegram Bot API token from `@BotFather` |
| `ADMIN_USER_IDS` | **Yes** | — | Comma-separated Telegram User IDs with admin access |
| `PORT` | No | `3000` | HTTP port for webhook/API server |
| `NODE_ENV` | No | `development` | Set to `production` in production |
| `DATABASE_URL` | No | `postgresql://...` | PostgreSQL connection string (optional in local mode) |
| `WEBHOOK_URL` | No | — | HTTPS public URL for webhook delivery |
| `WEBHOOK_SECRET` | No | — | Secret token for Telegram webhook validation |

---

## 🐳 Docker & Production Deployment

### 1. Build and Run with Docker Compose
```bash
# Build and run containers in background
docker-compose up -d --build

# View real-time logs
docker-compose logs -f bot
```

### 2. Manual Container Build
```bash
docker build -t lexio-bot:latest .
docker run -d --name lexio-bot --env-file .env -p 3000:3000 lexio-bot:latest
```

---

## 🤖 BotFather Configuration

To display all commands in Telegram's autocomplete menu, send this list to [@BotFather](https://t.me/BotFather) (`/setcommands`):

```
start - Open Lexio Task Center
menu - Browse tools by task category
help - Complete directory of 100+ tools
download - Download HD video or MP3 audio
excavate - Analyze Instagram creator profile
hashtags - Generate high-reach viral hashtags
hook - Generate 3-second viral video hooks
json - Format, validate & minify JSON
qr - Generate high-resolution QR code
uuid - Generate cryptographic UUID v4
hash - Generate MD5, SHA-1, SHA-256 hashes
b64 - Base64 encode or decode text
binary - Convert text to binary & vice versa
slug - Generate SEO clean URL slug
sql - Format & beautify SQL queries
md2html - Convert Markdown to HTML
minhtml - Minify HTML & CSS code
calc - Instant math calculator
emi - Calculate loan EMI & total interest
bmi - Body Mass Index & health category
age - Exact age & birthday countdown
unit - Convert length, weight, temperature
stats - Mean, Median, Mode & Range statistics
gpa - Calculate semester GPA (4.0 scale)
sci - Scientific calculator
case - Convert text case styles
count - Count words, characters & reading time
reverse - Reverse text characters or words
sort - Alphabetical list or line sorter
password - Generate 256-bit secure password
pomodoro - Focus sprint & break timer
todo - Quick in-chat task keeper
coin - 3D coin toss (Heads / Tails)
dice - Roll d6, d20, d100 dice
quote - Daily inspirational quote
rps - Play Rock Paper Scissors
admin - Admin control dashboard
```

---

## 📞 Support & Contact

If you have any questions, need technical assistance, or want custom tool additions, feel free to reach out:

- **Developer:** **Sakshi Developer**
- **📞 Phone:** `6290873841`
- **📧 Email:** [qwicklabs2@gmail.com](mailto:qwicklabs2@gmail.com)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
Made with ❤️ by **Sakshi Developer**.

