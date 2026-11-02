-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_VEHICULOS" (
    "id" SERIAL NOT NULL,
    "placa" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "capacidad" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "tb_VEHICULOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_RUTAS" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "vehiculoId" INTEGER NOT NULL,

    CONSTRAINT "tb_RUTAS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_PARADAS" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,

    CONSTRAINT "tb_PARADAS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_RUTA_PARADAS" (
    "id" SERIAL NOT NULL,
    "rutaId" INTEGER NOT NULL,
    "paradaId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "tb_RUTA_PARADAS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_VEHICULOS_placa_key" ON "tb_VEHICULOS"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "tb_RUTA_PARADAS_rutaId_paradaId_key" ON "tb_RUTA_PARADAS"("rutaId", "paradaId");

-- AddForeignKey
ALTER TABLE "tb_RUTAS" ADD CONSTRAINT "tb_RUTAS_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "tb_VEHICULOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_RUTA_PARADAS" ADD CONSTRAINT "tb_RUTA_PARADAS_rutaId_fkey" FOREIGN KEY ("rutaId") REFERENCES "tb_RUTAS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_RUTA_PARADAS" ADD CONSTRAINT "tb_RUTA_PARADAS_paradaId_fkey" FOREIGN KEY ("paradaId") REFERENCES "tb_PARADAS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
