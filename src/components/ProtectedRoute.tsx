
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  useEffect(() => {
    const user = localStorage.getItem("cafeUser");
    setIsAuthenticated(!!user);
    
    if (!user) {
      toast("Debes iniciar sesión para acceder a esta página");
      return;
    }
    
    // Verificar si el usuario es administrador
    const userData = JSON.parse(user);
    setIsAdmin(userData.isAdmin || false);
    
    if (adminOnly && !userData.isAdmin) {
      toast("No tienes permisos para acceder a esta página");
    }
  }, [adminOnly]);

  if (isAuthenticated === null) {
    // Still checking authentication
    return <div className="min-h-screen flex justify-center items-center">Verificando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
