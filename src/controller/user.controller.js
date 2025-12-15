// src/controller/user.controller.js
import { getUrlsByUserId } from "../dao/short_url.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

export const getUserUrls = wrapAsync(async (req, res) => {
  // authMiddleware should already verify the user
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const urls = await getUrlsByUserId(req.user._id);
  
  res.status(200).json({
    urls: urls || [], // Ensure it's always an array
    count: urls ? urls.length : 0
  });
});

export const createUserUrl = wrapAsync(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Your existing URL creation logic
  const data = req.body;
  // ... rest of your URL creation logic
  
  res.status(200).json({
    shortUrl: process.env.APP_URL + shortUrl
  });
});