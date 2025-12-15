import { getAllUserUrlsDao } from "../dao/user.dao.js";

export const getAllUserUrls = async (req, res, next) => {
  try {
    const urls = await getAllUserUrlsDao(req.user._id);
    res.status(200).json({ success: true, urls });
  } catch (error) {
    next(error);
  }
};
