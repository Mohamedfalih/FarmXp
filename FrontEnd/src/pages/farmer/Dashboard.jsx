import React from 'react';
import './Dashboard.css';

const statCards = [
  { icon: '🏆', bg: 'var(--harvest-light)', trend: '+120', value: '2,480', label: 'Total XP' },
  { icon: '📚', bg: 'var(--sprout-light)', trend: '4 new', value: '12/18', label: 'Modules Completed' },
  { icon: '💧', bg: 'var(--sky-light)', trend: '-18%', value: '72', label: 'Sustainability Score' },
  { icon: '🧪', bg: 'var(--clay-light)', trend: '3 pending', value: '9', label: 'Certified Practices' },
];

const quickActions = [
  { icon: '🤖', bg: 'var(--clay-light)', label: 'Ask AI' },
  { icon: '📷', bg: 'var(--sprout-light)', label: 'Log Practice' },
  { icon: '💧', bg: 'var(--sky-light)', label: 'Add Metric' },
  { icon: '🏛️', bg: 'var(--harvest-light)', label: 'Schemes' },
];

const todayTasks = [
  { icon: '🌤️', bg: 'var(--sky-light)', title: '31°C · Clear skies', sub: 'Good day for irrigation' },
  { icon: '💧', bg: 'var(--sprout-light)', title: 'Log water usage', sub: 'Due today' },
  { icon: '🎮', bg: 'var(--harvest-light)', title: 'Finish Soil Health quiz', sub: '80% complete' },
];

const recommendedModules = [
  { icon: '🌱', bg: 'var(--sprout-light)', tag: 'SOIL HEALTH', tagBg: 'var(--sprout-light)', tagCol: 'var(--sprout)', title: 'Understanding Soil pH', meta: ['⏱️ 8 min', '🏆 100 XP'], prog: 100, diff: 'Beginner' },
  { icon: '💧', bg: 'var(--sky-light)', tag: 'WATER MGMT', tagBg: 'var(--sky-light)', tagCol: 'var(--sky)', title: 'Efficient Drip Irrigation', meta: ['⏱️ 12 min', '🏆 150 XP'], prog: 60, diff: 'Beginner' },
  { icon: '🧪', bg: 'var(--clay-light)', tag: 'ORGANIC', tagBg: 'var(--clay-light)', tagCol: 'var(--clay)', title: 'Making Bio-Pesticides', meta: ['⏱️ 10 min', '🏆 120 XP'], prog: 0, diff: 'Intermediate' },
];

const recommendedSchemes = [
  { icon: '💧', bg: 'var(--sky-light)', title: 'PM Krishi Sinchayee Yojana', desc: 'Up to 55% subsidy on drip/sprinkler systems', eligible: true, deadline: '30 Sep 2026' },
  { icon: '🌱', bg: 'var(--sprout-light)', title: 'Soil Health Card Scheme', desc: 'Free soil testing & nutrient recommendations', eligible: true, deadline: 'Ongoing' },
  { icon: '🌾', bg: 'var(--harvest-light)', title: 'PM-KISAN', desc: '₹6,000/year direct income support', eligible: true, deadline: '15 Aug 2026' },
];

// Condensed version of the prototype's Profile → Farm Details card
const farmSummary = {
  farmSize: '2.5 acres',
  soilType: 'Alluvial',
  primaryCrop: 'Paddy',
  secondaryCrop: 'Millets',
  irrigation: 'Borewell + Canal',
  farmingType: 'Semi-organic',
};

const farmerName = 'Guest Farmer';
const sustainabilityScore = 72;

const Dashboard = () => {
  return (
    <div className="dash">
      {/* Greeting hero */}
      <div className="dash-hero">
        <div>
          <div className="dash-hero-eyebrow">GOOD MORNING</div>
          <h2 className="dash-hero-name">{farmerName} 🌱</h2>
          <div className="dash-hero-sub">2.5 acres · Paddy &amp; Millets · Coimbatore</div>
        </div>
        <div className="gring">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="8" />
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="#F2A93B"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - sustainabilityScore / 100)}
            />
          </svg>
          <div className="gring-center">
            <span className="gring-num" style={{ fontSize: '22px' }}>{sustainabilityScore}</span>
            <span className="gring-sub" style={{ color: '#fff' }}>SCORE</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-4" style={{ marginTop: 22 }}>
        {statCards.map((s) => (
          <div className="card stat-card" key={s.label}>
            <div className="stat-top">
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <span className="stat-trend trend-up">{s.trend}</span>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Farm Summary */}
      <div className="section-title">
        <h3>🚜 Farm Summary</h3>
      </div>
      <div className="card farm-summary-card">
        <div className="farm-summary-grid">
          <div className="farm-summary-item">
            <div className="farm-summary-label">FARM SIZE</div>
            <div className="farm-summary-value">{farmSummary.farmSize}</div>
          </div>
          <div className="farm-summary-item">
            <div className="farm-summary-label">SOIL TYPE</div>
            <div className="farm-summary-value">{farmSummary.soilType}</div>
          </div>
          <div className="farm-summary-item">
            <div className="farm-summary-label">PRIMARY CROP</div>
            <div className="farm-summary-value">{farmSummary.primaryCrop}</div>
          </div>
          <div className="farm-summary-item">
            <div className="farm-summary-label">SECONDARY CROP</div>
            <div className="farm-summary-value">{farmSummary.secondaryCrop}</div>
          </div>
          <div className="farm-summary-item">
            <div className="farm-summary-label">IRRIGATION</div>
            <div className="farm-summary-value">{farmSummary.irrigation}</div>
          </div>
          <div className="farm-summary-item">
            <div className="farm-summary-label">FARMING TYPE</div>
            <div className="farm-summary-value">{farmSummary.farmingType}</div>
          </div>
        </div>
      </div>

      {/* XP goal + quick actions */}
      <div className="grid grid-2" style={{ marginTop: 20 }}>
        <div className="card xpgoal-card">
          <div className="icon-badge harvest" style={{ width: 52, height: 52, fontSize: 24 }}>🎯</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <b style={{ fontSize: 14 }}>Today's XP Goal</b>
              <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)' }}>
                80 / 150 XP
              </span>
            </div>
            <div className="xpgoal-track">
              <div className="xpgoal-fill" style={{ width: '53%' }} />
            </div>
          </div>
        </div>

        <div className="quick-actions">
          {quickActions.map((qa) => (
            <button className="qa-btn" key={qa.label} type="button">
              <div className="ic" style={{ background: qa.bg }}>{qa.icon}</div>
              <div className="lb">{qa.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's tasks */}
      <div className="section-title">
        <h3>🌤️ Today's Farming Tasks</h3>
      </div>
      <div className="grid grid-3">
        {todayTasks.map((t) => (
          <div className="card task-card" key={t.title}>
            <div className="icon-badge" style={{ background: t.bg, width: 44, height: 44, fontSize: 20 }}>
              {t.icon}
            </div>
            <div>
              <div className="task-title">{t.title}</div>
              <div className="task-sub">{t.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended for You (modules) */}
      <div className="section-title">
        <h3>🤖 Recommended for You</h3>
        <button className="link-more" type="button">View all →</button>
      </div>
      <div className="grid grid-3">
        {recommendedModules.map((m) => (
          <div className="card module-card" key={m.title}>
            <div className="module-hero" style={{ background: m.bg }}>{m.icon}</div>
            <div className="module-body">
              <span className="module-tag" style={{ background: m.tagBg, color: m.tagCol }}>
                {m.tag}
              </span>
              <span className={`diff-badge diff-${m.diff.toLowerCase()}`}>{m.diff}</span>
              <div className="module-title">{m.title}</div>
              <div className="module-meta">
                <span>{m.meta[0]}</span>
                <span>{m.meta[1]}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${m.prog}%` }} />
              </div>
              <div className="module-complete">{m.prog}% complete</div>
            </div>
          </div>
        ))}
      </div>

      {/* Government Schemes for You */}
      <div className="section-title">
        <h3>🏛️ Government Schemes for You</h3>
        <button className="link-more" type="button">View all →</button>
      </div>
      <div className="grid grid-3">
        {recommendedSchemes.map((s) => (
          <div className="card scheme-card-official" key={s.title}>
            <div className="scheme-top">
              <div className="scheme-emblem">{s.icon}</div>
              {s.eligible ? (
                <span className="pill pill-approved">✅ Eligible</span>
              ) : (
                <span className="pill pill-neutral">Check eligibility</span>
              )}
            </div>
            <div className="scheme-title">{s.title}</div>
            <div className="scheme-desc">
              <b>💰 Benefit:</b> {s.desc}
            </div>
            <div className="scheme-deadline">⏰ Deadline: {s.deadline}</div>
            <button className="btn btn-outline btn-sm scheme-btn" type="button">
              📄 View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;