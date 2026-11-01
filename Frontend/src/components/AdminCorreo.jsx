import React, { useState, useEffect } from "react";
import EnvelopeIcon from "@heroicons/react/24/solid/EnvelopeIcon";
import ShieldCheckIcon from "@heroicons/react/24/solid/ShieldCheckIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import Swal from "sweetalert2";

export default function AdminCorreo() {
    // URL del servidor backend en AWS con HTTPS
    const API_URL = "https://3.145.179.35.nip.io/api/";

    const [form, setForm] = useState({
        usuario: "",
        correo_actual: "Consultando base de datos...", 
        nuevo_correo: "",
        confirmar_correo: ""
    });

    const [cargando, setCargando] = useState(false);

    // Consultar directamente al backend (Base de Datos) el correo actual del admin logueado
    useEffect(() => {
        const sesion = sessionStorage.getItem("usuario_admin");
        if (sesion) {
            try {
                const dataAdmin = JSON.parse(sesion);
                if (dataAdmin && dataAdmin.usuario) {
                    const nombreUsuario = dataAdmin.usuario;
                    setForm(prev => ({ ...prev, usuario: nombreUsuario }));

                    // Petición a la base de datos para traer el correo real almacenado
                    fetch(`${API_URL}admin/perfil/?usuario=${nombreUsuario}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data && data.correo) {
                                setForm(prev => ({ ...prev, correo_actual: data.correo }));
                            } else {
                                setForm(prev => ({ ...prev, correo_actual: "No registrado" }));
                            }
                        })
                        .catch(err => {
                            console.error("Error al obtener el correo de la BD", err);
                            setForm(prev => ({ ...prev, correo_actual: "Error de conexión" }));
                        });
                }
            } catch (e) {
                console.error("Error al leer la sesión", e);
                setForm(prev => ({ ...prev, correo_actual: "Error de sesión" }));
            }
        } else {
            setForm(prev => ({ ...prev, correo_actual: "Sin sesión activa" }));
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Validaciones del correo electrónico
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const esValidoNuevo = regexCorreo.test(form.nuevo_correo);
    const sonIguales = form.nuevo_correo !== "" && form.nuevo_correo === form.confirmar_correo;

    const formularioValido = esValidoNuevo && sonIguales;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formularioValido) return;

        Swal.fire({
            title: "Actualizando correo en la base de datos...",
            text: "Por favor, espera un momento.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setCargando(true);

        try {
            const res = await fetch(`${API_URL}admin/cambiar-correo/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario: form.usuario,
                    nuevo_correo: form.nuevo_correo
                })
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    text: data.mensaje || "Correo actualizado correctamente en la base de datos.",
                    timer: 2000,
                    showConfirmButton: false
                });
                
                // Actualizamos el correo actual en pantalla con el valor recién guardado y limpiamos
                setForm(prev => ({ 
                    ...prev, 
                    correo_actual: prev.nuevo_correo,
                    nuevo_correo: "", 
                    confirmar_correo: "" 
                }));

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Atención",
                    text: data.error || "No se pudo actualizar el correo electrónico."
                });
            }
        } catch (error) {
            console.error("Error de red:", error);
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor."
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", width: "100%", boxSizing: "border-box", fontFamily: "'Poppins', sans-serif" }}>
            
            <style>{`
                .email-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    width: 100%;
                }
                .requisitos-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }
                @media (max-width: 900px) {
                    .email-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .requisitos-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            <div style={{ 
                background: "#ffffff", 
                padding: "24px 20px", 
                borderRadius: "16px", 
                border: "1px solid #e2e8f0", 
                width: "100%", 
                maxWidth: "850px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                boxSizing: "border-box"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <ShieldCheckIcon style={{ width: "24px", height: "24px", color: "#136442", flexShrink: 0 }} />
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
                        Recuperación y Correo Administrador
                    </h3>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: "1.4" }}>
                    Visualiza el correo almacenado en la base de datos y actualiza la dirección de recuperación de acceso institucional.
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%", boxSizing: "border-box" }}>
                    
                    {/* Campo de Correo Actual extraído directo de la BD */}
                    <div style={{ width: "100%" }}>
                        <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                            Correo Registrado en la Base de Datos
                        </label>
                        <input
                            type="email"
                            value={form.correo_actual}
                            disabled
                            style={{
                                width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1",
                                fontSize: "14px", outline: "none", backgroundColor: "#f1f5f9", color: "#64748b", boxSizing: "border-box", cursor: "not-allowed"
                            }}
                        />
                    </div>

                    <div className="email-grid">
                        <div style={{ width: "100%" }}>
                            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                Nuevo Correo Electrónico
                            </label>
                            <input
                                type="email"
                                name="nuevo_correo"
                                value={form.nuevo_correo}
                                onChange={handleChange}
                                required
                                placeholder="ejemplo@barinas.gob.ve"
                                style={{
                                    width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1",
                                    fontSize: "14px", outline: "none", backgroundColor: "#f8fafc", boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div style={{ width: "100%" }}>
                            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                Confirmar Nuevo Correo Electrónico
                            </label>
                            <input
                                type="email"
                                name="confirmar_correo"
                                value={form.confirmar_correo}
                                onChange={handleChange}
                                required
                                placeholder="Repite el correo electrónico"
                                style={{
                                    width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1",
                                    fontSize: "14px", outline: "none", backgroundColor: "#f8fafc", boxSizing: "border-box"
                                }}
                            />
                        </div>
                    </div>

                    {/* Requisitos del correo */}
                    <div style={{ backgroundColor: "#f8fafc", padding: "14px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }}>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "8px" }}>
                            Verificación de correo:
                        </span>
                        <div className="requisitos-grid" style={{ fontSize: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: esValidoNuevo ? "#065f46" : "#64748b" }}>
                                {esValidoNuevo ? <CheckCircleIcon style={{ width: "16px", height: "16px", color: "#10b981", flexShrink: 0 }} /> : <XCircleIcon style={{ width: "16px", height: "16px", color: "#cbd5e1", flexShrink: 0 }} />}
                                Formato de correo válido (@...)
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: sonIguales ? "#065f46" : "#64748b" }}>
                                {sonIguales ? <CheckCircleIcon style={{ width: "16px", height: "16px", color: "#10b981", flexShrink: 0 }} /> : <XCircleIcon style={{ width: "16px", height: "16px", color: "#cbd5e1", flexShrink: 0 }} />}
                                Los correos coinciden
                            </div>
                        </div>
                    </div>

                    {/* Botón de envío */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", width: "100%" }}>
                        <button
                            type="submit"
                            disabled={!formularioValido || cargando}
                            style={{
                                backgroundColor: formularioValido ? "#136442" : "#94a3b8", 
                                color: "#ffffff", 
                                border: "none",
                                padding: "11px 22px", 
                                borderRadius: "8px", 
                                fontSize: "14px", 
                                fontWeight: "600",
                                cursor: formularioValido ? "pointer" : "not-allowed", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                gap: "8px",
                                opacity: formularioValido ? 1 : 0.7,
                                transition: "background-color 0.2s",
                                width: "100%"
                            }}
                        >
                            <EnvelopeIcon style={{ width: "16px", height: "16px" }} />
                            {cargando ? "Actualizando..." : "Actualizar Correo Admin"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}