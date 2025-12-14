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
  "https://link-frontend-vert.vercel.app"
];

/* ✅ CORS CONFIG */
app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / server-side calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ✅ Handle Preflight */
app.options("*", cors());

/* ✅ Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ✅ Health Check */
app.get("/", (req, res) => {
  res.send("Welcome to LinkZipp API Server 🚀");
});

/* ✅ Attach User Middleware */
app.use(attachUser);

/* ✅ Routes */
app.use("/api/user", user_routes);
app.use("/api/auth", auth_routes);
app.use("/api/create", short_url);
app.get("/:id", redirectFromShortUrl);

/* ✅ Global Error Handler */
app.use(errorHandler);

/* ✅ Start Server */
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
