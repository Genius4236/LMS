import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useSelector((state) => state.auth);

  if (!user || !token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
