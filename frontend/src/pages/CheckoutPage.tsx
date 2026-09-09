import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../lib/api";
import { formatPrice } from "../lib/format";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";

function buildWhatsAppMessage(
  lines: { beer: { name: string; price: string }; quantity: number }[],
  subtotal: number,
  customerName: string,
  address: string,
  zone: string,
  preferredTime: string,
) {
  const itemsText = lines
    .map((line) => `- ${line.quantity}x ${line.beer.name} (${formatPrice(Number(line.beer.price) * line.quantity)})`)
    .join("\n");

  return [
    `Hola! Quiero hacer un pedido a Macá:`,
    itemsText,
    `Subtotal: ${formatPrice(subtotal)}`,
    ``,
    `Nombre: ${customerName}`,
    `Dirección: ${address}${zone ? ` (${zone})` : ""}`,
    preferredTime ? `Horario preferido: ${preferredTime}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}

export function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <p className="text-ink-soft">Tu carrito está vacío.</p>
        <Link to="/" className="mt-2 inline-block text-gold-dark underline">
          Ver catálogo
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createOrder({
        customerName,
        address,
        zone: zone || undefined,
        preferredTime: preferredTime || undefined,
        items: lines.map((line) => ({ beerId: line.beer.id, quantity: line.quantity })),
      });

      const message = buildWhatsAppMessage(lines, subtotal, customerName, address, zone, preferredTime);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      clear();
      window.open(url, "_blank");
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos registrar el pedido");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink uppercase">
        Datos de entrega
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Al confirmar te abrimos WhatsApp con el resumen para coordinar pago y entrega.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          Nombre
          <input
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="rounded border border-line bg-paper px-3 py-2 text-ink"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Dirección
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded border border-line bg-paper px-3 py-2 text-ink"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Zona / barrio (opcional)
          <input
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="rounded border border-line bg-paper px-3 py-2 text-ink"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Horario preferido (opcional)
          <input
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="rounded border border-line bg-paper px-3 py-2 text-ink"
          />
        </label>

        <div className="flex items-center justify-between border-t border-line pt-4 font-display font-semibold text-ink">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-gold py-3 font-display font-semibold tracking-wide text-ink uppercase transition hover:bg-gold-dark disabled:opacity-60"
        >
          {submitting ? "Enviando..." : "Confirmar y coordinar por WhatsApp"}
        </button>
      </form>
    </main>
  );
}
