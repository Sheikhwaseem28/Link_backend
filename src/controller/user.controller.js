// src/controller/user.controller.js
import { getUrlsByUserId, deleteShortUrl } from "../dao/short_url.js";
import { createShortUrlWithUser } from "../services/short_url.service.js";
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

  const { url, slug } = req.body;
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  const shortUrl = await createShortUrlWithUser(url, req.user._id, slug);

  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}/`;
  const finalShortUrl = baseUrl.endsWith("/") ? baseUrl + shortUrl : baseUrl + "/" + shortUrl;

  res.status(200).json({
    shortUrl: finalShortUrl
  });
});

export const deleteUserUrl = wrapAsync(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;
  console.log("Attempting to delete URL:", id, "for user:", req.user._id);
  const deletedUrl = await deleteShortUrl(id, req.user._id);
  console.log("Delete result:", deletedUrl);

  if (!deletedUrl) {
    return res.status(404).json({ message: "URL not found or unauthorized" });
  }

  res.status(200).json({ message: "URL deleted successfully" });
});