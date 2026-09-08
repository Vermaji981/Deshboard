import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Statcard from "../component/Statcard";
import Loader from "../component/Loader";

function Deshboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    totalValue: 0,
    recentProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/dashboard");
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading dashboard metrics..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Real-time stats and control center for your website</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={fetchDashboardStats}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            Refresh Data
          </button>
          <Link to="/add-product" className="btn btn-primary">
            + Add Product
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <Statcard
          title="Total Products"
          value={stats.products}
          color="indigo"
          trend="+12% this month"
          subtext="Items active on frontend store"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          }
        />

        <Statcard
          title="Registered Users"
          value={stats.users}
          color="emerald"
          trend="Active accounts"
          subtext="Admins and regular users"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          }
        />

        <Statcard
          title="Total Inventory Value"
          value={`$${(stats.totalValue || 0).toLocaleString()}`}
          color="amber"
          trend="Calculated live"
          subtext="Price × stock quantity"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          }
        />

        <Statcard
          title="Total Orders"
          value={stats.orders || 0}
          color="rose"
          trend="+5 new today"
          subtext="Customer orders received"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          }
        />
      </div>

      <div className="dashboard-grid-2col">
        <div className="card">
          <div className="card-header flex-between">
            <div>
              <h3>Recent Products</h3>
              <p className="card-subtitle">Products added by Admin recently</p>
            </div>
            <Link to="/products" className="link-btn">View All →</Link>
          </div>
          
          <div className="table-responsive">
            {stats.recentProducts && stats.recentProducts.length > 0 ? (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentProducts.map((p) => (
                    <tr key={p._id}>
                      <td className="font-semibold flex-align">
                        <img 
                          src={p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"} 
                          alt={p.name} 
                          className="table-thumb"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"; }}
                        />
                        <span>{p.name}</span>
                      </td>
                      <td><span className="badge badge-neutral">{p.catogries || p.category || "General"}</span></td>
                      <td className="price-tag">${p.price}</td>
                      <td><span className={p.stock > 0 ? "badge badge-success" : "badge badge-danger"}>{p.stock || 0} in stock</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No products added yet.</p>
                <Link to="/add-product" className="btn btn-sm btn-primary">Add First Product</Link>
              </div>
            )}
          </div>
        </div>

        <div className="card flex-column">
          <div className="card-header">
            <h3>Quick Actions</h3>
            <p className="card-subtitle">Shortcuts to manage your store</p>
          </div>

          <div className="quick-actions-list">
            <Link to="/add-product" className="quick-action-item">
              <div className="qa-icon icon-indigo">➕</div>
              <div>
                <h4>Add New Product</h4>
                <p>Add item details to display on frontend</p>
              </div>
            </Link>

            <Link to="/products" className="quick-action-item">
              <div className="qa-icon icon-emerald">📦</div>
              <div>
                <h4>Manage Products</h4>
                <p>Edit or delete live products</p>
              </div>
            </Link>

            <Link to="/users" className="quick-action-item">
              <div className="qa-icon icon-amber">👥</div>
              <div>
                <h4>Manage Users</h4>
                <p>View registered accounts and permissions</p>
              </div>
            </Link>

            <Link to="/store" target="_blank" className="quick-action-item highlight-qa">
              <div className="qa-icon icon-rose">🌐</div>
              <div>
                <h4>Open Frontend Store</h4>
                <p>See live customer view with your added items</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deshboard;