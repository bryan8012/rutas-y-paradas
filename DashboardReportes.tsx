'use client';
import { useState, useEffect } from 'react';
import React from 'react';

export default function DashboardReportes() {
  const [stats, setStats] = useState<any>(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [rutaId, setRutaId] = useState('');

  const fetchReportes = async () => {
    let url = '/api/reportes?';
    if (fechaInicio) url += `fechaInicio=${fechaInicio}&`;
    if (fechaFin) url += `fechaFin=${fechaFin}&`;
    if (rutaId) url += `rutaId=${rutaId}`;

    const res = await fetch(url);
    const data = await res.json();
    if (data.success) setStats(data.estadisticas);
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Dashboard de Estadísticas y Reportes</h2>
      
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha Inicio</label>
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="w-full p-2 border rounded text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha Fin</label>
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="w-full p-2 border rounded text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">ID Ruta</label>
          <input type="number" placeholder="Ej. 1" value={rutaId} onChange={(e) => setRutaId(e.target.value)} className="w-full p-2 border rounded text-sm" />
        </div>
        <div className="flex items-end">
          <button onClick={fetchReportes} className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition">
            Filtrar
          </button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-blue-600">Total de Viajes</h3>
            <p className="text-3xl font-bold text-blue-800 mt-2">{stats.viajes}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-green-600">Asistencias de Abordaje</h3>
            <p className="text-3xl font-bold text-green-800 mt-2">{stats.asistenciasAbordaje}</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-amber-600">Incidencias (Pend./Cerr.)</h3>
            <p className="text-3xl font-bold text-amber-800 mt-2">
              {stats.incidencias.pendientes} / {stats.incidencias.cerradas}
            </p>
            <span className="text-xs text-gray-500">Total registradas: {stats.incidencias.total}</span>
          </div>
        </div>
      )}
    </div>
  );
}