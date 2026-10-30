import React, { useState } from 'react';
import Swal from 'sweetalert2'; // 🔹 Importamos SweetAlert2
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
    TagIcon,
    ClockIcon,      // 🔹 Icono para Historial
    MapPinIcon,     // 🔹 Icono para Georreferenciación
    Bars3Icon,      // 🔹 Icono de Hamburguesa
    XMarkIcon       // 🔹 Icono para cerrar menú móvil
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

    // Estado para controlar el menú hamburguesa en dispositivos móviles
    const [menuAbiertoMovil, setMenuAbiertoMovil] = useState(false);

    // 🔹 Función para validar antes de entrar a Actualización Productiva
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
        setMenuAbiertoMovil(false);
    };

    // 🔹 Función para validar antes de entrar a Caracterización
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
        setMenuAbiertoMovil(false);
    };

    const seleccionarVista = (vista) => {
        setVistaActiva(vista);
        setMenuAbiertoMovil(false);
    };

    return (
        <>
            <style>{`
                .empleado-sidebar-desktop {
                    display: flex;
                }
                .empleado-hamburger-btn {
                    display: none;
                }
                .empleado-mobile-overlay {
                    display: none;
                }
                @media (max-width: 900px) {
                    .empleado-sidebar-desktop {
                        position: fixed !important;
                        left: -300px;
                        top: 0;
                        z-index: 1100;
                        transition: left 0.3s ease-in-out;
                        height: 100vh !important;
                    }
                    .empleado-sidebar-desktop.abierto {
                        left: 0 !important;
                    }
                    .empleado-hamburger-btn {
                        display: flex !important;
                        position: fixed;
                        top: 16px;
                        left: 16px;
                        z-index: 1050;
                        background-color: #136442;
                        color: #ffffff;
                        border: none;
                        borderRadius: 8px;
                        padding: 8px;
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        align-items: center;
                        justify-content: center;
                    }
                    .empleado-mobile-overlay {
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

            {/* Botón de Hamburguesa para Móvil */}
            <button
                className="empleado-hamburger-btn"
                onClick={() => setMenuAbiertoMovil(true)}
                aria-label="Abrir menú"
            >
                <Bars3Icon style={{ width: "24px", height: "24px", color: "#ffffff" }} />
            </button>

            {/* Overlay para fondo oscuro en móvil cuando el menú está abierto */}
            {menuAbiertoMovil && (
                <div
                    className="empleado-mobile-overlay"
                    onClick={() => setMenuAbiertoMovil(false)}
                />
            )}

            {/* Barra lateral principal */}
            <aside className={`empleado-sidebar-desktop ${menuAbiertoMovil ? "abierto" : ""}`} style={{
                width: "290px",
                backgroundColor: "#136442",
                borderRight: "1px solid #0f4d34",
                height: "100vh",
                position: "sticky",
                top: 0,
                flexDirection: "column",
                padding: "24px 22px",
                boxSizing: "border-box",
                overflow: "hidden"
            }}>
                {/* Botón de cierre en vista móvil dentro del drawer */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }} className="empleado-hamburger-btn">
                    <button
                        onClick={() => setMenuAbiertoMovil(false)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                    >
                        <XMarkIcon style={{ width: "24px", height: "24px", color: "#86efac" }} />
                    </button>
                </div>

                {/* Encabezado: Info del Empleado y Predio Seleccionado */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "15px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: "18px",
                    marginBottom: "20px",
                    flexShrink: 0,
                    boxSizing: "border-box"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                        <div style={{
                            width: "45px", height: "45px", borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)", flexShrink: 0
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
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(134, 239, 172, 0.2)",
                        boxSizing: "border-box"
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
                                padding: "12px 16px", borderRadius: "14px", cursor: "pointer", marginBottom: "4px",
                                transition: "all 0.25s ease", backgroundColor: "transparent", color: "#86efac", fontWeight: 500, fontSize: "14px"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <MapIcon style={{ width: "23px", height: "23px", color: "#86efac", flexShrink: 0 }} />
                                <span>Predios</span>
                            </div>
                            <ChevronDownIcon style={{
                                width: "17px", height: "17px", color: "#86efac",
                                transform: prediosAbierto ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.25s ease",
                                flexShrink: 0
                            }} />
                        </div>

                        {prediosAbierto && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingLeft: "16px", marginTop: "2px", marginBottom: "6px", borderLeft: "2px solid rgba(134, 239, 172, 0.2)" }}>
                                <div onClick={() => seleccionarVista("inicio")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "inicio" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "inicio" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <ChartBarIcon style={{ width: "20px", height: "20px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Inicio</span>
                                </div>
                                <div onClick={() => seleccionarVista("predios_registro")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "predios_registro" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_registro" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <ClipboardDocumentListIcon style={{ width: "20px", height: "20px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Registro</span>
                                </div>
                                <div onClick={() => seleccionarVista("predios_historial")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "predios_historial" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_historial" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <ClockIcon style={{ width: "20px", height: "20px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Historial</span>
                                </div>
                                <div onClick={() => seleccionarVista("predios_georreferenciacion")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "predios_georreferenciacion" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_georreferenciacion" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <MapPinIcon style={{ width: "20px", height: "20px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Georreferenciación</span>
                                </div>
                                <div onClick={() => seleccionarVista("predios_reportes")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "predios_reportes" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "predios_reportes" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <DocumentChartBarIcon style={{ width: "20px", height: "20px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Reportes</span>
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
                                padding: "12px 16px", borderRadius: "14px", cursor: "pointer", marginBottom: "4px",
                                transition: "all 0.25s ease", backgroundColor: "transparent", color: "#86efac", fontWeight: 500, fontSize: "14px"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <CircleStackIcon style={{ width: "23px", height: "23px", color: "#86efac", flexShrink: 0 }} />
                                <span>Producción</span>
                            </div>
                            <ChevronDownIcon style={{
                                width: "17px", height: "17px", color: "#86efac",
                                transform: produccionAbierto ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.25s ease",
                                flexShrink: 0
                            }} />
                        </div>

                        {produccionAbierto && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingLeft: "16px", marginTop: "2px", marginBottom: "6px", borderLeft: "2px solid rgba(134, 239, 172, 0.2)" }}>
                                <div onClick={() => seleccionarVista("produccion_inicio")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_inicio" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_inicio" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <ChartBarIcon style={{ width: "20px", height: "20px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Inicio</span>
                                </div>
                                <div onClick={() => seleccionarVista("produccion_seleccionar_predio")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_seleccionar_predio" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_seleccionar_predio" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <CheckCircleIcon style={{ width: "20px", height: "20px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Seleccionar Predio</span>
                                </div>
                                <div onClick={manejarClickCaracterizacion} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_caracterizacion" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_caracterizacion" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <DocumentTextIcon style={{ width: "20px", height: "20px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Caracterización</span>
                                </div>
                                <div onClick={manejarClickActualizacion} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_actualizacion" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_actualizacion" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <ArrowPathIcon style={{ width: "20px", height: "20px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Actualización Productiva</span>
                                </div>
                                <div onClick={() => seleccionarVista("produccion_reportes")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", backgroundColor: vistaActiva === "produccion_reportes" ? "rgba(255,255,255,0.15)" : "transparent", color: vistaActiva === "produccion_reportes" ? "#ffffff" : "#86efac", fontSize: "13px" }}>
                                    <DocumentChartBarIcon style={{ width: "20px", height: "20px", color: "#86efac", flexShrink: 0 }} />
                                    <span>Reportes</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botón Cerrar Sesión */}
                <div onClick={cerrarSesion} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "10px", cursor: "pointer", color: "#fca5a5", fontSize: "14px", fontWeight: 600, marginTop: "12px", flexShrink: 0 }}>
                    {PowerIcon && <PowerIcon style={{ width: "20px", height: "20px", color: "#fca5a5", flexShrink: 0 }} />}
                    <span>Cerrar Sesión</span>
                </div>
            </aside>
        </>
    );
};