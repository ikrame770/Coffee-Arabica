import { Navigate } from "react-router-dom";
import { getAuth } from "./auth";

export default function RoleRoute({ roles, children }) {
  const auth = getAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (!roles.includes(auth.role)) return <Navigate to="/admin" replace />;
  return children;
}