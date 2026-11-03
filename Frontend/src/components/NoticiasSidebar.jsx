import React from 'react';
import { 
    PencilSquareIcon, 
    TrashIcon, 
    PowerIcon,
    XMarkIcon 
} from "@heroicons/react/24/outline";

export const NoticiasSidebar = ({
    empleadoData,
    vistaActiva,
    setVistaActiva,
    cerrarSesion,
    isOpen,
    setIsOpen
}) => {
    return (
        <>
            {/* Overlay oscuro de fondo al abrir el menú en móviles */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 999,
                        display: "none"
                    }}
                    className="sidebar-overlay"
                />
            )}

            <aside className={`noticias-sidebar ${isOpen ? "open" : ""}`} style={{
                width: "280px",
                backgroundColor: "#136442",
                borderRight: "1px solid #0f4d34",
                height: "100vh",
                position: "sticky",
                top: 0,
                display: "flex",
                flexDirection: "column",
                padding: "20px 16px",
                boxSizing: "border-box",
                flexShrink: 0,
                zIndex: 1000,
                transition: "transform 0.3s ease-in-out"
            }}>
                <style>{`
                    @media (max-width: 992px) {
                        .noticias-sidebar {
                            position: fixed !important;
                            top: 0;
                            left: 0;
                            transform: translateX(-100%);
                            height: 100vh !important;
                            box-shadow: 5px 0 15px rgba(0,0,0,0.2);
                        }
                        .noticias-sidebar.open {
                            transform: translateX(0) !important;
                        }
                        .sidebar-overlay {
                            display: block !important;
                        }
                        .close-sidebar-btn {
                            display: flex !important;
                        }
                    }
                `}</style>

                {/* Botón de cierre para móviles */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="close-sidebar-btn"
                        style={{
                            background: "none",
                            border: "none",
                            color: "#fff",
                            cursor: "pointer",
                            display: "none",
                            padding: "4px"
                        }}
                    >
                        <XMarkIcon style={{ width: "24px", height: "24px" }} />
                    </button>
                </div>

                {/* Encabezado: Info del Empleado */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    marginBottom: "20px",
                    flexShrink: 0,
                    boxSizing: "border-box"
                }}>
                    <div style={{
                        width: "40px", height: "40px", borderRadius: "10px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)", flexShrink: 0
                    }}>
                        <img
                            src={
                                empleadoData?.foto ||
                                `https://ui-avatars.com/api/?name=${empleadoData?.nombre || empleadoData?.usuario || "Empleado Noticias"}&background=0f4d34&color=ffffff&bold=true`
                            }
                            alt="Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                        <span style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            {empleadoData?.nombre || empleadoData?.usuario || "Empleado de Noticias"}
                        </span>
                        <span style={{
                            fontSize: "11px",
                            color: "#86efac",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            Módulo Informativo
                        </span>
                    </div>
                </div>

                {/* Opciones de Navegación Principal */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    flex: 1,
                    overflowY: "auto"
                }}>
                    {/* 1. Registrar Noticia */}
                    <div
                        onClick={() => {
                            setVistaActiva("registrar");
                            setIsOpen(false);
                        }}
                        style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "12px 14px", borderRadius: "12px", cursor: "pointer",
                            backgroundColor: vistaActiva === "registrar" ? "rgba(255,255,255,0.15)" : "transparent",
                            color: vistaActiva === "registrar" ? "#ffffff" : "#86efac",
                            fontWeight: vistaActiva === "registrar" ? 600 : 500,
                            fontSize: "13px",
                            transition: "all 0.25s ease",
                            boxSizing: "border-box"
                        }}
                    >
                        <PencilSquareIcon style={{ width: "22px", height: "22px", flexShrink: 0, color: vistaActiva === "registrar" ? "#ffffff" : "#86efac" }} />
                        <span>Registrar Noticia</span>
                    </div>

                    {/* 2. Eliminar Noticia */}
                    <div
                        onClick={() => {
                            setVistaActiva("gestion");
                            setIsOpen(false);
                        }}
                        style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "12px 14px", borderRadius: "12px", cursor: "pointer",
                            backgroundColor: vistaActiva === "gestion" ? "rgba(255,255,255,0.15)" : "transparent",
                            color: vistaActiva === "gestion" ? "#ffffff" : "#86efac",
                            fontWeight: vistaActiva === "gestion" ? 600 : 500,
                            fontSize: "13px",
                            transition: "all 0.25s ease",
                            boxSizing: "border-box"
                        }}
                    >
                        <TrashIcon style={{ width: "22px", height: "22px", flexShrink: 0, color: vistaActiva === "gestion" ? "#ffffff" : "#86efac" }} />
                        <span>Eliminar Noticia</span>
                    </div>
                </div>

                {/* Botón Cerrar Sesión */}
                <div
                    onClick={cerrarSesion}
                    style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "12px 14px", borderRadius: "10px", cursor: "pointer",
                        color: "#fca5a5", fontSize: "13px", fontWeight: 600,
                        marginTop: "16px", flexShrink: 0,
                        boxSizing: "border-box"
                    }}
                >
                    <PowerIcon style={{ width: "20px", height: "20px", flexShrink: 0, color: "#fca5a5" }} />
                    <span>Cerrar Sesión</span>
                </div>
            </aside>
        </>
    );
};