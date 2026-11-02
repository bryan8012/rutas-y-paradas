'use server'

import { PrismaClient } from '../generated/prisma'; 
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createVehiculo(formData: FormData) {
  const placa = formData.get('placa') as string;
  const modelo = formData.get('modelo') as string;
  const capacidad = parseFloat(formData.get('capacidad') as string);

  try {
    await prisma.tb_VEHICULOS.create({
      data: {
        placa,
        modelo,
        capacidad,
      },
    });
    // Esto refresca la página para que veas el cambio inmediatamente
    revalidatePath('/vehiculos'); 
  } catch (error) {
    console.error("Error al crear el vehículo:", error);
    throw new Error("No se pudo guardar el vehículo.");
  }
}