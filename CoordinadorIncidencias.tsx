'use client';

import React, { useEffect, useState } from 'react';

interface Incidencia {
  id: number;
  categoria: string;
  descripcion: string;
  estado: string;
  comentario?: string | null;
  createdAt?: string;
}

export default function CoordinadorIncidencias() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [comentarios, setComentarios] = useState<{ [key: number]: string }>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const obtenerIncidencias = async () => {
    try {
      const res = await fetch('/api/incidencias');
      const data = await res.json();
      if (data.success) {
        setIncidencias(data.incidencias);
        setErrorMsg(null);
      }
    } catch (error) {
      console.error('Error al obtener incidencias:', error);
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerIncidencias();
  }, []);

  const handleResolver = async (id: number) => {
    const comentarioTexto = comentarios[id] || '';

    try {
      const res = await fetch(`/api/incidencias/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: 'Resuelto',
          comentario: comentarioTexto,
        }),
      });

      const data = await res.json();
      if (data.success) {
        obtenerIncidencias(); // Recarga la tabla manteniendo tu estructura
      } else {
        alert('Error al resolver: ' + data.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        Cargando panel de control...
      </div>
    );
  }

  // Filtramos solo las pendientes (o las que gustes mostrar en tu tabla principal)
  const incidenciasPendientes = incidencias.filter(inc => inc.estado !== 'Resuelto');

  return (
    <div className="max-w-6xl mx-auto p-6 text-slate-100">
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
          Transexpress Smartroute V2.0
        </span>
        <h1 className="text-4xl font-extrabold mt-2 mb-3 text-white">
          Panel de Control Coordinador de Operaciones
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Gestión y seguimiento centralizado de las incidencias reportadas en ruta por los conductores.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-center rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-slate-200">
          Gestión de Incidencias Pendientes
        </h2>

        {incidenciasPendientes.length === 0 ? (
          <p className="text-slate-400 text-center py-6 text-sm">
            No hay incidencias pendientes en este momento.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Fecha</th>
                  <th className="py-3 px-4 font-semibold">Categoría</th>
                  <th className="py-3 px-4 font-semibold">Descripción</th>
                  <th className="py-3 px-4 font-semibold text-right">Resolución / Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {incidenciasPendientes.map((inc) => {
                  const fechaFormateada = inc.createdAt 
                    ? new Date(inc.createdAt).toLocaleDateString() 
                    : '27/7/2026';

                  return (
                    <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 text-slate-300 whitespace-nowrap">
                        {fechaFormateada}
                      </td>
                      <td className="py-4 px-4 font-medium text-emerald-400 whitespace-nowrap">
                        {inc.categoria}
                      </td>
                      <td className="py-4 px-4 text-slate-300 max-w-xs truncate">
                        {inc.descripcion}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="text"
                            placeholder="Comentario..."
                            className="bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36 sm:w-44"
                            value={comentarios[inc.id] || ''}
                            onChange={(e) =>
                              setComentarios({ ...comentarios, [inc.id]: e.target.value })
                            }
                          />
                          <button
                            onClick={() => handleResolver(inc.id)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-1.5 rounded text-xs transition shadow-sm whitespace-nowrap"
                          >
                            Resolver
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}