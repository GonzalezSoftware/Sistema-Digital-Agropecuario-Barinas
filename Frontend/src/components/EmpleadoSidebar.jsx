import React, { useState } from 'react';
import Swal from 'sweetalert2';
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
    ClockIcon,
    MapPinIcon,
    Bars3Icon,
    XMarkIcon
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

    // Estado booleano limpio para abrir/cerrar el menú en móviles
    const [menuAbierto, setMenuAbierto] = useState(false);

    const manejarClickActualizacion = () => {
        if (!predioActivo) {
            Swal.fire({
                icon: "warning",
                title: "Predio no seleccionado",
                text: "Debe seleccionar un predio previamente para realizar la actualización productiva.",
                confirmButtonColor: "#136442"
            });
            return;
        }

        if (!predioActivo.caracterizacion_completada) {
            Swal.fire({
                icon: "warning",
                title: "Predio sin caracterización",
                text: `El predio "${predioActivo.nombre_predio}" aún no cuenta con una caracterización registrada. Debe caracterizarlo primero.`,
                confirmButtonColor: "#136442"
            });
            return;
        }

        setVistaActiva("produccion_actualizacion");
        setMenuAbierto(false);
    };

    const manejarClickCaracterizacion = () => {
        if (!predioActivo) {
            Swal.fire({
                icon: "warning",
                title: "Predio no seleccionado",
                text: "Debe seleccionar un predio previamente para realizar la caracterización.",
                confirmButtonColor: "#136442"
            });
            return;
        }

        if (predioActivo.caracterizacion_completada) {
            Swal.fire({
                icon: "info",
                title: "Predio ya caracterizado",
                text: `El predio "${predioActivo.nombre_predio}" ya cuenta con una caracterización registrada en el sistema.`,
                confirmButtonColor: "#136442"
            });
            return;
        }

        setVistaActiva("produccion_caracterizacion");
        setMenuAbierto(false);
    };

    const seleccionarVista = (vista) => {
        setVistaActiva(vista);
        setMenuAbierto(false);
    };

    return (
        <>
            <style>{`
                .sidebar-container {
                    width: 290px;
                    background-color: #136442;
                    border-right: 1px solid #0f4d34;
                    height: 100vh;
                    position: sticky;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    padding: 24px 22px;
                    box-sizing: border-box;
                    overflow: hidden;
                    transition: transform 0.3s ease-in-out;
                    z-index: 1000;
                }
                .mobile-toggle-btn {
                    display: none;
                }
                .sidebar-overlay {
                    display: none;
                }

                @media (max-width: 900px) {
                    .sidebar-container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        transform: translateX(-100%);
                        z-index: 1100;
                        height: 100vh;
                        box-shadow: 5px 0 15px rgba(0,0,0,0.3);
                    }
                    .sidebar-container.is-open {
                        transform: translateX(0);
                    }
                    .mobile-toggle-btn {
                        display: flex;
                        position: fixed;
                        top: 14px;
                        left: 14px;
                        z-index: 1050;
                        background-color: #136442;
                        color: #ffffff;
                        border: none;
                        border-radius: 8px;
                        padding: 8px;
                        cursor: pointer;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        align-items: center;
                        justify-content: center;
                    }
                    .sidebar-overlay {
                        display: block;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        background-color: rgba(15, 23, 42, 0.5);
                        backdrop-filter: blur(2px);
                        z-index: 1050;
                    }
                }
            `}</style>

            {/* Botón Hamburguesa Móvil */}
            <button
                className="mobile-toggle-btn"
                onClick={() => setMenuAbierto(!menuAbierto)}
                aria-label="Menú de navegación"
            >
                {menuAbierto ? (
                    <XMarkIcon style={{ width: "24px", height: "24px", color: "#ffffff" }} />
                ) : (
                    <Bars3Icon style={{ width: "24px", height: "24px", color: "#ffffff" }} />
                )}
            </button>

            {/* Fondo oscuro para móvil */}
            {menuAbierto && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setMenuAbierto(false)}
                />
            )}

            {/* Contenedor del Sidebar */}
            <aside className={`sidebar-container ${menuAbierto ? "is-open" : ""}`}>
                
                {/* Botón interno de cierre solo visible en móvil dentro del menú */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "6px" }} className="mobile-toggle-btn">
                    <button
                        onClick={() => setMenuAbierto(false)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                    >
                        <XMarkIcon style={{ width: "22px", height: "22px", color: "#86efac" }} />
                    </button>
                </div>

                {/* Perfil del empleado y predio */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "14px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    marginBottom: "18px",
                    flexShrink: 0,
                    boxSizing: "border-box"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                        <div style={{
                            width: "42px", height: "42px", borderRadius: "10px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)", flexShrink: 0
                        }}>
                            <img
                                src={
                                    empleadoData?.foto ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        empleadoData?.nombre ? empleadoData.nombre.replace("Admin", "Empleado") : empleadoData?.usuario || "Empleado"
                                    )}&background=0f4d34&color=ffffff&bold=true`
                                }
                                alt="Profile"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                            <span style={{
                                fontSize: "13.5px",
                                fontWeight: "700",
                                color: "#fff",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                {empleadoData?.nombre ? empleadoData.nombre.replace("Admin", "Empleado") : empleadoData?.usuario || "Empleado"}
                            </span>

                            <span style={{
                                fontSize: "11px",
                                color: "#86efac",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                {empleadoData?.municipio 
                                    ? `Municipio ${empleadoData.municipio.replace(/_/g, " ").toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())}` 
                                    : "Municipio Asignado"}
                            </span>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        border: "1px solid rgba(134, 239, 172, 0.2)",
                        boxSizing: "border-box"
                    }}>
                        <span style={{ fontSize: "9.5px", color: "#cbd5e1", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Predio Activo:
                        </span>
                        <span style={{
                            fontSize: "11.5px",
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

                {/* Opciones de navegación */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    flex: 1,
                    overflowY: "auto",
                    paddingRight: "2px"
                }}>
                    {/* 1. Predios */}
                    <div>
                        <div
                            onClick={() => setPrediosAbierto(!prediosAbierto)}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "11px 14px", borderRadius: "12px", cursor: "pointer", marginBottom: "2px",
                                backgroundColor: "transparent", color: "#86efac", fontWeight: 500, fontSize: "13.5px"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <MapIcon style={{ width: "21px", height: "21px", color: "#86efac", flexShrink: 0 }} />
                                <span>Predios</span>
                            </div>
                            <ChevronDownIcon style={{
                                width: "16px", height: "16px", color: "#86efac",
                                transform: prediosAbierto ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                                flexShrink: 0
                            }} />
                        </div>

                        {prediosAbierto && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "3px", paddingLeft: "14px", marginTop: "2px", marginBottom: "4px", borderLeft: "2px solid rgba(134, 239, 172, 0.2)" }}>
                                <div onClick={() => seleccionarVista("inicio")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "inicio" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "inicio" ? "#ffffff" : "#86efac", fontSize: "12.5px" }}>
                                    <ChartBarIcon style={{ width: "18px", height: "18px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Inicio</span>
                                </div>
                                <div onClick={() => seleccionarVista("predios_registro")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "predios_registro" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_registro" ? "#ffffff" : "#86efac", fontSize: "12.5px" }}>
                                    <ClipboardDocumentListIcon style={{ width: "18px", height: "18px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Registro</span>
                                </div>
                                <div onClick={() => seleccionarVista("predios_historial")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "predios_historial" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_historial" ? "#ffffff" : "#86efac", fontSize: "12.5px" }}>
                                    <ClockIcon style={{ width: "18px", height: "18px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Historial</span>
                                </div>
                                <div onClick={() => seleccionarVista("predios_georreferenciacion")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "predios_georreferenciacion" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_georreferenciacion" ? "#ffffff" : "#86efac", fontSize: "12.5px" }}>
                                    <MapPinIcon style={{ width: "18px", height: "18px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Georreferenciación</span>
                                </div>
                                <div onClick={() => seleccionarVista("predios_reportes")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "predios_reportes" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_reportes" ? "#ffffff" : "#86efac", fontSize: "12.5px" }}>
                                    <DocumentChartBarIcon style={{ width: "18px", height: "18px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Reportes</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Producción */}
                    <div>
                        <div
                            onClick={() => setProduccionAbierto(!produccionAbierto)}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "11px 14px", borderRadius: "12px", cursor: "pointer", marginBottom: "2px",
                                backgroundColor: "transparent", color: "#86efac", fontWeight: 500, fontSize: "13.5px"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <CircleStackIcon style={{ width: "21px", height: "21px", color: "#86efac", flexShrink: 0 }} />
                                <span>Producción</span>
                            </div>
                            <ChevronDownIcon style={{
                                width: "16px", height: "16px", color: "#86efac",
                                transform: produccionAbierto ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                                flexShrink: 0
                            }} />
                        </div>

                        {produccionAbierto && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "3px", paddingLeft: "14px", marginTop: "2px", marginBottom: "4px", borderLeft: "2px solid rgba(134, 239, 172, 0.2)" }}>
                                <div onClick={() => seleccionarVista("produccion_inicio")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_inicio" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_inicio" ? "#ffffff" : "#86efac", fontSize: "12.5px" }}>
                                    <ChartBarIcon style={{ width: "18px", height: "18px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Inicio</span>
                                </div>
                                <div onClick={() => seleccionarVista("produccion_seleccionar_predio")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_seleccionar_predio" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_seleccionar_predio" ? "#ffffff" : "#86efac", fontSize: "12.5px" }}>
                                    <CheckCircleIcon style={{ width: "18px", height: "18px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Seleccionar Predio</span>
                                </div>
                                <div onClick={manejarClickCaracterizacion} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_caracterizacion" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_caracterizacion" ? "#ffffff" : "#86efac", fontSize: "12.5px" }}>
                                    <DocumentTextIcon style={{ width: "18px", height: "18px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Caracterización</span>
                                </div>
                                <div onClick={manejarClickActualizacion} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_actualizacion" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_actualizacion" ? "#ffffff" : "#86efac", fontSize: "12.5px" }}>
                                    <ArrowPathIcon style={{ width: "18px", height: "18px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Actualización Productiva</span>
                                </div>
                                <div onClick={() => seleccionarVista("produccion_reportes")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_reportes" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_reportes" ? "#ffffff" : "#86efac", fontSize: "12.5px" }}>
                                    <DocumentChartBarIcon style={{ width: "18px", height: "18px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Reportes</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cerrar Sesión */}
                <div onClick={cerrarSesion} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", cursor: "pointer", color: "#fca5a5", fontSize: "13.5px", fontWeight: 600, marginTop: "10px", flexShrink: 0 }}>
                    {PowerIcon && <PowerIcon style={{ width: "18px", height: "18px", color: "#fca5a5", flexShrink: 0 }} />}
                    <span>Cerrar Sesión</span>
                </div>
            </aside>
        </>
    );
};