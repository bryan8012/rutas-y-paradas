'use server'

import { prisma } from './src/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createVehiculo(formData: FormData) {
  try {
    // ... tu lógica de creación
    return { success: true };
  } catch (error: any) {
    // ESTA LÍNEA ES CLAVE: Necesitamos ver el error real en la terminal
    console.error("--- ERROR EN SERVER ACTION ---");
    console.error(error.message); 
    console.error(error.stack);
    return { success: false, message: error.message };
  }
}