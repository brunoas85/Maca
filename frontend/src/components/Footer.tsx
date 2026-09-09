export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ink text-cream">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div>
            <span className="font-display text-xl font-semibold tracking-wide uppercase">Macá</span>
            <p className="mt-1 max-w-xs text-sm text-cream/70">
              Cerveza artesanal sanmartinense. Sin local propio — entrega a domicilio.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <a
              href="https://wa.me/5492944319753"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold"
            >
              WhatsApp: +54 9 2944 319753
            </a>
            <a
              href="https://instagram.com/cerveza_maca"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold"
            >
              Instagram: @cerveza_maca
            </a>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <a href="/#nosotros" className="hover:text-gold">
              Quiénes somos
            </a>
            <a href="/#birra-del-mes" className="hover:text-gold">
              Birra del mes
            </a>
            <a href="/#eventos" className="hover:text-gold">
              Eventos
            </a>
          </nav>
        </div>

        <p className="mt-8 border-t border-cream/10 pt-6 text-center text-xs text-cream/50">
          © {year} Macá Cerveza Artesanal. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
