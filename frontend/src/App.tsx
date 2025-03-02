import React, { useState } from "react";
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
  posts: Post[];
  tokens: number;
}

// Interface untuk Actor
interface OwnSphereActor extends Actor {
  registerUser: (userId: string, name: string) => Promise<boolean>;
  createPost: (userId: string, content: string) => Promise<boolean>;
  getInvestmentSuggestion: (userId: string) => Promise<string>;
  buyTokens: (userId: string, amount: number) => Promise<boolean>;
  getTokenBalance: (userId: string) => Promise<number>;
  getUser: (userId: string) => Promise<User | null>;
}

// Inisialisasi agent dan actor
const identity = new AnonymousIdentity();
const agent = new HttpAgent({
  host: "http://localhost:4943",
  identity,
});

if (process.env.NODE_ENV === "development") {
  agent.fetchRootKey();
}

const ownSphere = Actor.createActor(idlFactory, {
  agent,
  canisterId: "bkyz2-fmaaa-aaaaa-qaaaq-cai",
}) as OwnSphereActor;

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

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

  return (
    <Router>
      <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
        <header className="header">
          <h1>
            <i className="fas fa-globe-americas"></i> OwnSphere
          </h1>
          <nav className="nav-menu">
            <Link to="/" className="nav-link">
              <i className="fas fa-home"></i> Home
            </Link>
            <Link to="/profile" className="nav-link">
              <i className="fas fa-user"></i> Profile
            </Link>
            <Link to="/posts" className="nav-link">
              <i className="fas fa-comment-alt"></i> Posts
            </Link>
            <Link to="/investment" className="nav-link">
              <i className="fas fa-chart-line"></i> Investment
            </Link>
            <Link to="/settings" className="nav-link">
              <i className="fas fa-cog"></i> Settings
            </Link>
          </nav>
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
                <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
