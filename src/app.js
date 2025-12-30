// app.js

'use strict';

const express = require("express");
const pino = require("pino");
const pinoHttp = require("pino-http");

const routes = require("./routes");

const app = express();

// Create logger
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});

// HTTP logger middleware - auto logs requests + adds req.log
const httpLogger = pinoHttp({
  logger,
  // Optional: add request ID for tracing
  genReqId: (req) => req.headers["x-request-id"] || require("crypto").randomUUID(),
});

app.use(express.json());

// Attach logger and log all requests
app.use(httpLogger);

// Health check
app.get("/health", (req, res) => {
  req.log.info("Health check called");
  res.json({ status: "OK" });
});

// Mount routes
app.use(routes);

// Optional: 404 handler
app.use((req, res) => {
  req.log.warn(`Not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  req.log.error(err, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;