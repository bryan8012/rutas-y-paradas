"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function CoordinadorPage() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [comentarios, setComentarios] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    cargarIncidencias();
  }, []);

  async function cargarIncidencias() {
    try {
      setLoading(true);
      setError("");

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
      setError("Error al cargar las incidencias.");
    } finally {
      setLoading(false);
    }
  }

  async function cerrarIncidencia(incidenciaId: number) {
    const comentario = comentarios[incidenciaId] || "";

    if (!comentario.trim()) {
      setError("Escribe una observación de resolución antes de cerrar.");
      return;
    }

    try {
      setMensaje("");
      setError("");

      const response = await fetch(
        `/api/incidencias/${incidenciaId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: "Cerrada",
            comentario: comentario.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "No se pudo cerrar la incidencia.");
        return;
      }

      setMensaje("✅ Incidencia cerrada correctamente.");

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

  const pendientes = incidencias.filter(
    (incidencia) => incidencia.estado !== "Cerrada"
  );

  const cerradas = incidencias.filter(
    (incidencia) => incidencia.estado === "Cerrada"
  );

  return (
    <div className="min-h-screen bg-[#04080c] flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-5xl bg-[#0a161d] border border-slate-800/80 p-8 sm:p-12 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">

        {/* REGRESAR */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-[#00ff66] px-5 py-3 font-black text-slate-950 shadow-[0_0_25px_rgba(0,255,102,0.3)] transition hover:bg-[#00e65c] text-sm"
          >
            ← Regresar al Dashboard
          </Link>
        </div>

        {/* ENCABEZADO */}
        <div className="mb-8">
          <p className="text-[#00ff66] text-xs font-black uppercase tracking-[0.3em] mb-2">
            RF-011 · GESTIÓN OPERATIVA
          </p>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Panel Coordinador
          </h1>

          <p className="text-slate-400 text-sm mt-2">
            Gestión, seguimiento y cierre de incidencias pendientes con observaciones de resolución.
          </p>
        </div>

        {mensaje && (
          <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-sm rounded-2xl">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 text-red-400 text-sm rounded-2xl">
            ❌ {error}
          </div>
        )}

        {/* INCIDENCIAS PENDIENTES */}
        <div className="bg-[#071016] border border-slate-800 p-6 rounded-3xl mb-8">

          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                Incidencias Pendientes en Ruta
              </h2>

              <p className="text-xs text-slate-400 mt-2">
                Reportes emitidos por los conductores pendientes de resolución.
              </p>
            </div>

            <button
              onClick={cargarIncidencias}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              Actualizar
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-500">
              Cargando incidencias...
            </div>
          ) : pendientes.length === 0 ? (
            <div className="border border-slate-800/80 rounded-2xl p-6 text-center bg-[#0a161d]">
              <p className="text-sm text-slate-400">
                No hay incidencias pendientes de resolución.
              </p>
            </div>
          ) : (
            <div className="space-y-5">

              {pendientes.map((incidencia) => (
                <div
                  key={incidencia.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5"
                >

                  <div className="flex items-start justify-between gap-4 mb-4">

                    <div>
                      <p className="text-xs text-emerald-400 font-black uppercase tracking-wider mb-1">
                        {incidencia.categoria}
                      </p>

                      <h3 className="text-lg font-bold text-white">
                        Incidencia #{incidencia.id}
                      </h3>
                    </div>

                    <span className="bg-amber-950 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                      {incidencia.estado}
                    </span>

                  </div>

                  <p className="text-slate-300 text-sm mb-5 leading-relaxed">
                    {incidencia.descripcion}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-xs">

                    <div className="bg-[#071016] border border-slate-800 rounded-xl p-3">
                      <span className="text-slate-500">
                        Viaje ID:
                      </span>{" "}
                      <span className="text-white font-bold">
                        {incidencia.viajeId ?? "Sin asignación"}
                      </span>
                    </div>

                    <div className="bg-[#071016] border border-slate-800 rounded-xl p-3">
                      <span className="text-slate-500">
                        Conductor ID:
                      </span>{" "}
                      <span className="text-white font-bold">
                        {incidencia.conductorId ?? "Sin conductor"}
                      </span>
                    </div>

                  </div>

                  <textarea
                    value={comentarios[incidencia.id] || ""}
                    onChange={(e) =>
                      setComentarios((prev) => ({
                        ...prev,
                        [incidencia.id]: e.target.value,
                      }))
                    }
                    placeholder="Observación de resolución..."
                    rows={4}
                    className="w-full bg-[#071016] border border-slate-700 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-blue-500 mb-4"
                  />

                  <button
                    onClick={() =>
                      cerrarIncidencia(incidencia.id)
                    }
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition"
                  >
                    CERRAR INCIDENCIA
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* RESUMEN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          <div className="bg-[#071016]/50 border border-slate-800/60 p-6 rounded-3xl">
            <p className="text-xs text-slate-500 uppercase font-bold mb-2">
              Total reportes
            </p>

            <p className="text-3xl font-black text-white">
              {incidencias.length}
            </p>
          </div>

          <div className="bg-[#071016]/50 border border-slate-800/60 p-6 rounded-3xl">
            <p className="text-xs text-slate-500 uppercase font-bold mb-2">
              Pendientes
            </p>

            <p className="text-3xl font-black text-amber-400">
              {pendientes.length}
            </p>
          </div>

          <div className="bg-[#071016]/50 border border-slate-800/60 p-6 rounded-3xl">
            <p className="text-xs text-slate-500 uppercase font-bold mb-2">
              Cerradas
            </p>

            <p className="text-3xl font-black text-emerald-400">
              {cerradas.length}
            </p>
          </div>

        </div>

        {/* BITÁCORA */}
        <div className="bg-[#071016] border border-slate-800 p-6 rounded-3xl">

          <h2 className="text-xl font-bold text-white mb-6">
            Bitácora de Cierres
          </h2>

          {cerradas.length === 0 ? (
            <p className="text-sm text-slate-500">
              Todavía no hay incidencias cerradas.
            </p>
          ) : (
            <div className="space-y-4">

              {cerradas.map((incidencia) => (
                <div
                  key={incidencia.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5"
                >

                  <div className="flex items-center justify-between gap-4 mb-3">

                    <div>
                      <p className="font-bold text-white">
                        {incidencia.categoria}
                      </p>

                      <p className="text-xs text-slate-500">
                        Incidencia #{incidencia.id}
                      </p>
                    </div>

                    <span className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                      Cerrada
                    </span>

                  </div>

                  <p className="text-sm text-slate-300 mb-3">
                    {incidencia.descripcion}
                  </p>

                  {incidencia.observacionResolucion && (
                    <div className="bg-[#071016] border border-slate-800 rounded-xl p-4">
                      <p className="text-xs text-slate-500 mb-1">
                        Resolución
                      </p>

                      <p className="text-sm text-slate-300">
                        {incidencia.observacionResolucion}
                      </p>
                    </div>
                  )}

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}