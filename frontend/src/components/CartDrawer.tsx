import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, subtotal, removeItem, setQuantity } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 flex justify-end bg-ink/50" onClick={onClose}>
      <aside
        className="flex h-full w-full max-w-sm flex-col bg-paper p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4">
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink uppercase">
            Tu pedido
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-2xl leading-none text-ink-soft"
          >
            &times;
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="text-ink-soft">Todavía no agregaste cervezas.</p>
        ) : (
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
            {lines.map((line) => (
              <div key={line.beer.id} className="flex gap-3">
                <div className="flex-1">
                  <p className="font-medium text-ink">{line.beer.name}</p>
                  <p className="text-sm text-ink-soft">{formatPrice(line.beer.price)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={line.beer.stock}
                      value={line.quantity}
                      onChange={(e) => setQuantity(line.beer.id, Number(e.target.value))}
                      className="w-16 rounded border border-line px-2 py-1 text-sm text-ink"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(line.beer.id)}
                      className="text-sm text-red-700"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <span className="font-medium text-ink">
                  {formatPrice(Number(line.beer.price) * line.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-line pt-4">
          <div className="flex items-center justify-between font-display font-semibold text-ink">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link
            to="/checkout"
            onClick={onClose}
            aria-disabled={lines.length === 0}
            className={`mt-3 block rounded-full py-3 text-center font-display font-semibold tracking-wide uppercase ${
              lines.length === 0
                ? "pointer-events-none bg-line text-ink-soft"
                : "bg-gold text-ink hover:bg-gold-dark"
            }`}
          >
            Ir a coordinar entrega
          </Link>
        </div>
      </aside>
    </div>
  );
}
