import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Buscamos al usuario en tu BD
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // Verificamos la contraseña
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return { id: user.id.toString(), email: user.email };
        }
        return null; // Si no coincide, retorna null (error)
      }
    })
  ],
  pages: { signIn: "/login" }, // Asegúrate de que esta sea tu ruta de login
  secret: process.env.NEXTAUTH_SECRET, // Debes crear esta variable en tu .env
});

export { handler as GET, handler as POST };