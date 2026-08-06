import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditFarm.css';

const EditFarm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'Guest Farmer',
    phone: '98765 43210',
    location: 'Coimbatore',
    farmSize: '2.5',
    soilType: 'Alluvial',
    primaryCrop: 'Paddy',
    farmingType: 'Semi-organic',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // No backend yet — this will call an update API later
    navigate('/farmer/my-farm');
  };

  const handleCancel = () => {
    navigate('/farmer/my-farm');
  };

  return (
    <div className="edit-farm">
      <div className="card edit-farm-card">
        <h3 className="edit-farm-title">✏️ Edit Your Details</h3>

        <form onSubmit={handleSave}>
          <div className="field">
            <label>👤 Full name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>📱 Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>📍 Village/District</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>🚜 Farm size (acres)</label>
              <input
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>🧱 Soil type</label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
              >
                <option>Alluvial</option>
                <option>Black</option>
                <option>Red</option>
                <option>Laterite</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>🌾 Primary crop</label>
              <select
                name="primaryCrop"
                value={formData.primaryCrop}
                onChange={handleChange}
              >
                <option>Paddy</option>
                <option>Millets</option>
                <option>Banana</option>
                <option>Coconut</option>
              </select>
            </div>
            <div className="field">
              <label>🌿 Farming type</label>
              <select
                name="farmingType"
                value={formData.farmingType}
                onChange={handleChange}
              >
                <option>Semi-organic</option>
                <option>Organic</option>
                <option>Conventional</option>
              </select>
            </div>
          </div>

          <div className="edit-farm-actions">
            <button className="btn btn-primary" type="submit">
              💾 Save Changes
            </button>
            <button className="btn btn-ghost" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFarm;