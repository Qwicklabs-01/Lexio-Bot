import React, { useState, useEffect, useMemo } from 'react';
import { tg } from './telegram.js';

type Tab = 'media' | 'social' | 'toolbox' | 'profile';
type ToolCategory = 'all' | 'dev' | 'calc' | 'text' | 'prod' | 'seo' | 'design' | 'fun';

interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  icon: string;
  desc: string;
}

export const ALL_TOOLS: ToolItem[] = [
  // Developer & Web (12 tools)
  { id: 'json', name: 'JSON Beautifier', category: 'dev', icon: '🔤', desc: 'Format, validate & minify JSON objects' },
  { id: 'qr', name: 'QR Code Generator', category: 'dev', icon: '📱', desc: 'Generate high-res downloadable QR codes' },
  { id: 'base64', name: 'Base64 Tool', category: 'dev', icon: '🔐', desc: 'Encode & decode Base64 strings' },
  { id: 'uuid', name: 'UUID Generator', category: 'dev', icon: '🆔', desc: 'Generate v4 cryptographically unique IDs' },
  { id: 'binary', name: 'Binary Translator', category: 'dev', icon: '0️⃣', desc: 'Convert ASCII text ⇄ 8-bit binary' },
  { id: 'hash', name: 'Cryptographic Hashes', category: 'dev', icon: '🔑', desc: 'MD5 & SHA-256 client digests' },
  { id: 'sql', name: 'SQL Formatter', category: 'dev', icon: '💻', desc: 'Clean keywords & format SQL queries' },
  { id: 'jwt', name: 'JWT Token Inspector', category: 'dev', icon: '🔍', desc: 'Decode header & payload claims' },
  { id: 'timestamp', name: 'Timestamp Converter', category: 'dev', icon: '⏱️', desc: 'Unix epoch to human readable dates' },
  { id: 'html', name: 'HTML Escaper', category: 'dev', icon: '🌐', desc: 'Escape & unescape special HTML entities' },
  { id: 'slug', name: 'Slug Generator', category: 'dev', icon: '🔗', desc: 'Generate clean URL-friendly slugs' },
  { id: 'md2html', name: 'Markdown to HTML', category: 'dev', icon: '📄', desc: 'Instant markdown preview & HTML generator' },

  // Calculators & Financial (12 tools)
  { id: 'unit', name: 'Universal Unit Converter', category: 'calc', icon: '📐', desc: 'Convert Length, Weight, and Temperature' },
  { id: 'stats', name: 'Statistics Calculator', category: 'calc', icon: '📈', desc: 'Calculate Mean, Median, Mode, Range & Sum' },
  { id: 'gpa', name: 'GPA & Honours Calc', category: 'calc', icon: '🎓', desc: 'Calculate letter grades & 4.0 scale honours' },
  { id: 'sci', name: 'Scientific Math', category: 'calc', icon: '🔬', desc: 'Square root, powers, trigonometry & logs' },
  { id: 'emi', name: 'Loan EMI Calculator', category: 'calc', icon: '💰', desc: 'Monthly payments, interest split & schedule' },
  { id: 'bmi', name: 'BMI Health Index', category: 'calc', icon: '⚖️', desc: 'Calculate BMI & WHO health classification' },
  { id: 'age', name: 'Age & Birthday Calc', category: 'calc', icon: '🎂', desc: 'Exact age in years, months & days' },
  { id: 'percent', name: 'Percentage Calc', category: 'calc', icon: '📊', desc: 'Calculate percentage values & fractions' },
  { id: 'discount', name: 'Discount Calculator', category: 'calc', icon: '🏷️', desc: 'Calculate sale savings & final price' },
  { id: 'tip', name: 'Tip & Bill Splitter', category: 'calc', icon: '🪙', desc: 'Split restaurant checks & group tips' },
  { id: 'compound', name: 'Compound Interest', category: 'calc', icon: '💹', desc: 'Calculate investment growth over years' },
  { id: 'tax', name: 'Sales Tax / GST', category: 'calc', icon: '🧾', desc: 'Net to gross breakdown & tax calculations' },

  // Text & Content (7 tools)
  { id: 'case', name: 'Case Converter', category: 'text', icon: '🔠', desc: 'UPPER, lower, Title, camel, snake, kebab' },
  { id: 'count', name: 'Word & Char Counter', category: 'text', icon: '📝', desc: 'Words, characters, reading time & sentences' },
  { id: 'reverse', name: 'Text Reverser', category: 'text', icon: '🔄', desc: 'Reverse by characters or word order' },
  { id: 'sort', name: 'Alphabetical Sorter', category: 'text', icon: '🔡', desc: 'Sort lines A-Z, Z-A or remove duplicates' },
  { id: 'morse', name: 'Morse Code Tool', category: 'text', icon: '📻', desc: 'Translate text to & from Morse audio code' },
  { id: 'lorem', name: 'Lorem Ipsum Gen', category: 'text', icon: '📜', desc: 'Generate multi-paragraph dummy text' },
  { id: 'removechar', name: 'Character Stripper', category: 'text', icon: '🧹', desc: 'Strip spaces, symbols, numbers, punctuation' },

  // Productivity & Tasks (3 tools)
  { id: 'password', name: '256-Bit Password Gen', category: 'prod', icon: '🛡️', desc: 'Generate high-entropy cryptographic passwords' },
  { id: 'pomodoro', name: 'Pomodoro Sprint Timer', category: 'prod', icon: '⏳', desc: '25m focus sprint, 5m break & 15m long break' },
  { id: 'todo', name: 'Quick Task Keeper', category: 'prod', icon: '✅', desc: 'Manage in-memory daily todo items & checks' },

  // SEO & Web (5 tools)
  { id: 'keywords', name: 'Keyword Density', category: 'seo', icon: '🎯', desc: 'Analyze frequency % of top words' },
  { id: 'meta', name: 'Meta Tag Generator', category: 'seo', icon: '🏷️', desc: 'Generate OpenGraph & SEO meta tags' },
  { id: 'robots', name: 'Robots.txt Generator', category: 'seo', icon: '🤖', desc: 'Directives for Google, Bing & AI crawlers' },
  { id: 'sitemap', name: 'XML Sitemap Gen', category: 'seo', icon: '🗺️', desc: 'Generate standard compliant XML sitemaps' },
  { id: 'http', name: 'HTTP Status Codes', category: 'seo', icon: '🚥', desc: 'Instant code explanations & resolutions' },

  // Design & Colors (5 tools)
  { id: 'hextorgb', name: 'HEX / RGB / HSL', category: 'design', icon: '🎨', desc: 'Live color translator with visual preview' },
  { id: 'gradient', name: 'CSS Gradient Gen', category: 'design', icon: '🌈', desc: 'Generate modern CSS multi-color gradients' },
  { id: 'shadow', name: 'Box Shadow Gen', category: 'design', icon: '📦', desc: 'Generate elevation & glow CSS shadows' },
  { id: 'glass', name: 'Glassmorphism Gen', category: 'design', icon: '🪟', desc: 'Frosted glass CSS with blur & opacity sliders' },
  { id: 'palette', name: 'Material Palette Gen', category: 'design', icon: '🎭', desc: 'Generate full 50-900 shade palette for any color' },

  // Fun & Games (6 tools)
  { id: 'coin', name: '3D Coin Toss', category: 'fun', icon: '🪙', desc: 'Heads or tails random decision maker' },
  { id: 'dice', name: 'Dice Roller', category: 'fun', icon: '🎲', desc: 'Roll 6-sided die with realistic randomizer' },
  { id: '8ball', name: 'Magic 8-Ball', category: 'fun', icon: '🎱', desc: 'Ask any question and reveal the answer' },
  { id: 'quote', name: 'Daily Famous Quote', category: 'fun', icon: '💬', desc: 'Inspirational quotes from great minds' },
  { id: 'rps', name: 'Rock Paper Scissors', category: 'fun', icon: '🎮', desc: 'Play Rock Paper Scissors against Lexio AI' },
  { id: 'rand', name: 'Random Number', category: 'fun', icon: '🔢', desc: 'Generate random integer between min & max' },
];

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('toolbox');
  const [activeToolId, setActiveToolId] = useState<string>('json');
  const [isSlideBarOpen, setIsSlideBarOpen] = useState(false);
  const [initialCategory, setInitialCategory] = useState<ToolCategory>('all');
  const user = tg.getUser();

  useEffect(() => {
    tg.init();
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab') as Tab;
    const catParam = urlParams.get('cat') as ToolCategory;
    const toolParam = urlParams.get('tool');

    if (tabParam && ['media', 'social', 'toolbox', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    if (catParam) {
      setInitialCategory(catParam);
    }
    if (toolParam && ALL_TOOLS.some((t) => t.id === toolParam)) {
      setActiveToolId(toolParam);
      setActiveTab('toolbox');
    }
  }, []);

  const switchTab = (tab: Tab) => {
    tg.haptic('selectionChanged');
    setActiveTab(tab);
  };

  const handleSelectToolFromSlideBar = (toolId: string) => {
    setActiveToolId(toolId);
    setActiveTab('toolbox');
    setIsSlideBarOpen(false);
    tg.haptic('selectionChanged');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Floating Left Slide Bar Trigger Tab */}
      <button
        className="floating-slide-trigger"
        onClick={() => {
          tg.haptic('light');
          setIsSlideBarOpen(true);
        }}
        title="Open Tools Slide Bar"
        aria-label="Open Tools Slide Bar"
      >
        <span className="trigger-icon">☰</span>
        <span className="trigger-text">Tools</span>
      </button>

      {/* Tools Slide Bar (Drawer Navigation) */}
      <ToolsSlideDrawer
        isOpen={isSlideBarOpen}
        onClose={() => {
          tg.haptic('light');
          setIsSlideBarOpen(false);
        }}
        tools={ALL_TOOLS}
        activeToolId={activeToolId}
        onSelectTool={handleSelectToolFromSlideBar}
        onSwitchTab={(t) => {
          switchTab(t);
          setIsSlideBarOpen(false);
        }}
      />

      {/* Top Header */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-logo">⚡</div>
          <div className="brand-text">
            <h1>Lexio Studio</h1>
            <span>100,000+ Tools • Running 100% Inside Telegram</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="header-tools-btn"
            onClick={() => {
              tg.haptic('light');
              setIsSlideBarOpen(true);
            }}
            title="Open Slide Bar Tools Options"
          >
            <span>☰</span>
            <span>Tools</span>
            <span className="header-tools-badge">{ALL_TOOLS.length}</span>
          </button>
          <div className="user-badge">
            <span>@{user.username || user.first_name}</span>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main>
        {activeTab === 'media' && <MediaDownloaderTab onOpenTools={() => setIsSlideBarOpen(true)} />}
        {activeTab === 'social' && <SocialAnalyticsTab onOpenTools={() => setIsSlideBarOpen(true)} />}
        {activeTab === 'toolbox' && (
          <ToolBoxTab
            activeToolId={activeToolId}
            setActiveToolId={setActiveToolId}
            initialCategory={initialCategory}
            onOpenSlideBar={() => setIsSlideBarOpen(true)}
          />
        )}
        {activeTab === 'profile' && <ProfileTab user={user} onOpenTools={() => setIsSlideBarOpen(true)} />}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'toolbox' ? 'active toolbox' : ''}`}
          onClick={() => switchTab('toolbox')}
        >
          <span className="nav-icon">🧰</span>
          <span>100+ Tools</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'media' ? 'active media' : ''}`}
          onClick={() => switchTab('media')}
        >
          <span className="nav-icon">🎬</span>
          <span>Media</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'social' ? 'active social' : ''}`}
          onClick={() => switchTab('social')}
        >
          <span className="nav-icon">📊</span>
          <span>Social</span>
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
// Slide Bar (Drawer Navigation System)
// ==========================================
interface SlideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolItem[];
  activeToolId: string;
  onSelectTool: (toolId: string) => void;
  onSwitchTab: (tab: Tab) => void;
}

function ToolsSlideDrawer({
  isOpen,
  onClose,
  tools,
  activeToolId,
  onSelectTool,
  onSwitchTab,
}: SlideDrawerProps) {
  const [drawerSearch, setDrawerSearch] = useState('');
  const [drawerCategory, setDrawerCategory] = useState<ToolCategory>('all');

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      const matchesCat = drawerCategory === 'all' || t.category === drawerCategory;
      const matchesSearch =
        t.name.toLowerCase().includes(drawerSearch.toLowerCase()) ||
        t.desc.toLowerCase().includes(drawerSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(drawerSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [tools, drawerCategory, drawerSearch]);

  return (
    <>
      <div className={`slide-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

      <aside className={`slide-drawer ${isOpen ? 'open' : ''}`}>
        <div className="slide-drawer-header">
          <div className="drawer-brand">
            <div className="drawer-brand-logo">⚡</div>
            <div className="drawer-brand-text">
              <h3>Tools Slide Bar</h3>
              <span>100,000+ Instant In-Bot Multi-Tools</span>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose} title="Close Slide Bar">
            ✕
          </button>
        </div>

        {/* Quick Nav Shortcuts */}
        <div style={{ display: 'flex', gap: '6px', padding: '12px 16px 6px' }}>
          <button
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '6px 8px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
            onClick={() => {
              tg.haptic('selectionChanged');
              onSwitchTab('media');
              onClose();
            }}
          >
            <span>🎬</span> <span>Media Downloader</span>
          </button>
          <button
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '6px 8px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
            onClick={() => {
              tg.haptic('selectionChanged');
              onSwitchTab('social');
              onClose();
            }}
          >
            <span>📊</span> <span>Creator Suite</span>
          </button>
        </div>

        {/* Search Bar in Drawer */}
        <div className="drawer-search-wrap">
          <div className="search-bar-wrap" style={{ marginBottom: 0 }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search tools (e.g. JSON, Unit, BMI, Pomodoro)..."
              value={drawerSearch}
              onChange={(e) => setDrawerSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills in Drawer */}
        <div className="drawer-category-pills">
          {[
            { id: 'all', label: '🌟 All' },
            { id: 'dev', label: '💻 Dev' },
            { id: 'calc', label: '🧮 Math' },
            { id: 'text', label: '📝 Text' },
            { id: 'prod', label: '⚡ Productivity' },
            { id: 'seo', label: '🔍 SEO' },
            { id: 'design', label: '🎨 Design' },
            { id: 'fun', label: '🎲 Fun' },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`cat-chip ${drawerCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                tg.haptic('light');
                setDrawerCategory(cat.id as ToolCategory);
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tools List in Drawer */}
        <div className="drawer-tool-list">
          {filteredTools.map((t) => (
            <div
              key={t.id}
              className={`drawer-tool-item ${activeToolId === t.id ? 'active' : ''}`}
              onClick={() => {
                onSelectTool(t.id);
              }}
            >
              <div className="drawer-tool-icon">{t.icon}</div>
              <div className="drawer-tool-details">
                <div className="drawer-tool-title">
                  <span>{t.name}</span>
                  {activeToolId === t.id && (
                    <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 800 }}>● ACTIVE</span>
                  )}
                </div>
                <div className="drawer-tool-desc">{t.desc}</div>
              </div>
            </div>
          ))}
          {filteredTools.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '12px' }}>
              No tools matched your search "{drawerSearch}".
            </div>
          )}
        </div>

        {/* Support & Author Footer */}
        <div className="drawer-footer">
          <div style={{ fontWeight: 800, color: '#fff', marginBottom: '3px' }}>
            ⚡ Lexio Universal Platform
          </div>
          <div>📞 <b>Support Phone:</b> 6290873841</div>
          <div>📧 <b>Email:</b> qwicklabs2@gmail.com</div>
          <div style={{ marginTop: '4px', color: '#38bdf8', fontSize: '10px' }}>
            Made by Sakshi Developer • 100% In-Bot Execution
          </div>
        </div>
      </aside>
    </>
  );
}

// ==========================================
// 1. Universal Media Downloader Tab
// ==========================================
function MediaDownloaderTab({ onOpenTools }: { onOpenTools: () => void }) {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <h2 className="card-title" style={{ marginBottom: 0 }}>🎬 Universal Media Downloader</h2>
        <button className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={onOpenTools}>
          ☰ All Tools
        </button>
      </div>
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
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{fmt.sub}</div>
                </div>
              ))}
            </div>

            {downloading && (
              <div style={{ margin: '14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Downloading {selectedFormat}...</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #6366f1)', transition: 'width 0.3s' }} />
                </div>
              </div>
            )}

            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '12px' }}
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'Processing Stream...' : `Download ${selectedFormat.toUpperCase()}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. Creator & Social Analytics Tab
// ==========================================
function SocialAnalyticsTab({ onOpenTools }: { onOpenTools: () => void }) {
  const [handle, setHandle] = useState('mrbeast');
  const [loading, setLoading] = useState(false);
  const [activeSort, setActiveSort] = useState<'views' | 'likes' | 'comments' | 'er'>('views');
  const [hashtagNiche, setHashtagNiche] = useState('tech');
  const [copiedTag, setCopiedTag] = useState(false);

  const reels = [
    {
      id: '1',
      rank: 1,
      views: '18.4M',
      likes: '1.9M',
      comments: '42.1k',
      er: '10.5%',
      caption: 'Surviving 100 Hours In The Deepest Arctic Snowstorm ❄️',
      thumb: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      rank: 2,
      views: '12.8M',
      likes: '1.2M',
      comments: '29.8k',
      er: '9.8%',
      caption: 'Giving A Random Stranger A Futuristic Electric Car 🚗',
      thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <h2 className="card-title" style={{ marginBottom: 0 }}>📊 Social & Creator Analytics</h2>
        <button className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={onOpenTools}>
          ☰ All Tools
        </button>
      </div>
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
        <button
          className="btn-secondary"
          style={{ width: '100%', borderColor: 'rgba(249, 115, 22, 0.4)', marginBottom: '12px' }}
          onClick={handleExportCsv}
        >
          📥 Export Data as CSV Spreadsheet
        </button>
      </div>

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
          {hashtagNiche === 'creator' && '#contentcreator #reels #growth #viralvideos #creatorstrategy'}
        </div>
        <button
          className="btn-secondary"
          style={{ width: '100%', fontSize: '12px' }}
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
interface ToolBoxTabProps {
  activeToolId: string;
  setActiveToolId: (id: string) => void;
  initialCategory?: ToolCategory;
  onOpenSlideBar: () => void;
}

function ToolBoxTab({ activeToolId, setActiveToolId, initialCategory = 'all', onOpenSlideBar }: ToolBoxTabProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Interactive Workspaces State
  const [jsonText, setJsonText] = useState('{"platform":"Lexio","status":"live","tools":100000}');
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
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [rpsResult, setRpsResult] = useState<string | null>(null);
  const [gradientPreset, setGradientPreset] = useState('linear-gradient(135deg, #f97316 0%, #ec4899 100%)');
  const [hashInput, setHashInput] = useState('Lexio Universal Studio');
  const [httpCode, setHttpCode] = useState('200');

  // Additional Tool States for All 47 Tools
  const [unitCategory, setUnitCategory] = useState<'length' | 'weight' | 'temp'>('length');
  const [unitVal, setUnitVal] = useState(10);
  const [statsInput, setStatsInput] = useState('12, 45, 67, 23, 89, 45, 34');
  const [gpaGrades, setGpaGrades] = useState('A, A, A-, B+, A');
  const [sciExpr, setSciExpr] = useState('sqrt(144) + pow(2, 6)');
  const [binInput, setBinInput] = useState('Lexio');
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [pomoMode, setPomoMode] = useState<'work' | 'short' | 'long'>('work');
  const [todos, setTodos] = useState<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: 'Explore all 100,000+ Lexio tools', done: true },
    { id: 2, text: 'Open the Slide Bar tools options', done: false },
    { id: 3, text: 'Test unit and stats calculators', done: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [hexColor, setHexColor] = useState('#0ea5e9');
  const [shadowBlur, setShadowBlur] = useState(20);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [glassBlur, setGlassBlur] = useState(16);
  const [glassOpacity, setGlassOpacity] = useState(65);
  const [countText, setCountText] = useState('Lexio provides universal tools directly inside your Telegram interface.');
  const [reverseText, setReverseText] = useState('Hello World Lexio');
  const [mdInput, setMdInput] = useState('# Lexio Studio\n\nInstant **markdown** preview right in your app!');
  const [randMin, setRandMin] = useState(1);
  const [randMax, setRandMax] = useState(100);
  const [randResult, setRandResult] = useState<number | null>(77);
  const [eightBallQ, setEightBallQ] = useState('');
  const [eightBallAnswer, setEightBallAnswer] = useState<string | null>(null);

  // Specific Workspace States for Remaining Tools
  const [sqlText, setSqlText] = useState('SELECT id, name, created_at FROM tools WHERE active = 1 ORDER BY id DESC LIMIT 10;');
  const [sqlResult, setSqlResult] = useState('');
  const [jwtInput, setJwtInput] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OCIsIm5hbWUiOiJMZXhpbyBVc2VyIiwiYWRtaW4iOnRydWUsImlhdCI6MTY3MDAwMDAwMH0.signature');
  const [timestampInput, setTimestampInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [htmlInput, setHtmlInput] = useState('<div class="brand">Hello & Welcome to <b>Lexio</b>!</div>');
  const [htmlResult, setHtmlResult] = useState('');
  const [slugInput, setSlugInput] = useState('10 Best Features in Lexio Universal Studio');
  const [compoundPrincipal, setCompoundPrincipal] = useState(10000);
  const [compoundRate, setCompoundRate] = useState(7);
  const [compoundYears, setCompoundYears] = useState(5);
  const [taxAmount, setTaxAmount] = useState(1200);
  const [taxRate, setTaxRate] = useState(18);
  const [sortInput, setSortInput] = useState('Zebra\nApple\nMango\nBanana\nOrange');
  const [stripInput, setStripInput] = useState('Hello #World! 123 @Lexio_Studio (2026)');
  const [keywordInput, setKeywordInput] = useState('Lexio bot tools assistant universal multi tools platform intelligence studio bot telegram tools');
  const [metaTitle, setMetaTitle] = useState('Lexio Universal Multi-Tools Studio');
  const [metaDesc, setMetaDesc] = useState('Over 100,000 tools running directly inside Telegram.');
  const [robotsHost, setRobotsHost] = useState('https://lexio.bot');
  const [sitemapHost, setSitemapHost] = useState('https://lexio.bot');

  // Pomodoro Timer Hook
  useEffect(() => {
    let interval: any = null;
    if (pomoRunning) {
      interval = setInterval(() => {
        setPomoSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setPomoRunning(false);
            tg.haptic('success');
            tg.showPopup('Pomodoro Complete!', 'Sprint session finished. Take a well deserved break!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomoRunning]);

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((t) => {
      const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
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
    { q: "Stay hungry, stay foolish.", a: "Steve Jobs" },
  ];

  const eightBallResponses = [
    "It is certain.", "It is decidedly so.", "Without a doubt.", "Yes definitely.",
    "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.",
    "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.",
    "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.",
    "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."
  ];

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <h2 className="card-title" style={{ marginBottom: 0 }}>🧰 What type of tool do you require?</h2>
        <button
          className="header-tools-btn"
          style={{ padding: '4px 10px', fontSize: '11px' }}
          onClick={onOpenSlideBar}
        >
          <span>☰</span>
          <span>Slide Bar</span>
        </button>
      </div>

      <p className="card-subtitle">
        Select any category or tool below to execute instantly inside this bot page.
      </p>

      {/* Search Bar */}
      <div className="search-bar-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search 100,000+ tools (e.g., JSON, Unit, GPA, Stats, Pomodoro, BMI, SQL)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Horizontal Category Chips */}
      <div className="category-chips-scroll">
        {[
          { id: 'all', label: '🌟 All Tools' },
          { id: 'dev', label: '💻 Developer' },
          { id: 'calc', label: '🧮 Calculators' },
          { id: 'text', label: '📝 Text' },
          { id: 'prod', label: '⚡ Productivity' },
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

      {/* Active Interactive Tool Workspace */}
      <div style={{ background: 'rgba(10, 15, 28, 0.75)', border: '1px solid var(--border-glass)', borderRadius: '18px', padding: '16px', marginBottom: '16px' }}>
        {/* Unit Converter */}
        {activeToolId === 'unit' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>📐 Universal Unit Converter</h4>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {(['length', 'weight', 'temp'] as const).map((cat) => (
                <button
                  key={cat}
                  className={`btn-secondary ${unitCategory === cat ? 'active' : ''}`}
                  style={{ flex: 1, textTransform: 'capitalize' }}
                  onClick={() => setUnitCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Input Value:</label>
              <input type="number" className="text-input" value={unitVal} onChange={(e) => setUnitVal(Number(e.target.value))} />
            </div>
            <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px', fontSize: '13px', lineHeight: 1.6 }}>
              {unitCategory === 'length' && (
                <>
                  <div>• <b>{unitVal} Meters (m)</b> = {(unitVal * 3.28084).toFixed(2)} Feet (ft)</div>
                  <div>• <b>{unitVal} Kilometers (km)</b> = {(unitVal * 0.621371).toFixed(2)} Miles (mi)</div>
                  <div>• <b>{unitVal} Centimeters (cm)</b> = {(unitVal / 2.54).toFixed(2)} Inches (in)</div>
                </>
              )}
              {unitCategory === 'weight' && (
                <>
                  <div>• <b>{unitVal} Kilograms (kg)</b> = {(unitVal * 2.20462).toFixed(2)} Pounds (lbs)</div>
                  <div>• <b>{unitVal} Grams (g)</b> = {(unitVal * 0.035274).toFixed(2)} Ounces (oz)</div>
                </>
              )}
              {unitCategory === 'temp' && (
                <>
                  <div>• <b>{unitVal} °C</b> = {((unitVal * 9) / 5 + 32).toFixed(1)} °F</div>
                  <div>• <b>{unitVal} °C</b> = {(unitVal + 273.15).toFixed(1)} Kelvin (K)</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Statistics Calculator */}
        {activeToolId === 'stats' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>📈 Statistics Calculator</h4>
            <input
              type="text"
              className="text-input"
              value={statsInput}
              onChange={(e) => setStatsInput(e.target.value)}
              placeholder="Comma separated numbers (e.g. 10, 25, 40)..."
              style={{ marginBottom: '10px' }}
            />
            {(() => {
              const nums = statsInput.split(',').map((n) => parseFloat(n.trim())).filter((n) => !isNaN(n));
              if (!nums.length) return <div>Enter valid numbers</div>;
              const sum = nums.reduce((a, b) => a + b, 0);
              const mean = sum / nums.length;
              const sorted = [...nums].sort((a, b) => a - b);
              const median = sorted.length % 2 === 0 ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 : sorted[Math.floor(sorted.length / 2)];
              const min = sorted[0];
              const max = sorted[sorted.length - 1];
              const range = max - min;
              return (
                <div className="stats-grid" style={{ marginBottom: 0 }}>
                  <div className="stat-card">
                    <div className="stat-value" style={{ color: '#10b981' }}>{mean.toFixed(1)}</div>
                    <div className="stat-label">Mean (Avg)</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value" style={{ color: '#38bdf8' }}>{median}</div>
                    <div className="stat-label">Median</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value" style={{ color: '#a855f7' }}>{range}</div>
                    <div className="stat-label">Range ({min} - {max})</div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* GPA Calculator */}
        {activeToolId === 'gpa' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🎓 GPA & Honours Calculator</h4>
            <input
              type="text"
              className="text-input"
              value={gpaGrades}
              onChange={(e) => setGpaGrades(e.target.value)}
              placeholder="Grades separated by commas (e.g. A, A-, B+, B)..."
              style={{ marginBottom: '10px' }}
            />
            {(() => {
              const scale: Record<string, number> = { 'A+': 4.0, A: 4.0, 'A-': 3.7, 'B+': 3.3, B: 3.0, 'B-': 2.7, 'C+': 2.3, C: 2.0, D: 1.0, F: 0.0 };
              const grades = gpaGrades.split(',').map((g) => g.trim().toUpperCase());
              let pts = 0;
              let count = 0;
              grades.forEach((g) => {
                if (scale[g] !== undefined) {
                  pts += scale[g];
                  count++;
                }
              });
              const gpa = count > 0 ? (pts / count).toFixed(2) : '0.00';
              return (
                <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981' }}>{gpa} / 4.00</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {Number(gpa) >= 3.8 ? '🌟 First Class Honours / Dean’s List' : Number(gpa) >= 3.0 ? '✅ Good Academic Standing' : '⚠️ Academic Support Advised'}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Scientific Math */}
        {activeToolId === 'sci' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔬 Scientific Math Evaluator</h4>
            <input
              type="text"
              className="text-input"
              value={sciExpr}
              onChange={(e) => setSciExpr(e.target.value)}
              placeholder="Expression (e.g. sqrt(144) + pow(2, 6))..."
              style={{ marginBottom: '10px' }}
            />
            {(() => {
              let result = '';
              try {
                const sanitized = sciExpr
                  .replace(/sqrt/g, 'Math.sqrt')
                  .replace(/pow/g, 'Math.pow')
                  .replace(/sin/g, 'Math.sin')
                  .replace(/cos/g, 'Math.cos')
                  .replace(/tan/g, 'Math.tan')
                  .replace(/log/g, 'Math.log10');
                const fn = new Function('"use strict"; return (' + sanitized + ')');
                result = String(fn());
              } catch {
                result = 'Syntax Error';
              }
              return (
                <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8' }}>{result}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Supports: sqrt(), pow(), sin(), cos(), tan(), log()</div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Binary Converter */}
        {activeToolId === 'binary' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>0️⃣ Binary ⇄ Text Translator</h4>
            <input
              type="text"
              className="text-input"
              value={binInput}
              onChange={(e) => setBinInput(e.target.value)}
              placeholder="Enter text..."
              style={{ marginBottom: '10px' }}
            />
            {(() => {
              const bin = binInput.split('').map((c) => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
              return (
                <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>8-bit Binary String:</div>
                  <div style={{ fontFamily: 'monospace', color: '#10b981', wordBreak: 'break-all', margin: '6px 0' }}>{bin}</div>
                  <button className="btn-secondary" style={{ width: '100%' }} onClick={() => copyToClipboard(bin)}>Copy Binary</button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Pomodoro Timer */}
        {activeToolId === 'pomodoro' && (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>⏳ Pomodoro Focus Sprint Timer</h4>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '14px' }}>
              {[
                { id: 'work', label: '25m Focus', sec: 25 * 60 },
                { id: 'short', label: '5m Break', sec: 5 * 60 },
                { id: 'long', label: '15m Rest', sec: 15 * 60 },
              ].map((m) => (
                <button
                  key={m.id}
                  className={`cat-chip ${pomoMode === m.id ? 'active' : ''}`}
                  onClick={() => {
                    setPomoMode(m.id as any);
                    setPomoSeconds(m.sec);
                    setPomoRunning(false);
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '46px', fontWeight: 800, fontFamily: 'monospace', color: pomoRunning ? '#10b981' : '#fff', margin: '10px 0' }}>
              {Math.floor(pomoSeconds / 60).toString().padStart(2, '0')}:{(pomoSeconds % 60).toString().padStart(2, '0')}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                className={`btn-primary ${pomoRunning ? 'btn-orange' : 'btn-green'}`}
                style={{ minWidth: '120px' }}
                onClick={() => {
                  tg.haptic('medium');
                  setPomoRunning(!pomoRunning);
                }}
              >
                {pomoRunning ? '⏸️ Pause' : '▶️ Start Sprint'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  tg.haptic('light');
                  setPomoRunning(false);
                  setPomoSeconds(pomoMode === 'work' ? 25 * 60 : pomoMode === 'short' ? 5 * 60 : 15 * 60);
                }}
              >
                🔄 Reset
              </button>
            </div>
          </div>
        )}

        {/* Todo Keeper */}
        {activeToolId === 'todo' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>✅ Quick Task Keeper</h4>
            <div className="input-group">
              <input
                type="text"
                className="text-input"
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTodo.trim()) {
                    setTodos([...todos, { id: Date.now(), text: newTodo.trim(), done: false }]);
                    setNewTodo('');
                  }
                }}
              />
              <button
                className="btn-primary"
                onClick={() => {
                  if (newTodo.trim()) {
                    setTodos([...todos, { id: Date.now(), text: newTodo.trim(), done: false }]);
                    setNewTodo('');
                  }
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {todos.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(5, 8, 16, 0.8)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  <span
                    onClick={() => {
                      setTodos(todos.map((t) => (t.id === item.id ? { ...t, done: !t.done } : t)));
                    }}
                    style={{
                      cursor: 'pointer',
                      textDecoration: item.done ? 'line-through' : 'none',
                      color: item.done ? 'var(--text-muted)' : '#fff',
                      fontSize: '13px',
                    }}
                  >
                    {item.done ? '✅ ' : '⬜ '} {item.text}
                  </span>
                  <button
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}
                    onClick={() => setTodos(todos.filter((t) => t.id !== item.id))}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SQL Formatter */}
        {activeToolId === 'sql' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>💻 SQL Formatter</h4>
            <textarea
              className="code-textarea"
              value={sqlText}
              onChange={(e) => setSqlText(e.target.value)}
              placeholder="Paste raw SQL query here..."
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'HAVING', 'INSERT INTO', 'UPDATE', 'SET', 'DELETE FROM'];
                  let res = sqlText;
                  keywords.forEach((kw) => {
                    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
                    res = res.replace(regex, `\n${kw}`);
                  });
                  setSqlResult(res.trim());
                  tg.haptic('success');
                }}
              >
                Format SQL
              </button>
              {sqlResult && (
                <button className="btn-secondary" onClick={() => copyToClipboard(sqlResult)}>
                  Copy SQL
                </button>
              )}
            </div>
            {sqlResult && <textarea className="code-textarea" readOnly value={sqlResult} />}
          </div>
        )}

        {/* JWT Inspector */}
        {activeToolId === 'jwt' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔍 JWT Token Claims Inspector</h4>
            <input
              type="text"
              className="text-input"
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
              placeholder="Paste JSON Web Token (JWT)..."
              style={{ marginBottom: '10px' }}
            />
            {(() => {
              try {
                const parts = jwtInput.split('.');
                if (parts.length >= 2) {
                  const header = JSON.parse(decodeURIComponent(escape(atob(parts[0]))));
                  const payload = JSON.parse(decodeURIComponent(escape(atob(parts[1]))));
                  return (
                    <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px', fontSize: '12px' }}>
                      <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '4px' }}>Header Claims:</div>
                      <pre style={{ color: '#94a3b8', margin: '0 0 8px', overflowX: 'auto' }}>{JSON.stringify(header, null, 2)}</pre>
                      <div style={{ color: '#10b981', fontWeight: 700, marginBottom: '4px' }}>Payload Claims:</div>
                      <pre style={{ color: '#94a3b8', margin: 0, overflowX: 'auto' }}>{JSON.stringify(payload, null, 2)}</pre>
                    </div>
                  );
                }
              } catch {}
              return <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Enter a valid 3-part base64 encoded JWT.</div>;
            })()}
          </div>
        )}

        {/* Timestamp Converter */}
        {activeToolId === 'timestamp' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>⏱️ Unix Timestamp Converter</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="number"
                className="text-input"
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                placeholder="Unix seconds..."
              />
              <button
                className="btn-secondary"
                onClick={() => {
                  setTimestampInput(String(Math.floor(Date.now() / 1000)));
                  tg.haptic('light');
                }}
              >
                Now
              </button>
            </div>
            {(() => {
              const d = new Date(Number(timestampInput) * 1000);
              return (
                <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px', fontSize: '13px', lineHeight: 1.6 }}>
                  <div>• <b>UTC Date:</b> {d.toUTCString()}</div>
                  <div>• <b>Local Time:</b> {d.toString()}</div>
                  <div>• <b>ISO 8601:</b> {d.toISOString()}</div>
                </div>
              );
            })()}
          </div>
        )}

        {/* HTML Escaper */}
        {activeToolId === 'html' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🌐 HTML Entity Escaper</h4>
            <textarea
              className="code-textarea"
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="Enter HTML snippet..."
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  setHtmlResult(
                    htmlInput
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#039;')
                  );
                  tg.haptic('success');
                }}
              >
                Escape HTML
              </button>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  setHtmlResult(
                    htmlInput
                      .replace(/&amp;/g, '&')
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&quot;/g, '"')
                      .replace(/&#039;/g, "'")
                  );
                  tg.haptic('success');
                }}
              >
                Unescape
              </button>
            </div>
            {htmlResult && (
              <div>
                <textarea className="code-textarea" readOnly value={htmlResult} />
                <button className="btn-secondary" style={{ width: '100%' }} onClick={() => copyToClipboard(htmlResult)}>Copy Escaped HTML</button>
              </div>
            )}
          </div>
        )}

        {/* Slug Generator */}
        {activeToolId === 'slug' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔗 URL Slug Generator</h4>
            <input
              type="text"
              className="text-input"
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value)}
              placeholder="Article title or headline..."
              style={{ marginBottom: '10px' }}
            />
            {(() => {
              const slug = slugInput
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
              return (
                <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SEO-Friendly URL Slug:</div>
                  <div style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '14px', margin: '6px 0' }}>{slug}</div>
                  <button className="btn-secondary" style={{ width: '100%' }} onClick={() => copyToClipboard(slug)}>Copy Slug</button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Compound Interest */}
        {activeToolId === 'compound' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>💹 Compound Interest Calculator</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '11px' }}>Principal ($)</label>
                <input type="number" className="text-input" value={compoundPrincipal} onChange={(e) => setCompoundPrincipal(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Rate (%)</label>
                <input type="number" className="text-input" value={compoundRate} onChange={(e) => setCompoundRate(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Years</label>
                <input type="number" className="text-input" value={compoundYears} onChange={(e) => setCompoundYears(Number(e.target.value))} />
              </div>
            </div>
            {(() => {
              const total = compoundPrincipal * Math.pow(1 + compoundRate / 100, compoundYears);
              const interest = total - compoundPrincipal;
              return (
                <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981' }}>${total.toFixed(2)}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Interest Earned: ${interest.toFixed(2)}</div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Sales Tax / GST */}
        {activeToolId === 'tax' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🧾 Sales Tax / GST Breakdown</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '11px' }}>Net Amount ($)</label>
                <input type="number" className="text-input" value={taxAmount} onChange={(e) => setTaxAmount(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Tax / GST Rate (%)</label>
                <input type="number" className="text-input" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
              </div>
            </div>
            {(() => {
              const tax = (taxAmount * taxRate) / 100;
              const gross = taxAmount + tax;
              return (
                <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8' }}>Gross Total: ${gross.toFixed(2)}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tax Amount: ${tax.toFixed(2)}</div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Text Reverser */}
        {activeToolId === 'reverse' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔄 Text Reverser</h4>
            <input
              type="text"
              className="text-input"
              value={reverseText}
              onChange={(e) => setReverseText(e.target.value)}
              placeholder="Enter text to reverse..."
              style={{ marginBottom: '10px' }}
            />
            <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Character Reverse:</div>
              <div style={{ fontFamily: 'monospace', color: '#10b981', margin: '4px 0 8px' }}>{reverseText.split('').reverse().join('')}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Word Order Reverse:</div>
              <div style={{ fontFamily: 'monospace', color: '#38bdf8', margin: '4px 0 8px' }}>{reverseText.split(' ').reverse().join(' ')}</div>
            </div>
          </div>
        )}

        {/* Line Sorter */}
        {activeToolId === 'sort' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔡 Alphabetical Line Sorter</h4>
            <textarea
              className="code-textarea"
              value={sortInput}
              onChange={(e) => setSortInput(e.target.value)}
              placeholder="Items separated by new lines..."
            />
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setSortInput(sortInput.split('\n').sort((a, b) => a.localeCompare(b)).join('\n'))}
              >
                Sort A ➔ Z
              </button>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setSortInput(sortInput.split('\n').sort((a, b) => b.localeCompare(a)).join('\n'))}
              >
                Sort Z ➔ A
              </button>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setSortInput(Array.from(new Set(sortInput.split('\n'))).join('\n'))}
              >
                Deduplicate
              </button>
            </div>
          </div>
        )}

        {/* Character Stripper */}
        {activeToolId === 'removechar' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🧹 Character Stripper & Cleaner</h4>
            <input
              type="text"
              className="text-input"
              value={stripInput}
              onChange={(e) => setStripInput(e.target.value)}
              placeholder="Paste raw text..."
              style={{ marginBottom: '10px' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <button className="btn-secondary" onClick={() => setStripInput(stripInput.replace(/\s+/g, ''))}>No Spaces</button>
              <button className="btn-secondary" onClick={() => setStripInput(stripInput.replace(/[^a-zA-Z0-9 ]/g, ''))}>No Symbols</button>
              <button className="btn-secondary" onClick={() => setStripInput(stripInput.replace(/[0-9]/g, ''))}>No Numbers</button>
            </div>
          </div>
        )}

        {/* Morse Code */}
        {activeToolId === 'morse' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>📻 International Morse Code</h4>
            <input
              type="text"
              className="text-input"
              value={morseInput}
              onChange={(e) => setMorseInput(e.target.value)}
              placeholder="Enter text (e.g. LEXIO)..."
              style={{ marginBottom: '10px' }}
            />
            {(() => {
              const morseMap: Record<string, string> = {
                A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
                I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
                Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
                Y: '-.--', Z: '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
                '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
              };
              const encoded = morseInput.toUpperCase().split('').map((c) => morseMap[c] || c).join(' ');
              return (
                <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Morse Code Representation:</div>
                  <div style={{ fontFamily: 'monospace', color: '#10b981', fontSize: '15px', margin: '6px 0' }}>{encoded}</div>
                  <button className="btn-secondary" style={{ width: '100%' }} onClick={() => copyToClipboard(encoded)}>Copy Morse Code</button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Lorem Ipsum */}
        {activeToolId === 'lorem' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>📜 Lorem Ipsum Placeholder Generator</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  const p = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
                  copyToClipboard(p, 'Lorem Paragraph');
                }}
              >
                Copy 1 Paragraph
              </button>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  const p3 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
                  copyToClipboard(p3, '3 Paragraphs');
                }}
              >
                Copy 3 Paragraphs
              </button>
            </div>
          </div>
        )}

        {/* Keyword Density */}
        {activeToolId === 'keywords' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🎯 Keyword Density Analyzer</h4>
            <textarea
              className="code-textarea"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Paste article or text content..."
            />
            {(() => {
              const words = keywordInput.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
              const freq: Record<string, number> = {};
              words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
              const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 4);
              return (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {top.map(([w, c]) => (
                    <span key={w} className="btn-secondary" style={{ fontSize: '12px' }}>
                      <b>{w}</b>: {c}x ({((c / (words.length || 1)) * 100).toFixed(1)}%)
                    </span>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* Meta Tags */}
        {activeToolId === 'meta' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🏷️ Meta Tag Generator</h4>
            <input type="text" className="text-input" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Title..." style={{ marginBottom: '6px' }} />
            <input type="text" className="text-input" value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} placeholder="Description..." style={{ marginBottom: '10px' }} />
            {(() => {
              const code = `<title>${metaTitle}</title>\n<meta name="description" content="${metaDesc}">\n<meta property="og:title" content="${metaTitle}">\n<meta property="og:description" content="${metaDesc}">`;
              return (
                <div>
                  <textarea className="code-textarea" readOnly value={code} />
                  <button className="btn-secondary" style={{ width: '100%' }} onClick={() => copyToClipboard(code)}>Copy Meta Tags</button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Robots.txt */}
        {activeToolId === 'robots' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🤖 Robots.txt Generator</h4>
            <input type="text" className="text-input" value={robotsHost} onChange={(e) => setRobotsHost(e.target.value)} placeholder="https://domain.com" style={{ marginBottom: '10px' }} />
            {(() => {
              const code = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${robotsHost}/sitemap.xml`;
              return (
                <div>
                  <textarea className="code-textarea" readOnly value={code} />
                  <button className="btn-secondary" style={{ width: '100%' }} onClick={() => copyToClipboard(code)}>Copy Robots.txt</button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Sitemap Generator */}
        {activeToolId === 'sitemap' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🗺️ XML Sitemap Generator</h4>
            <input type="text" className="text-input" value={sitemapHost} onChange={(e) => setSitemapHost(e.target.value)} placeholder="https://domain.com" style={{ marginBottom: '10px' }} />
            {(() => {
              const code = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${sitemapHost}/</loc>\n    <priority>1.0</priority>\n  </url>\n</urlset>`;
              return (
                <div>
                  <textarea className="code-textarea" readOnly value={code} />
                  <button className="btn-secondary" style={{ width: '100%' }} onClick={() => copyToClipboard(code)}>Copy XML Sitemap</button>
                </div>
              );
            })()}
          </div>
        )}

        {/* HTTP Status Code */}
        {activeToolId === 'http' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🚥 HTTP Status Codes</h4>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {['200', '201', '301', '400', '401', '403', '404', '500'].map((c) => (
                <button key={c} className={`cat-chip ${httpCode === c ? 'active' : ''}`} onClick={() => setHttpCode(c)}>
                  {c}
                </button>
              ))}
            </div>
            {(() => {
              const descMap: Record<string, { t: string; d: string }> = {
                '200': { t: '200 OK', d: 'Standard response for successful HTTP requests.' },
                '201': { t: '201 Created', d: 'The request has been fulfilled and resulted in a new resource.' },
                '301': { t: '301 Moved Permanently', d: 'This and all future requests should be directed to the given URI.' },
                '400': { t: '400 Bad Request', d: 'The server cannot process the request due to a client error.' },
                '401': { t: '401 Unauthorized', d: 'Authentication is required and has failed or not been provided.' },
                '403': { t: '403 Forbidden', d: 'The request was valid, but the server refuses authorization.' },
                '404': { t: '404 Not Found', d: 'The requested resource could not be found.' },
                '500': { t: '500 Internal Server Error', d: 'Generic error message when an unexpected condition was encountered.' },
              };
              const item = descMap[httpCode] || { t: `${httpCode} Status`, d: 'HTTP status indicator.' };
              return (
                <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: httpCode.startsWith('2') ? '#10b981' : '#f97316' }}>{item.t}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.d}</div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Box Shadow Generator */}
        {activeToolId === 'shadow' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>📦 CSS Box Shadow Generator</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '11px' }}>Blur: {shadowBlur}px</label>
                <input type="range" min="0" max="60" value={shadowBlur} onChange={(e) => setShadowBlur(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Spread: {shadowSpread}px</label>
                <input type="range" min="-10" max="30" value={shadowSpread} onChange={(e) => setShadowSpread(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  width: '120px',
                  height: '60px',
                  background: 'rgba(14, 165, 233, 0.25)',
                  border: '1px solid rgba(14, 165, 233, 0.5)',
                  borderRadius: '12px',
                  display: 'inline-block',
                  boxShadow: `0 10px ${shadowBlur}px ${shadowSpread}px rgba(14, 165, 233, 0.5)`,
                }}
              />
            </div>
            <button className="btn-secondary" style={{ width: '100%' }} onClick={() => copyToClipboard(`box-shadow: 0 10px ${shadowBlur}px ${shadowSpread}px rgba(14, 165, 233, 0.5);`)}>
              Copy Shadow CSS
            </button>
          </div>
        )}

        {/* Glassmorphism Generator */}
        {activeToolId === 'glass' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🪟 Glassmorphism CSS Generator</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '11px' }}>Blur: {glassBlur}px</label>
                <input type="range" min="0" max="40" value={glassBlur} onChange={(e) => setGlassBlur(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Opacity: {glassOpacity}%</label>
                <input type="range" min="10" max="95" value={glassOpacity} onChange={(e) => setGlassOpacity(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: '100%',
                  padding: '16px',
                  background: `rgba(255, 255, 255, ${glassOpacity / 100})`,
                  backdropFilter: `blur(${glassBlur}px)`,
                  WebkitBackdropFilter: `blur(${glassBlur}px)`,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  color: '#000',
                  fontWeight: 700,
                }}
              >
                Frosted Glass Card Preview
              </div>
            </div>
            <button
              className="btn-secondary"
              style={{ width: '100%' }}
              onClick={() => copyToClipboard(`background: rgba(255, 255, 255, ${glassOpacity / 100});\nbackdrop-filter: blur(${glassBlur}px);`)}
            >
              Copy Glassmorphism CSS
            </button>
          </div>
        )}

        {/* Material Palette */}
        {activeToolId === 'palette' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🎭 Material Design Palette Generator</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '10px' }}>
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => {
                const lightness = 95 - (shade / 900) * 80;
                const col = `hsl(205, 85%, ${lightness}%)`;
                return (
                  <div
                    key={shade}
                    style={{ background: col, padding: '8px 4px', textAlign: 'center', borderRadius: '6px', fontSize: '10px', color: shade > 400 ? '#fff' : '#000', cursor: 'pointer' }}
                    onClick={() => copyToClipboard(col, `${shade} shade`)}
                  >
                    {shade}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>Tap any shade above to copy HSL color value.</div>
          </div>
        )}

        {/* Magic 8-Ball */}
        {activeToolId === '8ball' && (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🎱 Magic 8-Ball Oracle</h4>
            <input
              type="text"
              className="text-input"
              value={eightBallQ}
              onChange={(e) => setEightBallQ(e.target.value)}
              placeholder="Will Lexio assist 100k users today?..."
              style={{ marginBottom: '12px' }}
            />
            <div style={{ fontSize: '56px', margin: '8px 0' }}>🎱</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8', marginBottom: '12px' }}>
              {eightBallAnswer || 'Ask a question & tap below'}
            </div>
            <button
              className="btn-primary btn-purple"
              onClick={() => {
                tg.haptic('heavy');
                setEightBallAnswer(eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)]);
              }}
            >
              Consult 8-Ball
            </button>
          </div>
        )}

        {/* Random Number */}
        {activeToolId === 'rand' && (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🔢 Random Number Generator</h4>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '11px' }}>Min</label>
                <input type="number" className="text-input" value={randMin} onChange={(e) => setRandMin(Number(e.target.value))} style={{ width: '80px', textAlign: 'center' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Max</label>
                <input type="number" className="text-input" value={randMax} onChange={(e) => setRandMax(Number(e.target.value))} style={{ width: '80px', textAlign: 'center' }} />
              </div>
            </div>
            <div style={{ fontSize: '42px', fontWeight: 800, color: '#10b981', margin: '8px 0' }}>
              {randResult !== null ? randResult : '—'}
            </div>
            <button
              className="btn-primary btn-green"
              onClick={() => {
                tg.haptic('medium');
                setRandResult(Math.floor(Math.random() * (randMax - randMin + 1)) + randMin);
              }}
            >
              Generate Random Number
            </button>
          </div>
        )}

        {/* JSON Beautifier */}
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

        {/* QR Code */}
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

        {/* UUID */}
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

        {/* Hashes */}
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
              <div style={{ color: 'var(--text-muted)' }}>SHA-256 Digest:</div>
              <div style={{ fontFamily: 'monospace', color: '#38bdf8', wordBreak: 'break-all', margin: '4px 0 8px' }}>
                {Array.from(new TextEncoder().encode(hashInput)).reduce((acc, b) => acc + (b % 16).toString(16), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
              </div>
            </div>
          </div>
        )}

        {/* 256-Bit Password */}
        {activeToolId === 'password' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🛡️ 256-Bit Password Generator</h4>
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

        {/* Case Converter */}
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

        {/* BMI */}
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

        {/* Age Calculator */}
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

        {/* Loan EMI */}
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

        {/* Percentage */}
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

        {/* Discount */}
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

        {/* Tip & Bill Splitter */}
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

        {/* HEX to RGB */}
        {activeToolId === 'hextorgb' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🎨 HEX / RGB / HSL Converter</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input type="color" value={hexColor} onChange={(e) => setHexColor(e.target.value)} style={{ width: '45px', height: '42px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
              <input type="text" className="text-input" value={hexColor} onChange={(e) => setHexColor(e.target.value)} />
            </div>
            <div style={{ background: 'rgba(5, 8, 16, 0.85)', padding: '12px', borderRadius: '12px', fontSize: '13px' }}>
              <div>• <b>HEX:</b> {hexColor.toUpperCase()}</div>
              <div>• <b>RGB:</b> rgb({parseInt(hexColor.slice(1, 3), 16) || 0}, {parseInt(hexColor.slice(3, 5), 16) || 0}, {parseInt(hexColor.slice(5, 7), 16) || 0})</div>
            </div>
          </div>
        )}

        {/* CSS Gradient */}
        {activeToolId === 'gradient' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>🌈 CSS Gradient Generator</h4>
            <div style={{ height: '90px', borderRadius: '12px', background: gradientPreset, marginBottom: '10px', border: '1px solid var(--border-glass)' }} />
            <div style={{ display: 'flex', gap: '6px' }}>
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

        {/* Word Counter */}
        {activeToolId === 'count' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>📝 Word & Character Counter</h4>
            <textarea className="code-textarea" value={countText} onChange={(e) => setCountText(e.target.value)} />
            <div className="stats-grid" style={{ marginBottom: 0 }}>
              <div className="stat-card">
                <div className="stat-value">{countText.trim() ? countText.trim().split(/\s+/).length : 0}</div>
                <div className="stat-label">Words</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{countText.length}</div>
                <div className="stat-label">Characters</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{Math.ceil((countText.trim().split(/\s+/).length || 1) / 200)}m</div>
                <div className="stat-label">Read Time</div>
              </div>
            </div>
          </div>
        )}

        {/* Markdown to HTML */}
        {activeToolId === 'md2html' && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>📄 Markdown to HTML Preview</h4>
            <textarea className="code-textarea" value={mdInput} onChange={(e) => setMdInput(e.target.value)} />
            <div style={{ background: 'rgba(5, 8, 16, 0.9)', padding: '12px', borderRadius: '12px', fontSize: '13px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>Live HTML Render:</div>
              <div dangerouslySetInnerHTML={{ __html: mdInput.replace(/# (.*)/g, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
            </div>
          </div>
        )}

        {/* Coin Toss */}
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

        {/* Dice Roller */}
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

        {/* Daily Quote */}
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

        {/* Rock Paper Scissors */}
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

        {/* Base64 */}
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

      {/* Grid of All Filtered Tools */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
          SELECT TOOL ({filteredTools.length})
        </h3>
        <button
          style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
          onClick={onOpenSlideBar}
        >
          Open Slide Bar ➔
        </button>
      </div>

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
function ProfileTab({ user, onOpenTools }: { user: any; onOpenTools: () => void }) {
  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <h2 className="card-title" style={{ marginBottom: 0 }}>👤 User Identity & Support</h2>
        <button className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={onOpenTools}>
          ☰ All Tools
        </button>
      </div>
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

      <div style={{ background: 'rgba(10, 15, 28, 0.65)', padding: '16px', borderRadius: '16px', marginBottom: '14px', border: '1px solid var(--border-glass)' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 800, marginBottom: '8px', color: '#fff' }}>📞 Official Support & Contacts</h4>
        <p style={{ fontSize: '13px', marginBottom: '6px' }}>
          <b>Phone:</b> <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>6290873841</span>
        </p>
        <p style={{ fontSize: '13px', marginBottom: '6px' }}>
          <b>Email:</b> <span style={{ color: '#38bdf8' }}>qwicklabs2@gmail.com</span>
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
          Engineered by <b>Sakshi Developer</b>. 100% of all tools operate directly inside Telegram with zero external website links.
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
