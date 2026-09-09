import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5">
        <Link to="/" className="flex items-center">
          <img src="/brand/wordmark.png" alt="Macá" className="h-9 sm:h-10" />
        </Link>
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
