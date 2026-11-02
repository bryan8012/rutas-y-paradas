"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import VolverDashboard from "@/components/VolverDashboard";

const MapaRuta = dynamic(() => import("@/components/MapaRuta"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-slate-950 rounded-2xl border-2 border-slate-700 flex items-center justify-center text-slate-500 text-sm animate-pulse">
      Cargando mapa...
    </div>
  ),
});

type Vehiculo = {
  id: number;
  placa: string;
  modelo: string;
};

type Ruta = {
  id: number;
  nombre: string;
  latitud: number;
  longitud: number;
  vehiculo: Vehiculo;
};

type Parada = {
  id: number;
  nombre: string;
  latitud: number;
  longitud: number;
  rutaId?: number;
  orden?: number;
};

export default function RutasPage() {
  const [nombre, setNombre] = useState("");
  const [latitud, setLatitud] = useState<number>(13.6929);
  const [longitud, setLongitud] = useState<number>(-89.2182);
  const [vehiculoId, setVehiculoId] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  const [nombreParada, setNombreParada] = useState("");
  const [paradaLat, setParadaLat] = useState<number>(13.6929);
  const [paradaLng, setParadaLng] = useState<number>(-89.2182);
  const [rutaParadaId, setRutaParadaId] = useState("");
  const [ordenParada, setOrdenParada] = useState("1");
  const [mensajeParada, setMensajeParada] = useState("");
  const [paradas, setParadas] = useState<Parada[]>([]);

  const cargarDatos = async () => {
    try {
      const [resRutas, resVehiculos, resParadas] = await Promise.all([
        fetch("/api/rutas"),
        fetch("/api/vehiculos"),
        fetch("/api/paradas"),
      ]);

      if (resRutas.ok) {
        const dataRutas = await resRutas.json();
        setRutas(Array.isArray(dataRutas) ? dataRutas : (dataRutas.rutas || []));
      }

      if (resVehiculos.ok) {
        const dataVehiculos = await resVehiculos.json();
        setVehiculos(Array.isArray(dataVehiculos) ? dataVehiculos : (dataVehiculos.vehiculos || []));
      }

      if (resParadas.ok) {
        const dataParadas = await resParadas.json();
        setParadas(Array.isArray(dataParadas) ? dataParadas : (dataParadas.paradas || []));
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("Guardando ruta...");

    try {
      const response = await fetch("/api/rutas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          latitud: Number(latitud),
          longitud: Number(longitud),
          vehiculoId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.error || "Error al guardar ruta");
        return;
      }

      setMensaje("✅ Ruta registrada correctamente");
      setNombre("");
      setLatitud(13.6929);
      setLongitud(-89.2182);
      setVehiculoId("");

      await cargarDatos();
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  const handleParada = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeParada("Guardando parada...");

    try {
      const response = await fetch("/api/paradas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreParada,
          latitud: Number(paradaLat),
          longitud: Number(paradaLng),
          rutaId: Number(rutaParadaId),
          orden: Number(ordenParada),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensajeParada(data.error || "Error al registrar parada");
        return;
      }

      setMensajeParada("✅ Parada registrada correctamente");
      setNombreParada("");
      setParadaLat(13.6929);
      setParadaLng(-89.2182);
      setRutaParadaId("");
      setOrdenParada("1");

      await cargarDatos();
    } catch (error) {
      console.error(error);
      setMensajeParada("❌ Error al conectar con el servidor");
    }
  };

  return (
    <main className="min-h-screen bg-[#071016] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-[#0a161d] p-10 rounded-[60px] border-[6px] border-emerald-900/30 shadow-2xl overflow-hidden">
        
        <VolverDashboard />

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Gestión de Rutas
          </h1>
          <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest mt-2">
            RF-004: Configuración
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* COLUMNA 1: CREAR RUTA */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-lg font-semibold text-white">
                📍 Crear Nueva Ruta
              </h2>

              <input
                type="text"
                placeholder="Nombre de la ruta"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full bg-slate-950 p-6 rounded-2xl border-2 border-slate-700 text-white text-lg"
              />

              <select
                value={vehiculoId}
                onChange={(e) => setVehiculoId(e.target.value)}
                required
                className="w-full bg-slate-950 p-6 rounded-2xl border-2 border-slate-700 text-white text-lg"
              >
                <option value="">Seleccionar vehículo</option>
                {vehiculos.map((vehiculo) => (
                  <option key={vehiculo.id} value={vehiculo.id}>
                    {vehiculo.placa} - {vehiculo.modelo}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  Ubicación de la Ruta (Haz clic en el mapa)
                </label>
                <MapaRuta
                  lat={latitud}
                  lng={longitud}
                  onChange={(lat, lng) => {
                    setLatitud(lat);
                    setLongitud(lng);
                  }}
                />
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <input
                    type="text"
                    value={latitud}
                    readOnly
                    placeholder="Latitud"
                    className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400"
                  />
                  <input
                    type="text"
                    value={longitud}
                    readOnly
                    placeholder="Longitud"
                    className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-[#071016] py-5 rounded-2xl font-black text-xl hover:bg-emerald-400 transition"
              >
                GUARDAR RUTA
              </button>

              {mensaje && (
                <p className="text-center text-sm text-slate-300">
                  {mensaje}
                </p>
              )}
            </form>

            {/* RUTAS REGISTRADAS */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <h3 className="text-emerald-400 font-bold text-lg mb-6">
                Rutas registradas
              </h3>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {rutas.map((ruta) => (
                  <div
                    key={ruta.id}
                    className="p-5 bg-slate-900 rounded-2xl text-sm text-slate-300 border border-slate-800"
                  >
                    <p className="font-bold text-emerald-400">
                      {ruta.nombre}
                    </p>
                    <p>
                      Vehículo: {ruta.vehiculo?.placa} - {ruta.vehiculo?.modelo}
                    </p>
                    <p className="text-slate-500">
                      Lat: {ruta.latitud} | Long: {ruta.longitud}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA 2: CREAR PARADA */}
          <div>
            <form onSubmit={handleParada} className="space-y-6">
              <h2 className="text-lg font-bold text-emerald-400 mb-6">
                🚌 Agregar parada
              </h2>

              <select
                value={rutaParadaId}
                onChange={(e) => setRutaParadaId(e.target.value)}
                required
                className="w-full bg-slate-950 p-6 rounded-2xl border-2 border-slate-700 text-white text-lg"
              >
                <option value="">Seleccionar ruta</option>
                {rutas.map((ruta) => (
                  <option key={ruta.id} value={ruta.id}>
                    {ruta.nombre}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Nombre de la parada"
                value={nombreParada}
                onChange={(e) => setNombreParada(e.target.value)}
                required
                className="w-full bg-slate-950 p-6 rounded-2xl border-2 border-slate-700 text-white text-lg"
              />

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  Ubicación de la Parada (Haz clic en el mapa)
                </label>
                <MapaRuta
                  lat={paradaLat}
                  lng={paradaLng}
                  onChange={(lat, lng) => {
                    setParadaLat(lat);
                    setParadaLng(lng);
                  }}
                />
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <input
                    type="text"
                    value={paradaLat}
                    readOnly
                    placeholder="Latitud"
                    className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400"
                  />
                  <input
                    type="text"
                    value={paradaLng}
                    readOnly
                    placeholder="Longitud"
                    className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400"
                  />
                </div>
              </div>

              <input
                type="number"
                min="1"
                placeholder="Orden"
                value={ordenParada}
                onChange={(e) => setOrdenParada(e.target.value)}
                required
                className="w-full bg-slate-950 p-4 rounded-xl border border-slate-700 text-white"
              />

              <button
                type="submit"
                className="w-full bg-teal-500 text-slate-950 py-5 rounded-2xl font-black text-xl hover:bg-teal-400 transition"
              >
                AGREGAR PARADA
              </button>

              {mensajeParada && (
                <p className="text-center text-sm text-slate-300">
                  {mensajeParada}
                </p>
              )}
            </form>

            {/* PARADAS REGISTRADAS */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <h3 className="text-teal-400 font-bold text-lg mb-4">
                Paradas registradas
              </h3>

              {paradas.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  No hay paradas registradas.
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {paradas.map((parada) => (
                    <div
                      key={parada.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-4"
                    >
                      <p className="font-bold text-white">
                        {parada.nombre}
                      </p>
                      <p className="text-slate-500 text-sm">
                        Lat: {parada.latitud} | Long: {parada.longitud}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}