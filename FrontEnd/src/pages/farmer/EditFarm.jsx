import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import farmerService from '../../services/farmerService';
import './EditFarm.css';

const EditFarm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    farmName: '',
    farmSize: '',
    state: '',
    district: '',
    village: '',
    soilType: '',
    primaryCrop: '',
    irrigationType: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profile = await farmerService.getProfile();
      setFormData(prev => ({
        ...prev,
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        farmName: profile.farmName || '',
        farmSize: profile.farmSize ? String(profile.farmSize) : '',
        state: profile.state || '',
        district: profile.district || '',
        district: profile.district || '',
        village: profile.village || '',
        soilType: profile.soilType || 'Alluvial',
        irrigationType: profile.irrigationType || 'Drip Irrigation',
        primaryCrop: profile.primaryCrop || ''
      }));
    } catch (err) {
      console.error('Failed to load profile for edit:', err);
      setError('Unable to load your profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    if (!formData.farmSize || isNaN(Number(formData.farmSize)) || Number(formData.farmSize) < 0) {
      setError('Farm size must be a valid positive number.');
      return;
    }

    setSaving(true);
    try {
      await farmerService.updateProfile({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        farmName: formData.farmName.trim(),
        farmSize: Number(formData.farmSize),
        farmSizeUnit: 'ACRE',
        state: formData.state.trim(),
        district: formData.district.trim(),
        village: formData.village.trim(),
        soilType: formData.soilType.trim(),
        irrigationType: formData.irrigationType.trim(),
      });
      navigate('/farmer/my-farm');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err?.response?.data?.message || 'Failed to update profile.');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/farmer/my-farm');
  };

  if (loading) {
    return (
      <div className="edit-farm">
        <div className="card edit-farm-card">
          <p style={{padding:'20px', textAlign:'center'}}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-farm">
      <div className="card edit-farm-card">
        <h3 className="edit-farm-title">🌱 Edit Your Details</h3>

        {error && <div className="auth-error" style={{marginBottom: '15px'}}>{error}</div>}

        <form onSubmit={handleSave}>
          <div className="field">
            <label>👤 Full name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>📱 Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>

            <div className="field">
              <label>📍 State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>🏙️ District</label>
              <input
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="District"
              />
            </div>

            <div className="field">
              <label>🏡 Village</label>
              <input
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder="Village"
              />
            </div>
          </div>

          <div className="field-separator">Farm Details</div>

          <div className="field">
            <label>🌾 Farm Name</label>
            <input
              name="farmName"
              value={formData.farmName}
              onChange={handleChange}
              placeholder="e.g. Green Acres"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>📏 Farm Size (Acres)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                placeholder="Total Area"
              />
            </div>

            <div className="field">
              <label>🧱 Soil Type</label>
              <select name="soilType" value={formData.soilType} onChange={handleChange}>
                <option>Alluvial</option>
                <option>Black</option>
                <option>Red</option>
                <option>Laterite</option>
                <option>Mountain</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>🌾 Primary Crop</label>
              <input
                name="primaryCrop"
                value={formData.primaryCrop}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>💧 Irrigation Type</label>
              <select name="irrigationType" value={formData.irrigationType} onChange={handleChange}>
                <option>Drip Irrigation</option>
                <option>Sprinkler</option>
                <option>Canal</option>
                <option>Tube Well</option>
                <option>Rainfed</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-outline" type="button" onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFarm;