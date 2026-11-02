"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Solución para el icono por defecto de Leaflet en Next.js
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ 
  lat, 
  lng, 
  onChange 
}: { 
  lat: number; 
  lng: number; 
  onChange: (lat: number, lng: number) => void; 
}) {
  useMapEvents({
    click(e) {
      // Llamamos a la función onChange pasada por props
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return lat && lng ? <Marker position={[lat, lng]} icon={customIcon} /> : null;
}

export default function MapaRuta({ 
  lat, 
  lng, 
  onChange 
}: { 
  lat: number; 
  lng: number; 
  onChange: (lat: number, lng: number) => void; 
}) {
  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden border-2 border-slate-700">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>
    </div>
  );
}