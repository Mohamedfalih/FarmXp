import { useState } from 'react';
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

const SustainabilityMetrics = () => {
  // Mock data — matches the prototype's overview stats.
  // Later this becomes: metricsService.getMetrics().then(setMetrics)
  const [metrics, setMetrics] = useState([
    {
      id: 1,
      type: 'water',
      icon: '💧',
      bg: 'var(--sky-light)',
      baseline: 12000,
      current: 8100,
      unit: 'Litres',
      label: 'Water use vs baseline',
    },
    {
      id: 2,
      type: 'chemical',
      icon: '🧪',
      bg: 'var(--clay-light)',
      baseline: 40,
      current: 22,
      unit: 'Kilograms',
      label: 'Chemical input vs baseline',
    },
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

  // Overall sustainability score
  // Formula: (baseline - current) / baseline * 100
  const overallScore = Math.round(
    metrics.reduce((sum, metric) => {
      if (!metric.baseline) return sum;

      const percentage =
        ((metric.baseline - metric.current) / metric.baseline) * 100;

      return sum + percentage;
    }, 0) / (metrics.length || 1)
  );

  const getPercentChange = (metric) => {
    if (!metric.baseline) return 0;

    return Math.round(
      ((metric.baseline - metric.current) / metric.baseline) * 100
    );
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setMetricForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;

    const matchedType = METRIC_TYPES.find(
      (metricType) => metricType.key === type
    );

    setMetricForm((previous) => ({
      ...previous,
      type,
      unit: matchedType?.unit || '',
    }));
  };

  const handleSaveMetric = (event) => {
    event.preventDefault();

    if (!metricForm.baseline || !metricForm.current) {
      return;
    }

    // Later this becomes:
    // metricsService.addMetric(metricForm)

    const typeInfo = METRIC_TYPES.find(
      (metricType) => metricType.key === metricForm.type
    );

    const newMetric = {
      id: Date.now(),
      type: metricForm.type,
      icon: metricForm.type === 'water' ? '💧' : '🧪',
      bg:
        metricForm.type === 'water'
          ? 'var(--sky-light)'
          : 'var(--clay-light)',
      baseline: Number(metricForm.baseline),
      current: Number(metricForm.current),
      unit: metricForm.unit,
      label: `${typeInfo.label.split(' ').slice(1).join(' ')} vs baseline`,
    };

    setMetrics((previous) => [...previous, newMetric]);

    setMetricForm({
      type: 'water',
      baseline: '',
      current: '',
      unit: 'Litres',
      notes: '',
    });

    setShowAddForm(false);
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
            <h3>📋 Logged Metrics</h3>
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
              >
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