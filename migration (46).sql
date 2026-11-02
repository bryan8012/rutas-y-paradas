CREATE TYPE "EstadoAbordaje" AS ENUM ('ABORDADO', 'AUSENTE');

CREATE TABLE "tb_EVENTOS_ABORDAJE" (
    "id" SERIAL NOT NULL,
    "clientEventId" TEXT NOT NULL,
    "pasajeroId" INTEGER NOT NULL,
    "pasajeroNombre" TEXT NOT NULL,
    "estado" "EstadoAbordaje" NOT NULL,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "registradoEn" TIMESTAMP(3) NOT NULL,
    "sincronizadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_EVENTOS_ABORDAJE_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tb_EVENTOS_ABORDAJE_clientEventId_key" ON "tb_EVENTOS_ABORDAJE"("clientEventId");
