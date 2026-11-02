"use client";

import { useEffect, useState } from "react";
import VolverDashboard from "@/components/VolverDashboard";

type Conductor = {
  id: number;
  email: string;
};

type Asignacion = {
  id: number;
  ruta: {
    nombre: string;
  };
  vehiculo: {
    placa: string;
    modelo: string;
  };
  conductor: {
    id: number;
    email: string;
  };
};

type Incidencia = {
  id: number;
  categoria: string;
  descripcion: string;
  estado: string;
  observacionResolucion?: string | null;
  viajeId?: number | null;
  conductorId?: number | null;
  fecha: string;
};

export default function IncidenciasPage() {
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [viajeId, setViajeId] = useState("");
  const [conductorId, setConductorId] = useState("");

  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [comentarios, setComentarios] = useState<Record<number, string>>({});

  useEffect(() => {
    cargarTodo();
  }, []);

  async function cargarTodo() {
    await Promise.all([
      cargarIncidencias(),
      cargarAsignaciones(),
    ]);
  }

  async function cargarIncidencias() {
    try {
      const response = await fetch("/api/incidencias", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "No se pudieron cargar las incidencias.");
        return;
      }

      setIncidencias(data.incidencias || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar incidencias.");
    }
  }

  async function cargarAsignaciones() {
    try {
      const response = await fetch("/api/asignaciones", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError("No se pudieron cargar asignaciones.");
        return;
      }

      setAsignaciones(data.asignaciones || []);
      setConductores(data.conductores || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar asignaciones.");
    }
  }

  async function registrarIncidencia(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!categoria || !descripcion) {
      setError("Categoría y descripción son obligatorias.");
      return;
    }

    try {
      setGuardando(true);

      const response = await fetch("/api/incidencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoria,
          descripcion,
          viajeId: viajeId ? Number(viajeId) : null,
          conductorId: conductorId ? Number(conductorId) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "No se pudo registrar la incidencia.");
        return;
      }

      setMensaje("✅ Incidencia registrada correctamente.");

      setCategoria("");
      setDescripcion("");
      setViajeId("");
      setConductorId("");

      await cargarIncidencias();
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor.");
    } finally {
      setGuardando(false);
    }
  }

  async function actualizarIncidencia(
    incidenciaId: number,
    estado: string
  ) {
    try {
      setError("");
      setMensaje("");

      const comentario = comentarios[incidenciaId] || "";

      const response = await fetch(
        `/api/incidencias/${incidenciaId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado,
            comentario,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "No se pudo actualizar la incidencia.");
        return;
      }

      setMensaje("✅ Incidencia actualizada correctamente.");

      setComentarios((prev) => ({
        ...prev,
        [incidenciaId]: "",
      }));

      await cargarIncidencias();
    } catch (err) {
      console.error(err);
      setError("Error al actualizar la incidencia.");
    }
  }

  return (
    <main className="min-h-screen bg-[#04080c] text-slate-100 p-6 flex justify-center">
      <div className="w-full max-w-5xl">

        <VolverDashboard />

        <div className="mb-10">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-2">
            RF-009 · RF-011
          </p>

          <h1 className="text-4xl font-black text-white">
            Gestión de incidencias
          </h1>

          <p className="text-slate-400 mt-2">
            Registro y seguimiento de incidencias operativas del viaje.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* FORMULARIO */}
          <section className="bg-[#071118] border border-slate-800 rounded-3xl p-6">

            <h2 className="text-xl font-bold text-emerald-400 mb-6">
              Registrar incidencia
            </h2>

            <form
              onSubmit={registrarIncidencia}
              className="space-y-5"
            >

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">
                  CATEGORÍA
                </label>

                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4"
                >
                  <option value="">
                    Seleccione categoría
                  </option>

                  <option value="Vehiculo">
                    Vehículo
                  </option>

                  <option value="Ruta">
                    Ruta
                  </option>

                  <option value="Pasajero">
                    Pasajero
                  </option>

                  <option value="Seguridad">
                    Seguridad
                  </option>

                  <option value="Otro">
                    Otro
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">
                  DESCRIPCIÓN
                </label>

                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  rows={5}
                  placeholder="Describe la incidencia..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">
                  VIAJE / ASIGNACIÓN
                </label>

                <select
                  value={viajeId}
                  onChange={(e) => setViajeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4"
                >
                  <option value="">
                    Sin asignación
                  </option>

                  {asignaciones.map((asignacion) => (
                    <option
                      key={asignacion.id}
                      value={asignacion.id}
                    >
                      {asignacion.ruta.nombre} -{" "}
                      {asignacion.vehiculo.placa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">
                  CONDUCTOR
                </label>

                <select
                  value={conductorId}
                  onChange={(e) => setConductorId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4"
                >
                  <option value="">
                    Sin conductor
                  </option>

                  {conductores.map((conductor) => (
                    <option
                      key={conductor.id}
                      value={conductor.id}
                    >
                      {conductor.email}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={guardando}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 text-slate-950 font-black py-4 rounded-xl transition"
              >
                {guardando
                  ? "REGISTRANDO..."
                  : "REGISTRAR INCIDENCIA"}
              </button>

              {mensaje && (
                <p className="text-center text-sm text-emerald-400">
                  {mensaje}
                </p>
              )}

              {error && (
                <p className="text-center text-sm text-red-400">
                  ❌ {error}
                </p>
              )}

            </form>
          </section>

          {/* LISTADO */}
          <section className="bg-[#071118] border border-slate-800 rounded-3xl p-6">

            <h2 className="text-xl font-bold text-blue-400 mb-6">
              Incidencias registradas
            </h2>

            {incidencias.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No hay incidencias registradas.
              </p>
            ) : (
              <div className="space-y-5">

                {incidencias.map((incidencia) => (
                  <div
                    key={incidencia.id}
                    className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5"
                  >

                    <div className="flex items-center justify-between gap-4 mb-3">

                      <div>
                        <p className="font-bold text-white">
                          {incidencia.categoria}
                        </p>

                        <p className="text-xs text-slate-500">
                          ID #{incidencia.id}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          incidencia.estado === "Cerrada"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-950 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {incidencia.estado}
                      </span>

                    </div>

                    <p className="text-sm text-slate-300 mb-4">
                      {incidencia.descripcion}
                    </p>

                    {incidencia.observacionResolucion && (
                      <div className="mb-4 bg-slate-900 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">
                          Resolución
                        </p>

                        <p className="text-sm text-slate-300">
                          {incidencia.observacionResolucion}
                        </p>
                      </div>
                    )}

                    {incidencia.estado !== "Cerrada" && (
                      <div className="space-y-3">

                        <textarea
                          value={comentarios[incidencia.id] || ""}
                          onChange={(e) =>
                            setComentarios((prev) => ({
                              ...prev,
                              [incidencia.id]: e.target.value,
                            }))
                          }
                          placeholder="Comentario de resolución..."
                          rows={3}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm resize-none"
                        />

                        <button
                          onClick={() =>
                            actualizarIncidencia(
                              incidencia.id,
                              "Cerrada"
                            )
                          }
                          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-sm"
                        >
                          CERRAR INCIDENCIA
                        </button>

                      </div>
                    )}

                  </div>
                ))}

              </div>
            )}

          </section>

        </div>

      </div>
    </main>
  );
}