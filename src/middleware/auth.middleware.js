import { verifyToken } from "../utils/helper.js";
import { findUserById } from "../dao/user.dao.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1]; // Check cookie OR header
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
