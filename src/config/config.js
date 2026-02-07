const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,       // true in production (HTTPS), false in dev (HTTP)
  sameSite: isProduction ? "None" : "Lax",   // None in production, Lax in dev
  maxAge: 7 * 24 * 60 * 60 * 1000
};
