import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import learningService from '../../services/learningService';
import './ModuleDetails.css';

const getButtonLabel = (progress) => {
  if (progress >= 100) return 'Completed';
  if (progress > 0) return 'Continue Module';
  return 'Start Module';
};

const getCategoryStyle = (category) => {
  const value = String(category || '').toLowerCase();

  if (value.includes('soil')) {
    return {
      bg: 'var(--sprout-light)',
      tagBg: 'var(--sprout-light)',
      tagCol: 'var(--sprout)',
      icon: '🌱',
      tag: 'SOIL HEALTH',
    };
  }

  if (value.includes('water')) {
    return {
      bg: 'var(--sky-light)',
      tagBg: 'var(--sky-light)',
      tagCol: 'var(--sky, #3E8FA0)',
      icon: '💧',
      tag: 'WATER MGMT',
    };
  }

  if (value.includes('organic')) {
    return {
      bg: 'var(--clay-light)',
      tagBg: 'var(--clay-light)',
      tagCol: 'var(--clay, #C1552E)',
      icon: '🧪',
      tag: 'ORGANIC',
    };
  }

  if (value.includes('pest')) {
    return {
      bg: 'var(--harvest-light)',
      tagBg: 'var(--harvest-light)',
      tagCol: '#9A6A0E',
      icon: '🌱',
      tag: 'PEST CONTROL',
    };
  }

  if (value.includes('crop')) {
    return {
      bg: 'var(--sprout-light)',
      tagBg: 'var(--sprout-light)',
      tagCol: 'var(--sprout)',
      icon: '🌾',
      tag: 'CROP CARE',
    };
  }

  if (value.includes('compost')) {
    return {
      bg: 'var(--harvest-light)',
      tagBg: 'var(--harvest-light)',
      tagCol: '#9A6A0E',
      icon: '♻️',
      tag: 'COMPOSTING',
    };
  }

  return {
    bg: 'var(--sprout-light)',
    tagBg: 'var(--sprout-light)',
    tagCol: 'var(--sprout)',
    icon: '🌱',
    tag: String(category || 'LEARNING').toUpperCase(),
  };
};

const parseObjectives = (objectives) => {
  if (!objectives) {
    return [];
  }

  if (Array.isArray(objectives)) {
    return objectives;
  }

  const value = String(objectives).trim();

  if (!value) {
    return [];
  }

  // Supports JSON array stored as String
  if (value.startsWith('[') && value.endsWith(']')) {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.warn('Unable to parse objectives JSON:', error);
    }
  }

  // Supports newline-separated objectives
  if (value.includes('\n')) {
    return value
      .split('\n')
      .map((item) => item.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean);
  }

  // Supports comma-separated objectives
  if (value.includes(',')) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [value];
};

const ModuleDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ==========================================================
  // LOAD MODULE
  // ==========================================================

  useEffect(() => {
    loadModule();
  }, [id]);

  const loadModule = async () => {

    setLoading(true);
    setError('');

    try {

      const moduleId = Number(id);

      if (!moduleId) {
        setError('Invalid module ID.');
        return;
      }

      console.log(
        'Loading learning module:',
        moduleId
      );

      const data =
        await learningService.getModuleContent(
          moduleId
        );

      console.log(
        'Learning Module Content:',
        data
      );

      setModule(data.module);
      // We could store games, but for now we'll just attach it to module state for convenience
      setModule({ ...data.module, games: data.games });

      // ------------------------------------------------------
      // Try to get farmer module progress
      // ------------------------------------------------------

      try {

        const progressData =
          await learningService.getModuleProgress();

        console.log(
          'Module Progress:',
          progressData
        );

        let currentProgress = 0;

        if (Array.isArray(progressData)) {

          const current =
            progressData.find(
              (item) =>
                Number(
                  item.moduleId ??
                  item.id
                ) === moduleId
            );

          if (current) {

            currentProgress =
              Number(
                current.progress ??
                current.completionPercentage ??
                current.progressPercentage ??
                0
              );

          }

        } else if (
          progressData &&
          Array.isArray(progressData.modules)
        ) {

          const current =
            progressData.modules.find(
              (item) =>
                Number(
                  item.moduleId ??
                  item.id
                ) === moduleId
            );

          if (current) {

            currentProgress =
              Number(
                current.progress ??
                current.completionPercentage ??
                current.progressPercentage ??
                0
              );

          }

        }

        setProgress(
          Math.min(
            100,
            Math.max(
              0,
              currentProgress
            )
          )
        );

      } catch (progressError) {

        // Module details should still work even if
        // progress endpoint is unavailable.

        console.warn(
          'Could not load module progress:',
          progressError
        );

        setProgress(0);
      }

    } catch (err) {

      console.error(
        'Failed to load learning module:',
        err.response?.data ||
        err.message ||
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch learning module.'
      );

    } finally {

      setLoading(false);

    }
  };

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {

    navigate(
      '/farmer/learning-modules'
    );

  };

  // ==========================================================
  // START MODULE
  // ==========================================================

  const handleStartModule = () => {

    if (!module) {
      return;
    }

    navigate(
      `/farmer/learning-modules/${module.moduleId}/start`
    );

  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="module-details-page">

        <button
          className="back-btn"
          type="button"
          onClick={handleBack}
        >
          ← Back to Learning Modules
        </button>

        <div
          className="card"
          style={{
            maxWidth: '720px',
            padding: '40px',
            textAlign: 'center'
          }}
        >
          <p>
            Loading module...
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
      <div className="module-details-page">

        <button
          className="back-btn"
          type="button"
          onClick={handleBack}
        >
          ← Back to Learning Modules
        </button>

        <div className="card not-found-card">

          <div
            className="not-found-icon"
            aria-hidden="true"
          >
            ⚠️
          </div>

          <h2>
            Unable to Load Module
          </h2>

          <p>
            {error}
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap'
            }}
          >

            <button
              className="btn btn-primary"
              type="button"
              onClick={loadModule}
            >
              🔄 Try Again
            </button>

            <button
              className="btn"
              type="button"
              onClick={handleBack}
              style={{
                background: 'var(--wheat)',
                color: 'var(--soil-dark)'
              }}
            >
              ← Back
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // MODULE NOT FOUND
  // ==========================================================

  if (!module) {

    return (
      <div className="module-details-page">

        <button
          className="back-btn"
          type="button"
          onClick={handleBack}
        >
          ← Back to Learning Modules
        </button>

        <div className="card not-found-card">

          <div
            className="not-found-icon"
            aria-hidden="true"
          >
            🔍
          </div>

          <h2>
            Module Not Found
          </h2>

          <p>
            The module you're looking for doesn't
            exist or may have been removed.
          </p>

          <button
            className="btn btn-primary"
            type="button"
            onClick={handleBack}
          >
            ← Back to Learning Modules
          </button>

        </div>

      </div>
    );
  }

  // ==========================================================
  // MODULE DISPLAY DATA
  // ==========================================================

  const style =
    getCategoryStyle(
      module.category
    );

  const objectives =
    parseObjectives(
      module.objectives
    );

  const duration =
    module.durationMinutes ??
    0;

  const xpReward =
    module.xpReward ??
    0;

  const safeProgress =
    Math.min(
      100,
      Math.max(
        0,
        Number(progress) || 0
      )
    );

  const buttonLabel =
    getButtonLabel(
      safeProgress
    );

  const isCompleted =
    safeProgress >= 100;

  return (

    <div className="module-details-page">

      {/* ====================================================
          BACK
      ===================================================== */}

      <button
        className="back-btn"
        type="button"
        onClick={handleBack}
      >
        ← Back to Learning Modules
      </button>

      {/* ====================================================
          MODULE CARD
      ===================================================== */}

      <div className="card module-details-card">

        {/* HERO */}

        <div
          className="module-details-hero"
          style={{
            background:
              module.icon
                ? style.bg
                : style.bg
          }}
        >

          <span aria-hidden="true">

            {module.icon ||
              style.icon}

          </span>

        </div>

        {/* BODY */}

        <div className="module-details-body">

          {/* TAGS */}

          <div className="module-details-tags">

            <span
              className="module-tag"
              style={{
                background:
                  style.tagBg,
                color:
                  style.tagCol
              }}
            >
              {style.tag}
            </span>

            <span className="diff-badge diff-beginner">

              {module.category
                ? String(
                    module.category
                  )
                    .toLowerCase()
                    .includes('advanced')
                  ? 'Advanced'
                  : 'Beginner'
                : 'Learning'}

            </span>

          </div>

          {/* TITLE */}

          <h1 className="module-details-title">

            {module.title}

          </h1>

          {/* META */}

          <div className="module-details-meta">

            <span>
              🌱 {duration} min
            </span>

            <span>
              🏆 {xpReward} XP
            </span>

          </div>

          {/* PROGRESS */}

          <div className="module-details-progress">

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width:
                    `${safeProgress}%`
                }}
              />

            </div>

            <span className="progress-pct">

              {safeProgress}% complete

            </span>

          </div>

          {/* DESCRIPTION */}

          <section
            aria-labelledby="module-desc-heading"
          >

            <h2
              id="module-desc-heading"
              className="section-heading"
            >
              About this module
            </h2>

            <p className="module-details-desc">

              {module.description ||
                'No description available for this module.'}

            </p>

          </section>

          {/* OBJECTIVES */}

          <section
            aria-labelledby="module-objectives-heading"
          >

            <h2
              id="module-objectives-heading"
              className="section-heading"
            >
              What you'll learn
            </h2>

            {objectives.length > 0 ? (

              <ul className="objectives-list">

                {objectives.map(
                  (objective, index) => (

                    <li key={index}>
                      {objective}
                    </li>

                  )
                )}

              </ul>

            ) : (

              <p className="module-details-desc">
                Learning objectives will be
                available soon.
              </p>

            )}

          </section>

            <button
              className={`btn btn-block ${
                isCompleted
                  ? 'btn-completed'
                  : 'btn-primary'
              }`}
              type="button"
              onClick={handleStartModule}
            >

              {isCompleted
                ? <>✅ Review Module</>
                : buttonLabel}

            </button>

        </div>

      </div>

    </div>
  );
};

export default ModuleDetails;