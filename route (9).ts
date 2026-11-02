import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const incidencias = await prisma.tb_INCIDENCIAS.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json({ success: true, incidencias });
  } catch (error: any) {
    console.error('Error al obtener incidencias:', error);
    return NextResponse.json({ success: false, error: 'Error al cargar' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { categoria, tipo, descripcion, conductorId, viajeId } = body;

    const categoriaFinal = categoria || tipo || 'General';
    const descripcionFinal = descripcion || 'Sin descripción proporcionada';

    const dataToCreate: any = {
      categoria: categoriaFinal,
      descripcion: descripcionFinal,
      estado: 'Pendiente'
    };

    const parsedViajeId = Number(viajeId);
    if (!isNaN(parsedViajeId) && parsedViajeId > 0) {
      // Buscamos el viaje y traemos su información (incluyendo el conductor asignado)
      const viajeExists = await prisma.tb_ASIGNACIONES.findUnique({ 
        where: { id: parsedViajeId } 
      });

      if (viajeExists) {
        dataToCreate.viajeId = parsedViajeId;
        
        // Si la asignación tiene un campo de conductor (puede llamarse conductorId, usuarioId, etc.)
        // Lo asignamos automáticamente a la incidencia
        const idConductorAsignado = (viajeExists as any).conductorId || (viajeExists as any).usuarioId;
        if (idConductorAsignado) {
          dataToCreate.conductorId = Number(idConductorAsignado);
        }
      }
    }

    // Si por alguna razón mandaron un conductorId directo desde el cliente
    const parsedConductorId = Number(conductorId);
    if (!dataToCreate.conductorId && !isNaN(parsedConductorId) && parsedConductorId > 0) {
      const userExists = await prisma.user.findUnique({ where: { id: parsedConductorId } });
      if (userExists) {
        dataToCreate.conductorId = parsedConductorId;
      }
    }

    const nuevaIncidencia = await prisma.tb_INCIDENCIAS.create({
      data: dataToCreate
    });

    return NextResponse.json({ success: true, incidencia: nuevaIncidencia });

  } catch (error: any) {
    console.error('Error detallado en API incidencias:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error al crear la incidencia' 
    }, { status: 500 });
  }
}