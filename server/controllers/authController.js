const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authUser = async (req, res) => {
  const { id, password } = req.body;
  if (!id || !password)
    return res.status(400).json({ error: "שדות חובה חסרים" });
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(400).json({ error: "משתמש לא קיים" });

    // Check if user's password matches (not using encrypted passwords)
    // const isPasswordValid = password == user.password;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ error: "סיסמה שגויה" });

    // If passwords match, generate token (1h expiration time)
    jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Failed to generate token" });
        }
        console.log(token);
        // Create a cookie with the token
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "Strict",
          maxAge: 1000 * 60 * 60,
        });
        res.status(202).json(user);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, results) => {
    if (err)
      return res
        .status(403)
        .json({ error: "Access token could not be verified" });

    const user = await prisma.user.findUnique({
      where: { id: results.id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        role: true,
      },
    });
    res.json(user);
  });
};

module.exports = { authUser, getUser };
