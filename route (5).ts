import { EstadoAbordaje } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type EventInput = {
  clientEventId: string;
  pasajeroId: number;
  pasajeroNombre: string;
  estado: "ABORDADO" | "AUSENTE";
  latitud?: number;
  longitud?: number;
  registradoEn: string;
};

export async function POST(request: Request) {
  const { events } = (await request.json()) as { events?: EventInput[] };

  if (!Array.isArray(events) || events.length === 0) {
    return Response.json({ error: "No hay eventos para sincronizar" }, { status: 400 });
  }

  await Promise.all(events.map((event) => prisma.tb_EVENTOS_ABORDAJE.upsert({
    where: { clientEventId: event.clientEventId },
    update: {},
    create: {
      clientEventId: event.clientEventId,
      pasajeroId: event.pasajeroId,
      pasajeroNombre: event.pasajeroNombre,
      estado: event.estado === "ABORDADO" ? EstadoAbordaje.ABORDADO : EstadoAbordaje.AUSENTE,
      latitud: event.latitud,
      longitud: event.longitud,
      registradoEn: new Date(event.registradoEn),
    },
  })));

  return Response.json({ syncedIds: events.map((event) => event.clientEventId) });
}
