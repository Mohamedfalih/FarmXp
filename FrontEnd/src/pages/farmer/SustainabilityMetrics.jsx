import { useState, useEffect } from 'react';
import sustainabilityService from '../../services/sustainabilityService';
import farmerService from '../../services/farmerService';
import './SustainabilityMetrics.css';

const METRIC_TYPES = [
  {
    key: 'water',
    label: '💧 Water Use',
    unit: 'Litres',
  },
  {
    key: 'chemical',
    label: '🧪 Chemical Input',
    unit: 'Kilograms',
  },
];

// Maps a raw backend metric to the shape the UI expects
const normalizeMetric = (raw) => {
  const type = (raw.metricType || raw.type || '').toLowerCase();
  const isWater = type.includes('water');
  return {
    id: raw.id ?? raw.metricId ?? Date.now(),
    type: isWater ? 'water' : 'chemical',
    icon: isWater ? '💧' : '🧪',
    bg: isWater ? 'var(--sky-light)' : 'var(--clay-light)',
    baseline: Number(raw.baselineValue ?? raw.baseline ?? 0),
    current: Number(raw.currentValue ?? raw.current ?? 0),
    unit: raw.unit || (isWater ? 'Litres' : 'Kilograms'),
    label: `${isWater ? 'Water use' : 'Chemical input'} vs baseline`,
    recordedAt: raw.recordedAt || raw.createdAt || null,
  };
};

const SustainabilityMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [totalXp, setTotalXp] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [metricForm, setMetricForm] = useState({
    type: 'water',
    baseline: '',
    current: '',
    unit: 'Litres',
    notes: '',
  });

  // ── Load metrics from backend ──────────────────────────────
  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, dashboardRes] = await Promise.all([
        sustainabilityService.getMetrics(),
        farmerService.getDashboard().catch(() => null)
      ]);
      const list = Array.isArray(data) ? data : (data?.metrics ?? []);
      setMetrics(list.map(normalizeMetric));
      
      if (dashboardRes) {
        setTotalXp(dashboardRes.farmer?.totalXp || 0);
        
        const score = dashboardRes.sustainability?.score ?? 
                      dashboardRes.sustainability?.sustainabilityScore ?? 
                      dashboardRes.sustainability?.overallScore ?? 
                      dashboardRes.sustainability?.totalScore ?? 0;
        setOverallScore(Math.min(100, Math.max(0, score)));
      }
    } catch (err) {
      console.error('Failed to load metrics:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load metrics.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Derived chart data from real water metrics ─────────────
  const waterMetrics = metrics.filter((m) => m.type === 'water');
  const waterTrend =
    waterMetrics.length > 0
      ? waterMetrics.map((m, idx) => ({
          month: m.recordedAt
            ? new Date(m.recordedAt).toLocaleString('default', { month: 'short' })
            : `Entry ${idx + 1}`,
          value: m.current,
        }))
      : [{ month: '—', value: 0 }];

  const getPercentChange = (metric) => {
    if (!metric.baseline) return 0;
    return Math.round(
      ((metric.baseline - metric.current) / metric.baseline) * 100
    );
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setMetricForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    const matchedType = METRIC_TYPES.find((mt) => mt.key === type);
    setMetricForm((previous) => ({
      ...previous,
      type,
      unit: matchedType?.unit || '',
    }));
  };

  const handleSaveMetric = async (event) => {
    event.preventDefault();
    if (!metricForm.baseline || !metricForm.current) return;

    setSaving(true);
    try {
      const payload = {
        metricType: metricForm.type === 'water' ? 'WATER_USE' : 'CHEMICAL_INPUT',
        baselineValue: Number(metricForm.baseline),
        currentValue: Number(metricForm.current),
        unit: metricForm.unit,
        recordedDate: new Date().toISOString().split('T')[0],
        notes: metricForm.notes,
      };
      const created = await sustainabilityService.createMetric(payload);
      setMetrics((prev) => [...prev, normalizeMetric(created)]);
      setMetricForm({ type: 'water', baseline: '', current: '', unit: 'Litres', notes: '' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to save metric:', err);
      alert(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save metric.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Build chart points from waterTrend data
  const buildChartPoints = (data) => {
    const maxValue = Math.max(...data.map((item) => item.value));

    const startX = 10;
    const startY = 20;
    const chartWidth = 480;
    const chartHeight = 100;

    const stepX =
      data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;

    return data.map((item, index) => {
      const x = startX + index * stepX;

      const y =
        startY +
        (chartHeight - (item.value / maxValue) * chartHeight);

      return {
        x,
        y,
      };
    });
  };

  const points = buildChartPoints(waterTrend);

  const linePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(' ');


  if (loading) {
    return (
      <div className="sustainability-metrics-page">
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>Loading metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sustainability-metrics-page">
        <div className="card" style={{ padding: '24px', color: 'var(--clay)', textAlign: 'center' }}>
          {error}
          <br />
          <button className="btn btn-outline btn-sm" type="button" onClick={loadMetrics} style={{ marginTop: 12 }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sustainability-metrics-page">
      {!showAddForm ? (
        <>
          <button
            className="btn btn-primary btn-sm"
            type="button"
            onClick={() => setShowAddForm(true)}
          >
            + Add Metric
          </button>

          <div className="grid grid-3">
            {/* Overall Score */}
            <div className="card ring-card">
              <div className="gring">
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="var(--line)"
                    strokeWidth="8"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="var(--sprout)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 44}
                    strokeDashoffset={
                      2 *
                      Math.PI *
                      44 *
                      (1 - Math.min(Math.max(overallScore, 0), 100) / 100)
                    }
                    transform="rotate(-90 50 50)"
                  />
                </svg>

                <div className="gring-center">
                  <span className="gring-num">
                    {overallScore}
                  </span>
                </div>
              </div>

              <div className="stat-label">
                Sustainability Score
              </div>
            </div>

            {/* Total XP Card */}
            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'var(--harvest-light)' }}>
                🏆
              </div>
              <div className="stat-value positive">
                {totalXp} XP
              </div>
              <div className="stat-label">
                Total Gamification XP
              </div>
            </div>

            {/* Metric Cards */}
            {metrics.map((metric) => {
              const percentage = getPercentChange(metric);

              return (
                <div
                  className="card stat-card"
                  key={metric.id}
                >
                  <div
                    className="stat-icon"
                    style={{ background: metric.bg }}
                  >
                    {metric.icon}
                  </div>

                  <div
                    className={`stat-value ${
                      percentage >= 0 ? 'positive' : 'negative'
                    }`}
                  >
                    {percentage >= 0 ? '-' : '+'}
                    {Math.abs(percentage)}%
                  </div>

                  <div className="stat-label">
                    {metric.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Water Usage Trend */}
          <div className="section-title">
            <h3>📊 Water Usage Trend</h3>
          </div>

          <div className="card chart-card">
            <svg
              viewBox="0 0 560 160"
              width="100%"
              height="160"
            >
              <polyline
                points={linePoints}
                fill="none"
                stroke="#3E8FA0"
                strokeWidth="4"
              />

              <g fill="#3E8FA0">
                {points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="5"
                  />
                ))}
              </g>

              <g
                fill="#5B6B5C"
                fontSize="11"
              >
                {waterTrend.map((item, index) => (
                  <text
                    key={item.month}
                    x={points[index].x - 10}
                    y="150"
                  >
                    {item.month}
                  </text>
                ))}
              </g>
            </svg>
          </div>

          {/* Logged Metrics */}
          <div className="section-title">
            <h3>🌱 Logged Metrics</h3>
          </div>

          <div className="card metrics-list-card">
            {metrics.map((metric) => {
              const percentage = getPercentChange(metric);

              return (
                <div
                  className="metric-row"
                  key={metric.id}
                >
                  <div
                    className="icon-badge"
                    style={{ background: metric.bg }}
                  >
                    {metric.icon}
                  </div>

                  <div className="metric-row-info">
                    <b>
                      {metric.type === 'water'
                        ? 'Water Use'
                        : 'Chemical Input'}
                    </b>

                    <div className="metric-row-values">
                      Baseline: {metric.baseline} {metric.unit}
                      {' · '}
                      Current: {metric.current} {metric.unit}
                    </div>
                  </div>

                  <span
                    className={`metric-pct ${
                      percentage >= 0
                        ? 'positive'
                        : 'negative'
                    }`}
                  >
                    {percentage >= 0 ? '-' : '+'}
                    {Math.abs(percentage)}%
                  </span>
                </div>
              );
            })}
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
                <label htmlFor="metric-type">
                  Metric type
                </label>

                <select
                  id="metric-type"
                  name="type"
                  value={metricForm.type}
                  onChange={handleTypeChange}
                >
                  {METRIC_TYPES.map((metricType) => (
                    <option
                      key={metricType.key}
                      value={metricType.key}
                    >
                      {metricType.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="baseline">
                    Baseline value
                  </label>

                  <input
                    id="baseline"
                    name="baseline"
                    type="number"
                    min="0"
                    placeholder="e.g. 12000"
                    value={metricForm.baseline}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="field">
                  <label htmlFor="current">
                    Current value
                  </label>

                  <input
                    id="current"
                    name="current"
                    type="number"
                    min="0"
                    placeholder="e.g. 8100"
                    value={metricForm.current}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="metric-unit">
                  Unit
                </label>

                <select
                  id="metric-unit"
                  name="unit"
                  value={metricForm.unit}
                  onChange={handleFormChange}
                >
                  <option value="Litres">Litres</option>
                  <option value="Kilograms">
                    Kilograms
                  </option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="metric-notes">
                  Notes (optional)
                </label>

                <textarea
                  id="metric-notes"
                  name="notes"
                  rows="2"
                  placeholder="Any extra detail..."
                  value={metricForm.notes}
                  onChange={handleFormChange}
                />
              </div>

              <button
                className="btn btn-primary btn-block"
                type="submit"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Metric'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default SustainabilityMetrics;