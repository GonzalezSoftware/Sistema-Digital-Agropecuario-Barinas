// src/components/FormHierro.jsx
import React, { useState, useEffect } from "react";

// ── CONSTANTES Y ESTILOS INTEGRADOS ──────────────────────────
const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#f8fafc",
};

const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "8px",
};

const grid3 = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
};

const btnPrincipal = {
    background: "#136442",
    color: "#fff",
    border: "none",
    padding: "16px 40px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(19, 100, 66, 0.3)",
};

// ── COMPONENTE INTEGRADO ────────────────────────────────────
export const FormSection = ({ title, children }) => (
    <div
        style={{
            background: "#fff",
            padding: "28px",
            borderRadius: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            marginBottom: "24px",
            border: "1px solid #e2e8f0",
        }}
    >
        <h3
            style={{
                fontSize: "13px",
                color: "#136442",
                marginBottom: "25px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
            }}
        >
            {title}
        </h3>
        {children}
    </div>
);

export const InputField = ({ label, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>{label}</label>
        <input {...props} style={inputStyle} />
    </div>
);

export default function FormHierro({
    predioActivo,
    licenciaHierro,
    setLicenciaHierro,
    guardarLicencia,
}) {
    const [errores, setErrores] = useState({});
    const hoy = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (predioActivo) {
            const licenciaBackend = predioActivo.productor?.licencias?.[0] || predioActivo.licencias?.[0];

            if (licenciaBackend) {
                setLicenciaHierro({
                    poseeLicencia: true,
                    fechaEmision: licenciaBackend.fecha_emision || "",
                    observaciones: licenciaBackend.observaciones || "",
                    activa: licenciaBackend.activa,
                    certificado: null,
                    certificadoUrl: licenciaBackend.certificado_pdf || licenciaBackend.certificado_url || licenciaBackend.url || licenciaBackend.archivo || "",
                    registrada: true
                });
            } else {
                setLicenciaHierro(prev => ({
                    ...prev,
                    poseeLicencia: prev.poseeLicencia ?? false,
                    registrada: false,
                    certificadoUrl: ""
                }));
            }
        }
    }, [predioActivo]);

    const yaRegistrada = licenciaHierro.registrada || false;

    useEffect(() => {
        if (!licenciaHierro.poseeLicencia) {
            setErrores({});
        }
    }, [licenciaHierro.poseeLicencia]);

    const validarCampo = (campo, valor) => {
        let mensajeError = "";
        if (licenciaHierro.poseeLicencia) {
            if (campo === "fechaEmision") {
                if (!valor) mensajeError = "La fecha de emisión es obligatoria.";
                else if (valor > hoy) mensajeError = "La fecha de emisión no puede ser futura.";
            }
        }
        setErrores((prev) => ({ ...prev, [campo]: mensajeError }));
    };

    const handleGuardarClick = (e) => {
        let estadoActiva = false;

        if (licenciaHierro.poseeLicencia) {
            const valor = licenciaHierro["fechaEmision"] || "";
            if (!valor) {
                setErrores({ fechaEmision: "La fecha de emisión es obligatoria." });
                return;
            }
            estadoActiva = true;
        }

        setLicenciaHierro((prev) => {
            const licenciaActualizada = {
                ...prev,
                activa: estadoActiva,
                registrada: true
            };

            setTimeout(() => {
                guardarLicencia(licenciaActualizada);
            }, 0);

            return licenciaActualizada;
        });
    };

    const estiloError = {
        color: "#ef4444",
        display: "block",
        marginTop: "-8px",
        marginBottom: "10px",
        fontSize: "12px",
        fontWeight: "500"
    };

    return (
        <div style={{ maxWidth: "950px", margin: "0 auto" }}>
            {!predioActivo ? (
                <FormSection title="⚠️ Selección requerida">
                    <p style={{ color: "#64748b" }}>
                        Debes seleccionar un predio antes de registrar inventario.
                    </p>
                </FormSection>
            ) : (
                <>
                    <FormSection title="Licencia o Certificado de Hierro Ganadero">

                        {/* MODO DE SOLO LECTURA (REGISTRO POR ÚNICA VEZ) */}
                        {yaRegistrada ? (
                            <div style={{ backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "20px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px", color: "#136442" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                    <span style={{ fontWeight: "bold", fontSize: "15px" }}>Licencia de Hierro Registrada (Solo Lectura)</span>
                                </div>
                                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "15px" }}>
                                    Este predio ya cuenta con una licencia de hierro registrada y no puede modificarse.
                                </p>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                                    <div>
                                        <span style={{ fontSize: "12px", fontWeight: "bold", color: "#475569", display: "block" }}>¿Posee Licencia?</span>
                                        <span style={{ fontSize: "14px", color: "#1e293b" }}>{licenciaHierro.poseeLicencia ? "Sí" : "No"}</span>
                                    </div>
                                    {licenciaHierro.poseeLicencia && (
                                        <div>
                                            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#475569", display: "block" }}>Fecha de Emisión</span>
                                            <span style={{ fontSize: "14px", color: "#1e293b" }}>{licenciaHierro.fechaEmision || "N/A"}</span>
                                        </div>
                                    )}
                                </div>

                                {licenciaHierro.poseeLicencia && (
                                    <>
                                        <div style={{ marginBottom: "15px" }}>
                                            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "5px" }}>Certificado Digital</span>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                                <span style={{ fontSize: "14px", color: "#136442", fontWeight: "500" }}>
                                                    {licenciaHierro.certificadoUrl ? "Documento de Licencia Adjunto" : "Sin archivo adjunto en el sistema"}
                                                </span>
                                                {licenciaHierro.certificadoUrl && (
                                                    <a
                                                        href={licenciaHierro.certificadoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            backgroundColor: "#136442",
                                                            color: "#fff",
                                                            padding: "6px 14px",
                                                            borderRadius: "6px",
                                                            fontSize: "12px",
                                                            textDecoration: "none",
                                                            fontWeight: "600",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "6px"
                                                        }}
                                                    >
                                                        🔍 Ver / Descargar Archivo
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#475569", display: "block" }}>Observaciones</span>
                                            <p style={{ fontSize: "14px", color: "#1e293b", backgroundColor: "#fff", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0", margin: "5px 0 0 0" }}>
                                                {licenciaHierro.observaciones || "Sin observaciones registradas."}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* MODO FORMULARIO INTERACTIVO */
                            <>
                                <div style={{ marginBottom: "20px" }}>
                                    <label style={{ ...labelStyle, display: "block", marginBottom: "10px" }}>
                                        ¿Posee licencia de hierro ganadero?
                                    </label>

                                    <div style={{ display: "flex", gap: "15px", maxWidth: "400px" }}>
                                        <div
                                            onClick={() => setLicenciaHierro({ ...licenciaHierro, poseeLicencia: true })}
                                            style={{
                                                flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
                                                border: licenciaHierro.poseeLicencia === true ? "2px solid #136442" : "1px solid #cbd5e1",
                                                backgroundColor: licenciaHierro.poseeLicencia === true ? "#f0fdf4" : "#fff",
                                                borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease"
                                            }}
                                        >
                                            <div style={{
                                                width: "18px", height: "18px", borderRadius: "50%",
                                                border: licenciaHierro.poseeLicencia === true ? "5px solid #136442" : "2px solid #cbd5e1",
                                                backgroundColor: "#fff", boxSizing: "border-box"
                                            }} />
                                            <span style={{ fontSize: "14px", fontWeight: "500", color: "#334155" }}>Sí</span>
                                        </div>

                                        <div
                                            onClick={() => setLicenciaHierro({ ...licenciaHierro, poseeLicencia: false })}
                                            style={{
                                                flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
                                                border: licenciaHierro.poseeLicencia === false ? "2px solid #136442" : "1px solid #cbd5e1",
                                                backgroundColor: licenciaHierro.poseeLicencia === false ? "#f0fdf4" : "#fff",
                                                borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease"
                                            }}
                                        >
                                            <div style={{
                                                width: "18px", height: "18px", borderRadius: "50%",
                                                border: licenciaHierro.poseeLicencia === false ? "5px solid #136442" : "2px solid #cbd5e1",
                                                backgroundColor: "#fff", boxSizing: "border-box"
                                            }} />
                                            <span style={{ fontSize: "14px", fontWeight: "500", color: "#334155" }}>No</span>
                                        </div>
                                    </div>
                                </div>

                                {licenciaHierro.poseeLicencia && (
                                    <>
                                        <div style={grid3}>
                                            <div>
                                                <InputField
                                                    label="Fecha de Emisión"
                                                    type="date"
                                                    max={hoy}
                                                    value={licenciaHierro.fechaEmision || ""}
                                                    onChange={(e) => {
                                                        const nuevaEmision = e.target.value;
                                                        if (nuevaEmision <= hoy) {
                                                            setLicenciaHierro({
                                                                ...licenciaHierro,
                                                                fechaEmision: nuevaEmision
                                                            });
                                                            validarCampo("fechaEmision", nuevaEmision);
                                                        }
                                                    }}
                                                />
                                                {errores.fechaEmision && <span style={estiloError}> {errores.fechaEmision}</span>}
                                            </div>

                                            <div>
                                                <label style={{ ...labelStyle, display: "block", marginBottom: "8px" }}>
                                                    Certificado Digital (PDF/Imagen)
                                                </label>

                                                <label
                                                    style={{
                                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                                                        backgroundColor: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: "10px",
                                                        padding: "10px 16px", cursor: "pointer", height: "42px", boxSizing: "border-box", width: "100%"
                                                    }}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={licenciaHierro.certificado ? "#136442" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                                                        <polyline points="17 8 12 3 7 8" />
                                                        <line x1="12" y1="3" x2="12" y2="15" />
                                                    </svg>

                                                    <span style={{ fontSize: "14px", fontWeight: "500", color: licenciaHierro.certificado ? "#136442" : "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>
                                                        {licenciaHierro.certificado ? licenciaHierro.certificado.name : "Seleccionar archivo..."}
                                                    </span>

                                                    <input
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        style={{ display: "none" }}
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                setLicenciaHierro({
                                                                    ...licenciaHierro,
                                                                    certificado: e.target.files[0]
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: "15px", marginTop: "15px" }}>
                                            <label style={labelStyle}>Observaciones</label>
                                            <textarea
                                                rows="4"
                                                placeholder="Añada detalles adicionales sobre la vigencia o estado del herraje..."
                                                value={licenciaHierro.observaciones || ""}
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 250) {
                                                        setLicenciaHierro({
                                                            ...licenciaHierro,
                                                            observaciones: e.target.value
                                                        });
                                                    }
                                                }}
                                                style={{ ...inputStyle, resize: "vertical" }}
                                            />
                                            <small style={{ color: "#64748b", display: "block", marginTop: "5px", fontSize: "11px", textAlign: "right" }}>
                                                {licenciaHierro.observaciones?.length || 0}/250 caracteres
                                            </small>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </FormSection>

                    {!yaRegistrada && (
                        <div style={{ textAlign: "right", paddingBottom: "40px" }}>
                            <button
                                onClick={handleGuardarClick}
                                style={{
                                    ...btnPrincipal,
                                    opacity: Object.values(errores).some(e => e) ? 0.6 : 1,
                                    cursor: Object.values(errores).some(e => e) ? "not-allowed" : "pointer"
                                }}
                            >
                                Guardar Licencia
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}