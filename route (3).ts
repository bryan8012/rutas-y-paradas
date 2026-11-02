import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Importamos desde tu archivo de configuración

export async function GET() {
  try {
    const rutas = await prisma.tb_RUTAS.findMany({
      include: {
        vehiculo: true,
      }
    });

    return NextResponse.json(rutas, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las rutas:", error);
    return NextResponse.json(
      { error: "Error al obtener las rutas" }, 
      { status: 500 }
    );
  }
}