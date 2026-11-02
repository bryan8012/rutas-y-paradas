import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. Método GET para listar las rutas
export async function GET() {
  try {
    const rutas = await prisma.tb_RUTAS.findMany({
      include: { vehiculo: true },
      orderBy: { id: 'desc' }
    });
    return NextResponse.json({ success: true, rutas });
  } catch (error: any) {
    console.error('Error al obtener rutas:', error);
    return NextResponse.json({ success: false, error: 'Error al cargar rutas' }, { status: 500 });
  }
}

// 2. Método POST para crear la ruta correctamente conectando el vehículo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, vehiculoId } = body;

    if (!nombre) {
      return NextResponse.json({ success: false, error: 'El nombre de la ruta es obligatorio' }, { status: 400 });
    }

    // Preparamos los datos base obligatorios
    const dataToCreate: any = {
      nombre,
    };

    // Si envían un vehículo desde el formulario, lo conectamos
    if (vehiculoId) {
      dataToCreate.vehiculo = {
        connect: { id: Number(vehiculoId) }
      };
    }

    const nuevaRuta = await prisma.tb_RUTAS.create({
      data: dataToCreate
    });

    return NextResponse.json({ success: true, ruta: nuevaRuta });
  } catch (error: any) {
    console.error('Error al crear ruta:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error al crear ruta' 
    }, { status: 500 });
  }
}