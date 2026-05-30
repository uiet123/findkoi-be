const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-env";

class AuthController {
  async signup(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password are required" });
    }

    try {
      const existingUser = await authService.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const newUser = await authService.createUser(name, email, password);

      return res
        .status(201)
        .json({ message: "User created successfully", userId: newUser.id });
    } catch (error) {
      console.error("Signup error in controller:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    try {
      const user = await authService.findUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Login error in controller:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new AuthController();
