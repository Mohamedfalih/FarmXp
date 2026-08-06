import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sendBuyerInquiry } from '../../services/farmerService';
import './ContactBuyer.css';

// Mock buyer data — kept inline, matching the same records as MarketBuyers.jsx
// (same id, companyName, icon, bg). Replace the useEffect body below with
// farmerService.getBuyerById(id) once the backend is ready.
const BUYERS = [
  {
    id: 1,
    icon: '🏢',
    bg: 'var(--sky-light)',
    companyName: 'GreenLeaf Exports',
    contactPerson: 'Ravi Kumar',
    phone: '+91 98765 11111',
    email: 'procurement@greenleafexports.com',
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
    contactPerson: 'Meena Devi',
    phone: '+91 98765 22222',
    email: 'sourcing@organicharvest.co.in',
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
    contactPerson: 'Suresh Babu',
    phone: '+91 98765 33333',
    email: 'buying@agrimart.in',
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
    contactPerson: 'Anitha Raj',
    phone: '+91 98765 44444',
    email: 'contact@nilgirifresh.com',
    cropsNeeded: ['Millets', 'Coconut'],
    priceRange: '₹20 - ₹26 / kg',
    location: 'Coimbatore, TN',
    verified: true,
    rating: 4.4,
  },
];

const ContactBuyer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cropType, setCropType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Replace with: farmerService.getBuyerById(id).then((data) => {...})
    const found = BUYERS.find((b) => String(b.id) === String(id));
    setBuyer(found || null);
    setLoading(false);
  }, [id]);

  const handleBack = () => navigate(-1);

  const isFormValid = cropType.trim() && quantity.trim() && message.trim();

  const handleSubmit = async () => {
    setSending(true);

    try {
      await sendBuyerInquiry({
        buyerId: buyer.id,
        cropType,
        quantity,
        message,
      });
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="contact-buyer-page">Loading...</div>;
  }

  if (!buyer) {
    return (
      <div className="contact-buyer-page">
        <button className="btn-ghost back-btn" type="button" onClick={handleBack}>
          ← Back to Buyers
        </button>
        <div className="card buyer-notfound">Buyer not found.</div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="contact-buyer-page">
        <div className="card contact-success-card">
          <div className="contact-success-icon">✅</div>
          <h3>Inquiry Sent!</h3>
          <p>
            Your message has been sent to <b>{buyer.companyName}</b>. They'll
            usually respond within 1–2 business days.
          </p>
          <button
            className="btn btn-primary btn-sm"
            type="button"
            onClick={() => navigate('/farmer/market-buyers')}
          >
            Back to Market Buyers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-buyer-page">
      <button className="btn-ghost back-btn" type="button" onClick={handleBack}>
        ← Back to Buyers
      </button>

      <div className="card buyer-summary-card">
        <div className="buyer-summary-top">
          <div className="buyer-emblem" style={{ background: buyer.bg }}>
            {buyer.icon}
          </div>
          <div>
            <h2 className="buyer-summary-name">{buyer.companyName}</h2>
            {buyer.verified ? (
              <span className="pill pill-approved">✅ Verified</span>
            ) : (
              <span className="pill pill-neutral">Unverified</span>
            )}
          </div>
        </div>

        <div className="grid grid-2 buyer-summary-grid">
          <div className="card info-box">
            <b>👤 Contact Person</b>
            <p>{buyer.contactPerson}</p>
          </div>
          <div className="card info-box">
            <b>📞 Phone</b>
            <p>{buyer.phone}</p>
          </div>
          <div className="card info-box">
            <b>📧 Email</b>
            <p>{buyer.email}</p>
          </div>
          <div className="card info-box">
            <b>📍 Location</b>
            <p>{buyer.location}</p>
          </div>
          <div className="card info-box">
            <b>💰 Price Range</b>
            <p>{buyer.priceRange}</p>
          </div>
          <div className="card info-box">
            <b>🌾 Crops Needed</b>
            <p>{buyer.cropsNeeded.join(', ')}</p>
          </div>
        </div>
      </div>

      <div className="card contact-form-card">
        <h3 className="contact-form-title">📨 Send an Inquiry</h3>

        <label className="contact-form-label">Crop Type</label>
        <select
          className="contact-form-select"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
        >
          <option value="">Select a crop</option>
          {buyer.cropsNeeded.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>

        <label className="contact-form-label">Quantity Available</label>
        <input
          className="contact-form-input"
          placeholder="e.g. 500 kg"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <label className="contact-form-label">Message</label>
        <textarea
          className="contact-form-textarea"
          rows={4}
          placeholder="Introduce your produce and ask any questions..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="btn btn-primary contact-submit-btn"
          type="button"
          disabled={!isFormValid || sending}
          onClick={handleSubmit}
        >
          {sending ? 'Sending...' : '📨 Send Inquiry'}
        </button>
      </div>
    </div>
  );
};

export default ContactBuyer;