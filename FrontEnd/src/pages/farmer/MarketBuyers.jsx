import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './MarketBuyers.css';

// Mock buyer data — kept inline in this page, matching your GovtSchemes.jsx
// pattern. Replace the array below with a farmerService.getMarketBuyers()
// call once the backend is ready.
const BUYERS = [
  {
    id: 1,
    icon: '🏢',
    bg: 'var(--sky-light)',
    companyName: 'GreenLeaf Exports',
    cropsNeeded: ['Paddy', 'Millets'],
    priceRange: '₹28 - ₹34 / kg',
    location: 'Coimbatore, TN',
    verified: true,
    rating: 4.6,
  },
  {
    id: 2,
    icon: '🌾',
    bg: 'var(--sprout-light)',
    companyName: 'Organic Harvest Co.',
    cropsNeeded: ['Banana', 'Coconut'],
    priceRange: '₹18 - ₹22 / kg',
    location: 'Erode, TN',
    verified: true,
    rating: 4.8,
  },
  {
    id: 3,
    icon: '🚚',
    bg: 'var(--harvest-light)',
    companyName: 'AgriMart Distributors',
    cropsNeeded: ['Paddy'],
    priceRange: '₹25 - ₹30 / kg',
    location: 'Salem, TN',
    verified: false,
    rating: 4.1,
  },
  {
    id: 4,
    icon: '🏭',
    bg: 'var(--clay-light)',
    companyName: 'Nilgiri Fresh Foods',
    cropsNeeded: ['Millets', 'Coconut'],
    priceRange: '₹20 - ₹26 / kg',
    location: 'Coimbatore, TN',
    verified: true,
    rating: 4.4,
  },
];

// Sustainability score gate — later this threshold comes from the backend
// (Admin-configurable), and the farmer's own score comes from their profile
const MOCK_SUSTAINABILITY_SCORE = 72;
const MOCK_SCORE_THRESHOLD = 60;

const BuyerCard = ({ buyer, onContact }) => (
  <div className="card buyer-card">
    <div className="buyer-card-top">
      <div className="buyer-emblem" style={{ background: buyer.bg }}>
        {buyer.icon}
      </div>
      {buyer.verified ? (
        <span className="pill pill-approved">✅ Verified</span>
      ) : (
        <span className="pill pill-neutral">Unverified</span>
      )}
    </div>

    <div className="buyer-name">{buyer.companyName}</div>

    <div className="buyer-crops">
      {buyer.cropsNeeded.map((crop) => (
        <span key={crop} className="crop-tag">
          {crop}
        </span>
      ))}
    </div>

    <div className="buyer-detail-row">
      <b>💰 Price Range:</b> {buyer.priceRange}
    </div>
    <div className="buyer-detail-row">
      <b>📍 Location:</b> {buyer.location}
    </div>
    <div className="buyer-detail-row">
      <b>⭐ Rating:</b> {buyer.rating} / 5
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

const MarketBuyers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const isEligible = MOCK_SUSTAINABILITY_SCORE >= MOCK_SCORE_THRESHOLD;

  const filteredBuyers = useMemo(() => {
    return BUYERS.filter((b) =>
      b.companyName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleContact = (buyerId) => {
    navigate(`/farmer/market-buyers/${buyerId}`);
  };

  if (!isEligible) {
    return (
      <div className="market-buyers-page">
        <div className="card market-locked-card">
          <div className="market-locked-icon">🔒</div>
          <h3>Market Buyers Locked</h3>
          <p>
            Reach a sustainability score of {MOCK_SCORE_THRESHOLD}+ to unlock
            verified buyer connections. Your current score is{' '}
            {MOCK_SUSTAINABILITY_SCORE}.
          </p>
          <button
            className="btn btn-outline btn-sm"
            type="button"
            onClick={() => navigate('/farmer/sustainability')}
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
        <input
          className="market-buyers-search"
          placeholder="🔍 Search buyers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-3">
        {filteredBuyers.map((buyer) => (
          <BuyerCard
            key={buyer.id}
            buyer={buyer}
            onContact={() => handleContact(buyer.id)}
          />
        ))}

        {filteredBuyers.length === 0 && (
          <div className="market-buyers-empty">No buyers match your search.</div>
        )}
      </div>
    </div>
  );
};

export default MarketBuyers;