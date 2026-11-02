"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VolverDashboard from "@/components/VolverDashboard";

interface Ruta {
  id: number;
  nombre: string;
}

interface Parada {
  id: number;
  nombre: string;
  direccion: string;
}

export default function NuevoPasajeroPage() {
  const router = useRouter();
  
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rutaId, setRutaId] = useState("");
  const [paradaId, setParadaId] = useState("");

  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Cargar rutas y paradas disponibles al montar el componente
  useEffect(() => {
    async function fetchData() {
      try {
        const resRutas = await fetch("/api/rutas");
        if (resRutas.ok) setRutas(await resRutas.json());

        const resParadas = await fetch("/api/paradas");
        if (resParadas.ok) setParadas(await resParadas.json());
      } catch (err) {
        console.error("Error al cargar dependencias:", err);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      const res = await fetch("/api/pasajeros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          rutaId: parseInt(rutaId),
          paradaId: paradaId ? parseInt(paradaId) : null,
        }),
      });

      if (res.ok) {
        setMensaje("¡Pasajero registrado con éxito!");
        setTimeout(() => {
          router.push("/pasajeros");
        }, 1200);
      } else {
        const data = await res.json();
        setMensaje(data.error || "Error al registrar pasajero.");
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error de red al intentar registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#04080c] p-4 sm:p-8 text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-xl">
        
        <VolverDashboard />

        <div className="mb-6 mt-4">
          <h1 className="text-3xl font-black text-white">Nuevo Pasajero</h1>
          <p className="text-slate-400 text-xs mt-0.5">Asigna el pasajero a su ruta y parada correspondiente</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#071118] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          
          {mensaje && (
            <div className="bg-teal-950/60 border border-teal-500/30 text-teal-300 px-4 py-3 rounded-2xl text-xs font-medium">
              {mensaje}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Nombre Completo</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full bg-[#04080c] border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full bg-[#04080c] border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Ruta Asignada</label>
            <select
              required
              value={rutaId}
              onChange={(e) => setRutaId(e.target.value)}
              className="w-full bg-[#04080c] border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500 transition"
            >
              <option value="">Selecciona una ruta...</option>
              {rutas.map((ruta) => (
                <option key={ruta.id} value={ruta.id}>
                  {ruta.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Parada (Opcional)</label>
            <select
              value={paradaId}
              onChange={(e) => setParadaId(e.target.value)}
              className="w-full bg-[#04080c] border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500 transition"
            >
              <option value="">Sin parada específica</option>
              {paradas.map((parada) => (
                <option key={parada.id} value={parada.id}>
                  {parada.nombre} ({parada.direccion})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3.5 rounded-2xl text-xs transition shadow-lg cursor-pointer disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Registrar Pasajero"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}