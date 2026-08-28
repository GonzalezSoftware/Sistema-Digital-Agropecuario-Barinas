import React, { useState } from 'react';
import { Spinner } from './ui/AdminUI'; // Ajusta la ruta según donde tengas tu Spinner

export const CredencialesMunicipios = ({
    MUNICIPIOS_BARINAS,
    credenciales,
    setCredenciales,
    cargandoDatos,
    CheckCircleIcon,
    ExclamationCircleIcon,
    KeyIcon,
    XMarkIcon,
    UserIcon,
    LockClosedIcon
}) => {
    // Estados locales para el modal y el formulario de credenciales
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState(null);
    const [formUsuario, setFormUsuario] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [exitoMsg, setExitoMsg] = useState("");
    const [cargando, setCargando] = useState(false);

    const abrirModal = (mun) => {
        setMunicipioSeleccionado(mun);
        const credsExistentes = credenciales[mun.id];
        setFormUsuario(credsExistentes ? credsExistentes.usuario : `mppat_${mun.id}`);
        setFormPassword("");
        setErrorMsg("");
        setExitoMsg("");
    };

    const cerrarModal = () => {
        setMunicipioSeleccionado(null);
        setErrorMsg("");
        setExitoMsg("");
    };

    const guardarCredenciales = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setExitoMsg("");

        if (!formUsuario.trim() || !formPassword.trim()) {
            setErrorMsg("Por favor, completa todos los campos.");
            return;
        }

        if (formPassword.length < 8) {
            setErrorMsg("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        setCargando(true);

        try {
            const response = await fetch("/api/guardar-credencial/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    municipio_id: municipioSeleccionado.id,
                    nombre_municipio: municipioSeleccionado.nombre,
                    usuario: formUsuario,
                    clave: formPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al guardar en la base de datos.");
            }

            setCredenciales(prev => ({
                ...prev,
                [municipioSeleccionado.id]: {
                    creado: true,
                    usuario: formUsuario
                }
            }));

            setExitoMsg(data.mensaje || "¡Credenciales guardadas exitosamente en la base de datos!");
            setTimeout(() => {
                cerrarModal();
            }, 1200);

        } catch (error) {
            setErrorMsg(error.message || "Ocurrió un error al registrar las credenciales.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ paddingBottom: "40px" }}>
            <div style={{ marginBottom: "28px" }}>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                    Asigna usuarios y contraseñas independientes para los 12 municipios encargados del registro de predios.
                </p>
            </div>

            {/* Grid de 3 columnas */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "28px"
            }}>
                {MUNICIPIOS_BARINAS.map((mun) => {
                    const estaCreado = credenciales[mun.id]?.creado;

                    return (
                        <div
                            key={mun.id}
                            onClick={() => abrirModal(mun)}
                            style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "16px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.03), 0 2px 4px -2px rgba(0,0,0,0.03)",
                                cursor: "pointer",
                                overflow: "hidden",
                                transition: "all 0.25s ease-in-out",
                                display: "flex",
                                flexDirection: "column"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = "0 12px 20px -4px rgba(19, 100, 66, 0.12)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.03), 0 2px 4px -2px rgba(0,0,0,0.03)";
                            }}
                        >
                            {/* Contenedor de la Imagen del Municipio */}
                            <div style={{
                                height: "130px",
                                backgroundColor: "#f4efe6",
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden"
                            }}>
                                <img
                                    src={mun.imagen}
                                    alt={mun.nombre}
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                />

                                {/* Indicador de Estado flotante */}
                                <div style={{
                                    position: "absolute",
                                    top: "12px",
                                    right: "12px",
                                    backgroundColor: cargandoDatos ? "rgba(15, 23, 42, 0.75)" : (estaCreado ? "rgba(19, 100, 66, 0.9)" : "rgba(15, 23, 42, 0.75)"),
                                    padding: "4px 10px",
                                    borderRadius: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    backdropFilter: "blur(4px)"
                                }}>
                                    {cargandoDatos ? (
                                        <>
                                            <div style={{ width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Spinner color="#ffffff" />
                                            </div>
                                            <span style={{ fontSize: "11px", color: "#f1f5f9", fontWeight: 500 }}>Cargando...</span>
                                        </>
                                    ) : estaCreado ? (
                                        <>
                                            {CheckCircleIcon && <CheckCircleIcon style={{ width: "14px", height: "14px", color: "#86efac" }} />}
                                            <span style={{ fontSize: "11px", color: "#ffffff", fontWeight: 600 }}>Creado</span>
                                        </>
                                    ) : (
                                        <>
                                            {ExclamationCircleIcon && <ExclamationCircleIcon style={{ width: "14px", height: "14px", color: "#cbd5e1" }} />}
                                            <span style={{ fontSize: "11px", color: "#f1f5f9", fontWeight: 500 }}>Sin Credenciales</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Cuerpo de la tarjeta */}
                            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", flex: 1, justifyContent: "space-between" }}>
                                <div>
                                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#4b4b4b", margin: "0 0 4px 0" }}>
                                        {mun.nombre}
                                    </h3>
                                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                                        Capital: <strong style={{ color: "#334155", fontWeight: 500 }}>{mun.capital}</strong>
                                    </div>
                                </div>

                                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: "12px", color: estaCreado ? "#136442" : "#64748b", fontWeight: 500 }}>
                                            {estaCreado ? `Usuario: ${credenciales[mun.id]?.usuario}` : "Configurar acceso"}
                                        </span>
                                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#136442" }}>
                                            {estaCreado ? "Editar" : "Crear +"}
                                        </span>
                                    </div>
                                    {estaCreado && (
                                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                                            Contraseña: •••••••• (Protegida)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── MODAL DE CREACIÓN / EDICIÓN DE CREDENCIALES ── */}
            {municipioSeleccionado && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    padding: "20px"
                }}>
                    <div style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "16px",
                        width: "100%",
                        maxWidth: "460px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        overflow: "hidden"
                    }}>
                        {/* Cabecera del Modal */}
                        <div style={{
                            backgroundColor: "#136442",
                            padding: "20px 24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {KeyIcon && <KeyIcon style={{ width: "22px", height: "22px", color: "#95d5b2" }} />}
                                <h3 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 600, margin: 0 }}>
                                    Credenciales: {municipioSeleccionado.nombre}
                                </h3>
                            </div>
                            <button
                                onClick={cerrarModal}
                                style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}
                            >
                                {XMarkIcon && <XMarkIcon style={{ width: "20px", height: "20px", color: "#95d5b2" }} />}
                            </button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={guardarCredenciales} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
                            {errorMsg && (
                                <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: "8px", color: "#991b1b", fontSize: "13px" }}>
                                    {errorMsg}
                                </div>
                            )}

                            {exitoMsg && (
                                <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px 14px", borderRadius: "8px", color: "#136442", fontSize: "13px" }}>
                                    {exitoMsg}
                                </div>
                            )}

                            <div>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                                    Usuario de Acceso
                                </label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    {UserIcon && <UserIcon style={{ width: "18px", height: "18px", color: "#94a3b8", position: "absolute", left: "12px" }} />}
                                    <input
                                        type="text"
                                        value={formUsuario}
                                        onChange={(e) => setFormUsuario(e.target.value)}
                                        placeholder="Ej. mppat_barinas"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "10px 12px 10px 38px",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "14px",
                                            color: "#0f172a",
                                            outline: "none",
                                            boxSizing: "border-box",
                                            fontFamily: "'Poppins', sans-serif"
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = "#136442"}
                                        onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                                    Contraseña (Mínimo 8 caracteres)
                                </label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    {LockClosedIcon && <LockClosedIcon style={{ width: "18px", height: "18px", color: "#94a3b8", position: "absolute", left: "12px" }} />}
                                    <input
                                        type="password"
                                        value={formPassword}
                                        onChange={(e) => setFormPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "10px 12px 10px 38px",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "14px",
                                            color: "#0f172a",
                                            outline: "none",
                                            boxSizing: "border-box",
                                            fontFamily: "'Poppins', sans-serif"
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = "#136442"}
                                        onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                                    />
                                </div>
                                <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "block" }}>
                                    Asegúrate de guardar esta contraseña en un lugar seguro.
                                </span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    style={{
                                        padding: "10px 16px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        backgroundColor: "#ffffff",
                                        color: "#475569",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        fontFamily: "'Poppins', sans-serif"
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={cargando}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: "8px",
                                        border: "none",
                                        backgroundColor: "#136442",
                                        color: "#ffffff",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                        fontFamily: "'Poppins', sans-serif",
                                        opacity: cargando ? 0.7 : 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                >
                                    {cargando && <Spinner color="#ffffff" />}
                                    {cargando ? "Guardando..." : "Guardar Credenciales"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};