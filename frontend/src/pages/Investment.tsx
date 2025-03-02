import React, { useState, useEffect } from "react";
import { Actor } from "@dfinity/agent";

interface OwnSphereActor extends Actor {
  getInvestmentSuggestion: (userId: string) => Promise<string>;
  getTokenBalance: (userId: string) => Promise<number>;
  buyTokens: (userId: string, amount: number) => Promise<boolean>;
}

interface InvestmentProps {
  ownSphere: OwnSphereActor;
}

// Data pasar simulasi untuk tampilan
const marketData = [
  {
    name: "OwnSphere Token",
    value: "$2.45",
    change: "+5.2%",
    trend: "up",
    icon: "fa-coins",
  },
  {
    name: "Bitcoin",
    value: "$42,150.00",
    change: "-1.8%",
    trend: "down",
    icon: "fa-bitcoin-sign",
  },
  {
    name: "Ethereum",
    value: "$3,250.75",
    change: "+2.3%",
    trend: "up",
    icon: "fa-ethereum",
  },
  {
    name: "Internet Computer",
    value: "$8.95",
    change: "+0.5%",
    trend: "neutral",
    icon: "fa-globe",
  },
];

// Saran investasi simulasi
const investmentSuggestions = [
  {
    title: "Diversifikasi Portfolio",
    description:
      "Pertimbangkan untuk mengalokasikan 30% dari token Anda ke OwnSphere Token, 40% ke Bitcoin, dan 30% ke Ethereum untuk portofolio yang seimbang.",
    icon: "fa-chart-pie",
    stats: { potential: "+12.5%", risk: "Sedang", timeframe: "6 bulan" },
  },
  {
    title: "Investasi Jangka Panjang",
    description:
      "Akumulasi OwnSphere Token secara bertahap selama 12 bulan berikutnya untuk mendapatkan keuntungan dari pertumbuhan platform.",
    icon: "fa-clock",
    stats: { potential: "+25%", risk: "Rendah", timeframe: "12 bulan" },
  },
];

const Investment: React.FC<InvestmentProps> = ({ ownSphere }) => {
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Simulasi user ID untuk demo
  useEffect(() => {
    // Dalam aplikasi nyata, userId akan diambil dari state global atau localStorage
    setUserId("demo-user");
    fetchTokenBalance();
  }, []);

  const fetchTokenBalance = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const balance = await ownSphere.getTokenBalance(userId);
      setTokenBalance(Number(balance));
    } catch (error) {
      console.error("Gagal mengambil saldo token:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestion = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const sug = await ownSphere.getInvestmentSuggestion(userId);
      setSuggestion(String(sug));
    } catch (error) {
      console.error("Gagal mendapatkan saran:", error);
    } finally {
      setLoading(false);
    }
  };

  const buyTokens = async () => {
    if (!userId || amount <= 0) return;
    setLoading(true);
    try {
      const result = await ownSphere.buyTokens(userId, amount);
      if (result) {
        alert(`Berhasil membeli ${amount} token!`);
        fetchTokenBalance();
      }
    } catch (error) {
      console.error("Gagal membeli token:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page investment-container">
      <section className="market-data-section">
        <div className="section-header">
          <h2>
            <i className="fas fa-chart-line"></i> Portofolio Investasi Anda
          </h2>
          <button
            className="refresh-button"
            onClick={fetchTokenBalance}
            disabled={loading}
            title="Perbarui data"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>

        <div className="token-balance" style={{ marginBottom: "30px" }}>
          <h3>
            <i className="fas fa-wallet"></i> Saldo Token:{" "}
            <span style={{ color: "var(--primary-color)" }}>
              {tokenBalance}
            </span>
          </h3>

          <div style={{ marginTop: "20px" }}>
            <h3>
              <i className="fas fa-shopping-cart"></i> Beli Token
            </h3>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                className="input-field"
                style={{ maxWidth: "150px", margin: 0 }}
              />
              <button
                className="action-button"
                onClick={buyTokens}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Memproses...
                  </>
                ) : (
                  <>
                    <i className="fas fa-coins"></i> Beli Token
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <h3>
          <i className="fas fa-globe"></i> Data Pasar
        </h3>
        <div className="market-data-grid">
          {marketData.map((item, index) => (
            <div key={index} className={`market-card ${item.trend}`}>
              <h3>
                <i className={`fas ${item.icon}`}></i> {item.name}
              </h3>
              <div className="market-data">
                <div className="market-value">{item.value}</div>
                <div className="market-change">
                  <i
                    className={`fas fa-${
                      item.trend === "up"
                        ? "arrow-up"
                        : item.trend === "down"
                        ? "arrow-down"
                        : "arrows-alt-h"
                    }`}
                  ></i>
                  {item.change}
                </div>
                <div className="market-time">
                  Terakhir diperbarui: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="investment-suggestions">
        <div className="section-header">
          <h2>
            <i className="fas fa-lightbulb"></i> Saran Investasi
          </h2>
          <button
            className="refresh-button"
            onClick={getSuggestion}
            disabled={loading}
            title="Dapatkan saran baru"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>

        {showSuggestions ? (
          <div className="suggestion-list">
            {investmentSuggestions.map((item, index) => (
              <div key={index} className="suggestion-card">
                <div className="suggestion-icon">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div className="suggestion-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="suggestion-meta">
                    <div className="suggestion-stats">
                      <div className="suggestion-stat positive">
                        <i className="fas fa-chart-line"></i>{" "}
                        {item.stats.potential}
                      </div>
                      <div className="suggestion-stat">
                        <i className="fas fa-shield-alt"></i> Risiko:{" "}
                        {item.stats.risk}
                      </div>
                      <div className="suggestion-stat">
                        <i className="fas fa-calendar-alt"></i>{" "}
                        {item.stats.timeframe}
                      </div>
                    </div>
                    <div className="suggestion-actions">
                      <button className="suggestion-button">Analisis</button>
                      <button className="suggestion-button invest">
                        Investasi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <i className="fas fa-search"></i>
            <h3>Belum Ada Saran Investasi</h3>
            <p>
              Dapatkan saran investasi yang dipersonalisasi berdasarkan profil
              dan preferensi Anda.
            </p>
            <button
              className="fetch-button"
              onClick={() => setShowSuggestions(true)}
            >
              <i className="fas fa-lightbulb"></i> Dapatkan Saran
            </button>
          </div>
        )}

        {suggestion && (
          <div
            className="suggestion-display"
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "rgba(58, 134, 255, 0.05)",
              borderRadius: "12px",
            }}
          >
            <h3>
              <i className="fas fa-robot"></i> Saran AI
            </h3>
            <p style={{ marginTop: "10px", lineHeight: "1.6" }}>{suggestion}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Investment;
