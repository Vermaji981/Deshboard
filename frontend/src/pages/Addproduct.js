import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Electronics",
    image: "",
    description: "",
    stock: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sampleProducts = [
    {
      name: "Wireless Noise-Canceling Headphones",
      price: 199.99,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      description: "Premium over-ear wireless headphones with active noise cancellation and 30-hour battery life.",
      stock: 25,
    },
    {
      name: "Smart Watch Ultra Series 9",
      price: 299.00,
      category: "Gadgets",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      description: "Fitness tracker smart watch with heart rate monitor, GPS, and AMOLED display.",
      stock: 15,
    },
    {
      name: "Ergonomic Mechanical Keyboard",
      price: 129.50,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
      description: "RGB backlit mechanical gaming keyboard with tactile switches and custom macro support.",
      stock: 40,
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fillSample = (sample) => {
    setFormData(sample);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        catogries: formData.category,
        image: formData.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        description: formData.description,
        stock: Number(formData.stock),
      };

      await api.post("/products", payload);
      setSuccess("Product added successfully! It is now live on the frontend store.");
      
      setTimeout(() => {
        navigate("/products");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add product. Make sure admin token is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Product</h1>
          <p className="page-subtitle">Fill in the product details below. Once saved, it will be visible on the public frontend store.</p>
        </div>
        <Link to="/products" className="btn btn-secondary">
          ← Back to Products List
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="add-product-grid">
        {/* Main Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label>Product Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Wireless Bluetooth Speaker"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price ($) <span className="required">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  required
                  placeholder="e.g. 49.99"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity <span className="required">*</span></label>
                <input
                  type="number"
                  name="stock"
                  required
                  placeholder="e.g. 20"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Electronics">Electronics</option>
                <option value="Gadgets">Gadgets</option>
                <option value="Fashion">Fashion</option>
                <option value="Accessories">Accessories</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                placeholder="https://example.com/image.jpg (Optional)"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Product Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Enter detailed description of the product..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? "Saving to Database..." : "🚀 Save Product & Publish"}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Fill & Live Preview Card */}
        <div className="side-panel">
          <div className="card">
            <h3>⚡ Quick Demo Samples</h3>
            <p className="card-subtitle">Click any sample below to autofill form</p>
            <div className="sample-buttons">
              {sampleProducts.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="sample-btn"
                  onClick={() => fillSample(sample)}
                >
                  <span className="sample-title">{sample.name}</span>
                  <span className="sample-price">${sample.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="card preview-card">
            <h3>👁️ Live Frontend Card Preview</h3>
            <p className="card-subtitle">This is how customers will see it on the shop</p>
            <div className="preview-product-card">
              <img
                src={formData.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
                alt="Preview"
                className="preview-img"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"; }}
              />
              <div className="preview-body">
                <span className="badge badge-neutral">{formData.category || "Category"}</span>
                <h4 className="preview-title">{formData.name || "Product Name"}</h4>
                <p className="preview-desc">
                  {formData.description || "Product description preview will appear here..."}
                </p>
                <div className="flex-between">
                  <span className="price-tag">${formData.price || "0.00"}</span>
                  <span className="stock-info">{formData.stock || 0} in stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
