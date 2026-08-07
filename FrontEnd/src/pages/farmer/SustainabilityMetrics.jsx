import { useState } from 'react';
import './SustainabilityMetrics.css';

const METRIC_TYPES = [
  { key: 'water', label: '💧 Water Use', unit: 'Litres' },
  { key: 'chemical', label: '🧪 Chemical Input', unit: 'Kilograms' },
];

const SustainabilityMetrics = () => {
  // Mock data — matches the prototype's overview stats.
  // Later this becomes: metricsService.getMetrics().then(setMetrics)
  const [metrics, setMetrics] = useState([
    { id: 1, type: 'water', icon: '💧', bg: 'var(--sky-light)', baseline: 12000, current: 8100, unit: 'Litres', label: 'Water use vs baseline' },
    { id: 2, type: 'chemical', icon: '🧪', bg: 'var(--clay-light)', baseline: 40, current: 22, unit: 'Kilograms', label: 'Chemical input vs baseline' },
  ]);

  const waterTrend = [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 50 },
    { month: 'Mar', value: 70 },
    { month: 'Apr', value: 100 },
    { month: 'May', value: 120 },
  ];

  const [showAddForm, setShowAddForm] = useState(false);
  const [metricForm, setMetricForm] = useState({
    type: 'water',
    baseline: '',
    current: '',
    unit: 'Litres',
    notes: '',
  });

  // Overall sustainability score — locked formula: (baseline - current) / baseline * 100
  const overallScore = Math.round(
    metrics.reduce((sum, m) => {
      const pct = ((m.baseline - m.current) / m.baseline) * 100;
      return sum + pct;
    }, 0) / (metrics.length || 1)
  );

  const getPercentChange = (m) => {
    const pct = Math.round(((m.baseline - m.current) / m.baseline) * 100);
    return pct;
  };

  const handleFormChange = (e) => {
    setMetricForm({ ...metricForm, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const matched = METRIC_TYPES.find((t) => t.key === type);
    setMetricForm({ ...metricForm, type, unit: matched.unit });
  };

  const handleSaveMetric = (e) => {
    e.preventDefault();
    if (!metricForm.baseline || !metricForm.current) return;

    // Later this becomes: metricsService.addMetric(metricForm)
    const typeInfo = METRIC_TYPES.find((t) => t.key === metricForm.type);
    setMetrics([
      ...metrics,
      {
        id: Date.now(),
        type: metricForm.type,
        icon: metricForm.type === 'water' ? '💧' : '🧪',
        bg: metricForm.type === 'water' ? 'var(--sky-light)' : 'var(--clay-light)',
        baseline: Number(metricForm.baseline),
        current: Number(metricForm.current),
        unit: metricForm.unit,
        label: `${typeInfo.label.split(' ').slice(1).join(' ')} vs baseline`,
      },
    ]);
    setMetricForm({ type: 'water', baseline: '', current: '', unit: 'Litres', notes: '' });
    setShowAddForm(false);
  };

  // Build chart points from waterTrend data
  const buildChartPoints = (data) => {
    const maxVal = Math.max(...data.map((d) => d.value));
    const startX = 10;
    const startY = 20;
    const chartWidth = 480;
    const chartHeight = 100;
    const stepX = chartWidth / (data.length - 1);
    return data.map((d, i) => {
      const x = startX + i * stepX;
      const y = startY + (chartHeight - (d.value / maxVal) * chartHeight);
      return { x, y };
    });
  };

  const points = buildChartPoints(waterTrend);
  const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="sustain-page">
      {!showAddForm ? (
        <>
          <div className="sustain-header">
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={() => setShowAddForm(true)}
            >
              + Add Metric
            </button>
          </div>

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
                    strokeDashoffset={2 * Math.PI * 44 * (1 - overallScore / 100)}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="gring-center">
                  <span className="gring-num">{overallScore}</span>
                </div>
              </div>
              <div className="stat-label">Sustainability Score</div>
            </div>

            {metrics.map((m) => {
              const pct = getPercentChange(m);
              return (
                <div className="card stat-card" key={m.id}>
                  <div className="stat-icon" style={{ background: m.bg }}>{m.icon}</div>
                  <div className={`stat-value ${pct >= 0 ? 'positive' : 'negative'}`}>
                    {pct >= 0 ? '-' : '+'}{Math.abs(pct)}%
                  </div>
                  <div className="stat-label">{m.label}</div>
                </div>
              );
            })}
          </div>

          <div className="section-title">
            <h3>📊 Water Usage Trend</h3>
          </div>
          <div className="card chart-card">
            <svg viewBox="0 0 560 160" width="100%" height="160">
              <polyline points={linePoints} fill="none" stroke="#3E8FA0" strokeWidth="4" />
              <g fill="#3E8FA0">
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="5" />
                ))}
              </g>
              <g fill="#5B6B5C" fontSize="11">
                {waterTrend.map((d, i) => (
                  <text key={d.month} x={points[i].x - 10} y="150">
                    {d.month}
                  </text>
                ))}
              </g>
            </svg>
          </div>

          {/* Logged metrics list */}
          <div className="section-title">
            <h3>📋 Logged Metrics</h3>
          </div>
          <div className="card metrics-list-card">
            {metrics.map((m) => (
              <div className="metric-row" key={m.id}>
                <div className="icon-badge" style={{ background: m.bg }}>{m.icon}</div>
                <div className="metric-row-info">
                  <b>{m.type === 'water' ? 'Water Use' : 'Chemical Input'}</b>
                  <div className="metric-row-values">
                    Baseline: {m.baseline} {m.unit} · Current: {m.current} {m.unit}
                  </div>
                </div>
                <span className={`metric-pct ${getPercentChange(m) >= 0 ? 'positive' : 'negative'}`}>
                  {getPercentChange(m) >= 0 ? '-' : '+'}{Math.abs(getPercentChange(m))}%
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            className="btn-ghost back-btn"
            type="button"
            onClick={() => setShowAddForm(false)}
          >
            ← Back
          </button>

          <div className="card add-metric-card">
            <h3>💧 Log a Sustainability Metric</h3>

            <form onSubmit={handleSaveMetric}>
              <div className="field">
                <label>Metric type</label>
                <select name="type" value={metricForm.type} onChange={handleTypeChange}>
                  {METRIC_TYPES.map((t) => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Baseline value</label>
                  <input
                    name="baseline"
                    placeholder="e.g. 12000"
                    value={metricForm.baseline}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="field">
                  <label>Current value</label>
                  <input
                    name="current"
                    placeholder="e.g. 8100"
                    value={metricForm.current}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="field">
                <label>Unit</label>
                <select
                  name="unit"
                  value={metricForm.unit}
                  onChange={handleFormChange}
                >
                  <option>Litres</option>
                  <option>Kilograms</option>
                </select>
              </div>

              <div className="field">
                <label>Notes (optional)</label>
                <textarea
                  name="notes"
                  rows="2"
                  placeholder="Any extra detail..."
                  value={metricForm.notes}
                  onChange={handleFormChange}
                />
              </div>

              <button className="btn btn-primary btn-block" type="submit">
                Save Metric
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default SustainabilityMetrics;