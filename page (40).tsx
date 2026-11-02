"use client";

import { useEffect, useState } from "react";
import VolverDashboard from "@/components/VolverDashboard";

type Vehiculo = {
  id: number;
  placa: string;
  modelo: string;
  capacidad: number;
};

export default function VehiculosPage() {
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

 const cargarVehiculos = async () => {
    try {
      const response = await fetch("/api/vehiculos", {
        cache: "no-store", // 👈 Esto evita que el celular cargue datos cacheados
        headers: {
          "bypass-tunnel-reminder": "true",
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setVehiculos(data);
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
    }
  };

  useEffect(() => {
    cargarVehiculos();

    // 👈 Esto recarga los datos automáticamente si cambias de pestaña o vuelves al navegador en el celular
    const handleFocus = () => cargarVehiculos();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMensaje("Registrando unidad...");

    try {
      const response = await fetch("/api/vehiculos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "bypass-tunnel-reminder": "true", // <-- Añádelo también aquí
        },
        body: JSON.stringify({
          placa,
          modelo,
          capacidad,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.error || "Error al registrar vehículo");
        return;
      }

      setMensaje("✅ Vehículo registrado correctamente");

      setPlaca("");
      setModelo("");
      setCapacidad("");

      await cargarVehiculos();
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  return (
    <main className="min-h-screen bg-[#071016] text-slate-100 p-6 sm:p-16 flex justify-center items-center">

      <div className="max-w-5xl w-full bg-[#101b24] border border-slate-700 p-8 sm:p-14 rounded-3xl shadow-2xl">

        <VolverDashboard />

        <header className="mb-14">
          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-white">
            Registro de la flota operativa
          </h1>

          <p className="text-xl text-slate-400">
            Control maestro de unidades físicas y capacidades de transporte.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          <section>
            <h2 className="font-bold text-emerald-400 text-xl mb-6">
              Configuración de unidad
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-3 ml-1">
                  Placa
                </label>

                <input
                  type="text"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  required
                  placeholder="Ejemplo: P123456"
                  className="w-full bg-slate-950 p-5 rounded-2xl border border-slate-700 text-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-3 ml-1">
                  Modelo
                </label>

                <input
                  type="text"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  required
                  placeholder="Ejemplo: Toyota Coaster"
                  className="w-full bg-slate-950 p-5 rounded-2xl border border-slate-700 text-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-3 ml-1">
                  Capacidad
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={capacidad}
                  onChange={(e) => setCapacidad(e.target.value)}
                  required
                  placeholder="Ejemplo: 30"
                  className="w-full bg-slate-950 p-5 rounded-2xl border border-slate-700 text-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-slate-950 py-6 rounded-2xl font-black text-2xl hover:bg-emerald-400 transition shadow-xl shadow-emerald-500/20"
              >
                REGISTRAR UNIDAD
              </button>

              {mensaje && (
                <p className="text-center text-sm text-slate-300">
                  {mensaje}
                </p>
              )}
            </form>
          </section>

          <aside className="space-y-10">

            <div className="border border-slate-700 p-8 rounded-3xl bg-slate-950/30">
              <h3 className="font-bold text-emerald-400 text-lg mb-6 uppercase tracking-widest">
                Reglas del SRS
              </h3>

              <p className="text-slate-400 text-lg leading-relaxed">
                El vehículo registrado podrá utilizarse posteriormente para crear rutas y asignaciones dentro del sistema.
              </p>
            </div>

            <div className="border border-slate-700 p-8 rounded-3xl bg-slate-950/30">

              <h3 className="font-bold text-lg mb-6 uppercase tracking-widest">
                Recursos disponibles
              </h3>

              {vehiculos.length === 0 ? (
                <p className="text-slate-500">
                  No hay vehículos registrados.
                </p>
              ) : (
                <div className="space-y-4">
                  {vehiculos.map((vehiculo) => (
                    <div
                      key={vehiculo.id}
                      className="border border-slate-700 rounded-2xl p-4 bg-[#071016]"
                    >
                      <p className="font-bold text-emerald-400">
                        {vehiculo.placa}
                      </p>

                      <p className="text-slate-300">
                        {vehiculo.modelo}
                      </p>

                      <p className="text-slate-500 text-sm">
                        Capacidad: {vehiculo.capacidad} pasajeros
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}