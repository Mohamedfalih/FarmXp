import React, { useState, useMemo } from 'react';
import './Leaderboard.css';

const STATES = [
  'All States',
  'Kerala',
  'Tamil Nadu',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Goa',
  'Gujarat',
  'Odisha',
  'Punjab',
  'Haryana',
  'Rajasthan',
  'Uttar Pradesh',
  'Madhya Pradesh',
];

const TIME_TABS = [
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Time' },
];

// Sample datasets with state instead of district
const LEADERBOARD_DATA = {
  week: [
  {
    id: 1,
    name: "Gurumoorthy",
    initials: "GM",
    xp: 3340,
    score: 78,
    state: "Tamil Nadu",
    color: "#F2A93B",
  },
  {
    id: 2,
    name: "Velan K.",
    initials: "VK",
    xp: 2310,
    score: 68,
    state: "Tamil Nadu",
    color: "#B7A6E0",
  },
  {
    id: 7,
    name: "Arun Kumar",
    initials: "AK",
    xp: 2100,
    score: 66,
    state: "Tamil Nadu",
    color: "#6FA83A",
  },
  {
    id: 3,
    name: "Rithick K.",
    initials: "R",
    xp: 2910,
    score: 74,
    state: "Kerala",
    color: "#3E8FA0",
  },
  {
    id: 4,
    name: "Mohamed Falih",
    initials: "MF",
    xp: 2480,
    score: 72,
    state: "Kerala",
    color: "#6FA83A",
    isYou: true,
  }
],

  month: [
    { id: 1, name: 'Gurumoorthy', initials: 'GM', xp: 11200, score: 81, state: 'Tamil Nadu', color: '#F2A93B' },
    { id: 2, name: 'Anitha R.', initials: 'AR', xp: 9840, score: 75, state: 'Andhra Pradesh', color: '#8FBF9E' },
    { id: 3, name: 'Rithick K.', initials: 'R', xp: 9210, score: 73, state: 'Kerala', color: '#3E8FA0' },
    { id: 4, name: 'Mohamed Falih', initials: 'MF', xp: 8760, score: 72, state: 'Kerala', color: '#6FA83A', isYou: true },
    { id: 5, name: 'Selvi P.', initials: 'SP', xp: 8420, score: 70, state: 'Karnataka', color: '#C1552E' },
    { id: 6, name: 'Velan K.', initials: 'VK', xp: 7990, score: 68, state: 'Tamil Nadu', color: '#B7A6E0' },
  ],

  all: [
    { id: 1, name: 'Gurumoorthy', initials: 'GM', xp: 48500, score: 88, state: 'Tamil Nadu', color: '#F2A93B' },
    { id: 2, name: 'Rithick K.', initials: 'R', xp: 41200, score: 80, state: 'Kerala', color: '#3E8FA0' },
    { id: 3, name: 'Anitha R.', initials: 'AR', xp: 39750, score: 77, state: 'Andhra Pradesh', color: '#8FBF9E' },
    { id: 4, name: 'Mohamed Falih', initials: 'MF', xp: 36400, score: 72, state: 'Kerala', color: '#6FA83A', isYou: true },
    { id: 5, name: 'Selvi P.', initials: 'SP', xp: 34100, score: 70, state: 'Karnataka', color: '#C1552E' },
    { id: 6, name: 'Velan K.', initials: 'VK', xp: 31800, score: 68, state: 'Tamil Nadu', color: '#B7A6E0' },
  ],
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('week');
  const [state, setState] = useState('All States');

  const filtered = useMemo(() => {
    const dataset = LEADERBOARD_DATA[activeTab];

    const byState =
      state === 'All States'
        ? dataset
        : dataset.filter((f) => f.state === state);

    return [...byState].sort((a, b) => b.xp - a.xp);
  }, [activeTab, state]);

  const podium = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  const first = podium[0];
  const second = podium[1];
  const third = podium[2];

  return (
    <div className="leaderboard-page">
      <div className="lb-header">
        <div className="lb-trophy">🏆</div>
        <h2 className="lb-title">This Week's Top Growers</h2>

        <div className="tabbar">
          {TIME_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`tabbtn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          className="state-select"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {podium.length === 3 && (
        <div className="podium">
          <div className="podium-col podium-second">
            <div className="podium-avatar" style={{ background: second.color }}>
              {second.initials}
            </div>
            <div className="podium-name">{second.name}</div>
            <div className="podium-xp">{second.xp.toLocaleString()} XP</div>
            <div className="podium-block block-second">
              <span>🥈 2</span>
            </div>
          </div>

          <div className="podium-col podium-first">
            <div className="podium-crown">👑</div>
            <div
              className="podium-avatar avatar-first"
              style={{ background: first.color }}
            >
              {first.initials}
            </div>
            <div className="podium-name">{first.name}</div>
            <div className="podium-xp">{first.xp.toLocaleString()} XP</div>
            <div className="podium-block block-first">
              <span>🥇 1</span>
            </div>
          </div>

          <div className="podium-col podium-third">
            <div className="podium-avatar" style={{ background: third.color }}>
              {third.initials}
            </div>
            <div className="podium-name">{third.name}</div>
            <div className="podium-xp">{third.xp.toLocaleString()} XP</div>
            <div className="podium-block block-third">
              <span>🥉 3</span>
            </div>
          </div>
        </div>
      )}

      <div className="lb-list">
        {rest.map((farmer, idx) => (
          <div
            className={`lb-row ${farmer.isYou ? 'lb-row-you' : ''}`}
            key={farmer.id}
          >
            <div className="lb-rank">{idx + 4}</div>

            <div
              className="lb-avatar"
              style={{ background: farmer.color }}
            >
              {farmer.initials}
            </div>

            <div className="lb-info">
              <div className="lb-name">
                {farmer.name}
                {farmer.isYou && (
                  <span className="lb-you-tag"> (You)</span>
                )}
              </div>

              <div className="lb-sub">
                Sustainability score: {farmer.score}
              </div>
            </div>

            <div className="lb-xp">
              {farmer.xp.toLocaleString()} XP
            </div>
          </div>
        ))}

        {rest.length === 0 && (
          <div className="lb-empty">
            No more farmers in this state yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;