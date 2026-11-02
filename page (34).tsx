"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VolverDashboard from "@/components/VolverDashboard";

interface Parada {
  id: number;
  nombre: string;
  direccion: string;
}

export default function ParadasPage() {
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParadas() {
      try {
        const res = await fetch("/api/paradas");
        if (res.ok) {
          const data = await res.json();
          setParadas(data);
        }
      } catch (error) {
        console.error("Error al cargar paradas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchParadas();
  }, []);

  return (
    <main className="min-h-screen bg-[#04080c] p-4 sm:p-8 text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <VolverDashboard />

        <div className="flex items-center justify-between mt-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-white">Gestión de Paradas</h1>
            <p className="text-slate-400 text-xs mt-0.5">Puntos de parada de la ruta</p>
          </div>
          <Link
            href="/paradas/nuevo"
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-2xl text-xs transition shadow flex items-center gap-1.5"
          >
            <span>+ Nueva Parada</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs">Cargando paradas...</div>
        ) : paradas.length === 0 ? (
          <div className="text-center py-12 bg-[#071118] border border-slate-800/80 rounded-3xl text-slate-400 text-xs">
            No hay paradas registradas todavía. ¡Crea la primera!
          </div>
        ) : (
          <div className="space-y-3">
            {paradas.map((parada) => (
              <div key={parada.id} className="bg-[#071118] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">{parada.nombre}</h2>
                  <p className="text-[11px] text-slate-400">{parada.direccion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}