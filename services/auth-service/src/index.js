const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/health", (_, res) => {
  res.status(200).json({ service: "auth-service", status: "ok" });
});

// Auth Routes (router itself defines routes like /signup and /login, and we mount it under /auth)
app.use("/auth", authRoutes);

app
  .listen(PORT, () => {
    console.log(`Auth service listening on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please kill the process using this port or use a different port.`,
      );
      process.exit(1);
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
