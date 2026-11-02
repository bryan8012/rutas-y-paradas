const handleAsignar = async () => {
  try {
    const response = await fetch("/api/asignaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        rutaId: parseInt(rutaId), // Asegúrate de enviar los IDs como números
        vehiculoId: parseInt(vehiculoId), 
        conductorId: parseInt(conductorId) 
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert("¡Asignación registrada exitosamente!");
      // Aquí podrías redirigir o limpiar el formulario
    } else {
      // Si el servidor devolvió el error 400 que configuramos
      alert("Error: " + result.error); 
    }
  } catch (err) {
    alert("Ocurrió un error inesperado de conexión.");
  }
};