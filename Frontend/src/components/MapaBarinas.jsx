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
        [7.10, -71.70], // Suroeste
        [9.20, -67.60]  // Noreste
    ];

    return (
        <div className="mapa-responsive-container">
            <style>{`
                .mapa-responsive-container {
                    width: 100%;
                    height: 500px; /* Altura ideal en escritorio */
                    min-height: 400px;
                    border-radius: 12px;
                    overflow: hidden;
                    box-sizing: border-box;
                }
                @media (max-width: 992px) {
                    .mapa-responsive-container {
                        height: 400px !important;
                    }
                }
                @media (max-width: 768px) {
                    .mapa-responsive-container {
                        height: 320px !important; /* Altura perfecta y compacta en móviles para evitar el efecto alargado */
                        min-height: 300px !important;
                    }
                }
            `}</style>

            <MapContainer 
                center={[8.30, -69.75]} 
                zoom={8} 
                minZoom={7}
                maxBounds={boundsBarinas} 
                maxBoundsViscosity={1.0} 
                style={{ height: '100%', width: '100%' }}
            >
                {/* Capa oficial y gratuita de OpenStreetMap */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {predios.map((p, idx) => {
                    const coords = p.coordenadas ? p.coordenadas.split(',').map(Number) : null;
                    
                    if (coords && coords.length === 2 && !isNaN(coords[0])) {
                        return (
                            <Marker key={idx} position={[coords[0], coords[1]]}>
                                <Popup>
                                    <div style={{ textAlign: 'center', fontFamily: "'Poppins', sans-serif" }}>
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
        </div>
    );
};

export default MapaBarinas;