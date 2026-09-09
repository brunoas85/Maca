import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-[100px] max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src="/brand/macalogo1.png" alt="" className="h-[84px] w-auto" />
          <span className="font-display text-2xl font-semibold tracking-wide text-ink uppercase sm:text-3xl">
            Macá
          </span>
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
