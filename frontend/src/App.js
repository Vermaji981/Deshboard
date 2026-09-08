import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Pages
import Login from "./pages/login";
import Deshboard from "./pages/deshboard";
import Products from "./pages/product";
import AddProduct from "./pages/Addproduct";
import Users from "./pages/Users";
import Order from "./pages/Order";
import PublicStore from "./pages/PublicStore";
import Notfound from "./pages/Notfound";

// Components & Layout
import Adminlayout from "./Layout/Adminlayout";
import ProtectedRoute from "./component/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/store" element={<PublicStore />} />

        {/* Protected Admin Panel Routes with Layout Shell */}
        <Route
          element={
            <ProtectedRoute adminOnly={true}>
              <Adminlayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Deshboard />} />
          <Route path="/deshboard" element={<Deshboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Order />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
