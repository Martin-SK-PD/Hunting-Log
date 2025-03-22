import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Protected_route({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const role = user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default Protected_route;
