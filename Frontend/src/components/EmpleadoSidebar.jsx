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
    const [sidebarAbierto, setSidebarAbierto] = useState(false);

    const [prediosAbierto, setPrediosAbierto] = useState(
        vistaActiva === "inicio" || vistaActiva?.startsWith("predios")
    );
    const [produccionAbierto, setProduccionAbierto] = useState(
        vistaActiva?.startsWith("produccion")
    );

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
        setSidebarAbierto(false);
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
        setSidebarAbierto(false);
    };

    const seleccionarVista = (vista) => {
        setVistaActiva(vista);
        setSidebarAbierto(false);
    };

    return (
        <>
            {/* ── BOTÓN HAMBURGUESA MÓVIL ── */}
            <button
                onClick={() => setSidebarAbierto(!sidebarAbierto)}
                className="btn-hamburguesa-empleado"
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
                    className="sidebar-overlay-empleado"
                />
            )}

            {/* ── ASIDE (SIDEBAR) ── */}
            <aside 
                className={`empleado-sidebar ${sidebarAbierto ? "abierto" : ""}`}
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
                {/* Encabezado: Info del Empleado y Predio Seleccionado */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "12px 15px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    marginBottom: "16px",
                    flexShrink: 0
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                        <div style={{
                            width: "42px", height: "42px", borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)", flexShrink: 0
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
                                fontSize: "14px",
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

                    {/* Indicador del Predio Seleccionado */}
                    <div style={{
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        border: "1px solid rgba(134, 239, 172, 0.2)"
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

                {/* Navegación de Opciones */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    flex: "1",
                    overflowY: "auto",
                    paddingRight: "4px",
                    scrollbarWidth: "thin"
                }}>
                    {/* 1. Predios */}
                    <div>
                        <div
                            onClick={() => setPrediosAbierto(!prediosAbierto)}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "12px 16px", borderRadius: "12px", cursor: "pointer", marginBottom: "2px",
                                backgroundColor: "transparent", color: "#86efac", fontWeight: 500, fontSize: "14px"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <MapIcon style={{ width: "22px", height: "22px", color: "#86efac" }} />
                                <span>Predios</span>
                            </div>
                            <ChevronDownIcon style={{
                                width: "16px", height: "16px", color: "#86efac",
                                transform: prediosAbierto ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.25s ease"
                            }} />
                        </div>

                        {prediosAbierto && (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                paddingLeft: "18px",
                                marginTop: "2px",
                                marginBottom: "6px",
                                borderLeft: "2px solid rgba(134, 239, 172, 0.2)"
                            }}>
                                <div onClick={() => seleccionarVista("inicio")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "inicio" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "inicio" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <ChartBarIcon style={{ width: "20px", height: "20px", color: "#86efac" }} />
                                    <span>Inicio</span>
                                </div>
                                <div onClick={() => seleccionarVista("predios_registro")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "predios_registro" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_registro" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <ClipboardDocumentListIcon style={{ width: "20px", height: "20px", color: "#86efac" }} />
                                    <span>Registro</span>
                                </div>
                                <div onClick={() => seleccionarVista("predios_historial")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "predios_historial" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_historial" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <ClockIcon style={{ width: "20px", height: "20px", color: "#86efac" }} />
                                    <span>Historial</span>
                                </div>
                                <div onClick={() => seleccionarVista("predios_georreferenciacion")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "predios_georreferenciacion" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_georreferenciacion" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <MapPinIcon style={{ width: "20px", height: "20px", color: "#86efac" }} />
                                    <span>Georreferenciación</span>
                                </div>
                                <div onClick={() => seleccionarVista("predios_reportes")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "predios_reportes" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_reportes" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <DocumentChartBarIcon style={{ width: "20px", height: "20px", color: "#86efac" }} />
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
                                padding: "12px 16px", borderRadius: "12px", cursor: "pointer", marginBottom: "2px",
                                backgroundColor: "transparent", color: "#86efac", fontSize: "14px"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <CircleStackIcon style={{ width: "22px", height: "22px", color: "#86efac" }} />
                                <span>Producción</span>
                            </div>
                            <ChevronDownIcon style={{
                                width: "16px", height: "16px", color: "#86efac",
                                transform: produccionAbierto ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.25s ease"
                            }} />
                        </div>

                        {produccionAbierto && (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                paddingLeft: "18px",
                                marginTop: "2px",
                                marginBottom: "10px",
                                borderLeft: "2px solid rgba(134, 239, 172, 0.2)"
                            }}>
                                <div onClick={() => seleccionarVista("produccion_inicio")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_inicio" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_inicio" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <ChartBarIcon style={{ width: "20px", height: "20px", color: "#86efac" }} />
                                    <span>Inicio</span>
                                </div>
                                <div onClick={() => seleccionarVista("produccion_seleccionar_predio")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_seleccionar_predio" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_seleccionar_predio" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <CheckCircleIcon style={{ width: "20px", height: "20px", color: "#86efac" }} />
                                    <span>Seleccionar Predio</span>
                                </div>
                                <div onClick={manejarClickCaracterizacion} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_caracterizacion" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_caracterizacion" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <DocumentTextIcon style={{ width: "20px", height: "20px", color: "#86efac" }} />
                                    <span>Caracterización</span>
                                </div>
                                <div onClick={manejarClickActualizacion} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_actualizacion" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_actualizacion" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <ArrowPathIcon style={{ width: "20px", height: "20px", color: "#86efac" }} />
                                    <span>Actualización Productiva</span>
                                </div>
                                <div onClick={() => seleccionarVista("produccion_reportes")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_reportes" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_reportes" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <DocumentChartBarIcon style={{ width: "20px", height: "20px", color: "#86efac" }} />
                                    <span>Reportes</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cerrar Sesión */}
                <div
                    onClick={cerrarSesion}
                    style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                        color: "#fca5a5", fontSize: "14px", fontWeight: 600,
                        marginTop: "12px", flexShrink: 0,
                        backgroundColor: "rgba(252, 165, 165, 0.08)",
                        transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(252, 165, 165, 0.18)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(252, 165, 165, 0.08)"}
                >
                    {PowerIcon && <PowerIcon style={{ width: "20px", height: "20px", color: "#fca5a5" }} />}
                    <span>Cerrar Sesión</span>
                </div>
            </aside>

            {/* Estilos CSS Responsive */}
            <style>{`
                @media (max-width: 992px) {
                    .btn-hamburguesa-empleado {
                        display: flex !important;
                    }
                    .sidebar-overlay-empleado {
                        display: block !important;
                    }
                    .empleado-sidebar {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        transform: translateX(-100%);
                        z-index: 1050 !important;
                        box-shadow: 5px 0 25px rgba(0,0,0,0.3);
                    }
                    .empleado-sidebar.abierto {
                        transform: translateX(0) !important;
                    }
                }
            `}</style>
        </>
    );
};