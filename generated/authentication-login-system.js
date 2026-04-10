import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SESSION_COOKIE = "session";

export const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await req.userStore.findByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/"
  });

  return res.status(200).json({ ok: true });
};