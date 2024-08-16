const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// JSON
app.use(express.json());

// CORS
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// COOKIES
app.use(cookieParser());

// ROUTES
// Users
app.use("/users", require("./routes/userRoutes"));
// Users
app.use("/incidents", require("./routes/incidentRoutes"));

// Apps
app.use("/apps", require("./routes/appRoutes"));

app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
