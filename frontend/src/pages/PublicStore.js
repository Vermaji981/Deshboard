import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../component/Loader";

function PublicStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [addedNotice, setAddedNotice] = useState("");

  useEffect(() => {
    fetchStoreProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStoreProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products for storefront", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (productName) => {
    setCartCount(prev => prev + 1);
    setAddedNotice(`Added "${productName}" to cart!`);
    setTimeout(() => setAddedNotice(""), 3000);
  };

  const categories = ["All", ...new Set(products.map(p => p.catogries || p.category || "General").filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const catName = p.catogries || p.category || "General";
    const matchesCategory = selectedCategory === "All" || catName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="storefront-app">
      {/* Public Store Top Navigation Bar */}
      <header className="store-navbar">
        <div className="store-container flex-between">
          <div className="store-logo">
            <span className="logo-badge">STORE</span>
            <h2>Modern Shop</h2>
          </div>

          <div className="store-search">
            <input
              type="text"
              placeholder="Search items added by Admin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="store-actions">
            <div className="cart-badge-wrapper">
              <span className="cart-icon">🛒 Cart ({cartCount})</span>
            </div>

            <Link to="/dashboard" className="admin-portal-btn">
              ⚡ Admin Panel
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="store-hero">
        <div className="store-container">
          <div className="hero-content">
            <span className="hero-tag">LIVE FRONTEND VIEW</span>
            <h1>Real-Time Admin Product Display</h1>
            <p>Every product added, edited, or updated in the Admin Panel appears live on this page automatically!</p>
          </div>
        </div>
      </section>

      {addedNotice && (
        <div className="toast-notification">
          {addedNotice}
        </div>
      )}

      {/* Main Content */}
      <main className="store-container store-main">
        {/* Category Pills Filter */}
        <div className="category-pills-bar">
          <span className="pills-label">Filter Category:</span>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`pill-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader text="Connecting to backend database..." />
        ) : filteredProducts.length > 0 ? (
          <div className="public-products-grid">
            {filteredProducts.map((p) => (
              <div key={p._id} className="store-product-card">
                <div className="card-image-wrap">
                  <img
                    src={p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
                    alt={p.name}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"; }}
                  />
                  <span className="category-tag">{p.catogries || p.category || "General"}</span>
                </div>

                <div className="card-content">
                  <h3 className="product-title">{p.name}</h3>
                  <p className="product-description">
                    {p.description || "No detailed description provided."}
                  </p>
                  
                  <div className="card-footer-info">
                    <div className="price-container">
                      <span className="currency">$</span>
                      <span className="amount">{p.price}</span>
                    </div>

                    <span className={p.stock > 0 ? "stock-tag in-stock" : "stock-tag out-stock"}>
                      {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                    </span>
                  </div>

                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(p.name)}
                    disabled={p.stock <= 0}
                  >
                    {p.stock > 0 ? "Add to Cart 🛒" : "Sold Out"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-store-state card">
            <h2>No products available right now</h2>
            <p>Go to the Admin Panel to add new products and see them show up here instantly!</p>
            <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              Go to Admin Panel →
            </Link>
          </div>
        )}
      </main>

      <footer className="store-footer">
        <div className="store-container">
          <p>© 2026 Admin Dashboard & Frontend Store Integration</p>
        </div>
      </footer>
    </div>
  );
}

export default PublicStore;
