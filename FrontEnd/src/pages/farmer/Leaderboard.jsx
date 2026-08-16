import React, { useState, useEffect, useMemo } from 'react';
import sustainabilityService from '../../services/sustainabilityService';
import farmerService from '../../services/farmerService';
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
  { key: 'WEEK', label: 'This Week' },
  { key: 'MONTH', label: 'This Month' },
  { key: 'ALL', label: 'All Time' },
];

// Palette for avatar backgrounds when the backend doesn't supply a color
const AVATAR_COLORS = [
  '#F2A93B', '#B7A6E0', '#6FA83A', '#3E8FA0', '#8FBF9E',
  '#C1552E', '#9A6A0E', '#2A6B78',
];

const colorForIndex = (idx) => AVATAR_COLORS[idx % AVATAR_COLORS.length];

// Derive initials from a name string
const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Map a backend leaderboard entry to the shape the UI renders
const normalizeEntry = (raw, idx, currentFarmerId) => {
  const id = raw.id ?? raw.farmerId ?? raw.userId ?? idx;
  return {
    id,
    name: raw.name ?? raw.farmerName ?? raw.fullName ?? 'Farmer',
    initials: raw.initials ?? getInitials(raw.name ?? raw.farmerName ?? raw.fullName ?? ''),
    xp: Number(raw.xp ?? raw.totalXp ?? raw.points ?? 0),
    score: Number(raw.sustainabilityScore ?? raw.score ?? 0),
    state: raw.state ?? raw.farmerState ?? '',
    color: raw.color ?? colorForIndex(idx),
    isYou: raw.isYou ?? raw.isCurrentUser ?? (currentFarmerId && id === currentFarmerId) ?? false,
    rank: raw.rank ?? idx + 1,
  };
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('WEEK');
  const [state, setState] = useState('All States');
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentFarmerId, setCurrentFarmerId] = useState(null);

  useEffect(() => {
    // Attempt to load the current farmer profile so we can highlight 'You'
    farmerService.getProfile()
      .then((profile) => {
        if (profile && profile.farmerId) {
          setCurrentFarmerId(profile.farmerId);
        } else if (profile && profile.id) {
          setCurrentFarmerId(profile.id);
        }
      })
      .catch((err) => console.log('Failed to load profile for leaderboard', err));
  }, []);

  // Re-fetch only when tab changes, since state filtering is client-side
  useEffect(() => {
    loadLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentFarmerId]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      // Always fetch all states from backend to allow client-side filtering
      const data = await sustainabilityService.getLeaderboard(activeTab, null);
      const list = Array.isArray(data) ? data : (data?.leaderboard ?? data?.entries ?? []);
      setAllData(list.map((raw, idx) => normalizeEntry(raw, idx, currentFarmerId)));
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load leaderboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter by state and sort by XP
  const filtered = useMemo(() => {
    let result = [...allData];
    
    if (state !== 'All States') {
      const normalizedSelected = state.trim().toLowerCase();
      result = result.filter(farmer => 
        farmer.state && farmer.state.trim().toLowerCase() === normalizedSelected
      );
    }

    // Sort by XP descending, tie-break with ID ascending
    result.sort((a, b) => {
      if (b.xp !== a.xp) {
        return b.xp - a.xp;
      }
      return a.id - b.id;
    });

    // Assign new ranks based on sorted position
    return result.map((farmer, idx) => ({
      ...farmer,
      rank: idx + 1
    }));
  }, [allData, state]);

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

      {loading && (
        <div className="lb-list">
          <div className="lb-empty">Loading leaderboard...</div>
        </div>
      )}

      {error && !loading && (
        <div className="lb-list">
          <div className="lb-empty" style={{ color: 'var(--clay)' }}>
            {error}
            <br />
            <button
              className="btn btn-outline btn-sm"
              type="button"
              onClick={loadLeaderboard}
              style={{ marginTop: 10 }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {filtered.length >= 3 && (
            <div className="podium">
              <div className="podium-col podium-second">
                <div className="podium-avatar" style={{ background: second.color }}>
                  {second.initials}
                </div>
                <div className="podium-name">{second.name}</div>
                <div className="podium-xp">{second.xp.toLocaleString()} XP</div>
                <div className="podium-block block-second">
                  <span>🏆 {second.rank}</span>
                </div>
              </div>

              <div className="podium-col podium-first">
                <div className="podium-crown">🏆</div>
                <div
                  className="podium-avatar avatar-first"
                  style={{ background: first.color }}
                >
                  {first.initials}
                </div>
                <div className="podium-name">{first.name}</div>
                <div className="podium-xp">{first.xp.toLocaleString()} XP</div>
                <div className="podium-block block-first">
                  <span>🏆 {first.rank}</span>
                </div>
              </div>

              <div className="podium-col podium-third">
                <div className="podium-avatar" style={{ background: third.color }}>
                  {third.initials}
                </div>
                <div className="podium-name">{third.name}</div>
                <div className="podium-xp">{third.xp.toLocaleString()} XP</div>
                <div className="podium-block block-third">
                  <span>🏆 {third.rank}</span>
                </div>
              </div>
            </div>
          )}

          <div className="lb-list">
            {/* If there are less than 3 farmers, the podium isn't shown, so we must render them in the normal list. 
                If there are >= 3 farmers, the first 3 are in the podium, so we render the rest. */}
            {(filtered.length < 3 ? filtered : rest).map((farmer) => {
              const displayRank = farmer.rank;
              return (
              <div
                className={`lb-row ${farmer.isYou ? 'lb-row-you' : ''}`}
                key={farmer.id}
              >
                <div className="lb-rank">{displayRank}</div>

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
            )})}

            {filtered.length === 0 && (
              <div className="lb-empty">
                No farmers found for this period.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;