import React from "react";
import MapaBarinas from "../components/MapaBarinas";

// 1. El componente Spinner corporativo integrado
export const Spinner = ({ color = "#136442" }) => {
    const spinnerRef = (el) => {
        if (el) {
            el.animate(
                [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
                { duration: 1000, iterations: Infinity }
            );
        }
    };

    return (
        <svg
            ref={spinnerRef}
            width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
};

export default function VistaMapaPredios({ listaPredios, municipios, cargando }) {
    
    // 2. Validación de carga idéntica a las demás vistas
    if (cargando) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px",
                gap: "12px",
                color: "#136442",
                fontSize: "13px",
                fontWeight: "500",
                fontFamily: "'Poppins', sans-serif"
            }}>
                <Spinner color="#136442" />
                <span>Cargando mapa y distribución de predios...</span>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto", animation: "fadeIn 0.5s", fontFamily: "'Poppins', sans-serif", boxSizing: "border-box" }}>
            
            <style>{`
                .map-wrapper-container {
                    height: 480px; /* Reducido de 600px a 480px para darle una proporción más cuadrada y estética */
                }
                @media (max-width: 768px) {
                    .map-wrapper-container {
                        height: 380px !important;
                    }
                }
            `}</style>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", boxSizing: "border-box" }}>

                {/* SECCIÓN SUPERIOR: EL MAPA CON PROPORCIÓN CUADRADA */}
                <div style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    padding: "10px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    border: "1px solid #e0e0e0",
                    boxSizing: "border-box"
                }} className="map-wrapper-container">
                    <div style={{ height: "100%", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                        <MapaBarinas predios={listaPredios} />
                    </div>
                </div>
            </div>
        </div>
    );
}