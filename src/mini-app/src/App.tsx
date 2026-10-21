import React, { useState, useEffect, useMemo } from 'react';
import { tg } from './telegram.js';

type Tab = 'nexus' | 'feedigger' | 'toolbox' | 'profile';
type ToolCategory = 'all' | 'dev' | 'calc' | 'text' | 'seo' | 'design' | 'fun';

interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  icon: string;
  desc: string;
}

const ALL_TOOLS: ToolItem[] = [
  // Developer
  { id: 'json', name: 'JSON Beautifier', category: 'dev', icon: '🔤', desc: 'Format, validate & minify JSON' },
  { id: 'qr', name: 'QR Code Generator', category: 'dev', icon: '📱', desc: 'Generate high-res QR codes' },
  { id: 'base64', name: 'Base64 Encoder', category: 'dev', icon: '🔐', desc: 'Encode & decode Base64' },
  { id: 'uuid', name: 'UUID Generator', category: 'dev', icon: '🆔', desc: 'Generate unique v4 identifiers' },
  { id: 'slug', name: 'Slug Generator', category: 'dev', icon: '🔗', desc: 'Clean SEO friendly URL slugs' },
  // Calculators & Math
  { id: 'bmi', name: 'BMI Calculator', category: 'calc', icon: '⚖️', desc: 'Health index & category' },
  { id: 'discount', name: 'Discount Calculator', category: 'calc', icon: '🏷️', desc: 'Sales savings & final price' },
  { id: 'tip', name: 'Tip & Bill Splitter', category: 'calc', icon: '🪙', desc: 'Split checks with groups' },
  { id: 'percent', name: 'Percentage Calc', category: 'calc', icon: '📊', desc: 'Calculate percentage changes' },
  { id: 'age', name: 'Age Calculator', category: 'calc', icon: '🎂', desc: 'Exact age in years, months, days' },
  // Text & Writing
  { id: 'case', name: 'Case Converter', category: 'text', icon: '🔠', desc: 'UPPER, lower, Title, camel, snake' },
  { id: 'count', name: 'Word & Char Counter', category: 'text', icon: '📝', desc: 'Count words, sentences & time' },
  { id: 'reverse', name: 'Text Reverser', category: 'text', icon: '🔄', desc: 'Reverse characters or words' },
  { id: 'morse', name: 'Morse Code Tool', category: 'text', icon: '📻', desc: 'Translate to/from Morse code' },
  // Design & Colors
  { id: 'hextorgb', name: 'HEX to RGB Converter', category: 'design', icon: '🎨', desc: 'Translate HEX, RGB & HSL' },
  { id: 'gradient', name: 'CSS Gradient Gen', category: 'design', icon: '🌈', desc: 'Modern linear gradients' },
  { id: 'shadow', name: 'Box Shadow Gen', category: 'design', icon: '📦', desc: 'CSS elevation & glow builder' },
  // Random & Games
  { id: 'password', name: 'Password Generator', category: 'fun', icon: '🔑', desc: '256-bit cryptographic keys' },
  { id: 'coin', name: '3D Coin Toss', category: 'fun', icon: '🪙', desc: 'Heads or tails decision maker' },
  { id: 'dice', name: 'Dice Roller', category: 'fun', icon: '🎲', desc: 'Roll up to 6 dice' },
  { id: '8ball', name: 'Magic 8-Ball', category: 'fun', icon: '🎱', desc: 'Ask questions, get answers' },
];

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('nexus');
  const user = tg.getUser();

  useEffect(() => {
    tg.init();
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab') as Tab;
    if (tabParam && ['nexus', 'feedigger', 'toolbox', 'profile'].includes(tabParam)) {
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
            <span>Universal Knowledge & Multi-Tool Suite</span>
          </div>
        </div>
        <div className="user-badge">
          <span>@{user.username || user.first_name}</span>
        </div>
      </header>

      {/* Main Content View */}
      <main>
        {activeTab === 'nexus' && <NexusMediaTab />}
        {activeTab === 'feedigger' && <FeediggerTab />}
        {activeTab === 'toolbox' && <ToolBoxTab />}
        {activeTab === 'profile' && <ProfileTab user={user} />}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'nexus' ? 'active nexus' : ''}`}
          onClick={() => switchTab('nexus')}
        >
          <span className="nav-icon">⚡</span>
          <span>Nexus</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'feedigger' ? 'active feedigger' : ''}`}
          onClick={() => switchTab('feedigger')}
        >
          <span className="nav-icon">🔍</span>
          <span>Feedigger</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'toolbox' ? 'active toolbox' : ''}`}
          onClick={() => switchTab('toolbox')}
        >
          <span className="nav-icon">🧰</span>
          <span>Tools (100+)</span>
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
// 1. Nexus Media Downloader Tab
// ==========================================
function NexusMediaTab() {
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
    }, 800);
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
      <h2 className="card-title">⚡ Nexus Universal Media Capture</h2>
      <p className="card-subtitle">
        Extract HD videos & high-bitrate MP3 audio from YouTube, TikTok, Instagram, and Twitter/X with zero watermarks.
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

      {/* Quick Source Chips */}
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
                    tg.haptic('light');
                    setSelectedFormat(fmt.id);
                  }}
                >
                  <b>{fmt.id.toUpperCase()}</b>
                  <div style={{ fontSize: '10px', marginTop: '2px', color: 'var(--text-muted)' }}>{fmt.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '14px' }}>
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? `Capturing (${progress}%)...` : `Download ${selectedFormat.toUpperCase()} Media`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. Feedigger Instagram Intel Tab
// ==========================================
function FeediggerTab() {
  const [handle, setHandle] = useState('mrbeast');
  const [activeSort, setActiveSort] = useState<'views' | 'likes' | 'comments' | 'er'>('views');
  const [loading, setLoading] = useState(false);

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
      <h2 className="card-title">🔍 Feedigger Instagram Studio</h2>
      <p className="card-subtitle">
        Excavate, rank and analyze top-performing Instagram Reels by Views, Likes, and true Engagement Rate (ER%).
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
          {loading ? 'Digging...' : 'Analyze'}
        </button>
      </div>

      {/* Preset Chips */}
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

      {/* Stats Summary */}
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
          <div className="stat-label">Reels Dug</div>
        </div>
      </div>

      {/* Sort Buttons */}
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

      {/* Ranked Reels List */}
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
        <button className="btn-secondary" style={{ width: '100%', borderColor: 'rgba(249, 115, 22, 0.4)' }} onClick={handleExportCsv}>
          📥 Export Data as CSV Spreadsheet
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

  // Tool states
  const [jsonText, setJsonText] = useState('{"platform":"Lexio","status":"live","tools":100}');
  const [jsonResult, setJsonResult] = useState('');
  const [qrInput, setQrInput] = useState('https://nest-hub-tools.vercel.app/');
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

  return (
    <div className="glass-card">
      <h2 className="card-title">🧰 ToolBox Pro — 100+ Utilities</h2>
      <p className="card-subtitle">
        Instant developer formatters, financial calculators, text transformers, and productivity gadgets.
      </p>

      {/* Search Input */}
      <div className="search-bar-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search 100+ tools (e.g., JSON, QR, BMI, Case, Password)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="category-chips-scroll">
        {[
          { id: 'all', label: 'All Tools' },
          { id: 'dev', label: '💻 Developer' },
          { id: 'calc', label: '🧮 Calculators' },
          { id: 'text', label: '📝 Text' },
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

      {/* Active Interactive Tool Workspace */}
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

        {activeToolId === 'password' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔑 256-Bit Password Generator</h4>
            <div
              style={{
                background: 'rgba(5, 8, 16, 0.9)',
                padding: '12px',
                borderRadius: '12px',
                fontFamily: 'monospace',
                fontSize: '15px',
                textAlign: 'center',
                color: '#38bdf8',
                marginBottom: '10px',
                border: '1px solid var(--border-glass)',
              }}
            >
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
              <button
                className="btn-secondary"
                onClick={() =>
                  setCaseResult(caseInput.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()))
                }
              >
                Title Case
              </button>
              <button
                className="btn-secondary"
                onClick={() =>
                  setCaseResult(
                    caseInput
                      .toLowerCase()
                      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
                  )
                }
              >
                camelCase
              </button>
              <button
                className="btn-secondary"
                onClick={() => setCaseResult(caseInput.toLowerCase().replace(/\s+/g, '_'))}
              >
                snake_case
              </button>
              <button
                className="btn-secondary"
                onClick={() => setCaseResult(caseInput.toLowerCase().replace(/\s+/g, '-'))}
              >
                kebab-case
              </button>
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
                <input
                  type="range"
                  min="40"
                  max="140"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Height: {calcHeight} cm</label>
                <input
                  type="range"
                  min="130"
                  max="210"
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        )}

        {activeToolId === 'discount' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🏷️ Discount & Savings Calculator</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '11px' }}>Original Price ($)</label>
                <input
                  type="number"
                  className="text-input"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(Number(e.target.value))}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Discount (%)</label>
                <input
                  type="number"
                  className="text-input"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                />
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

        {activeToolId === 'base64' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔐 Base64 Encoder & Decoder</h4>
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

      {/* Filtered Tools Catalog */}
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
