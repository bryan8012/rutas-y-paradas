'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });

const ChangeView = dynamic(() => import('react-leaflet').then((m) => {
  return function MapUpdater({ center }: { center: [number, number] }) {
    const map = m.useMap();
    useEffect(() => {
      map.setView(center, map.getZoom(), { animate: true });
      map.invalidateSize();
    }, [center, map]);
    return null;
  };
}), { ssr: false });

interface MapComponentProps {
  lat: number;
  lng: number;
}

export default function MapComponent({ lat, lng }: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);
  const [leafletIcon, setLeafletIcon] = useState<any>(null);
  
  // Guardamos las coordenadas en una referencia o usamos valores seguros para evitar parpadeos
  const position: [number, number] = [
    Number(lat) || 13.6929, 
    Number(lng) || -89.2182
  ];

  useEffect(() => {
    setIsClient(true);
    import('leaflet').then((L) => {
      const icon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      setLeafletIcon(icon);
    });
  }, []);

  // Si aún no está en el cliente o no carga el icono, mostramos el mensaje una sola vez sin parpadear
  if (!isClient || !leafletIcon) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs bg-[#04080c]">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-md relative z-0">
      <MapContainer 
        center={position} 
        zoom={15} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <ChangeView center={position} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <Marker position={position} icon={leafletIcon}>
          <Popup>
            <div className="font-bold text-slate-900">Unidad en Ruta</div>
            <div className="text-slate-700 text-xs">Lat: {lat}, Lng: {lng}</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}