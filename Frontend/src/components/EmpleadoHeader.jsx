import React from 'react';

export const EmpleadoHeader = ({ vistaActiva, escudo }) => {
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
                return "Dashboard Predios del Municipio";
        }
    };

    const obtenerSubtitulo = () => {
        if (vistaActiva?.startsWith("produccion")) {
            return "Empleado • Control de Producción";
        }
        return "Empleado • Gestión de Predios";
    };

    return (
        <header className="empleado-header-container">
            <style>{`
                .empleado-header-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 30px;
                    border-bottom: 1px solid #e2e8f0;
                    padding-bottom: 10px;
                    width: 100%;
                    box-sizing: border-box;
                    gap: 12px;
                }
                .empleado-header-titles {
                    min-width: 0;
                    flex: 1;
                }
                .empleado-header-title-text {
                    font-size: 22px;
                    font-weight: 700;
                    color: #242525;
                    margin: 0;
                    word-break: break-word;
                }
                .empleado-header-logo {
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                }
                @media (max-width: 992px) {
                    .empleado-header-container {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                        margin-top: 50px !important; /* 👈 Deja espacio libre para que el botón hamburguesa no tape el título */
                        margin-bottom: 20px;
                    }
                    .empleado-header-title-text {
                        font-size: 19px !important;
                    }
                }
            `}</style>

            <div className="empleado-header-titles">
                <h2 className="empleado-header-title-text">
                    {obtenerTitulo()}
                </h2>
                <p style={{ margin: "0px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                    {obtenerSubtitulo()}
                </p>
            </div>

            {/* --- LOGO / ESCUDO --- */}
            <div className="empleado-header-logo">
                {escudo && (
                    <img
                        src={escudo}
                        alt="Logo Escudo"
                        style={{ height: "40px", objectFit: "contain" }}
                    />
                )}
            </div>
        </header>
    );
};