import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rutas, vehiculos, conductores, asignaciones] = await Promise.all([
      prisma.tb_RUTAS.findMany({
        include: {
          vehiculo: true,
          passengers: true,
        },
        orderBy: {
          id: "asc",
        },
      }),

      prisma.tb_VEHICULOS.findMany({
        orderBy: {
          id: "asc",
        },
      }),

      prisma.user.findMany({
        select: {
          id: true,
          name: true,  // <--- Agregado para que devuelva el nombre del usuario
          email: true,
        },
        orderBy: {
          id: "asc",
        },
      }),

      prisma.tb_ASIGNACIONES.findMany({
        include: {
          ruta: true,
          vehiculo: true,
          conductor: true,
        },
        orderBy: {
          id: "desc",
        },
      }),
    ]);

    return NextResponse.json({
      rutas,
      vehiculos,
      conductores,
      asignaciones,
    });
  } catch (error) {
    console.error("Error al cargar asignaciones:", error);

    return NextResponse.json(
      { error: "Error al cargar los datos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const rutaId = Number(body.rutaId);
    const vehiculoId = Number(body.vehiculoId);
    const conductorId = Number(body.conductorId);

    if (!rutaId || !vehiculoId || !conductorId) {
      return NextResponse.json(
        { error: "Ruta, vehículo y conductor son obligatorios" },
        { status: 400 }
      );
    }

    const ruta = await prisma.tb_RUTAS.findUnique({
      where: {
        id: rutaId,
      },
      include: {
        passengers: true,
      },
    });

    const vehiculo = await prisma.tb_VEHICULOS.findUnique({
      where: {
        id: vehiculoId,
      },
    });

    const conductor = await prisma.user.findUnique({
      where: {
        id: conductorId,
      },
    });

    if (!ruta || !vehiculo || !conductor) {
      return NextResponse.json(
        { error: "Ruta, vehículo o conductor no encontrados" },
        { status: 404 }
      );
    }

    if (ruta.passengers.length > vehiculo.capacidad) {
      return NextResponse.json(
        { error: "La cantidad de pasajeros supera la capacidad del vehículo" },
        { status: 400 }
      );
    }

    const asignacion = await prisma.tb_ASIGNACIONES.create({
      data: {
        rutaId,
        vehiculoId,
        conductorId,
      },
      include: {
        ruta: true,
        vehiculo: true,
        conductor: true,
      },
    });

    return NextResponse.json(
      {
        message: "Asignación registrada correctamente",
        asignacion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear asignación:", error);

    return NextResponse.json(
      { error: "Error interno al crear la asignación" },
      { status: 500 }
    );
  }
}