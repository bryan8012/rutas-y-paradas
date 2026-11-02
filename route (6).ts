'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RegistroConductores() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);
  const [conductores, setConductores] = useState<any[]>([]);

  // Cargar conductores existentes al iniciar
  const cargarConductores = async () => {
    try {
      const res = await fetch('/api/conductores');
      const data = await res.json();
      if (Array.isArray(data)) {
        setConductores(data);
      }
    } catch (error) {
      console.error('Error al cargar conductores:', error);
    }
  };

  useEffect(() => {
    cargarConductores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      const res = await fetch('/api/usuarios', { // O '/api/conductores' dependiendo de dónde crees el POST
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          email,
          rol: 'CONDUCTOR',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje({ texto: '¡Conductor registrado correctamente!', tipo: 'success' });
        setNombre('');
        setEmail('');
        cargarConductores(); // Recargar la lista
      } else {
        setMensaje({ texto: data.error || 'Error al registrar conductor', tipo: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ texto: 'Error de red al registrar el conductor', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071016] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[#0a161d] p-10 rounded-[60px] border-[6px] border-emerald-900/30 shadow-2xl text-slate-100">
        
        {/* Botón de retorno al Dashboard */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-[#071016] shadow-xl transition hover:bg-emerald-400 text-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Regresar al Dashboard
          </Link>
        </div>

        {/* Encabezado */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Gestión de Personal
          </span>
          <h1 className="text-3xl font-extrabold mt-2 mb-2 text-white">
            Registro de Conductores
          </h1>
          <p className="text-slate-400 text-sm">
            Agrega nuevos conductores para habilitarlos en las asignaciones de rutas.
          </p>
        </div>

        {/* Alerta de éxito o error */}
        {mensaje && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-medium ${
            mensaje.tipo === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Nombre Completo del Conductor
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Carlos Mendoza"
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Correo Electrónico (Opcional)
            </label>
            <input
              type="email"
              placeholder="carlos@transexpress.com"
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#071016] font-black text-sm px-6 py-4 rounded-xl transition shadow-lg shadow-emerald-900/20 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar Conductor'}
          </button>
        </form>

        {/* Listado rápido de conductores ya registrados */}
        <div className="mt-10 pt-8 border-t border-slate-800/80">
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
            Conductores Registrados ({conductores.length})
          </h3>
          {conductores.length === 0 ? (
            <p className="text-slate-500 text-xs">No hay conductores registrados todavía.</p>
          ) : (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-2">
              {conductores.map((c) => (
                <div key={c.id} className="bg-slate-900/80 border border-slate-800/60 p-3.5 rounded-xl flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-200">{c.nombre}</span>
                  <span className="text-emerald-400/80 font-mono">ID: #{c.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}