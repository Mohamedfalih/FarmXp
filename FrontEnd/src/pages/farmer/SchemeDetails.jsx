import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import farmerService from '../../services/farmerService';
import { formatDateForFrontend } from '../../services/farmerService';
import './SchemeDetails.css';

// Pick a display icon from scheme data if the backend doesn't include one
const pickIcon = (scheme) => {
  if (scheme.icon) return scheme.icon;
  const title = (scheme.title ?? scheme.schemeName ?? '').toLowerCase();
  if (title.includes('irrigation') || title.includes('sinchayee')) return '💧';
  if (title.includes('soil')) return '🌱';
  if (title.includes('kisan')) return '🌾';
  if (title.includes('livestock') || title.includes('animal')) return '🐄';
  if (title.includes('credit') || title.includes('card')) return '🏦';
  if (title.includes('organic')) return '♻️';
  return '🏛️';
};

const pickBg = (scheme) => {
  if (scheme.bg) return scheme.bg;
  const title = (scheme.title ?? scheme.schemeName ?? '').toLowerCase();
  if (title.includes('irrigation') || title.includes('sinchayee')) return 'var(--sky-light)';
  if (title.includes('soil')) return 'var(--sprout-light)';
  if (title.includes('kisan')) return 'var(--harvest-light)';
  if (title.includes('livestock') || title.includes('animal')) return 'var(--clay-light)';
  if (title.includes('credit') || title.includes('card')) return 'var(--sky-light)';
  if (title.includes('organic')) return 'var(--sprout-light)';
  return 'var(--harvest-light)';
};

const pickCategoryColor = (scheme) => {
  if (scheme.categoryColor) return scheme.categoryColor;
  const bg = pickBg(scheme);
  if (bg.includes('sky')) return '#2A6B78';
  if (bg.includes('sprout')) return '#3E6B1E';
  if (bg.includes('harvest')) return '#9A6A0E';
  if (bg.includes('clay')) return '#C1552E';
  return '#4A5568';
};

// Normalize a raw backend scheme into the shape this detail view expects
const normalizeScheme = (raw) => ({
  id: raw.id ?? raw.schemeId,
  icon: pickIcon(raw),
  bg: pickBg(raw),
  categoryColor: pickCategoryColor(raw),
  category: raw.department ?? raw.category ?? raw.schemeType ?? raw.type ?? 'Government Scheme',
  title: raw.title ?? raw.schemeName ?? raw.name ?? 'Scheme',
  fullDescription: raw.description ?? raw.fullDescription ?? raw.details ?? '',
  benefit: raw.benefits ?? raw.benefit ?? raw.benefitDetails ?? '',
  eligibility: raw.eligibility ?? raw.eligibilityCriteria ?? 'All eligible farmers',
  documents: raw.documents ?? raw.requiredDocuments ?? 'As per scheme guidelines',
  deadline: formatDateForFrontend(raw.lastDate) || raw.deadline || raw.applicationDeadline || 'Ongoing',
  officialUrl: raw.officialWebsiteUrl ?? raw.officialUrl ?? raw.websiteUrl ?? raw.url ?? null,
  status: raw.status ?? 'ACTIVE',
  minFarmSize: raw.minFarmSize ?? null,
  applicableCrops: raw.applicableCrops ?? null,
});

const SchemeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadScheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadScheme = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await farmerService.getSchemeById(id);
      setScheme(normalizeScheme(data));
    } catch (err) {
      console.error('Failed to load scheme:', err);
      if (err?.response?.status === 404) {
        setScheme(null);
      } else {
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Unable to load scheme details.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="scheme-details-page">Loading...</div>;
  }

  if (error) {
    return (
      <div className="scheme-details-page">
        <button className="btn-ghost back-btn" type="button" onClick={() => navigate('/farmer/govt-schemes')}>
          ← Back to Schemes
        </button>
        <div className="card scheme-notfound" style={{ color: 'var(--clay)' }}>
          {error}
          <br />
          <button className="btn btn-outline btn-sm" type="button" onClick={loadScheme} style={{ marginTop: 12 }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="scheme-details-page">
        <button className="btn-ghost back-btn" type="button" onClick={() => navigate('/farmer/govt-schemes')}>
          ← Back to Schemes
        </button>
        <div className="card scheme-notfound">Scheme not found.</div>
      </div>
    );
  }

  return (
    <div className="scheme-details-page">
      <button className="btn-ghost back-btn" type="button" onClick={() => navigate(-1)}>
        ← Back to Schemes
      </button>

      <div className="card scheme-details-card">
        <div className="scheme-details-header">
          <div className="icon-badge" style={{ background: scheme.bg }}>{scheme.icon}</div>
          <div>
            <h2 className="scheme-details-title">{scheme.title}</h2>
            <span className="pill" style={{ background: scheme.bg, color: scheme.categoryColor }}>
              {scheme.category}
            </span>
          </div>
        </div>

        <p className="scheme-details-desc">{scheme.fullDescription}</p>

        <div className="grid grid-2 scheme-info-grid">
          <div className="card info-box">
            <b>💰 Benefit</b>
            <p>{scheme.benefit}</p>
          </div>
          <div className="card info-box">
            <b>✅ Eligibility</b>
            <p>{scheme.eligibility}</p>
          </div>
          <div className="card info-box">
            <b>📄 Documents</b>
            <p>{scheme.documents}</p>
          </div>
          <div className="card info-box">
            <b>⏰ Deadline</b>
            <p>{scheme.deadline}</p>
          </div>
          <div className="card info-box">
            <b>🌱 Status</b>
            <p>{scheme.status === 'ACTIVE' ? '🟢 Active' : scheme.status === 'INACTIVE' ? '🔴 Inactive' : scheme.status}</p>
          </div>
          {scheme.minFarmSize != null && (
            <div className="card info-box">
              <b>📏 Min Farm Size</b>
              <p>{scheme.minFarmSize} acres</p>
            </div>
          )}
          {scheme.applicableCrops && (
            <div className="card info-box">
              <b>🌾 Applicable Crops</b>
              <p>{scheme.applicableCrops}</p>
            </div>
          )}
        </div>

        {(() => {
          let validUrl = null;
          if (typeof scheme.officialUrl === 'string' && scheme.officialUrl.trim() !== '') {
            try {
              const parsed = new URL(scheme.officialUrl.trim());
              if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                validUrl = parsed.href;
              }
            } catch (e) {
              // Ignore
            }
          }

          return validUrl && (
            <a
              href={validUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              🌱 View Official Website
            </a>
          );
        })()}
      </div>
    </div>
  );
};

export default SchemeDetails;