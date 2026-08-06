import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SchemeDetails.css';

// Mock scheme data — kept inline in this page, matching GovtSchemes.jsx records
// (same id, title, icon, bg) with extra detail fields for this view.
// Replace the useEffect body below with farmerService.getSchemeById(id)
// once the backend is ready.
const schemes = [
  {
    id: 1,
    icon: '💧',
    bg: 'var(--sky-light)',
    categoryColor: '#2A6B78',
    category: 'Irrigation Subsidy',
    title: 'PM Krishi Sinchayee Yojana',
    fullDescription:
      'A central government scheme promoting water-use efficiency by offering subsidies on drip and sprinkler irrigation systems, helping farmers reduce water consumption while improving crop yield.',
    benefit: 'Up to 55% subsidy on drip/sprinkler irrigation systems',
    eligibility: 'All farmers with cultivable land willing to adopt micro-irrigation',
    documents: 'Aadhaar card, land records, bank account details',
    deadline: '30 Sep 2026',
    officialUrl: 'https://pmksy.gov.in',
  },
  {
    id: 2,
    icon: '🌱',
    bg: 'var(--sprout-light)',
    categoryColor: '#3E6B1E',
    category: 'Advisory',
    title: 'Soil Health Card Scheme',
    fullDescription:
      'Provides farmers with soil health cards every 2 years, containing crop-wise nutrient and fertilizer recommendations to improve soil productivity and reduce input costs.',
    benefit: 'Free soil testing and personalized fertilizer recommendations',
    eligibility: 'All farmers with agricultural land holdings',
    documents: 'Land ownership proof, Aadhaar card',
    deadline: 'Ongoing',
    officialUrl: 'https://soilhealth.dac.gov.in',
  },
  {
    id: 3,
    icon: '🌾',
    bg: 'var(--harvest-light)',
    categoryColor: '#9A6A0E',
    category: 'Income Support',
    title: 'PM-KISAN',
    fullDescription:
      'A central government scheme providing income support of ₹6,000 per year to all landholding farmer families, paid in three equal installments directly to bank accounts.',
    benefit: '₹6,000 per year in 3 installments of ₹2,000 each',
    eligibility: 'All landholding farmer families with cultivable land',
    documents: 'Aadhaar card, land records, bank account details',
    deadline: '15 Aug 2026',
    officialUrl: 'https://pmkisan.gov.in',
  },
  {
    id: 4,
    icon: '🐄',
    bg: 'var(--clay-light)',
    categoryColor: '#C1552E',
    category: 'Livestock',
    title: 'National Livestock Mission',
    fullDescription:
      'Supports farmers setting up integrated farming systems combining crop and livestock activities, with funding assistance for infrastructure and breed improvement.',
    benefit: 'Financial support for integrated farming and livestock infrastructure',
    eligibility: 'Farmers and farmer groups engaged in livestock rearing',
    documents: 'Land/shed ownership proof, project proposal, bank account details',
    deadline: '31 Oct 2026',
    officialUrl: 'https://nlm.udyamimitra.in',
  },
  {
    id: 5,
    icon: '🏦',
    bg: 'var(--sky-light)',
    categoryColor: '#2A6B78',
    category: 'Credit',
    title: 'Kisan Credit Card',
    fullDescription:
      'Provides farmers with timely access to credit for agricultural and allied activities at concessional interest rates, covering both short-term and investment needs.',
    benefit: 'Low-interest crop loans up to ₹3 lakh',
    eligibility: 'Farmers, tenant farmers, sharecroppers, and SHGs',
    documents: 'Identity proof, land documents, passport-size photo',
    deadline: 'Ongoing',
    officialUrl: 'https://www.myscheme.gov.in/schemes/kcc',
  },
  {
    id: 6,
    icon: '♻️',
    bg: 'var(--sprout-light)',
    categoryColor: '#3E6B1E',
    category: 'Organic Farming',
    title: 'Organic Farming Promotion',
    fullDescription:
      'Encourages farmers to shift to organic farming practices by supporting certification costs and providing marketing linkages for organic produce.',
    benefit: 'Organic certification support and market linkage assistance',
    eligibility: 'Farmers practicing or transitioning to organic farming',
    documents: 'Land records, farm activity proof, Aadhaar card',
    deadline: '20 Sep 2026',
    officialUrl: 'https://pgsindia-ncof.gov.in',
  },
];

const SchemeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Replace with: farmerService.getSchemeById(id).then((data) => {...})
    const found = schemes.find((s) => String(s.id) === String(id));
    setScheme(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="scheme-details-page">Loading...</div>;
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
        </div>

        
          <a href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          🌐 Visit Official Website
        </a>
      </div>
    </div>
  );
};

export default SchemeDetails;