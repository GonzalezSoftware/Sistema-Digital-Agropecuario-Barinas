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
        <header className="noticias-header-container" style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "24px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "16px",
            backgroundColor: "#ffffff",
            boxSizing: "border-box",
            width: "100%"
        }}>
            <style>{`
                .noticias-header-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    box-sizing: border-box;
                }
                .menu-hamburguesa-btn {
                    display: flex !important;
                    background: none;
                    border: 1px solid #cbd5e1;
                    borderRadius: 8px;
                    padding: 8px;
                    cursor: pointer;
                    align-items: center;
                    justify-content: center;
                    color: "#136442";
                    flex-shrink: 0;
                }
                .header-logos-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-shrink: 0;
                }
                .header-textos-wrapper {
                    width: 100%;
                    box-sizing: border-box;
                }
            `}</style>

            {/* Fila superior: Botón de menú y los logos a los extremos */}
            <div className="noticias-header-top">
                <button
                    onClick={onToggleSidebar}
                    className="menu-hamburguesa-btn"
                    title="Abrir menú"
                >
                    <Bars3Icon style={{ width: "24px", height: "24px", color: "#136442" }} />
                </button>

                <div className="header-logos-wrapper">
                    {escudo && (
                        <img
                            src={escudo}
                            alt="Logo Escudo"
                            style={{ height: "32px", objectFit: "contain" }}
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
            </div>

            {/* Fila inferior: Títulos completos y subtítulos visibles sin recortes */}
            <div className="header-textos-wrapper">
                <h2 style={{ 
                    fontSize: "18px", 
                    fontWeight: 700, 
                    color: "#1e293b", 
                    margin: 0, 
                    wordBreak: "break-word",
                    lineHeight: "1.3"
                }}>
                    {obtenerTitulo()}
                </h2>
                <p style={{ 
                    margin: "4px 0 0 0", 
                    fontSize: "12px", 
                    color: "#64748b", 
                    wordBreak: "break-word",
                    lineHeight: "1.4"
                }}>
                    {obtenerSubtitulo()}
                </p>
            </div>
        </header>
    );
};