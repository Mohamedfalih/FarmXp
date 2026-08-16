import React, { useState, useEffect, useMemo } from 'react';
import { Box, Card, Typography, TextField, InputAdornment, Button, Chip } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import farmerService from '../../services/farmerService';
import { formatDateForFrontend } from '../../services/farmerService';
import './GovtSchemes.css';
import SearchIcon from '@mui/icons-material/Search';

const STATES = ['All States', 'Kerala', 'Tamil Nadu'];
const CROPS = ['All Crops', 'Paddy', 'Millets', 'Banana', 'Coconut'];
const TYPES = ['All Types', 'Organic', 'Subsidy', 'Credit', 'Livestock'];

// Pick an icon based on scheme title/category if the backend doesn't supply one
const pickIcon = (scheme) => {
  if (scheme.icon) return scheme.icon;
  const title = (scheme.title ?? scheme.schemeName ?? '').toLowerCase();
  if (title.includes('water') || title.includes('irrigation') || title.includes('sinchayee')) return '💧';
  if (title.includes('soil')) return '🌱';
  if (title.includes('kisan') || title.includes('pm-kisan')) return '🌾';
  if (title.includes('livestock') || title.includes('animal')) return '🐄';
  if (title.includes('credit') || title.includes('card') || title.includes('loan')) return '🏦';
  if (title.includes('organic')) return '♻️';
  return '🏛️';
};

const pickBg = (scheme) => {
  if (scheme.bg) return scheme.bg;
  const icon = pickIcon(scheme);
  if (icon === '💧') return 'var(--sky-light)';
  if (icon === '🌱') return 'var(--sprout-light)';
  if (icon === '🌾') return 'var(--harvest-light)';
  if (icon === '🐄') return 'var(--clay-light)';
  if (icon === '🏦') return 'var(--sky-light)';
  if (icon === '♻️') return 'var(--sprout-light)';
  return 'var(--harvest-light)';
};

// Normalize a raw backend scheme record to what SchemeCard needs
const normalizeScheme = (raw) => ({
  id: raw.id ?? raw.schemeId,
  icon: pickIcon(raw),
  bg: pickBg(raw),
  title: raw.title ?? raw.schemeName ?? raw.name ?? 'Scheme',
  desc: raw.description ?? raw.benefits ?? raw.benefit ?? raw.shortDescription ?? '',
  eligible: raw.eligibility === 'Farmer' || raw.eligible || raw.isEligible || false,
  deadline: formatDateForFrontend(raw.lastDate) || raw.deadline || raw.applicationDeadline || 'Ongoing',
  officialWebsiteUrl: raw.officialWebsiteUrl ?? raw.websiteUrl ?? null,
  status: raw.status || 'ACTIVE',
  department: raw.department || 'General',
  minFarmSize: raw.minFarmSize || null,
  applicableCrops: raw.applicableCrops || null,
});

const SchemeCard = ({ scheme, onClick }) => {
  return (
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
      <div className="scheme-buttons" style={{ display: 'flex', gap: '8px' }}>
        <button className="btn btn-outline btn-sm scheme-btn" type="button" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          📄 View Details
        </button>
      </div>
    </div>
  );
};

const GovtSchemes = () => {
  const navigate = useNavigate();

  // View is stored in the URL (?view=recommended|all) instead of local state.
  // This way, if the user navigates away to SchemeDetails and comes back,
  // the same URL (and therefore the same tab) is restored from history —
  // local useState would reset to the default on every remount.
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'recommended';

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All States');
  const [cropFilter, setCropFilter] = useState('All Crops');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const setView = (nextView) => {
    setSearchParams(nextView === 'recommended' ? {} : { view: nextView });
  };

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await farmerService.getSchemes();
      const list = Array.isArray(data) ? data : (data?.schemes ?? data?.content ?? []);
      setSchemes(list.map(normalizeScheme));
    } catch (err) {
      console.error('Failed to load schemes:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load schemes.'
      );
    } finally {
      setLoading(false);
    }
  };

  const recommendedSchemes = schemes.filter((s) => s.eligible).slice(0, 3);

  const filteredAll = useMemo(() => {
    return schemes.filter((s) => {
      const matchesSearch = (s.title ?? '').toLowerCase().includes(search.toLowerCase());
      // stateFilter/cropFilter/typeFilter are placeholders until scheme records
      // carry that metadata — currently every scheme passes these filters.
      return matchesSearch;
    });
  }, [schemes, search]);

  const handleViewDetails = (schemeId) => {
    navigate(`/farmer/govt-schemes/${schemeId}`);
  };

  if (loading) {
    return (
      <div className="schemes-page">
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>Loading schemes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="schemes-page">
        <div className="card" style={{ padding: '24px', color: 'var(--clay)', textAlign: 'center' }}>
          {error}
          <br />
          <button className="btn btn-outline btn-sm" type="button" onClick={loadSchemes} style={{ marginTop: 12 }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            {recommendedSchemes.length === 0 ? (
              <div className="schemes-empty">No eligible schemes found.</div>
            ) : (
              recommendedSchemes.map((s) => (
                <SchemeCard key={s.id} scheme={s} onClick={() => handleViewDetails(s.id)} />
              ))
            )}
          </div>
        </>
      )}

      {view === 'all' && (
        <>
          <div className="schemes-filters">
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <SearchIcon sx={{ position: 'absolute', left: '10px', color: '#999', fontSize: '18px' }} />
              <input
                className="schemes-search"
                style={{ paddingLeft: '32px' }}
                placeholder="Search schemes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
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