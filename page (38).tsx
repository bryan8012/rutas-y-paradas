'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function ReportesEstadisticas() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [idRuta, setIdRuta] = useState('');
  const [rutas, setRutas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [reporteData, setReporteData] = useState<any>(null);

  // Cargar las rutas disponibles al iniciar la página
  useEffect(() => {
    async function fetchRutas() {
      try {
        const res = await fetch('/api/rutas');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setRutas(data);
        } else if (data.rutas && Array.isArray(data.rutas)) {
          setRutas(data.rutas);
        }
      } catch (error) {
        console.error('Error al cargar rutas:', error);
      }
    }
    fetchRutas();
  }, []);

  const handleFiltrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `/api/reportes?inicio=${fechaInicio}&fin=${fechaFin}&ruta=${idRuta}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setReporteData(data.resultado);
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444'];

  return (
    <main className="min-h-screen bg-[#071016] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-[#0a161d] p-10 rounded-[60px] border-[6px] border-emerald-900/35 shadow-2xl text-slate-100">
        
        {/* Botón de retorno */}
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
            Transexpress Smartroute V2.0
          </span>
          <h1 className="text-4xl font-extrabold mt-2 mb-3 text-white">
            Reportes y Estadísticas
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Dashboard de estadísticas y análisis de operaciones en ruta.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <h2 className="text-lg font-semibold mb-6 text-emerald-400">
            Filtros de Búsqueda
          </h2>

          <form onSubmit={handleFiltrar} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Fecha Inicio
              </label>
              <input
                type="date"
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer [color-scheme:dark]"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Fecha Fin
              </label>
              <input
                type="date"
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer [color-scheme:dark]"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Ruta
              </label>
              <select
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                value={idRuta}
                onChange={(e) => setIdRuta(e.target.value)}
              >
                <option value="">Todas las rutas (Consolidado)</option>
                {rutas.map((r) => (
                  <option key={r.id} value={r.id}>
                    ID {r.id} - {r.nombre || `Ruta ${r.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#071016] font-black text-sm px-5 py-3 rounded-xl transition shadow-lg shadow-emerald-900/20 disabled:opacity-50"
              >
                {loading ? 'Filtrando...' : 'Filtrar'}
              </button>
            </div>
          </form>
        </div>

        {/* Sección de Resultados y Gráficas */}
        {reporteData && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Total Viajes</p>
                <p className="text-2xl font-bold text-white mt-1">{reporteData.totalViajes || 0}</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Incidencias Atendidas</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{reporteData.totalIncidencias || 0}</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Eficiencia General</p>
                <p className="text-2xl font-bold text-sky-400 mt-1">{reporteData.eficiencia || '100%'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gráfica de Barras */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-md font-semibold text-slate-200 mb-4">Incidencias por Categoría</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reporteData.incidenciasPorCategoria}>
                      <XAxis dataKey="categoria" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                      />
                      <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfica Circular (Pastel) */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-md font-semibold text-slate-200 mb-4">Estado de Incidencias</h3>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                      />
                      <Pie
                        data={reporteData.estadoIncidencias}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        {reporteData.estadoIncidencias.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        formatter={(value) => <span className="text-slate-300 text-xs font-medium">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}