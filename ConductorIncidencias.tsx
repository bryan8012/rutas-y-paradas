'use client';
import React, { useState } from 'react';

export default function ConductorIncidencias({ conductorId, viajeId }: { conductorId: number; viajeId: number }) {
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const res = await fetch('/api/incidencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoria, descripcion, conductorId, viajeId }),
      });

      const data = await res.json();
      if (data.success) {
        setMensaje('Incidencia reportada con éxito.');
        setCategoria('');
        setDescripcion('');
      } else {
        setMensaje(data.error || 'Error al enviar reporte.');
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-slate-100 py-6">
      <header className="mb-12 text-center flex flex-col items-center">
        <p className="text-emerald-400 text-sm font-black uppercase tracking-[0.4em] mb-4">
          TRANSEXPRESS SMARTROUTE V2.0
        </p>
        <h1 className="text-4xl md:text-5xl font-black leading-tight text-white tracking-tight">
          Portal del Conductor <br /> Registro de incidencias
        </h1>
        <p className="mt-6 text-slate-400 text-lg max-w-2xl leading-relaxed">
          Reporte rápido de novedades en ruta por categorías operativas para el seguimiento y control de la flota.
        </p>
      </header>

      {mensaje && (
        <div className="mb-8 p-5 text-base bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-2xl text-center max-w-2xl mx-auto">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div>
          <label className="block text-base font-bold text-slate-300 mb-3">Categoría de la incidencia</label>
          <select 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)}
            required
            className="w-full p-4 bg-[#122720] border border-[#1e3b35] rounded-2xl text-slate-100 text-base focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="" className="bg-[#122720]">Seleccione una categoría</option>
            <option value="Mecánica" className="bg-[#122720]">Mecánica</option>
            <option value="Tráfico" className="bg-[#122720]">Tráfico / Demora</option>
            <option value="Pasajero" className="bg-[#122720]">Incidente con Pasajero</option>
            <option value="Otro" className="bg-[#122720]">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-base font-bold text-slate-300 mb-3">Descripción detallada</label>
          <textarea 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={4}
            placeholder="Describa brevemente lo sucedido..."
            className="w-full p-4 bg-[#122720] border border-[#1e3b35] rounded-2xl text-slate-100 text-base focus:outline-none focus:border-emerald-500 transition resize-none"
          />
        </div>

        <div className="text-center pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#24ddd2] text-[#09211d] px-8 py-4 rounded-2xl font-black text-lg hover:bg-[#5bf1e8] transition shadow-[0_0_28px_rgba(36,221,210,0.34)] disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Reporte +'}
          </button>
        </div>
      </form>
    </div>
  );
}