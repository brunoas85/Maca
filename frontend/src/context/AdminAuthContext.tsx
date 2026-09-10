import { createContext, useContext, type ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ApiError } from "../lib/adminApi";
import { clearAdminToken, getAdminToken } from "../lib/adminAuth";

interface AdminAuthValue {
  /** Token JWT del admin logueado. Solo existe cuando el Provider efectivamente renderiza a sus hijos. */
  token: string;
  logout: () => void;
  /**
   * Manejo uniforme de errores de llamadas admin: si es un 401 (token vencido/inválido)
   * limpia la sesión y redirige a login. Devuelve el mensaje para mostrar en la UI.
   */
  handleApiError: (err: unknown) => string;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const token = getAdminToken();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  function logout() {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  }

  function handleApiError(err: unknown): string {
    if (err instanceof ApiError && err.status === 401) {
      logout();
      return err.message;
    }
    return err instanceof Error ? err.message : "Ocurrió un error inesperado";
  }

  return (
    <AdminAuthContext.Provider value={{ token, logout, handleApiError }}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth debe usarse dentro de AdminAuthProvider");
  }
  return ctx;
}
