import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { beersRouter } from "./routes/beers.js";
import { ordersRouter } from "./routes/orders.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/beers", beersRouter);
app.use("/api/orders", ordersRouter);
