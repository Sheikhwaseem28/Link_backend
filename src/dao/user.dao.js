import User from "../models/user.model.js";

/* ================= REGISTER ================= */
export const createUser = async (name, email, password) => {
  return await User.create({
    name,
    email,
    password,
  });
};

/* ================= LOGIN ================= */
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Includes password field explicitly
export const findUserByEmailByPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};

/* ================= AUTH ================= */
export const findUserById = async (id) => {
  return await User.findById(id);
};
