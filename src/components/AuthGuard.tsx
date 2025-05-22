import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const refAuth = useAuth();
  const location = useLocation();

  // ❗ อย่าให้มัน rerender ซ้ำโดยที่ state ไม่เปลี่ยนจริง ๆ
console.log(refAuth?.isAuthenticate())
  if (!refAuth?.isAuthenticate()) {
      console.log('trigger')
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;