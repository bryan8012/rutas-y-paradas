import { PrismaClient } from '../generated/prisma';

// Instanciamos el cliente
const prisma = new PrismaClient();

/**
 * Servicio para el manejo de Rutas (RF-004)
 */
export const RouteService = {
  // Crear una nueva ruta
  async createRoute(data: { name: string; origin: string; destination: string }) {
    return await prisma.route.create({
      data: {
        name: data.name,
        origin: data.origin,
        destination: data.destination,
      },
    });
  },

  // Listar todas las rutas
  async getAllRoutes() {
    return await prisma.route.findMany();
  },

  // Obtener una ruta por ID
  async getRouteById(id: string) {
    return await prisma.route.findUnique({
      where: { id },
    });
  }
};