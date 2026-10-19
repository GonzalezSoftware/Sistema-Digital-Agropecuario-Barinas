import React, { useState } from 'react';
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import MapPinIcon from "@heroicons/react/24/solid/MapPinIcon";
import DocumentChartBarIcon from "@heroicons/react/24/solid/DocumentChartBarIcon";
import Cog6ToothIcon from "@heroicons/react/24/solid/Cog6ToothIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/solid/ClipboardDocumentListIcon";
import NewspaperIcon from "@heroicons/react/24/solid/NewspaperIcon";
import EnvelopeIcon from "@heroicons/react/24/solid/EnvelopeIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon"; // Icono de advertencia/reinicio
import Swal from 'sweetalert2';
import axios from 'axios';

export const AdminSidebar = ({
    adminData,
    vistaActiva,
    setVistaActiva,
    cerrarSesion,
    badgeCount,
    PresentationChartBarIcon,
    KeyIcon,
    ClockIcon,
    PowerIcon,
}) => {
    const [prediosAbierto, setPrediosAbierto] = useState(
        vistaActiva === "inicio" ||
        vistaActiva === "historial" ||
        vistaActiva === "georreferenciacion" ||
        vistaActiva === "reportes" ||
        vistaActiva === "predios"
    );

    const [produccionAbierto, setProduccionAbierto] = useState(
        vistaActiva === "produccion_dashboard" ||
        vistaActiva === "guias_movilizacion" ||
        vistaActiva === "produccion_reportes"
    );

    // Incluimos "reiniciar_sistema" dentro de las rutas activas de configuración
    const [configuracionAbierto, setConfiguracionAbierto] = useState(
        vistaActiva === "configuracion" ||
        vistaActiva === "credenciales" ||
        vistaActiva === "bitacora" ||
        vistaActiva === "noticias" ||
        vistaActiva === "notificaciones_noticias" ||
        vistaActiva === "contacto" ||
        vistaActiva === "reiniciar_sistema"
    );

    // ── FUNCIÓN PARA REINICIAR EL SISTEMA ──
    const handleReiniciarSistema = async () => {
        const usernameAdmin = adminData?.usuario || "admin";

        // Paso 1: Pedir contraseña del administrador
        const { value: password } = await Swal.fire({
            title: '⚠️ Advertencia Crítica',
            text: 'Esta acción borrará TODOS los datos del sistema (predios, productores, bitácora, etc.). Ingrese su contraseña de administrador para continuar:',
            input: 'password',
            inputPlaceholder: 'Contraseña de administrador',
            inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b'
        });

        if (!password) return;

        Swal.fire({
            title: 'Verificando credenciales...',
            text: 'Por favor espere mientras enviamos el código de verificación al correo.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            // Paso 2: Solicitar envío de código al correo mediante la API
            await axios.post("http://127.0.0.1:8000/api/reiniciar/solicitar/", {
                usuario: usernameAdmin,
                clave: password
            });

            Swal.close();

            // Paso 3: Pedir código de verificación de 6 dígitos
            const { value: codigoVerificacion } = await Swal.fire({
                title: 'Código de Verificación Enviado',
                text: `Se ha enviado un código de confirmación al correo institucional. Ingréselo a continuación:`,
                input: 'text',
                inputPlaceholder: 'Ej: 123456',
                showCancelButton: true,
                confirmButtonText: 'Verificar y Reiniciar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#64748b'
            });

            if (!codigoVerificacion) return;

            Swal.fire({
                title: 'Reiniciando Sistema...',
                text: 'Vaciando la base de datos, por favor no cierre esta ventana.',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            // Paso 4: Ejecutar el reinicio definitivo de la base de datos
            await axios.post("http://127.0.0.1:8000/api/reiniciar/ejecutar/", {
                usuario: usernameAdmin,
                codigo: codigoVerificacion
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Sistema Reiniciado!',
                text: 'La base de datos se ha vaciado correctamente. El sistema se cerrará por seguridad.',
                confirmButtonColor: '#136442'
            });

            cerrarSesion();

        } catch (error) {
            const mensajeError = error.response?.data?.error || "Ocurrió un error al procesar la solicitud.";
            Swal.fire({
                icon: 'error',
                title: 'Error de Validación',
                text: mensajeError,
                confirmButtonColor: '#dc2626'
            });
        }
    };

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
            {/* Encabezado: Info del Usuario */}
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
                                    fontSize: "13px"
                                }}
                            >
                                <span>Dashboard</span>
                            </div>

                            <div
                                onClick={() => setVistaActiva("historial")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "historial" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "historial" ? "#ffffff" : "#86efac",
                                    fontSize: "13px"
                                }}
                            >
                                <span>Historial</span>
                            </div>

                            <div
                                onClick={() => setVistaActiva("georreferenciacion")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "georreferenciacion" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "georreferenciacion" ? "#ffffff" : "#86efac",
                                    fontSize: "13px"
                                }}
                            >
                                <span>Georreferenciación</span>
                            </div>

                            <div
                                onClick={() => setVistaActiva("reportes")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "reportes" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "reportes" ? "#ffffff" : "#86efac",
                                    fontSize: "13px"
                                }}
                            >
                                <span>Reportes</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* MENÚ PRINCIPAL: Producción */}
                <div>
                    <div
                        onClick={() => setProduccionAbierto(!produccionAbierto)}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "14px 18px", borderRadius: "14px", cursor: "pointer", marginBottom: "4px",
                            backgroundColor: "transparent",
                            color: "#86efac",
                            fontSize: "14px"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <DocumentChartBarIcon style={{ width: "23px", height: "23px", color: "#86efac" }} />
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
                                onClick={() => setVistaActiva("produccion_dashboard")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "produccion_dashboard" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "produccion_dashboard" ? "#ffffff" : "#86efac",
                                    fontSize: "13px"
                                }}
                            >
                                <span>Dashboard Producción</span>
                            </div>

                            <div
                                onClick={() => setVistaActiva("produccion_reportes")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "produccion_reportes" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "produccion_reportes" ? "#ffffff" : "#86efac",
                                    fontSize: "13px"
                                }}
                            >
                                <span>Reportes</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* OPCIÓN INDEPENDIENTE: Reportes Generales */}
                <div
                    onClick={() => setVistaActiva("reportes_generales")}
                    style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "14px 18px", borderRadius: "14px", cursor: "pointer", marginBottom: "4px",
                        backgroundColor: vistaActiva === "reportes_generales" ? "rgba(255,255,255,0.15)" : "transparent",
                        color: vistaActiva === "reportes_generales" ? "#ffffff" : "#86efac",
                        fontSize: "14px"
                    }}
                >
                    <DocumentChartBarIcon style={{ width: "23px", height: "23px", color: "#86efac" }} />
                    <span>Reportes Generales</span>
                </div>

                {/* MENÚ PRINCIPAL: Configuración (Incluye Reiniciar Sistema) */}
                <div>
                    <div
                        onClick={() => setConfiguracionAbierto(!configuracionAbierto)}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "14px 18px", borderRadius: "14px", cursor: "pointer", marginBottom: "4px",
                            backgroundColor: "transparent",
                            color: "#86efac",
                            fontSize: "14px"
                        }}
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
                                    fontSize: "13px"
                                }}
                            >
                                <Cog6ToothIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Credenciales Admin</span>
                            </div>

                            <div
                                onClick={() => setVistaActiva("credenciales")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "credenciales" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "credenciales" ? "#ffffff" : "#86efac",
                                    fontSize: "13px"
                                }}
                            >
                                {KeyIcon && <KeyIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />}
                                <span>Credenciales Usuarios</span>
                            </div>

                            <div
                                onClick={() => setVistaActiva("noticias")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "noticias" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "noticias" ? "#ffffff" : "#86efac",
                                    fontSize: "13px"
                                }}
                            >
                                <NewspaperIcon style={{ width: "23px", height: "23px", color: "#86efac" }} />
                                <span>Credenciales Noticias</span>
                            </div>

                            <div
                                onClick={() => setVistaActiva("notificaciones_noticias")}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "notificaciones_noticias" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "notificaciones_noticias" ? "#ffffff" : "#86efac",
                                    fontSize: "13px"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <NewspaperIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                    <span>Notificaciones Noticias</span>
                                </div>

                                {badgeCount > 0 && (
                                    <span style={{
                                        backgroundColor: "#ef4444",
                                        color: "#ffffff",
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        padding: "2px 6px",
                                        borderRadius: "9999px",
                                        minWidth: "20px",
                                        textAlign: "center"
                                    }}>
                                        {badgeCount}
                                    </span>
                                )}
                            </div>

                            <div
                                onClick={() => setVistaActiva("bitacora")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "bitacora" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "bitacora" ? "#ffffff" : "#86efac",
                                    fontSize: "13px"
                                }}
                            >
                                <ClipboardDocumentListIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Bitácora de Cambios</span>
                            </div>

                            <div
                                onClick={() => setVistaActiva("contacto")}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: vistaActiva === "contacto" ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: vistaActiva === "contacto" ? "#ffffff" : "#86efac",
                                    fontSize: "13px"
                                }}
                            >
                                <EnvelopeIcon style={{ width: "21px", height: "21px", color: "#86efac" }} />
                                <span>Contacto</span>
                            </div>

                            {/* OPCIÓN: REINICIAR SISTEMA DENTRO DE CONFIGURACIÓN */}
                            <div
                                onClick={handleReiniciarSistema}
                                style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                                    color: "#fca5a5",
                                    fontWeight: 600,
                                    fontSize: "13px",
                                    transition: "background 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.25)"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)"}
                            >
                                <TrashIcon style={{ width: "21px", height: "21px", color: "#fca5a5" }} />
                                <span>Reiniciar Sistema</span>
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
                    marginTop: "16px", flexShrink: 0
                }}
            >
                {PowerIcon && <PowerIcon style={{ width: "20px", height: "20px", color: "#fca5a5" }} />}
                <span>Cerrar Sesión</span>
            </div>
        </aside>
    );
};