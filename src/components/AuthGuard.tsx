import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log(isAuthenticated)
  if (loading) {
    // หรือจะใส่ spinner ก็ได้
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;