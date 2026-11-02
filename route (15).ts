import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const inicio = searchParams.get("inicio");
    const fin = searchParams.get("fin");
    const ruta = searchParams.get("ruta");
    const rutaId = ruta ? Number(ruta) : null;

    // Filtros de fecha
    const filtroFecha: { gte?: Date; lt?: Date } = {};
    if (inicio) {
      filtroFecha.gte = new Date(`${inicio}T00:00:00`);
    }
    if (fin) {
      const fechaFin = new Date(`${fin}T00:00:00`);
      fechaFin.setDate(fechaFin.getDate() + 1);
      filtroFecha.lt = fechaFin;
    }

    // 1. Consultar viajes de la ruta seleccionada (o todos si no hay filtro)
    const viajes = await prisma.tb_ASIGNACIONES.findMany({
      where: {
        ...(inicio || fin ? { fecha: filtroFecha } : {}),
        ...(rutaId && !isNaN(rutaId) ? { rutaId: rutaId } : {}),
      },
      include: {
        ruta: true,
      },
    });

    const viajeIds = viajes.map((v) => v.id);

    // 2. Consultar incidencias vinculadas a los viajes de esas rutas o fechas
    const incidencias = await prisma.tb_INCIDENCIAS.findMany({
      where: {
        ...(inicio || fin ? { fecha: filtroFecha } : {}),
        ...(rutaId && !isNaN(rutaId) ? { viajeId: { in: viajeIds } } : {}),
      },
      include: {
        viaje: {
          include: {
            ruta: true,
          },
        },
      },
    });

    const totalViajes = viajes.length;
    const totalIncidencias = incidencias.length;

    // Categorías para las gráficas
    const categorias: Record<string, number> = {};
    incidencias.forEach((inc) => {
      const cat = inc.categoria || "Otro";
      categorias[cat] = (categorias[cat] || 0) + 1;
    });

    const incidenciasPorCategoria = Object.entries(categorias).map(
      ([categoria, total]) => ({ categoria, total })
    );

    // Estados (Cerradas / Pendientes)
    const estadosCerrados = ["Cerrada", "Resuelta", "Atendida", "Completada"];
    const cerradas = incidencias.filter(
      (inc) => inc.estado && estadosCerrados.includes(inc.estado.trim())
    ).length;
    const pendientes = totalIncidencias - cerradas;

    const estadoIncidencias = [
      { name: "Cerradas", value: cerradas },
      { name: "Pendientes", value: pendientes < 0 ? 0 : pendientes },
    ];

    const eficiencia = totalIncidencias === 0
      ? "100%"
      : `${Math.round((cerradas / totalIncidencias) * 100)}%`;

    return NextResponse.json({
      success: true,
      resultado: {
        totalViajes,
        totalIncidencias,
        eficiencia,
        incidenciasPorCategoria,
        estadoIncidencias,
      },
    });

  } catch (error) {
    console.error("Error en API de reportes:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al generar el reporte" },
      { status: 500 }
    );
  }
}