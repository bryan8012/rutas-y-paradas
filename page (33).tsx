"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevaParadaPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/paradas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, direccion }),
      });

      if (res.ok) {
        router.push("/paradas");
      }
    } catch (error) {
      console.error("Error al registrar parada:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#04080c] p-4 sm:p-8 text-slate-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        
        {/* Botón de Regresar con el estilo exacto */}
        <div className="mb-6">
          <Link
            href="/paradas"
            className="bg-[#00ff66] hover:bg-[#00e65c] text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs transition shadow-lg inline-flex items-center gap-2 cursor-pointer"
          >
            <span>← Volver a Paradas</span>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-black text-white">Registrar Nueva Parada</h1>
          <p className="text-slate-400 text-xs mt-0.5">Ingresa los datos del nuevo punto de control</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#071118] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Nombre de la Parada</label>
            <input 
              type="text" 
              required
              placeholder="Ej. Gasolinera Sur" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-[#04080c] border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Dirección o Referencia</label>
            <input 
              type="text" 
              required
              placeholder="Ej. Bulevar Principal #123" 
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full bg-[#04080c] border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500 transition"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3.5 rounded-2xl text-xs transition shadow-lg cursor-pointer disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Parada"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}