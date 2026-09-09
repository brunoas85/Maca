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
        style={{ backgroundImage: "url(/brand/hero-maca.jpg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

        <div className="relative flex w-full justify-end">
          <div className="mx-4 w-full max-w-md sm:mr-10 sm:max-w-lg lg:mr-20">
            <span className="inline-block rounded-full border border-gold/60 bg-ink/30 px-4 py-1 font-display text-xs font-medium tracking-[0.2em] text-gold uppercase backdrop-blur-sm">
              Cerveza artesanal sanmartinense
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[0.95] font-semibold tracking-tight text-paper uppercase sm:text-6xl">
              Tan salvaje
              <br />
              como el sur
            </h1>
            <p className="mt-5 text-base text-paper/85">
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
        </div>

        <img
          src="/brand/macalogo1.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-4 left-4 hidden w-28 opacity-90 drop-shadow-lg sm:block md:w-32"
        />
      </section>

      <section id="catalogo" className="mx-auto max-w-5xl scroll-mt-[100px] px-4 py-16">
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

      <section id="nosotros" className="scroll-mt-[100px] bg-ink py-16 text-cream">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:grid-cols-2 sm:items-center">
          <div>
            <span className="inline-block rounded-full border border-gold/50 px-4 py-1 font-display text-xs font-medium tracking-[0.2em] text-gold uppercase">
              Quiénes somos
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight uppercase sm:text-4xl">
              Cerveza de acá, para acá
            </h2>
            <p className="mt-4 text-cream/80">
              Macá nació en San Martín de los Andes con una idea simple: cocinar buena cerveza
              artesanal y llevarla directo a tu casa. No tenemos local ni bar propio — todo lo que
              hacemos, desde la receta hasta la entrega, es para que la disfrutes donde quieras.
            </p>
            <p className="mt-4 text-cream/80">
              El nombre es un homenaje al macá tobiano, un ave única de la Patagonia. Rara,
              resistente y de acá — como nuestra cerveza.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img
              src="/brand/nosotros.jpg"
              alt="Sirviendo una cerveza artesanal"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
