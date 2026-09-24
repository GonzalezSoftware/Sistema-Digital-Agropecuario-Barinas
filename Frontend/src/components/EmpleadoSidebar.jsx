import React, { useState } from 'react';
import { 
    ChevronDownIcon, 
    PresentationChartBarIcon as DefaultChartIcon,
    MapIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    CircleStackIcon // Nuevo icono moderno para el menú principal de Producción
} from "@heroicons/react/24/outline";

export const EmpleadoSidebar = ({
    empleadoData,
    vistaActiva,
    setVistaActiva,
    cerrarSesion,
    PresentationChartBarIcon = DefaultChartIcon,
    PowerIcon,
}) => {
    // Estados para controlar los menús desplegables de manera independiente
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
            {/* Encabezado: Info del Empleado (Fijo arriba) */}
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
                            `https://ui-avatars.com/api/?name=${empleadoData?.nombre || empleadoData?.usuario || "Empleado"}&background=0f4d34&color=ffffff&bold=true`
                        }
                        alt="Profile"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    {/* Línea Superior: Muestra el nombre limpio */}
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

                    {/* Línea Inferior: Muestra el Municipio correspondiente */}
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
                            transition: "all 0.25s ease",
                            backgroundColor: "transparent",
                            color: "#86efac",
                            fontWeight: 500,
                            fontSize: "14px"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <MapIcon style={{ width: "23px", height: "23px", color: "#86efac" }} />
                            <span>Predios</span>
                        </div>
                        
                        <ChevronDownIcon style={{
                            width: "17px",
                            height: "17px",
                            color: "#86efac",
                            transform: prediosAbierto ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s ease"
                        }} />
                    </div>

                    {/* Submenú desplegable de Predios */}
                    {prediosAbierto && (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            paddingLeft: "20px",
                            marginTop: "4px",
                            marginBottom: "8px",
                            borderLeft: "2px solid rgba(134, 239, 172, 0.2)"
                        }}>
                            {/* Opción Inicio */}
                            <div
                                onClick={() => setVistaActiva("inicio")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "inicio" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "inicio" ? "#ffffff" : "#86efac",
                                    fontWeight: vistaActiva === "inicio" ? 600 : 400,
                                    fontSize: "13px",
                                    transition: "background 0.2s"
                                }}
                            >
                                <ChartBarIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Inicio</span>
                            </div>

                            {/* Opción Registro */}
                            <div
                                onClick={() => setVistaActiva("predios_registro")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "predios_registro" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "predios_registro" ? "#ffffff" : "#86efac",
                                    fontWeight: vistaActiva === "predios_registro" ? 600 : 400,
                                    fontSize: "13px",
                                    transition: "background 0.2s"
                                }}
                            >
                                <ClipboardDocumentListIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Registro</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. PRODUCCIÓN (Menú Principal con CircleStackIcon) */}
                <div>
                    <div
                        onClick={() => setProduccionAbierto(!produccionAbierto)}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "14px 18px", borderRadius: "14px", cursor: "pointer", marginBottom: "4px",
                            transition: "all 0.25s ease",
                            backgroundColor: "transparent",
                            color: "#86efac",
                            fontWeight: 500,
                            fontSize: "14px"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <CircleStackIcon style={{ width: "23px", height: "23px", color: "#86efac" }} />
                            <span>Producción</span>
                        </div>
                        
                        <ChevronDownIcon style={{
                            width: "17px",
                            height: "17px",
                            color: "#86efac",
                            transform: produccionAbierto ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s ease"
                        }} />
                    </div>

                    {/* Submenú desplegable de Producción */}
                    {produccionAbierto && (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            paddingLeft: "20px",
                            marginTop: "4px",
                            marginBottom: "8px",
                            borderLeft: "2px solid rgba(134, 239, 172, 0.2)"
                        }}>
                            <div
                                onClick={() => setVistaActiva("produccion_inicio")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "produccion_inicio" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "produccion_inicio" ? "#ffffff" : "#86efac",
                                    fontWeight: vistaActiva === "produccion_inicio" ? 600 : 400,
                                    fontSize: "13px",
                                    transition: "background 0.2s"
                                }}
                            >
                                <ChartBarIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Inicio</span>
                            </div>
                        </div>
                    )}
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
            >
                {PowerIcon && <PowerIcon style={{ width: "20px", height: "20px", color: "#fca5a5" }} />}
                <span>Cerrar Sesión</span>
            </div>
        </aside>
    );
};