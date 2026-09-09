import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/auth.js";

export const beersRouter = Router();

// Público: catálogo de cervezas activas
beersRouter.get("/", async (_req, res) => {
  const beers = await prisma.beer.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });
  res.json(beers);
});

// Público: ficha de producto
beersRouter.get("/:id", async (req, res) => {
  const id = req.params.id as string;
  const beer = await prisma.beer.findUnique({ where: { id } });
  if (!beer || !beer.active) {
    return res.status(404).json({ error: "Cerveza no encontrada" });
  }
  res.json(beer);
});

const beerInputSchema = z.object({
  name: z.string().min(1),
  style: z.string().min(1),
  abv: z.number().nonnegative(),
  ibu: z.number().int().nonnegative().optional(),
  description: z.string().min(1),
  imageUrl: z.string().url().optional(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  active: z.boolean().optional(),
});

// Admin: alta de cerveza
beersRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = beerInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten() });
  }
  const beer = await prisma.beer.create({ data: parsed.data });
  res.status(201).json(beer);
});

// Admin: edición de cerveza (precio, stock, etc.)
beersRouter.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = beerInputSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten() });
  }
  const beer = await prisma.beer.update({
    where: { id: req.params.id as string },
    data: parsed.data,
  });
  res.json(beer);
});

// Admin: baja (soft delete) de cerveza
beersRouter.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.beer.update({
    where: { id: req.params.id as string },
    data: { active: false },
  });
  res.status(204).send();
});
