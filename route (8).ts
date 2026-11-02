import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ajusta la ruta a tu cliente de prisma si es diferente

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Desempaquetar los parámetros dinámicos (requisito de Next.js)
    const { id } = await context.params;

    // 2. Leer el cuerpo de la petición de forma segura
    const body = await request.json().catch(() => ({}));
    const { estado, comentario } = body;

    const dataToUpdate: any = {};
    if (estado) dataToUpdate.estado = estado;
    
    // 3. Usar el nombre de columna correcto en tu base de datos
    if (comentario !== undefined && comentario.trim() !== '') {
      dataToUpdate.observacionResolucion = comentario;
    }

    // 4. Actualizar en Prisma
    const incidenciaActualizada = await prisma.tb_INCIDENCIAS.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, incidencia: incidenciaActualizada });
  } catch (error: any) {
    console.error('Error al actualizar incidencia:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}