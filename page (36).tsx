"use client";

import { useEffect, useState } from "react";
import { syncQueue } from "@/lib/offline-queue";
import VolverDashboard from "@/components/VolverDashboard";
import MapComponent from "@/components/MapComponent"; // Asegúrate de tener tu componente de mapas aquí

interface Ruta {
  id: number;
  nombre: string;
}

interface ParadaOpcion {
  id: number;
  nombre: string;
  direccion: string;
  rutaId?: number;
}

interface Pasajero {
  id: number;
  nombre: string;
  email: string;
  estado?: "PENDIENTE" | "ABORDO" | "AUSENTE";
  parada?: {
    id: string;
    nombre: string;
    direccion: string;
    orden: number;
  } | null;
  ruta?: {
    nombre: string;
  } | null;
}

interface ParadaAgrupada {
  id: string;
  nombre: string;
  direccion: string;
  orden: number;
  pasajeros: Pasajero[];
}

export default function PasajerosPage() {
  const [paradas, setParadas] = useState<ParadaAgrupada[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [opcionesParadas, setOpcionesParadas] = useState<ParadaOpcion[]>([]);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rutaId, setRutaId] = useState("");
  const [paradaId, setParadaId] = useState("");

  const [seleccionParadas, setSeleccionParadas] = useState<
    Record<number, string>
  >({});

  const [loading, setLoading] = useState(true);
  const [registrando, setRegistrando] = useState(false);

  const [isOnline, setIsOnline] = useState(true);

  const [mensaje, setMensaje] = useState<string | null>(
    "Marcaciones sincronizadas."
  );

  const [mensajeRegistro, setMensajeRegistro] = useState("");

  const [seccionesAbiertas, setSeccionesAbiertas] = useState<
    Record<string, boolean>
  >({});

  const [totalLista, setTotalLista] = useState(0);
  const [totalAbordo, setTotalAbordo] = useState(0);
  const [totalAusentes, setTotalAusentes] = useState(0);

  // Estados para el Rastreo en Vivo del Mapa
  const [coordenadas, setCoordenadas] = useState({ lat: 13.6929, lng: -89.2182 }); // Coordenadas por defecto (San Salvador)

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setMensaje("Conexión restablecida. Sincronizando cola offline...");

      if (typeof syncQueue === "function") {
        syncQueue();
      }

      setTimeout(() => {
        setMensaje("Marcaciones sincronizadas.");
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setMensaje(
        "Sin internet, las marcaciones quedan guardadas localmente."
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    cargarTodo();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Efecto independiente para el Rastreo en Vivo (se actualiza cada 5 segundos según la ruta seleccionada o una por defecto)
  useEffect(() => {
    // Si hay una ruta seleccionada en el formulario usamos esa, de lo contrario usamos la ruta 1 por defecto para el mapa
    const idRutaActual = rutaId ? Number(rutaId) : 1;

    async function obtenerUbicacionEnVivo() {
      try {
        const response = await fetch(`/api/rutas/${idRutaActual}/ubicacion`);
        const data = await response.json();

        if (data.success && data.ruta) {
          if (data.ruta.latitud !== 0.0 && data.ruta.longitud !== 0.0) {
            setCoordenadas({
              lat: data.ruta.latitud,
              lng: data.ruta.longitud,
            });
          }
        }
      } catch (error) {
        console.error("Error al obtener rastreo en vivo:", error);
      }
    }

    obtenerUbicacionEnVivo();
    const intervalo = setInterval(obtenerUbicacionEnVivo, 5000);

    return () => clearInterval(intervalo);
  }, [rutaId]);

  async function cargarTodo() {
    await Promise.all([
      fetchPasajeros(),
      fetchRutas(),
      fetchParadas(),
    ]);
  }

  async function fetchRutas() {
    try {
      const res = await fetch("/api/rutas", {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();
      // Corrección aplicada para evitar "rutas.map is not a function"
      setRutas(Array.isArray(data) ? data : (data.rutas || []));
    } catch (error) {
      console.error("Error al cargar rutas:", error);
    }
  }

  async function fetchParadas() {
    try {
      const res = await fetch("/api/paradas", {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();
      setOpcionesParadas(Array.isArray(data) ? data : (data.paradas || []));
    } catch (error) {
      console.error("Error al cargar paradas:", error);
    }
  }

  async function fetchPasajeros() {
    try {
      const res = await fetch("/api/pasajeros", {
        cache: "no-store",
      });

      if (!res.ok) return;

      const rawData = await res.json();
      const data: Pasajero[] = Array.isArray(rawData) ? rawData : (rawData.pasajeros || []);

      setTotalLista(data.length);
      setTotalAbordo(
        data.filter((p) => p.estado === "ABORDO").length
      );
      setTotalAusentes(
        data.filter((p) => p.estado === "AUSENTE").length
      );

      const paradasMap: Record<string, ParadaAgrupada> = {};

      data.forEach((p) => {
        const idParada = p.parada?.id || "sin-parada";
        const nombreParada =
          p.parada?.nombre || "Parada General / Sin Asignar";
        const direccionParada =
          p.parada?.direccion || "Ubicación no especificada";
        const ordenParada = p.parada?.orden || 99;

        if (!paradasMap[idParada]) {
          paradasMap[idParada] = {
            id: idParada,
            nombre: nombreParada,
            direccion: direccionParada,
            orden: ordenParada,
            pasajeros: [],
          };
        }

        paradasMap[idParada].pasajeros.push(p);
      });

      const paradasArray = Object.values(paradasMap).sort(
        (a, b) => a.orden - b.orden
      );

      setParadas(paradasArray);

      setSeccionesAbiertas((prev) => {
        const nuevo = { ...prev };
        paradasArray.forEach((parada) => {
          if (nuevo[parada.id] === undefined) {
            nuevo[parada.id] = true;
          }
        });
        return nuevo;
      });
    } catch (error) {
      console.error("Error al cargar pasajeros:", error);
    } finally {
      setLoading(false);
    }
  }

  async function registrarPasajero(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setMensajeRegistro("");

    if (!nombre || !email || !rutaId || !paradaId) {
      setMensajeRegistro(
        "❌ Nombre, correo, ruta y parada son obligatorios."
      );
      return;
    }

    try {
      setRegistrando(true);

      const response = await fetch("/api/pasajeros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          rutaId: Number(rutaId),
          paradaId: Number(paradaId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensajeRegistro(
          "❌ " + (data.error || "Error al registrar pasajero")
        );
        return;
      }

      setMensajeRegistro("✅ Pasajero registrado correctamente.");
      setNombre("");
      setEmail("");
      setRutaId("");
      setParadaId("");

      await fetchPasajeros();
    } catch (error) {
      console.error(error);
      setMensajeRegistro("❌ Error al conectar con el servidor.");
    } finally {
      setRegistrando(false);
    }
  }

  async function cambiarEstado(
    pasajeroId: number,
    nuevoEstado: "ABORDO" | "AUSENTE"
  ) {
    try {
      const response = await fetch(
        `/api/pasajeros/${pasajeroId}/estado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: nuevoEstado,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      await fetchPasajeros();
    } catch (error) {
      console.error("Error al cambiar estado del pasajero:", error);
    }
  }

  async function asignarParada(pasajeroId: number) {
    const nuevaParadaId = seleccionParadas[pasajeroId];

    if (!nuevaParadaId) {
      alert("Selecciona una parada primero.");
      return;
    }

    try {
      const response = await fetch(
        `/api/pasajeros/${pasajeroId}/parada`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paradaId: Number(nuevaParadaId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al asignar parada");
        return;
      }

      setSeleccionParadas((prev) => ({
        ...prev,
        [pasajeroId]: "",
      }));

      await fetchPasajeros();
    } catch (error) {
      console.error("Error al asignar parada:", error);
      alert("Error al conectar con el servidor");
    }
  }

  const toggleSeccion = (id: string) => {
    setSeccionesAbiertas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const paradasFiltradas = opcionesParadas.filter((parada) => {
    if (!rutaId) return false;
    if (parada.rutaId === undefined) return true;
    return parada.rutaId === Number(rutaId);
  });

  return (
    <main className="min-h-screen bg-[#04080c] p-4 sm:p-8 text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <VolverDashboard />

        <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-2">
          <span>RF-007 · RF-008 · VIAJE ACTIVO</span>
          <div className="w-7 h-7 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center justify-center text-sm">
            🚌
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-black text-white">
            Lista de pasajeros
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Control de pasajeros y rastreo en tiempo real
          </p>
        </div>

        {/* Sección del Mapa con Rastreo en Vivo */}
        <div className="bg-[#071118] border border-emerald-900/40 rounded-3xl p-4 mb-6 shadow-xl">
          <h2 className="text-emerald-400 font-bold mb-3 text-sm">
            Rastreo de la unidad en vivo
          </h2>
          <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-slate-800">
            <MapComponent 
              lat={coordenadas.lat} 
              lng={coordenadas.lng} 
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            El mapa se actualiza automáticamente cada 5 segundos con la posición del conductor.
          </p>
        </div>

        <div className="bg-[#071118] border border-emerald-900/40 rounded-3xl p-5 mb-6">
          <h2 className="text-emerald-400 font-bold mb-5">
            Registrar pasajero
          </h2>

          <form onSubmit={registrarPasajero} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full bg-[#04080c] border border-slate-700 rounded-xl p-4 text-sm"
            />

            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#04080c] border border-slate-700 rounded-xl p-4 text-sm"
            />

            <select
              value={rutaId}
              onChange={(e) => {
                setRutaId(e.target.value);
                setParadaId("");
              }}
              required
              className="w-full bg-[#04080c] border border-slate-700 rounded-xl p-4 text-sm"
            >
              <option value="">Seleccione una ruta</option>
              {rutas.map((ruta) => (
                <option key={ruta.id} value={ruta.id}>
                  {ruta.nombre}
                </option>
              ))}
            </select>

            <select
              value={paradaId}
              onChange={(e) => setParadaId(e.target.value)}
              disabled={!rutaId}
              required
              className="w-full bg-[#04080c] border border-slate-700 rounded-xl p-4 text-sm disabled:opacity-50"
            >
              <option value="">
                {!rutaId
                  ? "Primero seleccione una ruta"
                  : "Seleccione una parada"}
              </option>
              {paradasFiltradas.map((parada) => (
                <option key={parada.id} value={parada.id}>
                  {parada.nombre} - {parada.direccion}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={registrando}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 text-slate-950 font-black py-4 rounded-xl transition"
            >
              {registrando ? "REGISTRANDO..." : "REGISTRAR PASAJERO"}
            </button>

            {mensajeRegistro && (
              <p className="text-center text-xs text-slate-300">
                {mensajeRegistro}
              </p>
            )}
          </form>
        </div>

        <div className="bg-[#071118] border border-emerald-900/40 rounded-3xl p-5 shadow-xl mb-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              {isOnline ? "En línea" : "Modo Offline"}
            </div>
            <span className="text-slate-400">
              {totalLista - totalAbordo - totalAusentes} pendientes
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="bg-[#04080c] border border-slate-800 rounded-2xl p-3 text-center">
              <div className="text-[10px] uppercase text-slate-400">
                Lista
              </div>
              <div className="text-xl font-black">{totalLista}</div>
            </div>

            <div className="bg-[#04080c] border border-slate-800 rounded-2xl p-3 text-center">
              <div className="text-[10px] uppercase text-teal-400">
                Abordo
              </div>
              <div className="text-xl font-black text-teal-300">
                {totalAbordo}
              </div>
            </div>

            <div className="bg-[#04080c] border border-slate-800 rounded-2xl p-3 text-center">
              <div className="text-[10px] uppercase text-rose-400">
                Ausentes
              </div>
              <div className="text-xl font-black text-rose-300">
                {totalAusentes}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mb-4 px-1">
          <span className="text-xs font-bold text-slate-300">
            Ordenado por paradas
          </span>
          <button
            onClick={fetchPasajeros}
            className="text-xs font-bold text-teal-400"
          >
            Sincronizar
          </button>
        </div>

        {mensaje && (
          <div className="mb-5 bg-[#071118] border border-slate-800 px-4 py-3 rounded-2xl text-xs">
            {mensaje}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-500">
            Cargando pasajeros...
          </div>
        ) : paradas.length === 0 ? (
          <div className="text-center py-12 bg-[#071118] border border-slate-800 rounded-3xl text-slate-400 text-xs">
            No hay pasajeros registrados.
          </div>
        ) : (
          <div className="space-y-4">
            {paradas.map((parada, index) => {
              const isOpen = seccionesAbiertas[parada.id];

              return (
                <div
                  key={parada.id}
                  className="bg-[#071118] border border-slate-800 rounded-3xl p-4"
                >
                  <div
                    className="flex justify-between cursor-pointer"
                    onClick={() => toggleSeccion(parada.id)}
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-950 border border-teal-500 text-teal-400 flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <h2 className="text-sm font-bold">
                          {parada.nombre}
                        </h2>
                        <p className="text-[11px] text-slate-400">
                          {parada.direccion}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {isOpen ? "Ocultar" : "Ver"}
                    </span>
                  </div>

                  {isOpen && (
                    <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                      {parada.pasajeros.map((pasajero) => (
                        <div
                          key={pasajero.id}
                          className="bg-[#04080c] border border-slate-800 rounded-2xl p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold">
                                {pasajero.nombre}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {pasajero.email}
                              </div>
                              {pasajero.ruta && (
                                <div className="text-[10px] text-emerald-400">
                                  {pasajero.ruta.nombre}
                                </div>
                              )}
                            </div>

                            {pasajero.estado === "ABORDO" ? (
                              <span className="text-teal-300 text-xs">
                                Abordado
                              </span>
                            ) : pasajero.estado === "AUSENTE" ? (
                              <span className="text-rose-300 text-xs">
                                Ausente
                              </span>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    cambiarEstado(pasajero.id, "ABORDO")
                                  }
                                  className="bg-teal-500 text-slate-950 px-3 py-2 rounded-xl text-xs font-bold"
                                >
                                  Abordar
                                </button>
                                <button
                                  onClick={() =>
                                    cambiarEstado(pasajero.id, "AUSENTE")
                                  }
                                  className="bg-rose-950 border border-rose-500 text-rose-300 px-3 py-2 rounded-xl text-xs font-bold"
                                >
                                  Ausente
                                </button>
                              </div>
                            )}
                          </div>

                          {!pasajero.parada && (
                            <div className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
                              <select
                                value={
                                  seleccionParadas[pasajero.id] || ""
                                }
                                onChange={(e) =>
                                  setSeleccionParadas((prev) => ({
                                    ...prev,
                                    [pasajero.id]: e.target.value,
                                  }))
                                }
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs"
                              >
                                <option value="">
                                  Seleccionar parada
                                </option>
                                {opcionesParadas.map((opcion) => (
                                  <option
                                    key={opcion.id}
                                    value={opcion.id}
                                  >
                                    {opcion.nombre}
                                  </option>
                                ))}
                              </select>

                              <button
                                onClick={() =>
                                  asignarParada(pasajero.id)
                                }
                                className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-xl text-xs font-bold"
                              >
                                Asignar
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}