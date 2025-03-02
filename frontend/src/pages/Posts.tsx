import React, { useState, useEffect } from "react";
import { Actor } from "@dfinity/agent";

interface OwnSphereActor extends Actor {
  createPost: (userId: string, content: string) => Promise<boolean>;
  getUser: (userId: string) => Promise<User | null>;
}

interface PostsProps {
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

const Posts: React.FC<PostsProps> = ({ ownSphere }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const userName = "Demo User";

  // Simulasi user ID untuk demo
  useEffect(() => {
    // Dalam aplikasi nyata, userId akan diambil dari state global atau localStorage
    setUserId("demo-user");

    // Simulasi beberapa post yang sudah ada
    setPosts([
      {
        id: "post-1",
        content:
          "Baru saja membeli beberapa OwnSphere Token. Sangat bersemangat untuk masa depan platform ini!",
        timestamp: Date.now() - 86400000, // 1 hari yang lalu
      },
      {
        id: "post-2",
        content:
          "Saran investasi dari platform ini sangat membantu. Sudah melihat pertumbuhan 15% dalam portofolio saya bulan ini.",
        timestamp: Date.now() - 43200000, // 12 jam yang lalu
      },
    ]);
  }, []);

  const createPost = async () => {
    if (!newPost.trim() || !userId) return;
    setLoading(true);
    try {
      const result = await ownSphere.createPost(userId, newPost);
      if (result) {
        setPosts([
          {
            id: `post-${Date.now()}`,
            content: newPost,
            timestamp: Date.now(),
          },
          ...posts,
        ]);
        setNewPost("");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format tanggal untuk tampilan yang lebih baik
  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    // Kurang dari 1 menit
    if (diff < 60000) {
      return "Baru saja";
    }
    // Kurang dari 1 jam
    else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} menit yang lalu`;
    }
    // Kurang dari 1 hari
    else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} jam yang lalu`;
    }
    // Lebih dari 1 hari
    else {
      return new Date(timestamp).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="page posts-container">
      <div className="create-post">
        <h2>
          <i className="fas fa-edit"></i> Buat Post Baru
        </h2>
        <div className="post-input-container">
          <textarea
            className="post-input"
            placeholder="Apa yang Anda pikirkan?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
        </div>
        <div className="post-actions">
          <div className="post-attachments">
            <button className="attachment-button" title="Tambahkan foto">
              <i className="fas fa-image"></i>
            </button>
            <button className="attachment-button" title="Tambahkan video">
              <i className="fas fa-video"></i>
            </button>
            <button className="attachment-button" title="Tambahkan emoji">
              <i className="fas fa-smile"></i>
            </button>
          </div>
          <button
            className="post-submit"
            onClick={createPost}
            disabled={loading || !newPost.trim()}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Memposting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> Post
              </>
            )}
          </button>
        </div>
      </div>

      <div className="posts-list">
        <h2>
          <i className="fas fa-stream"></i> Post Terbaru
        </h2>

        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="post-user-info">
                  <h3>{userName}</h3>
                  <span className="post-timestamp">
                    {formatDate(post.timestamp)}
                  </span>
                </div>
                <div className="post-options">
                  <button className="post-options-button">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
              <div className="post-content">
                <p>{post.content}</p>
              </div>
              <div className="post-footer">
                <div className="post-actions-buttons">
                  <button className="post-action">
                    <i className="far fa-heart"></i> Suka
                  </button>
                  <button className="post-action">
                    <i className="far fa-comment"></i> Komentar
                  </button>
                  <button className="post-action">
                    <i className="far fa-share-square"></i> Bagikan
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-posts">
            <i className="fas fa-comment-slash"></i>
            <h3>Belum Ada Post</h3>
            <p>Mulailah dengan membuat post pertama Anda!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
