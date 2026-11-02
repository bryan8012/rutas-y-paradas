"use client";

import { useEffect, useState } from "react";
import VolverDashboard from "@/components/VolverDashboard";

type Asignacion = {
  id: number;
  rutaId: number;
  vehiculoId: number;
  conductorId: number;
  ruta: {
    id: number;
    nombre: string;
  };
  vehiculo: {
    id: number;
    placa: string;
    modelo: string;
  };
  conductor: {
    id: number;
    email: string;
  };
};

type Parada = {
  id: number;
  nombre: string;
  direccion: string;
};

export default function CheckInPage() {
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [paradas, setParadas] = useState<Parada[]>([]);

  const [asignacionId, setAsignacionId] = useState("");
  const [paradaId, setParadaId] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargandoDatos(true);

      const [resAsignaciones, resParadas] = await Promise.all([
        fetch("/api/asignaciones", {
          cache: "no-store",
        }),

        fetch("/api/paradas", {
          cache: "no-store",
        }),
      ]);

      if (!resAsignaciones.ok || !resParadas.ok) {
        setError("No se pudieron cargar los datos.");
        return;
      }

      const datosAsignaciones = await resAsignaciones.json();
      const datosParadas = await resParadas.json();

      setAsignaciones(datosAsignaciones.asignaciones || []);
      setParadas(datosParadas || []);

      if (datosAsignaciones.asignaciones?.length > 0) {
        setAsignacionId(
          String(datosAsignaciones.asignaciones[0].id)
        );
      }

      if (datosParadas?.length > 0) {
        setParadaId(String(datosParadas[0].id));
      }
    } catch (err) {
      console.error(err);
      setError("Error al cargar información del viaje.");
    } finally {
      setCargandoDatos(false);
    }
  }

  const handleRegistrar = () => {
    setMensaje(null);
    setError(null);

    if (!asignacionId) {
      setError("Debes seleccionar una asignación.");
      return;
    }

    if (!paradaId) {
      setError("Debes seleccionar una parada.");
      return;
    }

    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }

    const asignacion = asignaciones.find(
      (item) => item.id === Number(asignacionId)
    );

    if (!asignacion) {
      setError("La asignación seleccionada no es válida.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitud = position.coords.latitude;
        const longitud = position.coords.longitude;

        try {
          const response = await fetch("/api/checkin", {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              asignacionId: asignacion.id,
              rutaId: asignacion.rutaId,
              vehiculoId: asignacion.vehiculoId,
              conductorId: asignacion.conductorId,
              paradaId: Number(paradaId),
              latitud,
              longitud,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            setError(
              data.error || "No se pudo registrar el check-in."
            );
            return;
          }

          setMensaje(
            `✅ Check-in registrado correctamente. Lat: ${latitud.toFixed(
              4
            )}, Lng: ${longitud.toFixed(4)}`
          );
        } catch (err) {
          console.error(err);

          setError(
            "Error al conectar con el servidor."
          );
        } finally {
          setLoading(false);
        }
      },

      (err) => {
        console.error(err);

        setError(
          "No se pudo obtener la ubicación. Asegúrate de permitir el acceso al GPS."
        );

        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const asignacionSeleccionada = asignaciones.find(
    (item) => item.id === Number(asignacionId)
  );

  return (
    <main className="min-h-screen bg-[#04080c] flex items-center justify-center p-4">

      <div className="w-full max-w-[520px] bg-[#071016] border border-slate-800 rounded-[40px] p-8 text-slate-100 shadow-2xl">

        <div className="mb-5">
          <VolverDashboard />
        </div>

        <div className="text-center mb-8">

          <h1 className="text-3xl font-black mb-2">
            Check-in
          </h1>

          <p className="text-[#00ff66] text-sm font-bold tracking-widest">
            REGISTRO DE ABORDAJE
          </p>

        </div>

        {cargandoDatos ? (

          <div className="text-center text-slate-400 py-8">
            Cargando información del viaje...
          </div>

        ) : (

          <div className="space-y-5">

            <div>

              <label className="block text-xs text-slate-400 font-bold mb-2">
                ASIGNACIÓN
              </label>

              <select
                value={asignacionId}
                onChange={(e) =>
                  setAsignacionId(e.target.value)
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4"
              >

                <option value="">
                  Seleccione una asignación
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

            {asignacionSeleccionada && (

              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-sm space-y-2">

                <p>
                  <span className="text-slate-500">
                    Ruta:
                  </span>{" "}
                  {asignacionSeleccionada.ruta.nombre}
                </p>

                <p>
                  <span className="text-slate-500">
                    Vehículo:
                  </span>{" "}
                  {asignacionSeleccionada.vehiculo.placa} -{" "}
                  {asignacionSeleccionada.vehiculo.modelo}
                </p>

                <p>
                  <span className="text-slate-500">
                    Conductor:
                  </span>{" "}
                  {asignacionSeleccionada.conductor.email}
                </p>

              </div>

            )}

            <div>

              <label className="block text-xs text-slate-400 font-bold mb-2">
                PARADA
              </label>

              <select
                value={paradaId}
                onChange={(e) =>
                  setParadaId(e.target.value)
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4"
              >

                <option value="">
                  Seleccione una parada
                </option>

                {paradas.map((parada) => (

                  <option
                    key={parada.id}
                    value={parada.id}
                  >
                    {parada.nombre} - {parada.direccion}
                  </option>

                ))}

              </select>

            </div>

            <button
              onClick={handleRegistrar}
              disabled={loading}
              className="bg-[#00ff66] text-slate-950 font-black px-6 py-4 rounded-2xl w-full hover:bg-[#00e65c] transition shadow-[0_0_20px_rgba(0,255,102,0.25)] disabled:opacity-50"
            >
              {loading
                ? "Obteniendo ubicación..."
                : "📍 REGISTRAR CHECK-IN"}
            </button>

          </div>

        )}

        {mensaje && (

          <div className="mt-5 p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl font-medium">
            {mensaje}
          </div>

        )}

        {error && (

          <div className="mt-5 p-4 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-xl font-medium">
            {error}
          </div>

        )}

        <p className="text-xs text-slate-500 mt-6 text-center">
          Confirma tu posición actual para registrar el abordaje en la parada seleccionada.
        </p>

      </div>

    </main>
  );
}