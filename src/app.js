'use strict';

const express = require("express");
const pino = require("pino");
const pinoHttp = require("pino-http");
const routes = require("./routes");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
// Create logger
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});
const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers["x-request-id"] || require("crypto").randomUUID(),
});

app.use(express.json());

app.use(httpLogger);

app.get("/health", (req, res) => {
  req.log.info("Health check called");
  res.json({ status: "OK" });
});

app.use(routes);

app.use((req, res) => {
  req.log.warn(`Not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  req.log.error(err, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;