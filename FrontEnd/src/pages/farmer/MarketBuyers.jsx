import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import farmerService from '../../services/farmerService';
import sustainabilityService from '../../services/sustainabilityService';
import './MarketBuyers.css';

const SCORE_THRESHOLD = 60;

const BuyerCard = ({ buyer, onContact }) => (
  <div className="card buyer-card">
    <div className="buyer-card-top">
      <div className="buyer-emblem" style={{ background: buyer.bg || 'var(--sky-light)' }}>
        {buyer.icon || '🏢'}
      </div>
      {buyer.verified ? (
        <span className="pill pill-approved">✅ Verified</span>
      ) : (
        <span className="pill pill-neutral">Unverified</span>
      )}
    </div>

    <div className="buyer-name">{buyer.companyName}</div>

    <div className="buyer-crops">
      {(buyer.cropsNeeded || buyer.crops || []).map((crop) => (
        <span key={crop} className="crop-tag">
          {crop}
        </span>
      ))}
    </div>

    <div className="buyer-detail-row">
      <b>💰 Price Range:</b> {buyer.priceRange || 'Contact for pricing'}
    </div>
    <div className="buyer-detail-row">
      <b>📍 Location:</b> {buyer.location || buyer.district || 'N/A'}
    </div>
    <div className="buyer-detail-row">
      <b>⭐ Rating:</b> {buyer.rating ? `${buyer.rating} / 5` : 'N/A'}
    </div>

    <button
      className="btn btn-primary btn-sm buyer-contact-btn"
      type="button"
      onClick={onContact}
    >
      📞 Contact Buyer
    </button>
  </div>
);

const ICON_OPTIONS = ['🏢', '🌾', '🚚', '🏭', '🏪', '🍃'];
const BG_OPTIONS = [
  'var(--sky-light)',
  'var(--sprout-light)',
  'var(--harvest-light)',
  'var(--clay-light)',
];

const enrichBuyer = (buyer, index) => ({
  ...buyer,
  icon: buyer.icon || ICON_OPTIONS[index % ICON_OPTIONS.length],
  bg: buyer.bg || BG_OPTIONS[index % BG_OPTIONS.length],
  cropsNeeded:
    buyer.cropsNeeded ||
    (buyer.crops ? (Array.isArray(buyer.crops) ? buyer.crops : [buyer.crops]) : []),
});

const MarketBuyers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [buyers, setBuyers] = useState([]);
  const [sustainabilityScore, setSustainabilityScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [buyerData, scoreData] = await Promise.all([
        farmerService.getMarketBuyers(),
        sustainabilityService.getScore().catch(() => null),
      ]);

      setBuyers(
        Array.isArray(buyerData)
          ? buyerData.map(enrichBuyer)
          : []
      );

      if (scoreData) {
        const score =
          scoreData?.totalScore ??
          scoreData?.score ??
          scoreData?.sustainabilityScore ??
          0;
        setSustainabilityScore(Number(score));
      } else {
        // If score API fails, grant access (don't block farmers)
        setSustainabilityScore(SCORE_THRESHOLD);
      }
    } catch (err) {
      console.error('Failed to load market buyers:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to load market buyers.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isEligible =
    sustainabilityScore === null || sustainabilityScore >= SCORE_THRESHOLD;

  const filteredBuyers = useMemo(() => {
    return buyers.filter((b) =>
      (b.companyName || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [buyers, search]);

  const handleContact = (buyerId) => {
    navigate(`/farmer/market-buyers/${buyerId}`);
  };

  if (loading) {
    return (
      <div className="market-buyers-page">
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <p>Loading market buyers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="market-buyers-page">
        <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--clay)' }}>
          <p>{error}</p>
          <button className="btn btn-outline btn-sm" type="button" onClick={loadData} style={{ marginTop: '12px' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isEligible) {
    return (
      <div className="market-buyers-page">
        <div className="card market-locked-card">
          <div className="market-locked-icon">🔐</div>
          <h3>Market Buyers Locked</h3>
          <p>
            Reach a sustainability score of {SCORE_THRESHOLD}+ to unlock verified
            buyer connections. Your current score is {sustainabilityScore}.
          </p>
          <button
            className="btn btn-outline btn-sm"
            type="button"
            onClick={() => navigate('/farmer/sustainability-metrics')}
          >
            View Sustainability Score
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="market-buyers-page">
      <div className="market-buyers-header">
        <h2 className="market-buyers-title">🛒 Market Buyers</h2>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '100%', maxWidth: '300px' }}>
          <SearchIcon sx={{ position: 'absolute', left: '10px', color: '#999', fontSize: '18px' }} />
          <input
            className="market-buyers-search"
            style={{ paddingLeft: '32px' }}
            placeholder="Search buyers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-3">
        {filteredBuyers.map((buyer) => (
          <BuyerCard
            key={buyer.buyerId || buyer.id}
            buyer={buyer}
            onContact={() => handleContact(buyer.buyerId || buyer.id)}
          />
        ))}

        {filteredBuyers.length === 0 && (
          <div className="market-buyers-empty">
            {buyers.length === 0
              ? 'No market buyers available at the moment.'
              : 'No buyers match your search.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketBuyers;