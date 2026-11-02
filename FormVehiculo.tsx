'use client'

import { useActionState } from 'react';
import { createVehiculo } from '../../action'; // Ajusta esta ruta según donde esté action.ts

export default function FormVehiculo() {
  // useActionState ayuda a manejar el estado del formulario (cargando, errores, etc.)
  const [state, action, isPending] = useActionState(async (previousState: any, formData: FormData) => {
    try {
      await createVehiculo(formData);
      return { success: true, message: "Vehículo registrado correctamente" };
    } catch (error) {
      return { success: false, message: "Error al registrar el vehículo" };
    }
  }, null);

  return (
    <form action={action} className="p-4 border rounded shadow-sm">
      <div className="mb-3">
        <label className="block text-sm font-medium">Placa</label>
        <input 
          name="placa" 
          required 
          className="border p-2 w-full rounded" 
          placeholder="Ej: ABC-123"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Modelo</label>
        <input 
          name="modelo" 
          required 
          className="border p-2 w-full rounded" 
          placeholder="Ej: Toyota Hilux"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Capacidad (kg)</label>
        <input 
          name="capacidad" 
          type="number" 
          required 
          className="border p-2 w-full rounded"
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isPending ? "Guardando..." : "Guardar Vehículo"}
      </button>

      {/* Mensaje de respuesta */}
      {state && (
        <p className={`mt-3 text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}