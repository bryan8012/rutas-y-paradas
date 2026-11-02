import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // Buscar al usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: String(email).trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "El correo no está registrado" },
        { status: 404 }
      );
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Inicio de sesión exitoso",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error crítico en el login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}