/*
  Warnings:

  - You are about to drop the column `conductorId` on the `tb_ASIGNACIONES` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rutaId,vehiculoId,conductor,fecha]` on the table `tb_ASIGNACIONES` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `conductor` to the `tb_ASIGNACIONES` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_ASIGNACIONES" DROP CONSTRAINT "tb_ASIGNACIONES_conductorId_fkey";

-- DropForeignKey
ALTER TABLE "tb_RUTAS" DROP CONSTRAINT "tb_RUTAS_vehiculoId_fkey";

-- DropIndex
DROP INDEX "tb_ASIGNACIONES_rutaId_vehiculoId_conductorId_fecha_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'pasajero';

-- AlterTable
ALTER TABLE "tb_ASIGNACIONES" DROP COLUMN "conductorId",
ADD COLUMN     "conductor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tb_PASAJEROS" ADD COLUMN     "estado" TEXT DEFAULT 'PENDIENTE',
ADD COLUMN     "paradaId" INTEGER;

-- AlterTable
ALTER TABLE "tb_RUTAS" ALTER COLUMN "vehiculoId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tb_ASIGNACIONES_rutaId_vehiculoId_conductor_fecha_key" ON "tb_ASIGNACIONES"("rutaId", "vehiculoId", "conductor", "fecha");

-- AddForeignKey
ALTER TABLE "tb_RUTAS" ADD CONSTRAINT "tb_RUTAS_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "tb_VEHICULOS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_PASAJEROS" ADD CONSTRAINT "tb_PASAJEROS_paradaId_fkey" FOREIGN KEY ("paradaId") REFERENCES "tb_PARADAS"("id") ON DELETE SET NULL ON UPDATE CASCADE;
