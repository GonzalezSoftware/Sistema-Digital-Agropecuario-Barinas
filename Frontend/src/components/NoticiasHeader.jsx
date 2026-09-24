import React from 'react';

export const NoticiasHeader = ({ vistaActiva, escudo, gobierno }) => {
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
        return "Módulo de Empleados • Gestión de Comunicados • Estado Barinas";
    };

    return (
        <header style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "16px",
            backgroundColor: "#ffffff"
        }}>
            <div>
                <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
                    {obtenerTitulo()}
                </h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                    {obtenerSubtitulo()}
                </p>
            </div>

            {/* Logos / Escudos */}
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