// src/controller/user.controller.js
import { getUrlsByUserId, deleteShortUrl } from "../dao/short_url.js";
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

export const deleteUserUrl = wrapAsync(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;
  const deletedUrl = await deleteShortUrl(id, req.user._id);

  if (!deletedUrl) {
    return res.status(404).json({ message: "URL not found or unauthorized" });
  }

  res.status(200).json({ message: "URL deleted successfully" });
});