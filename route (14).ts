import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 1. Obtener la lista de pasajeros con sus relaciones
export async function GET() {
  try {
    const pasajeros = await prisma.tb_PASAJEROS.findMany({
      include: {
        ruta: true,
        parada: true,
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(pasajeros, { status: 200 });
  } catch (error) {
    console.error("Error al obtener pasajeros:", error);
    return NextResponse.json({ error: "Error al obtener pasajeros" }, { status: 500 });
  }
}

// 2. Registrar un nuevo pasajero
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, email, correo, rutaId, paradaId } = body;

    if (!nombre || !rutaId) {
      return NextResponse.json(
        { error: "El nombre y la ruta son obligatorios" },
        { status: 400 }
      );
    }

    const nuevoPasajero = await prisma.tb_PASAJEROS.create({
      data: {
        nombre: nombre.trim(),
        email: (email || correo) ? (email || correo).trim() : "",
        rutaId: Number(rutaId),
        paradaId: paradaId ? Number(paradaId) : null,
      },
      include: {
        parada: true,
        ruta: true,
      },
    });

    return NextResponse.json(
      { 
        message: "Pasajero creado con éxito", 
        pasajero: nuevoPasajero 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear pasajero:", error);
    return NextResponse.json(
      { error: "Error interno al crear pasajero" }, 
      { status: 500 }
    );
  }
}