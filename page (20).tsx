"use client";

import { useEffect, useState } from "react";
import VolverDashboard from "@/components/VolverDashboard";

type Ruta = {
  id: number;
  nombre: string;
};

type Vehiculo = {
  id: number;
  placa: string;
  modelo: string;
  capacidad: number;
};

type Conductor = {
  id: number;
  name: string; // <-- Cambiado de email a name
};

type Asignacion = {
  id: number;
  fecha: string;
  ruta: Ruta;
  vehiculo: Vehiculo;
  conductor: Conductor;
};

export default function AsignacionPage() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);

  const [rutaId, setRutaId] = useState("");
  const [vehiculoId, setVehiculoId] = useState("");
  const [conductorId, setConductorId] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    try {
      const response = await fetch("/api/asignaciones", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cargar datos");
      }

      setRutas(data.rutas || []);
      setVehiculos(data.vehiculos || []);
      setConductores(data.conductores || []);
      setAsignaciones(data.asignaciones || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos.");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleAsignar = async () => {
    setMensaje("");
    setError("");

    if (!rutaId || !vehiculoId || !conductorId) {
      setError("Debes seleccionar ruta, vehículo y conductor.");
      return;
    }

    try {
      setCargando(true);

      const response = await fetch("/api/asignaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rutaId: Number(rutaId),
          vehiculoId: Number(vehiculoId),
          conductorId: Number(conductorId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No se pudo registrar la asignación.");
        return;
      }

      setMensaje("Asignación registrada correctamente.");

      setRutaId("");
      setVehiculoId("");
      setConductorId("");

      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error de conexión.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071016] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-[#0a161d] p-10 rounded-[60px] border-[6px] border-emerald-900/30 shadow-2xl">

        <VolverDashboard />

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Asignación
          </h1>
          <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest mt-2">
            Configuración de servicio nocturno
          </p>
        </div>

        <div className="flex flex-col gap-6">

          <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-wider">
            Nueva Asignación
          </h2>

          <select
            value={rutaId}
            onChange={(e) => setRutaId(e.target.value)}
            className="w-full bg-slate-950 p-6 rounded-2xl border-2 border-slate-700 text-white text-lg focus:border-emerald-500 transition-all"
          >
            <option value="">Seleccione Ruta</option>
            {rutas.map((ruta) => (
              <option key={ruta.id} value={ruta.id}>
                {ruta.nombre}
              </option>
            ))}
          </select>

          <select
            value={vehiculoId}
            onChange={(e) => setVehiculoId(e.target.value)}
            className="w-full bg-slate-950 p-6 rounded-2xl border-2 border-slate-700 text-white text-lg focus:border-emerald-500 transition-all"
          >
            <option value="">Seleccione Vehículo</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id} value={vehiculo.id}>
                {vehiculo.placa} - {vehiculo.modelo}
              </option>
            ))}
          </select>

          <select
            value={conductorId}
            onChange={(e) => setConductorId(e.target.value)}
            className="w-full bg-slate-950 p-6 rounded-2xl border-2 border-slate-700 text-white text-lg focus:border-emerald-500 transition-all"
          >
            <option value="">Seleccione Conductor</option>
            {conductores.map((conductor) => (
              <option key={conductor.id} value={conductor.id}>
                {conductor.name} {/* <-- Muestra el nombre del registro */}
              </option>
            ))}
          </select>

          <button
            onClick={handleAsignar}
            disabled={cargando}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-[#071016] py-5 rounded-2xl font-black text-xl shadow-xl transition-all mt-2"
          >
            {cargando ? "GUARDANDO..." : "CONFIRMAR"}
          </button>

          {mensaje && (
            <div className="text-emerald-400 text-center font-semibold">
              ✅ {mensaje}
            </div>
          )}

          {error && (
            <div className="text-red-400 text-center font-semibold">
              ❌ {error}
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <h3 className="text-emerald-400 font-bold text-lg mb-5">
            Asignaciones registradas
          </h3>

          {asignaciones.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No hay asignaciones registradas.
            </p>
          ) : (
            <div className="space-y-4">
              {asignaciones.map((asignacion) => (
                <div
                  key={asignacion.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
                >
                  <p className="text-emerald-400 font-bold">
                    {asignacion.ruta.nombre}
                  </p>

                  <p className="text-white text-sm mt-2">
                    Vehículo: {asignacion.vehiculo.placa} - {asignacion.vehiculo.modelo}
                  </p>

                  <p className="text-slate-400 text-sm mt-1">
                    Conductor: {asignacion.conductor.name} {/* <-- Muestra el nombre también en la lista */}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">
            Reglas de Operación
          </h3>

          <ul className="text-sm text-slate-500 list-disc pl-6 space-y-2">
            <li>Evite sobrecargar las unidades.</li>
            <li>La validación de cupos es obligatoria.</li>
          </ul>
        </div>

      </div>
    </main>
  );
}