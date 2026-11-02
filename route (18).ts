import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Cambiado a bcryptjs

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Hashear la contraseña de forma segura
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        password: hashedPassword,
        role: role || "CONDUCTOR",
      },
    });

    return NextResponse.json(
      { message: "Usuario creado con éxito", newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json(
      { error: "El correo ya está registrado o hubo un fallo en el servidor" },
      { status: 500 }
    );
  }
}