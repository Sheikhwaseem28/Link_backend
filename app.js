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

/* ✅ Allowed Frontend Origins */
const allowedOrigins = [
  "http://localhost:5173",
  "https://link-frontend-vert.vercel.app",
];

/* ✅ CORS — THIS ALONE HANDLES PREFLIGHT */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ✅ Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ✅ Ignore favicon (CRITICAL) */
app.get("/favicon.ico", (_, res) => res.status(204).end());
app.get("/favicon.png", (_, res) => res.status(204).end());

/* ✅ Health check */
app.get("/", (_, res) => {
  res.send("Welcome to LinkZipp API Server 🚀");
});

/* ✅ API routes */
app.use("/api/auth", auth_routes);
app.use(attachUser);
app.use("/api/user", user_routes);
app.use("/api/create", short_url);

/* ✅ Short URL redirect (LAST) */
app.get("/:id", redirectFromShortUrl);

/* ✅ Global error handler */
app.use(errorHandler);

/* ✅ Start server */
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
