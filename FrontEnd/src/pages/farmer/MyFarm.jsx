import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyFarm.css';
import { Link } from "react-router-dom";

const farmerInfo = {
  name: 'Guest Farmer',
  phone: '98765 43210',
  email: 'guest@example.com',
  state: 'Kerala',
};

const farmInfo = {
  farmName: 'Green Valley Farm',
  location: 'Coimbatore',
  totalArea: '2.5 Acres',
  irrigationType: 'Borewell + Canal',
  soilType: 'Alluvial',
};

const farmStats = [
  { icon: '🌾', bg: 'var(--sprout-light)', value: 2, label: 'Total Crops' },
  { icon: '📋', bg: 'var(--sky-light)', value: 9, label: 'Practice Logs' },
  { icon: '⭐', bg: 'var(--harvest-light)', value: 72, label: 'Sustainability Score' },
  { icon: '🏆', bg: 'var(--clay-light)', value: '2,480', label: 'Total XP' },
];

const MyFarm = () => {
  const navigate = useNavigate();

  const [crops, setCrops] = useState([
    { id: 1, name: 'Paddy', acres: '1.5', practiceType: 'Organic', season: 'Kharif Season' },
    { id: 2, name: 'Millets', acres: '1', practiceType: 'Natural Farming', season: 'Summer Season' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [cropForm, setCropForm] = useState({
    name: '',
    acres: '',
    practiceType: '',
    season: '',
  });

  const handleFormChange = (e) => {
    setCropForm({ ...cropForm, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setCropForm({ name: '', acres: '', practiceType: '', season: '' });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSaveCrop = () => {
    if (!cropForm.name.trim() || !cropForm.acres.trim()) return;

    if (editingId) {
      setCrops(
        crops.map((c) => (c.id === editingId ? { ...c, ...cropForm } : c))
      );
    } else {
      setCrops([...crops, { id: Date.now(), ...cropForm }]);
    }
    resetForm();
  };

  const handleEditCrop = (crop) => {
    setCropForm({
      name: crop.name,
      acres: crop.acres,
      practiceType: crop.practiceType,
      season: crop.season,
    });
    setEditingId(crop.id);
    setShowAddForm(true);
  };

  const handleDeleteCrop = (id) => {
    setCrops(crops.filter((c) => c.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="myfarm">
      {/* Header */}
      <div className="myfarm-header">
        <h2 className="myfarm-title">My Farm</h2>
        <Link
        to="/farmer/edit-farm"
        className="btn btn-outline btn-sm"
      >
        Edit Farm
      </Link>
      </div>

      {/* Farmer Information */}
      <div className="section-title">
        <h3>👤 Farmer Information</h3>
      </div>
      <div className="card info-card">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-icon">👤</span>
            <div>
              <div className="info-label">Name</div>
              <div className="info-value">{farmerInfo.name}</div>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📞</span>
            <div>
              <div className="info-label">Phone</div>
              <div className="info-value">{farmerInfo.phone}</div>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📧</span>
            <div>
              <div className="info-label">Email</div>
              <div className="info-value">{farmerInfo.email}</div>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <div className="info-label">State</div>
              <div className="info-value">{farmerInfo.state}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Farm Information */}
      <div className="section-title">
        <h3>🚜 Farm Information</h3>
      </div>
      <div className="card info-card">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-icon">🌾</span>
            <div>
              <div className="info-label">Farm Name</div>
              <div className="info-value">{farmInfo.farmName}</div>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <div className="info-label">Location</div>
              <div className="info-value">{farmInfo.location}</div>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📐</span>
            <div>
              <div className="info-label">Total Area</div>
              <div className="info-value">{farmInfo.totalArea}</div>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">💧</span>
            <div>
              <div className="info-label">Irrigation Type</div>
              <div className="info-value">{farmInfo.irrigationType}</div>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🌱</span>
            <div>
              <div className="info-label">Soil Type</div>
              <div className="info-value">{farmInfo.soilType}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Details */}
      <div className="section-title">
        <h3>🌱 Crop Details</h3>
      </div>
      <div className="crop-grid">
        {crops.map((crop) => (
          <div className="card crop-detail-card" key={crop.id}>
            <div className="crop-detail-top">
              <div className="crop-detail-name">{crop.name}</div>
              <div className="crop-detail-actions">
                <button
                  className="crop-icon-btn"
                  type="button"
                  onClick={() => handleEditCrop(crop)}
                  aria-label="Edit crop"
                >
                  ✏️
                </button>
                <button
                  className="crop-icon-btn"
                  type="button"
                  onClick={() => handleDeleteCrop(crop.id)}
                  aria-label="Delete crop"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="crop-detail-row">{crop.acres} Acres</div>
            <div className="crop-detail-row">{crop.practiceType}</div>
            <div className="crop-detail-row">{crop.season}</div>
          </div>
        ))}
      </div>

      {/* Add / Edit crop inline form */}
      {showAddForm && (
        <div className="card crop-form-card">
          <div className="crop-form-title">
            {editingId ? 'Edit Crop' : 'Add New Crop'}
          </div>
          <div className="crop-form-grid">
            <input
              className="crop-form-input"
              name="name"
              placeholder="Crop name (e.g. Millets)"
              value={cropForm.name}
              onChange={handleFormChange}
            />
            <input
              className="crop-form-input"
              name="acres"
              placeholder="Acres"
              value={cropForm.acres}
              onChange={handleFormChange}
            />
            <input
              className="crop-form-input"
              name="practiceType"
              placeholder="Practice type (e.g. Organic)"
              value={cropForm.practiceType}
              onChange={handleFormChange}
            />
            <input
              className="crop-form-input"
              name="season"
              placeholder="Season (e.g. Kharif Season)"
              value={cropForm.season}
              onChange={handleFormChange}
            />
          </div>
          <div className="crop-form-actions">
            <button className="btn btn-primary btn-sm" type="button" onClick={handleSaveCrop}>
              {editingId ? 'Update Crop' : 'Save Crop'}
            </button>
            <button className="btn btn-ghost btn-sm" type="button" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showAddForm && (
        <button
          className="btn btn-outline add-crop-btn"
          type="button"
          onClick={() => setShowAddForm(true)}
        >
          + Add Crop
        </button>
      )}

      {/* Farm Statistics */}
      <div className="section-title">
        <h3>📊 Farm Statistics</h3>
      </div>
      <div className="grid grid-4">
        {farmStats.map((s) => (
          <div className="card stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFarm;