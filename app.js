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

app.set("trust proxy", 1); // Trust the first proxy (Vercel)

/* ✅ CORS */
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://link-frontend-vert.vercel.app",
        "https://linkzipp.vercel.app",
        "https://link-frontend-omega.vercel.app"
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  })
);

// Enable pre-flight requests for all routes
app.options('*', cors());

/* ✅ Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ✅ Ignore favicon */
app.get("/favicon.ico", (_, res) => res.status(204).end());
app.get("/favicon.png", (_, res) => res.status(204).end());

/* ✅ Health check */
app.get("/", (_, res) => {
  res.send("Welcome to LinkZipp API Server 🚀");
});

/* ✅ Routes */
app.use("/api/auth", auth_routes);
app.use(attachUser);
app.use("/api/user", user_routes);
app.use("/api/create", short_url);

/* ✅ Redirect (LAST) */
app.get("/:id", redirectFromShortUrl);

/* ✅ Error handler */
app.use(errorHandler);

/* ✅ REQUIRED FOR VERCEL */
await connectDB();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
