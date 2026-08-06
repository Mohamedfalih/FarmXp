import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './GovtSchemes.css';

const STATES = ['All States', 'Kerala', 'Tamil Nadu'];
const CROPS = ['All Crops', 'Paddy', 'Millets', 'Banana', 'Coconut'];
const TYPES = ['All Types', 'Organic', 'Subsidy', 'Credit', 'Livestock'];

const SCHEMES = [
  { id: 1, icon: '💧', bg: 'var(--sky-light)', title: 'PM Krishi Sinchayee Yojana', desc: 'Up to 55% subsidy on drip/sprinkler systems', eligible: true, deadline: '30 Sep 2026' },
  { id: 2, icon: '🌱', bg: 'var(--sprout-light)', title: 'Soil Health Card Scheme', desc: 'Free soil testing & nutrient recommendations', eligible: true, deadline: 'Ongoing' },
  { id: 3, icon: '🌾', bg: 'var(--harvest-light)', title: 'PM-KISAN', desc: '₹6,000/year direct income support', eligible: true, deadline: '15 Aug 2026' },
  { id: 4, icon: '🐄', bg: 'var(--clay-light)', title: 'National Livestock Mission', desc: 'Support for integrated farming setups', eligible: false, deadline: '31 Oct 2026' },
  { id: 5, icon: '🏦', bg: 'var(--sky-light)', title: 'Kisan Credit Card', desc: 'Low-interest crop loans up to ₹3 lakh', eligible: true, deadline: 'Ongoing' },
  { id: 6, icon: '♻️', bg: 'var(--sprout-light)', title: 'Organic Farming Promotion', desc: 'Certification & marketing support', eligible: false, deadline: '20 Sep 2026' },
];

const SchemeCard = ({ scheme, onClick }) => (
  <div
    className="card scheme-card-official"
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
  >
    <div className="scheme-top">
      <div className="scheme-emblem" style={{ background: scheme.bg }}>{scheme.icon}</div>
      {scheme.eligible ? (
        <span className="pill pill-approved">✅ Eligible</span>
      ) : (
        <span className="pill pill-neutral">Check eligibility</span>
      )}
    </div>
    <div className="scheme-title">{scheme.title}</div>
    <div className="scheme-desc">
      <b>💰 Benefit:</b> {scheme.desc}
    </div>
    <div className="scheme-deadline">⏰ Deadline: {scheme.deadline}</div>
    <button className="btn btn-outline btn-sm scheme-btn" type="button">
      📄 View Details
    </button>
  </div>
);

const GovtSchemes = () => {
  const navigate = useNavigate();

  // View is stored in the URL (?view=recommended|all) instead of local state.
  // This way, if the user navigates away to SchemeDetails and comes back,
  // the same URL (and therefore the same tab) is restored from history —
  // local useState would reset to the default on every remount.
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'recommended';

  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All States');
  const [cropFilter, setCropFilter] = useState('All Crops');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const setView = (nextView) => {
    setSearchParams(nextView === 'recommended' ? {} : { view: nextView });
  };

  const recommendedSchemes = SCHEMES.filter((s) => s.eligible).slice(0, 3);

  const filteredAll = useMemo(() => {
    return SCHEMES.filter((s) => {
      const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
      // stateFilter/cropFilter/typeFilter are placeholders until scheme records
      // carry that metadata — currently every scheme passes these filters.
      return matchesSearch;
    });
  }, [search]);

  const handleViewDetails = (schemeId) => {
    navigate(`/farmer/govt-schemes/${schemeId}`);
  };

  return (
    <div className="schemes-page">
      <div className="schemes-view-toggle">
        <button
          type="button"
          className={`viewbtn ${view === 'recommended' ? 'active' : ''}`}
          onClick={() => setView('recommended')}
        >
          Recommended for You
        </button>
        <button
          type="button"
          className={`viewbtn ${view === 'all' ? 'active' : ''}`}
          onClick={() => setView('all')}
        >
          Explore All Schemes
        </button>
      </div>

      {view === 'recommended' && (
        <>
          <div className="section-title" style={{ marginTop: 0 }}>
            <h3>🏛️ Recommended for Your Farm</h3>
            <button className="link-more" type="button" onClick={() => setView('all')}>
              Browse all →
            </button>
          </div>
          <div className="grid grid-3">
            {recommendedSchemes.map((s) => (
              <SchemeCard key={s.id} scheme={s} onClick={() => handleViewDetails(s.id)} />
            ))}
          </div>
        </>
      )}

      {view === 'all' && (
        <>
          <div className="schemes-filters">
            <input
              className="schemes-search"
              placeholder="🔍 Search schemes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select value={cropFilter} onChange={(e) => setCropFilter(e.target.value)}>
              {CROPS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-3">
            {filteredAll.map((s) => (
              <SchemeCard key={s.id} scheme={s} onClick={() => handleViewDetails(s.id)} />
            ))}

            {filteredAll.length === 0 && (
              <div className="schemes-empty">No schemes match your search.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GovtSchemes;