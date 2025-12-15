import User from "../models/user.model.js";
import ShortUrl from "../models/short_url.model.js";

/* ================= AUTH ================= */
export const createUser = async (name, email, password) => {
  return await User.create({ name, email, password });
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserByEmailByPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

/* ================= USER URLS ================= */
export const getAllUserUrlsDao = async (userId) => {
  return await ShortUrl.find({ user: userId }).sort({ createdAt: -1 });
};
