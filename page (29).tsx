"use client";

import {
  AlertTriangle,
  Bus,
  CheckCircle2,
  ClipboardCheck,
  Plus,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";

type Vehicle = {
  placa: string;
  capacidad: number;
  tipo: string;
  datosTecnicos: string;
  conductor: string;
  estado: "Disponible" | "Asignado";
  ruta: string;
};

type AlertState = {
  type: "success" | "error" | "info";
  message: string;
};

const initialVehicles: Vehicle[] = [
  {
    placa: "P-784521",
    capacidad: 15,
    tipo: "Microbus",
    datosTecnicos: "Hyundai County, A/C, revision vigente",
    conductor: "Pendiente",
    estado: "Disponible",
    ruta: "Sin asignar",
  },
  {
    placa: "MB-9021",
    capacidad: 28,
    tipo: "Bus",
    datosTecnicos: "Mercedes Benz, GPS activo",
    conductor: "Carlos Mendez",
    estado: "Asignado",
    ruta: "Ruta Norte - Call Center A",
  },
];

export default function VehiculosPage() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [technicalData, setTechnicalData] = useState("");
  const [driver, setDriver] = useState("");
  const [alert, setAlert] = useState<AlertState | null>(null);

  const availableVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.estado === "Disponible").length,
    [vehicles],
  );

  function handleRegisterVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedPlate = plate.trim().toUpperCase();
    const numericCapacity = Number(capacity);
    const hasDuplicatePlate = vehicles.some(
      (vehicle) => vehicle.placa.toUpperCase() === normalizedPlate,
    );

    if (hasDuplicatePlate) {
      setAlert({
        type: "error",
        message: `La placa ${normalizedPlate} ya existe. El proceso fue bloqueado.`,
      });
      return;
    }

    if (!Number.isFinite(numericCapacity) || numericCapacity <= 0) {
      setAlert({
        type: "error",
        message: "La capacidad de asientos debe ser mayor que cero.",
      });
      return;
    }

    const nextVehicle: Vehicle = {
      placa: normalizedPlate,
      capacidad: numericCapacity,
      tipo: vehicleType,
      datosTecnicos: technicalData.trim(),
      conductor: driver.trim() || "Pendiente",
      estado: "Disponible",
      ruta: "Sin asignar",
    };

    setVehicles((currentVehicles) => [nextVehicle, ...currentVehicles]);
    setAlert({
      type: "success",
      message: `Unidad ${normalizedPlate} registrada como Disponible.`,
    });
    setPlate("");
    setCapacity("");
    setVehicleType("");
    setTechnicalData("");
    setDriver("");
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              RF-005 - Version 2.0 (15/01/26)
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
              Registro de la flota operativa
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Modulo para Coordinador o Administrador: controla las unidades
              fisicas disponibles para prestar el servicio y su capacidad de
              asientos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            <StatusTile label="Unidades" value={vehicles.length.toString()} icon={<Bus size={20} />} />
            <StatusTile label="Disponibles" value={availableVehicles.toString()} icon={<CheckCircle2 size={20} />} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Panel
            title="Registrar unidad"
            subtitle="Datos tecnicos, placa y capacidad"
            icon={<ClipboardCheck size={22} />}
          >
            <form className="grid gap-5" onSubmit={handleRegisterVehicle}>
              <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950 dark:border-cyan-900/70 dark:bg-cyan-950/30 dark:text-cyan-100">
                <strong>Precondicion:</strong> usuario autenticado como
                Coordinador o Administrador.
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Placa" htmlFor="plate">
                  <input
                    id="plate"
                    name="plate"
                    required
                    placeholder="P-784521"
                    className="field-control uppercase"
                    value={plate}
                    onChange={(event) => setPlate(event.target.value)}
                  />
                </Field>

                <Field label="Capacidad de asientos" htmlFor="capacity">
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    required
                    placeholder="15"
                    className="field-control"
                    value={capacity}
                    onChange={(event) => setCapacity(event.target.value)}
                  />
                </Field>

                <Field label="Tipo de unidad" htmlFor="vehicle-type">
                  <select
                    id="vehicle-type"
                    name="vehicleType"
                    required
                    className="field-control"
                    value={vehicleType}
                    onChange={(event) => setVehicleType(event.target.value)}
                  >
                    <option value="" disabled>
                      Seleccionar
                    </option>
                    <option>Microbus</option>
                    <option>Bus</option>
                    <option>Panel</option>
                    <option>Van</option>
                  </select>
                </Field>
              </div>

              <Field label="Datos tecnicos" htmlFor="technical-data">
                <textarea
                  id="technical-data"
                  name="technicalData"
                  required
                  rows={4}
                  placeholder="Marca, modelo, GPS, revision mecanica, aire acondicionado"
                  className="field-control resize-none"
                  value={technicalData}
                  onChange={(event) => setTechnicalData(event.target.value)}
                />
              </Field>

              <Field label="Conductor asignado (opcional)" htmlFor="driver">
                <input
                  id="driver"
                  name="driver"
                  placeholder="Nombre del conductor"
                  className="field-control"
                  value={driver}
                  onChange={(event) => setDriver(event.target.value)}
                />
              </Field>

              <AlertBox type={alert?.type ?? "info"}>
                {alert?.message ??
                  "Al registrar una unidad valida, el sistema la deja como Disponible para asignacion de viajes."}
              </AlertBox>

              <button type="submit" className="primary-button w-full sm:w-fit">
                <Plus size={18} />
                Registrar unidad
              </button>
            </form>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Reglas del SRS" subtitle="RF-005 Flota operativa" icon={<ShieldCheck size={22} />}>
            <div className="space-y-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
              <Requirement
                label="Secuencia"
                text="Acceder a Vehiculos, seleccionar Registrar Unidad, ingresar datos tecnicos y capacidad."
              />
              <Requirement
                label="Estado inicial"
                text="Cada unidad nueva se registra automaticamente como Disponible."
              />
              <Requirement
                label="Postcondicion"
                text="El vehiculo aparece en la lista de recursos para asignacion de viajes."
              />
              <Requirement
                label="Excepcion"
                text="Si la placa ya existe, el sistema bloquea el proceso."
              />
            </div>
          </Panel>

          <Panel
            title="Recursos disponibles"
            subtitle="Lista para asignacion de viajes"
            icon={<Warehouse size={22} />}
          >
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <RecordCard key={vehicle.placa}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-950 dark:text-white">
                        {vehicle.placa}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {vehicle.tipo} - {vehicle.capacidad} asientos
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                      {vehicle.estado}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {vehicle.datosTecnicos}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {vehicle.ruta}
                    </span>
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">
                      {vehicle.conductor}
                    </span>
                  </div>
                </RecordCard>
              ))}
            </div>
          </Panel>

          <Link href="/dashboard/planificacion" className="secondary-button w-full">
            Volver a rutas
          </Link>
        </aside>
      </section>
    </main>
  );
}

function Panel({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-200">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor={htmlFor}>
      {label}
      {children}
    </label>
  );
}

function StatusTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
        <span className="text-sm font-semibold">{label}</span>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function Requirement({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="font-bold text-slate-950 dark:text-white">{label}</p>
      <p>{text}</p>
    </div>
  );
}

function RecordCard({ children }: { children: ReactNode }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      {children}
    </article>
  );
}

function AlertBox({ type, children }: { type: AlertState["type"]; children: ReactNode }) {
  const styles = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-100",
    error:
      "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-100",
    info: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100",
  };

  return (
    <div className={`flex flex-col gap-3 rounded-lg border p-4 text-sm sm:flex-row sm:items-center ${styles[type]}`}>
      <AlertTriangle className="shrink-0" size={20} />
      <p>{children}</p>
    </div>
  );
}
