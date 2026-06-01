import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuración necesaria para que los iconos de Leaflet se vean correctamente en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapaBarinas = ({ predios }) => {
    // AJUSTE FINO: Se amplió solo un poco hacia los lados (Longitud)
    const boundsBarinas = [
        [7.10, -71.70], // Suroeste (Un poco más a la izquierda de -71.40)
        [9.20, -67.60]  // Noreste (Un poco más a la derecha de -67.90)
    ];

    return (
        <MapContainer 
            center={[8.30, -69.75]} 
            zoom={8} 
            minZoom={8}
            maxBounds={boundsBarinas} 
            maxBoundsViscosity={1.0} 
            style={{ height: '100%', width: '100%' }}
        >
            {/* Capa de mapa minimalista (CartoDB Positron) */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap contributors'
            />

            {predios.map((p, idx) => {
                const coords = p.coordenadas ? p.coordenadas.split(',').map(Number) : null;
                
                if (coords && coords.length === 2 && !isNaN(coords[0])) {
                    return (
                        <Marker key={idx} position={[coords[0], coords[1]]}>
                            <Popup>
                                <div style={{ textAlign: 'center' }}>
                                    <strong style={{ color: '#2d572c' }}>{p.nombre_predio}</strong><br/>
                                    <span>Municipio: {p.municipio}</span>
                                </div>
                            </Popup>
                        </Marker>
                    );
                }
                return null;
            })}
        </MapContainer>
    );
};

export default MapaBarinas;