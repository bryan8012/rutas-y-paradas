import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const pasajeroId = Number(id);

    const body = await request.json();
    const { estado } = body;

    if (isNaN(pasajeroId)) {
      return NextResponse.json(
        { error: "ID de pasajero inválido" },
        { status: 400 }
      );
    }

    if (estado !== "ABORDO" && estado !== "AUSENTE") {
      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 }
      );
    }

    const pasajero = await prisma.tb_PASAJEROS.findUnique({
      where: {
        id: pasajeroId,
      },
    });

    if (!pasajero) {
      return NextResponse.json(
        { error: "Pasajero no encontrado" },
        { status: 404 }
      );
    }

    // 1. ACTUALIZAR EL ESTADO EN LA TABLA DE PASAJEROS
    const pasajeroActualizado = await prisma.tb_PASAJEROS.update({
      where: { id: pasajeroId },
      data: { estado: estado },
    });

    // 2. REGISTRAR EL EVENTO DE ABORDAJE
    const clientEventId = `pasajero-${pasajeroId}-${Date.now()}`;

    const evento = await prisma.tb_EVENTOS_ABORDAJE.create({
      data: {
        clientEventId,
        pasajeroId: pasajero.id,
        pasajeroNombre: pasajero.nombre,
        estado: estado === "ABORDO" ? "ABORDADO" : "AUSENTE",
        registradoEn: new Date(),
      },
    });

    return NextResponse.json({
      message:
        estado === "ABORDO"
          ? "Pasajero marcado como abordado"
          : "Pasajero marcado como ausente",
      pasajero: pasajeroActualizado,
      evento,
    });
  } catch (error) {
    console.error("Error al cambiar estado:", error);

    return NextResponse.json(
      { error: "Error interno al cambiar estado" },
      { status: 500 }
    );
  }
}