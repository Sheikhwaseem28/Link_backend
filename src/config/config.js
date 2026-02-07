const isLocal = process.env.NODE_ENV === "development"; // true only locally

export const cookieOptions = {
  httpOnly: true,
  secure: !isLocal,            // Always true in prod/Vercel
  sameSite: isLocal ? "Lax" : "None",
  maxAge: 7 * 24 * 60 * 60 * 1000
};
