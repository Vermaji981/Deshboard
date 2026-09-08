import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user && String(user.role).toLowerCase() !== "admin") {
        return <Navigate to="/store" replace />;
    }

    return children;
}

export default ProtectedRoute;