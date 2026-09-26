import React, { useState } from 'react';
import { 
    ChevronDownIcon, 
    PresentationChartBarIcon as DefaultChartIcon,
    MapIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    CircleStackIcon, 
    CheckCircleIcon, 
    DocumentTextIcon, 
    ArrowPathIcon, 
    DocumentChartBarIcon,
    TagIcon // 🔹 1. Icono añadido para la Licencia de Hierro
} from "@heroicons/react/24/outline";

export const EmpleadoSidebar = ({
    empleadoData,
    vistaActiva,
    setVistaActiva,
    cerrarSesion,
    predioActivo,
    PresentationChartBarIcon = DefaultChartIcon,
    PowerIcon,
}) => {
    const [prediosAbierto, setPrediosAbierto] = useState(
        vistaActiva === "inicio" || vistaActiva?.startsWith("predios")
    );
    const [produccionAbierto, setProduccionAbierto] = useState(
        vistaActiva?.startsWith("produccion")
    );

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
            {/* Encabezado: Info del Empleado y Predio Seleccionado */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "15px",
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: "18px",
                marginBottom: "20px",
                flexShrink: 0
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "45px", height: "45px", borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)"
                    }}>
                        <img
                            src={
                                empleadoData?.foto ||
                                `https://ui-avatars.com/api/?name=${empleadoData?.nombre || empleadoData?.usuario || "Empleado"}&background=0f4d34&color=ffffff&bold=true`
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
                            {empleadoData?.nombre || empleadoData?.usuario || "Empleado"}
                        </span>

                        <span style={{
                            fontSize: "11px",
                            color: "#86efac",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            {empleadoData?.municipio ? `Municipio ${empleadoData.municipio}` : "Municipio Asignado"}
                        </span>
                    </div>
                </div>

                {/* Indicador del Predio Seleccionado */}
                <div style={{
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid rgba(134, 239, 172, 0.2)"
                }}>
                    <span style={{ fontSize: "10px", color: "#cbd5e1", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Predio Activo:
                    </span>
                    <span style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: predioActivo ? "#f8fafc" : "#94a3b8",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block"
                    }}>
                        {predioActivo?.nombre_predio || "Ninguno seleccionado"}
                    </span>
                </div>
            </div>

            {/* Navegación de Opciones */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                flex: 1,
                overflowY: "auto",
                paddingRight: "4px"
            }}>
                {/* 1. PREDIOS */}
                <div>
                    <div
                        onClick={() => setPrediosAbierto(!prediosAbierto)}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "14px 18px", borderRadius: "14px", cursor: "pointer", marginBottom: "4px",
                            transition: "all 0.25s ease", backgroundColor: "transparent", color: "#86efac", fontWeight: 500, fontSize: "14px"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <MapIcon style={{ width: "23px", height: "23px", color: "#86efac" }} />
                            <span>Predios</span>
                        </div>
                        <ChevronDownIcon style={{
                            width: "17px", height: "17px", color: "#86efac",
                            transform: prediosAbierto ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s ease"
                        }} />
                    </div>

                    {prediosAbierto && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "20px", marginTop: "4px", marginBottom: "8px", borderLeft: "2px solid rgba(134, 239, 172, 0.2)" }}>
                            <div onClick={() => setVistaActiva("inicio")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "inicio" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "inicio" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                <ChartBarIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Inicio</span>
                            </div>
                            <div onClick={() => setVistaActiva("predios_registro")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "predios_registro" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_registro" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                <ClipboardDocumentListIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Registro</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. PRODUCCIÓN */}
                <div>
                    <div
                        onClick={() => setProduccionAbierto(!produccionAbierto)}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "14px 18px", borderRadius: "14px", cursor: "pointer", marginBottom: "4px",
                            transition: "all 0.25s ease", backgroundColor: "transparent", color: "#86efac", fontWeight: 500, fontSize: "14px"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <CircleStackIcon style={{ width: "23px", height: "23px", color: "#86efac" }} />
                            <span>Producción</span>
                        </div>
                        <ChevronDownIcon style={{
                            width: "17px", height: "17px", color: "#86efac",
                            transform: produccionAbierto ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s ease"
                        }} />
                    </div>

                    {produccionAbierto && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "20px", marginTop: "4px", marginBottom: "8px", borderLeft: "2px solid rgba(134, 239, 172, 0.2)" }}>
                            <div onClick={() => setVistaActiva("produccion_inicio")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_inicio" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_inicio" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                <ChartBarIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Inicio</span>
                            </div>
                            <div onClick={() => setVistaActiva("produccion_seleccionar_predio")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_seleccionar_predio" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_seleccionar_predio" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                <CheckCircleIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Seleccionar Predio</span>
                            </div>
                            <div onClick={() => setVistaActiva("produccion_caracterizacion")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_caracterizacion" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_caracterizacion" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                <DocumentTextIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Caracterización</span>
                            </div>
                            {/* 🔹 Opción Integrada de Licencia de Hierro */}
                            <div onClick={() => setVistaActiva("produccion_hierro")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_hierro" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_hierro" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                <TagIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Licencia de Hierro</span>
                            </div>
                            <div onClick={() => setVistaActiva("produccion_actualizacion")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_actualizacion" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_actualizacion" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                <ArrowPathIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Actualización Productiva</span>
                            </div>
                            <div onClick={() => setVistaActiva("produccion_reportes")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_reportes" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_reportes" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                <DocumentChartBarIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Reportes</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Botón Cerrar Sesión */}
            <div onClick={cerrarSesion} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "10px", cursor: "pointer", color: "#fca5a5", fontSize: "14px", fontWeight: 600, marginTop: "16px", flexShrink: 0 }}>
                {PowerIcon && <PowerIcon style={{ width: "20px", height: "20px", color: "#fca5a5" }} />}
                <span>Cerrar Sesión</span>
            </div>
        </aside>
    );
};