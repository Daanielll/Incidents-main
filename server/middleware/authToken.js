const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  // DELETE LATER
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  //KEEP
  const cookie = req.cookies.token;
  if (!cookie && !token) return res.status(401).json({ msg: "No auth token" });

  // DELETE LATER
  if (!cookie) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ error: "Access token could not be verified" });
      req.user = user;
      next();
    });
  } else {
    // KEEP
    jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ error: "Access token could not be verified" });

      req.user = user;
      next();
    });
  }
};

module.exports = authToken;
