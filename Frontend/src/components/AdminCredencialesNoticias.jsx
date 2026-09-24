import React, { useState, useEffect } from "react";

// Componente Spinner integrado con el color corporativo
export const Spinner = ({ color = "#136442" }) => {
    const spinnerRef = (el) => {
        if (el) {
            el.animate(
                [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
                { duration: 1000, iterations: Infinity }
            );
        }
    };

    return (
        <svg
            ref={spinnerRef}
            width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
};

export function AdminCredencialesNoticias({
    KeyIcon,
    UserIcon,
    LockClosedIcon
}) {
    const [usuarioInput, setUsuarioInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const [credencialesBD, setCredencialesBD] = useState({ usuario: "", activo: false });

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [mensajeFeedback, setMensajeFeedback] = useState(null);
    const [editando, setEditando] = useState(false);

    // 1. CARGAR DATOS DESDE LA BASE DE DATOS AL MONTAR EL COMPONENTE
    useEffect(() => {
        const obtenerCredenciales = async () => {
            try {
                const response = await fetch(`/api/credenciales-noticias/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.activo) {
                        setCredencialesBD(data);
                        setUsuarioInput(data.usuario);
                        setEditando(false);
                    } else {
                        setEditando(true);
                    }
                }
            } catch (error) {
                console.error("Error al obtener las credenciales:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerCredenciales();
    }, []);

    // 2. GUARDAR / ACTUALIZAR EN LA BASE DE DATOS
    const guardarCredenciales = async (e) => {
        e.preventDefault();
        setGuardando(true);
        setMensajeFeedback(null);

        try {
            const response = await fetch(`/api/credenciales-noticias/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": sessionStorage.getItem("csrftoken") || ""
                },
                body: JSON.stringify({
                    usuario: usuarioInput,
                    password: passwordInput
                })
            });

            const data = await response.json();

            if (response.ok) {
                setCredencialesBD({ usuario: usuarioInput, activo: true });
                setMensajeFeedback({ tipo: "exito", texto: data.mensaje || "¡Credenciales actualizadas correctamente!" });
                setPasswordInput("");
                setEditando(false);
            } else {
                setMensajeFeedback({ tipo: "error", texto: data.error || "Error al guardar en el servidor." });
            }
        } catch (error) {
            console.error("Error de red:", error);
            setMensajeFeedback({ tipo: "error", texto: "Error de conexión con el servidor." });
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px",
                gap: "12px",
                color: "#136442",
                fontSize: "13px",
                fontWeight: "500"
            }}>
                <Spinner color="#136442" />
                <span>Cargando datos de autenticación...</span>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "40px" }}>
            <div style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #d1fae5",
                boxShadow: "0 4px 6px -1px rgba(19, 100, 66, 0.08)",
                overflow: "hidden"
            }}>
                {/* Cabecera corporativa */}
                <div style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #d1fae5",
                    backgroundColor: "#f0fdf4",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#136442", margin: 0 }}>
                        Datos de Autenticación (Empleado de Noticias)
                    </h3>

                    {credencialesBD.activo && !editando && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditando(true);
                                setMensajeFeedback(null);
                            }}
                            style={{
                                backgroundColor: "#d1fae5",
                                color: "#136442",
                                border: "1px solid #136442",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "600",
                                fontFamily: "Poppins, sans-serif"
                            }}
                            
                        >
                             Editar Credenciales
                        </button>
                    )}
                </div>

                {/* VISTA 1: Tarjeta de Resumen */}
                {credencialesBD.activo && !editando ? (
                    <div style={{ padding: "24px" }}>
                        {mensajeFeedback && (
                            <div style={{
                                padding: "12px 16px",
                                borderRadius: "8px",
                                marginBottom: "20px",
                                fontSize: "13px",
                                fontWeight: "500",
                                backgroundColor: "#f0fdf4",
                                color: "#166534",
                                border: "1px solid #bbf7d0"
                            }}>
                                {mensajeFeedback.texto}
                            </div>
                        )}

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                            backgroundColor: "#f8fafc",
                            padding: "20px",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {UserIcon && <UserIcon style={{ width: "18px", height: "18px", color: "#136442" }} />}
                                <span style={{ fontSize: "13px", color: "#475569", fontWeight: "600" }}>Usuario registrado:</span>
                                <span style={{ fontSize: "14px", color: "#136442", fontWeight: "700" }}>{credencialesBD.usuario}</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {LockClosedIcon && <LockClosedIcon style={{ width: "18px", height: "18px", color: "#136442" }} />}
                                <span style={{ fontSize: "13px", color: "#475569", fontWeight: "600" }}>Contraseña:</span>
                                <span style={{ fontSize: "14px", color: "#1e293b", letterSpacing: "2px" }}>•••••••• (Protegida)</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* VISTA 2: Formulario */
                    <form onSubmit={guardarCredenciales} style={{ padding: "24px" }}>
                        {mensajeFeedback && (
                            <div style={{
                                padding: "12px 16px",
                                borderRadius: "8px",
                                marginBottom: "20px",
                                fontSize: "13px",
                                fontWeight: "500",
                                backgroundColor: mensajeFeedback.tipo === "exito" ? "#f0fdf4" : "#fee2e2",
                                color: mensajeFeedback.tipo === "exito" ? "#166534" : "#991b1b",
                                border: `1px solid ${mensajeFeedback.tipo === "exito" ? "#bbf7d0" : "#fecaca"}`
                            }}>
                                {mensajeFeedback.texto}
                            </div>
                        )}

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#136442", marginBottom: "8px" }}>
                                Usuario
                            </label>
                            <div style={{ position: "relative" }}>
                                {UserIcon && (
                                    <span style={{ position: "absolute", top: "11px", left: "12px", color: "#136442" }}>
                                        <UserIcon style={{ width: "18px", height: "18px" }} />
                                    </span>
                                )}
                                <input
                                    type="text"
                                    required
                                    value={usuarioInput}
                                    onChange={(e) => setUsuarioInput(e.target.value)}
                                    placeholder="Ingresa el usuario de acceso"
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px 10px 38px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "14px",
                                        boxSizing: "border-box",
                                        outline: "none",
                                        backgroundColor: "#ffffff",
                                        color: "#1e293b"
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = "#136442"}
                                    onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#136442", marginBottom: "8px" }}>
                                Contraseña (Mínimo 8 caracteres)
                            </label>
                            <div style={{ position: "relative" }}>
                                {LockClosedIcon && (
                                    <span style={{ position: "absolute", top: "11px", left: "12px", color: "#136442" }}>
                                        <LockClosedIcon style={{ width: "18px", height: "18px" }} />
                                    </span>
                                )}
                                <input
                                    type="password"
                                    required
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px 10px 38px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "14px",
                                        boxSizing: "border-box",
                                        outline: "none",
                                        backgroundColor: "#ffffff",
                                        color: "#1e293b"
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = "#136442"}
                                    onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            {credencialesBD.activo && (
                                <button
                                    type="button"
                                    onClick={() => setEditando(false)}
                                    style={{
                                        padding: "10px 16px",
                                        backgroundColor: "#f1f5f9",
                                        color: "#475569",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        fontSize: "13px"
                                    }}
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={guardando}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#136442",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    opacity: guardando ? 0.7 : 1,
                                    transition: "background-color 0.2s"
                                }}
                                onMouseOver={(e) => { if (!guardando) e.currentTarget.style.backgroundColor = "#0f4f35"; }}
                                onMouseOut={(e) => { if (!guardando) e.currentTarget.style.backgroundColor = "#136442"; }}
                            >
                                {guardando ? "Guardando..." : "Guardar Credenciales"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}