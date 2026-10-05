import React, { useState, useEffect } from "react";
import EnvelopeIcon from "@heroicons/react/24/solid/EnvelopeIcon";
import PhoneIcon from "@heroicons/react/24/solid/PhoneIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import Swal from "sweetalert2";

export default function AdminContacto() {
    const [form, setForm] = useState({
        correo: "",
        telefono: ""
    });
    
    // Estados para controlar si el usuario ya interactuó con los campos
    const [tocado, setTocado] = useState({
        correo: false,
        telefono: false
    });

    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        // Cargar datos actuales de contacto desde el backend
        fetch("http://localhost:8000/api/contacto-info/")
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setForm({
                        correo: data.correo || "",
                        telefono: data.telefono || ""
                    });
                }
                setCargandoDatos(false);
            })
            .catch(err => {
                console.error("Error al cargar datos de contacto:", err);
                setCargandoDatos(false);
            });
    }, []);

    // Validar correo estrictamente para terminar en @gmail.com o @hotmail.com
    const validarCorreo = (email) => {
        const regexGMAIL_HOTMAIL = /^[^\s@]+@(gmail\.com|hotmail\.com)$/i;
        return regexGMAIL_HOTMAIL.test(email);
    };

    const validarTelefono = (tel) => {
        const soloDigitos = tel.replace(/\D/g, "");
        return soloDigitos.length >= 7;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "telefono") {
            // Permitir solo números y caracteres comunes de formato telefónico: +, espacios, -, (, )
            const soloValidos = value.replace(/[^0-9+\s\-()]/g, "");
            setForm({ ...form, [name]: soloValidos });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTocado({ ...tocado, [name]: true });
    };

    // Comprobación general si todo es válido
    const esCorreoValido = validarCorreo(form.correo);
    const esTelefonoValido = validarTelefono(form.telefono);
    const formularioValido = esCorreoValido && esTelefonoValido;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Marcar todo como tocado por si intentan forzar el submit
        setTocado({ correo: true, telefono: true });

        if (!formularioValido) {
            return;
        }

        setGuardando(true);

        // Mostrar SweetAlert de carga
        Swal.fire({
            title: "Guardando cambios...",
            text: "Por favor, espere un momento.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const res = await fetch("http://localhost:8000/api/contacto-info/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "¡Actualizado!",
                    text: data.mensaje || "Información guardada con éxito.",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo actualizar la información."
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
            setGuardando(false);
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
                    <EnvelopeIcon style={{ width: "26px", height: "26px", color: "#136442" }} />
                    <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
                        Configuración de Contacto del Portal
                    </h3>
                </div>
                <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
                    Modifica el correo electrónico y el número telefónico que se mostrarán en el portal
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    
                    {/* Campo Correo */}
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                            Correo Electrónico Público <span style={{ fontSize: "11px", fontWeight: "400", color: "#64748b" }}>(Debe terminar en @gmail.com o @hotmail.com)</span>
                        </label>
                        <div style={{ position: "relative" }}>
                            {cargandoDatos ? (
                                <div style={{
                                    width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1",
                                    backgroundColor: "#f8fafc", display: "flex", alignItems: "center", gap: "8px", boxSizing: "border-box"
                                }}>
                                    <div style={{
                                        width: "16px", height: "16px", border: "2px solid #cbd5e1", borderTop: "2px solid #136442",
                                        borderRadius: "50%", animation: "spin 0.8s linear infinite"
                                    }} />
                                    <span style={{ fontSize: "14px", color: "#94a3b8" }}>Cargando correo actual...</span>
                                </div>
                            ) : (
                                <input
                                    type="email"
                                    name="correo"
                                    value={form.correo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="ejemplo@gmail.com"
                                    style={{
                                        width: "100%", padding: "10px 12px", borderRadius: "8px", 
                                        border: `1px solid ${tocado.correo && !esCorreoValido ? "#ef4444" : "#cbd5e1"}`,
                                        fontSize: "14px", outline: "none", backgroundColor: "#f8fafc", boxSizing: "border-box"
                                    }}
                                />
                            )}
                        </div>
                        {tocado.correo && !esCorreoValido && !cargandoDatos && (
                            <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>
                                El correo debe pertenecer exclusivamente a gmail.com o hotmail.com.
                            </span>
                        )}
                    </div>

                    {/* Campo Teléfono */}
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                            Número Telefónico de Contacto <span style={{ fontSize: "11px", fontWeight: "400", color: "#64748b" }}>(Solo números y símbolos permitidos)</span>
                        </label>
                        <div style={{ position: "relative" }}>
                            {cargandoDatos ? (
                                <div style={{
                                    width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1",
                                    backgroundColor: "#f8fafc", display: "flex", alignItems: "center", gap: "8px", boxSizing: "border-box"
                                }}>
                                    <div style={{
                                        width: "16px", height: "16px", border: "2px solid #cbd5e1", borderTop: "2px solid #136442",
                                        borderRadius: "50%", animation: "spin 0.8s linear infinite"
                                    }} />
                                    <span style={{ fontSize: "14px", color: "#94a3b8" }}>Cargando teléfono actual...</span>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    name="telefono"
                                    value={form.telefono}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="(0273) 300-0000"
                                    style={{
                                        width: "100%", padding: "10px 12px", borderRadius: "8px", 
                                        border: `1px solid ${tocado.telefono && !esTelefonoValido ? "#ef4444" : "#cbd5e1"}`,
                                        fontSize: "14px", outline: "none", backgroundColor: "#f8fafc", boxSizing: "border-box"
                                    }}
                                />
                            )}
                        </div>
                        {tocado.telefono && !esTelefonoValido && !cargandoDatos && (
                            <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>
                                El teléfono debe contener al menos 7 dígitos numéricos válidos (sin letras).
                            </span>
                        )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                        <button
                            type="submit"
                            disabled={guardando || cargandoDatos || !formularioValido}
                            style={{
                                backgroundColor: "#136442", 
                                color: "#ffffff", 
                                border: "none",
                                padding: "11px 22px", 
                                borderRadius: "8px", 
                                fontSize: "14px", 
                                fontWeight: "600",
                                cursor: (guardando || cargandoDatos || !formularioValido) ? "not-allowed" : "pointer", 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "8px",
                                opacity: (guardando || cargandoDatos || !formularioValido) ? 0.6 : 1,
                                transition: "background-color 0.2s, opacity 0.2s"
                            }}
                        >
                            <CheckCircleIcon style={{ width: "18px", height: "18px" }} />
                            {guardando ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Animación del spinner global */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}