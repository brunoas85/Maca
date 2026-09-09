import { Link } from "react-router-dom";
import { formatPrice } from "../lib/format";
import type { Beer } from "../types";

export function BeerCard({ beer }: { beer: Beer }) {
  const outOfStock = beer.stock <= 0;

  return (
    <Link
      to={`/cervezas/${beer.id}`}
      className="group flex flex-col items-center rounded-2xl border border-line bg-paper p-4 text-center transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full border-2 border-gold/70 bg-cream">
        {beer.imageUrl ? (
          <img src={beer.imageUrl} alt={beer.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl">🍺</span>
        )}
      </div>

      <span className="mt-4 font-display text-xs font-medium tracking-[0.15em] text-gold-dark uppercase">
        {beer.style}
      </span>
      <h3 className="font-display text-lg font-semibold tracking-tight text-ink uppercase">
        {beer.name}
      </h3>
      <p className="text-xs text-ink-soft">{beer.abv}% ABV</p>

      <div className="mt-3 flex w-full items-center justify-between border-t border-line pt-3">
        <span className="font-display font-semibold text-ink">{formatPrice(beer.price)}</span>
        {outOfStock ? (
          <span className="text-xs font-medium text-red-700">Sin stock</span>
        ) : (
          <span className="text-xs text-ink-soft">{beer.stock} disp.</span>
        )}
      </div>
    </Link>
  );
}
