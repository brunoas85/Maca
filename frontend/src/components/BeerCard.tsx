import { Link } from "react-router-dom";
import { formatPrice } from "../lib/format";
import type { Beer } from "../types";

export function BeerCard({ beer }: { beer: Beer }) {
  const outOfStock = beer.stock <= 0;

  return (
    <Link
      to={`/cervezas/${beer.id}`}
      className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="aspect-square bg-neutral-100 dark:bg-neutral-800">
        {beer.imageUrl ? (
          <img src={beer.imageUrl} alt={beer.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">🍺</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
          {beer.style}
        </span>
        <h3 className="text-lg font-semibold">{beer.name}</h3>
        <p className="text-sm text-neutral-500">{beer.abv}% ABV</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold">{formatPrice(beer.price)}</span>
          {outOfStock ? (
            <span className="text-xs font-medium text-red-600">Sin stock</span>
          ) : (
            <span className="text-xs text-neutral-500">{beer.stock} disponibles</span>
          )}
        </div>
      </div>
    </Link>
  );
}
