"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Map,
  MapPin,
  Plus,
  Route,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";

type Stop = {
  id: number;
  address: string;
  latitude: string;
  longitude: string;
};

type RegisteredRoute = {
  nombre: string;
  origen: string;
  destino: string;
  paradas: number;
  estado: string;
};

const initialRoutes: RegisteredRoute[] = [
  {
    nombre: "Ruta Norte - Call Center A",
    origen: "Metrocentro, San Salvador",
    destino: "Call Center A",
    paradas: 3,
    estado: "Lista para asignar",
  },
  {
    nombre: "Ruta Santa Tecla - Turno Nocturno",
    origen: "Parque Daniel Hernandez",
    destino: "Centro de Operaciones",
    paradas: 4,
    estado: "En revision",
  },
];

const serviceCenter = {
  latitude: 13.6929,
  longitude: -89.2182,
};

function distanceKm(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number,
) {
  const earthRadiusKm = 6371;
  const latDelta = ((toLatitude - fromLatitude) * Math.PI) / 180;
  const lonDelta = ((toLongitude - fromLongitude) * Math.PI) / 180;
  const startLat = (fromLatitude * Math.PI) / 180;
  const endLat = (toLatitude * Math.PI) / 180;

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lonDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function validateStopGeolocation(stop: Stop, allowedRadius: number) {
  const latitude = Number(stop.latitude);
  const longitude = Number(stop.longitude);

  if (!stop.address.trim()) {
    return "Cada parada debe tener una direccion.";
  }

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return `La parada "${stop.address}" tiene geolocalizacion invalida.`;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return `La parada "${stop.address}" tiene coordenadas fuera de rango.`;
  }

  const distance = distanceKm(
    serviceCenter.latitude,
    serviceCenter.longitude,
    latitude,
    longitude,
  );

  if (distance > allowedRadius) {
    return `La parada "${stop.address}" esta fuera del radio de servicio (${distance.toFixed(
      1,
    )} km).`;
  }

  return null;
}

export default function PlanificacionPage() {
  const [registeredRoutes, setRegisteredRoutes] = useState(initialRoutes);
  const [routeName, setRouteName] = useState("");
  const [destination, setDestination] = useState("");
  const [origin, setOrigin] = useState("");
  const [schedule, setSchedule] = useState("");
  const [allowedRadius, setAllowedRadius] = useState("8");
  const [routeStatus, setRouteStatus] = useState("lista");
  const [vehicleSuggestion, setVehicleSuggestion] = useState("");
  const [stops, setStops] = useState<Stop[]>([
    {
      id: 1,
      address: "",
      latitude: "13.7000",
      longitude: "-89.2200",
    },
  ]);
  const [routeAlert, setRouteAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const readyRoutes = useMemo(
    () => registeredRoutes.filter((route) => route.estado === "Lista para asignar").length,
    [registeredRoutes],
  );

  function addStop() {
    setStops((currentStops) => [
      ...currentStops,
      {
        id: Date.now(),
        address: "",
        latitude: "",
        longitude: "",
      },
    ]);
  }

  function removeStop(id: number) {
    setStops((currentStops) =>
      currentStops.length === 1
        ? currentStops
        : currentStops.filter((stop) => stop.id !== id),
    );
  }

  function updateStop(id: number, field: keyof Stop, value: string) {
    setStops((currentStops) =>
      currentStops.map((stop) => (stop.id === id ? { ...stop, [field]: value } : stop)),
    );
  }

  function handleSaveRoute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!origin.trim()) {
      setRouteAlert({
        type: "error",
        message: "La ruta debe tener un punto de origen.",
      });
      return;
    }

    if (stops.length === 0 || stops.every((stop) => !stop.address.trim())) {
      setRouteAlert({
        type: "error",
        message: "La ruta debe incluir al menos una parada intermedia.",
      });
      return;
    }

    const radius = Number(allowedRadius);
    const invalidStop = stops
      .map((stop) => validateStopGeolocation(stop, radius))
      .find((message) => message !== null);

    if (invalidStop) {
      setRouteAlert({
        type: "error",
        message: invalidStop,
      });
      return;
    }

    const route: RegisteredRoute = {
      nombre: routeName,
      origen: origin,
      destino: destination,
      paradas: stops.length,
      estado: routeStatus === "lista" ? "Lista para asignar" : "En revision",
    };

    setRegisteredRoutes((currentRoutes) => [route, ...currentRoutes]);
    setRouteAlert({
      type: "success",
      message: "La ruta quedo registrada y lista para vincularse a un viaje.",
    });
    setRouteName("");
    setDestination("");
    setOrigin("");
    setSchedule("");
    setVehicleSuggestion("");
    setRouteStatus("lista");
    setStops([
      {
        id: Date.now(),
        address: "",
        latitude: "13.7000",
        longitude: "-89.2200",
      },
    ]);
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              RF-004 - Version 2.0 (15/01/26)
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
              Gestion de Rutas y Paradas
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Sub-modulo para Coordinador: define recorridos oficiales, origen
              y puntos de abordaje seguros para empleados en horario nocturno.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            <StatusTile label="Rutas" value={registeredRoutes.length.toString()} icon={<Route size={20} />} />
            <StatusTile label="Listas" value={readyRoutes.toString()} icon={<CheckCircle2 size={20} />} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Panel
            title="Crear nueva ruta"
            subtitle="Configuracion de trayectos logisticos y paradas seguras"
            icon={<MapPin size={22} />}
          >
            <form className="grid gap-5" onSubmit={handleSaveRoute}>
              <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950 dark:border-cyan-900/70 dark:bg-cyan-950/30 dark:text-cyan-100">
                <strong>Precondicion:</strong> usuario autenticado como
                Coordinador.
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nombre de la ruta" htmlFor="route-name">
                  <input
                    id="route-name"
                    name="routeName"
                    required
                    placeholder="Ruta Norte - Call Center A"
                    className="field-control"
                    value={routeName}
                    onChange={(event) => setRouteName(event.target.value)}
                  />
                </Field>

                <Field label="Sede destino" htmlFor="destination">
                  <select
                    id="destination"
                    name="destination"
                    required
                    className="field-control"
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                  >
                    <option value="" disabled>
                      Seleccionar sede
                    </option>
                    <option>Call Center A</option>
                    <option>Centro de Operaciones</option>
                    <option>Bodega Central</option>
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Punto de origen" htmlFor="origin">
                  <input
                    id="origin"
                    name="origin"
                    required
                    placeholder="Direccion o punto inicial"
                    className="field-control"
                    value={origin}
                    onChange={(event) => setOrigin(event.target.value)}
                  />
                </Field>

                <Field label="Horario de servicio" htmlFor="schedule">
                  <input
                    id="schedule"
                    name="schedule"
                    type="time"
                    required
                    className="field-control"
                    value={schedule}
                    onChange={(event) => setSchedule(event.target.value)}
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Radio permitido" htmlFor="radius">
                  <select
                    id="radius"
                    name="radius"
                    required
                    className="field-control"
                    value={allowedRadius}
                    onChange={(event) => setAllowedRadius(event.target.value)}
                  >
                    <option value="2">2 km</option>
                    <option value="3">3 km</option>
                    <option value="5">5 km</option>
                    <option value="8">8 km</option>
                    <option value="15">15 km</option>
                  </select>
                </Field>

                <Field label="Estado" htmlFor="route-status">
                  <select
                    id="route-status"
                    name="routeStatus"
                    required
                    className="field-control"
                    value={routeStatus}
                    onChange={(event) => setRouteStatus(event.target.value)}
                  >
                    <option value="validacion">En validacion</option>
                    <option value="lista">Lista para vincular</option>
                  </select>
                </Field>

                <Field label="Unidad sugerida" htmlFor="vehicle-suggestion">
                  <select
                    id="vehicle-suggestion"
                    name="vehicleSuggestion"
                    className="field-control"
                    value={vehicleSuggestion}
                    onChange={(event) => setVehicleSuggestion(event.target.value)}
                  >
                    <option value="">Asignar despues</option>
                    <option>P-784521</option>
                    <option>MB-9021</option>
                  </select>
                </Field>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                      Paradas intermedias seguras
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ingresa direccion o coordenadas tomadas desde mapa digital.
                    </p>
                  </div>
                  <button type="button" className="secondary-button" onClick={addStop}>
                    <Plus size={18} />
                    Agregar parada
                  </button>
                </div>

                {stops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900 md:grid-cols-[1.4fr_0.7fr_0.7fr_auto]"
                  >
                    <Field label={`Parada ${index + 1}`} htmlFor={`stop-address-${stop.id}`}>
                      <input
                        id={`stop-address-${stop.id}`}
                        className="field-control"
                        placeholder="Ej. Plaza Mundo Soyapango"
                        value={stop.address}
                        onChange={(event) => updateStop(stop.id, "address", event.target.value)}
                      />
                    </Field>

                    <Field label="Latitud" htmlFor={`stop-lat-${stop.id}`}>
                      <input
                        id={`stop-lat-${stop.id}`}
                        className="field-control"
                        inputMode="decimal"
                        placeholder="13.7000"
                        value={stop.latitude}
                        onChange={(event) => updateStop(stop.id, "latitude", event.target.value)}
                      />
                    </Field>

                    <Field label="Longitud" htmlFor={`stop-lng-${stop.id}`}>
                      <input
                        id={`stop-lng-${stop.id}`}
                        className="field-control"
                        inputMode="decimal"
                        placeholder="-89.2200"
                        value={stop.longitude}
                        onChange={(event) => updateStop(stop.id, "longitude", event.target.value)}
                      />
                    </Field>

                    <button
                      type="button"
                      className="mt-7 inline-flex size-10 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-900 dark:bg-slate-950 dark:text-rose-300"
                      onClick={() => removeStop(stop.id)}
                      disabled={stops.length === 1}
                      aria-label={`Eliminar parada ${index + 1}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
                  <Map size={18} />
                  Vista de mapa digital
                </div>
                <div className="relative h-48 overflow-hidden rounded-lg border border-slate-200 bg-[linear-gradient(90deg,#dbeafe_1px,transparent_1px),linear-gradient(#dbeafe_1px,transparent_1px)] bg-[size:28px_28px] dark:border-slate-700 dark:bg-[linear-gradient(90deg,#164e63_1px,transparent_1px),linear-gradient(#164e63_1px,transparent_1px)]">
                  <div className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-700 ring-8 ring-cyan-400/20" />
                  {stops.map((stop, index) => (
                    <div
                      key={`${stop.id}-pin`}
                      className="absolute rounded-full bg-emerald-600 px-2 py-1 text-xs font-bold text-white shadow"
                      style={{
                        left: `${18 + ((index * 19) % 65)}%`,
                        top: `${22 + ((index * 23) % 55)}%`,
                      }}
                    >
                      P{index + 1}
                    </div>
                  ))}
                </div>
              </div>

              <AlertBox type={routeAlert?.type ?? "info"}>
                {routeAlert?.message ??
                  "El sistema valida que exista origen, al menos una parada y coordenadas dentro del radio de servicio antes de guardar."}
              </AlertBox>

              <button type="submit" className="primary-button w-full sm:w-fit">
                <Save size={18} />
                Guardar configuracion
              </button>
            </form>
          </Panel>

        </div>

        <aside className="space-y-6">
          <Panel
            title="Reglas del SRS"
            subtitle="RF-004 Gestion de rutas y paradas"
            icon={<ShieldCheck size={22} />}
          >
            <div className="space-y-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
              <Requirement
                label="Precondicion"
                text="El usuario debe estar autenticado como Coordinador."
              />
              <Requirement
                label="Secuencia"
                text="Acceder a Rutas, crear nueva ruta, seleccionar sede, agregar paradas por direccion o mapa y guardar."
              />
              <Requirement
                label="Validacion"
                text="La ruta debe tener origen y al menos una parada con geolocalizacion valida."
              />
              <Requirement
                label="Postcondicion"
                text="La ruta queda registrada y lista para ser vinculada a un viaje."
              />
              <Requirement
                label="Excepcion"
                text="Si una parada esta fuera del radio de servicio, se muestra una alerta y no se guarda."
              />
            </div>
          </Panel>

          <Panel
            title="Rutas registradas"
            subtitle="Vista previa del coordinador"
            icon={<Route size={22} />}
          >
            <div className="space-y-3">
              {registeredRoutes.map((ruta) => (
                <RecordCard key={`${ruta.nombre}-${ruta.origen}`}>
                  <div>
                    <h3 className="font-semibold text-slate-950 dark:text-white">
                      {ruta.nombre}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {ruta.origen} {"->"} {ruta.destino}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">
                      {ruta.paradas} paradas
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                      {ruta.estado}
                    </span>
                  </div>
                </RecordCard>
              ))}
            </div>
          </Panel>

          <Panel
            title="Modulo de vehiculos"
            subtitle="RF-005 en pantalla separada"
            icon={<ShieldCheck size={22} />}
          >
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              El registro de flota operativa se gestiona desde el modulo
              independiente de Vehiculos, para mantener RF-004 y RF-005 en
              pantallas separadas.
            </p>
            <Link href="/dashboard/vehiculos" className="secondary-button mt-4 w-full">
              Abrir vehiculos
            </Link>
          </Panel>
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
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between text-cyan-700 dark:text-cyan-300">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function Requirement({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-l-4 border-cyan-600 pl-4 dark:border-cyan-300">
      <h3 className="font-bold text-slate-950 dark:text-white">{label}</h3>
      <p>{text}</p>
    </div>
  );
}

function RecordCard({ children }: { children: ReactNode }) {
  return (
    <article className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      {children}
    </article>
  );
}

function AlertBox({
  type,
  children,
}: {
  type: "info" | "error" | "success";
  children: ReactNode;
}) {
  const styles = {
    info: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100",
    error: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-100",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-100",
  };

  return (
    <div className={`flex flex-col gap-3 rounded-lg border p-4 text-sm sm:flex-row sm:items-center ${styles[type]}`}>
      {type === "success" ? (
        <CheckCircle2 className="shrink-0" size={20} />
      ) : (
        <AlertTriangle className="shrink-0" size={20} />
      )}
      <p>{children}</p>
    </div>
  );
}
