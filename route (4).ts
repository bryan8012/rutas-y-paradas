import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { asignacionId, latitud, longitud, rutaId, paradaId, conductorId } = await req.json();

    // 1. Validar que la asignación exista y esté vigente
    const asignacionActiva = await prisma.tb_ASIGNACIONES.findUnique({
      where: { id: asignacionId }
    });

    if (!asignacionActiva) {
      return Response.json({ error: "Asignación no encontrada o inválida" }, { status: 404 });
    }

    // 2. Registrar el abordaje
    const nuevoAbordaje = await prisma.tb_ASISTENCIA_ABORDAJE.create({
      data: {
        asignacionId,
        rutaId,
        paradaId,
        conductorId,
        latitud,
        longitud,
      }
    });

    return Response.json({ success: true, data: nuevoAbordaje }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error al registrar el abordaje" }, { status: 500 });
  }
}