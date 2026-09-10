import { NavLink, Outlet } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "../../context/AdminAuthContext";

function AdminHeader() {
  const { logout } = useAdminAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 font-display text-sm font-medium tracking-wide uppercase transition ${
      isActive ? "bg-gold text-ink" : "text-cream/80 hover:text-cream"
    }`;

  return (
    <header className="border-b border-cream/10 bg-ink">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <img src="/brand/macalogo1.png" alt="Macá" className="h-9 w-auto" />
          <span className="font-display text-xs font-semibold tracking-[0.2em] text-cream/60 uppercase">
            Admin
          </span>
        </div>

        <nav className="flex items-center gap-2">
          <NavLink to="/admin" end className={linkClass}>
            Pedidos
          </NavLink>
          <NavLink to="/admin/cervezas" className={linkClass}>
            Cervezas
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-cream/30 px-4 py-2 font-display text-sm font-medium tracking-wide text-cream/80 uppercase hover:border-cream hover:text-cream"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export function AdminLayout() {
  return (
    <AdminAuthProvider>
      <div className="flex min-h-svh flex-col bg-cream">
        <AdminHeader />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </AdminAuthProvider>
  );
}
