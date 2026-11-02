import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { rutaId, latitud, longitud } = await request.json();

    if (!rutaId) {
      return NextResponse.json({ error: "Falta el ID de la ruta" }, { status: 400 });
    }

    // Actualizar la latitud y longitud de la ruta en la base de datos
    await prisma.tb_RUTAS.update({
      where: { id: Number(rutaId) },
      data: {
        latitud: Number(latitud),
        longitud: Number(longitud),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al actualizar ubicación:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}