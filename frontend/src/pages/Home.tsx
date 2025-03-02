import React, { useEffect, useState } from "react";
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
  // State untuk animasi scroll
  const [scrollY, setScrollY] = useState(0);
  // State untuk FAQ
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  // State untuk counter animation
  const [countersVisible, setCountersVisible] = useState(false);
  // State untuk video modal
  const [showVideoModal, setShowVideoModal] = useState(false);
  // State untuk scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);
  // State untuk back to top button
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Statistik platform yang statis
  const platformStats = {
    users: "10,000+",
    invested: "$5M+",
    transactions: "50,000+",
  };

  // Data untuk bagian "Bagaimana Cara Kerjanya"
  const howItWorksSteps = [
    {
      icon: "fa-user-plus",
      title: "Buat Akun",
      description:
        "Daftar dengan mudah dan buat profil Anda dalam hitungan detik.",
    },
    {
      icon: "fa-share-alt",
      title: "Bagikan Konten",
      description:
        "Posting pemikiran, ide, dan pengalaman Anda dengan komunitas.",
    },
    {
      icon: "fa-coins",
      title: "Investasi",
      description:
        "Mulai berinvestasi dalam aset digital dan dapatkan keuntungan.",
    },
    {
      icon: "fa-gift",
      title: "Dapatkan Rewards",
      description:
        "Kumpulkan token untuk aktivitas Anda dan tukarkan dengan hadiah.",
    },
  ];

  // Data untuk bagian "Teknologi Blockchain"
  const blockchainFeatures = [
    {
      icon: "fa-shield-alt",
      title: "Keamanan Tinggi",
      description: "Data Anda dilindungi oleh teknologi blockchain canggih.",
    },
    {
      icon: "fa-tachometer-alt",
      title: "Kecepatan Transaksi",
      description:
        "Transaksi instan dengan biaya rendah berkat Internet Computer.",
    },
    {
      icon: "fa-lock",
      title: "Privasi Terjamin",
      description: "Anda memiliki kendali penuh atas data pribadi Anda.",
    },
    {
      icon: "fa-code",
      title: "Smart Contracts",
      description: "Kontrak pintar yang transparan dan dapat diverifikasi.",
    },
  ];

  // Data untuk bagian "Berita Terbaru"
  const latestNews = [
    {
      date: "10 Maret 2023",
      title: "OwnSphere Mencapai 10.000 Pengguna Aktif",
      summary:
        "Platform kami terus berkembang dengan pesat berkat dukungan komunitas yang luar biasa.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    },
    {
      date: "5 Maret 2023",
      title: "Fitur Baru: Analisis Investasi AI",
      summary:
        "Kami meluncurkan fitur analisis investasi berbasis AI untuk membantu pengguna membuat keputusan investasi yang lebih baik.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    },
    {
      date: "28 Februari 2023",
      title: "Kemitraan dengan Perusahaan Fintech Terkemuka",
      summary:
        "OwnSphere menjalin kemitraan strategis dengan beberapa perusahaan fintech terkemuka untuk memperluas layanan kami.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    },
  ];

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

    // Tambahkan event listener untuk scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Aktifkan counter animation ketika user scroll ke stats section
      if (currentScrollY > 300 && !countersVisible) {
        setCountersVisible(true);
      }

      // Update scroll progress
      const windowHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (currentScrollY / windowHeight) * 100;
      setScrollProgress(scrolled);

      // Show/hide back to top button
      setShowBackToTop(currentScrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ownSphere, countersVisible]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Toggle FAQ
  const toggleFaq = (index: number) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  // Buka video modal
  const openVideoModal = () => {
    setShowVideoModal(true);
    // Mencegah scrolling pada body ketika modal terbuka
    document.body.style.overflow = "hidden";
  };

  // Tutup video modal
  const closeVideoModal = () => {
    setShowVideoModal(false);
    // Mengaktifkan kembali scrolling pada body
    document.body.style.overflow = "auto";
  };

  return (
    <div className="page home-page">
      {/* Scroll Progress Indicator */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}

      {/* Hero Section dengan Parallax Effect */}
      <section
        className="hero-section"
        style={{
          backgroundPositionY: `${scrollY * 0.5}px`,
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animated-title">Selamat Datang di OwnSphere</h1>
          <p className="hero-description">
            Platform terdesentralisasi generasi baru untuk jejaring sosial,
            investasi, dan mendapatkan rewards. Dibangun di atas Internet
            Computer Protocol untuk keamanan dan transparansi maksimal.
          </p>
          <div className="hero-buttons">
            <Link to="/profile" className="action-button pulse-animation">
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

        <div
          className="scroll-indicator"
          style={{
            position: "absolute",
            bottom: "50px",
            left: "0",
            right: "0",
            margin: "0 auto",
            width: "200px",
            textAlign: "center",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{ color: "white", marginBottom: "10px", fontWeight: "500" }}
          >
            Scroll untuk menjelajahi
          </span>
          <i
            className="fas fa-chevron-down bounce"
            style={{ color: "white", fontSize: "20px" }}
          ></i>
        </div>
      </section>

      {/* Statistik dengan Counter Animation */}
      <section className="stats-overview">
        <div
          className="stat-overview-item"
          style={{
            transform: `translateY(${Math.max(0, 50 - scrollY / 10)}px)`,
            opacity: Math.min(1, scrollY / 300),
          }}
        >
          <i className="fas fa-users"></i>
          <h3 className={countersVisible ? "counter-animate" : ""}>
            {platformStats.users}
          </h3>
          <p>Pengguna Aktif</p>
        </div>
        <div
          className="stat-overview-item"
          style={{
            transform: `translateY(${Math.max(0, 70 - scrollY / 10)}px)`,
            opacity: Math.min(1, scrollY / 300),
          }}
        >
          <i className="fas fa-chart-pie"></i>
          <h3 className={countersVisible ? "counter-animate" : ""}>
            {platformStats.invested}
          </h3>
          <p>Total Investasi</p>
        </div>
        <div
          className="stat-overview-item"
          style={{
            transform: `translateY(${Math.max(0, 90 - scrollY / 10)}px)`,
            opacity: Math.min(1, scrollY / 300),
          }}
        >
          <i className="fas fa-exchange-alt"></i>
          <h3 className={countersVisible ? "counter-animate" : ""}>
            {platformStats.transactions}
          </h3>
          <p>Transaksi</p>
        </div>
      </section>

      {/* Video Intro Section */}
      <section className="video-intro-section">
        <div className="section-header">
          <h2>Kenapa OwnSphere?</h2>
          <p>
            Lihat bagaimana OwnSphere mengubah cara kita berinteraksi dan
            berinvestasi
          </p>
        </div>
        <div className="video-container">
          <div className="video-placeholder" onClick={openVideoModal}>
            <i className="fas fa-play-circle"></i>
            <span>Tonton Video Pengenalan</span>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="video-modal-close" onClick={closeVideoModal}>
              <i className="fas fa-times"></i>
            </button>
            <div className="video-modal-iframe">
              {/* Placeholder untuk video - dalam implementasi nyata, ganti dengan iframe YouTube atau video player lainnya */}
              <div className="video-placeholder-modal">
                <i className="fas fa-film"></i>
                <p>Video Pengenalan OwnSphere</p>
                <span>
                  Video akan ditampilkan di sini dalam implementasi nyata
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bagaimana Cara Kerjanya */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>Bagaimana Cara Kerjanya</h2>
          <p>
            Empat langkah sederhana untuk memulai perjalanan Anda di OwnSphere
          </p>
        </div>
        <div className="steps-container">
          {howItWorksSteps.map((step, index) => (
            <div
              className="step-card"
              key={index}
              style={{
                transform: scrollY > 600 ? "translateY(0)" : "translateY(50px)",
                opacity: scrollY > 600 ? 1 : 0,
                transition: `all 0.5s ease ${index * 0.2}s`,
              }}
            >
              <div className="step-icon">
                <i className={`fas ${step.icon}`}></i>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fitur Utama */}
      <section className="features-section">
        <div className="section-header">
          <h2>Fitur Utama</h2>
          <p>Jelajahi apa yang dapat Anda lakukan di OwnSphere</p>
        </div>
        <div className="features-container">
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
              Temukan peluang investasi baru dan kembangkan portofolio Anda
              dengan alat investasi dan analitik canggih kami.
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
        </div>
      </section>

      {/* Teknologi Blockchain */}
      <section className="blockchain-section">
        <div className="section-header">
          <h2>Didukung Teknologi Blockchain</h2>
          <p>Keunggulan teknologi Internet Computer Protocol</p>
        </div>
        <div className="blockchain-features">
          {blockchainFeatures.map((feature, index) => (
            <div
              className="blockchain-feature-card"
              key={index}
              style={{
                transform: scrollY > 1200 ? "scale(1)" : "scale(0.8)",
                opacity: scrollY > 1200 ? 1 : 0,
                transition: `all 0.5s ease ${index * 0.15}s`,
              }}
            >
              <div className="feature-icon">
                <i className={`fas ${feature.icon}`}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Berita Terbaru */}
      <section className="latest-news-section">
        <div className="section-header">
          <h2>Berita Terbaru</h2>
          <p>Tetap update dengan perkembangan terbaru OwnSphere</p>
        </div>
        <div className="news-container">
          {latestNews.map((news, index) => (
            <div className="news-card" key={index}>
              <div
                className="news-image"
                style={{ backgroundImage: `url(${news.image})` }}
              >
                <div className="news-date">{news.date}</div>
              </div>
              <div className="news-content">
                <h3>{news.title}</h3>
                <p>{news.summary}</p>
                <a href="#" className="read-more">
                  Baca Selengkapnya <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonials">
        <div className="section-header">
          <h2>Apa Kata Pengguna Kami</h2>
          <p>Pengalaman nyata dari komunitas OwnSphere</p>
        </div>
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

          <div className="testimonial-card">
            <div className="testimonial-quote">
              <i className="fas fa-quote-left"></i>
              <p>
                Saya sangat terkesan dengan keamanan dan transparansi yang
                ditawarkan oleh teknologi blockchain di OwnSphere. Ini
                benar-benar masa depan!
              </p>
            </div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="testimonial-info">
                <h4>Michael Chen</h4>
                <p>Developer Blockchain</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-header">
          <h2>Pertanyaan Umum</h2>
          <p>Jawaban untuk pertanyaan yang sering diajukan</p>
        </div>
        <div className="faq-container">
          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(0)}>
              <h3>Apa itu OwnSphere?</h3>
              <i
                className={`fas ${
                  activeFaq === 0 ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </div>
            <div
              className="faq-answer"
              style={{
                maxHeight: activeFaq === 0 ? "500px" : "0",
                opacity: activeFaq === 0 ? 1 : 0,
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <p>
                OwnSphere adalah platform terdesentralisasi yang menggabungkan
                jejaring sosial, investasi, dan sistem rewards berbasis
                blockchain. Platform ini dibangun di atas Internet Computer
                Protocol untuk memberikan keamanan, transparansi, dan efisiensi
                maksimal.
              </p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(1)}>
              <h3>Bagaimana cara memulai di OwnSphere?</h3>
              <i
                className={`fas ${
                  activeFaq === 1 ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </div>
            <div
              className="faq-answer"
              style={{
                maxHeight: activeFaq === 1 ? "500px" : "0",
                opacity: activeFaq === 1 ? 1 : 0,
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <p>
                Untuk memulai, cukup buat profil Anda dengan mengklik tombol
                "Buat Profil" di halaman utama. Setelah itu, Anda dapat mulai
                membagikan post, menjelajahi peluang investasi, dan mendapatkan
                rewards.
              </p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(2)}>
              <h3>Apakah OwnSphere aman?</h3>
              <i
                className={`fas ${
                  activeFaq === 2 ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </div>
            <div
              className="faq-answer"
              style={{
                maxHeight: activeFaq === 2 ? "500px" : "0",
                opacity: activeFaq === 2 ? 1 : 0,
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <p>
                Ya, OwnSphere dibangun dengan keamanan sebagai prioritas utama.
                Kami menggunakan teknologi blockchain canggih untuk melindungi
                data dan transaksi Anda. Semua aktivitas di platform kami
                transparan dan dapat diverifikasi.
              </p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(3)}>
              <h3>Apa keunggulan Internet Computer Protocol?</h3>
              <i
                className={`fas ${
                  activeFaq === 3 ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </div>
            <div
              className="faq-answer"
              style={{
                maxHeight: activeFaq === 3 ? "500px" : "0",
                opacity: activeFaq === 3 ? 1 : 0,
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <p>
                Internet Computer Protocol (ICP) menawarkan keunggulan seperti
                biaya transaksi rendah, kecepatan tinggi, skalabilitas, dan
                kemampuan untuk menjalankan aplikasi web secara
                terdesentralisasi. ICP juga memungkinkan smart contract yang
                lebih kompleks dan efisien dibandingkan blockchain tradisional.
              </p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(4)}>
              <h3>Bagaimana cara mendapatkan token di OwnSphere?</h3>
              <i
                className={`fas ${
                  activeFaq === 4 ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </div>
            <div
              className="faq-answer"
              style={{
                maxHeight: activeFaq === 4 ? "500px" : "0",
                opacity: activeFaq === 4 ? 1 : 0,
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <p>
                Anda dapat mendapatkan token di OwnSphere melalui berbagai cara:
                membuat konten berkualitas, berpartisipasi dalam diskusi,
                mengundang teman, atau membeli token langsung melalui halaman
                Investasi. Token ini dapat digunakan untuk investasi atau
                ditukarkan dengan rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section with Form Handling */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Dapatkan Update Terbaru</h2>
          <p>
            Berlangganan newsletter kami untuk mendapatkan informasi terbaru
            tentang fitur, pembaruan, dan berita OwnSphere.
          </p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Alamat Email Anda"
              className="newsletter-input"
            />
            <button
              className="newsletter-button"
              onClick={() => {
                alert("Terima kasih telah berlangganan newsletter OwnSphere!");
                // Reset input field setelah submit
                const input = document.querySelector(
                  ".newsletter-input"
                ) as HTMLInputElement;
                if (input) input.value = "";
              }}
            >
              Berlangganan
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Siap Bergabung dengan OwnSphere?</h2>
        <p>
          Mulai perjalanan Anda hari ini dan rasakan masa depan jejaring sosial
          dan investasi terdesentralisasi.
        </p>
        <Link to="/profile" className="action-button pulse-animation">
          <i className="fas fa-rocket"></i> Mulai Sekarang
        </Link>
      </section>
    </div>
  );
};

export default Home;
