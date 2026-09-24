import React from 'react';
import { 
    PencilSquareIcon, 
    TrashIcon, 
    PowerIcon 
} from "@heroicons/react/24/outline";

export const NoticiasSidebar = ({
    empleadoData,
    vistaActiva,
    setVistaActiva,
    cerrarSesion
}) => {
    return (
        <aside style={{
            width: "290px",
            backgroundColor: "#136442",
            borderRight: "1px solid #0f4d34",
            height: "100vh",
            position: "sticky",
            top: 0,
            display: "flex",
            flexDirection: "column",
            padding: "24px 22px",
            boxSizing: "border-box",
            overflow: "hidden"
        }}>
            {/* Encabezado: Info del Empleado de Noticias */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "15px",
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: "18px",
                marginBottom: "20px",
                flexShrink: 0
            }}>
                <div style={{
                    width: "45px", height: "45px", borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)"
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

                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
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

            {/* Navegación Principal Directa (Sin Dashboard) */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                flex: 1,
                overflowY: "auto",
                paddingRight: "4px"
            }}>
                {/* 1. Registrar Noticia */}
                <div
                    onClick={() => setVistaActiva("registrar")}
                    style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "14px 18px", borderRadius: "14px", cursor: "pointer",
                        backgroundColor: vistaActiva === "registrar" ? "rgba(255,255,255,0.15)" : "transparent",
                        color: vistaActiva === "registrar" ? "#ffffff" : "#86efac",
                        fontWeight: vistaActiva === "registrar" ? 600 : 500,
                        fontSize: "14px",
                        transition: "all 0.25s ease"
                    }}
                    onMouseEnter={(e) => { if (vistaActiva !== "registrar") e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={(e) => { if (vistaActiva !== "registrar") e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                    <PencilSquareIcon style={{ width: "23px", height: "23px", color: vistaActiva === "registrar" ? "#ffffff" : "#86efac" }} />
                    <span>Registrar Noticia</span>
                </div>

                {/* 2. Editar / Eliminar Noticia */}
                <div
                    onClick={() => setVistaActiva("gestion")}
                    style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "14px 18px", borderRadius: "14px", cursor: "pointer",
                        backgroundColor: vistaActiva === "gestion" ? "rgba(255,255,255,0.15)" : "transparent",
                        color: vistaActiva === "gestion" ? "#ffffff" : "#86efac",
                        fontWeight: vistaActiva === "gestion" ? 600 : 500,
                        fontSize: "14px",
                        transition: "all 0.25s ease"
                    }}
                    onMouseEnter={(e) => { if (vistaActiva !== "gestion") e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={(e) => { if (vistaActiva !== "gestion") e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                    <TrashIcon style={{ width: "23px", height: "23px", color: vistaActiva === "gestion" ? "#ffffff" : "#86efac" }} />
                    <span>Editar / Eliminar Noticia</span>
                </div>
            </div>

            {/* Botón Cerrar Sesión */}
            <div
                onClick={cerrarSesion}
                style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 14px", borderRadius: "10px", cursor: "pointer",
                    color: "#fca5a5", fontSize: "14px", fontWeight: 600,
                    marginTop: "16px", flexShrink: 0,
                    transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
                <PowerIcon style={{ width: "20px", height: "20px", color: "#fca5a5" }} />
                <span>Cerrar Sesión</span>
            </div>
        </aside>
    );
};