const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createUser = async (req, res) => {
  const { id, first_name, last_name, password, role } = req.body;

  // Return if vars are invalid
  if (!id || !first_name || !last_name || !password)
    return res.status(400).json({ error: "שדות חובה חסרים" });

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (existingUser)
      return res.status(400).json({ error: "משתמש עם המספר עובד כבר קיים" });

    // Create user
    const user = await prisma.user.create({
      data: { id, first_name, last_name, password, role },
    });
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  createUser,
  getUser,
};
