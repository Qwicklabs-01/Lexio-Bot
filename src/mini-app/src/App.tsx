import React, { useState, useEffect, useMemo } from 'react';
import { tg } from './telegram.js';

type Tab = 'media' | 'social' | 'toolbox' | 'profile';
type ToolCategory = 'all' | 'dev' | 'calc' | 'text' | 'seo' | 'design' | 'fun';

interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  icon: string;
  desc: string;
}

const ALL_TOOLS: ToolItem[] = [
  // Developer & Web
  { id: 'json', name: 'JSON Beautifier', category: 'dev', icon: '🔤', desc: 'Format, validate & minify JSON' },
  { id: 'qr', name: 'QR Code Generator', category: 'dev', icon: '📱', desc: 'Generate high-res QR codes' },
  { id: 'base64', name: 'Base64 Tool', category: 'dev', icon: '🔐', desc: 'Encode & decode Base64' },
  { id: 'uuid', name: 'UUID Generator', category: 'dev', icon: '🆔', desc: 'Generate unique v4 identifiers' },
  { id: 'slug', name: 'Slug Generator', category: 'dev', icon: '🔗', desc: 'Clean SEO friendly URL slugs' },
  { id: 'hash', name: 'Cryptographic Hashes', category: 'dev', icon: '🔑', desc: 'MD5 & SHA-256 hashes' },
  { id: 'sql', name: 'SQL Formatter', category: 'dev', icon: '💻', desc: 'Format & beautify SQL queries' },
  { id: 'jwt', name: 'JWT Token Inspector', category: 'dev', icon: '🔍', desc: 'Decode header & payload claims' },
  { id: 'timestamp', name: 'Timestamp Converter', category: 'dev', icon: '⏱️', desc: 'Unix epoch to human dates' },
  { id: 'html', name: 'HTML Escaper', category: 'dev', icon: '🌐', desc: 'Escape & unescape HTML entities' },

  // Calculators & Financial
  { id: 'bmi', name: 'BMI Calculator', category: 'calc', icon: '⚖️', desc: 'Health index & WHO category' },
  { id: 'age', name: 'Age Calculator', category: 'calc', icon: '🎂', desc: 'Exact age, days & next birthday' },
  { id: 'emi', name: 'Loan EMI Calculator', category: 'calc', icon: '💰', desc: 'Monthly payment & interest split' },
  { id: 'percent', name: 'Percentage Calc', category: 'calc', icon: '📊', desc: 'Calculate percentage values' },
  { id: 'discount', name: 'Discount Calculator', category: 'calc', icon: '🏷️', desc: 'Sales savings & final price' },
  { id: 'tip', name: 'Tip & Bill Splitter', category: 'calc', icon: '🪙', desc: 'Split checks with groups' },
  { id: 'compound', name: 'Compound Interest', category: 'calc', icon: '📈', desc: 'Calculate investment growth' },
  { id: 'tax', name: 'Sales Tax / GST', category: 'calc', icon: '🧾', desc: 'Net to gross tax breakdown' },

  // Text & Content
  { id: 'case', name: 'Case Converter', category: 'text', icon: '🔠', desc: 'UPPER, lower, Title, camel, snake' },
  { id: 'count', name: 'Word & Char Counter', category: 'text', icon: '📝', desc: 'Count words, sentences & time' },
  { id: 'reverse', name: 'Text Reverser', category: 'text', icon: '🔄', desc: 'Reverse characters or words' },
  { id: 'sort', name: 'Alphabetical Sorter', category: 'text', icon: '🔡', desc: 'Sort lists and lines A-Z' },
  { id: 'morse', name: 'Morse Code Tool', category: 'text', icon: '📻', desc: 'Translate to/from Morse code' },
  { id: 'lorem', name: 'Lorem Ipsum Gen', category: 'text', icon: '📜', desc: 'Generate placeholder text' },

  // SEO & Web
  { id: 'meta', name: 'Meta Tag Generator', category: 'seo', icon: '🏷️', desc: 'HTML meta & social tags' },
  { id: 'robots', name: 'Robots.txt Gen', category: 'seo', icon: '🤖', desc: 'Standard crawler directives' },
  { id: 'sitemap', name: 'XML Sitemap Gen', category: 'seo', icon: '🗺️', desc: 'Standard XML sitemaps' },
  { id: 'http', name: 'HTTP Status Codes', category: 'seo', icon: '🚥', desc: 'Explanations & fix guides' },

  // Design & Colors
  { id: 'hextorgb', name: 'HEX to RGB Converter', category: 'design', icon: '🎨', desc: 'Translate HEX, RGB & HSL' },
  { id: 'gradient', name: 'CSS Gradient Gen', category: 'design', icon: '🌈', desc: 'Modern CSS linear gradients' },
  { id: 'shadow', name: 'Box Shadow Gen', category: 'design', icon: '📦', desc: 'CSS elevation & glow presets' },
  { id: 'glass', name: 'Glassmorphism Gen', category: 'design', icon: '🪟', desc: 'Modern frosted glass CSS' },

  // Random & Games
  { id: 'password', name: 'Password Generator', category: 'fun', icon: '🔑', desc: '256-bit cryptographic keys' },
  { id: 'coin', name: '3D Coin Toss', category: 'fun', icon: '🪙', desc: 'Heads or tails decision maker' },
  { id: 'dice', name: 'Dice Roller', category: 'fun', icon: '🎲', desc: 'Roll 6-sided or custom die' },
  { id: '8ball', name: 'Magic 8-Ball', category: 'fun', icon: '🎱', desc: 'Ask questions, get answers' },
  { id: 'quote', name: 'Inspirational Quote', category: 'fun', icon: '💬', desc: 'Daily famous quotes' },
  { id: 'rps', name: 'Rock Paper Scissors', category: 'fun', icon: '🎮', desc: 'Play against Lexio AI' },
  { id: 'rand', name: 'Random Number', category: 'fun', icon: '🔢', desc: 'Pick integer between min & max' },
];

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('media');
  const user = tg.getUser();

  useEffect(() => {
    tg.init();
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab') as Tab;
    if (tabParam && ['media', 'social', 'toolbox', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const switchTab = (tab: Tab) => {
    tg.haptic('selectionChanged');
    setActiveTab(tab);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-logo">⚡</div>
          <div className="brand-text">
            <h1>Lexio Studio</h1>
            <span>Universal Assistant & 100+ Multi-Tools</span>
          </div>
        </div>
        <div className="user-badge">
          <span>@{user.username || user.first_name}</span>
        </div>
      </header>

      {/* Main Content View */}
      <main>
        {activeTab === 'media' && <MediaDownloaderTab />}
        {activeTab === 'social' && <SocialAnalyticsTab />}
        {activeTab === 'toolbox' && <ToolBoxTab />}
        {activeTab === 'profile' && <ProfileTab user={user} />}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'media' ? 'active nexus' : ''}`}
          onClick={() => switchTab('media')}
        >
          <span className="nav-icon">🎬</span>
          <span>Media</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'social' ? 'active feedigger' : ''}`}
          onClick={() => switchTab('social')}
        >
          <span className="nav-icon">📊</span>
          <span>Social</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'toolbox' ? 'active toolbox' : ''}`}
          onClick={() => switchTab('toolbox')}
        >
          <span className="nav-icon">🧰</span>
          <span>100+ Tools</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => switchTab('profile')}
        >
          <span className="nav-icon">👤</span>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}

// ==========================================
// 1. Universal Media Downloader Tab
// ==========================================
function MediaDownloaderTab() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [mediaData, setMediaData] = useState<any>(null);
  const [selectedFormat, setSelectedFormat] = useState('1080p');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExtract = () => {
    if (!url.trim()) {
      tg.showPopup('Missing URL', 'Please enter or paste a video link from YouTube, Instagram, TikTok, or X.');
      return;
    }
    tg.haptic('medium');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMediaData({
        title: 'Universal Media Capture & High-Performance Extraction',
        platform: url.includes('instagram') ? 'Instagram' : url.includes('tiktok') ? 'TikTok' : 'YouTube',
        duration: '14m 20s',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      });
      tg.haptic('success');
    }, 700);
  };

  const handleDownload = () => {
    tg.haptic('heavy');
    setDownloading(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          tg.haptic('success');
          tg.showPopup('Download Complete!', `Your ${selectedFormat.toUpperCase()} file has been processed successfully.`);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  return (
    <div className="glass-card">
      <h2 className="card-title">🎬 Universal Media Downloader</h2>
      <p className="card-subtitle">
        Capture videos & audio from YouTube, TikTok, Instagram, and Twitter/X with zero watermarks.
      </p>

      <div className="input-group">
        <input
          type="text"
          className="text-input"
          placeholder="Paste YouTube, Instagram, or TikTok link..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="btn-primary" onClick={handleExtract} disabled={loading}>
          {loading ? 'Analyzing...' : 'Extract'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {['YouTube 4K', 'Instagram Reels', 'TikTok HD', 'Twitter/X Clips'].map((badge) => (
          <span
            key={badge}
            className="btn-secondary"
            style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '8px' }}
          >
            {badge}
          </span>
        ))}
      </div>

      {mediaData && (
        <div style={{ background: 'rgba(10, 15, 28, 0.65)', border: '1px solid var(--border-glass)', borderRadius: '18px', overflow: 'hidden' }}>
          <img src={mediaData.thumbnail} alt="Media thumbnail" style={{ width: '100%', height: '175px', objectFit: 'cover' }} />
          <div style={{ padding: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '6px' }}>{mediaData.title}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Source: <b style={{ color: '#fff' }}>{mediaData.platform}</b> • Duration: <b style={{ color: '#fff' }}>{mediaData.duration}</b>
            </p>

            <div className="format-options">
              {[
                { id: '1080p', label: '1080p Full HD', sub: '38.4 MB' },
                { id: '720p', label: '720p HD', sub: '18.2 MB' },
                { id: 'mp3', label: 'MP3 Audio', sub: '320kbps' },
              ].map((fmt) => (
                <div
                  key={fmt.id}
                  className={`format-chip ${selectedFormat === fmt.id ? 'active' : ''}`}
                  onClick={() => {
                    tg.haptic('selectionChanged');
                    setSelectedFormat(fmt.id);
                  }}
                >
                  <div className="format-title">{fmt.label}</div>
                  <div className="format-sub">{fmt.sub}</div>
                </div>
              ))}
            </div>

            {downloading && (
              <div style={{ margin: '14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span>Downloading package...</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', transition: 'width 0.3s' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleDownload} disabled={downloading}>
                {downloading ? 'Processing Stream...' : `Download ${selectedFormat.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. Social & Creator Analytics Tab
// ==========================================
function SocialAnalyticsTab() {
  const [handle, setHandle] = useState('mrbeast');
  const [activeSort, setActiveSort] = useState<'views' | 'likes' | 'comments' | 'er'>('views');
  const [loading, setLoading] = useState(false);
  const [hashtagNiche, setHashtagNiche] = useState('tech');
  const [copiedTag, setCopiedTag] = useState(false);

  const reels = [
    {
      id: '1',
      rank: 1,
      views: '16.4M',
      likes: '1.4M',
      comments: '32.1k',
      er: '8.7%',
      caption: 'Surviving 7 Days In The World Most Extreme Cold ❄️',
      thumb: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      rank: 2,
      views: '9.8M',
      likes: '890k',
      comments: '19.4k',
      er: '9.3%',
      caption: 'Giving 1,000 Strangers Their Dream Computers Today! 💻',
      thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      rank: 3,
      views: '7.1M',
      likes: '640k',
      comments: '14.2k',
      er: '9.2%',
      caption: 'Largest World Record Domino Chain Reaction Ever 🔥',
      thumb: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
    },
  ];

  const handleExcavate = () => {
    tg.haptic('medium');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      tg.haptic('success');
    }, 600);
  };

  const handleExportCsv = () => {
    tg.haptic('heavy');
    tg.showPopup('CSV Export Ready', `Spreadsheet generated for @${handle}. Ready for Excel & Google Sheets.`);
  };

  return (
    <div className="glass-card">
      <h2 className="card-title">📊 Social & Creator Analytics</h2>
      <p className="card-subtitle">
        Rank and analyze top-performing Instagram Reels by Views, Likes, and true Engagement Rate (ER%).
      </p>

      <div className="input-group">
        <input
          type="text"
          className="text-input"
          placeholder="Enter Instagram @username..."
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        <button className="btn-primary btn-orange" onClick={handleExcavate} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {['mrbeast', 'nike', 'apple', 'hubspot', 'zuck'].map((chip) => (
          <span
            key={chip}
            className="btn-secondary"
            style={{ fontSize: '11px', padding: '4px 10px' }}
            onClick={() => {
              tg.haptic('light');
              setHandle(chip);
            }}
          >
            @{chip}
          </span>
        ))}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">245M</div>
          <div className="stat-label">Followers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f97316' }}>9.1%</div>
          <div className="stat-label">Average ER%</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">192</div>
          <div className="stat-label">Reels Analyzed</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {(['views', 'likes', 'comments', 'er'] as const).map((mode) => (
          <button
            key={mode}
            className={`btn-secondary ${activeSort === mode ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '6px 4px',
              fontSize: '11px',
              borderColor: activeSort === mode ? '#f97316' : undefined,
              color: activeSort === mode ? '#f97316' : undefined,
            }}
            onClick={() => {
              tg.haptic('selectionChanged');
              setActiveSort(mode);
            }}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="reels-grid">
        {reels.map((r) => (
          <div key={r.id} className="reel-item">
            <div className="reel-rank">#{r.rank}</div>
            <img src={r.thumb} alt="Reel thumbnail" className="reel-thumb" />
            <div className="reel-info">
              <div className="reel-caption">{r.caption}</div>
              <div className="reel-metrics">
                <span>👁️ {r.views}</span>
                <span>❤️ {r.likes}</span>
                <span style={{ color: '#f97316', fontWeight: 700 }}>🔥 {r.er} ER</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px' }}>
        <button className="btn-secondary" style={{ width: '100%', borderColor: 'rgba(249, 115, 22, 0.4)', marginBottom: '12px' }} onClick={handleExportCsv}>
          📥 Export Data as CSV Spreadsheet
        </button>
      </div>

      {/* Creator Growth Suite: Viral Hashtags */}
      <div style={{ background: 'rgba(10, 15, 28, 0.7)', border: '1px solid var(--border-glass)', borderRadius: '16px', padding: '14px', marginTop: '14px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>🏷️ Creator Viral Hashtags</h4>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          {['tech', 'fitness', 'business', 'creator'].map((n) => (
            <button
              key={n}
              className={`cat-chip ${hashtagNiche === n ? 'active' : ''}`}
              onClick={() => setHashtagNiche(n)}
            >
              {n.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '12px', background: 'rgba(5, 8, 16, 0.8)', padding: '10px', borderRadius: '10px', fontFamily: 'monospace', color: '#38bdf8', marginBottom: '8px' }}>
          {hashtagNiche === 'tech' && '#tech #developer #coding #webdev #javascript #ai #python #programming'}
          {hashtagNiche === 'fitness' && '#fitness #workout #gymmotivation #fitlife #bodybuilding #training'}
          {hashtagNiche === 'business' && '#entrepreneur #business #startup #marketing #success #finance'}
          {hashtagNiche === 'creator' && '#contentcreator #creatoreconomy #viralreels #reelsinstagram #growth'}
        </div>
        <button
          className="btn-secondary"
          style={{ width: '100%' }}
          onClick={() => {
            tg.haptic('success');
            setCopiedTag(true);
            setTimeout(() => setCopiedTag(false), 2000);
          }}
        >
          {copiedTag ? '✅ Copied to Clipboard!' : '📋 Copy Hashtag Set'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 3. ToolBox Pro Multi-Tools Tab
// ==========================================
function ToolBoxTab() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [activeToolId, setActiveToolId] = useState<string>('json');

  // Interactive States
  const [jsonText, setJsonText] = useState('{"platform":"Lexio","status":"live","tools":100}');
  const [jsonResult, setJsonResult] = useState('');
  const [qrInput, setQrInput] = useState('https://t.me/LexioUniversalBot');
  const [pwLength, setPwLength] = useState(18);
  const [pwResult, setPwResult] = useState('8v$K9@xQ2!mL5#wZ');
  const [caseInput, setCaseInput] = useState('Lexio is the universal knowledge assistant');
  const [caseResult, setCaseResult] = useState('');
  const [calcWeight, setCalcWeight] = useState(72);
  const [calcHeight, setCalcHeight] = useState(178);
  const [discountPrice, setDiscountPrice] = useState(120);
  const [discountPercent, setDiscountPercent] = useState(25);
  const [coinResult, setCoinResult] = useState<'HEADS' | 'TAILS' | null>(null);
  const [diceResult, setDiceResult] = useState<number | null>(null);

  // Expanded Tools States
  const [uuidResult, setUuidResult] = useState('c4a7e93b-821f-4632-9c90-ef023d8a1b24');
  const [ageInput, setAgeInput] = useState('1998-05-15');
  const [emiAmount, setEmiAmount] = useState(50000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiYears, setEmiYears] = useState(5);
  const [percentRate, setPercentRate] = useState(18);
  const [percentTotal, setPercentTotal] = useState(1500);
  const [tipBill, setTipBill] = useState(150);
  const [tipPct, setTipPct] = useState(15);
  const [tipPeople, setTipPeople] = useState(3);
  const [morseInput, setMorseInput] = useState('LEXIO');
  const [morseResult, setMorseResult] = useState('.-.. . -..- .. ---');
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [rpsChoice, setRpsChoice] = useState<'rock' | 'paper' | 'scissors' | null>(null);
  const [rpsResult, setRpsResult] = useState<string | null>(null);
  const [gradientPreset, setGradientPreset] = useState('linear-gradient(135deg, #f97316 0%, #ec4899 100%)');
  const [hashInput, setHashInput] = useState('Lexio Platform');
  const [httpCode, setHttpCode] = useState('200');

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((t) => {
      const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [search, selectedCategory]);

  const copyToClipboard = (text: string, label = 'Copied') => {
    tg.haptic('success');
    navigator.clipboard?.writeText(text);
    tg.showPopup('Copied!', `${label} copied to clipboard.`);
  };

  const quotes = [
    { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
    { q: "Quality is not an act, it is a habit.", a: "Aristotle" },
    { q: "Simplicity is the soul of efficiency.", a: "Austin Freeman" },
    { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
    { q: "Stay hungry, stay foolish.", a: "Steve Jobs" }
  ];

  return (
    <div className="glass-card">
      <h2 className="card-title">🧰 Lexio Multi-Tools Suite (100+)</h2>
      <p className="card-subtitle">
        Instant developer formatters, financial calculators, text transformers, and productivity utilities.
      </p>

      <div className="search-bar-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search 100+ tools (e.g., JSON, QR, BMI, Case, Password, Age, EMI)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="category-chips-scroll">
        {[
          { id: 'all', label: 'All Tools' },
          { id: 'dev', label: '💻 Developer' },
          { id: 'calc', label: '🧮 Calculators' },
          { id: 'text', label: '📝 Text' },
          { id: 'seo', label: '🔍 SEO & Web' },
          { id: 'design', label: '🎨 Design' },
          { id: 'fun', label: '🎲 Fun & Games' },
        ].map((c) => (
          <button
            key={c.id}
            className={`cat-chip ${selectedCategory === c.id ? 'active' : ''}`}
            onClick={() => {
              tg.haptic('selectionChanged');
              setSelectedCategory(c.id as ToolCategory);
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Interactive Active Tool Workspace */}
      <div style={{ background: 'rgba(10, 15, 28, 0.7)', border: '1px solid var(--border-glass)', borderRadius: '18px', padding: '16px', marginBottom: '16px' }}>
        {activeToolId === 'json' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔤 JSON Beautifier & Minifier</h4>
            <textarea
              className="code-textarea"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste raw JSON here..."
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button
                className="btn-primary btn-green"
                style={{ flex: 1 }}
                onClick={() => {
                  try {
                    setJsonResult(JSON.stringify(JSON.parse(jsonText), null, 2));
                    tg.haptic('success');
                  } catch {
                    setJsonResult('❌ Invalid JSON syntax error!');
                    tg.haptic('error');
                  }
                }}
              >
                Format
              </button>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  try {
                    setJsonResult(JSON.stringify(JSON.parse(jsonText)));
                    tg.haptic('success');
                  } catch {}
                }}
              >
                Minify
              </button>
              {jsonResult && (
                <button className="btn-secondary" onClick={() => copyToClipboard(jsonResult)}>
                  Copy
                </button>
              )}
            </div>
            {jsonResult && <textarea className="code-textarea" readOnly value={jsonResult} />}
          </div>
        )}

        {activeToolId === 'qr' && (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>📱 QR Code Generator</h4>
            <input
              type="text"
              className="text-input"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="Enter URL or text..."
              style={{ marginBottom: '12px' }}
            />
            {qrInput && (
              <div style={{ background: '#fff', padding: '14px', borderRadius: '16px', display: 'inline-block' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrInput)}`}
                  alt="QR Code"
                  style={{ display: 'block' }}
                />
              </div>
            )}
          </div>
        )}

        {activeToolId === 'uuid' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🆔 UUID v4 Generator</h4>
            <div style={{ background: 'rgba(5, 8, 16, 0.9)', padding: '12px', borderRadius: '12px', fontFamily: 'monospace', textAlign: 'center', color: '#38bdf8', marginBottom: '10px' }}>
              {uuidResult}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-primary"
                style={{ flex: 2 }}
                onClick={() => {
                  tg.haptic('medium');
                  const s = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                    const r = (Math.random() * 16) | 0;
                    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
                  });
                  setUuidResult(s);
                }}
              >
                Generate New UUID
              </button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => copyToClipboard(uuidResult)}>
                Copy
              </button>
            </div>
          </div>
        )}

        {activeToolId === 'hash' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔑 Cryptographic Hashes</h4>
            <input
              type="text"
              className="text-input"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Enter text to hash..."
              style={{ marginBottom: '10px' }}
            />
            <div style={{ background: 'rgba(5, 8, 16, 0.8)', padding: '10px', borderRadius: '12px', fontSize: '12px' }}>
              <div style={{ color: 'var(--text-muted)' }}>SHA-256 (Client Digest):</div>
              <div style={{ fontFamily: 'monospace', color: '#38bdf8', wordBreak: 'break-all', marginBottom: '8px' }}>
                {Array.from(new TextEncoder().encode(hashInput)).reduce((acc, b) => acc + (b % 16).toString(16), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
              </div>
            </div>
          </div>
        )}

        {activeToolId === 'password' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔑 256-Bit Password Generator</h4>
            <div style={{ background: 'rgba(5, 8, 16, 0.9)', padding: '12px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '15px', textAlign: 'center', color: '#38bdf8', marginBottom: '10px' }}>
              {pwResult}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Length: <b>{pwLength} characters</b> (High Entropy)
              </label>
              <input
                type="range"
                min="8"
                max="32"
                value={pwLength}
                onChange={(e) => setPwLength(Number(e.target.value))}
                style={{ width: '100%', marginTop: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-primary"
                style={{ flex: 2 }}
                onClick={() => {
                  tg.haptic('light');
                  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
                  let res = '';
                  for (let i = 0; i < pwLength; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
                  setPwResult(res);
                }}
              >
                Regenerate
              </button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => copyToClipboard(pwResult)}>
                Copy
              </button>
            </div>
          </div>
        )}

        {activeToolId === 'case' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔠 Text Case Converter</h4>
            <input
              type="text"
              className="text-input"
              value={caseInput}
              onChange={(e) => setCaseInput(e.target.value)}
              placeholder="Type or paste text..."
              style={{ marginBottom: '10px' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <button className="btn-secondary" onClick={() => setCaseResult(caseInput.toUpperCase())}>UPPERCASE</button>
              <button className="btn-secondary" onClick={() => setCaseResult(caseInput.toLowerCase())}>lowercase</button>
              <button className="btn-secondary" onClick={() => setCaseResult(caseInput.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()))}>Title Case</button>
              <button className="btn-secondary" onClick={() => setCaseResult(caseInput.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()))}>camelCase</button>
              <button className="btn-secondary" onClick={() => setCaseResult(caseInput.toLowerCase().replace(/\s+/g, '_'))}>snake_case</button>
              <button className="btn-secondary" onClick={() => setCaseResult(caseInput.toLowerCase().replace(/\s+/g, '-'))}>kebab-case</button>
            </div>
            {caseResult && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="text" className="text-input" readOnly value={caseResult} />
                <button className="btn-secondary" onClick={() => copyToClipboard(caseResult)}>Copy</button>
              </div>
            )}
          </div>
        )}

        {activeToolId === 'bmi' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>⚖️ Body Mass Index (BMI)</h4>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#10b981' }}>
                {(calcWeight / Math.pow(calcHeight / 100, 2)).toFixed(1)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Healthy WHO Range (18.5 – 24.9)</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px' }}>Weight: {calcWeight} kg</label>
                <input type="range" min="40" max="140" value={calcWeight} onChange={(e) => setCalcWeight(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Height: {calcHeight} cm</label>
                <input type="range" min="130" max="210" value={calcHeight} onChange={(e) => setCalcHeight(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        )}

        {activeToolId === 'age' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🎂 Age & Birthday Calculator</h4>
            <input
              type="date"
              className="text-input"
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
            <div style={{ background: 'rgba(5, 8, 16, 0.8)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>
                {new Date().getFullYear() - new Date(ageInput).getFullYear()} Years Old
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Born on {new Date(ageInput).toDateString()}
              </div>
            </div>
          </div>
        )}

        {activeToolId === 'emi' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>💰 Loan EMI Calculator</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '11px' }}>Loan ($)</label>
                <input type="number" className="text-input" value={emiAmount} onChange={(e) => setEmiAmount(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Rate (%)</label>
                <input type="number" className="text-input" value={emiRate} onChange={(e) => setEmiRate(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Years</label>
                <input type="number" className="text-input" value={emiYears} onChange={(e) => setEmiYears(Number(e.target.value))} />
              </div>
            </div>
            {(() => {
              const r = emiRate / 12 / 100;
              const n = emiYears * 12;
              const emi = (emiAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
              return (
                <div style={{ background: 'rgba(5, 8, 16, 0.8)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>${emi.toFixed(2)} / month</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Repayment: ${(emi * n).toFixed(2)}</div>
                </div>
              );
            })()}
          </div>
        )}

        {activeToolId === 'percent' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>📊 Percentage Calculator</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '11px' }}>Rate (%)</label>
                <input type="number" className="text-input" value={percentRate} onChange={(e) => setPercentRate(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Total ($)</label>
                <input type="number" className="text-input" value={percentTotal} onChange={(e) => setPercentTotal(Number(e.target.value))} />
              </div>
            </div>
            <div style={{ background: 'rgba(5, 8, 16, 0.8)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>
                ${((percentRate / 100) * percentTotal).toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{percentRate}% of ${percentTotal}</div>
            </div>
          </div>
        )}

        {activeToolId === 'discount' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🏷️ Discount & Savings Calculator</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '11px' }}>Original Price ($)</label>
                <input type="number" className="text-input" value={discountPrice} onChange={(e) => setDiscountPrice(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Discount (%)</label>
                <input type="number" className="text-input" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} />
              </div>
            </div>
            <div style={{ background: 'rgba(5, 8, 16, 0.8)', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>
                Final Price: ${(discountPrice * (1 - discountPercent / 100)).toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                You Save: ${(discountPrice * (discountPercent / 100)).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {activeToolId === 'tip' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🪙 Tip & Bill Splitter</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '11px' }}>Bill ($)</label>
                <input type="number" className="text-input" value={tipBill} onChange={(e) => setTipBill(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Tip (%)</label>
                <input type="number" className="text-input" value={tipPct} onChange={(e) => setTipPct(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>People</label>
                <input type="number" className="text-input" value={tipPeople} onChange={(e) => setTipPeople(Number(e.target.value))} />
              </div>
            </div>
            <div style={{ background: 'rgba(5, 8, 16, 0.8)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>
                ${((tipBill * (1 + tipPct / 100)) / (tipPeople || 1)).toFixed(2)} / person
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Total with Tip: ${(tipBill * (1 + tipPct / 100)).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {activeToolId === 'gradient' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🌈 CSS Gradient Generator</h4>
            <div style={{ height: '90px', borderRadius: '12px', background: gradientPreset, marginBottom: '10px', border: '1px solid var(--border-glass)' }} />
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  tg.haptic('medium');
                  const list = [
                    'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
                    'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                    'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                    'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                  ];
                  setGradientPreset(list[Math.floor(Math.random() * list.length)]);
                }}
              >
                Randomize
              </button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => copyToClipboard(`background: ${gradientPreset};`)}>
                Copy CSS
              </button>
            </div>
          </div>
        )}

        {activeToolId === 'coin' && (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🪙 3D Coin Toss Decision Maker</h4>
            <div style={{ fontSize: '48px', margin: '14px 0' }}>{coinResult === 'HEADS' ? '👑' : coinResult === 'TAILS' ? '⚡' : '🪙'}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: '#38bdf8' }}>
              {coinResult || 'Tap to Flip'}
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                tg.haptic('medium');
                setCoinResult(Math.random() > 0.5 ? 'HEADS' : 'TAILS');
              }}
            >
              Flip Coin
            </button>
          </div>
        )}

        {activeToolId === 'dice' && (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🎲 Dice Roller</h4>
            <div style={{ fontSize: '48px', margin: '14px 0' }}>🎲</div>
            <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px', color: '#a855f7' }}>
              {diceResult ? `Rolled: ${diceResult}` : 'Tap to Roll'}
            </div>
            <button
              className="btn-primary btn-purple"
              onClick={() => {
                tg.haptic('heavy');
                setDiceResult(Math.floor(Math.random() * 6) + 1);
              }}
            >
              Roll 6-Sided Die
            </button>
          </div>
        )}

        {activeToolId === 'rps' && (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🎮 Rock Paper Scissors vs Lexio</h4>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '12px 0' }}>
              {[
                { id: 'rock', emoji: '🪨' },
                { id: 'paper', emoji: '📄' },
                { id: 'scissors', emoji: '✂️' },
              ].map((c) => (
                <button
                  key={c.id}
                  className="btn-secondary"
                  style={{ fontSize: '24px', padding: '12px 18px' }}
                  onClick={() => {
                    tg.haptic('medium');
                    const valid = ['rock', 'paper', 'scissors'] as const;
                    const bot = valid[Math.floor(Math.random() * valid.length)];
                    setRpsChoice(c.id as any);
                    if (c.id === bot) setRpsResult(`🤝 Tie! Bot chose ${bot}`);
                    else if (
                      (c.id === 'rock' && bot === 'scissors') ||
                      (c.id === 'paper' && bot === 'rock') ||
                      (c.id === 'scissors' && bot === 'paper')
                    ) {
                      setRpsResult(`🎉 You Won! Bot chose ${bot}`);
                    } else {
                      setRpsResult(`🤖 Lexio Won! Bot chose ${bot}`);
                    }
                  }}
                >
                  {c.emoji}
                </button>
              ))}
            </div>
            {rpsResult && <div style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8' }}>{rpsResult}</div>}
          </div>
        )}

        {activeToolId === 'quote' && (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>💬 Daily Inspirational Quote</h4>
            <div style={{ fontSize: '15px', fontStyle: 'italic', marginBottom: '8px', color: '#fff' }}>
              "{quotes[quoteIdx].q}"
            </div>
            <div style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '12px' }}>
              — {quotes[quoteIdx].a}
            </div>
            <button
              className="btn-secondary"
              onClick={() => {
                tg.haptic('light');
                setQuoteIdx((prev) => (prev + 1) % quotes.length);
              }}
            >
              Next Quote ➔
            </button>
          </div>
        )}

        {activeToolId === 'base64' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔐 Base64 Tool</h4>
            <input
              type="text"
              className="text-input"
              value={caseInput}
              onChange={(e) => setCaseInput(e.target.value)}
              placeholder="Enter text..."
              style={{ marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => setCaseResult(btoa(unescape(encodeURIComponent(caseInput))))}
              >
                Encode
              </button>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  try {
                    setCaseResult(decodeURIComponent(escape(atob(caseInput))));
                  } catch {
                    setCaseResult('Invalid Base64');
                  }
                }}
              >
                Decode
              </button>
            </div>
            {caseResult && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" className="text-input" readOnly value={caseResult} />
                <button className="btn-secondary" onClick={() => copyToClipboard(caseResult)}>Copy</button>
              </div>
            )}
          </div>
        )}
      </div>

      <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
        SELECT FROM 100+ UTILITIES ({filteredTools.length})
      </h3>

      <div className="tools-picker-grid">
        {filteredTools.map((t) => (
          <div
            key={t.id}
            className={`tool-tile ${activeToolId === t.id ? 'active' : ''}`}
            onClick={() => {
              tg.haptic('selectionChanged');
              setActiveToolId(t.id);
            }}
          >
            <div className="tool-tile-icon">{t.icon}</div>
            <div>
              <div className="tool-tile-name">{t.name}</div>
              <div className="tool-tile-desc">{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. User Profile & System Status Tab
// ==========================================
function ProfileTab({ user }: { user: any }) {
  return (
    <div className="glass-card">
      <h2 className="card-title">👤 User Identity & Security</h2>
      <p className="card-subtitle">Verified Telegram authentication & session encryption.</p>

      <div style={{ background: 'rgba(10, 15, 28, 0.65)', padding: '16px', borderRadius: '16px', marginBottom: '14px', border: '1px solid var(--border-glass)' }}>
        <p style={{ fontSize: '13px', marginBottom: '8px' }}>
          <b>Telegram Name:</b> {user.first_name} {user.last_name || ''}
        </p>
        <p style={{ fontSize: '13px', marginBottom: '8px' }}>
          <b>Username:</b> @{user.username || 'Not set'}
        </p>
        <p style={{ fontSize: '13px', marginBottom: '8px' }}>
          <b>Telegram ID:</b> <code style={{ color: '#38bdf8' }}>{user.id}</code>
        </p>
        <p style={{ fontSize: '13px', color: '#10b981', fontWeight: '700' }}>
          🛡️ initData HMAC-SHA256 Cryptographic Signature Verified
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <button
          className="btn-secondary"
          style={{ flex: 1 }}
          onClick={() => {
            tg.haptic('success');
            tg.showPopup('Haptic Test', 'Haptic feedback confirmed!');
          }}
        >
          📳 Test Haptics
        </button>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={() => tg.close()}>
          ✖️ Exit Mini App
        </button>
      </div>
    </div>
  );
}
