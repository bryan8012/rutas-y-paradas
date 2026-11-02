import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const rutas = await prisma.tb_RUTAS.findMany({
    include: {
      vehiculo: true,
      passengers: true,
    },
  });

  const accesos = [
    { label: "Registrar Usuario", href: "/register" },
    { label: "Vehículos", href: "/vehiculos" }, // 👈 Movido aquí antes de Rutas
    { label: "Rutas", href: "/rutas" },             // 👈 Movido aquí después de Vehículos
    { label: "Asignaciones", href: "/asignacion" },
    { label: "Pasajeros", href: "/pasajeros" },
    { label: "Check-in", href: "/check-in" },
  ];

  const portales = [
    {
      titulo: "Portal Conductor",
      codigo: "RF-009",
      descripcion: "Reporta incidencias operativas durante el recorrido.",
      href: "/conductor",
      acento: "emerald",
    },
    {
      titulo: "Panel Coordinador",
      codigo: "RF-011",
      descripcion: "Gestiona, resuelve y da seguimiento a incidencias.",
      href: "/coordinador",
      acento: "blue",
    },
    {
      titulo: "Reportes",
      codigo: "ANÁLISIS",
      descripcion: "Visualiza métricas, incidencias y rendimiento operativo.",
      href: "/reportes",
      acento: "amber",
    },
  ];

  return (
    <main
      className="
        min-h-screen
        bg-[#f4f7f6]
        px-3 py-4
        text-slate-900
        transition-colors duration-300
        dark:bg-[#02070a]
        dark:text-slate-100
        sm:px-8 sm:py-8 lg:px-12
      "
    >
      <div className="mx-auto w-full max-w-[1500px] space-y-6 sm:space-y-8">

        {/* HERO */}
        <section
          className="
            relative overflow-hidden
            rounded-3xl sm:rounded-[36px]
            border border-slate-200
            bg-white
            px-5 py-6 sm:px-10 sm:py-10
            shadow-[0_20px_60px_rgba(15,23,42,0.08)]
            dark:border-slate-800/80
            dark:bg-[#071118]
            dark:shadow-[0_20px_80px_rgba(0,0,0,0.45)]
          "
        >
          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 sm:mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
              <span
                className="
                  rounded-full
                  border border-emerald-200
                  bg-emerald-50
                  px-3 py-1.5 sm:px-4 sm:py-2
                  text-[10px] sm:text-xs font-black uppercase tracking-[0.22em]
                  text-emerald-700
                  dark:border-emerald-900/60
                  dark:bg-emerald-950/40
                  dark:text-emerald-400
                "
              >
                TransExpress SmartRoute
              </span>

              <span
                className="
                  rounded-full
                  border border-slate-200
                  bg-slate-50
                  px-3 py-1.5 sm:px-4 sm:py-2
                  text-[10px] sm:text-xs font-bold
                  text-slate-500
                  dark:border-slate-800
                  dark:bg-slate-900/70
                  dark:text-slate-400
                "
              >
                Operación en tiempo real
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
              <div>
                <h1
                  className="
                    max-w-5xl
                    text-3xl sm:text-5xl lg:text-7xl
                    font-black
                    leading-[1.05] sm:leading-[1.02]
                    tracking-[-0.04em]
                    text-slate-950
                    dark:text-white
                  "
                >
                  Gestión operativa
                  <span className="block text-emerald-600 dark:text-emerald-400">
                    inteligente y centralizada
                  </span>
                </h1>

                <p
                  className="
                    mt-4 sm:mt-7 max-w-3xl
                    text-sm sm:text-lg leading-6 sm:leading-8
                    text-slate-600
                    dark:text-slate-400
                  "
                >
                  Administra rutas, vehículos, pasajeros, asignaciones,
                  incidencias y reportes desde una sola plataforma operativa.
                </p>
              </div>

              <div
                className="
                  rounded-2xl sm:rounded-3xl
                  border border-slate-200
                  bg-slate-50
                  p-4 sm:p-6
                  dark:border-slate-800
                  dark:bg-slate-950/50
                "
              >
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">
                  Estado del sistema
                </p>

                <div className="mt-3 sm:mt-4 flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.65)] animate-pulse" />
                  <div>
                    <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      Operativo
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Todos los módulos disponibles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACCESOS PRINCIPALES */}
        <section>
          <div className="mb-3 sm:mb-5">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Navegación
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
              Accesos principales
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {accesos.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group rounded-2xl
                  border p-4 sm:p-5
                  transition-all duration-300
                  active:scale-95
                  hover:-translate-y-1
                  flex flex-col justify-between
                  ${
                    index === 0
                      ? `
                          border-emerald-500
                          bg-emerald-500
                          text-slate-950
                          shadow-[0_12px_30px_rgba(16,185,129,0.22)]
                        `
                      : `
                          border-slate-200
                          bg-white
                          text-slate-700
                          shadow-sm
                          hover:border-emerald-300
                          hover:shadow-lg
                          dark:border-slate-800
                          dark:bg-[#071118]
                          dark:text-slate-300
                          dark:hover:border-emerald-600
                        `
                  }
                `}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-xs sm:text-sm">
                    {item.label}
                  </span>
                  <span className="text-base sm:text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PORTALES OPERATIVOS */}
        <section>
          <div>
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Operación especializada
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
              Portales operativos
            </h2>
          </div>

          <div className="mt-4 sm:mt-5 grid gap-3 sm:gap-5 md:grid-cols-3">
            {portales.map((portal) => (
              <Link
                key={portal.href}
                href={portal.href}
                className="
                  group relative overflow-hidden
                  rounded-2xl sm:rounded-3xl
                  border border-slate-200
                  bg-white
                  p-5 sm:p-7
                  shadow-sm
                  transition-all duration-300
                  active:scale-95
                  hover:-translate-y-1
                  hover:shadow-xl
                  dark:border-slate-800
                  dark:bg-[#071118]
                "
              >
                <div
                  className={`
                    absolute left-0 top-0 h-full w-1
                    ${
                      portal.acento === "emerald"
                        ? "bg-emerald-500"
                        : portal.acento === "blue"
                        ? "bg-blue-500"
                        : "bg-amber-500"
                    }
                  `}
                />

                <p
                  className={`
                    text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]
                    ${
                      portal.acento === "emerald"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : portal.acento === "blue"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  `}
                >
                  {portal.codigo}
                </p>

                <h3 className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                  {portal.titulo}
                </h3>

                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-500 dark:text-slate-400">
                  {portal.descripcion}
                </p>

                <div className="mt-4 sm:mt-6 text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Abrir módulo
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* MONITOREO DE RUTAS (Adaptable: Tarjetas en móvil / Tabla en PC) */}
        <section>
          <div className="mb-3 sm:mb-5">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Monitoreo
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
              Estado de rutas
            </h2>
          </div>

          {rutas.length === 0 ? (
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-[#071118]">
              No hay rutas registradas.
            </div>
          ) : (
            <>
              {/* Vista Móvil: Tarjetas apiladas verticales */}
              <div className="grid gap-3 sm:hidden">
                {rutas.map((ruta) => {
                  const ocupacion = ruta.passengers.length;
                  const capacidad = ruta.vehiculo?.capacidad ?? 0;
                  const esLleno = capacidad > 0 && ocupacion >= capacidad;

                  return (
                    <div
                      key={ruta.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 dark:border-slate-800 dark:bg-[#071118]"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800/60">
                        <div>
                          <div className="font-black text-sm text-slate-900 dark:text-white">
                            {ruta.nombre}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            ID #{ruta.id}
                          </div>
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${
                            esLleno
                              ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
                          }`}
                        >
                          {esLleno ? "LLENO" : "DISPONIBLE"}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400">Vehículo:</span>{" "}
                        {ruta.vehiculo
                          ? `${ruta.vehiculo.placa} - ${ruta.vehiculo.modelo}`
                          : "Sin vehículo"}
                      </div>

                      <div className="flex justify-between text-xs font-bold pt-1 border-t border-slate-100 dark:border-slate-800/40">
                        <span>Capacidad: <span className="text-slate-900 dark:text-white">{capacidad}</span></span>
                        <span>Pasajeros: <span className="text-emerald-600 dark:text-emerald-400">{ocupacion}</span></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Vista Escritorio: Tabla clásica */}
              <div
                className="
                  hidden sm:block
                  overflow-hidden rounded-3xl
                  border border-slate-200
                  bg-white
                  shadow-sm
                  dark:border-slate-800
                  dark:bg-[#071118]
                "
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr
                        className="
                          border-b border-slate-200
                          bg-slate-50
                          text-xs uppercase tracking-wider
                          text-slate-500
                          dark:border-slate-800
                          dark:bg-slate-950/40
                          dark:text-slate-400
                        "
                      >
                        <th className="px-6 py-5">Ruta</th>
                        <th className="px-6 py-5">Vehículo</th>
                        <th className="px-6 py-5">Capacidad</th>
                        <th className="px-6 py-5">Pasajeros</th>
                        <th className="px-6 py-5">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rutas.map((ruta) => {
                        const ocupacion = ruta.passengers.length;
                        const capacidad = ruta.vehiculo?.capacidad ?? 0;
                        const esLleno = capacidad > 0 && ocupacion >= capacidad;

                        return (
                          <tr
                            key={ruta.id}
                            className="
                              border-b border-slate-100
                              transition
                              last:border-b-0
                              hover:bg-slate-50
                              dark:border-slate-800/70
                              dark:hover:bg-slate-900/40
                            "
                          >
                            <td className="px-6 py-5">
                              <div className="font-black text-slate-900 dark:text-white">
                                {ruta.nombre}
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                ID #{ruta.id}
                              </div>
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                              {ruta.vehiculo
                                ? `${ruta.vehiculo.placa} - ${ruta.vehiculo.modelo}`
                                : "Sin vehículo"}
                            </td>

                            <td className="px-6 py-5 font-bold">{capacidad}</td>
                            <td className="px-6 py-5 font-bold">{ocupacion}</td>

                            <td className="px-6 py-5">
                              <span
                                className={`
                                  inline-flex rounded-full
                                  border px-3 py-1.5
                                  text-xs font-black
                                  ${
                                    esLleno
                                      ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400"
                                      : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  }
                                `}
                              >
                                {esLleno ? "LLENO" : "DISPONIBLE"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>

        {/* FOOTER */}
        <footer
          className="
            mt-10
            flex flex-col gap-2
            border-t border-slate-200
            py-7
            text-sm text-slate-500
            dark:border-slate-800
            dark:text-slate-500
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          <span>TransExpress SmartRoute</span>
          <span>Sistema de Gestión Operativa</span>
        </footer>

      </div>
    </main>
  );
}