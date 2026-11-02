import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Definimos la conexión (igual que en tu prisma.config.ts)
const connectionString = "postgresql://postgres:Fernando2026@localhost:5432/nombre_db";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Instanciamos el cliente pasándole el adaptador
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Limpiando y poblando base de datos...");
  
  // Tu lógica de delete y create...
  await prisma.tb_RUTA_PARADAS.deleteMany({});
  await prisma.tb_RUTAS.deleteMany({});
  await prisma.tb_VEHICULOS.deleteMany({});

  const vehiculo = await prisma.tb_VEHICULOS.create({
    data: { placa: "P-123456", modelo: "Toyota Coaster", capacidad: 30 }
  });

  await prisma.tb_RUTAS.createMany({
    data: [
      { nombre: "Ruta Centro-Norte", vehiculoId: vehiculo.id, latitud: 13.68, longitud: -89.28 },
      { nombre: "Ruta Aeropuerto", vehiculoId: vehiculo.id, latitud: 13.43, longitud: -89.05 },
    ]
  });

  console.log("¡Base de datos poblada con éxito!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
  