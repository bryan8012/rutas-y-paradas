import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Para que los pasajeros lean la última ubicación en tiempo real
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "ID de ruta inválido" },
        { status: 400 }
      );
    }

    const ruta = await prisma.tb_RUTAS.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        latitud: true,
        longitud: true,
      },
    });

    if (!ruta) {
      return NextResponse.json(
        { success: false, error: "Ruta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ruta: {
        id: ruta.id,
        nombre: ruta.nombre,
        latitud: ruta.latitud ?? 0.0,
        longitud: ruta.longitud ?? 0.0,
      },
    });
  } catch (error) {
    console.error("Error al obtener la ubicación de la ruta:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST: Para que el conductor actualice la posición actual
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "ID de ruta inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { latitud, longitud } = body;

    if (latitud === undefined || longitud === undefined) {
      return NextResponse.json(
        { success: false, error: "Se requieren latitud y longitud" },
        { status: 400 }
      );
    }

    const rutaActualizada = await prisma.tb_RUTAS.update({
      where: { id },
      data: {
        latitud: Number(latitud),
        longitud: Number(longitud),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ubicación actualizada correctamente",
      ruta: {
        id: rutaActualizada.id,
        latitud: rutaActualizada.latitud,
        longitud: rutaActualizada.longitud,
      },
    });
  } catch (error) {
    console.error("Error al actualizar la ubicación:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al actualizar la ubicación" },
      { status: 500 }
    );
  }
}

// PATCH: Alias de POST para solucionar el error 405 (Method Not Allowed)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return POST(request, { params });
}