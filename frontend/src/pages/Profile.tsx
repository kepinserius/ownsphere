import React, { useState, ChangeEvent, useEffect, useContext } from "react";
import { Actor } from "@dfinity/agent";
import { sha256 } from "js-sha256";
import { OwnSphereContext } from "../App";

interface OwnSphereActor extends Actor {
  registerUser: (
    userId: string,
    name: string,
    email: string,
    passwordHash: string
  ) => Promise<boolean>;
  loginUser: (email: string, passwordHash: string) => Promise<User | null>;
  getUser: (userId: string) => Promise<User | null>;
  getUserByEmail: (email: string) => Promise<User | null>;
}

interface ProfileProps {
  ownSphere: OwnSphereActor;
}

interface Post {
  id: string;
  content: string;
  timestamp: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  posts: Post[];
  tokens: number;
  createdAt: number;
  lastLogin: number;
}

const Profile: React.FC<ProfileProps> = ({ ownSphere: propOwnSphere }) => {
  const contextOwnSphere = useContext(OwnSphereContext);
  const ownSphere = propOwnSphere || contextOwnSphere;

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!ownSphere) {
      console.error("OwnSphere actor tidak tersedia");
      return;
    }

    const checkUser = async () => {
      setLoading(true);
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        try {
          const user = await ownSphere.getUser(storedUserId);
          if (user) {
            setUserProfile(user);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setError("Gagal memuat profil pengguna");
        }
      }
      setLoading(false);
      setIsInitialized(true);
    };

    checkUser();
  }, [ownSphere]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    setter(e.target.value);
    setError(null); // Clear error when user types
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const login = async () => {
    if (!email || !password) {
      setError("Mohon isi semua field yang diperlukan");
      return;
    }

    if (!validateEmail(email)) {
      setError("Format email tidak valid");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const passwordHash = sha256(password);
      const user = await ownSphere.loginUser(email, passwordHash);

      if (user) {
        localStorage.setItem("userId", user.id);
        setUserProfile(user);
      } else {
        setError("Email atau password salah");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    if (!userId || !name || !email || !password || !confirmPassword) {
      setError("Mohon isi semua field yang diperlukan");
      return;
    }

    if (userId.length < 3) {
      setError("User ID harus minimal 3 karakter");
      return;
    }

    if (name.length < 2) {
      setError("Nama harus minimal 2 karakter");
      return;
    }

    if (!validateEmail(email)) {
      setError("Format email tidak valid");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password harus minimal 8 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Mencoba mendaftarkan user dengan data:", {
        userId,
        name,
        email,
        passwordLength: password.length,
      });

      const passwordHash = sha256(password);
      console.log("Password hash dibuat");

      const result = await ownSphere.registerUser(
        userId,
        name,
        email,
        passwordHash
      );
      console.log("Hasil registrasi:", result);

      if (result) {
        console.log("Registrasi berhasil, menyimpan userId:", userId);
        localStorage.setItem("userId", userId);
        setUserProfile({
          id: userId,
          name,
          email,
          posts: [],
          tokens: 0,
          createdAt: Date.now(),
          lastLogin: Date.now(),
        });
        alert("Profil berhasil dibuat!");
      } else {
        console.log("Registrasi gagal: email atau userId sudah digunakan");
        setError("Email sudah terdaftar atau User ID sudah digunakan");
      }
    } catch (error) {
      console.error("Error detail saat registrasi:", error);
      setError("Terjadi kesalahan saat membuat profil. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Simulasi data aktivitas untuk demo
  const activityData = [
    {
      type: "post",
      content: "Shared a new post about blockchain technology",
      time: "2 hours ago",
    },
    {
      type: "investment",
      content: "Invested 50 tokens in Project X",
      time: "1 day ago",
    },
    {
      type: "reward",
      content: "Earned 25 tokens for community contribution",
      time: "3 days ago",
    },
    {
      type: "post",
      content: "Commented on Alice's post about DeFi",
      time: "1 week ago",
    },
  ];

  // Simulasi data transaksi untuk demo
  const transactionData = [
    {
      id: "tx123",
      type: "deposit",
      amount: 100,
      status: "completed",
      date: "2023-06-15",
    },
    {
      id: "tx456",
      type: "investment",
      amount: 50,
      status: "completed",
      date: "2023-06-10",
    },
    {
      id: "tx789",
      type: "reward",
      amount: 25,
      status: "completed",
      date: "2023-06-05",
    },
    {
      id: "tx101",
      type: "withdrawal",
      amount: 30,
      status: "pending",
      date: "2023-06-01",
    },
  ];

  // Fungsi untuk mendapatkan ikon berdasarkan tipe aktivitas
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "post":
        return <i className="fas fa-comment-alt"></i>;
      case "investment":
        return <i className="fas fa-chart-line"></i>;
      case "reward":
        return <i className="fas fa-gift"></i>;
      default:
        return <i className="fas fa-bell"></i>;
    }
  };

  // Fungsi untuk mendapatkan ikon dan kelas berdasarkan tipe transaksi
  const getTransactionDetails = (type: string) => {
    switch (type) {
      case "deposit":
        return {
          icon: <i className="fas fa-arrow-down"></i>,
          class: "transaction-deposit",
        };
      case "withdrawal":
        return {
          icon: <i className="fas fa-arrow-up"></i>,
          class: "transaction-withdrawal",
        };
      case "investment":
        return {
          icon: <i className="fas fa-chart-line"></i>,
          class: "transaction-investment",
        };
      case "reward":
        return {
          icon: <i className="fas fa-gift"></i>,
          class: "transaction-reward",
        };
      default:
        return { icon: <i className="fas fa-exchange-alt"></i>, class: "" };
    }
  };

  if (!ownSphere) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Menghubungkan ke Internet Computer...</p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Memuat profil...</p>
      </div>
    );
  }

  return (
    <div className="page profile-page">
      {!userProfile ? (
        <section className="register-section">
          <div className="register-header">
            <i className="fas fa-user-circle profile-icon"></i>
            <h2>{isLoginMode ? "Masuk ke Akun" : "Buat Profil Baru"}</h2>
            <p>
              {isLoginMode
                ? "Masuk ke akun OwnSphere Anda"
                : "Bergabunglah dengan OwnSphere untuk mulai berbagi, berinvestasi, dan mendapatkan hadiah"}
            </p>
          </div>
          <div className="register-form">
            {error && (
              <div
                className="error-message"
                style={{ color: "red", marginBottom: "15px" }}
              >
                {error}
              </div>
            )}

            {!isLoginMode && (
              <>
                <div className="form-group">
                  <label htmlFor="userId">User ID</label>
                  <div className="input-with-icon">
                    <i className="fas fa-id-card"></i>
                    <input
                      id="userId"
                      type="text"
                      placeholder="Pilih ID unik"
                      value={userId}
                      onChange={(e) => handleInputChange(e, setUserId)}
                      className="input-field"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap</label>
                  <div className="input-with-icon">
                    <i className="fas fa-user"></i>
                    <input
                      id="name"
                      type="text"
                      placeholder="Masukkan nama Anda"
                      value={name}
                      onChange={(e) => handleInputChange(e, setName)}
                      className="input-field"
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input
                  id="email"
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={(e) => handleInputChange(e, setEmail)}
                  className="input-field"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input
                  id="password"
                  type="password"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => handleInputChange(e, setPassword)}
                  className="input-field"
                  disabled={loading}
                />
              </div>
            </div>

            {!isLoginMode && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Konfirmasi Password</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Masukkan ulang password Anda"
                    value={confirmPassword}
                    onChange={(e) => handleInputChange(e, setConfirmPassword)}
                    className="input-field"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <button
              onClick={isLoginMode ? login : register}
              disabled={loading}
              className="register-button"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>{" "}
                  {isLoginMode ? "Memproses..." : "Membuat Profil..."}
                </>
              ) : (
                <>
                  <i
                    className={`fas ${
                      isLoginMode ? "fa-sign-in-alt" : "fa-user-plus"
                    }`}
                  ></i>
                  {isLoginMode ? "Masuk" : "Buat Profil"}
                </>
              )}
            </button>

            <div
              className="form-switch"
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="switch-button"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary-color)",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {isLoginMode
                  ? "Belum punya akun? Daftar"
                  : "Sudah punya akun? Masuk"}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="profile-container">
          <section className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <h2>{userProfile.name}</h2>
              <p className="profile-id">@{userProfile.id}</p>
              <div className="profile-actions">
                <button className="action-button">
                  <i className="fas fa-edit"></i> Edit Profil
                </button>
                <button
                  className="action-button"
                  style={{ background: "var(--secondary-color)" }}
                >
                  <i className="fas fa-share-alt"></i> Bagikan
                </button>
              </div>
            </div>
            <div className="profile-stats">
              <div className="stat-card">
                <h3>Post</h3>
                <p>{userProfile.posts.length}</p>
              </div>
              <div className="stat-card">
                <h3>Token</h3>
                <p>{userProfile.tokens}</p>
              </div>
              <div className="stat-card">
                <h3>Investasi</h3>
                <p>0</p>
              </div>
              <div className="stat-card">
                <h3>Hadiah</h3>
                <p>0</p>
              </div>
            </div>
          </section>

          <div className="profile-content">
            <div className="profile-tabs">
              <button
                className={`tab-button ${
                  activeTab === "overview" ? "active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <i className="fas fa-chart-pie"></i> Overview
              </button>
              <button
                className={`tab-button ${
                  activeTab === "activity" ? "active" : ""
                }`}
                onClick={() => setActiveTab("activity")}
              >
                <i className="fas fa-history"></i> Aktivitas
              </button>
              <button
                className={`tab-button ${
                  activeTab === "transactions" ? "active" : ""
                }`}
                onClick={() => setActiveTab("transactions")}
              >
                <i className="fas fa-exchange-alt"></i> Transaksi
              </button>
              <button
                className={`tab-button ${
                  activeTab === "settings" ? "active" : ""
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <i className="fas fa-cog"></i> Pengaturan
              </button>
            </div>

            {activeTab === "overview" && (
              <section className="profile-overview">
                <h3>Selamat Datang di Profil Anda</h3>
                <p>
                  Anda telah bergabung dengan OwnSphere. Mulailah berbagi
                  konten, berinvestasi, dan dapatkan hadiah!
                </p>
              </section>
            )}

            {activeTab === "activity" && (
              <section className="profile-activity">
                <h3>Aktivitas Terbaru</h3>
                <div className="activity-list">
                  {activityData.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="activity-content">
                        <h4>{activity.content}</h4>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "transactions" && (
              <section className="profile-transactions">
                <h3>Riwayat Transaksi</h3>
                <div className="transaction-list">
                  {transactionData.map((transaction) => {
                    const details = getTransactionDetails(transaction.type);
                    return (
                      <div
                        key={transaction.id}
                        className={`transaction-item ${details.class}`}
                      >
                        <div className="transaction-icon">{details.icon}</div>
                        <div className="transaction-details">
                          <div className="transaction-info">
                            <h4>
                              {transaction.type.charAt(0).toUpperCase() +
                                transaction.type.slice(1)}
                            </h4>
                            <span>{transaction.date}</span>
                          </div>
                          <div className="transaction-amount">
                            <p>
                              {transaction.type === "withdrawal" ? "-" : "+"}
                              {transaction.amount} Token
                            </p>
                            <span
                              className={`transaction-status status-${transaction.status}`}
                            >
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {activeTab === "settings" && (
              <section className="profile-settings">
                <h3>Pengaturan Profil</h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Nama Tampilan</label>
                    <input
                      type="text"
                      className="input-field"
                      defaultValue={userProfile.name}
                    />
                  </div>
                  <div className="form-group">
                    <label>Notifikasi Email</label>
                    <div className="toggle-container">
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                      <span>Terima notifikasi email</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Privasi</label>
                    <div className="toggle-container">
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                      <span>Buat profil privat</span>
                    </div>
                  </div>
                  <button className="action-button">
                    <i className="fas fa-save"></i> Simpan Perubahan
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
