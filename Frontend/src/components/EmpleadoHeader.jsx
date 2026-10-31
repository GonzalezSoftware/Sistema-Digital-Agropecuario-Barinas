import React from 'react';

export const EmpleadoHeader = ({ vistaActiva, escudo, gobierno }) => {
    const obtenerTitulo = () => {
        switch (vistaActiva) {
            case "inicio":
                return "Dashboard Predios del Municipio";
            case "predios_registro":
                return "Registro de Predios del Municipio";
            case "predios_historial":
                return "Historial de Predios del Municipio";
            case "predios_georreferenciacion":
                return "Georreferenciación de Predios";
            case "predios_reportes":
                return "Reportes de Predios";
            case "produccion_inicio":
                return "Dashboard Producción";
            case "produccion_seleccionar_predio":
                return "Seleccionar Predio";
            case "produccion_caracterizacion":
                return "Caracterización de Predio";
            case "produccion_actualizacion":
                return "Actualización Productiva";
            case "produccion_reportes":
                return "Reportes de Producción";
            default:
                if (vistaActiva?.startsWith("produccion")) {
                    return "Módulo de Producción";
                }
                return "Módulo de Empleados";
        }
    };

    const obtenerSubtitulo = () => {
        if (vistaActiva?.startsWith("produccion")) {
            return "Empleado • Control de Producción • Estado Barinas";
        }
        return "Empleado • Gestión de Predios • Estado Barinas";
    };

    return (
        <header className="empleado-header-container">
            <style>{`
                .empleado-header-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                    border-bottom: 1px solid #e2e8f0;
                    padding-bottom: 12px;
                    width: 100%;
                    box-sizing: border-box;
                    gap: 12px;
                }
                .empleado-header-titles {
                    min-width: 0;
                    flex: 1;
                }
                .empleado-header-title-text {
                    font-size: 20px;
                    font-weight: 700;
                    color: #242525;
                    margin: 0;
                    word-break: break-word;
                }
                .empleado-header-logos {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-shrink: 0;
                }
                @media (max-width: 768px) {
                    .empleado-header-container {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }
                    .empleado-header-title-text {
                        font-size: 18px !important;
                    }
                    .empleado-header-logos {
                        width: 100%;
                        justify-content: flex-start;
                    }
                }
            `}</style>

            <div className="empleado-header-titles">
                <h2 className="empleado-header-title-text">
                    {obtenerTitulo()}
                </h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#64748b" }}>
                    {obtenerSubtitulo()}
                </p>
            </div>

            {/* --- LOGOS / ESCUDOS --- */}
            <div className="empleado-header-logos">
                {escudo && (
                    <img
                        src={escudo}
                        alt="Logo Escudo"
                        style={{ height: "36px", objectFit: "contain" }}
                    />
                )}
                {gobierno && (
                    <img
                        src={gobierno}
                        alt="Logo Gobierno"
                        style={{ height: "42px", objectFit: "contain" }}
                    />
                )}
            </div>
        </header>
    );
};