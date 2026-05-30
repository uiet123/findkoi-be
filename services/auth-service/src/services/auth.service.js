const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AuthService {
  async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(name, email, password) {
    return await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }
}

module.exports = new AuthService();
