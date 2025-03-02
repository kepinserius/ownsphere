import React, { useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Actor, HttpAgent, AnonymousIdentity } from "@dfinity/agent";
import { idlFactory } from "../../src/declarations/ownsphere_backend/index";
import "./App.css";

// Komponen Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Posts from "./pages/Posts";
import Investment from "./pages/Investment";
import Settings from "./pages/Settings";

// Interface untuk User dan Post
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

// Interface untuk Actor
interface OwnSphereActor extends Actor {
  registerUser: (
    userId: string,
    name: string,
    email: string,
    passwordHash: string
  ) => Promise<boolean>;
  loginUser: (email: string, passwordHash: string) => Promise<User | null>;
  createPost: (userId: string, content: string) => Promise<boolean>;
  getInvestmentSuggestion: (userId: string) => Promise<string>;
  buyTokens: (userId: string, amount: number) => Promise<boolean>;
  getTokenBalance: (userId: string) => Promise<number>;
  getUser: (userId: string) => Promise<User | null>;
  getUserByEmail: (email: string) => Promise<User | null>;
}

// Create context
export const OwnSphereContext = createContext<OwnSphereActor | null>(null);

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [ownSphere, setOwnSphere] = useState<OwnSphereActor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/profile";
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Inisialisasi agent dan actor
  React.useEffect(() => {
    const initActor = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const identity = new AnonymousIdentity();
        const agent = new HttpAgent({
          host:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:4943"
              : undefined,
          identity,
        });

        if (process.env.NODE_ENV === "development") {
          try {
            console.log("Fetching root key for development...");
            await agent.fetchRootKey();
          } catch (err) {
            console.warn(
              "Unable to fetch root key. Check if your local replica is running"
            );
            console.error(err);
            setError("Gagal terhubung ke local replica");
            setIsLoading(false);
            return;
          }
        }

        console.log("Creating actor...");
        const actor = Actor.createActor(idlFactory, {
          agent,
          canisterId:
            process.env.CANISTER_ID_OWNSPHERE_BACKEND ||
            "be2us-64aaa-aaaaa-qaabq-cai",
        }) as OwnSphereActor;

        console.log("Actor created successfully");
        setOwnSphere(actor);
      } catch (err) {
        console.error("Error creating actor:", err);
        setError("Gagal membuat koneksi ke Internet Computer");
      } finally {
        setIsLoading(false);
      }
    };

    initActor();
  }, []);

  // Tambahkan font dan ikon
  React.useEffect(() => {
    // Tambahkan Google Fonts
    const linkFont = document.createElement("link");
    linkFont.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    linkFont.rel = "stylesheet";
    document.head.appendChild(linkFont);

    // Tambahkan Font Awesome
    const linkIcon = document.createElement("link");
    linkIcon.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    linkIcon.rel = "stylesheet";
    document.head.appendChild(linkIcon);

    return () => {
      document.head.removeChild(linkFont);
      document.head.removeChild(linkIcon);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Menghubungkan ke Internet Computer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          <i className="fas fa-redo"></i> Coba Lagi
        </button>
      </div>
    );
  }

  if (!ownSphere) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>Koneksi ke Internet Computer tidak tersedia</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          <i className="fas fa-redo"></i> Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <OwnSphereContext.Provider value={ownSphere}>
      <Router>
        <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
          <header className="header">
            <h1>
              <i className="fas fa-globe-americas"></i> OwnSphere
            </h1>
            <nav className="nav-menu">
              <Link to="/" className="nav-link">
                <i className="fas fa-home"></i> Beranda
              </Link>
              <Link to="/profile" className="nav-link">
                <i className="fas fa-user"></i> Profil
              </Link>
              <Link to="/posts" className="nav-link">
                <i className="fas fa-comment-alt"></i> Post
              </Link>
              <Link to="/investment" className="nav-link">
                <i className="fas fa-chart-line"></i> Investasi
              </Link>
              <Link to="/settings" className="nav-link">
                <i className="fas fa-cog"></i> Pengaturan
              </Link>
            </nav>
            <div className="header-actions">
              <button
                className="mode-toggle"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? (
                  <>
                    <i className="fas fa-sun"></i> Light
                  </>
                ) : (
                  <>
                    <i className="fas fa-moon"></i> Dark
                  </>
                )}
              </button>
              {localStorage.getItem("userId") && (
                <button className="logout-button" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Keluar
                </button>
              )}
            </div>
          </header>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home ownSphere={ownSphere} />} />
              <Route
                path="/profile"
                element={<Profile ownSphere={ownSphere} />}
              />
              <Route path="/posts" element={<Posts ownSphere={ownSphere} />} />
              <Route
                path="/investment"
                element={<Investment ownSphere={ownSphere} />}
              />
              <Route
                path="/settings"
                element={
                  <Settings
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    ownSphere={ownSphere}
                  />
                }
              />
            </Routes>
          </main>
        </div>
      </Router>

      {/* Modal Konfirmasi Logout */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Konfirmasi Logout</h3>
            </div>
            <div className="modal-body">
              <p>Apakah Anda yakin ingin keluar dari akun Anda?</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={cancelLogout}>
                <i className="fas fa-times"></i> Batal
              </button>
              <button className="confirm-button" onClick={confirmLogout}>
                <i className="fas fa-check"></i> Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </OwnSphereContext.Provider>
  );
};

export default App;
