import { useEffect, useState } from "react";
import { BeerFormModal } from "../../components/admin/BeerFormModal";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { createBeer, deactivateBeer, getAllBeers, updateBeer, type BeerInput } from "../../lib/adminApi";
import type { Beer } from "../../types";

interface RowDraft {
  price: string;
  stock: string;
}

function draftFromBeer(beer: Beer): RowDraft {
  return { price: String(beer.price), stock: String(beer.stock) };
}

export function AdminBeersPage() {
  const { token, handleApiError } = useAdminAuth();
  const [beers, setBeers] = useState<Beer[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalBeer, setModalBeer] = useState<Beer | "new" | null>(null);
  const [rowDrafts, setRowDrafts] = useState<Record<string, RowDraft>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const data = await getAllBeers(token);
      setBeers(data);
      setRowDrafts(Object.fromEntries(data.map((b) => [b.id, draftFromBeer(b)])));
    } catch (err) {
      setError(handleApiError(err));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isRowDirty(beer: Beer) {
    const draft = rowDrafts[beer.id];
    if (!draft) return false;
    return draft.price !== String(beer.price) || draft.stock !== String(beer.stock);
  }

  async function handleSaveRow(beer: Beer) {
    const draft = rowDrafts[beer.id];
    if (!draft) return;
    setSavingId(beer.id);
    setError(null);
    try {
      const updated = await updateBeer(token, beer.id, {
        price: Number(draft.price),
        stock: Number(draft.stock),
      });
      setBeers((current) => current?.map((b) => (b.id === beer.id ? updated : b)) ?? current);
      setRowDrafts((current) => ({ ...current, [beer.id]: draftFromBeer(updated) }));
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSavingId(null);
    }
  }

  async function handleToggleActive(beer: Beer) {
    setSavingId(beer.id);
    setError(null);
    try {
      if (beer.active) {
        await deactivateBeer(token, beer.id);
        setBeers((current) => current?.map((b) => (b.id === beer.id ? { ...b, active: false } : b)) ?? current);
      } else {
        const updated = await updateBeer(token, beer.id, { active: true });
        setBeers((current) => current?.map((b) => (b.id === beer.id ? updated : b)) ?? current);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSavingId(null);
    }
  }

  async function handleModalSubmit(data: BeerInput) {
    if (modalBeer === "new") {
      const created = await createBeer(token, data);
      setBeers((current) => (current ? [...current, created] : [created]));
      setRowDrafts((current) => ({ ...current, [created.id]: draftFromBeer(created) }));
    } else if (modalBeer) {
      const updated = await updateBeer(token, modalBeer.id, data);
      setBeers((current) => current?.map((b) => (b.id === updated.id ? updated : b)) ?? current);
      setRowDrafts((current) => ({ ...current, [updated.id]: draftFromBeer(updated) }));
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink uppercase">Cervezas</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="rounded-full border border-ink/20 px-4 py-2 font-display text-sm font-medium tracking-wide text-ink uppercase"
          >
            Actualizar
          </button>
          <button
            type="button"
            onClick={() => setModalBeer("new")}
            className="rounded-full bg-gold px-4 py-2 font-display text-sm font-semibold tracking-wide text-ink uppercase transition hover:bg-gold-dark"
          >
            Nueva cerveza
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          No se pudo cargar: {error}
        </p>
      )}

      {beers === null && !error && <p className="mt-6 text-ink-soft">Cargando cervezas...</p>}

      {beers !== null && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line bg-cream text-xs tracking-wide text-ink-soft uppercase">
              <tr>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Estilo</th>
                <th className="px-3 py-2">Precio</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Estado</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {beers.map((beer) => {
                const draft = rowDrafts[beer.id] ?? draftFromBeer(beer);
                const dirty = isRowDirty(beer);
                const isBusy = savingId === beer.id;
                return (
                  <tr key={beer.id} className={`border-b border-line last:border-0 ${!beer.active ? "opacity-60" : ""}`}>
                    <td className="px-3 py-2 font-medium text-ink">{beer.name}</td>
                    <td className="px-3 py-2 text-ink-soft">{beer.style}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        value={draft.price}
                        onChange={(e) =>
                          setRowDrafts((c) => ({ ...c, [beer.id]: { ...draft, price: e.target.value } }))
                        }
                        className="w-24 rounded border border-line bg-paper px-2 py-1 text-ink"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        value={draft.stock}
                        onChange={(e) =>
                          setRowDrafts((c) => ({ ...c, [beer.id]: { ...draft, stock: e.target.value } }))
                        }
                        className="w-20 rounded border border-line bg-paper px-2 py-1 text-ink"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${
                          !beer.active
                            ? "bg-red-100 text-red-900"
                            : beer.stock > 0
                              ? "bg-green-100 text-green-900"
                              : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {!beer.active ? "Dada de baja" : beer.stock > 0 ? "Activa" : "Sin stock"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={!dirty || isBusy}
                          onClick={() => handleSaveRow(beer)}
                          className="rounded-full bg-gold px-3 py-1 font-display text-xs font-semibold tracking-wide text-ink uppercase transition hover:bg-gold-dark disabled:opacity-40"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalBeer(beer)}
                          className="rounded-full border border-ink/20 px-3 py-1 font-display text-xs font-medium tracking-wide text-ink uppercase"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleToggleActive(beer)}
                          className="rounded-full border border-ink/20 px-3 py-1 font-display text-xs font-medium tracking-wide text-ink uppercase disabled:opacity-40"
                        >
                          {beer.active ? "Dar de baja" : "Reactivar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalBeer !== null && (
        <BeerFormModal
          beer={modalBeer === "new" ? null : modalBeer}
          onClose={() => setModalBeer(null)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
