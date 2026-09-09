import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, subtotal, removeItem, setQuantity } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 flex justify-end bg-black/40" onClick={onClose}>
      <aside
        className="flex h-full w-full max-w-sm flex-col bg-white p-4 dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-lg font-semibold">Tu pedido</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-2xl leading-none">
            &times;
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="text-neutral-500">Todavía no agregaste cervezas.</p>
        ) : (
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
            {lines.map((line) => (
              <div key={line.beer.id} className="flex gap-3">
                <div className="flex-1">
                  <p className="font-medium">{line.beer.name}</p>
                  <p className="text-sm text-neutral-500">{formatPrice(line.beer.price)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={line.beer.stock}
                      value={line.quantity}
                      onChange={(e) => setQuantity(line.beer.id, Number(e.target.value))}
                      className="w-16 rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(line.beer.id)}
                      className="text-sm text-red-600"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <span className="font-medium">
                  {formatPrice(Number(line.beer.price) * line.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <div className="flex items-center justify-between font-semibold">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link
            to="/checkout"
            onClick={onClose}
            aria-disabled={lines.length === 0}
            className={`mt-3 block rounded-lg py-3 text-center font-medium text-white ${
              lines.length === 0 ? "pointer-events-none bg-neutral-300" : "bg-amber-700"
            }`}
          >
            Ir a coordinar entrega
          </Link>
        </div>
      </aside>
    </div>
  );
}
