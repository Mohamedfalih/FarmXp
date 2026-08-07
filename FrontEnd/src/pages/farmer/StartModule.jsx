import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StartModule.css';

// Mock module content.
// Later:
// learningService.getModuleContent(id)
const MODULE_CONTENT = {
  1: {
    id: 1,
    title: 'Understanding Soil pH',
    category: 'SOIL HEALTH',
    icon: '🌱',
    bg: 'var(--sprout-light)',
    duration: '8 min',
    xp: 100,
    progress: 100,

    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',

    description:
      "Soil pH determines how well your crops can absorb nutrients from the ground. Learn how to test your soil's pH, understand the results, and improve soil conditions naturally.",

    objectives: [
      'Test soil pH using a home testing kit or DIY method',
      'Understand the ideal pH range for common crops',
      'Learn natural ways to improve acidic or alkaline soil',
      'Identify early signs of pH-related nutrient deficiency',
    ],

    schemes: [
      {
        id: 101,
        name: 'Soil Health Card Scheme',
        authority: 'Government of India',
        description:
          'Provides farmers with information about soil nutrient status and recommendations for appropriate soil management.',
      },
    ],
  },

  2: {
    id: 2,
    title: 'Efficient Drip Irrigation',
    category: 'WATER MANAGEMENT',
    icon: '💧',
    bg: 'var(--sky-light)',
    duration: '12 min',
    xp: 150,
    progress: 60,

    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',

    description:
      'Learn how drip irrigation delivers water directly to the root zone, reducing water wastage and improving irrigation efficiency.',

    objectives: [
      'Understand how drip irrigation reduces water waste',
      'Learn correct emitter spacing',
      'Create a watering schedule based on crop growth',
      'Identify common drip irrigation problems',
    ],

    schemes: [
      {
        id: 102,
        name: 'Per Drop More Crop',
        authority: 'Government of India',
        description:
          'Promotes efficient water use in agriculture through micro-irrigation technologies such as drip and sprinkler systems.',
      },
    ],
  },

  3: {
    id: 3,
    title: 'Making Bio-Pesticides',
    category: 'ORGANIC FARMING',
    icon: '🧪',
    bg: 'var(--clay-light)',
    duration: '10 min',
    xp: 120,
    progress: 0,

    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',

    description:
      'Learn how farmers can prepare low-cost bio-pesticides using locally available natural materials and apply them safely.',

    objectives: [
      'Understand the basics of bio-pesticides',
      'Learn about neem-based preparations',
      'Understand safe application practices',
      'Identify suitable organic pest-control methods',
    ],

    schemes: [
      {
        id: 103,
        name: 'Paramparagat Krishi Vikas Yojana',
        authority: 'Government of India',
        description:
          'Supports farmers in adopting organic farming practices and improving sustainable agricultural production.',
      },
    ],
  },

  4: {
    id: 4,
    title: 'Natural Pest Deterrents',
    category: 'PEST CONTROL',
    icon: '🐛',
    bg: 'var(--harvest-light)',
    duration: '9 min',
    xp: 110,
    progress: 30,

    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',

    description:
      'Discover natural ways to prevent and manage common agricultural pests using companion planting, barriers and natural repellents.',

    objectives: [
      'Recognize early signs of pest activity',
      'Use companion planting for pest management',
      'Set up simple physical barriers and traps',
      'Combine multiple natural pest-control methods',
    ],

    schemes: [
      {
        id: 104,
        name: 'National Mission on Sustainable Agriculture',
        authority: 'Government of India',
        description:
          'Promotes sustainable agricultural practices and improved resource management.',
      },
    ],
  },

  5: {
    id: 5,
    title: 'Crop Rotation Basics',
    category: 'CROP CARE',
    icon: '🌾',
    bg: 'var(--sprout-light)',
    duration: '11 min',
    xp: 130,
    progress: 100,

    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',

    description:
      "Learn how rotating crops between seasons can improve soil health, reduce pest pressure and maintain long-term farm productivity.",

    objectives: [
      'Understand the benefits of crop rotation',
      'Plan a simple seasonal crop rotation',
      'Reduce nutrient depletion in soil',
      'Break common pest and disease cycles',
    ],

    schemes: [
      {
        id: 105,
        name: 'National Mission on Sustainable Agriculture',
        authority: 'Government of India',
        description:
          'Supports sustainable agricultural practices that improve resource efficiency and farm productivity.',
      },
    ],
  },

  6: {
    id: 6,
    title: 'Composting Basics',
    category: 'COMPOSTING',
    icon: '♻️',
    bg: 'var(--harvest-light)',
    duration: '7 min',
    xp: 90,
    progress: 0,

    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',

    description:
      'Learn how to turn farm and kitchen waste into nutrient-rich compost that improves soil structure and reduces dependence on external fertilizers.',

    objectives: [
      'Understand the green-to-brown compost ratio',
      'Maintain appropriate moisture levels',
      'Know when compost is ready to use',
      'Apply finished compost safely to crops',
    ],

    schemes: [
      {
        id: 106,
        name: 'Paramparagat Krishi Vikas Yojana',
        authority: 'Government of India',
        description:
          'Supports organic farming practices and sustainable agricultural methods.',
      },
    ],
  },
};

const StartModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const module = MODULE_CONTENT[id];

  const handleBack = () => {
    navigate(`/farmer/learning-modules/${id}`);
  };

  const handleTakeQuiz = () => {
    // Later:
    // learningService.startQuiz(module.id)

    navigate(`/farmer/learning-modules/${module.id}/quiz`);
  };

  if (!module) {
    return (
      <div className="start-module-page">
        <button
          className="start-module-back"
          type="button"
          onClick={() => navigate('/farmer/learning-modules')}
        >
          ← Back to Learning Modules
        </button>

        <div className="start-module-card not-found">
          <div className="not-found-icon" aria-hidden="true">
            🔍
          </div>

          <h2>Module Not Found</h2>

          <p>
            The learning module you're looking for doesn't exist or may have
            been removed.
          </p>

          <button
            className="start-btn"
            type="button"
            onClick={() => navigate('/farmer/learning-modules')}
          >
            Back to Learning Modules
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="start-module-page">

      {/* Back */}
      <button
        className="start-module-back"
        type="button"
        onClick={handleBack}
      >
        ← Back to Module Details
      </button>

      {/* Module Header */}
      <div className="start-module-card module-header-card">
        <div
          className="module-header-icon"
          style={{ background: module.bg }}
          aria-hidden="true"
        >
          {module.icon}
        </div>

        <div className="module-header-content">
          <span className="module-category">
            {module.category}
          </span>

          <h1>{module.title}</h1>

          <div className="module-meta">
            <span>⏱️ {module.duration}</span>
            <span>🏆 {module.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="start-module-card progress-card">
        <div className="progress-header">
          <strong>Your Progress</strong>
          <span>{module.progress}%</span>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={module.progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="progress-value"
            style={{ width: `${module.progress}%` }}
          />
        </div>
      </div>

      {/* Video */}
      <div className="start-module-card">
        <h2 className="content-title">
          🎥 Learn Through Video
        </h2>

        <div className="video-wrapper">
          <iframe
            src={module.videoUrl}
            title={`${module.title} learning video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <p className="video-note">
          Watch the video carefully and review the learning material
          before attempting the quiz.
        </p>
      </div>

      {/* About */}
      <div className="start-module-card">
        <h2 className="content-title">
          📖 About This Module
        </h2>

        <p className="module-description">
          {module.description}
        </p>
      </div>

      {/* Objectives */}
      <div className="start-module-card">
        <h2 className="content-title">
          🎯 What You'll Learn
        </h2>

        <ul className="learning-objectives">
          {module.objectives.map((objective, index) => (
            <li key={index}>
              <span className="objective-check">✓</span>
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Government Schemes */}
      <div className="start-module-card">
        <h2 className="content-title">
          🏛️ Related Government Schemes
        </h2>

        <p className="schemes-intro">
          These government schemes are related to the sustainable
          farming practices covered in this module.
        </p>

        <div className="schemes-list">
          {module.schemes.map((scheme) => (
            <div className="scheme-card" key={scheme.id}>
              <div className="scheme-icon">
                🏛️
              </div>

              <div className="scheme-content">
                <h3>{scheme.name}</h3>

                <span className="scheme-authority">
                  {scheme.authority}
                </span>

                <p>{scheme.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

     {/* Quiz Gate */}
<div className="start-module-card quiz-gate-card">

  <div className="quiz-gate-header">
    <div className="quiz-gate-icon">
      🏆
    </div>

    <div>
      <span className="quiz-gate-label">
        MODULE CHALLENGE
      </span>

      <h2>Ready to Test Your Knowledge?</h2>

      <p>
        Complete the quiz to prove what you've learned
        and unlock your <strong>{module.xp} XP</strong> reward.
      </p>
    </div>
  </div>

  <div className="quiz-info-grid">

    <div className="quiz-info-item">
      <span className="quiz-info-icon">📝</span>
      <div>
        <strong>3 Questions</strong>
        <span>Quick assessment</span>
      </div>
    </div>

    <div className="quiz-info-item">
      <span className="quiz-info-icon">🎯</span>
      <div>
        <strong>70% Required</strong>
        <span>Passing score</span>
      </div>
    </div>

    <div className="quiz-info-item">
      <span className="quiz-info-icon">🏆</span>
      <div>
        <strong>{module.xp} XP</strong>
        <span>Reward</span>
      </div>
    </div>

  </div>

  <div className="quiz-gate-footer">

    <div className="quiz-requirement">
      🔒 Pass the quiz to complete this module
    </div>

    <button
      className="quiz-btn"
      type="button"
      onClick={handleTakeQuiz}
    >
      📝 Start Quiz →
    </button>

  </div>

</div>

    </div>
  );
};

export default StartModule;