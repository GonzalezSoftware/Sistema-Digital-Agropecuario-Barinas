import React from 'react';

export const NoticiasHeader = ({ vistaActiva, escudo }) => {
    const obtenerTitulo = () => {
        switch (vistaActiva) {
            case "registrar":
                return "Registro de Nuevas Noticias";
            case "gestion":
                return "Edición y Eliminación de Artículos";
            default:
                return "Módulo del Empleado de Noticias";
        }
    };

    const obtenerSubtitulo = () => {
        return "Empleado • Gestión de Comunicados";
    };

    return (
        <header className="noticias-header-container">
            <style>{`
                .noticias-header-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                    border-bottom: 1px solid #e2e8f0;
                    padding-bottom: 10px;
                    width: 100%;
                    box-sizing: border-box;
                    gap: 12px;
                }
                .noticias-header-titles {
                    min-width: 0;
                    flex: 1;
                }
                .noticias-header-title-text {
                    font-size: 22px;
                    font-weight: 700;
                    color: #242525;
                    margin: 0;
                    word-break: break-word;
                }
                .noticias-header-logo {
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                }
                @media (max-width: 992px) {
                    .noticias-header-container {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                        margin-top: 48px !important; /* Espacio exacto para el botón de menú flotante */
                        margin-bottom: 16px;
                    }
                    .noticias-header-title-text {
                        font-size: 19px !important;
                    }
                }
            `}</style>

            <div className="noticias-header-titles">
                <h2 className="noticias-header-title-text">
                    {obtenerTitulo()}
                </h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                    {obtenerSubtitulo()}
                </p>
            </div>

            {/* --- LOGO / ESCUDO --- */}
            <div className="noticias-header-logo">
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