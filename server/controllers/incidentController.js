const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createIncident = async (req, res) => {
  const userId = req.user.id;
  const { apps, impacted_apps, ...params } = req.body;

  if (
    !params.title ||
    !params.description ||
    !params.technical_impact ||
    !params.operational_impact ||
    !params.platform ||
    !params.env ||
    !params.site ||
    !params.reported_by ||
    !apps ||
    apps.length === 0
  )
    return res.status(400).json({ error: "שדות חובה חסרים" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return res.status(400).json({ error: "משתמש לא קיים" });

    const result = await prisma.$transaction(async (tx) => {
      const incident = await tx.incident.create({
        data: { ...params, opened_by_id: userId },
      });
      for (let appId of apps) {
        await tx.incidentApp.create({
          data: {
            incidentId: incident.id,
            appId,
          },
        });
      }
      if (impacted_apps) {
        for (let appId of impacted_apps) {
          await tx.incidentImpact.create({
            data: {
              incidentId: incident.id,
              appId,
            },
          });
        }
      }

      return { incident };
    });

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllIncidents = async (req, res) => {
  const { page = 0, limit = 10 } = req.query;
  try {
    const incidents = await prisma.incident.findMany({
      select: {
        IncidentApp: { select: { app: true } },
        IncidentImpact: { select: { app: true } },
        description: true,
        end_date: true,
        start_date: true,
        operational_impact: true,
        technical_impact: true,
        status: true,
        title: true,
        id: true,
      },
      skip: Number(page) * Number(limit),
      take: Number(limit),
    });
    const count = await prisma.incident.count();
    return res.status(201).json({ incidents, count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getIncidentById = async (req, res) => {
  const incId = Number(req.params.incId);
  if (!incId) return req.status(400).json({ error: "מזהה אירוע חסר" });
  try {
    const incident = await prisma.incident.findUnique({
      where: { id: incId },
      include: {
        IncidentApp: { select: { app: true, appId: true } },
        IncidentImpact: { select: { app: true } },
        opened_by: { select: { first_name: true, last_name: true } },
        IncidentActivity: {
          select: {
            sent_by: { select: { first_name: true, last_name: true } },
            message: true,
            message_date: true,
          },
        },
      },
    });
    return res.status(200).json(incident);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createIncidentComment = async (req, res) => {
  const incId = Number(req.params.incId);
  const userId = req.user.id;
  const message = req.body.message;
  if (!message || !incId || !userId)
    return res.status(400).json({ error: "שדות חובה חסרים" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { first_name: true, last_name: true },
    });
    if (!user)
      return res.status(404).json({ error: "Cant find a user with this ID" });
    const incidentId = await prisma.incident.findUnique({
      where: { id: incId },
      select: { id: true },
    });
    if (!incidentId)
      return res.status(404).json({ error: "לא קיים אירוע עם המזהה הזה" });
    const result = await prisma.incidentActivity.create({
      data: { message, userId, incidentId: incId },
    });
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteIncident = async (req, res) => {
  const incId = Number(req.params.incId);
  if (!incId) return res.status(400).json({ error: "שדות חובה חסרים" });
  try {
    const result = await prisma.incident.delete({ where: { id: incId } });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  createIncident,
  getAllIncidents,
  getIncidentById,
  createIncidentComment,
  deleteIncident,
};
