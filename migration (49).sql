/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `conductor` on the `tb_ASIGNACIONES` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `tb_PASAJEROS` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rutaId,vehiculoId,conductorId,fecha]` on the table `tb_ASIGNACIONES` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `conductorId` to the `tb_ASIGNACIONES` table without a default value. This is not possible if the table is not empty.
  - Made the column `vehiculoId` on table `tb_RUTAS` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "tb_RUTAS" DROP CONSTRAINT "tb_RUTAS_vehiculoId_fkey";

-- DropIndex
DROP INDEX "tb_ASIGNACIONES_rutaId_vehiculoId_conductor_fecha_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "role";

-- AlterTable
ALTER TABLE "tb_ASIGNACIONES" DROP COLUMN "conductor",
ADD COLUMN     "conductorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tb_PASAJEROS" DROP COLUMN "estado";

-- AlterTable
ALTER TABLE "tb_RUTAS" ALTER COLUMN "vehiculoId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tb_ASIGNACIONES_rutaId_vehiculoId_conductorId_fecha_key" ON "tb_ASIGNACIONES"("rutaId", "vehiculoId", "conductorId", "fecha");

-- AddForeignKey
ALTER TABLE "tb_RUTAS" ADD CONSTRAINT "tb_RUTAS_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "tb_VEHICULOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_ASIGNACIONES" ADD CONSTRAINT "tb_ASIGNACIONES_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
