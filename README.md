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
| **Auto-Scraper Data Extractor** | `/scrape <url>` | Extract structured tables and lists into JSON & CSV |
| **Website Downloader & Archiver** | `/archiver <url>` | Download full source: HTML, CSS, JS bundles and assets |
| **STIX 2.1 Threat Intel Converter** | `/stix <log_json>` | Convert raw security logs into STIX 2.1 JSON bundles |
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
| **Numerology & Destiny Master** | `/numerology <date> [name]` | Calculate Mulank, Bhagyank, Kua, 3x3 Lo Shu Grid & career destiny |

---

### 📝 3. Text & Copywriting Tasks
| Tool | Command | Description |
| :--- | :--- | :--- |
| **Case Converter** | `/case <text>` | UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case |
| **LinkedIn Content Drafter** | `/linkedin <topic>` | Draft viral posts & hooks with 5 tone presets, CTAs & hashtags |
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
| **Viral Outlier Detector** | `/outlier <@handle>` | Detect 5x–10x breakout viral content, ratio & engagement rate % |
| **Meta Tag Generator** | `/meta <title \| desc \| url>` | Generate HTML meta tags and OpenGraph / Twitter Cards |
| **Robots.txt Generator** | `/robots [domain]` | Generate clean robots.txt crawler directives |
| **Sitemap Generator** | `/sitemap [domain]` | Generate clean XML sitemap templates |
| **Keyword Density** | `/keywords <text>` | Frequency analysis and keyword density percentages |
| **HTTP Status Codes** | `/http <code>` | Quick lookup and guide for HTTP response codes (200, 404, 500) |

---

### 🎨 5. Color & Design Tasks
| Tool | Command | Description |
| :--- | :--- | :--- |
| **Design Library & System Gen** | `/designlib [preset]` | 8 preset design systems, color tokens, font pairings & `DESIGN.md` |
| **Neumorphism Soft UI** | `/neo` | Tactile extruded & inset soft shadow CSS components |
| **Fluid Mesh Gradient** | `/mesh` | Multi-point organic radial mesh background gradients |
| **3D Isometric Text** | In-Bot Page | Extruded isometric 3D typography generator |
| **AI Visual Image Studio** | In-Bot Page | Generate visual concepts & graphics from text prompts |
| **Brand Identity & Logo** | In-Bot Page | Vector logo marks & brand typography generator |
| **HEX to RGB / RGBA** | `/hex <#hex>` | Translate hexadecimal color codes to CSS RGB & RGBA |
| **CSS Gradient Gen** | `/gradient` | Modern linear gradient CSS generator with preset palettes |
| **Box Shadow Gen** | `/shadow` | CSS box-shadow elevation generator (soft, neon, floating) |
| **Material Palette** | `/palette [color]` | Material Design 50–900 shades with 1-tap copy |
| **App Icon Bundle Creator** | In-Bot Page | Export iOS & Android app icon multi-resolution packages |
| **Multi-size Favicon** | In-Bot Page | Browser favicon 16x16, 32x32, 192x192 generator |
| **Noise & Grain Textures** | In-Bot Page | Procedural canvas noise textures and overlays |
| **SVG Pattern Generator** | In-Bot Page | Seamless geometric repeating SVG backgrounds |
| **Image to Vector SVG** | In-Bot Page | Raster pixel image to scalable vector SVG converter |
| **Image Upscaler & Clean** | In-Bot Page | Increase image sharpness and remove watermarks |

---

### 📄 6. PDF & Document Master Suite
| Tool | Command | Description |
| :--- | :--- | :--- |
| **Optical OCR Text Extractor** | `/ocr` | Extract text from scanned images and documents locally |
| **Compress PDF Optimizer** | In-Bot Page | Optimize and reduce PDF document file size |
| **PDF to Word (.docx)** | In-Bot Page | Convert PDF documents into editable Word files |
| **Word (.docx) to PDF** | In-Bot Page | Convert Word documents into standardized PDF |
| **Excel (.xlsx) to PDF** | In-Bot Page | Convert tabular spreadsheets into printable PDF |
| **PowerPoint to PDF** | In-Bot Page | Convert presentation slides into high-res PDF |
| **PNG Images to PDF** | In-Bot Page | Combine image albums into a single PDF document |
| **PDF to Audio Book** | In-Bot Page | Speech synthesis text-to-speech audio reader |
| **Audio Speech to PDF** | In-Bot Page | Transcribe spoken audio recordings into PDF documents |
| **PDF Multilingual Translator** | In-Bot Page | Translate PDF documents across 50+ languages |
| **PDF to ZIP Archive** | In-Bot Page | Extract PDF assets and attachments into ZIP |
| **PDF to Structured XML** | In-Bot Page | Extract schema elements into structured XML |
| **PDF Font to TTF** | In-Bot Page | Extract embedded TrueType font files from PDF |
| **PDF to EPUB / Ebook** | In-Bot Page | Reflow documents into EPUB e-reader format |

---

### ✍️ 7. AI Writing & Content Architecture
| Tool | Command | Description |
| :--- | :--- | :--- |
| **AI Academic Essayist** | `/essay <topic>` | Generate structured academic essays, theses & outlines |
| **Anti-AI Text Humanizer** | `/humanize <text>` | Restyle AI text to sound authentic, natural & human |
| **Content Polish & Improver** | In-Bot Page | Refine vocabulary, sentence variety, and clarity |
| **Paragraph Generator** | In-Bot Page | Generate comprehensive in-depth topic paragraphs |
| **Sentence Auto-Finisher** | In-Bot Page | Contextually complete unfinished phrases & lines |
| **README Architect** | In-Bot Page | Generate complete GitHub/GitLab README files |
| **Live Markdown Previewer** | In-Bot Page | Interactive editor with real-time HTML rendering |

---

### 📐 8. Professional, CAD & 3D Engineering
| Tool | Command | Description |
| :--- | :--- | :--- |
| **AutoCAD DWG to PDF** | In-Bot Page | Convert CAD DWG blueprints into printable PDF drawings |
| **PDF to AutoCAD DWG** | In-Bot Page | Vectorize PDF technical drawings into CAD DWG files |
| **PDF to CAD DXF** | In-Bot Page | Extract vector diagrams into CAD DXF interchange format |
| **PDF to Embroidery DST** | In-Bot Page | Convert vector artwork into Tajima embroidery stitches |
| **2D to 3D OBJ / GLTF** | In-Bot Page | Extrude 2D artwork into 3D printable meshes |
| **Convert to Figma Vector** | In-Bot Page | Export UI mockups into Figma components |
| **Convert to Sketch Vector** | In-Bot Page | Export layout designs into Sketch artboards |
| **Convert to Adobe XD** | In-Bot Page | Export wireframes into Adobe XD layout assets |
| **Convert to Layered PSD** | In-Bot Page | Convert graphics into layered Photoshop documents |
| **Convert to Adobe AI** | In-Bot Page | Convert artwork into Adobe Illustrator vector files |
| **Digital Camera RAW** | In-Bot Page | Process and develop digital camera RAW negatives |

---

### 🧱 9. Web Builders & CMS Utilities
| Tool | Command | Description |
| :--- | :--- | :--- |
| **Drag-and-Drop Page Prototyper** | In-Bot Page | Visual Elementor-style landing page block builder |
| **WordPress Theme & Plugin Gen** | In-Bot Page | Generate custom WordPress theme boilerplates & hooks |
| **Chrome Extension Builder** | In-Bot Page | Scaffold Manifest v3 background, popup & content code |
| **Multi-Language Code Formatter** | In-Bot Page | Format and beautify JavaScript, Python, HTML & CSS |
| **SEO Health & Speed Auditor** | In-Bot Page | Audit meta tags, heading hierarchy & crawl speed |
| **Universal Multi-Unit Converter** | `/unit` | Convert engineering, pressure, energy, speed & data units |

---

### ⚡ 6. Productivity Tasks
| Tool | Command | Description |
| :--- | :--- | :--- |
| **Composable AI Multi-Agent** | `/agent <objective>` | Multi-agent execution pipeline (Researcher ➔ Architect ➔ Quality Guard) |
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
                              ┌─────────────────────────────────────────┐
                              │         Telegram Cloud Platform         │
                              │  • Telegram Bot API                     │
                              │  • Telegram Mini App Webview (In-Bot)   │
                              └────────────────────┬────────────────────┘
                                                   │
                        HTTPS Webhook / Long-Polling & In-App Webview
                                                   │
                                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Express.js Application Gateway                              │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  • Webhook Endpoint: POST /api/webhook (HMAC-SHA256 Token Validation)                      │
│  • Mini App Static Server: GET /app/* (React 18 Single-Page Application Bundle)             │
│  • REST API & Auth: GET /health, POST /api/auth (JWT Generation & Session Verification)      │
└──────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
┌───────────────────────────────────────┐     ┌───────────────────────────────────────────────┐
│           grammY Bot Engine           │     │            React 18 Mini App UI               │
├───────────────────────────────────────┤     ├───────────────────────────────────────────────┤
│  • Command & Intent Router            │     │  • ☰ Responsive Slide Bar (Drawer Navigation) │
│  • Middleware Stack:                  │     │  • 100,000+ Tools Directory & Live Search     │
│    - Auth (Admin/User Access)         │     │  • Interactive Tool Workspaces (47+ Tools)    │
│    - Sliding Window Leaky-Bucket Rate │     │  • Telegram WebApp SDK Integration:           │
│    - Performance & Security Logger    │     │    - Native Haptic Feedback Engines           │
│  • Task Handlers:                     │     │    - In-App Popups & Confirmation Sheets      │
│    - Start & Menu (Task Centers)      │     │    - Viewport Resizing & Theme Synchronization│
│    - 100+ Native In-Chat Calculators  │     │  • Universal Media Downloader Suite           │
│    - Nexus Media Downloader Engine    │     │  • Creator Profile Excavation UI              │
│    - Feedigger Creator Analytics      │     │  • 100% In-Bot Execution (No External Sites)  │
│    - Broadcast & Admin Management     │     └───────────────────────────────────────────────┘
└───────────────────┬───────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  Data & Persistence Layer                                   │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  • Prisma ORM v6 (Type-safe Database Client)                                                │
│  • PostgreSQL 16 (Relational Schema for Users, Tasks, Sessions & Analytics)                │
│  • Resilient Graceful Degradation (Runs in offline/degraded mode if PostgreSQL is offline)  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Core Technologies
- **Runtime Environment:** Node.js (v20+ LTS recommended) / TypeScript 5.8
- **Telegram Bot Framework:** [grammY v1.35+](https://grammy.dev/) with native session handling and conversations
- **Mini App Frontend:** React 18, Vite 6, TypeScript, Vanilla CSS (Glassmorphism & HSL Color Tokens)
- **HTTP & Webhook Server:** Express.js 4.21 with CORS, JSON parser, and static assets server
- **Database ORM:** Prisma ORM 6.4 with PostgreSQL 16
- **Security & Cryptography:** Node `crypto` (HMAC-SHA256, SHA-512, MD5, UUID v4), `jsonwebtoken` (JWT)
- **Containerization:** Docker Multi-stage (`node:22-alpine`) + Docker Compose

---

## 📁 Project File Structure

```
d:\tools\
├── .env.example                   # Template containing all configurable environment variables
├── .gitignore                     # Git ignore rules (strictly excludes .env and build caches)
├── Dockerfile                     # Production multi-stage Docker build recipe
├── docker-compose.yml             # Orchestration for PostgreSQL 16 and Bot Server
├── LICENSE                        # Official MIT Open Source License
├── package.json                   # Root workspace scripts and server dependencies
├── tsconfig.json                  # Root TypeScript configuration (ES2022, NodeNext modules)
├── README.md                      # Comprehensive project documentation
│
├── prisma/
│   └── schema.prisma              # PostgreSQL database models (User, ToolSession, Analytics)
│
├── src/
│   ├── config/
│   │   └── env.ts                 # Strongly-typed environment validation and URL helpers
│   ├── database/
│   │   └── client.ts              # Resilient Prisma client singleton with auto-reconnection
│   │
│   ├── bot/
│   │   ├── index.ts               # Primary grammY bot initialization & handler assembly
│   │   ├── types.ts               # BotContext & Session typing definitions
│   │   ├── middleware/
│   │   │   ├── auth.ts            # Admin role validation & permission checks
│   │   │   ├── logger.ts          # Structured request logging
│   │   │   └── rate-limiter.ts    # Sliding-window leaky bucket rate protection
│   │   ├── keyboards/
│   │   │   ├── main.menu.ts       # Category selection & WebApp launcher keyboards
│   │   │   └── tool.keyboards.ts  # In-chat interactive action keyboards & presets
│   │   └── handlers/
│   │       ├── start.ts           # /start onboarding, greetings & task options
│   │       ├── menu.ts            # /menu task selector & navigation
│   │       ├── help.ts            # /help complete tool directory & search
│   │       ├── toolbox.ts         # 100+ native in-chat tools & calculation presets
│   │       ├── nexus.ts           # Universal Media Downloader (/download, /audio, /info, /media)
│   │       ├── feedigger.ts       # Creator analytics excavation & CSV report generation
│   │       └── admin.ts           # Admin dashboard, stats, and broadcast messaging
│   │
│   ├── mini-app/                  # React 18 + Vite Telegram Mini App (In-Bot WebApp)
│   │   ├── index.html             # HTML entry point with Telegram WebApp script
│   │   ├── package.json           # Mini App dependencies (React 18, Lucide icons, Vite)
│   │   ├── tsconfig.json          # Frontend TypeScript compiler options
│   │   ├── vite.config.ts         # Vite build configuration (base: './', CSS minification)
│   │   ├── dist/                  # Production-compiled static bundle (served at /app)
│   │   └── src/
│   │       ├── main.tsx           # React DOM root mounting
│   │       ├── styles.css         # Rich dark glassmorphic design system & animations
│   │       ├── telegram.ts        # Telegram WebApp SDK helper (Haptics, MainButton, Popups)
│   │       └── App.tsx            # Main application with responsive Slide Bar & 47+ tool workspaces
│   │
│   └── server/
│       ├── index.ts               # Express bootstrap, webhook routing & static asset server
│       └── routes/
│           ├── webhook.ts         # Telegram webhook handler with secret token validation
│           ├── auth.ts            # Telegram WebApp initData validation & JWT signing
│           └── api.ts             # Health check & internal tool API endpoints
```

---

## 🚀 Local Deployment (Step-by-Step)

Follow these steps to set up and run the bot locally on your machine.

### Step 1: System Prerequisites
- **Node.js**: Version 20.x or 22.x LTS installed (`node -v`)
- **npm**: Version 10.x or higher (`npm -v`)
- **Git**: Installed and configured (`git --version`)
- **PostgreSQL (Optional for local dev)**: Version 15 or 16. If PostgreSQL is not installed, the bot automatically boots in local degraded mode with zero crashes.

### Step 2: Clone & Navigate to Project
```bash
git clone https://github.com/Qwicklabs-01/Lexio-Bot.git
cd Lexio-Bot
```

### Step 3: Install All Dependencies
Install root backend dependencies as well as frontend Mini App dependencies:
```bash
# 1. Install root dependencies
npm install

# 2. Install Mini App frontend dependencies
cd src/mini-app
npm install
cd ../..
```

### Step 4: Configure Environment Variables
Copy `.env.example` to a new `.env` file:
```bash
# On Linux/macOS
cp .env.example .env

# On Windows (PowerShell)
Copy-Item .env.example .env
```

Open `.env` in your editor and provide your credentials:
```env
# Required: Telegram Bot Token from @BotFather
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ

# Required: Your numerical Telegram User ID (get it from @userinfobot)
ADMIN_IDS=123456789

# Port and Environment
PORT=3000
NODE_ENV=development

# Webhook configuration (Leave WEBHOOK_DOMAIN empty for local long-polling)
WEBHOOK_DOMAIN=
TELEGRAM_WEBHOOK_SECRET=your-random-32-character-secret-key-here

# Mini App URL (Local development URL)
MINI_APP_URL=http://localhost:5173

# Security & Database
JWT_SECRET=your-super-secret-jwt-signing-key-minimum-32-chars
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/omni_telegram_platform?schema=public
```

> [!TIP]
> Keep `.env` secured and uncommitted. On Windows, you can mark it hidden using `attrib +h .env`.

### Step 5: Initialize Prisma Client (Optional)
If running a local PostgreSQL instance:
```bash
npx prisma generate
npx prisma db push
```

### Step 6: Build the Mini App Frontend
Compile the React 18 Mini App into static production assets:
```bash
npm run build:miniapp
```
This outputs the bundle into `src/mini-app/dist`, which Express serves at `/app`.

### Step 7: Launch the Bot
#### Option A: Development Mode (Live Reloading via tsx)
```bash
npm run dev
```
- Automatically starts Express on `http://localhost:3000`
- Automatically starts long-polling connection to Telegram
- Registers bot commands and persistent menu button
- Watches all TypeScript files for hot changes

#### Option B: Production Build & Execution
```bash
npm run build
npm start
```

### Step 8: Verification
- Open your browser to `http://localhost:3000/health` — you should receive:
  ```json
  {"status":"healthy","uptime":...,"environment":"development"}
  ```
- Open `http://localhost:3000/app` to test the WebApp interface directly in your browser.
- Open Telegram, search for your bot username, and send `/start`.

---

## 🐳 Docker Deployment (Step-by-Step)

The project includes an enterprise-grade multi-stage `Dockerfile` and `docker-compose.yml` to run the bot and PostgreSQL in isolated containers.

### Step 1: Ensure Docker is Running
Verify Docker and Docker Compose are available on your host:
```bash
docker --version
docker compose version
```

### Step 2: Configure Environment Variables for Docker
Ensure your `.env` contains valid credentials:
```env
BOT_TOKEN=your_bot_token_here
ADMIN_IDS=your_telegram_id_here
PORT=3000
NODE_ENV=production
TELEGRAM_WEBHOOK_SECRET=your_32_char_random_secret
JWT_SECRET=your_32_char_jwt_secret
```
*(Note: `DATABASE_URL` inside `docker-compose.yml` automatically points to the `postgres` container).*

### Step 3: Build and Start Containers
Run Docker Compose in detached mode:
```bash
docker compose up -d --build
```
This will:
1. Spin up a healthy `postgres:16-alpine` database with data volume persistence (`pgdata`).
2. Build the multi-stage `node:22-alpine` container, compile TypeScript, build the React Mini App, and install production dependencies.
3. Start the Express server and Telegram bot engine.

### Step 4: Run Database Migrations Inside Container
```bash
docker compose exec bot-server npx prisma db push
```

### Step 5: Monitor Logs & Inspect Containers
```bash
# View real-time logs
docker compose logs -f bot-server

# Check container status
docker compose ps
```

### Step 6: Useful Docker Commands
```bash
# Restart the bot container
docker compose restart bot-server

# Stop all services
docker compose down

# Stop and wipe database volume (clean slate)
docker compose down -v
```

---

## 🤖 [@BotFather](https://t.me/BotFather) Setup (Step-by-Step)

To configure the autocomplete command menu, in-bot menu button, description, and about text, follow these instructions with [@BotFather](https://t.me/BotFather).

### Step 1: Set Autocomplete Commands (`/setcommands`)
1. Open [@BotFather](https://t.me/BotFather) on Telegram.
2. Send command: `/setcommands`
3. Select your bot from the list.
4. Copy and paste the entire list below:

```
start - 🚀 Open Task Center & Choose Tool Type
tools - 🧰 Browse 100,000+ Tools & Options
menu - 🧭 Select Tools by Task Category
download - 🎬 Universal Media Downloader (YT, IG, TikTok, X)
audio - 🎵 Extract HQ 320kbps MP3 Audio
info - ℹ️ Inspect Video Codec, Bitrate & Resolution
media - 📱 Interactive Media Downloader Hub
excavate - 📊 Analyze Instagram Creator Profile
hashtags - #️⃣ Generate High-Reach Viral Hashtags
hook - 🪝 Generate 3-Second Viral Video Hooks
json - 💻 Format, Validate & Minify JSON
qr - 📱 Generate High-Resolution QR Codes
calc - 🧮 Instant Math & Equation Calculator
emi - 🏦 Calculate Loan EMI & Interest Payback
bmi - ⚖️ Body Mass Index & Health Classification
age - 🎂 Exact Age, Days Lived & Birthday Countdown
unit - 📐 Universal Unit Converter (Len/Wt/Temp)
stats - 📈 Mean, Median, Mode & Range Calculator
gpa - 🎓 GPA & University Honours Calculator
sci - 🔬 Scientific Math Evaluator
password - 🛡️ Generate 256-Bit Cryptographic Passwords
pomodoro - ⏳ Focus Sprint & Break Timer
todo - ✅ Quick In-Chat Task & Goal Keeper
coin - 🪙 3D Fair Coin Toss (Heads/Tails)
dice - 🎲 Roll d6, d20, d100 Multi-Sided Dice
quote - 💡 Daily Thought & Wisdom
rps - ✂️ Play Rock Paper Scissors
uuid - 🔑 Generate Cryptographic UUID v4
hash - 🔒 Generate MD5, SHA-256 & SHA-512 Hashes
b64 - 🔤 Base64 Encode & Decode Strings
binary - 0️⃣ Binary to Text & Text to Binary
slug - 🔗 Generate Clean SEO URL Slugs
sql - 🗄️ Format & Beautify SQL Queries
linkedin - 💼 LinkedIn Viral Post & Hook Drafter
outlier - 📈 Viral Outlier & 10x Breakout Detector
scrape - 📥 Extract Tables & Lists to JSON/CSV
archiver - 🌐 Download Complete Website Source & Assets
stix - 🛡️ Convert Security Logs to STIX 2.1 Threat Intel
designlib - 🎨 Generate Design System Tokens & Typography
agent - 🤖 Composable AI Multi-Agent Pipeline
numerology - ✨ Calculate Mulank, Bhagyank, Kua & Lo Shu Grid
case - 🔠 Convert UPPER, lower, camelCase, snake_case
count - 🔢 Word, Character & Reading Time Counter
reverse - 🔄 Reverse Characters or Word Order
sort - 🔤 Alphabetical Line & List Sorter
admin - ⚙️ Administrator Dashboard & Broadcast
help - 📖 Complete Task & Tool Directory
```

### Step 2: Configure Persistent In-Bot Menu Button (`/setmenubutton`)
Setting the menu button gives users a permanent button next to the chat message bar that opens the tools suite directly in the Telegram Bot page:
1. In [@BotFather](https://t.me/BotFather), send: `/setmenubutton`
2. Select your bot.
3. Send the HTTPS WebApp URL (e.g. `https://your-domain.com/app` or `https://nest-hub-tools.vercel.app?tab=toolbox`).
4. Enter the button label: `⚡ Tools Page`

*(Note: The bot also automatically calls `bot.api.setChatMenuButton` upon startup).*

### Step 3: Set Bot Description (`/setdescription`)
This is the text displayed on the screen before a user presses "Start":
1. In [@BotFather](https://t.me/BotFather), send: `/setdescription`
2. Select your bot.
3. Paste:
```
⚡ Welcome to Lexio — The Universal Multi-Tool Platform!

Over 100,000 tools running directly inside Telegram:
🎬 Universal Media Downloader (YouTube, Instagram, TikTok, Twitter/X)
📊 Creator & Social Analytics Engine
🧮 Financial, Health & Scientific Calculators
💻 Developer Utilities (JSON, SQL, QR, Regex, Hash)
📝 Text, Copywriting & Productivity Suites

100% Native Telegram Execution • Zero External Redirects
Made by Sakshi Developer
```

### Step 4: Set About Text (`/setabouttext`)
This text appears on the bot's profile page:
1. In [@BotFather](https://t.me/BotFather), send: `/setabouttext`
2. Select your bot.
3. Paste:
```
⚡ Lexio: 100,000+ Universal Tools, Media Downloaders & Creator Analytics directly inside Telegram. Zero external websites. Developed by Sakshi Developer.
```

### Step 5: Set Bot Profile Photo (`/setuserpic`)
1. In [@BotFather](https://t.me/BotFather), send: `/setuserpic`
2. Select your bot.
3. Upload an avatar (e.g. high-tech neon logo or gradient icon).

---

## 📞 Support & Contact

If you have questions, need assistance deploying, or want to contribute:

- **Developer:** **Sakshi Developer**
- **📞 Phone:** `6290873841`
- **📧 Email:** [qwicklabs2@gmail.com](mailto:qwicklabs2@gmail.com)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.  
Copyright © 2026 **Sakshi Developer**. All rights reserved.

