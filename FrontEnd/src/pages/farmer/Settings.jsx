import { useState } from "react";
import authService from "../../services/authService";
import "./Settings.css";

const TABS = [
  { key: "password", label: '🔐 Password' },
  { key: "language", label: '🌱 Language' },
  { key: "notifications", label: '🔔 Notifications' },
  { key: "help", label: '❓ Help' },
  { key: "about", label: "ℹ️ About" },
];

const FAQS = [
  {
    id: 1,
    question: "How is my sustainability score calculated?",
    answer:
      "Your score is based on four categories — Water, Soil, Pest Control, and Crop Diversity — each worth up to 25 points. Points are added as you log and get practices verified in each category, for a maximum total of 100.",
  },
  {
    id: 2,
    question: "Why was my practice rejected?",
    answer:
      "Practices are reviewed by an admin before approval. Common reasons for rejection include missing evidence/photos, unclear descriptions, or practices that don't match FarmXP's certified categories. Check the notification for the specific reason, then resubmit with more detail.",
  },
  {
    id: 3,
    question: "How do I unlock Market Buyers?",
    answer:
      "Once your sustainability score crosses the platform threshold, premium buyers become visible under Market Buyers automatically — no separate application needed.",
  },
  {
    id: 4,
    question: "How does the AI Assistant work?",
    answer:
      "The AI Assistant (Saathi) uses your farm profile and crop data to give personalized farming guidance in your preferred language. It can help with irrigation timing, pest identification, and more.",
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("password");

  // Password tab state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Language tab state
  const [language, setLanguage] = useState("english");

  // Notification preferences state
  const [notifPrefs, setNotifPrefs] = useState({
    learningReminders: true,
    verificationUpdates: true,
    schemeAlerts: true,
    buyerAlerts: false,
  });

  // Help tab state
  const [openFaqId, setOpenFaqId] = useState(null);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("Please fill in all password fields.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    try {
      await authService.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordSuccess("Password updated successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || "Failed to update password.");
    }
  };

  const toggleNotifPref = (key) => {
    // Later this becomes: notificationService.updatePreferences({ ...notifPrefs, [key]: !notifPrefs[key] })
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFaq = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteError("");
      const { deleteProfile } = await import("../../services/farmerService");
      await deleteProfile();
      authService.logout();
      window.location.href = "/";
    } catch (err) {
      setDeleteError(err.response?.data?.message || err.message || "Failed to delete account.");
    }
  };

  return (
    <div className="settings-page">
      <div className="tabbar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tabbtn ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Password */}
      {activeTab === "password" && (
        <div className="card settings-card">
          <h3>🔐 Change Password</h3>

          {passwordError && (
            <div className="settings-alert error">{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className="settings-alert success">{passwordSuccess}</div>
          )}

          <form onSubmit={handleUpdatePassword}>
            <div className="field">
              <label>Current password</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => toggleShowPassword("current")}
                  aria-label="Toggle password visibility"
                >
                  {showPassword.current ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="field">
              <label>New password</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => toggleShowPassword("new")}
                  aria-label="Toggle password visibility"
                >
                  {showPassword.new ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="field">
              <label>Confirm new password</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => toggleShowPassword("confirm")}
                  aria-label="Toggle password visibility"
                >
                  {showPassword.confirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button className="btn btn-primary" type="submit">
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* Language */}
      {activeTab === "language" && (
        <div className="card settings-card">
          <h3>🌱 Language</h3>
          <div className="language-options">
            <label
              className={`language-option ${language === "english" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="language"
                checked={language === "english"}
                onChange={() => setLanguage("english")}
              />
              English
            </label>
            <label className="language-option disabled">
              <input type="radio" name="language" disabled />
              தமிழ் (Tamil)
              <span className="pill pill-soon">Coming soon</span>
            </label>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="card settings-card">
          <h3>🔔 Notification Preferences</h3>
          <div className="notif-pref-row">
            <span>Learning reminders</span>
            <input
              type="checkbox"
              checked={notifPrefs.learningReminders}
              onChange={() => toggleNotifPref("learningReminders")}
            />
          </div>
          <div className="notif-pref-row">
            <span>Practice verification updates</span>
            <input
              type="checkbox"
              checked={notifPrefs.verificationUpdates}
              onChange={() => toggleNotifPref("verificationUpdates")}
            />
          </div>
          <div className="notif-pref-row">
            <span>Government scheme alerts</span>
            <input
              type="checkbox"
              checked={notifPrefs.schemeAlerts}
              onChange={() => toggleNotifPref("schemeAlerts")}
            />
          </div>
          <div className="notif-pref-row no-border">
            <span>Buyer match alerts</span>
            <input
              type="checkbox"
              checked={notifPrefs.buyerAlerts}
              onChange={() => toggleNotifPref("buyerAlerts")}
            />
          </div>
        </div>
      )}

      {/* Help */}
      {activeTab === "help" && (
        <div className="card settings-card">
          <h3>❓ Help &amp; Support</h3>
          <p className="settings-desc">
            Frequently asked questions and ways to reach us.
          </p>

          {FAQS.map((faq) => (
            <div className="faq-item" key={faq.id}>
              <button
                className="faq-question"
                type="button"
                onClick={() => toggleFaq(faq.id)}
              >
                <span>{faq.question}</span>
                <span className="faq-chevron">
                  {openFaqId === faq.id ? "−" : "+"}
                </span>
              </button>
              {openFaqId === faq.id && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* About */}
      {activeTab === "about" && (
        <div className="card settings-card about-card">
          <div className="about-icon">🌾</div>
          <h3>FarmXP</h3>
          <div className="about-version">Version 1.0.0</div>

          <p className="settings-desc about-tagline">
            Growing sustainable farming, one practice at a time.
          </p>

          <div className="about-section">
            <h4>What is FarmXP?</h4>
            <p>
              FarmXP is a gamified learning and rewards platform that helps
              farmers transition from chemical-intensive farming to sustainable
              practices. Farmers earn XP and badges for completing learning
              modules and adopting certified sustainable practices — organic
              inputs, integrated pest management, and water conservation — while
              tracking real, measurable impact on their farm.
            </p>
          </div>

          <div className="about-section">
            <h4>How it works</h4>
            <p>
              Every certified practice a farmer logs is reviewed and verified,
              which automatically updates their sustainability score across four
              categories: Water, Soil, Pest Control, and Crop Diversity. Higher
              scores unlock access to government scheme recommendations and
              premium buyers who pay more for sustainably grown produce —
              turning good farming practices into real economic benefit.
            </p>
          </div>

          <div className="about-section">
            <h4>Powered by AI</h4>
            <p>
              FarmXP's AI Assistant, Saathi, gives every farmer personalized
              guidance based on their own crop and practice history, available
              in their preferred language — making expert farming knowledge
              accessible without needing to attend in-person training sessions.
            </p>
          </div>

          <div className="about-section" style={{ marginTop: "2rem", borderTop: "1px solid #ddd", paddingTop: "1rem" }}>
            <h4 style={{ color: "#d32f2f" }}>Danger Zone</h4>
            <p style={{ marginBottom: "1rem" }}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            {deleteError && (
              <div className="settings-alert error" style={{ marginBottom: "1rem" }}>
                {deleteError}
              </div>
            )}
            {!showDeleteConfirm ? (
              <button 
                className="btn" 
                style={{ backgroundColor: "#d32f2f", color: "white" }}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </button>
            ) : (
              <div style={{ backgroundColor: "#ffebee", padding: "1rem", borderRadius: "8px", border: "1px solid #ef9a9a" }}>
                <p style={{ color: "#c62828", fontWeight: "bold", marginBottom: "1rem" }}>
                  Are you sure? This will delete your profile, crops, practices, and login credentials permanently.
                </p>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button 
                    className="btn" 
                    style={{ backgroundColor: "#d32f2f", color: "white" }}
                    onClick={handleDeleteAccount}
                  >
                    Yes, Delete My Account
                  </button>
                  <button 
                    className="btn" 
                    style={{ backgroundColor: "#e0e0e0", color: "#333" }}
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
