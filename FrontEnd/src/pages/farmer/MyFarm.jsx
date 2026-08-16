import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import farmerService from '../../services/farmerService';
import './MyFarm.css';

const MyFarm = () => {

  // ==========================================================
  // STATE
  // ==========================================================

  const [farmerInfo, setFarmerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    state: ''
  });

  const [farmInfo, setFarmInfo] = useState({
    farmName: '',
    location: '',
    totalArea: '',
    irrigationType: 'Not specified',
    soilType: 'Not specified'
  });

  const [crops, setCrops] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [cropForm, setCropForm] = useState({
    name: '',
    acres: '',
    variety: '',
    season: ''
  });

  const [loading, setLoading] =
    useState(true);

  const [savingCrop, setSavingCrop] =
    useState(false);

  const [deletingCropId, setDeletingCropId] =
    useState(null);

  const [error, setError] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  // ==========================================================
  // LOAD FARM DATA
  // ==========================================================

  useEffect(() => {

    loadFarmData();

  }, []);

  // ==========================================================
  // LOAD PROFILE + CROPS
  // ==========================================================

  const loadFarmData = async () => {

    setLoading(true);
    setError('');

    try {

      const [
        profile,
        cropList,
        dashboardData
      ] = await Promise.all([
        farmerService.getProfile(),
        farmerService.getCrops(),
        farmerService.getDashboard()
      ]);

      // ======================================================
      // PROFILE
      // ======================================================

      const storedEmail =
        localStorage.getItem(
          'farmxp_email'
        ) || '';

      setFarmerInfo({

        name:
          profile.fullName || '',

        phone:
          profile.phone || '',

        email:
          storedEmail,

        state:
          profile.state || ''

      });

      // ======================================================
      // CROPS
      // ======================================================

      const loadedCrops =
        Array.isArray(cropList)
          ? cropList
          : [];

      setCrops(loadedCrops);

      // ======================================================
      // CALCULATE TOTAL CROP AREA
      // ======================================================

      const totalCropArea =
        loadedCrops.reduce(
          (total, crop) =>
            total +
            (Number(crop.area) || 0),
          0
        );

      // ======================================================
      // FARM
      // ======================================================

      const locationParts = [
        profile.district,
        profile.village
      ].filter(Boolean);

      setFarmInfo({

        farmName:
          profile.farmName ||
          'My Farm',

        location:
          locationParts.join(', ') ||
          'Not specified',

        // ==================================================
        // UPDATED:
        // Total Area is calculated from crop areas
        // ==================================================

        totalArea:
          totalCropArea > 0
            ? totalCropArea
            : (profile.farmSize || 0),

        irrigationType:
          profile.irrigationType ||
          'Not specified',

        soilType:
          profile.soilType ||
          'Not specified'

      });

      // ======================================================
      // DASHBOARD STATS
      // ======================================================

      setDashboardStats(dashboardData);

    } catch (err) {

      console.error(
        'Failed to load farm data:',
        err.response?.data ||
        err.message ||
        err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        'Unable to load your farm information.';

      setError(message);

    } finally {

      setLoading(false);

    }
  };

  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleFormChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setCropForm({
      ...cropForm,
      [name]: value
    });

  };

  // ==========================================================
  // RESET CROP FORM
  // ==========================================================

  const resetForm = () => {

    setCropForm({
      name: '',
      acres: '',
      variety: '',
      season: ''
    });

    setEditingId(null);
    setShowAddForm(false);

  };

  // ==========================================================
  // SHOW ADD CROP FORM
  // ==========================================================

  const handleAddCrop = () => {

    setError('');
    setSuccessMessage('');

    setCropForm({
      name: '',
      acres: '',
      variety: '',
      season: ''
    });

    setEditingId(null);
    setShowAddForm(true);

  };

  // ==========================================================
  // SAVE / UPDATE CROP
  // ==========================================================

  const handleSaveCrop = async () => {

    setError('');
    setSuccessMessage('');

    // ======================================================
    // VALIDATION
    // ======================================================

    if (!cropForm.name.trim()) {

      setError(
        'Crop name is required.'
      );

      return;
    }

    if (!cropForm.acres.trim()) {

      setError(
        'Area is required.'
      );

      return;
    }

    const area =
      Number(cropForm.acres);

    if (
      Number.isNaN(area) ||
      area <= 0
    ) {

      setError(
        'Area must be greater than zero.'
      );

      return;
    }

    if (!cropForm.season.trim()) {

      setError(
        'Season is required.'
      );

      return;
    }

    // ======================================================
    // BACKEND REQUEST
    // ======================================================

    const cropData = {

      cropName:
        cropForm.name.trim(),

      variety:
        cropForm.variety.trim(),

      area:
        area,

      areaUnit:
        'ACRE',

      season:
        cropForm.season.trim(),

      plantingDate:
        null,

      expectedHarvestDate:
        null,

      status:
        'ACTIVE'
    };

    setSavingCrop(true);

    try {

      // ====================================================
      // UPDATE
      // ====================================================

      if (editingId !== null) {

        const updatedCrop =
          await farmerService.updateCrop(
            editingId,
            cropData
          );

        const updatedCrops =
          crops.map((crop) =>
            crop.cropId === editingId
              ? updatedCrop
              : crop
          );

        setCrops(updatedCrops);

        // ==================================================
        // UPDATED:
        // Recalculate total area after editing
        // ==================================================

        const totalCropArea =
          updatedCrops.reduce(
            (total, crop) =>
              total +
              (Number(crop.area) || 0),
            0
          );

        setFarmInfo((previous) => ({
          ...previous,
          totalArea:
            `${Number(totalCropArea.toFixed(2))} ACRE`
        }));

        setSuccessMessage(
          'Crop updated successfully.'
        );

      }

      // ====================================================
      // CREATE
      // ====================================================

      else {

        const createdCrop =
          await farmerService.createCrop(
            cropData
          );

        const updatedCrops = [
          ...crops,
          createdCrop
        ];

        setCrops(updatedCrops);

        // ==================================================
        // UPDATED:
        // Recalculate total area after adding
        // ==================================================

        const totalCropArea =
          updatedCrops.reduce(
            (total, crop) =>
              total +
              (Number(crop.area) || 0),
            0
          );

        setFarmInfo((previous) => ({
          ...previous,
          totalArea:
            `${Number(totalCropArea.toFixed(2))} ACRE`
        }));

        setSuccessMessage(
          'Crop added successfully.'
        );
      }

      resetForm();

    } catch (err) {

      console.error(
        'Crop save failed:',
        err.response?.data ||
        err.message ||
        err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        'Unable to save crop.';

      setError(message);

    } finally {

      setSavingCrop(false);

    }
  };

  // ==========================================================
  // EDIT CROP
  // ==========================================================

  const handleEditCrop = (crop) => {

    setError('');
    setSuccessMessage('');

    setCropForm({

      name:
        crop.cropName || '',

      acres:
        crop.area !== null &&
        crop.area !== undefined
          ? String(crop.area)
          : '',

      variety:
        crop.variety || '',

      season:
        crop.season || ''

    });

    setEditingId(
      crop.cropId
    );

    setShowAddForm(true);

  };

  // ==========================================================
  // DELETE CROP
  // ==========================================================

  const handleDeleteCrop = async (cropId) => {

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this crop?'
      );

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccessMessage('');

    setDeletingCropId(cropId);

    try {

      await farmerService.deleteCrop(
        cropId
      );

      const updatedCrops =
        crops.filter(
          (crop) =>
            crop.cropId !== cropId
        );

      setCrops(updatedCrops);

      // ==================================================
      // UPDATED:
      // Recalculate total area after deleting
      // ==================================================

      const totalCropArea =
        updatedCrops.reduce(
          (total, crop) =>
            total +
            (Number(crop.area) || 0),
          0
        );

      setFarmInfo((previous) => ({
        ...previous,
        totalArea:
          updatedCrops.length > 0
            ? `${Number(totalCropArea.toFixed(2))} ACRE`
            : '0 ACRE'
      }));

      if (
        editingId === cropId
      ) {

        resetForm();

      }

      setSuccessMessage(
        'Crop deleted successfully.'
      );

    } catch (err) {

      console.error(
        'Crop deletion failed:',
        err.response?.data ||
        err.message ||
        err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        'Unable to delete crop.';

      setError(message);

    } finally {

      setDeletingCropId(null);

    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="myfarm">

        <div className="card">
          <p>
            Loading your farm information...
          </p>
        </div>

      </div>
    );
  }

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const sustainability = dashboardStats?.sustainability || {};
  const learning = dashboardStats?.learning || {};

  const safeScore = Math.min(
      100,
      Math.max(
          0,
          sustainability?.score ?? sustainability?.sustainabilityScore ?? sustainability?.totalScore ?? sustainability?.overallScore ?? 0
      )
  );

  const farmStats = [

    {
      icon: '🌾',
      bg: 'var(--sprout-light)',
      value: crops.length,
      label: 'Total Crops'
    },

    {
      icon: '🌱',
      bg: 'var(--sky-light)',
      value: sustainability?.certifiedPractices ?? sustainability?.verifiedPractices ?? '—',
      label: 'Certified Practices'
    },

    {
      icon: '⭐',
      bg: 'var(--harvest-light)',
      value: safeScore,
      label: 'Sustainability Score'
    },

    {
      icon: '🏆',
      bg: 'var(--clay-light)',
      value: dashboardStats?.farmer?.totalXp ?? 0,
      label: 'Total XP'
    }

  ];

  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="myfarm">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="myfarm-header">

        <h2 className="myfarm-title">
          My Farm
        </h2>

        <Link
          to="/farmer/edit-farm"
          className="btn btn-outline btn-sm"
        >
          Edit Farm
        </Link>

      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="auth-error">
          {error}
        </div>

      )}

      {/* =====================================================
          SUCCESS
      ====================================================== */}

      {successMessage && (

        <div
          className="auth-success"
          style={{
            marginBottom: '20px'
          }}
        >
          {successMessage}
        </div>

      )}

      {/* =====================================================
          FARMER INFORMATION
      ====================================================== */}

      <div className="section-title">

        <h3>
          👤 Farmer Information
        </h3>

      </div>

      <div className="card info-card">

        <div className="info-grid">

          <div className="info-item">

            <span className="info-icon">
              👤
            </span>

            <div>

              <div className="info-label">
                Name
              </div>

              <div className="info-value">
                {farmerInfo.name || 'Not available'}
              </div>

            </div>

          </div>

          <div className="info-item">

            <span className="info-icon">
              📞
            </span>

            <div>

              <div className="info-label">
                Phone
              </div>

              <div className="info-value">
                {farmerInfo.phone || 'Not available'}
              </div>

            </div>

          </div>

          <div className="info-item">

            <span className="info-icon">
              📧
            </span>

            <div>

              <div className="info-label">
                Email
              </div>

              <div className="info-value">
                {farmerInfo.email || 'Not available'}
              </div>

            </div>

          </div>

          <div className="info-item">

            <span className="info-icon">
              📍
            </span>

            <div>

              <div className="info-label">
                State
              </div>

              <div className="info-value">
                {farmerInfo.state || 'Not available'}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          FARM INFORMATION
      ====================================================== */}

      <div className="section-title">

        <h3>
          🌾 Farm Information
        </h3>

      </div>

      <div className="card info-card">

        <div className="info-grid">

          <div className="info-item">

            <span className="info-icon">
              🌾
            </span>

            <div>

              <div className="info-label">
                Farm Name
              </div>

              <div className="info-value">
                {farmInfo.farmName || 'Not specified'}
              </div>

            </div>

          </div>

          <div className="info-item">

            <span className="info-icon">
              📍
            </span>

            <div>

              <div className="info-label">
                Location
              </div>

              <div className="info-value">
                {farmInfo.location || 'Not specified'}
              </div>

            </div>

          </div>

          <div className="info-item">

            <span className="info-icon">
              📐
            </span>

            <div>

              <div className="info-label">
                Total Area
              </div>

              <div className="info-value">
                {farmInfo.totalArea || 'Not specified'}
              </div>

            </div>

          </div>

          <div className="info-item">

            <span className="info-icon">
              💧
            </span>

            <div>

              <div className="info-label">
                Irrigation Type
              </div>

              <div className="info-value">
                {farmInfo.irrigationType}
              </div>

            </div>

          </div>

          <div className="info-item">

            <span className="info-icon">
              🌱
            </span>

            <div>

              <div className="info-label">
                Soil Type
              </div>

              <div className="info-value">
                {farmInfo.soilType}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          CROP DETAILS
      ====================================================== */}

      <div className="section-title">

        <h3>
          🌱 Crop Details
        </h3>

      </div>

      {crops.length === 0 ? (

        <div className="card">

          <p>
            No crops added yet.
          </p>

        </div>

      ) : (

        <div className="crop-grid">

          {crops.map((crop) => (

            <div
              className="card crop-detail-card"
              key={crop.cropId}
            >

              <div className="crop-detail-top">

                <div className="crop-detail-name">
                  {crop.cropName}
                </div>

                <div className="crop-detail-actions">

                  <button
                    className="crop-icon-btn"
                    type="button"
                    onClick={() =>
                      handleEditCrop(crop)
                    }
                    aria-label="Edit crop"
                    disabled={
                      deletingCropId ===
                      crop.cropId
                    }
                  >
                    ✏️
                  </button>

                  <button
                    className="crop-icon-btn"
                    type="button"
                    onClick={() =>
                      handleDeleteCrop(
                        crop.cropId
                      )
                    }
                    aria-label="Delete crop"
                    disabled={
                      deletingCropId ===
                      crop.cropId
                    }
                  >
                    {deletingCropId ===
                    crop.cropId
                      ? '...'
                      : <>🗑️</>}
                  </button>

                </div>

              </div>

              <div className="crop-detail-row">

                {crop.area}
                {' '}
                {crop.areaUnit || 'ACRE'}

              </div>

              <div className="crop-detail-row">

                {crop.variety ||
                  'Variety not specified'}

              </div>

              <div className="crop-detail-row">

                {crop.season}

              </div>

            </div>

          ))}

        </div>

      )}

      {/* =====================================================
          ADD / EDIT CROP FORM
      ====================================================== */}

      {showAddForm && (

        <div className="card crop-form-card">

          <div className="crop-form-title">

            {editingId !== null
              ? 'Edit Crop'
              : 'Add New Crop'}

          </div>

          <div className="crop-form-grid">

            {/* Crop Name */}

            <input
              className="crop-form-input"
              name="name"
              placeholder="Crop name (e.g. Millets)"
              value={cropForm.name}
              onChange={handleFormChange}
              disabled={savingCrop}
            />

            {/* Area */}

            <input
              className="crop-form-input"
              name="acres"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Acres"
              value={cropForm.acres}
              onChange={handleFormChange}
              disabled={savingCrop}
            />

            {/* Variety */}

            <input
              className="crop-form-input"
              name="variety"
              placeholder="Variety (e.g. IR64)"
              value={cropForm.variety}
              onChange={handleFormChange}
              disabled={savingCrop}
            />

            {/* Season */}

            <input
              className="crop-form-input"
              name="season"
              placeholder="Season (e.g. Kharif)"
              value={cropForm.season}
              onChange={handleFormChange}
              disabled={savingCrop}
            />

          </div>

          <div className="crop-form-actions">

            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={handleSaveCrop}
              disabled={savingCrop}
            >

              {savingCrop

                ? 'Saving...'

                : editingId !== null
                  ? 'Update Crop'
                  : 'Save Crop'}

            </button>

            <button
              className="btn btn-ghost btn-sm"
              type="button"
              onClick={resetForm}
              disabled={savingCrop}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* =====================================================
          ADD CROP BUTTON
      ====================================================== */}

      {!showAddForm && (

        <button
          className="btn btn-outline add-crop-btn"
          type="button"
          onClick={handleAddCrop}
        >
          + Add Crop
        </button>

      )}

      {/* =====================================================
          FARM STATISTICS
      ====================================================== */}

      <div className="section-title">

        <h3>
          📊 Farm Statistics
        </h3>

      </div>

      <div className="grid grid-4">

        {farmStats.map((s) => (

          <div
            className="card stat-card"
            key={s.label}
          >

            <div
              className="stat-icon"
              style={{
                background: s.bg
              }}
            >
              {s.icon}
            </div>

            <div className="stat-value">
              {s.value}
            </div>

            <div className="stat-label">
              {s.label}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default MyFarm;
