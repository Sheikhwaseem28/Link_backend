export const cookieOptions = {
  httpOnly: true,
  secure: true,       // REQUIRED on Vercel
  sameSite: "None",   // REQUIRED for cross-domain
  maxAge: 7 * 24 * 60 * 60 * 1000
};
