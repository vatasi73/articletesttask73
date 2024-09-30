import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { AuthState } from "../slices/authSlice";
import { ReactNode } from "react";
interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state: { auth: AuthState }) => state.auth.isAuthenticated
  );
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return children;
}
