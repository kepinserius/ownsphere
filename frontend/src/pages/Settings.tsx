import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SettingsProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  ownSphere?: any;
}

const Settings: React.FC<SettingsProps> = ({
  darkMode,
  setDarkMode,
  ownSphere,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("umum");
  const [notifications, setNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketUpdates, setMarketUpdates] = useState(false);
  const [language, setLanguage] = useState("id"); // Default ke Bahasa Indonesia
  const [fontSize, setFontSize] = useState("medium");
  const [autoSave, setAutoSave] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah login
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);

    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setNotifications(settings.notifications || false);
        setEmailNotifications(settings.emailNotifications || false);
        setPushNotifications(settings.pushNotifications || false);
        setMarketUpdates(settings.marketUpdates || false);
        setLanguage(settings.language || "id");
        setFontSize(settings.fontSize || "medium");
        setAutoSave(settings.autoSave !== undefined ? settings.autoSave : true);
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      notifications,
      emailNotifications,
      pushNotifications,
      marketUpdates,
      language,
      fontSize,
      autoSave,
    };
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Semua kolom harus diisi");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Kata sandi baru dan konfirmasi tidak cocok");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Kata sandi baru harus minimal 8 karakter");
      return;
    }

    // Simulasi perubahan password berhasil
    setPasswordError("success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordError(""), 3000);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan."
    );
    if (confirmed) {
      // Simulasi penghapusan akun
      localStorage.removeItem("userId");
      localStorage.removeItem("userSettings");
      navigate("/profile");
    }
  };

  const handleExportData = () => {
    // Simulasi ekspor data
    const userData = {
      settings: {
        notifications,
        emailNotifications,
        pushNotifications,
        marketUpdates,
        language,
        fontSize,
        autoSave,
      },
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "ownsphere-data.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="page settings-container">
      <div className="settings-header">
        <h2>
          <i className="fas fa-cog"></i> Pengaturan
        </h2>
        <p>Sesuaikan pengalaman OwnSphere Anda</p>
      </div>

      <div className="profile-tabs settings-tabs">
        <button
          className={`tab-button ${activeTab === "umum" ? "active" : ""}`}
          onClick={() => setActiveTab("umum")}
        >
          <i className="fas fa-sliders-h"></i> Umum
        </button>
        <button
          className={`tab-button ${activeTab === "notifikasi" ? "active" : ""}`}
          onClick={() => setActiveTab("notifikasi")}
        >
          <i className="fas fa-bell"></i> Notifikasi
        </button>
        <button
          className={`tab-button ${activeTab === "akun" ? "active" : ""}`}
          onClick={() => setActiveTab("akun")}
        >
          <i className="fas fa-user-cog"></i> Akun
        </button>
        <button
          className={`tab-button ${activeTab === "privasi" ? "active" : ""}`}
          onClick={() => setActiveTab("privasi")}
        >
          <i className="fas fa-shield-alt"></i> Privasi
        </button>
      </div>

      {activeTab === "umum" && (
        <section className="settings-section">
          <div className="setting-item">
            <h3>
              <i className="fas fa-palette"></i> Tema
            </h3>
            <p className="setting-description">
              Pilih tema yang sesuai dengan preferensi Anda. Tema gelap dapat
              mengurangi ketegangan mata saat malam hari.
            </p>
            <div className="theme-toggle">
              <button
                className={`theme-button ${!darkMode ? "active" : ""}`}
                onClick={() => setDarkMode(false)}
              >
                <i className="fas fa-sun"></i> Mode Terang
              </button>
              <button
                className={`theme-button ${darkMode ? "active" : ""}`}
                onClick={() => setDarkMode(true)}
              >
                <i className="fas fa-moon"></i> Mode Gelap
              </button>
            </div>
          </div>

          <div className="setting-item">
            <h3>
              <i className="fas fa-language"></i> Bahasa
            </h3>
            <p className="setting-description">
              Pilih bahasa yang ingin Anda gunakan dalam aplikasi.
            </p>
            <select
              className="select-field"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
              <option value="jw">Basa Jawa</option>
            </select>
          </div>

          <div className="setting-item">
            <h3>
              <i className="fas fa-text-height"></i> Ukuran Font
            </h3>
            <p className="setting-description">
              Sesuaikan ukuran teks untuk kenyamanan membaca.
            </p>
            <div className="font-size-options">
              <button
                className={`font-size-button ${
                  fontSize === "small" ? "active" : ""
                }`}
                onClick={() => setFontSize("small")}
              >
                <i className="fas fa-font"></i> Kecil
              </button>
              <button
                className={`font-size-button ${
                  fontSize === "medium" ? "active" : ""
                }`}
                onClick={() => setFontSize("medium")}
              >
                <i className="fas fa-font"></i> Sedang
              </button>
              <button
                className={`font-size-button ${
                  fontSize === "large" ? "active" : ""
                }`}
                onClick={() => setFontSize("large")}
              >
                <i className="fas fa-font"></i> Besar
              </button>
            </div>
          </div>

          <div className="setting-item">
            <h3>
              <i className="fas fa-save"></i> Penyimpanan Otomatis
            </h3>
            <p className="setting-description">
              Simpan pengaturan secara otomatis saat diubah.
            </p>
            <div className="toggle-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={() => setAutoSave(!autoSave)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">
                  {autoSave ? "Aktif" : "Nonaktif"}
                </span>
              </label>
            </div>
          </div>

          {!autoSave && (
            <div className="settings-save-container">
              <button className="save-button" onClick={saveSettings}>
                <i className="fas fa-save"></i> Simpan Pengaturan
              </button>
              {saveSuccess && (
                <span className="save-success">
                  <i className="fas fa-check-circle"></i> Pengaturan berhasil
                  disimpan
                </span>
              )}
            </div>
          )}
        </section>
      )}

      {activeTab === "notifikasi" && (
        <section className="settings-section">
          <div className="setting-item">
            <h3>
              <i className="fas fa-bell"></i> Notifikasi
            </h3>
            <p className="setting-description">
              Aktifkan atau nonaktifkan semua notifikasi.
            </p>
            <div className="toggle-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">
                  {notifications ? "Notifikasi Aktif" : "Notifikasi Nonaktif"}
                </span>
              </label>
            </div>
          </div>

          {notifications && (
            <>
              <div className="setting-item">
                <h3>
                  <i className="fas fa-envelope"></i> Notifikasi Email
                </h3>
                <p className="setting-description">
                  Terima notifikasi melalui email.
                </p>
                <div className="toggle-container">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={() =>
                        setEmailNotifications(!emailNotifications)
                      }
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">
                      {emailNotifications ? "Aktif" : "Nonaktif"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <h3>
                  <i className="fas fa-mobile-alt"></i> Notifikasi Push
                </h3>
                <p className="setting-description">
                  Terima notifikasi push di perangkat Anda.
                </p>
                <div className="toggle-container">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={() => setPushNotifications(!pushNotifications)}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">
                      {pushNotifications ? "Aktif" : "Nonaktif"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <h3>
                  <i className="fas fa-chart-line"></i> Pembaruan Pasar
                </h3>
                <p className="setting-description">
                  Terima notifikasi tentang perubahan pasar dan peluang
                  investasi.
                </p>
                <div className="toggle-container">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={marketUpdates}
                      onChange={() => setMarketUpdates(!marketUpdates)}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">
                      {marketUpdates ? "Aktif" : "Nonaktif"}
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}

          {!autoSave && (
            <div className="settings-save-container">
              <button className="save-button" onClick={saveSettings}>
                <i className="fas fa-save"></i> Simpan Pengaturan
              </button>
              {saveSuccess && (
                <span className="save-success">
                  <i className="fas fa-check-circle"></i> Pengaturan berhasil
                  disimpan
                </span>
              )}
            </div>
          )}
        </section>
      )}

      {activeTab === "akun" && (
        <section className="settings-section">
          {isLoggedIn ? (
            <>
              <div className="setting-item">
                <h3>
                  <i className="fas fa-key"></i> Ubah Kata Sandi
                </h3>
                <p className="setting-description">
                  Perbarui kata sandi akun Anda untuk keamanan yang lebih baik.
                </p>
                <form className="password-form" onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label>Kata Sandi Saat Ini</label>
                    <div className="input-with-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        className="input-field"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Kata Sandi Baru</label>
                    <div className="input-with-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        className="input-field"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Konfirmasi Kata Sandi Baru</label>
                    <div className="input-with-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        className="input-field"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  {passwordError && passwordError !== "success" && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i>{" "}
                      {passwordError}
                    </div>
                  )}
                  {passwordError === "success" && (
                    <div className="success-message">
                      <i className="fas fa-check-circle"></i> Kata sandi
                      berhasil diubah
                    </div>
                  )}
                  <button type="submit" className="action-button">
                    <i className="fas fa-save"></i> Simpan Kata Sandi
                  </button>
                </form>
              </div>

              <div className="setting-item danger-zone">
                <h3>
                  <i className="fas fa-exclamation-triangle"></i> Zona Berbahaya
                </h3>
                <p className="setting-description">
                  Tindakan di bawah ini tidak dapat dibatalkan. Harap
                  berhati-hati.
                </p>
                <div className="danger-buttons">
                  <button className="danger-button" onClick={handleExportData}>
                    <i className="fas fa-file-export"></i> Ekspor Data Saya
                  </button>
                  <button
                    className="danger-button delete"
                    onClick={handleDeleteAccount}
                  >
                    <i className="fas fa-user-slash"></i> Hapus Akun Saya
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="not-logged-in">
              <i className="fas fa-user-lock"></i>
              <h3>Anda belum login</h3>
              <p>Silakan login untuk mengakses pengaturan akun.</p>
              <button
                className="action-button"
                onClick={() => navigate("/profile")}
              >
                <i className="fas fa-sign-in-alt"></i> Login
              </button>
            </div>
          )}
        </section>
      )}

      {activeTab === "privasi" && (
        <section className="settings-section">
          <div className="setting-item">
            <h3>
              <i className="fas fa-cookie-bite"></i> Cookie
            </h3>
            <p className="setting-description">
              Kelola preferensi cookie Anda. Cookie diperlukan untuk fungsi
              dasar situs.
            </p>
            <div className="cookie-options">
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input type="checkbox" checked={true} disabled />
                  <span className="toggle-slider"></span>
                  <span className="toggle-label">
                    Cookie Esensial (Diperlukan)
                  </span>
                </label>
              </div>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input type="checkbox" checked={true} onChange={() => {}} />
                  <span className="toggle-slider"></span>
                  <span className="toggle-label">Cookie Analitik</span>
                </label>
              </div>
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input type="checkbox" checked={false} onChange={() => {}} />
                  <span className="toggle-slider"></span>
                  <span className="toggle-label">Cookie Pemasaran</span>
                </label>
              </div>
            </div>
          </div>

          <div className="setting-item">
            <h3>
              <i className="fas fa-user-shield"></i> Kebijakan Privasi
            </h3>
            <p className="setting-description">
              Baca kebijakan privasi kami untuk memahami bagaimana kami
              melindungi data Anda.
            </p>
            <button className="action-button">
              <i className="fas fa-file-alt"></i> Baca Kebijakan Privasi
            </button>
          </div>

          <div className="setting-item">
            <h3>
              <i className="fas fa-history"></i> Riwayat Aktivitas
            </h3>
            <p className="setting-description">
              Lihat dan kelola riwayat aktivitas akun Anda.
            </p>
            <button className="action-button">
              <i className="fas fa-list"></i> Lihat Riwayat Aktivitas
            </button>
          </div>

          {!autoSave && (
            <div className="settings-save-container">
              <button className="save-button" onClick={saveSettings}>
                <i className="fas fa-save"></i> Simpan Pengaturan
              </button>
              {saveSuccess && (
                <span className="save-success">
                  <i className="fas fa-check-circle"></i> Pengaturan berhasil
                  disimpan
                </span>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Settings;
