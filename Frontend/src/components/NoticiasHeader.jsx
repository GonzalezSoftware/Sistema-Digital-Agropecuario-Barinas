import React from 'react';
import { Bars3Icon } from "@heroicons/react/24/outline";

export const NoticiasHeader = ({ vistaActiva, escudo, gobierno, onToggleSidebar }) => {
    const obtenerTitulo = () => {
        switch (vistaActiva) {
            case "registrar":
                return "Registrar Noticia";
            case "gestion":
                return "Gestión de Artículos";
            default:
                return "Módulo de Noticias";
        }
    };

    const obtenerSubtitulo = () => {
        return "Gestión de Comunicados • Estado Barinas";
    };

    return (
        <header style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "12px",
            backgroundColor: "#ffffff",
            flexWrap: "nowrap",
            gap: "8px",
            boxSizing: "border-box",
            width: "100%"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                {/* Botón de Hamburguesa */}
                <button
                    onClick={onToggleSidebar}
                    className="menu-hamburguesa-btn"
                    style={{
                        background: "none",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        padding: "6px",
                        cursor: "pointer",
                        display: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#136442",
                        flexShrink: 0
                    }}
                >
                    <Bars3Icon style={{ width: "22px", height: "22px" }} />
                </button>
                
                <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column" }}>
                    <h2 className="header-titulo-principal" style={{ fontSize: "17px", fontWeight: 700, color: "#1e293b", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {obtenerTitulo()}
                    </h2>
                    <p className="header-subtitulo-texto" style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {obtenerSubtitulo()}
                    </p>
                </div>
            </div>

            {/* Logos / Escudos */}
            <div className="header-logos-container" style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                {escudo && (
                    <img
                        src={escudo}
                        alt="Logo Escudo"
                        style={{ height: "30px", objectFit: "contain" }}
                    />
                )}
                {gobierno && (
                    <img
                        src={gobierno}
                        alt="Logo Gobierno"
                        style={{ height: "38px", objectFit: "contain" }}
                    />
                )}
            </div>

            <style>{`
                .menu-hamburguesa-btn {
                    display: flex !important;
                }
                @media (max-width: 576px) {
                    .header-subtitulo-texto {
                        display: none !important;
                    }
                    .header-titulo-principal {
                        font-size: 15px !important;
                    }
                }
            `}</style>
        </header>
    );
};