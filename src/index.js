require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err.message);
    process.exit(1);
  }
}

start();
