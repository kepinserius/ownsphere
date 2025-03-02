import React, { useState } from "react";

interface SettingsProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ darkMode, setDarkMode }) => {
  const [notifications, setNotifications] = useState(false);
  const [language, setLanguage] = useState("id"); // Default ke Bahasa Indonesia

  return (
    <div className="page settings-container">
      <section className="settings-section">
        <div className="section-header">
          <h2>
            <i className="fas fa-cog"></i> Pengaturan Aplikasi
          </h2>
        </div>

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
            <i className="fas fa-bell"></i> Notifikasi
          </h3>
          <p className="setting-description">
            Aktifkan notifikasi untuk mendapatkan pembaruan tentang aktivitas
            akun, saran investasi, dan fitur baru.
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
          </select>
        </div>

        <div className="setting-item">
          <h3>
            <i className="fas fa-shield-alt"></i> Privasi dan Keamanan
          </h3>
          <p className="setting-description">
            Kelola pengaturan privasi dan keamanan akun Anda.
          </p>
          <div className="settings-buttons">
            <button className="action-button">
              <i className="fas fa-user-shield"></i> Pengaturan Privasi
            </button>
            <button className="action-button">
              <i className="fas fa-key"></i> Ubah Kata Sandi
            </button>
          </div>
        </div>

        <div className="setting-item">
          <h3>
            <i className="fas fa-question-circle"></i> Bantuan & Dukungan
          </h3>
          <p className="setting-description">
            Dapatkan bantuan atau hubungi tim dukungan kami.
          </p>
          <div className="settings-buttons">
            <button className="action-button">
              <i className="fas fa-book"></i> Pusat Bantuan
            </button>
            <button className="action-button">
              <i className="fas fa-headset"></i> Hubungi Dukungan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
