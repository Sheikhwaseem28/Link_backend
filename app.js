import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/monogo.config.js";
import short_url from "./src/routes/short_url.route.js";
import user_routes from "./src/routes/user.routes.js";
import auth_routes from "./src/routes/auth.routes.js";
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import { attachUser } from "./src/utils/attachUser.js";

dotenv.config();

const app = express();

/* =======================
   CORS CONFIG
======================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://link-frontend-vert.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / server calls

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ✅ Explicit preflight handler */
app.options("*", (req, res) => {
  res.sendStatus(204);
});

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =======================
   BASIC ROUTES
======================= */
app.get("/", (req, res) => {
  res.send("Welcome to LinkZipp API Server 🚀");
});

/* Ignore browser asset noise */
app.get("/favicon.ico", (_, res) => res.status(204).end());
app.get("/favicon.png", (_, res) => res.status(204).end());

/* =======================
   API ROUTES
======================= */
app.use("/api/auth", auth_routes); // login/register first

app.use(attachUser); // attach user AFTER auth

app.use("/api/user", user_routes);
app.use("/api/create", short_url);

/* =======================
   SHORT URL REDIRECT
   ⚠️ MUST BE LAST
======================= */
app.get("/:id", redirectFromShortUrl);

/* =======================
   ERROR HANDLER
======================= */
app.use(errorHandler);

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
