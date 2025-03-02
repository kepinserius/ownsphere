import React, { useState, ChangeEvent } from "react";
import { Actor } from "@dfinity/agent";

interface OwnSphereActor extends Actor {
  registerUser: (userId: string, name: string) => Promise<boolean>;
  getUser: (userId: string) => Promise<User | null>;
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
  posts: Post[];
  tokens: number;
}

const Profile: React.FC<ProfileProps> = ({ ownSphere }) => {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    setter(e.target.value);
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

  const register = async () => {
    if (!userId || !name) return;
    setLoading(true);
    try {
      const result = await ownSphere.registerUser(userId, name);
      if (result) {
        setUserProfile({ id: userId, name, posts: [], tokens: 0 });
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="page profile-page">
      {!userProfile ? (
        <section className="register-section">
          <div className="register-header">
            <i className="fas fa-user-circle profile-icon"></i>
            <h2>Create Your Profile</h2>
            <p>
              Join OwnSphere to start sharing, investing, and earning rewards
            </p>
          </div>
          <div className="register-form">
            <div className="form-group">
              <label htmlFor="userId">User ID</label>
              <div className="input-with-icon">
                <i className="fas fa-id-card"></i>
                <input
                  id="userId"
                  type="text"
                  placeholder="Choose a unique ID"
                  value={userId}
                  onChange={(e) => handleInputChange(e, setUserId)}
                  className="input-field"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-with-icon">
                <i className="fas fa-user"></i>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => handleInputChange(e, setName)}
                  className="input-field"
                />
              </div>
            </div>
            <button
              onClick={register}
              disabled={loading}
              className="action-button register-button"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i> Create Profile
                </>
              )}
            </button>
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
                  <i className="fas fa-edit"></i> Edit Profile
                </button>
                <button
                  className="action-button"
                  style={{ background: "var(--secondary-color)" }}
                >
                  <i className="fas fa-share-alt"></i> Share
                </button>
              </div>
            </div>
            <div className="profile-stats">
              <div className="stat-card">
                <h3>Posts</h3>
                <p>{userProfile.posts.length}</p>
              </div>
              <div className="stat-card">
                <h3>Tokens</h3>
                <p>{userProfile.tokens}</p>
              </div>
              <div className="stat-card">
                <h3>Investments</h3>
                <p>0</p>
              </div>
              <div className="stat-card">
                <h3>Rewards</h3>
                <p>0</p>
              </div>
            </div>
          </section>

          <div className="profile-tabs">
            <button
              className={`tab-button ${
                activeTab === "overview" ? "active" : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <i className="fas fa-th-large"></i> Overview
            </button>
            <button
              className={`tab-button ${
                activeTab === "activity" ? "active" : ""
              }`}
              onClick={() => setActiveTab("activity")}
            >
              <i className="fas fa-history"></i> Activity
            </button>
            <button
              className={`tab-button ${
                activeTab === "transactions" ? "active" : ""
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              <i className="fas fa-exchange-alt"></i> Transactions
            </button>
            <button
              className={`tab-button ${
                activeTab === "settings" ? "active" : ""
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <i className="fas fa-cog"></i> Settings
            </button>
          </div>

          {activeTab === "overview" && (
            <section className="profile-overview">
              <div className="overview-card">
                <h3>
                  <i className="fas fa-chart-pie"></i> Portfolio Summary
                </h3>
                <div className="portfolio-summary">
                  <div className="portfolio-item">
                    <span>Total Value</span>
                    <strong>{userProfile.tokens} Tokens</strong>
                  </div>
                  <div className="portfolio-item">
                    <span>Available Balance</span>
                    <strong>{userProfile.tokens} Tokens</strong>
                  </div>
                  <div className="portfolio-item">
                    <span>Invested</span>
                    <strong>0 Tokens</strong>
                  </div>
                  <div className="portfolio-item">
                    <span>Rewards Earned</span>
                    <strong>0 Tokens</strong>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>
                  <i className="fas fa-bullhorn"></i> Recent Activity
                </h3>
                <div className="activity-list">
                  {activityData.slice(0, 2).map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="activity-details">
                        <p>{activity.content}</p>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  ))}
                  <button
                    className="view-all-button"
                    onClick={() => setActiveTab("activity")}
                  >
                    View All Activity <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeTab === "activity" && (
            <section className="profile-activity">
              <h3>Your Activity</h3>
              <div className="activity-list">
                {activityData.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-details">
                      <p>{activity.content}</p>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "transactions" && (
            <section className="profile-transactions">
              <h3>Transaction History</h3>
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
                            {transaction.amount} Tokens
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
              <h3>Profile Settings</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue={userProfile.name}
                  />
                </div>
                <div className="form-group">
                  <label>Email Notifications</label>
                  <div className="toggle-container">
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                    <span>Receive email notifications</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Privacy</label>
                  <div className="toggle-container">
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                    <span>Make profile private</span>
                  </div>
                </div>
                <button className="action-button">
                  <i className="fas fa-save"></i> Save Changes
                </button>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
