import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../component/Loader";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Unable to fetch products", error);
      showMessage("Failed to load products from server", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  };

  const deleteProduct = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name || 'this product'}"?`)) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      setProducts((currentProducts) =>
        currentProducts.filter((item) => item._id !== productId)
      );
      showMessage("Product deleted successfully!");
    } catch (error) {
      console.error("Unable to delete product", error);
      showMessage(error.response?.data?.message || "Failed to delete product", "error");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/products/${editingProduct._id}`, editingProduct);
      setProducts(products.map(p => p._id === editingProduct._id ? response.data : p));
      setEditingProduct(null);
      showMessage("Product updated successfully!");
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to update product", "error");
    }
  };

  // Get list of unique categories
  const categories = ["All", ...new Set(products.map(p => p.catogries || p.category || "General").filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const catName = p.catogries || p.category || "General";
    const matchesCat = selectedCategory === "All" || catName === selectedCategory;
    return matchesSearch && matchesCat;
  });

  if (loading) return <Loader text="Fetching live product inventory..." />;

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Products</h1>
          <p className="page-subtitle">View, edit, and delete products that appear on your frontend store</p>
        </div>
        <div className="header-actions">
          <Link to="/store" target="_blank" className="btn btn-secondary">
            🌐 View Frontend Store
          </Link>
          <Link to="/add-product" className="btn btn-primary">
            + Add New Product
          </Link>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filter-bar card">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search product name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <label>Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="table-responsive">
          {filteredProducts.length > 0 ? (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Description</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="product-table-info">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120"}
                          alt={item.name}
                          className="table-thumb"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120"; }}
                        />
                        <div>
                          <strong className="product-name">{item.name}</strong>
                          <span className="product-id">ID: {item._id.substring(item._id.length - 6)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{item.catogries || item.category || "General"}</span>
                    </td>
                    <td>
                      <span className="price-tag">${item.price}</span>
                    </td>
                    <td>
                      <span className={item.stock > 0 ? "badge badge-success" : "badge badge-danger"}>
                        {item.stock || 0} left
                      </span>
                    </td>
                    <td className="desc-cell">
                      {item.description ? (item.description.length > 50 ? item.description.substring(0, 50) + "..." : item.description) : "—"}
                    </td>
                    <td className="text-right action-buttons">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setEditingProduct({ ...item, category: item.catogries || item.category })}
                        title="Edit product"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteProduct(item._id, item.name)}
                        title="Delete product"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>Try clearing filters or add your first product to display on the frontend.</p>
              <Link to="/add-product" className="btn btn-primary">+ Add Product</Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button className="close-btn" onClick={() => setEditingProduct(null)}>✕</button>
            </div>
            <form onSubmit={handleUpdateProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  required
                  value={editingProduct.catogries || editingProduct.category || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, catogries: e.target.value, category: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={editingProduct.image || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;