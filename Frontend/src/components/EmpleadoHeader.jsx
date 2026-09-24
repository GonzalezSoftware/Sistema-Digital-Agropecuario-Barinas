import React from 'react';

export const EmpleadoHeader = ({ vistaActiva, escudo, gobierno }) => {
    const obtenerTitulo = () => {
        switch (vistaActiva) {
            case "inicio":
                return "Dashboard Predios del Municipio";
            case "predios_registro":
                return "Registro de Predios del Municipio";
            case "produccion_inicio":
                return "Dashboard Producción del Municipio";
            case "produccion_registro":
                return "Registro de Producción del Municipio";
            default:
                if (vistaActiva?.startsWith("produccion")) {
                    return "Módulo de Producción del Municipio";
                }
                return "Dashboard General del Municipio";
        }
    };

    const obtenerSubtitulo = () => {
        if (vistaActiva?.startsWith("produccion")) {
            return "Módulo de Empleados • Control de Producción • Estado Barinas";
        }
        return "Módulo de Empleados • Gestión de Predios • Estado Barinas";
    };

    return (
        <header style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "10px"
        }}>
            <div>
               <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#242525", margin: 0 }}>
                    {obtenerTitulo()}
                </h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                    {obtenerSubtitulo()}
                </p>
            </div>

            {/* --- LOGOS / ESCUDOS (Alineados a la derecha con un pequeño espacio) --- */}
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                
                {escudo && (
                    <img
                        src={escudo}
                        alt="Logo Escudo"
                        style={{ height: "40px", objectFit: "contain" }}
                    />
                )}
                {gobierno && (
                    <img
                        src={gobierno}
                        alt="Logo Gobierno"
                        style={{ height: "50px", objectFit: "contain" }}
                    />
                )}
                
            </div>
        </header>
    );
};