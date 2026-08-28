import React, { useState } from 'react';
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import MapPinIcon from "@heroicons/react/24/solid/MapPinIcon"; 
import DocumentChartBarIcon from "@heroicons/react/24/solid/DocumentChartBarIcon"; 
import Cog6ToothIcon from "@heroicons/react/24/solid/Cog6ToothIcon"; // ⚙️ Importamos el icono para configuración

export const AdminSidebar = ({
    adminData,
    vistaActiva,
    setVistaActiva,
    cerrarSesion,
    PresentationChartBarIcon,
    KeyIcon,
    ClockIcon,
    PowerIcon,
}) => {
    // Estado para controlar si el menú desplegable de Predios está abierto o cerrado
    const [prediosAbierto, setPrediosAbierto] = useState(
        vistaActiva === "inicio" || 
        vistaActiva === "credenciales" || 
        vistaActiva === "historial" || 
        vistaActiva === "georreferenciacion" || 
        vistaActiva === "reportes" || 
        vistaActiva === "predios"
    );

    // Estado para controlar si el menú desplegable de Configuración está abierto o cerrado (puedes ajustarlo según las vistas que manejes)
    const [configuracionAbierto, setConfiguracionAbierto] = useState(
        vistaActiva === "configuracion"
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
            {/* Encabezado: Info del Usuario (Fijo arriba) */}
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
                            adminData?.foto ||
                            `https://ui-avatars.com/api/?name=${adminData?.nombre || adminData?.usuario || "Admin"}&background=0f4d34&color=ffffff&bold=true`
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
                        {adminData?.nombre || adminData?.usuario || "Administrador"}
                    </span>

                    <span style={{
                        fontSize: "11px",
                        color: "#86efac"
                    }}>
                        {adminData?.rol || "Administrador"}
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
                {/* MENÚ PRINCIPAL: Predios */}
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
                            {PresentationChartBarIcon && <PresentationChartBarIcon style={{ width: "23px", height: "23px", color: "#86efac" }} />}
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
                                {PresentationChartBarIcon && <PresentationChartBarIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />}
                                <span>Listado General</span>
                            </div>

                            <div
                                onClick={() => setVistaActiva("credenciales")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "credenciales" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "credenciales" ? "#ffffff" : "#86efac",
                                    fontWeight: vistaActiva === "credenciales" ? 600 : 400,
                                    fontSize: "13px",
                                    transition: "background 0.2s"
                                }}
                            >
                                {KeyIcon && <KeyIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />}
                                <span>Credenciales Usuarios</span>
                            </div>

                            <div
                                onClick={() => setVistaActiva("historial")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "historial" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "historial" ? "#ffffff" : "#86efac",
                                    fontWeight: vistaActiva === "historial" ? 600 : 400,
                                    fontSize: "13px",
                                    transition: "background 0.2s"
                                }}
                            >
                                {ClockIcon && <ClockIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />}
                                <span>Historial</span>
                            </div>

                            <div
                                onClick={() => setVistaActiva("georreferenciacion")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "georreferenciacion" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "georreferenciacion" ? "#ffffff" : "#86efac",
                                    fontWeight: vistaActiva === "georreferenciacion" ? 600 : 400,
                                    fontSize: "13px",
                                    transition: "background 0.2s"
                                }}
                            >
                                <MapPinIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Georreferenciación</span>
                            </div>

                            <div
                                onClick={() => setVistaActiva("reportes")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "reportes" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "reportes" ? "#ffffff" : "#86efac",
                                    fontWeight: vistaActiva === "reportes" ? 600 : 400,
                                    fontSize: "13px",
                                    transition: "background 0.2s"
                                }}
                            >
                                <DocumentChartBarIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Reportes</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* MENÚ PRINCIPAL: Configuración */}
                <div>
                    <div
                        onClick={() => setConfiguracionAbierto(!configuracionAbierto)}
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
                            <Cog6ToothIcon style={{ width: "23px", height: "23px", color: "#86efac" }} />
                            <span>Configuración</span>
                        </div>
                        
                        <ChevronDownIcon style={{
                            width: "17px",
                            height: "17px",
                            color: "#86efac",
                            transform: configuracionAbierto ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s ease"
                        }} />
                    </div>

                    {/* Submenú desplegable de Configuración */}
                    {configuracionAbierto && (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            paddingLeft: "20px",
                            marginTop: "4px",
                            marginBottom: "28px",
                            borderLeft: "2px solid rgba(134, 239, 172, 0.2)"
                        }}>
                            <div
                                onClick={() => setVistaActiva("configuracion")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "configuracion" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "configuracion" ? "#ffffff" : "#86efac",
                                    fontWeight: vistaActiva === "configuracion" ? 600 : 400,
                                    fontSize: "13px",
                                    transition: "background 0.2s"
                                }}
                            >
                                <Cog6ToothIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Ajustes Generales</span>
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