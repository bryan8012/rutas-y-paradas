"use server";

import { prisma } from "../../../src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function crearAsignacion(prevState: any, formData: FormData) {
  const rutaId = Number(formData.get("rutaId"));
  const vehiculoId = Number(formData.get("vehiculoId"));
  const conductorId = Number(formData.get("conductorId"));

  try {
    await prisma.tb_ASIGNACIONES.create({
      data: {
        rutaId,
        vehiculoId,
        conductorId,
      },
    });

    revalidatePath("/dashboard/asignacion");
    return { success: true, error: null }; // Retorno esperado por el formulario
  } catch (error) {
    console.error("Error al crear asignación:", error);
    return { success: false, error: "No se pudo crear la asignación. Verifique si ya existe." };
  }
}