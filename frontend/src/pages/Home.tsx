import React, { useEffect } from "react";
import { Actor } from "@dfinity/agent";
import { Link } from "react-router-dom";

interface User {
  id: string;
  name: string;
  tokens: number;
}

interface OwnSphereActor extends Actor {
  // Definisikan method yang digunakan di halaman Home
  getUser: (userId: string) => Promise<User | null>;
  getTokenBalance: (userId: string) => Promise<number>;
}

interface HomeProps {
  ownSphere: OwnSphereActor;
}

const Home: React.FC<HomeProps> = ({ ownSphere }) => {
  // Statistik platform yang statis
  const platformStats = {
    users: "10,000+",
    invested: "$5M+",
    transactions: "50,000+",
  };

  // Gunakan ownSphere untuk mendapatkan statistik platform (simulasi)
  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        // Simulasi penggunaan ownSphere
        // Dalam implementasi nyata, Anda akan memanggil metode canister yang sebenarnya
        console.log(
          "Mengambil statistik platform menggunakan actor:",
          ownSphere
        );

        // Contoh penggunaan ownSphere (dikomentari karena hanya simulasi)
        // const demoUser = await ownSphere.getUser("demo-user");
        // console.log("Demo user:", demoUser);
      } catch (error) {
        console.error("Error saat mengambil statistik platform:", error);
      }
    };

    fetchPlatformStats();
  }, [ownSphere]);

  return (
    <div className="page home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Selamat Datang di OwnSphere</h1>
          <p>
            Platform terdesentralisasi generasi baru untuk jejaring sosial,
            investasi, dan mendapatkan rewards. Dibangun di atas Internet
            Computer Protocol untuk keamanan dan transparansi maksimal.
          </p>
          <div className="hero-buttons">
            <Link to="/profile" className="action-button">
              <i className="fas fa-user-plus"></i> Buat Profil
            </Link>
            <Link
              to="/investment"
              className="action-button"
              style={{ background: "var(--secondary-color)" }}
            >
              <i className="fas fa-coins"></i> Mulai Investasi
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-overview">
        <div className="stat-overview-item">
          <i className="fas fa-users"></i>
          <h3>{platformStats.users}</h3>
          <p>Pengguna Aktif</p>
        </div>
        <div className="stat-overview-item">
          <i className="fas fa-chart-pie"></i>
          <h3>{platformStats.invested}</h3>
          <p>Total Investasi</p>
        </div>
        <div className="stat-overview-item">
          <i className="fas fa-exchange-alt"></i>
          <h3>{platformStats.transactions}</h3>
          <p>Transaksi</p>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-share-alt"></i>
          </div>
          <h3>Bagikan Post</h3>
          <p>
            Terhubung dengan teman dan bagikan pemikiran, ide, dan pengalaman
            Anda dalam lingkungan yang aman dan terdesentralisasi.
          </p>
          <Link to="/posts" className="feature-link">
            Mulai Posting <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3>Investasi</h3>
          <p>
            Temukan peluang investasi baru dan kembangkan portofolio Anda dengan
            alat investasi dan analitik canggih kami.
          </p>
          <Link to="/investment" className="feature-link">
            Jelajahi Investasi <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-gift"></i>
          </div>
          <h3>Dapatkan Rewards</h3>
          <p>
            Dapatkan token untuk kontribusi Anda ke platform. Stake token Anda
            untuk mendapatkan lebih banyak rewards.
          </p>
          <Link to="/profile" className="feature-link">
            Lihat Rewards <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      <section className="testimonials">
        <h2>Apa Kata Pengguna Kami</h2>
        <div className="testimonial-container">
          <div className="testimonial-card">
            <div className="testimonial-quote">
              <i className="fas fa-quote-left"></i>
              <p>
                OwnSphere telah mengubah cara saya berpikir tentang jejaring
                sosial dan investasi. Platform ini intuitif dan sistem
                rewards-nya luar biasa!
              </p>
            </div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="testimonial-info">
                <h4>Alex Johnson</h4>
                <p>Pengguna Awal</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-quote">
              <i className="fas fa-quote-left"></i>
              <p>
                Alat investasi yang disediakan oleh OwnSphere sangat bagus. Saya
                telah melihat peningkatan signifikan dalam portofolio saya sejak
                mulai menggunakan platform ini.
              </p>
            </div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="testimonial-info">
                <h4>Sarah Williams</h4>
                <p>Analis Investasi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Siap Bergabung dengan OwnSphere?</h2>
        <p>
          Mulai perjalanan Anda hari ini dan rasakan masa depan jejaring sosial
          dan investasi terdesentralisasi.
        </p>
        <Link to="/profile" className="action-button">
          <i className="fas fa-rocket"></i> Mulai Sekarang
        </Link>
      </section>
    </div>
  );
};

export default Home;
