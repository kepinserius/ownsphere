import React, { useState, useEffect, useCallback } from "react";
import { Actor, HttpAgent, AnonymousIdentity } from "@dfinity/agent";
import { idlFactory } from "../../src/declarations/ownsphere_backend/index"; // Path yang benar sesuai lokasi main.mo
import "./App.css";

// Buat identitas anonim untuk pengujian lokal
const identity = new AnonymousIdentity();

// Inisialisasi agent dengan konfigurasi modern
const agent = new HttpAgent({
  host: "http://localhost:4943", // Port default dfx lokal
  identity,
});
if (process.env.NODE_ENV === "development") {
  agent.fetchRootKey(); // Lewati verifikasi root key untuk pengujian lokal
}

// Inisialisasi actor untuk canister
const ownSphere = Actor.createActor(idlFactory, {
  agent,
  canisterId: "bkyz2-fmaaa-aaaaa-qaaaq-cai", // Ganti dengan canister ID yang benar
});

// Definisikan tipe data
interface Post {
  content: string;
  timestamp: number;
}

interface User {
  id: string;
  name: string;
  posts: Post[];
  tokens: number;
}

const App: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");
  const [suggestion, setSuggestion] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [marketData, setMarketData] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Tambahkan state untuk error logging

  // Gunakan useCallback untuk memastikan fetchPosts tidak di-redefine setiap render
  const fetchPosts = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null); // Reset error sebelum fetch
    try {
      const user = (await ownSphere.getUser(userId)) as User | null;
      console.log("Fetched user:", user); // Debugging
      if (user?.posts) {
        setPosts(user.posts);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setError("Failed to fetch posts: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // useEffect dengan dependency yang lengkap
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const register = async () => {
    setLoading(true);
    setError(null); // Reset error sebelum registrasi
    try {
      const result = await ownSphere.registerUser(userId, name);
      setLoading(false);
      alert(result ? "Registered!" : "Failed");
      if (result) await fetchPosts(); // Perbarui posts setelah registrasi
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed: " + (error as Error).message);
      setLoading(false);
    }
  };

  const createPost = async () => {
    setLoading(true);
    setError(null); // Reset error sebelum posting
    try {
      const result = await ownSphere.createPost(userId, postContent);
      if (result) {
        setPostContent("");
        await fetchPosts();
      }
      setLoading(false);
      alert(result ? "Posted!" : "Failed");
    } catch (error) {
      console.error("Posting failed:", error);
      setError("Posting failed: " + (error as Error).message);
      setLoading(false);
    }
  };

  const getSuggestion = async () => {
    setLoading(true);
    setError(null); // Reset error sebelum fetch suggestion
    try {
      const sug = await ownSphere.getInvestmentSuggestion(userId);
      setSuggestion(String(sug)); // Konversi ke string
    } catch (error) {
      console.error("Suggestion fetch failed:", error);
      setError("Suggestion fetch failed: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketData = async () => {
    setLoading(true);
    setError(null); // Reset error sebelum fetch market data
    try {
      const data = await ownSphere.getMarketData();
      setMarketData(String(data) || "No market data available"); // Konversi ke string
    } catch (error) {
      console.error("Market data fetch failed:", error);
      setError("Market data fetch failed: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const buyToken = async () => {
    setLoading(true);
    setError(null); // Reset error sebelum pembelian token
    try {
      const result = await ownSphere.buyTokens(userId, 10); // Beli 10 token
      if (result) {
        const balance = await ownSphere.getTokenBalance(userId);
        setTokenBalance(Number(balance)); // Konversi Nat ke number untuk TypeScript
      }
      setLoading(false);
      alert(result ? "Tokens bought successfully!" : "Failed to buy tokens");
    } catch (error) {
      console.error("Token purchase failed:", error);
      setError("Token purchase failed: " + (error as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="header">
        <h1>OwnSphere</h1>
        <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <div className="profile-card">
        {userId && name && (
          <>
            <h3>Welcome, {name}</h3>
            <p>User ID: {userId}</p>
            <p>
              Posts: {posts.length} | Tokens: {tokenBalance}
            </p>
          </>
        )}
      </div>

      <div className="main-content">
        {error && <p className="error-message">Error: {error}</p>}

        <section className="section">
          <h2>Register</h2>
          <input
            className="input-field"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            className="input-field"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="action-button"
            onClick={register}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </section>

        <section className="section">
          <h2>Create Post</h2>
          <input
            className="input-field"
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <button
            className="action-button"
            onClick={createPost}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </section>

        <section className="section posts-list">
          <h2>Your Posts</h2>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={post.timestamp || `post-${index}`}
                className="post-item"
              >
                <p>{post.content}</p>
                <span>{new Date(post.timestamp).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </section>

        <section className="section">
          <h2>Investment Zone</h2>
          <button
            className="action-button"
            onClick={fetchMarketData}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Get Market Data"}
          </button>
          <p className="market-data">{marketData}</p>
          <button
            className="action-button"
            onClick={buyToken}
            disabled={loading}
          >
            {loading ? "Buying..." : "Buy 10 Tokens"}
          </button>
          <button
            className="action-button"
            onClick={getSuggestion}
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Suggestion"}
          </button>
          <p className="suggestion-text">Suggestion: {suggestion}</p>
        </section>
      </div>
    </div>
  );
};

export default App;
