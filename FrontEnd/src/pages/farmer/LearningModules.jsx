import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import learningService from '../../services/learningService';
import './LearningModules.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'soil', label: '🌱 Soil' },
  { key: 'water', label: '💧 Water' },
  { key: 'organic', label: '🧪 Organic' },
  { key: 'pest', label: '🌱 Pest Control' },
];

const LearningModules = () => {

  const navigate = useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [modules, setModules] = useState([]);
  const [progressData, setProgressData] = useState([]);

  const [activeCategory, setActiveCategory] =
    useState('all');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  // ==========================================================
  // LOAD MODULES
  // ==========================================================

  useEffect(() => {

    loadModules();

  }, []);

  const loadModules = async () => {

    setLoading(true);
    setError('');

    try {
      const [modulesRes, progressRes] = await Promise.all([
        learningService.getModules(),
        learningService.getModuleProgress().catch(() => []) // Fallback to empty array if progress API fails
      ]);

      const modulesList = Array.isArray(modulesRes) ? modulesRes : (modulesRes?.modules ?? modulesRes?.content ?? []);
      const progressList = Array.isArray(progressRes) ? progressRes : (progressRes?.progress ?? []);
      
      setModules(modulesList);
      setProgressData(progressList);

    } catch (err) {

      console.error(
        'Failed to load learning modules:',
        err.response?.data ||
        err.message ||
        err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        'Unable to load learning modules.';

      setError(message);

    } finally {

      setLoading(false);

    }
  };

  // ==========================================================
  // FILTER MODULES
  // ==========================================================

  const filteredModules =
    activeCategory === 'all'
      ? modules
      : modules.filter((module) => {

          const category =
            String(
              module?.category || ''
            ).toLowerCase();

          return category.includes(
            activeCategory
          );

        });

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="modules-page">

        <div className="modules-empty">

          Loading learning modules...

        </div>

      </div>
    );

  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (
      <div className="modules-page">

        <div
          className="modules-empty"
          style={{
            color: 'var(--clay)'
          }}
        >

          {error}

          <br />

          <button
            type="button"
            className="tabbtn"
            onClick={loadModules}
            style={{
              marginTop: '15px',
              background: 'var(--soil)',
              color: '#fff'
            }}
          >
            Try Again
          </button>

        </div>

      </div>
    );

  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="modules-page">

      {/* ======================================================
          CATEGORY FILTER
      ======================================================= */}

      <div className="tabbar">

        {CATEGORIES.map((cat) => (

          <button
            key={cat.key}
            type="button"
            className={
              `tabbtn ${
                activeCategory === cat.key
                  ? 'active'
                  : ''
              }`
            }
            onClick={() =>
              setActiveCategory(cat.key)
            }
          >

            {cat.label}

          </button>

        ))}

      </div>

      {/* ======================================================
          MODULE GRID
      ======================================================= */}

      <div className="grid grid-3">

        {filteredModules.map((module) => {

          const moduleId =
            module?.moduleId;

          const category =
            String(
              module?.category || ''
            );

          const categoryUpper =
            category.toUpperCase();

          const icon =
            module?.icon ||
            '📚';

          const duration =
            module?.durationMinutes ??
            0;

          const xp =
            module?.xpReward ??
            0;

          /*
           * Use actual progress from backend.
           */
          const moduleProgressObj = progressData.find(p => p.moduleId === moduleId);
          const progress = moduleProgressObj ? moduleProgressObj.completionPercentage || 0 : 0;

          // ====================================================
          // CATEGORY DESIGN
          // ====================================================

          let heroBg =
            'var(--sprout-light)';

          let tagBg =
            'var(--sprout-light)';

          let tagCol =
            'var(--sprout)';

          if (
            categoryUpper.includes('WATER')
          ) {

            heroBg =
              'var(--sky-light)';

            tagBg =
              'var(--sky-light)';

            tagCol =
              'var(--sky)';

          } else if (
            categoryUpper.includes('ORGANIC')
          ) {

            heroBg =
              'var(--clay-light)';

            tagBg =
              'var(--clay-light)';

            tagCol =
              'var(--clay)';

          } else if (
            categoryUpper.includes('PEST')
          ) {

            heroBg =
              'var(--harvest-light)';

            tagBg =
              'var(--harvest-light)';

            tagCol =
              '#9A6A0E';

          } else if (
            categoryUpper.includes('SOIL') ||
            categoryUpper.includes('CROP')
          ) {

            heroBg =
              'var(--sprout-light)';

            tagBg =
              'var(--sprout-light)';

            tagCol =
              'var(--sprout)';

          }

          return (

            <div
              className="card module-card"
              key={moduleId}
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate(
                  `/farmer/learning-modules/${moduleId}`
                )
              }
              onKeyDown={(e) => {

                if (e.key === 'Enter') {

                  navigate(
                    `/farmer/learning-modules/${moduleId}`
                  );

                }

              }}
            >

              {/* =================================================
                  MODULE ICON
              ================================================== */}

              <div
                className="module-hero"
                style={{
                  background: heroBg
                }}
              >

                {icon}

              </div>

              {/* =================================================
                  MODULE BODY
              ================================================== */}

              <div className="module-body">

                {/* CATEGORY */}

                <span
                  className="module-tag"
                  style={{
                    background: tagBg,
                    color: tagCol
                  }}
                >

                  {categoryUpper ||
                    'LEARNING'}

                </span>

                {/* TITLE */}

                <div className="module-title">

                  {module?.title ||
                    'Learning Module'}

                </div>

                {/* DESCRIPTION */}

                {module?.description && (

                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--ink-soft)',
                      marginBottom: '10px',
                      lineHeight: '1.5'
                    }}
                  >

                    {module.description}

                  </div>

                )}

                {/* META */}

                <div className="module-meta">

                  <span>
                    🌱 {duration} min
                  </span>

                  <span>
                    🏆 {xp} XP
                  </span>

                </div>

                {/* PROGRESS */}

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`
                    }}
                  />

                </div>

                <div className="module-complete">

                  {progress}% complete

                </div>

              </div>

            </div>

          );

        })}

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredModules.length === 0 && (

          <div className="modules-empty">

            No modules in this category yet.

          </div>

        )}

      </div>

    </div>

  );

};

export default LearningModules;