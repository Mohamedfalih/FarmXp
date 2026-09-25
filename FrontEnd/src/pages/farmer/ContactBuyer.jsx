import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import farmerService from '../../services/farmerService';
import './ContactBuyer.css';
import CorporateIcon from '@mui/icons-material/CorporateFare';
import GrassIcon from '@mui/icons-material/Grass';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FactoryIcon from '@mui/icons-material/Factory';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SpaIcon from '@mui/icons-material/Spa';
import PersonalIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from "@mui/icons-material/Warning";

const ICON_OPTIONS = [<CorporateIcon />, <GrassIcon />, <LocalShippingIcon />, <FactoryIcon />, <StorefrontIcon />, <SpaIcon />];
const BG_OPTIONS = [
  'var(--sky-light)',
  'var(--sprout-light)',
  'var(--harvest-light)',
  'var(--clay-light)',
];

// Parse comma-separated or array crops from backend response
const parseCrops = (requiredCrops) => {
  if (!requiredCrops) return [];
  if (Array.isArray(requiredCrops)) return requiredCrops;
  return String(requiredCrops)
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
};

const ContactBuyer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [cropType, setCropType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    loadBuyer();
  }, [id]);

  const loadBuyer = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await farmerService.getBuyerById(id);

      const idx = Math.abs(Number(id) || 0) % ICON_OPTIONS.length;

      const cropsNeeded = parseCrops(data.requiredCrops || data.cropsNeeded);

      setBuyer({
        buyerId: data.buyerId || data.id,
        companyName: data.businessName || data.companyName || 'Unknown Buyer',
        icon: data.icon || ICON_OPTIONS[idx],
        bg: data.bg || BG_OPTIONS[idx % BG_OPTIONS.length],
        contactPerson: data.contactPerson || 'N/A',
        phone: data.phone || 'N/A',
        email: data.email || 'N/A',
        location: [data.district, data.state].filter(Boolean).join(', ') || data.address || 'N/A',
        priceRange: data.priceRange || 'Contact for pricing',
        cropsNeeded,
        verified: data.status === 'ACTIVE' || data.verified || false,
      });
    } catch (err) {
      console.error('Failed to load buyer:', err);
      setError(err.response?.data?.message || err.message || 'Buyer not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  const isFormValid = cropType.trim() && quantity.trim() && message.trim();

  const handleSubmit = async () => {
    setSending(true);
    setSendError('');

    try {
      await farmerService.sendBuyerInquiry({
        buyerId: buyer.buyerId,
        cropType,
        quantity,
        message,
      });
      setSent(true);
    } catch (err) {
      console.error('Failed to send inquiry:', err);
      setSendError(err.response?.data?.message || err.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="contact-buyer-page">
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          Loading buyer details...
        </div>
      </div>
    );
  }

  if (error || !buyer) {
    return (
      <div className="contact-buyer-page">
        <button className="btn-ghost back-btn" type="button" onClick={handleBack}>
          ← Back to Buyers
        </button>
        <div className="card buyer-notfound">
          {error || 'Buyer not found.'}
        </div>
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
              <span className="pill pill-approved"><VerifiedIcon /> Verified</span>
            ) : (
              <span className="pill pill-neutral">Unverified</span>
            )}
          </div>
        </div>

        <div className="grid grid-2 buyer-summary-grid">
          <div className="card info-box">
            <b><PersonalIcon /> Contact Person</b>
            <p>{buyer.contactPerson}</p>
          </div>
          <div className="card info-box">
            <b><PhoneAndroidIcon /> Phone</b>
            <p>{buyer.phone}</p>
          </div>
          <div className="card info-box">
            <b><EmailIcon /> Email</b>
            <p>{buyer.email}</p>
          </div>
          <div className="card info-box">
            <b><LocationOnIcon /> Location</b>
            <p>{buyer.location}</p>
          </div>
          <div className="card info-box">
            <b><PriceChangeIcon /> Price Range</b>
            <p>{buyer.priceRange}</p>
          </div>
          <div className="card info-box">
            <b><GrassIcon /> Crops Needed</b>
            <p>{buyer.cropsNeeded.length > 0 ? buyer.cropsNeeded.join(', ') : 'Various'}</p>
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
          <option value="Other">Other</option>
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

        {sendError && (
          <div style={{ color: 'var(--clay)', fontSize: '13px', marginBottom: '10px' }}>
            <WarningIcon /> {sendError}
          </div>
        )}

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