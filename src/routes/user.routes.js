// src/routes/user.routes.js
import express from 'express';
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUserUrls, deleteUserUrl } from "../controller/user.controller.js";

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// Get user's URLs - using GET for RESTful API
router.get("/urls", getUserUrls);

// Delete user's URL
router.delete("/urls/:id", deleteUserUrl);

export default router;