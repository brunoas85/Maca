import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getBeer } from "../lib/api";
import { formatPrice } from "../lib/format";
import type { Beer } from "../types";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [beer, setBeer] = useState<Beer | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    getBeer(id)
      .then((data) => {
        setBeer(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading") {
    return <p className="p-8 text-center text-ink-soft">Cargando...</p>;
  }

  if (status === "error" || !beer) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-700">No encontramos esa cerveza.</p>
        <Link to="/" className="mt-2 inline-block text-gold-dark underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const outOfStock = beer.stock <= 0;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="font-display text-sm tracking-wide text-ink-soft uppercase">
        &larr; Volver al catálogo
      </Link>

      <div className="mt-4 grid gap-8 sm:grid-cols-2">
        <div className="mx-auto flex aspect-square w-full max-w-xs items-center justify-center overflow-hidden rounded-full border-4 border-gold/70 bg-paper">
          {beer.imageUrl ? (
            <img src={beer.imageUrl} alt={beer.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-6xl">🍺</span>
          )}
        </div>

        <div>
          <span className="font-display text-xs font-medium tracking-[0.15em] text-gold-dark uppercase">
            {beer.style}
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink uppercase">
            {beer.name}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {beer.abv}% ABV{beer.ibu != null ? ` · ${beer.ibu} IBU` : ""}
          </p>
          <p className="mt-4 text-ink/80">{beer.description}</p>
          <p className="mt-4 font-display text-xl font-semibold text-ink">{formatPrice(beer.price)}</p>

          {outOfStock ? (
            <p className="mt-4 font-medium text-red-700">Sin stock por el momento</p>
          ) : (
            <div className="mt-4 flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={beer.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(Number(e.target.value), beer.stock)))}
                className="w-20 rounded border border-line bg-paper px-2 py-2 text-ink"
              />
              <button
                type="button"
                onClick={() => {
                  addItem(beer, quantity);
                  setAdded(true);
                }}
                className="rounded-full bg-gold px-6 py-2 font-display font-semibold tracking-wide text-ink uppercase transition hover:bg-gold-dark"
              >
                Agregar al pedido
              </button>
            </div>
          )}

          {added && (
            <p className="mt-3 text-sm text-ink-soft">
              Agregado.{" "}
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="font-medium text-gold-dark underline"
              >
                Ir a coordinar entrega
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
