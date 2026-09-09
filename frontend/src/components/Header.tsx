import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold">
          Macá
        </Link>
        <button
          type="button"
          onClick={onCartClick}
          className="relative rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium dark:border-neutral-700"
        >
          Carrito
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs text-white">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
