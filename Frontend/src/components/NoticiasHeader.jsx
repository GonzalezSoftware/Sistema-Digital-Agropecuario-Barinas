import React from 'react';
import { Bars3Icon } from "@heroicons/react/24/outline";

export const NoticiasHeader = ({ vistaActiva, escudo, gobierno, onToggleSidebar }) => {
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
            backgroundColor: "#ffffff",
            flexWrap: "nowrap", // Evita que los elementos bajen automáticamente de forma vertical
            gap: "16px",
            boxSizing: "border-box",
            width: "100%"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
                {/* Botón de Hamburguesa */}
                <button
                    onClick={onToggleSidebar}
                    className="menu-hamburguesa-btn"
                    style={{
                        background: "none",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        padding: "8px",
                        cursor: "pointer",
                        display: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#136442",
                        flexShrink: 0
                    }}
                >
                    <Bars3Icon style={{ width: "24px", height: "24px" }} />
                </button>
                
                {/* Contenedor de textos con minWidth: 0 obligatorio para prevenir desbordes o columnas forzadas */}
                <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {obtenerTitulo()}
                    </h2>
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {obtenerSubtitulo()}
                    </p>
                </div>
            </div>

            {/* Logos / Escudos */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                {escudo && (
                    <img
                        src={escudo}
                        alt="Logo Escudo"
                        style={{ height: "35px", objectFit: "contain" }}
                    />
                )}
                {gobierno && (
                    <img
                        src={gobierno}
                        alt="Logo Gobierno"
                        style={{ height: "45px", objectFit: "contain" }}
                    />
                )}
            </div>

            <style>{`
                @media (max-width: 992px) {
                    .menu-hamburguesa-btn {
                        display: flex !important;
                    }
                }
            `}</style>
        </header>
    );
};