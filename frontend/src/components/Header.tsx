import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { href: "/#nosotros", label: "Quiénes somos" },
  { href: "/#catalogo", label: "Pedidos" },
  { href: "/#birra-del-mes", label: "Birra del mes" },
  { href: "/#eventos", label: "Eventos" },
];

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-[175px] max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <img src="/brand/macaLogoNav.png" alt="Macá — Cerveza Artesanal Sanmartinense" className="h-[154px] w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-sm font-medium tracking-wide text-ink uppercase hover:text-gold-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCartClick}
            className="relative rounded-full border border-ink/20 px-4 py-2 font-display text-sm font-medium tracking-wide text-ink uppercase"
          >
            Carrito
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-semibold text-paper">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-ink/20 md:hidden"
          >
            <span
              className={`h-0.5 w-5 bg-ink transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`h-0.5 w-5 bg-ink transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`h-0.5 w-5 bg-ink transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col border-t border-line bg-cream px-4 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 font-display text-sm font-medium tracking-wide text-ink uppercase hover:text-gold-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
