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
    return <p className="p-8 text-center text-neutral-500">Cargando...</p>;
  }

  if (status === "error" || !beer) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">No encontramos esa cerveza.</p>
        <Link to="/" className="mt-2 inline-block text-amber-700 underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const outOfStock = beer.stock <= 0;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="text-sm text-neutral-500">
        &larr; Volver al catálogo
      </Link>

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-800">
          {beer.imageUrl ? (
            <img src={beer.imageUrl} alt={beer.name} className="h-full w-full rounded-xl object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl">🍺</div>
          )}
        </div>

        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
            {beer.style}
          </span>
          <h1 className="text-2xl font-bold">{beer.name}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {beer.abv}% ABV{beer.ibu != null ? ` · ${beer.ibu} IBU` : ""}
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300">{beer.description}</p>
          <p className="mt-4 text-xl font-semibold">{formatPrice(beer.price)}</p>

          {outOfStock ? (
            <p className="mt-4 font-medium text-red-600">Sin stock por el momento</p>
          ) : (
            <div className="mt-4 flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={beer.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(Number(e.target.value), beer.stock)))}
                className="w-20 rounded border border-neutral-300 px-2 py-2 dark:border-neutral-700 dark:bg-neutral-900"
              />
              <button
                type="button"
                onClick={() => {
                  addItem(beer, quantity);
                  setAdded(true);
                }}
                className="rounded-lg bg-amber-700 px-6 py-2 font-medium text-white"
              >
                Agregar al pedido
              </button>
            </div>
          )}

          {added && (
            <p className="mt-3 text-sm text-green-700">
              Agregado.{" "}
              <button type="button" onClick={() => navigate("/checkout")} className="underline">
                Ir a coordinar entrega
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
