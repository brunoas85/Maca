import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getOrders, updateOrderStatus } from "../../lib/adminApi";
import { formatPrice } from "../../lib/format";
import type { Order, OrderStatus } from "../../types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const STATUS_OPTIONS: OrderStatus[] = ["pendiente", "confirmado", "entregado", "cancelado"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pendiente: "bg-amber-100 text-amber-900",
  confirmado: "bg-blue-100 text-blue-900",
  entregado: "bg-green-100 text-green-900",
  cancelado: "bg-red-100 text-red-900",
};

function orderTotal(order: Order) {
  return order.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
}

export function AdminOrdersPage() {
  const { token, handleApiError } = useAdminAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const data = await getOrders(token);
      setOrders(data);
    } catch (err) {
      setError(handleApiError(err));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStatusChange(id: string, status: OrderStatus) {
    setUpdatingId(id);
    const previous = orders;
    setOrders((current) => current?.map((o) => (o.id === id ? { ...o, status } : o)) ?? current);
    try {
      const updated = await updateOrderStatus(token, id, status);
      setOrders((current) => current?.map((o) => (o.id === id ? updated : o)) ?? current);
    } catch (err) {
      setOrders(previous ?? null);
      setError(handleApiError(err));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink uppercase">Pedidos</h1>
        <button
          type="button"
          onClick={load}
          className="rounded-full border border-ink/20 px-4 py-2 font-display text-sm font-medium tracking-wide text-ink uppercase"
        >
          Actualizar
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          No se pudo cargar: {error}
        </p>
      )}

      {orders === null && !error && <p className="mt-6 text-ink-soft">Cargando pedidos...</p>}

      {orders !== null && orders.length === 0 && !error && (
        <p className="mt-6 text-ink-soft">Todavía no hay pedidos.</p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {orders?.map((order) => (
          <div key={order.id} className="rounded-lg border border-line bg-paper p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-ink">{order.customerName}</p>
                <p className="text-sm text-ink-soft">
                  {order.address}
                  {order.zone ? ` · ${order.zone}` : ""}
                </p>
                {order.preferredTime && <p className="text-sm text-ink-soft">Horario: {order.preferredTime}</p>}
                <p className="text-ink-soft/70 text-xs">{new Date(order.createdAt).toLocaleString("es-AR")}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${STATUS_STYLES[order.status]}`}
              >
                {STATUS_LABELS[order.status]}
              </span>
            </div>

            <ul className="mt-3 flex flex-col gap-1 border-t border-line pt-3 text-sm text-ink">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.beer.name}
                  </span>
                  <span>{formatPrice(Number(item.unitPrice) * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
              <span className="font-display font-semibold text-ink">Total: {formatPrice(orderTotal(order))}</span>
              <select
                value={order.status}
                disabled={updatingId === order.id}
                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                className="rounded border border-line bg-paper px-3 py-2 text-sm text-ink disabled:opacity-60"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
