require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected");

    const server = app.listen(PORT, () => {
      // Use console here since logger is inside app
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });

    // Optional: graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down...");
      server.close(() => process.exit(0));
    });
  } catch (err) {
    console.error("Server startup failed:", err.message);
    process.exit(1);
  }
}

start();