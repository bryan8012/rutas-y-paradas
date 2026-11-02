import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const UserService = {
  async crearUsuario(data: { email: string; passwordPlana: string; roleId: number }) {
    const passwordHash = await bcrypt.hash(data.passwordPlana, 10);

    return prisma.user.create({
      data: {
        email: data.email,
        password: passwordHash,
        roleId: data.roleId,
      },
    });
  },
};
