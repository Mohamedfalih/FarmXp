import { useParams, useNavigate } from 'react-router-dom';
import './ModuleDetails.css';

// Mock data — same 6 modules used in LearningModules.jsx, same IDs.
// Later this becomes: learningService.getModuleById(id)
const MODULES = [
  {
    id: 1,
    icon: '🌱',
    bg: 'var(--sprout-light)',
    tag: 'SOIL HEALTH',
    tagBg: 'var(--sprout-light)',
    tagCol: 'var(--sprout)',
    title: 'Understanding Soil pH',
    duration: '8 min',
    xp: 100,
    prog: 100,
    diff: 'Beginner',
    description:
      'Soil pH determines how well your crops can absorb nutrients from the ground. This module teaches you how to test your soil\'s pH level using simple, affordable methods, how to read the results, and what steps to take if your soil is too acidic or too alkaline for your crops.',
    objectives: [
      'Test soil pH using a home testing kit or DIY method',
      'Understand the ideal pH range for common crops like paddy and millets',
      'Learn which natural amendments raise or lower soil pH',
      'Identify early signs of pH-related nutrient deficiency in plants',
    ],
  },
  {
    id: 2,
    icon: '💧',
    bg: 'var(--sky-light)',
    tag: 'WATER MGMT',
    tagBg: 'var(--sky-light)',
    tagCol: 'var(--sky, #3E8FA0)',
    title: 'Efficient Drip Irrigation',
    duration: '12 min',
    xp: 150,
    prog: 60,
    diff: 'Beginner',
    description:
      'Drip irrigation delivers water directly to the root zone, cutting water usage significantly compared to flood irrigation. This module walks you through setting up a basic drip system, spacing emitters correctly, and scheduling watering based on crop stage and weather.',
    objectives: [
      'Understand how drip irrigation reduces water waste vs. flood irrigation',
      'Learn correct emitter spacing for paddy, millets, and vegetables',
      'Build a simple watering schedule based on crop growth stage',
      'Spot and fix common drip line clogging issues',
    ],
  },
  {
    id: 3,
    icon: '🧪',
    bg: 'var(--clay-light)',
    tag: 'ORGANIC',
    tagBg: 'var(--clay-light)',
    tagCol: 'var(--clay, #C1552E)',
    title: 'Making Bio-Pesticides',
    duration: '10 min',
    xp: 120,
    prog: 0,
    diff: 'Intermediate',
    description:
      'Learn how to prepare effective, low-cost bio-pesticides from neem, garlic, and other locally available materials. This module covers safe preparation, correct dilution ratios, and application timing so you can protect crops without relying on chemical pesticides.',
    objectives: [
      'Prepare neem-based bio-pesticide from raw neem leaves or seeds',
      'Understand safe dilution ratios for different pest severities',
      'Learn the best time of day to apply bio-pesticides for maximum effect',
      'Identify which pests respond best to organic treatment methods',
    ],
  },
  {
    id: 4,
    icon: '🐛',
    bg: 'var(--harvest-light)',
    tag: 'PEST CONTROL',
    tagBg: 'var(--harvest-light)',
    tagCol: '#9A6A0E',
    title: 'Natural Pest Deterrents',
    duration: '9 min',
    xp: 110,
    prog: 30,
    diff: 'Beginner',
    description:
      'Beyond sprays, many pests can be discouraged using companion planting, physical barriers, and natural repellents. This module introduces low-effort, low-cost techniques to keep common pests away from paddy and vegetable crops throughout the season.',
    objectives: [
      'Use companion planting to naturally repel common pests',
      'Set up simple physical barriers and traps',
      'Recognize early pest activity before it spreads',
      'Combine natural deterrents with your existing practices for best results',
    ],
  },
  {
    id: 5,
    icon: '🌾',
    bg: 'var(--sprout-light)',
    tag: 'CROP CARE',
    tagBg: 'var(--sprout-light)',
    tagCol: 'var(--sprout)',
    title: 'Crop Rotation Basics',
    duration: '11 min',
    xp: 130,
    prog: 100,
    diff: 'Intermediate',
    description:
      'Rotating crops season to season prevents soil nutrient depletion and breaks pest and disease cycles. This module explains how to plan a simple rotation schedule suited to Kerala\'s cropping seasons, using your existing crops as a starting point.',
    objectives: [
      'Understand why continuous mono-cropping depletes soil health',
      'Plan a basic 2–3 season rotation using your current crops',
      'Match rotation crops to Kharif, Rabi, and Summer seasons',
      'Track rotation impact on soil and yield over time',
    ],
  },
  {
    id: 6,
    icon: '♻️',
    bg: 'var(--harvest-light)',
    tag: 'COMPOSTING',
    tagBg: 'var(--harvest-light)',
    tagCol: '#9A6A0E',
    title: 'Composting Basics',
    duration: '7 min',
    xp: 90,
    prog: 0,
    diff: 'Advanced',
    description:
      'Turn farm and kitchen waste into nutrient-rich compost that improves soil structure and reduces the need for external fertilizer. This module covers the ideal green-to-brown material ratio, moisture management, and how long to wait before compost is ready to use.',
    objectives: [
      'Build a compost pile with the correct green-to-brown material ratio',
      'Maintain proper moisture and turning schedule',
      'Recognize when compost is fully matured and ready to apply',
      'Apply finished compost correctly without burning young plants',
    ],
  },
];

const getButtonLabel = (progress) => {
  if (progress === 100) return 'Completed';
  if (progress > 0) return 'Continue Module';
  return 'Start Module';
};

const ModuleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Later this becomes: learningService.getModuleById(id)
  const module = MODULES.find((m) => m.id === Number(id));

  const handleBack = () => {
    navigate('/farmer/learning-modules');
  };

  const handleStartModule = () => {
    // Later this becomes: learningService.startModule(module.id)
    console.log('Start/Continue module', module.id);
  };

  if (!module) {
    return (
      <div className="module-details-page">
        <button className="back-btn" type="button" onClick={handleBack}>
          ← Back to Learning Modules
        </button>

        <div className="card not-found-card">
          <div className="not-found-icon" aria-hidden="true">🔍</div>
          <h2>Module Not Found</h2>
          <p>The module you're looking for doesn't exist or may have been removed.</p>
          <button className="btn btn-primary" type="button" onClick={handleBack}>
            ← Back to Learning Modules
          </button>
        </div>
      </div>
    );
  }

  const buttonLabel = getButtonLabel(module.prog);
  const isCompleted = module.prog === 100;

  return (
    <div className="module-details-page">
      <button className="back-btn" type="button" onClick={handleBack}>
        ← Back to Learning Modules
      </button>

      <div className="card module-details-card">
        <div className="module-details-hero" style={{ background: module.bg }}>
          <span aria-hidden="true">{module.icon}</span>
        </div>

        <div className="module-details-body">
          <div className="module-details-tags">
            <span
              className="module-tag"
              style={{ background: module.tagBg, color: module.tagCol }}
            >
              {module.tag}
            </span>
            <span className={`diff-badge diff-${module.diff.toLowerCase()}`}>
              {module.diff}
            </span>
          </div>

          <h1 className="module-details-title">{module.title}</h1>

          <div className="module-details-meta">
            <span>⏱️ {module.duration}</span>
            <span>🏆 {module.xp} XP</span>
          </div>

          <div className="module-details-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${module.prog}%` }} />
            </div>
            <span className="progress-pct">{module.prog}% complete</span>
          </div>

          <section aria-labelledby="module-desc-heading">
            <h2 id="module-desc-heading" className="section-heading">
              About this module
            </h2>
            <p className="module-details-desc">{module.description}</p>
          </section>

          <section aria-labelledby="module-objectives-heading">
            <h2 id="module-objectives-heading" className="section-heading">
              What you'll learn
            </h2>
            <ul className="objectives-list">
              {module.objectives.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </section>

          <button
            className={`btn btn-block ${isCompleted ? 'btn-completed' : 'btn-primary'}`}
            type="button"
            onClick={handleStartModule}
            disabled={isCompleted}
          >
            {isCompleted ? '✅ ' : ''}{buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetails;