const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());

// health check (global)
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// mount all service routes
app.use(routes);

module.exports = app;




// const config = require("./config");
// const express = require("express");
// const app = express();
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const pino = require("pino");
// const loggerMiddleware = require("pino-http");
// const logger = pino.pino();
// const bodyParser = require("body-parser");

// app.use(bodyParser.json());
// app.use(cors)
