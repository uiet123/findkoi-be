const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-env";

const users = [];

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_, res) => {
  res.status(200).json({ service: "auth-service", status: "ok" });
});

app.post("/auth/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email and password are required" });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
  };

  users.push(newUser);
  return res
    .status(201)
    .json({ message: "User created successfully", userId: newUser.id });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).json({ message: "Login successful", token });
});

app
  .listen(PORT, () => {
    console.log(`Auth service listening on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please kill the process using this port or use a different port.`,
      );
      console.error("To find the process: netstat -ano | findstr :" + PORT);
      process.exit(1);
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
