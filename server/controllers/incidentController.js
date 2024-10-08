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
    !params.reported_by ||
    !apps ||
    apps.length === 0
  )
    return res.status(400).json({ error: "שדות חובה חסרים" });

  try {
    const firstApp = await prisma.app.findUnique({
      where: { id: apps[0] },
      select: { main_site: true, env: true, platform: true },
    });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return res.status(400).json({ error: "משתמש לא קיים" });

    const result = await prisma.$transaction(async (tx) => {
      const incident = await tx.incident.create({
        data: {
          ...params,
          opened_by_id: userId,
          site: firstApp.main_site,
          platform: firstApp.platform,
          env: firstApp.env,
          updated_by_id: userId,
        },
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
const updateIncident = async (req, res) => {
  const userId = req.user.id;
  const { apps, impacted_apps, ...params } = req.body; // exclude apps and impacted apps from the rest
  const id = Number(req.params.incId);

  if (!id) return res.status(400).json({ error: "שדות חובה חסרים" });
  try {
    // Validate user first
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return res.status(400).json({ error: "משתמש לא קיים" });
    // Get the apps and impact apps that the inc already has
    const currentApps = await prisma.incident.findUnique({
      where: { id },
      select: {
        IncidentApp: { select: { appId: true } },
        IncidentImpact: { select: { appId: true } },
      },
    });
    if (!currentApps)
      return res.status(404).json({ error: "לא קיימת פעילות עם המזהה הזה" });
    // Move all the apps to an array of IDs
    const currentAppsArrays = {
      apps: currentApps.IncidentApp.map((app) => app.appId),
      impacted_apps: currentApps.IncidentImpact.map((app) => app.appId),
    };
    // Create an array of apps to delete, by ID
    const appsToDelete = {
      apps: apps ? currentAppsArrays.apps.filter((a) => !apps.includes(a)) : [],
      impacted_apps: impacted_apps
        ? currentAppsArrays.impacted_apps.filter(
            (a) => !impacted_apps.includes(a)
          )
        : [],
    };
    // Create an array of apps to add, by ID
    const appsToAdd = {
      apps: apps ? apps.filter((a) => !currentAppsArrays.apps.includes(a)) : [],
      impacted_apps: impacted_apps
        ? impacted_apps.filter(
            (a) => !currentAppsArrays.impacted_apps.includes(a)
          )
        : [],
    };

    // Do it all in a transaction so there wont be any data loss
    const result = await prisma.$transaction(async (tx) => {
      // first update the incident itself
      const incident = await tx.incident.update({
        where: { id },
        data: { ...params, updated_by_id: userId },
      });

      // delete all apps from the appsToDelete array and then create new new ones
      if (apps) {
        if (appsToDelete.apps[0])
          await tx.incidentApp.deleteMany({
            where: {
              AND: {
                appId: { in: appsToDelete.apps },
                incidentId: incident.id,
              },
            },
          });
        if (appsToAdd.apps[0])
          for (appId of appsToAdd.apps) {
            await tx.incidentApp.create({
              data: {
                incidentId: incident.id,
                appId,
              },
            });
          }
      }

      // Then do the same thing for impacted apps
      if (impacted_apps) {
        if (appsToDelete.impacted_apps[0])
          await tx.incidentImpact.deleteMany({
            where: {
              AND: {
                appId: { in: appsToDelete.impacted_apps },
                incidentId: incident.id,
              },
            },
          });
        if (appsToAdd.impacted_apps[0])
          for (appId of appsToAdd.impacted_apps) {
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
  const { page = 0, limit = 10, search = "" } = req.query;
  const searchConditions = {
    OR: [
      { title: { contains: search } },
      { description: { contains: search } },
    ],
  };
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
      where: searchConditions,
      skip: Number(page) * Number(limit),
      take: Number(limit),
      orderBy: { start_date: "desc" },
    });
    const count = await prisma.incident.count({ where: searchConditions });
    return res.status(201).json({ incidents, count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getIncidentById = async (req, res) => {
  const incId = Number(req.params.incId);
  if (!incId) return res.status(400).json({ error: "מזהה אירוע חסר" });
  try {
    const incident = await prisma.incident.findUnique({
      where: { id: incId },
      include: {
        IncidentApp: { select: { app: true, appId: true } },
        IncidentImpact: { select: { app: true } },
        opened_by: { select: { first_name: true, last_name: true } },
        updated_by: true,
      },
    });
    return res.status(200).json(incident);
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
  deleteIncident,
  updateIncident,
};
