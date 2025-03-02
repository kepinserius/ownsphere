import Text "mo:base/Text";
import Map "mo:base/HashMap";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";

actor OwnSphere {
  // Definisi tipe data
  type User = {
    id: Text;
    name: Text;
    email: Text;
    passwordHash: Text;
    posts: [Post];
    tokens: Nat; // Menambahkan saldo token untuk tokenisasi aset
    createdAt: Time.Time;
    lastLogin: Time.Time;
  };
  type Post = {
    content: Text;
    timestamp: Time.Time;
  };
  
  // Map untuk menyimpan data pengguna
  let users = Map.HashMap<Text, User>(0, Text.equal, Text.hash);
  let userEmails = Map.HashMap<Text, Text>(0, Text.equal, Text.hash);

  // Inisialisasi data pasar untuk RWA (simulasi sederhana tanpa HTTPS outcalls)
  stable var marketPrice: Nat = 100; // Harga awal token aset (misalnya, properti atau emas), dalam satuan sederhana

  // Fungsi untuk mendaftarkan pengguna
  public func registerUser(id: Text, name: Text, email: Text, passwordHash: Text) : async Bool {
    // Cek apakah email sudah terdaftar
    switch (userEmails.get(email)) {
      case (?_) { return false };
      case (null) {
        let now = Time.now();
        let newUser: User = {
          id;
          name;
          email;
          passwordHash;
          posts = [];
          tokens = 0;
          createdAt = now;
          lastLogin = now;
        };
        users.put(id, newUser);
        userEmails.put(email, id);
        return true;
      };
    };
  };

  // Fungsi untuk login pengguna
  public func loginUser(email: Text, passwordHash: Text) : async ?User {
    switch (userEmails.get(email)) {
      case (?userId) {
        switch (users.get(userId)) {
          case (?user) {
            if (user.passwordHash == passwordHash) {
              return ?user;
            } else {
              return null;
            };
          };
          case (null) { return null };
        };
      };
      case (null) { return null };
    };
  };

  // Fungsi untuk membuat postingan
  public func createPost(userId: Text, content: Text) : async Bool {
    switch (users.get(userId)) {
      case (null) { return false };
      case (?user) {
        let newPost: Post = { content; timestamp = Time.now() };
        let updatedPosts = Array.append(user.posts, [newPost]);
        let updatedUser: User = {
          id = user.id;
          name = user.name;
          email = user.email;
          passwordHash = user.passwordHash;
          posts = updatedPosts;
          tokens = user.tokens;
          createdAt = user.createdAt;
          lastLogin = user.lastLogin;
        };
        users.put(userId, updatedUser);
        return true;
      };
    };
  };

  // Fungsi untuk mendapatkan data pengguna
  public query func getUser(userId: Text) : async ?User {
    users.get(userId)
  };

  // Fungsi untuk mendapatkan data pengguna berdasarkan email
  public query func getUserByEmail(email: Text) : async ?User {
    switch (userEmails.get(email)) {
      case (?userId) { users.get(userId) };
      case (null) { null };
    };
  };

  // Fungsi untuk membeli token aset (RWA DeFi) dengan memeriksa biaya
  public func buyTokens(userId: Text, amount: Nat) : async Bool {
    switch (users.get(userId)) {
      case (null) { return false };
      case (?user) {
        let cost: Nat = amount * marketPrice;
        if (cost < amount or cost < marketPrice) {
            return false;
        };
        let updatedUser: User = {
          id = user.id;
          name = user.name;
          email = user.email;
          passwordHash = user.passwordHash;
          posts = user.posts;
          tokens = user.tokens + amount;
          createdAt = user.createdAt;
          lastLogin = user.lastLogin;
        };
        users.put(userId, updatedUser);
        return true;
      };
    };
  };

  // Fungsi untuk mendapatkan saldo token pengguna
  public query func getTokenBalance(userId: Text) : async Nat {
    switch (users.get(userId)) {
      case (null) { return 0 };
      case (?user) { user.tokens };
    };
  };

  // Fungsi AI yang ditingkatkan: rekomendasi investasi berdasarkan aktivitas dan token
  public query func getInvestmentSuggestion(userId: Text) : async Text {
    switch (users.get(userId)) {
      case (null) { "User not found" };
      case (?user) {
        let postCount = Array.size(user.posts);
        let tokenCount = user.tokens;

        if (postCount > 10 and tokenCount > 50) {
          "Invest heavily in tokenized real estate or commodities!"
        } else if (postCount > 5 and tokenCount > 20) {
          "Consider diversified investments in tokenized assets."
        } else if (tokenCount > 0) {
          "Start with small tokenized assets and build your portfolio."
        } else {
          "Create more posts and buy some tokens to get personalized suggestions!"
        };
      };
    };
  };
};