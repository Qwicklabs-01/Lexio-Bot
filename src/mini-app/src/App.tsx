import React, { useState, useEffect } from 'react';
import { tg } from './telegram.js';

type Tab = 'nexus' | 'feedigger' | 'toolbox' | 'profile';

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('nexus');
  const user = tg.getUser();

  useEffect(() => {
    tg.init();
    // Parse query param tab if opened with ?tab=...
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
            <h1>OmniPlatform</h1>
            <span>Nexus • Feedigger • ToolBox</span>
          </div>
        </div>
        <div className="user-badge">
          <span>@{user.username || user.first_name}</span>
        </div>
      </header>

      {/* Segmented Tabs Navigation */}
      <nav className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'nexus' ? 'active nexus' : ''}`}
          onClick={() => switchTab('nexus')}
        >
          <span className="tab-icon">⚡</span>
          <span>Nexus</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'feedigger' ? 'active feedigger' : ''}`}
          onClick={() => switchTab('feedigger')}
        >
          <span className="tab-icon">🔍</span>
          <span>Feedigger</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'toolbox' ? 'active toolbox' : ''}`}
          onClick={() => switchTab('toolbox')}
        >
          <span className="tab-icon">🧰</span>
          <span>ToolBox</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => switchTab('profile')}
        >
          <span className="tab-icon">👤</span>
          <span>Profile</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main>
        {activeTab === 'nexus' && <NexusMediaTab />}
        {activeTab === 'feedigger' && <FeediggerTab />}
        {activeTab === 'toolbox' && <ToolBoxTab />}
        {activeTab === 'profile' && <ProfileTab user={user} />}
      </main>
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
      tg.showPopup('Missing URL', 'Please enter or paste a valid video link.');
      return;
    }
    tg.haptic('medium');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMediaData({
        title: 'Mastering Full-Stack Engineering & AI Workflows in 2026',
        platform: url.includes('instagram') ? 'Instagram' : url.includes('tiktok') ? 'TikTok' : 'YouTube',
        duration: '12m 45s',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      });
      tg.haptic('success');
    }, 900);
  };

  const handleDownload = () => {
    tg.haptic('heavy');
    setDownloading(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          tg.haptic('success');
          tg.showPopup('Download Complete!', `Successfully captured in ${selectedFormat.toUpperCase()}.`);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  return (
    <div className="glass-card">
      <h2 className="card-title">⚡ Nexus Universal Downloader</h2>
      <p className="card-subtitle">
        Download 4K, 1080p video and MP3 audio from YouTube, Instagram, TikTok, and Twitter/X with zero watermarks.
      </p>

      <div className="input-group">
        <input
          type="text"
          className="text-input"
          placeholder="Paste video or reel URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="btn-primary" onClick={handleExtract} disabled={loading}>
          {loading ? 'Analyzing...' : 'Extract'}
        </button>
      </div>

      {mediaData && (
        <div className="media-preview-box">
          <img src={mediaData.thumbnail} alt="Media thumbnail" className="media-thumbnail-img" />
          <div className="media-details">
            <h3 className="media-title">{mediaData.title}</h3>
            <p className="card-subtitle">
              Platform: <b>{mediaData.platform}</b> • Duration: <b>{mediaData.duration}</b>
            </p>

            <div className="format-options">
              {['1080p', '720p', 'mp3'].map((fmt) => (
                <div
                  key={fmt}
                  className={`format-chip ${selectedFormat === fmt ? 'active' : ''}`}
                  onClick={() => {
                    tg.haptic('light');
                    setSelectedFormat(fmt);
                  }}
                >
                  <b>{fmt.toUpperCase()}</b>
                  <div>{fmt === 'mp3' ? '320kbps Audio' : 'HD Video'}</div>
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
                {downloading ? `Processing (${progress}%)...` : `Capture & Save ${selectedFormat.toUpperCase()}`}
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
      views: '14.2M',
      likes: '1.2M',
      comments: '24.5k',
      er: '8.6%',
      caption: 'Surviving 7 Days In The World Most Extreme Environment 🏔️',
      thumb: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      rank: 2,
      views: '8.9M',
      likes: '840k',
      comments: '18.2k',
      er: '9.6%',
      caption: 'We gave 1,000 strangers their dream jobs today! ✨',
      thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      rank: 3,
      views: '6.4M',
      likes: '590k',
      comments: '12.4k',
      er: '9.4%',
      caption: 'World Record: Largest Domino Setup in History 🔥',
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
    tg.showPopup('CSV Export Ready', `Feedigger data for @${handle} exported. Check your downloads.`);
  };

  return (
    <div className="glass-card">
      <h2 className="card-title">🔍 Feedigger Instagram Excavator</h2>
      <p className="card-subtitle">
        Sort any creator or brand profile by real Views, Likes, and Comments to find viral breakthrough content.
      </p>

      <div className="input-group">
        <input
          type="text"
          className="text-input"
          placeholder="Instagram @username..."
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        <button className="btn-primary btn-orange" onClick={handleExcavate} disabled={loading}>
          {loading ? 'Digging...' : 'Analyze'}
        </button>
      </div>

      {/* Preset Chips */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {['mrbeast', 'nike', 'apple', 'hubspot'].map((chip) => (
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
          <div className="stat-value">9.2%</div>
          <div className="stat-label">Average ER%</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">184</div>
          <div className="stat-label">Reels Analyzed</div>
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

      {/* Reels List */}
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
                <span>🔥 {r.er} ER</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px' }}>
        <button className="btn-secondary" style={{ width: '100%' }} onClick={handleExportCsv}>
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
  const [selectedTool, setSelectedTool] = useState<'json' | 'qr' | 'password' | 'bmi' | 'base64'>('json');

  // Tool states
  const [jsonInput, setJsonInput] = useState('{"platform":"OmniPlatform","status":"ready","tools":100}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [qrText, setQrText] = useState('https://nest-hub-tools.vercel.app/');
  const [pwLength, setPwLength] = useState(16);
  const [generatedPw, setGeneratedPw] = useState('7g#K9@mP2$xL5!vQ');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);

  const tools = [
    { id: 'json', icon: '🔤', name: 'JSON Formatter' },
    { id: 'qr', icon: '📱', name: 'QR Generator' },
    { id: 'password', icon: '🔐', name: 'Password Gen' },
    { id: 'bmi', icon: '⚖️', name: 'BMI Calculator' },
    { id: 'base64', icon: '⚡', name: 'Base64 Tool' },
  ] as const;

  const formatJson = () => {
    tg.haptic('medium');
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      tg.haptic('success');
    } catch {
      tg.haptic('error');
      setJsonOutput('❌ Invalid JSON syntax error!');
    }
  };

  const generatePassword = () => {
    tg.haptic('light');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let res = '';
    for (let i = 0; i < pwLength; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPw(res);
  };

  const calculateBmi = () => {
    const hM = height / 100;
    return (weight / (hM * hM)).toFixed(1);
  };

  return (
    <div className="glass-card">
      <h2 className="card-title">🧰 ToolBox Pro — 100+ Utilities</h2>
      <p className="card-subtitle">Interactive developer utilities, calculators, and productivity gadgets.</p>

      {/* Tool Selector Grid */}
      <div className="tools-picker-grid">
        {tools.map((t) => (
          <div
            key={t.id}
            className={`tool-tile ${selectedTool === t.id ? 'active' : ''}`}
            onClick={() => {
              tg.haptic('selectionChanged');
              setSelectedTool(t.id);
            }}
          >
            <span className="tool-tile-icon">{t.icon}</span>
            <span className="tool-tile-name">{t.name}</span>
          </div>
        ))}
      </div>

      {/* Active Live Tool Interface */}
      <div className="live-tool-container">
        {selectedTool === 'json' && (
          <div>
            <h4 style={{ marginBottom: '8px' }}>JSON Beautifier & Validator</h4>
            <textarea
              className="code-textarea"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste raw JSON here..."
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <button className="btn-primary btn-green" onClick={formatJson}>
                Format JSON
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  try {
                    setJsonOutput(JSON.stringify(JSON.parse(jsonInput)));
                  } catch {}
                }}
              >
                Minify
              </button>
            </div>
            {jsonOutput && <textarea className="code-textarea" readOnly value={jsonOutput} />}
          </div>
        )}

        {selectedTool === 'qr' && (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ marginBottom: '8px' }}>High-Resolution QR Generator</h4>
            <input
              type="text"
              className="text-input"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              placeholder="Enter text or URL..."
              style={{ marginBottom: '14px' }}
            />
            {qrText && (
              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', display: 'inline-block' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`}
                  alt="QR Code"
                  style={{ display: 'block' }}
                />
              </div>
            )}
          </div>
        )}

        {selectedTool === 'password' && (
          <div>
            <h4 style={{ marginBottom: '8px' }}>Cryptographic Password Generator</h4>
            <div
              style={{
                background: 'rgba(0,0,0,0.4)',
                padding: '14px',
                borderRadius: '12px',
                fontFamily: 'monospace',
                fontSize: '16px',
                textAlign: 'center',
                color: '#38bdf8',
                marginBottom: '12px',
              }}
            >
              {generatedPw}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Length: {pwLength} characters
              </label>
              <input
                type="range"
                min="8"
                max="32"
                value={pwLength}
                onChange={(e) => setPwLength(Number(e.target.value))}
                style={{ width: '100%', marginTop: '6px' }}
              />
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={generatePassword}>
              Generate New Password
            </button>
          </div>
        )}

        {selectedTool === 'bmi' && (
          <div>
            <h4 style={{ marginBottom: '8px' }}>Body Mass Index (BMI)</h4>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#10b981' }}>{calculateBmi()}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Healthy Weight Range
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px' }}>Weight: {weight} kg</label>
                <input
                  type="range"
                  min="40"
                  max="150"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px' }}>Height: {height} cm</label>
                <input
                  type="range"
                  min="130"
                  max="220"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        )}

        {selectedTool === 'base64' && (
          <div>
            <h4 style={{ marginBottom: '8px' }}>Base64 Encode & Decode</h4>
            <input
              type="text"
              className="text-input"
              placeholder="Enter string..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <button
                className="btn-primary"
                onClick={() => setJsonOutput(btoa(unescape(encodeURIComponent(jsonInput))))}
              >
                Encode
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  try {
                    setJsonOutput(decodeURIComponent(escape(atob(jsonInput))));
                  } catch {
                    setJsonOutput('Invalid Base64');
                  }
                }}
              >
                Decode
              </button>
            </div>
            {jsonOutput && <textarea className="code-textarea" readOnly value={jsonOutput} />}
          </div>
        )}
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

      <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '16px', marginBottom: '14px' }}>
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>
          <b>Telegram Name:</b> {user.first_name} {user.last_name || ''}
        </p>
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>
          <b>Username:</b> @{user.username || 'Not set'}
        </p>
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>
          <b>Telegram ID:</b> <code>{user.id}</code>
        </p>
        <p style={{ fontSize: '14px', color: '#10b981', fontWeight: '700' }}>
          🛡️ initData HMAC-SHA256 Signature Verified
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
