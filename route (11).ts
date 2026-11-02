import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Obtener todas las paradas
export async function GET() {
  try {
    const paradas = await prisma.tb_PARADAS.findMany({
      include: {
        rutas: {
          include: {
            ruta: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(paradas);
  } catch (error) {
    console.error("Error al obtener paradas:", error);
    return NextResponse.json(
      { error: "Error al obtener paradas" },
      { status: 500 }
    );
  }
}

// Crear una nueva parada y asociarla a una ruta
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("BODY RECIBIDO EN PARADAS:", body);

    // Extraemos todos los campos posibles que el frontend podría enviar
    const { nombre, direccion, latitud, longitud, rutaId, orden } = body;

    // Si no mandan 'direccion' pero sí mandan coordenadas, las convertimos en texto para cumplir con la BD
    let direccionFinal = direccion;
    if (!direccionFinal && latitud !== undefined && longitud !== undefined) {
      direccionFinal = `Lat: ${latitud}, Lng: ${longitud}`;
    }

    // Validación flexible: requiere nombre, una dirección (o coordenadas) y ruta
    if (!nombre || !direccionFinal || !rutaId) {
      return NextResponse.json(
        { error: "Nombre, dirección (o coordenadas) y ruta son obligatorios" },
        { status: 400 }
      );
    }

    const rutaNum = Number(rutaId);

    // Verificar si la ruta existe
    const ruta = await prisma.tb_RUTAS.findUnique({
      where: { id: rutaNum },
    });

    if (!ruta) {
      return NextResponse.json(
        { error: "La ruta seleccionada no existe" },
        { status: 404 }
      );
    }

    // Transacción para crear la parada y su relación
    const resultado = await prisma.$transaction(async (tx) => {
      const parada = await tx.tb_PARADAS.create({
        data: {
          nombre: String(nombre).trim(),
          direccion: String(direccionFinal).trim(),
        },
      });

      const rutaParada = await tx.tb_RUTA_PARADAS.create({
        data: {
          rutaId: rutaNum,
          paradaId: parada.id,
          orden: Number(orden) || 1,
        },
      });

      return { parada, rutaParada };
    });

    return NextResponse.json(
      {
        message: "Parada registrada correctamente",
        ...resultado,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar parada:", error);
    return NextResponse.json(
      { error: "Error interno al registrar la parada" },
      { status: 500 }
    );
  }
}