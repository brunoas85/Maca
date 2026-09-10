import { useEffect, useState, type FormEvent } from "react";
import type { BeerInput } from "../../lib/adminApi";
import type { Beer } from "../../types";

interface BeerFormModalProps {
  /** null = modo creación. Un Beer = modo edición, precarga sus datos. */
  beer: Beer | null;
  onClose: () => void;
  onSubmit: (data: BeerInput) => Promise<void>;
}

export function BeerFormModal({ beer, onClose, onSubmit }: BeerFormModalProps) {
  const [name, setName] = useState(beer?.name ?? "");
  const [style, setStyle] = useState(beer?.style ?? "");
  const [abv, setAbv] = useState(beer ? String(beer.abv) : "");
  const [ibu, setIbu] = useState(beer?.ibu != null ? String(beer.ibu) : "");
  const [description, setDescription] = useState(beer?.description ?? "");
  const [imageUrl, setImageUrl] = useState(beer?.imageUrl ?? "");
  const [price, setPrice] = useState(beer ? String(beer.price) : "");
  const [stock, setStock] = useState(beer ? String(beer.stock) : "0");
  const [active, setActive] = useState(beer?.active ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        name,
        style,
        abv: Number(abv),
        ibu: ibu ? Number(ibu) : undefined,
        description,
        imageUrl: imageUrl || undefined,
        price: Number(price),
        stock: Number(stock),
        active,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la cerveza");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/60 px-4 py-8">
      <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-lg bg-paper p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink uppercase">
            {beer ? "Editar cerveza" : "Nueva cerveza"}
          </h2>
          <button type="button" onClick={onClose} className="text-ink-soft hover:text-ink" aria-label="Cerrar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-ink">
            Nombre
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded border border-line bg-paper px-3 py-2 text-ink"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Estilo
            <input
              required
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="rounded border border-line bg-paper px-3 py-2 text-ink"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-ink">
              ABV (%)
              <input
                required
                type="number"
                step="0.1"
                min="0"
                value={abv}
                onChange={(e) => setAbv(e.target.value)}
                className="rounded border border-line bg-paper px-3 py-2 text-ink"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink">
              IBU (opcional)
              <input
                type="number"
                min="0"
                value={ibu}
                onChange={(e) => setIbu(e.target.value)}
                className="rounded border border-line bg-paper px-3 py-2 text-ink"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Descripción
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded border border-line bg-paper px-3 py-2 text-ink"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            URL de imagen (opcional)
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="rounded border border-line bg-paper px-3 py-2 text-ink"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-ink">
              Precio
              <input
                required
                type="number"
                step="1"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded border border-line bg-paper px-3 py-2 text-ink"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink">
              Stock
              <input
                required
                type="number"
                step="1"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="rounded border border-line bg-paper px-3 py-2 text-ink"
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Activa (visible en el catálogo)
          </label>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-ink/20 px-4 py-2 font-display text-sm font-medium tracking-wide text-ink uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-gold px-4 py-2 font-display text-sm font-semibold tracking-wide text-ink uppercase transition hover:bg-gold-dark disabled:opacity-60"
            >
              {submitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
