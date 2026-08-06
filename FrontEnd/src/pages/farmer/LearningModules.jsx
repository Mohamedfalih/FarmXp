import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LearningModules.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'soil', label: '🌱 Soil' },
  { key: 'water', label: '💧 Water' },
  { key: 'organic', label: '🧪 Organic' },
  { key: 'pest', label: '🐛 Pest Control' },
];

// Full module list, matching the prototype's MODULES array
const MODULES = [
  { id: 1, category: 'soil', icon: '🌱', bg: 'var(--sprout-light)', tag: 'SOIL HEALTH', tagBg: 'var(--sprout-light)', tagCol: 'var(--sprout)', title: 'Understanding Soil pH', meta: ['⏱️ 8 min', '🏆 100 XP'], prog: 100, diff: 'Beginner' },
  { id: 2, category: 'water', icon: '💧', bg: 'var(--sky-light)', tag: 'WATER MGMT', tagBg: 'var(--sky-light)', tagCol: 'var(--sky)', title: 'Efficient Drip Irrigation', meta: ['⏱️ 12 min', '🏆 150 XP'], prog: 60, diff: 'Beginner' },
  { id: 3, category: 'organic', icon: '🧪', bg: 'var(--clay-light)', tag: 'ORGANIC', tagBg: 'var(--clay-light)', tagCol: 'var(--clay)', title: 'Making Bio-Pesticides', meta: ['⏱️ 10 min', '🏆 120 XP'], prog: 0, diff: 'Intermediate' },
  { id: 4, category: 'pest', icon: '🐛', bg: 'var(--harvest-light)', tag: 'PEST CONTROL', tagBg: 'var(--harvest-light)', tagCol: '#9A6A0E', title: 'Natural Pest Deterrents', meta: ['⏱️ 9 min', '🏆 110 XP'], prog: 30, diff: 'Beginner' },
  { id: 5, category: 'soil', icon: '🌾', bg: 'var(--sprout-light)', tag: 'CROP CARE', tagBg: 'var(--sprout-light)', tagCol: 'var(--sprout)', title: 'Crop Rotation Basics', meta: ['⏱️ 11 min', '🏆 130 XP'], prog: 100, diff: 'Intermediate' },
  { id: 6, category: 'organic', icon: '♻️', bg: 'var(--harvest-light)', tag: 'COMPOSTING', tagBg: 'var(--harvest-light)', tagCol: '#9A6A0E', title: 'Composting Basics', meta: ['⏱️ 7 min', '🏆 90 XP'], prog: 0, diff: 'Advanced' },
];

const LearningModules = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredModules =
    activeCategory === 'all'
      ? MODULES
      : MODULES.filter((m) => m.category === activeCategory);

  return (
    <div className="modules-page">
      <div className="tabbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            className={`tabbtn ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-3">
        {filteredModules.map((m) => (
          <div
            className="card module-card"
            key={m.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/farmer/learning-modules/${m.id}`)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/farmer/learning-modules/${m.id}`)}
          >
            <div className="module-hero" style={{ background: m.bg }}>{m.icon}</div>
            <div className="module-body">
              <span className="module-tag" style={{ background: m.tagBg, color: m.tagCol }}>
                {m.tag}
              </span>
              <span className={`diff-badge diff-${m.diff.toLowerCase()}`}>{m.diff}</span>
              <div className="module-title">{m.title}</div>
              <div className="module-meta">
                <span>{m.meta[0]}</span>
                <span>{m.meta[1]}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${m.prog}%` }} />
              </div>
              <div className="module-complete">{m.prog}% complete</div>
            </div>
          </div>
        ))}

        {filteredModules.length === 0 && (
          <div className="modules-empty">No modules in this category yet.</div>
        )}
      </div>
    </div>
  );
};

export default LearningModules;