import React, { useEffect, useState } from 'react';
import learningService from '../../services/learningService';
import farmerService from '../../services/farmerService';
import './Progress.css';

const buildChartPoints = (data) => {
  if (!data || data.length === 0) return [];
  const maxXp = Math.max(...data.map((d) => d.xp), 100);
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
  const [overallCompletion, setOverallCompletion] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // We don't have an XP trend endpoint, leaving empty to avoid mock data
  const [xpTrend] = useState([]); 

  useEffect(() => {
    const loadProgressData = async () => {
      setLoading(true);
      try {
        const [summaryRes, modulesRes, progressRes, dashboardRes] = await Promise.all([
          learningService.getSummary().catch(() => null),
          learningService.getModules().catch(() => []),
          learningService.getModuleProgress().catch(() => []),
          farmerService.getDashboard().catch(() => null)
        ]);

        if (summaryRes) {
          setOverallCompletion(Math.round(summaryRes.overallCompletionPercentage || 0));
        }

        if (dashboardRes) {
          setTotalXp(dashboardRes.farmer?.totalXp || 0);
        }

        const modulesList = Array.isArray(modulesRes) ? modulesRes : (modulesRes?.modules ?? modulesRes?.content ?? []);
        const progressList = Array.isArray(progressRes) ? progressRes : (progressRes?.progress ?? []);

        const mergedModules = modulesList.map(m => {
          const p = progressList.find(prog => prog.moduleId === (m.moduleId || m.id));
          return {
            id: m.moduleId || m.id,
            icon: m.icon || '📚',
            title: m.title || m.moduleName,
            bg: 'var(--sprout-light)', 
            prog: p ? p.completionPercentage || 0 : 0
          };
        });

        setModules(mergedModules);

      } catch (err) {
        console.error("Failed to load progress data", err);
      } finally {
        setLoading(false);
      }
    };
    loadProgressData();
  }, []);

  const points = buildChartPoints(xpTrend);
  const linePoints = points.join(' ');
  const areaPoints = points.length > 0 ? `${points.join(' ')} 550,170 10,170` : '';

  const lifetimeStats = [
    { icon: '🏆', bg: 'var(--harvest-light)', value: `${totalXp} XP`, label: 'Lifetime XP earned' },
    { icon: '🌱', bg: 'var(--sprout-light)', value: 'Active', label: 'Learning Status' },
  ];

  if (loading) {
    return <div className="progress-page"><div className="card"><p style={{padding:'20px'}}>Loading progress...</p></div></div>;
  }

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
        {xpTrend.length > 0 ? (
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
        ) : (
          <p style={{textAlign:'center', color:'var(--ink-soft)', padding:'40px'}}>XP history data is currently not available.</p>
        )}
      </div>

      {/* Module completion list */}
      <div className="section-title">
        <h3>✅ Module Completion</h3>
      </div>
      <div className="card module-list-card">
        {modules.length > 0 ? modules.map((m) => (
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
        )) : (
          <p style={{padding:'20px'}}>No learning modules found.</p>
        )}
      </div>
    </div>
  );
};

export default Progress;