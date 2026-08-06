import React from 'react';
import './Progress.css';

const overallCompletion = 67; // % of all modules completed

const lifetimeStats = [
  { icon: '🏆', bg: 'var(--harvest-light)', value: '2,480 XP', label: 'Lifetime XP earned' },
  { icon: '🔥', bg: 'var(--sprout-light)', value: '14 days', label: 'Current learning streak' },
];

// XP earned per week, last 6 weeks — drives the chart below
const xpTrend = [
  { week: 'W1', xp: 40 },
  { week: 'W2', xp: 60 },
  { week: 'W3', xp: 50 },
  { week: 'W4', xp: 110 },
  { week: 'W5', xp: 135 },
  { week: 'W6', xp: 165 },
];

// Same module set as Learning Modules, shown here as a completion list
const modules = [
  { id: 1, icon: '🌱', bg: 'var(--sprout-light)', title: 'Understanding Soil pH', prog: 100 },
  { id: 2, icon: '💧', bg: 'var(--sky-light)', title: 'Efficient Drip Irrigation', prog: 60 },
  { id: 3, icon: '🧪', bg: 'var(--clay-light)', title: 'Making Bio-Pesticides', prog: 0 },
  { id: 4, icon: '🐛', bg: 'var(--harvest-light)', title: 'Natural Pest Deterrents', prog: 30 },
  { id: 5, icon: '🌾', bg: 'var(--sprout-light)', title: 'Crop Rotation Basics', prog: 100 },
  { id: 6, icon: '♻️', bg: 'var(--harvest-light)', title: 'Composting Basics', prog: 0 },
];

// Build an SVG polyline path from the xpTrend data (chart area: 560x180, matching prototype)
const buildChartPoints = (data) => {
  const maxXp = Math.max(...data.map((d) => d.xp));
  const chartWidth = 540;
  const chartHeight = 150;
  const startX = 10;
  const startY = 20;
  const stepX = chartWidth / (data.length - 1);

  return data.map((d, i) => {
    const x = startX + i * stepX;
    const y = startY + (chartHeight - (d.xp / maxXp) * chartHeight);
    return `${x},${y}`;
  });
};

const Progress = () => {
  const points = buildChartPoints(xpTrend);
  const linePoints = points.join(' ');
  const areaPoints = `${points.join(' ')} 550,170 10,170`;

  return (
    <div className="progress-page">
      {/* Top summary cards */}
      <div className="grid grid-3">
        <div className="card ring-card">
          <div className="gring">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--line)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="var(--sprout)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - overallCompletion / 100)}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="gring-center">
              <span className="gring-num">{overallCompletion}%</span>
            </div>
          </div>
          <div className="stat-label">Overall Completion</div>
        </div>

        {lifetimeStats.map((s) => (
          <div className="card stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* XP trend chart */}
      <div className="section-title">
        <h3>📈 XP Over Last 6 Weeks</h3>
      </div>
      <div className="card chart-card">
        <svg viewBox="0 0 560 180" width="100%" height="180">
          <polyline points={linePoints} fill="none" stroke="#6FA83A" strokeWidth="4" />
          <polygon points={areaPoints} fill="#E4F1D8" opacity="0.7" />
          <g fill="#25422A" fontSize="11" fontFamily="Inter">
            {xpTrend.map((d, i) => (
              <text key={d.week} x={10 + i * (540 / (xpTrend.length - 1))} y="178">
                {d.week}
              </text>
            ))}
          </g>
        </svg>
      </div>

      {/* Module completion list */}
      <div className="section-title">
        <h3>✅ Module Completion</h3>
      </div>
      <div className="card module-list-card">
        {modules.map((m) => (
          <div className="module-progress-row" key={m.id}>
            <div className="icon-badge" style={{ background: m.bg }}>{m.icon}</div>
            <div className="module-progress-info">
              <b>{m.title}</b>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${m.prog}%` }} />
              </div>
            </div>
            <span className="module-progress-pct">{m.prog}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;