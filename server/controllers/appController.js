const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createApp = async (req, res) => {
  const userId = req.user.id;
  const {
    name,
    description,
    operational_impact,
    env,
    main_site,
    recovery,
    platform,
  } = req.body;
  if (!name) {
    return res.status(400).json({ error: "שדות חובה חסרים" });
  }
  try {
    const userAdmin = await prisma.user.findUnique({
      where: { role: "MANAGER", id: userId },
    });
    if (!userAdmin) {
      return res.status(401).json({ error: "אין לך את ההרשאות המתאימות" });
    }
    const app = await prisma.app.create({
      data: {
        name,
        description,
        operational_impact,
        env,
        main_site,
        recovery,
        platform,
      },
    });
    res.status(201).json(app);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllApps = async (req, res) => {
  try {
    const apps = await prisma.app.findMany();
    res.status(200).json(apps);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateApp = async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const {
    name,
    description,
    operational_impact,
    env,
    main_site,
    recovery,
    platform,
  } = req.body;
  if (!id) {
    return res.status(400).json({ error: "שדות חובה חסרים" });
  }
  try {
    const userAdmin = await prisma.user.findUnique({
      where: { role: "MANAGER", id: userId },
    });
    if (!userAdmin) {
      return res.status(401).json({ error: "אין לך את ההרשאות המתאימות" });
    }
    const app = await prisma.app.update({
      where: { id },
      data: {
        name,
        description,
        operational_impact,
        env,
        main_site,
        recovery,
        platform,
      },
    });
    res.status(200).json(app);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteApp = async (req, res) => {
  const userId = req.user.id;
  const appId = Number(req.params.id);

  try {
    const userAdmin = await prisma.user.findUnique({
      where: { role: "MANAGER", id: userId },
    });
    if (!userAdmin) {
      return res.status(401).json({ error: "אין לך את ההרשאות המתאימות" });
    }

    const app = await prisma.app.delete({
      where: { id: appId },
    });
    res.status(200).json(app);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { createApp, getAllApps, updateApp, deleteApp };
