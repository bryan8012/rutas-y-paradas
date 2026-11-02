import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// OBTENER VEHÍCULOS
export async function GET() {
  try {
    const vehiculos = await prisma.tb_VEHICULOS.findMany({
      orderBy: {
        id: "desc",
      },
    });

    console.log("📲 [API GET /vehiculos] Vehículos enviados:", vehiculos.length);

    return NextResponse.json(vehiculos);
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    return NextResponse.json(
      { error: "Error al obtener los vehículos" },
      { status: 500 }
    );
  }
}

// REGISTRAR VEHÍCULO (Asegúrate de que esta función exista y esté escrita así)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { placa, modelo, capacidad } = body;

    if (!placa || !modelo || capacidad === undefined) {
      return NextResponse.json(
        { error: "Placa, modelo y capacidad son obligatorios" },
        { status: 400 }
      );
    }

    const capacidadNumero = Number(capacidad);

    if (Number.isNaN(capacidadNumero) || capacidadNumero <= 0) {
      return NextResponse.json(
        { error: "La capacidad debe ser un número mayor que 0" },
        { status: 400 }
      );
    }

    const existente = await prisma.tb_VEHICULOS.findUnique({
      where: {
        placa: placa.trim(),
      },
    });

    if (existente) {
      return NextResponse.json(
        { error: "Ya existe un vehículo con esa placa" },
        { status: 409 }
      );
    }

    const vehiculo = await prisma.tb_VEHICULOS.create({
      data: {
        placa: placa.trim(),
        modelo: modelo.trim(),
        capacidad: capacidadNumero,
      },
    });

    return NextResponse.json(
      {
        message: "Vehículo registrado correctamente",
        vehiculo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar vehículo:", error);
    return NextResponse.json(
      { error: "Error interno al registrar el vehículo" },
      { status: 500 }
    );
  }
}