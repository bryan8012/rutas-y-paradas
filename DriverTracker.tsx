"use client";

import { useEffect } from "react";

interface DriverTrackerProps {
  rutaId: number; // El ID de la ruta activa que está conduciendo
}

export default function DriverTracker({ rutaId }: DriverTrackerProps) {
  useEffect(() => {
    // Verificar si el navegador del celular soporta geolocalización
    if (!navigator.geolocation) {
      console.error("La geolocalización no es compatible con este navegador.");
      return;
    }

    // Opciones para asegurar alta precisión en dispositivos móviles
    const options = {
      enableHighAccuracy: true,
      maximumAge: 5000,      // No usar caché antigua (máximo 5 segundos)
      timeout: 10000,        // Tiempo límite de espera para la señal GPS
    };

    // Monitorear continuamente el movimiento del celular
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Enviar las coordenadas actuales a tu API
          const response = await fetch("/api/conductor/ubicacion", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              rutaId,
              latitud: latitude,
              longitud: longitude,
            }),
          });

          if (!response.ok) {
            console.error("Error al sincronizar la ubicación en el servidor.");
          }
        } catch (error) {
          console.error("Error de red al enviar la ubicación:", error);
        }
      },
      (error) => {
        console.warn(`Error de GPS (${error.code}): ${error.message}`);
      },
      options
    );

    // Limpiar el rastreo cuando el conductor cierre la vista o cambie de página
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [rutaId]);

  // Este componente es puramente lógico en segundo plano, no renderiza elementos visuales
  return null;
}