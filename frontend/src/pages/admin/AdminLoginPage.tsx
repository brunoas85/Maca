import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { login } from "../../lib/adminApi";
import { getAdminToken, setAdminToken } from "../../lib/adminAuth";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (getAdminToken()) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { token } = await login(email, password);
      setAdminToken(token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-lg border border-line bg-paper p-8 shadow-xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <img src="/brand/macalogo1.png" alt="Macá" className="h-16 w-auto" />
          <h1 className="font-display text-xl font-semibold tracking-wide text-ink uppercase">
            Panel de administración
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-ink">
            Email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded border border-line bg-paper px-3 py-2 text-ink"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Contraseña
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded border border-line bg-paper px-3 py-2 text-ink"
            />
          </label>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-gold py-3 font-display font-semibold tracking-wide text-ink uppercase transition hover:bg-gold-dark disabled:opacity-60"
          >
            {submitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
