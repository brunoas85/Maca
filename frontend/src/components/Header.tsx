import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-[175px] max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <img src="/brand/macaLogoNav.png" alt="Macá — Cerveza Artesanal Sanmartinense" className="h-[154px] w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/#nosotros"
            className="font-display text-sm font-medium tracking-wide text-ink uppercase hover:text-gold-dark"
          >
            Quiénes somos
          </a>
          <a
            href="/#catalogo"
            className="font-display text-sm font-medium tracking-wide text-ink uppercase hover:text-gold-dark"
          >
            Pedidos
          </a>
        </nav>

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
      </div>
    </header>
  );
}
