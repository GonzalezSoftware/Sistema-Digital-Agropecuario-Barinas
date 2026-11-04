import React, { useState } from 'react';
import { 
    PencilSquareIcon, 
    TrashIcon, 
    PowerIcon,
    Bars3Icon,
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
    const [sidebarAbiertoInterno, setSidebarAbiertoInterno] = useState(false);
    
    const sidebarAbierto = isOpen !== undefined ? isOpen : sidebarAbiertoInterno;
    const setSidebarAbierto = setIsOpen || setSidebarAbiertoInterno;

    const seleccionarVista = (vista) => {
        setVistaActiva(vista);
        setSidebarAbierto(false);
    };

    return (
        <>
            {/* ── BOTÓN HAMBURGUESA MÓVIL ── */}
            <button
                onClick={() => setSidebarAbierto(!sidebarAbierto)}
                className="btn-hamburguesa-noticias"
                style={{
                    display: "none",
                    position: "fixed",
                    top: "12px",
                    left: "12px",
                    zIndex: 1100,
                    backgroundColor: "#136442",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                aria-label="Menú de navegación"
            >
                {sidebarAbierto ? <XMarkIcon style={{ width: "22px", height: "22px" }} /> : <Bars3Icon style={{ width: "22px", height: "22px" }} />}
            </button>

            {/* ── FONDO OSCURO EN MÓVIL ── */}
            {sidebarAbierto && (
                <div
                    onClick={() => setSidebarAbierto(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 999,
                        display: "none"
                    }}
                    className="sidebar-overlay-noticias"
                />
            )}

            {/* ── ASIDE (SIDEBAR) ── */}
            <aside 
                className={`noticias-sidebar ${sidebarAbierto ? "abierto" : ""}`}
                style={{
                    width: "290px",
                    backgroundColor: "#136442",
                    borderRight: "1px solid #0f4d34",
                    height: "100vh",
                    position: "sticky",
                    top: 0,
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px 18px",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    zIndex: 1000,
                    transition: "transform 0.3s ease-in-out",
                    flexShrink: 0
                }}
            >
                {/* Info del Empleado de Noticias */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 15px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    marginBottom: "16px",
                    flexShrink: 0
                }}>
                    <div style={{
                        width: "42px", height: "42px", borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)", flexShrink: 0
                    }}>
                        <img
                            src={
                                empleadoData?.foto ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    empleadoData?.nombre || empleadoData?.usuario || "Empleado Noticias"
                                )}&background=0f4d34&color=ffffff&bold=true`
                            }
                            alt="Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                        <span style={{
                            fontSize: "14px",
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

                {/* Lista de Opciones de Noticias */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    flex: 1,
                    overflowY: "auto",
                    paddingRight: "4px"
                }}>
                    {/* 1. Registrar Noticia */}
                    <div
                        onClick={() => seleccionarVista("registrar")}
                        style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "12px 16px", borderRadius: "12px", cursor: "pointer",
                            backgroundColor: vistaActiva === "registrar" ? "rgba(255,255,255,0.15)" : "transparent",
                            color: vistaActiva === "registrar" ? "#ffffff" : "#86efac",
                            fontWeight: vistaActiva === "registrar" ? 600 : 500,
                            fontSize: "14px",
                            transition: "all 0.25s ease"
                        }}
                    >
                        <PencilSquareIcon style={{ width: "22px", height: "22px", color: vistaActiva === "registrar" ? "#ffffff" : "#86efac" }} />
                        <span>Registrar Noticia</span>
                    </div>

                    {/* 2. Eliminar Noticia */}
                    <div
                        onClick={() => seleccionarVista("gestion")}
                        style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "12px 16px", borderRadius: "12px", cursor: "pointer",
                            backgroundColor: vistaActiva === "gestion" ? "rgba(255,255,255,0.15)" : "transparent",
                            color: vistaActiva === "gestion" ? "#ffffff" : "#86efac",
                            fontWeight: vistaActiva === "gestion" ? 600 : 500,
                            fontSize: "14px",
                            transition: "all 0.25s ease"
                        }}
                    >
                        <TrashIcon style={{ width: "22px", height: "22px", color: vistaActiva === "gestion" ? "#ffffff" : "#86efac" }} />
                        <span>Eliminar Noticia</span>
                    </div>
                </div>

                {/* Botón Cerrar Sesión (Más pegado a las opciones de arriba) */}
                <div
                    onClick={cerrarSesion}
                    style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "12px 16px", borderRadius: "12px", cursor: "pointer",
                        color: "#fca5a5", fontSize: "14px", fontWeight: 600,
                        marginTop: "8px", flexShrink: 0,
                        backgroundColor: "rgba(252, 165, 165, 0.08)",
                        transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(252, 165, 165, 0.18)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(252, 165, 165, 0.08)"}
                >
                    <PowerIcon style={{ width: "20px", height: "20px", color: "#fca5a5" }} />
                    <span>Cerrar Sesión</span>
                </div>
            </aside>

            {/* Estilos CSS Responsive */}
            <style>{`
                @media (max-width: 992px) {
                    .btn-hamburguesa-noticias {
                        display: flex !important;
                    }
                    .sidebar-overlay-noticias {
                        display: block !important;
                    }
                    .noticias-sidebar {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        transform: translateX(-100%);
                        z-index: 1050 !important;
                        box-shadow: 5px 0 25px rgba(0,0,0,0.3);
                        max-width: 290px !important;
                        width: 85% !important;
                    }
                    .noticias-sidebar.abierto {
                        transform: translateX(0) !important;
                    }
                }
            `}</style>
        </>
    );
};