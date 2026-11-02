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
    const paradaId = Number(body.paradaId);

    if (!pasajeroId || !paradaId) {
      return NextResponse.json(
        { error: "Pasajero y parada son obligatorios" },
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

    const parada = await prisma.tb_PARADAS.findUnique({
      where: {
        id: paradaId,
      },
    });

    if (!parada) {
      return NextResponse.json(
        { error: "Parada no encontrada" },
        { status: 404 }
      );
    }

    const actualizado = await prisma.tb_PASAJEROS.update({
      where: {
        id: pasajeroId,
      },
      data: {
        paradaId,
      },
      include: {
        ruta: true,
        parada: true,
      },
    });

    return NextResponse.json({
      message: "Parada asignada correctamente",
      pasajero: actualizado,
    });
  } catch (error) {
    console.error("Error al asignar parada:", error);

    return NextResponse.json(
      { error: "Error interno al asignar la parada" },
      { status: 500 }
    );
  }
}