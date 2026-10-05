import React, { useState, useEffect } from "react";
import KeyIcon from "@heroicons/react/24/solid/KeyIcon";
import ShieldCheckIcon from "@heroicons/react/24/solid/ShieldCheckIcon";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import EyeSlashIcon from "@heroicons/react/24/solid/EyeSlashIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import Swal from "sweetalert2";

export default function AdminConfiguracionContraseña() {
    const [form, setForm] = useState({
        usuario: "",
        clave_actual: "",
        nueva_clave: "",
        confirmar_clave: ""
    });

    // Cargar el usuario real logueado desde la sesión
    useEffect(() => {
        const sesion = sessionStorage.getItem("usuario_admin");
        if (sesion) {
            try {
                const dataAdmin = JSON.parse(sesion);
                if (dataAdmin && dataAdmin.usuario) {
                    setForm(prev => ({ ...prev, usuario: dataAdmin.usuario }));
                }
            } catch (e) {
                console.error("Error al leer la sesión del admin", e);
            }
        }
    }, []);

    // Estados para mostrar/ocultar contraseñas
    const [verActual, setVerActual] = useState(false);
    const [verNueva, setVerNueva] = useState(false);
    const [verConfirmar, setVerConfirmar] = useState(false);

    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Validaciones de la nueva contraseña
    const tieneMinimo8 = form.nueva_clave.length >= 8;
    const tieneLetra = /[a-zA-Z]/.test(form.nueva_clave);
    const tieneNumero = /\d/.test(form.nueva_clave);
    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(form.nueva_clave);
    const sonIguales = form.nueva_clave !== "" && form.nueva_clave === form.confirmar_clave;

    const formularioValido = tieneMinimo8 && tieneLetra && tieneNumero && tieneEspecial && sonIguales && form.clave_actual.trim() !== "";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formularioValido) return;

        Swal.fire({
            title: "Actualizando contraseña...",
            text: "Por favor, espera un momento.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setCargando(true);

        try {
            const res = await fetch("http://localhost:8000/api/admin/cambiar-password/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario: form.usuario,
                    clave_actual: form.clave_actual,
                    nueva_clave: form.nueva_clave
                })
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    text: data.mensaje || "Contraseña actualizada correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                });
                setForm(prev => ({ ...prev, clave_actual: "", nueva_clave: "", confirmar_clave: "" }));
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Atención",
                    text: data.error || "No se pudo actualizar la contraseña."
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
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <div style={{ 
                background: "#ffffff", 
                padding: "32px", 
                borderRadius: "12px", 
                border: "1px solid #e2e8f0", 
                width: "100%", 
                maxWidth: "850px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <ShieldCheckIcon style={{ width: "26px", height: "26px", color: "#136442" }} />
                    <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
                        Seguridad y Contraseña
                    </h3>
                </div>
                <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
                    Actualiza la contraseña de acceso al panel de administración del sistema de forma segura.
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Contraseña Actual */}
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                            Contraseña Actual
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={verActual ? "text" : "password"}
                                name="clave_actual"
                                value={form.clave_actual}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                placeholder="Ingresa tu clave actual"
                                style={{
                                    width: "100%", padding: "10px 40px 10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1",
                                    fontSize: "14px", outline: "none", backgroundColor: "#f8fafc", boxSizing: "border-box"
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setVerActual(!verActual)}
                                style={{
                                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                    background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center"
                                }}
                            >
                                {verActual ? <EyeSlashIcon style={{ width: "20px", height: "20px" }} /> : <EyeIcon style={{ width: "20px", height: "20px" }} />}
                            </button>
                        </div>
                    </div>

                    {/* Contenedor en 2 columnas para Nueva Contraseña y Confirmación */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                Nueva Contraseña
                            </label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={verNueva ? "text" : "password"}
                                    name="nueva_clave"
                                    value={form.nueva_clave}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Ingresa la nueva clave"
                                    style={{
                                        width: "100%", padding: "10px 40px 10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1",
                                        fontSize: "14px", outline: "none", backgroundColor: "#f8fafc", boxSizing: "border-box"
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setVerNueva(!verNueva)}
                                    style={{
                                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                        background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center"
                                    }}
                                >
                                    {verNueva ? <EyeSlashIcon style={{ width: "20px", height: "20px" }} /> : <EyeIcon style={{ width: "20px", height: "20px" }} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                Confirmar Nueva Contraseña
                            </label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={verConfirmar ? "text" : "password"}
                                    name="confirmar_clave"
                                    value={form.confirmar_clave}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Repite la nueva clave"
                                    style={{
                                        width: "100%", padding: "10px 40px 10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1",
                                        fontSize: "14px", outline: "none", backgroundColor: "#f8fafc", boxSizing: "border-box"
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setVerConfirmar(!verConfirmar)}
                                    style={{
                                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                        background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center"
                                    }}
                                >
                                    {verConfirmar ? <EyeSlashIcon style={{ width: "20px", height: "20px" }} /> : <EyeIcon style={{ width: "20px", height: "20px" }} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Requisitos de seguridad */}
                    <div style={{ backgroundColor: "#f8fafc", padding: "14px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "8px" }}>
                            Requisitos de la contraseña:
                        </span>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: tieneMinimo8 ? "#065f46" : "#64748b" }}>
                                {tieneMinimo8 ? <CheckCircleIcon style={{ width: "16px", height: "16px", color: "#10b981" }} /> : <XCircleIcon style={{ width: "16px", height: "16px", color: "#cbd5e1" }} />}
                                Mínimo 8 caracteres
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: tieneLetra ? "#065f46" : "#64748b" }}>
                                {tieneLetra ? <CheckCircleIcon style={{ width: "16px", height: "16px", color: "#10b981" }} /> : <XCircleIcon style={{ width: "16px", height: "16px", color: "#cbd5e1" }} />}
                                Al menos una letra
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: tieneNumero ? "#065f46" : "#64748b" }}>
                                {tieneNumero ? <CheckCircleIcon style={{ width: "16px", height: "16px", color: "#10b981" }} /> : <XCircleIcon style={{ width: "16px", height: "16px", color: "#cbd5e1" }} />}
                                Al menos un número
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: tieneEspecial ? "#065f46" : "#64748b" }}>
                                {tieneEspecial ? <CheckCircleIcon style={{ width: "16px", height: "16px", color: "#10b981" }} /> : <XCircleIcon style={{ width: "16px", height: "16px", color: "#cbd5e1" }} />}
                                Un carácter especial (!@#$...)
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: sonIguales ? "#065f46" : "#64748b", gridColumn: "span 2" }}>
                                {sonIguales ? <CheckCircleIcon style={{ width: "16px", height: "16px", color: "#10b981" }} /> : <XCircleIcon style={{ width: "16px", height: "16px", color: "#cbd5e1" }} />}
                                Las contraseñas coinciden
                            </div>
                        </div>
                    </div>

                    {/* Botón de envío */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
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
                                gap: "8px",
                                opacity: formularioValido ? 1 : 0.7,
                                transition: "background-color 0.2s"
                            }}
                        >
                            <KeyIcon style={{ width: "16px", height: "16px" }} />
                            {cargando ? "Actualizando..." : "Cambiar Contraseña"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}