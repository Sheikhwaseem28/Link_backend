import { findUserById } from "../dao/user.dao.js";
import { verifyToken } from "./helper.js";

export const attachUser = async (req, res, next) => {
  // ✅ ALWAYS allow preflight requests
  if (req.method === "OPTIONS") {
    return next();
  }

  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  // No token → continue silently
  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    console.error("attachUser error:", error.message);
    next();
  }
};
