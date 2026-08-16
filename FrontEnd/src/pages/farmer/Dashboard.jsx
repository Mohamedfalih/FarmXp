import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import farmerService from '../../services/farmerService';
import learningService from '../../services/learningService';
import aiService from '../../services/aiService';
import './Dashboard.css';

const quickActions = [
  {
    icon: '🤖',
    bg: 'var(--clay-light)',
    label: 'Ask AI',
    path: '/farmer/ai-assistant'
  },
  {
    icon: '📷',
    bg: 'var(--sprout-light)',
    label: 'Log Practice',
    path: '/farmer/practice-logs'
  },
  {
    icon: '💧',
    bg: 'var(--sky-light)',
    label: 'Add Metric',
    path: '/farmer/sustainability-metrics'
  },
  {
    icon: '🏛️',
    bg: 'var(--harvest-light)',
    label: 'Schemes',
    path: '/farmer/govt-schemes'
  }
];


const Dashboard = () => {

  const navigate = useNavigate();

  // ==========================================================
  // DASHBOARD STATE
  // ==========================================================

  const [dashboard, setDashboard] = useState(null);
  const [recommendedModules, setRecommendedModules] = useState([]);
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [mlRecommendation, setMlRecommendation] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard = async () => {

    setLoading(true);
    setError('');

    try {
      const data = await farmerService.getDashboard();
      setDashboard(data);
      
      // Fetch dynamic recommended data in parallel (swallow errors if they fail)
      Promise.allSettled([
        learningService.getModules(),
        farmerService.getSchemes(),
        aiService.getMlRecommendation()
      ]).then(([modulesResult, schemesResult, mlResult]) => {
        if (modulesResult.status === 'fulfilled') {
          const mods = Array.isArray(modulesResult.value) ? modulesResult.value : (modulesResult.value?.modules ?? []);
          setRecommendedModules(mods.slice(0, 3).map(m => ({
            id: m.id || m.moduleId,
            icon: '📚',
            bg: 'var(--sprout-light)',
            tag: m.category || 'LEARNING',
            tagBg: 'var(--sprout-light)',
            tagCol: 'var(--sprout)',
            title: m.title || m.moduleName,
            meta: [`🏆 ${m.xpReward || 100} XP`],
            prog: m.progress || 0,
            diff: m.difficulty || 'Beginner'
          })));
        }
        if (schemesResult.status === 'fulfilled') {
          const schs = Array.isArray(schemesResult.value) ? schemesResult.value : (schemesResult.value?.schemes ?? []);
          setRecommendedSchemes(schs.filter(s => s.eligible || s.isEligible).slice(0, 3).map(s => ({
            id: s.id || s.schemeId,
            icon: '🏛️',
            bg: 'var(--sky-light)',
            title: s.title || s.schemeName,
            desc: s.benefit || s.shortDescription || s.description,
            eligible: true,
            deadline: s.deadline || 'Ongoing'
          })));
        }
        if (mlResult.status === 'fulfilled') {
          setMlRecommendation(mlResult.value);
        }
      });
      
      // Fetch Weather based on location
      const district = data?.farmer?.district;
      if (district) {
          try {
              const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(district)}&count=1`);
              const geoData = await geoRes.json();
              
              if (geoData.results && geoData.results.length > 0) {
                  const { latitude, longitude } = geoData.results[0];
                  const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`);
                  const weatherData = await weatherRes.json();
                  
                  if (weatherData.current_weather) {
                      const humidity = weatherData.hourly?.relative_humidity_2m?.[0] || 'N/A';
                      setTodayTasks([{
                          title: `Weather in ${district}`,
                          sub: `${weatherData.current_weather.temperature}°C, Wind: ${weatherData.current_weather.windspeed} km/h, Hum: ${humidity}%`,
                          bg: 'var(--sky-light)',
                          icon: '☀️'
                      }]);
                  } else {
                      setTodayTasks([]);
                  }
              } else {
                  setTodayTasks([]);
              }
          } catch (weatherErr) {
              console.error("Failed to load weather:", weatherErr);
              setTodayTasks([{
                  title: `Weather Unavailable`,
                  sub: `Could not load weather for ${district}`,
                  bg: 'var(--clay-light)',
                  icon: '⚠️'
              }]);
          }
      } else {
          setTodayTasks([]);
      }
    } catch (err) {
      console.error(
        'Failed to load dashboard:',
        err.response?.data ||
        err.message ||
        err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        'Unable to load dashboard.';

      setError(message);

    } finally {

      setLoading(false);

    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="dash">

        <div
          className="card"
          style={{
            padding: '24px',
            marginTop: '20px'
          }}
        >
          <p>
            Loading your dashboard...
          </p>
        </div>

      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (
      <div className="dash">

        <div
          className="auth-error"
          style={{
            marginTop: '20px'
          }}
        >
          {error}
        </div>

        <button
          className="btn btn-outline btn-sm"
          type="button"
          onClick={loadDashboard}
          style={{
            marginTop: '15px'
          }}
        >
          Try Again
        </button>

      </div>
    );
  }

  // ==========================================================
  // SAFE DATA
  // ==========================================================

  const farmer =
    dashboard?.farmer || {};

  const crops =
    Array.isArray(dashboard?.crops)
      ? dashboard.crops
      : [];

  const learning =
    dashboard?.learning || {};

  const sustainability =
    dashboard?.sustainability || {};

  // ==========================================================
// FARMER INFORMATION
// ==========================================================

const farmerName =
  farmer.fullName ||
  'Farmer';

// Calculate total acres from all crops
const totalCropAcres =
  crops.reduce(
    (total, crop) => {
      const area =
        Number(crop?.area) || 0;

      const unit =
        String(crop?.areaUnit || '')
          .toUpperCase();

      // Currently dashboard uses ACRES
      if (
        unit === 'ACRE' ||
        unit === 'ACRES'
      ) {
        return total + area;
      }

      return total;
    },
    0
  );

const farmSize =
  totalCropAcres > 0
    ? `${totalCropAcres} ACRES`
    : farmer.farmSize !== null &&
      farmer.farmSize !== undefined
      ? `${farmer.farmSize} ${
          farmer.farmSizeUnit || 'ACRE'
        }`
      : 'Not specified';

const locationParts = [
  farmer.village,
  farmer.district,
  farmer.state
].filter(Boolean);

const location =
  locationParts.length > 0
    ? locationParts.join(', ')
    : 'Location not specified';

  // ==========================================================
  // CROPS
  // ==========================================================

  const primaryCrop =
    crops.length > 0
      ? crops[0]?.cropName || 'Not specified'
      : 'Not specified';

  const secondaryCrop =
    crops.length > 1
      ? crops[1]?.cropName || 'Not specified'
      : 'Not specified';

  const cropNames =
    crops
      .map((crop) => crop?.cropName)
      .filter(Boolean)
      .slice(0, 4);

  const cropSummary =
    cropNames.length > 0
      ? cropNames.join(' & ')
      : 'No crops added';

  // ==========================================================
  // SUSTAINABILITY SCORE
  // ==========================================================

  const rawScore =
    sustainability?.score ??
    sustainability?.sustainabilityScore ??
    sustainability?.totalScore ??
    sustainability?.overallScore ??
    0;

  const sustainabilityScore =
    Number(rawScore) || 0;

  const safeScore =
    Math.min(
      100,
      Math.max(
        0,
        sustainabilityScore
      )
    );

  // ==========================================================
  // LEARNING DATA
  // ==========================================================

  const completedModules =
    learning?.completedModules ??
    learning?.modulesCompleted ??
    0;

  const totalModules =
    learning?.totalModules ??
    learning?.modulesCount ??
    0;

  const learningProgress =
    learning?.progress ??
    learning?.completionPercentage ??
    (
      totalModules > 0
        ? Math.round(
            (completedModules /
              totalModules) *
              100
          )
        : 0
    );

  // ==========================================================
  // STAT CARDS
  // ==========================================================

  const statCards = [

    {
      icon: '🏆',
      bg: 'var(--harvest-light)',
      trend: '+120',
      value:
        farmer?.totalXp ??
        0,
      label: 'Total XP'
    },

    {
      icon: '📚',
      bg: 'var(--sprout-light)',
      trend:
        totalModules > 0
          ? `${totalModules - completedModules} left`
          : 'Learning',
      value:
        totalModules > 0
          ? `${completedModules}/${totalModules}`
          : '—',
      label: 'Modules Completed'
    },

    {
      icon: '💧',
      bg: 'var(--sky-light)',
      trend: 'Score',
      value: safeScore,
      label: 'Sustainability Score'
    },

    {
      icon: '🧪',
      bg: 'var(--clay-light)',
      trend:
        sustainability?.pendingPractices !==
        undefined
          ? `${sustainability.pendingPractices} pending`
          : 'Practices',
      value:
        sustainability?.certifiedPractices ??
        sustainability?.verifiedPractices ??
        '—',
      label: 'Certified Practices'
    }

  ];

  // ==========================================================
  // FARM SUMMARY
  // ==========================================================

  const farmSummary = {

    farmSize,

    soilType:
      farmer.soilType ||
      'Not specified',

    primaryCrop,

    secondaryCrop,

    irrigation:
      farmer.irrigationType ||
      'Not specified',

    farmingType:
      farmer.farmingType ||
      'Not specified'
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="dash">

      {/* =====================================================
          GREETING HERO
      ====================================================== */}

      <div className="dash-hero">

        <div>

          <div className="dash-hero-eyebrow">
            GOOD MORNING
          </div>

          <h2 className="dash-hero-name">

            {farmerName} 🌱

          </h2>

          <div className="dash-hero-sub">

            {farmSize}
            {' · '}
            {cropSummary}
            {' · '}
            {location}

          </div>

        </div>

        <div className="gring">

          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
          >

            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="8"
            />

            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="#F2A93B"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={
                2 * Math.PI * 42
              }
              strokeDashoffset={
                2 *
                Math.PI *
                42 *
                (1 - safeScore / 100)
              }
            />

          </svg>

          <div className="gring-center">

            <span
              className="gring-num"
              style={{
                fontSize: '22px'
              }}
            >
              {safeScore}
            </span>

            <span
              className="gring-sub"
              style={{
                color: '#fff'
              }}
            >
              SCORE
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div
        className="grid grid-4"
        style={{
          marginTop: 22
        }}
      >

        {statCards.map((s) => (

          <div
            className="card stat-card"
            key={s.label}
          >

            <div className="stat-top">

              <div
                className="stat-icon"
                style={{
                  background: s.bg
                }}
              >
                {s.icon}
              </div>

              <span className="stat-trend trend-up">
                {s.trend}
              </span>

            </div>

            <div className="stat-value">
              {s.value}
            </div>

            <div className="stat-label">
              {s.label}
            </div>

          </div>

        ))}

      </div>

      {/* =====================================================
          FARM SUMMARY
      ====================================================== */}

      <div className="section-title">

        <h3>
          🌾 Farm Summary
        </h3>

      </div>

      <div className="card farm-summary-card">

        <div className="farm-summary-grid">

          <div className="farm-summary-item">

            <div className="farm-summary-label">
              FARM SIZE
            </div>

            <div className="farm-summary-value">
              {farmSummary.farmSize}
            </div>

          </div>

          <div className="farm-summary-item">

            <div className="farm-summary-label">
              SOIL TYPE
            </div>

            <div className="farm-summary-value">
              {farmSummary.soilType}
            </div>

          </div>

          <div className="farm-summary-item">

            <div className="farm-summary-label">
              PRIMARY CROP
            </div>

            <div className="farm-summary-value">
              {farmSummary.primaryCrop}
            </div>

          </div>

          <div className="farm-summary-item">

            <div className="farm-summary-label">
              SECONDARY CROP
            </div>

            <div className="farm-summary-value">
              {farmSummary.secondaryCrop}
            </div>

          </div>

          <div className="farm-summary-item">

            <div className="farm-summary-label">
              IRRIGATION
            </div>

            <div className="farm-summary-value">
              {farmSummary.irrigation}
            </div>

          </div>

          <div className="farm-summary-item">

            <div className="farm-summary-label">
              FARMING TYPE
            </div>

            <div className="farm-summary-value">
              {farmSummary.farmingType}
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          XP GOAL + QUICK ACTIONS
      ====================================================== */}

      <div
        className="grid grid-2"
        style={{
          marginTop: 20
        }}
      >

        <div className="card xpgoal-card">

          <div
            className="icon-badge harvest"
            style={{
              width: 52,
              height: 52,
              fontSize: 24
            }}
          >
            🎯
          </div>

          <div
            style={{
              flex: 1
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8
              }}
            >

              <b
                style={{
                  fontSize: 14
                }}
              >
                Today's XP Goal
              </b>

              <span
                className="mono"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--ink-soft)'
                }}
              >

                {farmer?.totalXp ??
                  0} XP

              </span>

            </div>

            <div className="xpgoal-track">

              <div
                className="xpgoal-fill"
                style={{
                  width: `${Math.min(
                    100,
                    (
                      (
                        Number(
                          farmer?.totalXp ??
                          0
                        ) /
                        Number(
                          1000
                        )
                      ) *
                      100
                    )
                  )}%`
                }}
              />

            </div>

          </div>

        </div>

        <div className="quick-actions">

          {quickActions.map((qa) => (

            <button
              className="qa-btn"
              key={qa.label}
              type="button"
              onClick={() =>
                navigate(qa.path)
              }
            >

              <div
                className="ic"
                style={{
                  background: qa.bg
                }}
              >
                {qa.icon}
              </div>

              <div className="lb">
                {qa.label}
              </div>

            </button>

          ))}

        </div>

      </div>

      {/* =====================================================
          TODAY'S FARMING TASKS
      ====================================================== */}

      <div className="section-title">

        <h3>
          ☀️ Today's Farming Tasks
        </h3>

      </div>

      <div className="grid grid-3">

        {todayTasks.map((t) => (

          <div
            className="card task-card"
            key={t.title}
          >

            <div
              className="icon-badge"
              style={{
                background: t.bg,
                width: 44,
                height: 44,
                fontSize: 20
              }}
            >
              {t.icon}
            </div>

            <div>

              <div className="task-title">
                {t.title}
              </div>

              <div className="task-sub">
                {t.sub}
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* =====================================================
          ML RECOMMENDATION
      ====================================================== */}
      {mlRecommendation && (
        <>
          <div className="section-title">
            <h3>🧠 AI ML Insights</h3>
          </div>
          <div className="card ml-recommendation-card" style={{ marginBottom: '24px', background: 'var(--sprout-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="module-tag" style={{ background: '#e0f2fe', color: '#0369a1', marginBottom: '8px', display: 'inline-block' }}>
                  ADOPTION STAGE: {mlRecommendation.cluster}
                </span>
                <h4 style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '8px' }}>
                  Recommendation: {mlRecommendation.recommendedModuleTitle}
                </h4>
                <p style={{ color: 'var(--ink-soft)', marginBottom: '16px', fontSize: '14px' }}>
                  {mlRecommendation.reason}
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span className="pill pill-neutral" style={{ background: '#f0fdfa', color: '#0f766e' }}>
                    💧 Water Benefit: {mlRecommendation.expectedBenefits?.water}
                  </span>
                  <span className="pill pill-neutral" style={{ background: '#fef3c7', color: '#b45309' }}>
                    🧪 Chemical Benefit: {mlRecommendation.expectedBenefits?.chemical}
                  </span>
                  <span className="pill pill-neutral" style={{ background: '#ecfdf5', color: '#047857' }}>
                    🌾 Yield Benefit: {mlRecommendation.expectedBenefits?.yield}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'center', background: '#fff', padding: '16px', borderRadius: '12px', minWidth: '100px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#ea580c' }}>{mlRecommendation.impactScore}</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: '600' }}>IMPACT SCORE</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================
          RECOMMENDED MODULES
      ====================================================== */}
      <div className="section-title">

        <h3>
          🤖 Recommended for You
        </h3>

        <button
          className="link-more"
          type="button"
          onClick={() =>
            navigate(
              '/farmer/learning-modules'
            )
          }
        >
          View all →
        </button>

      </div>

      <div className="grid grid-3">

        {recommendedModules.map((m) => (

          <div
            className="card module-card"
            key={m.title}
            role="button"
            tabIndex={0}
            onClick={() =>
              navigate(
                '/farmer/learning-modules'
              )
            }
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              navigate(
                '/farmer/learning-modules'
              )
            }
          >

            <div
              className="module-hero"
              style={{
                background: m.bg
              }}
            >
              {m.icon}
            </div>

            <div className="module-body">

              <span
                className="module-tag"
                style={{
                  background: m.tagBg,
                  color: m.tagCol
                }}
              >
                {m.tag}
              </span>

              <span
                className={`diff-badge diff-${m.diff.toLowerCase()}`}
              >
                {m.diff}
              </span>

              <div className="module-title">
                {m.title}
              </div>

              <div className="module-meta">

                <span>
                  {m.meta[0]}
                </span>

                <span>
                  {m.meta[1]}
                </span>

              </div>

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${m.prog}%`
                  }}
                />

              </div>

              <div className="module-complete">

                {m.prog}% complete

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* =====================================================
          GOVERNMENT SCHEMES
      ====================================================== */}

      <div className="section-title">

        <h3>
          🏛️ Government Schemes for You
        </h3>

        <button
          className="link-more"
          type="button"
          onClick={() =>
            navigate(
              '/farmer/govt-schemes'
            )
          }
        >
          View all →
        </button>

      </div>

      <div className="grid grid-3">

        {recommendedSchemes.map((s) => (

          <div
            className="card scheme-card-official"
            key={s.title}
          >

            <div className="scheme-top">

              <div className="scheme-emblem">
                {s.icon}
              </div>

              {s.eligible ? (

                <span className="pill pill-approved">
                  ✅ Eligible
                </span>

              ) : (

                <span className="pill pill-neutral">
                  Check eligibility
                </span>

              )}

            </div>

            <div className="scheme-title">
              {s.title}
            </div>

            <div className="scheme-desc">

              <b>
                💰 Benefit:
              </b>

              {' '}

              {s.desc}

            </div>

            <div className="scheme-deadline">

              ⏰ Deadline: {s.deadline}

            </div>

            <button
              className="btn btn-outline btn-sm scheme-btn"
              type="button"
              onClick={() =>
                navigate(
                  '/farmer/govt-schemes'
                )
              }
            >
              📄 View Details
            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Dashboard;
