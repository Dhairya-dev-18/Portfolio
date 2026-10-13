import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Origin is not allowed by CORS"));
    },
    methods: ["GET", "POST"],
  }),
);
app.use(express.json({ limit: "12kb" }));

const contactLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many messages. Please try again later." },
});
const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(500).optional(),
});

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "error", message: "Database unavailable" });
  }
});

app.post("/api/contact", contactLimit, async (req, res, next) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({
        message: "Please check the form fields and try again.",
        errors: parsed.error.flatten().fieldErrors,
      });
    return;
  }
  // Silent honeypot success avoids confirming spam detection to automated submitters.
  if (parsed.data.website?.trim()) {
    res.status(201).json({ message: "Message received." });
    return;
  }
  try {
    await prisma.contactSubmission.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    });
    res.status(201).json({ message: "Message received." });
  } catch (error) {
    next(error);
  }
});

const errors: ErrorRequestHandler = (err, _req, res, _next) => {
  void _next;
  console.error(
    "Request failed:",
    err instanceof Error ? err.message : "unknown error",
  );
  if (res.headersSent) return;
  res
    .status(500)
    .json({ message: "The server could not process this request." });
};
app.use(errors);

const server = app.listen(port, () =>
  console.info(`Portfolio API listening on port ${port}`),
);
const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
