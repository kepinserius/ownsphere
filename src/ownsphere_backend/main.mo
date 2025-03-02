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
    posts: [Post];
    tokens: Nat; // Menambahkan saldo token untuk tokenisasi aset
  };
  type Post = {
    content: Text;
    timestamp: Time.Time;
  };
  
  // Map untuk menyimpan data pengguna
  let users = Map.HashMap<Text, User>(0, Text.equal, Text.hash);

  // Inisialisasi data pasar untuk RWA (simulasi sederhana tanpa HTTPS outcalls)
  stable var marketPrice: Nat = 100; // Harga awal token aset (misalnya, properti atau emas), dalam satuan sederhana

  // Fungsi untuk mendaftarkan pengguna
  public func registerUser(id: Text, name: Text) : async Bool {
    let newUser: User = { id; name; posts = []; tokens = 0 };
    users.put(id, newUser);
    return true;
  };

  // Fungsi untuk membuat postingan
  public func createPost(userId: Text, content: Text) : async Bool {
    switch (users.get(userId)) {
      case (null) { return false };
      case (?user) {
        let newPost: Post = { content; timestamp = Time.now() };
        let updatedPosts = Array.append(user.posts, [newPost]);
        let updatedUser: User = { id = user.id; name = user.name; posts = updatedPosts; tokens = user.tokens };
        users.put(userId, updatedUser);
        return true;
      };
    };
  };

  // Fungsi untuk mendapatkan data pengguna
  public query func getUser(userId: Text) : async ?User {
    users.get(userId)
  };

  // Fungsi untuk membeli token aset (RWA DeFi) dengan memeriksa biaya
  public func buyTokens(userId: Text, amount: Nat) : async Bool {
    switch (users.get(userId)) {
      case (null) { return false };
      case (?user) {
        // Hitung biaya berdasarkan harga pasar
        // Pastikan tipe data sesuai dan tidak ada overflow
        let cost: Nat = amount * marketPrice; 
        // Tambahkan validasi jika perlu
        if (cost < amount or cost < marketPrice) {
            return false; // Handle overflow
        };
        // Di sini, kita asumsikan pengguna sudah memiliki cukup "cycles" atau mata uang di luar untuk membeli
        let updatedUser: User = { id = user.id; name = user.name; posts = user.posts; tokens = user.tokens + amount };
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