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
    // URL del servidor backend en AWS con HTTPS
    const API_URL = "https://3.145.179.35.nip.io/api/";

    // Estados locales para el modal y el formulario de credenciales
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState(null);
    const [formUsuario, setFormUsuario] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [formCorreo, setFormCorreo] = useState(""); // ✉️ Estado para el correo
    const [errorMsg, setErrorMsg] = useState("");
    const [exitoMsg, setExitoMsg] = useState("");
    const [cargando, setCargando] = useState(false);
    const [verClaveModal, setVerClaveModal] = useState(false);

    // Estados de validación de contraseña en tiempo real
    const [valLength, setValLength] = useState(false);
    const [valLetter, setValLetter] = useState(false);
    const [valUpper, setValUpper] = useState(false);
    const [valNumber, setValNumber] = useState(false);
    const [valSymbol, setValSymbol] = useState(false);

    const abrirModal = (mun) => {
        setMunicipioSeleccionado(mun);
        const credsExistentes = credenciales[mun.id];
        setFormUsuario(credsExistentes ? credsExistentes.usuario : `mppat_${mun.id}`);
        setFormPassword("");
        setFormCorreo(credsExistentes?.correo || ""); // Cargamos el correo si ya existe
        setErrorMsg("");
        setExitoMsg("");
        setVerClaveModal(false);
        setValLength(false);
        setValLetter(false);
        setValUpper(false);
        setValNumber(false);
        setValSymbol(false);
    };

    const cerrarModal = () => {
        setMunicipioSeleccionado(null);
        setErrorMsg("");
        setExitoMsg("");
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setFormPassword(val);
        setErrorMsg("");

        // Validaciones estrictas
        setValLength(val.length >= 6 && val.length <= 25);
        setValLetter(/[a-zA-Z]/.test(val));
        setValUpper(/[A-Z]/.test(val));
        setValNumber(/[0-9]/.test(val));
        setValSymbol(/[!@#$%^&*(),.?":{}|<>]/.test(val));
    };

    const guardarCredenciales = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setExitoMsg("");

        if (!formUsuario.trim() || !formPassword.trim() || !formCorreo.trim()) {
            setErrorMsg("Por favor, completa todos los campos, incluyendo el correo electrónico.");
            return;
        }

        if (!(valLength && valLetter && valUpper && valNumber && valSymbol)) {
            setErrorMsg("La contraseña no cumple con todos los requisitos de seguridad establecidos.");
            return;
        }

        setCargando(true);

        try {
            const response = await fetch(`${API_URL}guardar-credencial/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    municipio_id: municipioSeleccionado.id,
                    nombre_municipio: municipioSeleccionado.nombre,
                    usuario: formUsuario,
                    clave: formPassword,
                    correo: formCorreo.trim() // ✉️ Enviamos el correo al backend
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
                    usuario: formUsuario,
                    correo: formCorreo.trim()
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

    const contraseñaValida = valLength && valLetter && valUpper && valNumber && valSymbol;

    return (
        <div style={{ paddingBottom: "40px", width: "100%", boxSizing: "border-box", fontFamily: "'Poppins', sans-serif" }}>
            
            <style>{`
                .credenciales-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                    width: 100%;
                    box-sizing: border-box;
                }
                @media (max-width: 480px) {
                    .credenciales-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            <div style={{ marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                    Asigna usuarios, correos institucionales y contraseñas independientes para los 12 municipios encargados del registro de predios.
                </p>
            </div>

            {/* Grid responsive de municipios */}
            <div className="credenciales-grid">
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
                                flexDirection: "column",
                                boxSizing: "border-box",
                                width: "100%"
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
                                overflow: "hidden",
                                width: "100%"
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
                                            {CheckCircleIcon && <CheckCircleIcon style={{ width: "14px", height: "14px", color: "#86efac", flexShrink: 0 }} />}
                                            <span style={{ fontSize: "11px", color: "#ffffff", fontWeight: 600 }}>Creado</span>
                                        </>
                                    ) : (
                                        <>
                                            {ExclamationCircleIcon && <ExclamationCircleIcon style={{ width: "14px", height: "14px", color: "#cbd5e1", flexShrink: 0 }} />}
                                            <span style={{ fontSize: "11px", color: "#f1f5f9", fontWeight: 500 }}>Sin Credenciales</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Cuerpo de la tarjeta */}
                            <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "12px", flex: 1, justifyContent: "space-between", boxSizing: "border-box" }}>
                                <div>
                                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#4b4b4b", margin: "0 0 4px 0", wordBreak: "break-word" }}>
                                        {mun.nombre}
                                    </h3>
                                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                                        Capital: <strong style={{ color: "#334155", fontWeight: 500 }}>{mun.capital}</strong>
                                    </div>
                                </div>

                                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: "12px", color: estaCreado ? "#136442" : "#64748b", fontWeight: 500, wordBreak: "break-all", marginRight: "6px" }}>
                                            {estaCreado ? `Usuario: ${credenciales[mun.id]?.usuario}` : "Configurar acceso"}
                                        </span>
                                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#136442", flexShrink: 0 }}>
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
                    padding: "16px",
                    boxSizing: "border-box"
                }}>
                    <div style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "16px",
                        width: "100%",
                        maxWidth: "460px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        overflow: "hidden",
                        boxSizing: "border-box",
                        maxHeight: "90vh",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        {/* Cabecera del Modal */}
                        <div style={{
                            backgroundColor: "#136442",
                            padding: "18px 20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxSizing: "border-box",
                            flexShrink: 0
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, marginRight: "10px" }}>
                                {KeyIcon && <KeyIcon style={{ width: "22px", height: "22px", color: "#95d5b2", flexShrink: 0 }} />}
                                <h3 style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    Credenciales: {municipioSeleccionado.nombre}
                                </h3>
                            </div>
                            <button
                                onClick={cerrarModal}
                                style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px", display: "flex", flexShrink: 0 }}
                            >
                                {XMarkIcon && <XMarkIcon style={{ width: "20px", height: "20px", color: "#95d5b2" }} />}
                            </button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={guardarCredenciales} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxSizing: "border-box", overflowY: "auto", flex: 1 }}>
                            {errorMsg && (
                                <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: "8px", color: "#991b1b", fontSize: "13px", boxSizing: "border-box" }}>
                                    {errorMsg}
                                </div>
                            )}

                            {exitoMsg && (
                                <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px 14px", borderRadius: "8px", color: "#136442", fontSize: "13px", boxSizing: "border-box" }}>
                                    {exitoMsg}
                                </div>
                            )}

                            {/* Usuario */}
                            <div style={{ width: "100%", boxSizing: "border-box" }}>
                                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                                    Usuario de Acceso
                                </label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%", boxSizing: "border-box" }}>
                                    {UserIcon && <UserIcon style={{ width: "18px", height: "18px", color: "#94a3b8", position: "absolute", left: "12px", flexShrink: 0 }} />}
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

                            {/* Correo Electrónico */}
                            <div style={{ width: "100%", boxSizing: "border-box" }}>
                                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                                    Correo Electrónico Institucional
                                </label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%", boxSizing: "border-box" }}>
                                    <input
                                        type="email"
                                        value={formCorreo}
                                        onChange={(e) => setFormCorreo(e.target.value)}
                                        placeholder="empleado@mppat.gob.ve"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "10px 12px",
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
                                    Se usará para enviar el código de verificación 2FA.
                                </span>
                            </div>

                            {/* Contraseña con icono de Ojo y validadores */}
                            <div style={{ width: "100%", boxSizing: "border-box" }}>
                                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                                    Contraseña
                                </label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%", boxSizing: "border-box" }}>
                                    {LockClosedIcon && <LockClosedIcon style={{ width: "18px", height: "18px", color: "#94a3b8", position: "absolute", left: "12px", flexShrink: 0 }} />}
                                    <input
                                        type={verClaveModal ? "text" : "password"}
                                        value={formPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "10px 42px 10px 38px",
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
                                    <button 
                                        type="button" 
                                        onClick={() => setVerClaveModal(!verClaveModal)}
                                        style={{
                                            position: "absolute", right: "12px", top: "50%",
                                            transform: "translateY(-50%)", background: "none",
                                            border: "none", cursor: "pointer", padding: "4px",
                                            color: "#888", display: "flex", alignItems: "center", justifyContent: "center"
                                        }}
                                        title={verClaveModal ? "Ocultar contraseña" : "Ver contraseña"}
                                    >
                                        {verClaveModal ? (
                                            /* Icono Ojo Abierto */
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        ) : (
                                            /* Icono Ojo Tachado */
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Requisitos de seguridad visuales en tiempo real */}
                                <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11.5px", marginTop: "8px" }}>
                                    <span style={{ fontWeight: 600, color: "#475569", display: "block", marginBottom: "4px" }}>Requisitos de seguridad:</span>
                                    <div style={{ color: valLength ? "#059669" : "#dc2626", marginBottom: "2px" }}>
                                        {valLength ? "✔" : "❌"} De 6 a 25 caracteres
                                    </div>
                                    <div style={{ color: valLetter ? "#059669" : "#dc2626", marginBottom: "2px" }}>
                                        {valLetter ? "✔" : "❌"} Al menos una letra
                                    </div>
                                    <div style={{ color: valUpper ? "#059669" : "#dc2626", marginBottom: "2px" }}>
                                        {valUpper ? "✔" : "❌"} Al menos una letra mayúscula
                                    </div>
                                    <div style={{ color: valNumber ? "#059669" : "#dc2626", marginBottom: "2px" }}>
                                        {valNumber ? "✔" : "❌"} Al menos un número
                                    </div>
                                    <div style={{ color: valSymbol ? "#059669" : "#dc2626" }}>
                                        {valSymbol ? "✔" : "❌"} Al menos un carácter especial (!@#$%^&*)
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px", borderTop: "1px solid #f1f5f9", paddingTop: "14px", width: "100%", boxSizing: "border-box", flexShrink: 0 }}>
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
                                    disabled={cargando || !contraseñaValida}
                                    style={{
                                        padding: "10px 18px",
                                        borderRadius: "8px",
                                        border: "none",
                                        backgroundColor: "#136442",
                                        color: "#ffffff",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        cursor: (cargando || !contraseñaValida) ? "not-allowed" : "pointer",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                        fontFamily: "'Poppins', sans-serif",
                                        opacity: (cargando || !contraseñaValida) ? 0.6 : 1,
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