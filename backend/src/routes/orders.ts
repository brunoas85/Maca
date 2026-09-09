import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/auth.js";

export const ordersRouter = Router();

const orderInputSchema = z.object({
  customerName: z.string().min(1),
  address: z.string().min(1),
  zone: z.string().optional(),
  preferredTime: z.string().optional(),
  items: z
    .array(
      z.object({
        beerId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

// Público: crear pedido desde el checkout (sin login)
ordersRouter.post("/", async (req, res) => {
  const parsed = orderInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten() });
  }
  const { customerName, address, zone, preferredTime, items } = parsed.data;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const beers = await tx.beer.findMany({
        where: { id: { in: items.map((item) => item.beerId) } },
      });

      for (const item of items) {
        const beer = beers.find((b) => b.id === item.beerId);
        if (!beer || !beer.active) {
          throw new Error(`Cerveza no disponible: ${item.beerId}`);
        }
        if (beer.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${beer.name}`);
        }
      }

      return tx.order.create({
        data: {
          customerName,
          address,
          zone,
          preferredTime,
          items: {
            create: items.map((item) => {
              const beer = beers.find((b) => b.id === item.beerId)!;
              return {
                beerId: item.beerId,
                quantity: item.quantity,
                unitPrice: beer.price,
              };
            }),
          },
        },
        include: { items: { include: { beer: true } } },
      });
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(409).json({ error: err instanceof Error ? err.message : "No se pudo crear el pedido" });
  }
});

// Admin: listado de pedidos
ordersRouter.get("/", requireAdmin, async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: { include: { beer: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

const statusSchema = z.object({
  status: z.enum(["pendiente", "confirmado", "entregado", "cancelado"]),
});

// Admin: cambio de estado de un pedido (descuenta stock al confirmar)
ordersRouter.patch("/:id/status", requireAdmin, async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  const order = await prisma.order.findUnique({
    where: { id: req.params.id as string },
    include: { items: true },
  });
  if (!order) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }

  const { status } = parsed.data;

  const updated = await prisma.$transaction(async (tx) => {
    if (status === "confirmado" && order.status === "pendiente") {
      for (const item of order.items) {
        await tx.beer.update({
          where: { id: item.beerId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
    return tx.order.update({ where: { id: order.id }, data: { status } });
  });

  res.json(updated);
});
