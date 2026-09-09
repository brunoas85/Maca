import { useEffect, useState } from "react";
import { BeerCard } from "../components/BeerCard";
import { getBeers } from "../lib/api";
import type { Beer } from "../types";

export function CatalogPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    getBeers()
      .then((data) => {
        setBeers(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Nuestras cervezas</h1>
        <p className="mt-1 text-neutral-500">Elaboración artesanal, entrega a domicilio.</p>
      </div>

      {status === "loading" && <p className="text-center text-neutral-500">Cargando catálogo...</p>}
      {status === "error" && (
        <p className="text-center text-red-600">
          No pudimos cargar el catálogo. Intentá de nuevo en un momento.
        </p>
      )}
      {status === "ready" && beers.length === 0 && (
        <p className="text-center text-neutral-500">Por ahora no hay cervezas publicadas.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {beers.map((beer) => (
          <BeerCard key={beer.id} beer={beer} />
        ))}
      </div>
    </main>
  );
}
