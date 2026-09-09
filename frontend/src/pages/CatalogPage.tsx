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
    <main>
      <section
        className="relative flex min-h-[72vh] items-center bg-cover bg-[center_30%] sm:min-h-[85vh]"
        style={{ backgroundImage: "url(/brand/hero-maca-tobiano.jpg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

        <div className="relative mx-auto w-full max-w-5xl px-4 py-16">
          <span className="inline-block rounded-full border border-gold/60 bg-ink/30 px-4 py-1 font-display text-xs font-medium tracking-[0.2em] text-gold uppercase backdrop-blur-sm">
            Cerveza artesanal sanmartinense
          </span>
          <h1 className="mt-5 max-w-xl font-display text-5xl leading-[0.95] font-semibold tracking-tight text-paper uppercase sm:text-6xl">
            Tan salvaje
            <br />
            como el sur
          </h1>
          <p className="mt-5 max-w-md text-base text-paper/85">
            Elaboración artesanal en San Martín de los Andes. Como el macá tobiano, un ave rara y
            única de la Patagonia — nuestra cerveza también es de acá y para acá. Entrega a
            domicilio.
          </p>
          <a
            href="#catalogo"
            className="mt-8 inline-block rounded-full bg-gold px-7 py-3 font-display text-sm font-semibold tracking-wide text-ink uppercase transition hover:bg-gold-dark"
          >
            Ver catálogo
          </a>
        </div>

        <img
          src="/brand/emblem.png"
          alt=""
          aria-hidden="true"
          className="absolute right-4 bottom-4 hidden w-40 opacity-90 drop-shadow-lg sm:block md:w-52"
        />
      </section>

      <section id="catalogo" className="mx-auto max-w-5xl px-4 py-16 scroll-mt-16">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-ink px-4 py-1 font-display text-xs font-medium tracking-[0.2em] text-cream uppercase">
            Macá artesanal
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink uppercase sm:text-4xl">
            Nuestras cervezas
          </h2>
        </div>

        {status === "loading" && (
          <p className="text-center text-ink-soft">Cargando catálogo...</p>
        )}
        {status === "error" && (
          <p className="text-center text-red-700">
            No pudimos cargar el catálogo. Intentá de nuevo en un momento.
          </p>
        )}
        {status === "ready" && beers.length === 0 && (
          <p className="text-center text-ink-soft">Por ahora no hay cervezas publicadas.</p>
        )}

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {beers.map((beer) => (
            <BeerCard key={beer.id} beer={beer} />
          ))}
        </div>
      </section>
    </main>
  );
}
