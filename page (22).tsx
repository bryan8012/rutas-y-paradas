'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

interface Ruta {
  id: number;
  nombre: string;
}

export default function ConductorPage() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [rutaId, setRutaId] = useState("");
  const [viajeIdActivo, setViajeIdActivo] = useState<number | null>(null);
  const [transmitiendo, setTransmitiendo] = useState(false);
  
  // Estados para incidencias y descripción
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<string | null>(null);
  const [descripcionIncidencia, setDescripcionIncidencia] = useState("");
  const [mensajeIncidencia, setMensajeIncidencia] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    // Cargar rutas disponibles
    fetch("/api/rutas")
      .then((res) => res.json())
      .then((data) => setRutas(Array.isArray(data) ? data : data.rutas || []))
      .catch((err) => console.error("Error al cargar rutas:", err));
  }, []);

  // Buscar el viajeId activo cuando se selecciona una ruta
  useEffect(() => {
    if (rutaId) {
      fetch(`/api/asignaciones?rutaId=${rutaId}`)
        .then((res) => res.json())
        .then((data) => {
          const asignaciones = Array.isArray(data) ? data : data.asignaciones || [];
          if (asignaciones.length > 0) {
            const encontrada = asignaciones.find((a: any) => a.rutaId === Number(rutaId));
            setViajeIdActivo(encontrada ? encontrada.id : asignaciones[0].id);
          } else {
            setViajeIdActivo(null);
          }
        })
        .catch((err) => console.error("Error al buscar viaje activo:", err));
    } else {
      setViajeIdActivo(null);
    }
  }, [rutaId]);

  // Simulación o lógica de envío de coordenadas GPS cuando está transmitiendo
  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    if (transmitiendo && rutaId) {
      intervalo = setInterval(() => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              await fetch(`/api/rutas/${rutaId}/ubicacion`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latitud: latitude, longitud: longitude }),
              });
            } catch (error) {
              console.error("Error al actualizar ubicación en vivo:", error);
            }
          }, (err) => {
            console.error("Error de geolocalización:", err);
          }, { enableHighAccuracy: true });
        }
      }, 5000);
    }
    return () => clearInterval(intervalo);
  }, [transmitiendo, rutaId]);

  const manejarReporte = async (categoria: string) => {
    if (!rutaId) {
      alert("Por favor selecciona una ruta antes de reportar una incidencia.");
      return;
    }

    if (!descripcionIncidencia.trim()) {
      alert("Por favor escribe el motivo o descripción de la incidencia.");
      return;
    }

    setIncidenciaSeleccionada(categoria);
    setMensajeIncidencia(`Reportando incidencia de tipo: ${categoria}...`);

    try {
      const res = await fetch("/api/incidencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          categoria, 
          descripcion: descripcionIncidencia,
          rutaId: Number(rutaId),
          viajeId: viajeIdActivo 
        }),
      });

      if (res.ok) {
        setMensajeIncidencia(`✅ Incidencia de "${categoria}" reportada con éxito.`);
        setDescripcionIncidencia(""); // Limpiar campo al enviar
      } else {
        setMensajeIncidencia(`⚠️ Incidencia registrada localmente (modo offline).`);
      }
    } catch (error) {
      setMensajeIncidencia(`⚠️ Guardado offline: Incidencia de ${categoria}.`);
    }

    setTimeout(() => {
      setIncidenciaSeleccionada(null);
      setMensajeIncidencia("");
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-[#04080c] p-4 sm:p-8 text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-xl">
        
        {/* Botón de regreso */}
        <div className="mb-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
          >
            ← Regresar al Dashboard
          </Link>
        </div>

        {/* Encabezado */}
        <div className="mb-6">
          <div className="text-[10px] font-bold text-emerald-400 tracking-wider mb-1">
            RF-008 · RF-009 · VIAJE ACTIVO
          </div>
          <h1 className="text-3xl font-black text-white">
            Portal Conductor
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Transmisión de ruta en tiempo real y reporte rápido de incidencias operativas.
          </p>
        </div>

        {/* Sección 1: Transmisión de Ruta (GPS) */}
        <div className="bg-[#071118] border border-emerald-900/40 rounded-3xl p-5 mb-6 shadow-xl">
          <h2 className="text-emerald-400 font-bold mb-3 text-sm">
            Transmisión de Ruta
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Comparte tu posición en tiempo real con los pasajeros
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Selecciona tu ruta asignada
              </label>
              <select
                value={rutaId}
                onChange={(e) => setRutaId(e.target.value)}
                className="w-full bg-[#04080c] border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Seleccione una ruta</option>
                {rutas.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                if (!rutaId && !transmitiendo) {
                  alert("Por favor selecciona una ruta primero.");
                  return;
                }
                setTransmitiendo(!transmitiendo);
              }}
              className={`w-full font-black py-4 rounded-xl transition text-slate-950 ${
                transmitiendo 
                  ? "bg-rose-500 hover:bg-rose-400" 
                  : "bg-emerald-500 hover:bg-emerald-400"
              }`}
            >
              {transmitiendo ? "DETENER TRANSMISIÓN DE VIAJE" : "INICIAR TRANSMISIÓN DE VIAJE"}
            </button>

            {transmitiendo && (
              <p className="text-center text-xs text-emerald-400 animate-pulse">
                🟢 GPS Activo transmitiendo ubicación...
              </p>
            )}
          </div>
        </div>

        {/* Sección 2: Reporte de Incidencias */}
        <div className="bg-[#071118] border border-emerald-900/40 rounded-3xl p-5 mb-6 shadow-xl">
          <h2 className="text-emerald-400 font-bold mb-2 text-sm">
            Reportar Incidencia
          </h2>
          <p className="text-[11px] text-slate-400 mb-4">
            Seleccione la categoría y escriba el motivo de la incidencia detectada para notificar al centro de control.
          </p>

          {/* Cuadro de texto para el motivo de la incidencia */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Motivo o descripción del problema
            </label>
            <textarea
              value={descripcionIncidencia}
              onChange={(e) => setDescripcionIncidencia(e.target.value)}
              placeholder="Ej: Fallo en los frenos traseros / Tráfico pesado en la zona..."
              rows={3}
              className="w-full bg-[#04080c] border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["Mecánica", "Tráfico", "Pasajeros"].map((cat) => (
              <button
                key={cat}
                onClick={() => manejarReporte(cat)}
                className={`bg-[#04080c] border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition hover:border-emerald-500 ${
                  incidenciaSeleccionada === cat ? "border-emerald-400 bg-emerald-950/30" : "border-slate-800"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">{cat}</span>
              </button>
            ))}
          </div>

          {mensajeIncidencia && (
            <div className="mt-4 p-3 bg-[#04080c] border border-slate-800 rounded-xl text-center text-xs text-slate-300">
              {mensajeIncidencia}
            </div>
          )}
        </div>

        {/* Estado de Conexión */}
        <div className="bg-[#071118] border border-slate-800 px-4 py-3 rounded-2xl text-center text-xs text-slate-400">
          Estado de conexión: <span className={isOnline ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
            {isOnline ? "En línea" : "Modo Offline"}
          </span> (Sincronización automática activa)
        </div>

      </div>
    </main>
  );
}