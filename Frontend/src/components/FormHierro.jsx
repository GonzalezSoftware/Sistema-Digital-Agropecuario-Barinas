import React, { useState, useEffect } from "react";
import { btnPrincipal, grid3, labelStyle, inputStyle } from "../pages/Produccion/DashboardProduccion";

// Componente ModernSelectField estilizado
const ModernSelectField = ({ label, value, onChange, error, children }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <label style={labelStyle}>{label}</label>
            <select
                value={value}
                onChange={onChange}
                style={{
                    ...inputStyle,
                    border: error ? "1px solid #ef4444" : "1px solid #cbd5e1",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "16px",
                    paddingRight: "40px",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                }}
                onFocus={(e) => {
                    if (!error) e.target.style.borderColor = "#136442";
                }}
                onBlur={(e) => {
                    if (!error) e.target.style.borderColor = "#cbd5e1";
                }}
            >
                {children}
            </select>
        </div>
    );
};

export default function FormHierro({
    predioActivo,
    licenciaHierro,
    setLicenciaHierro,
    guardarLicencia,
    FormSection,
    InputField,
}) {
    // Estado local para capturar los errores en tiempo real
    const [errores, setErrores] = useState({});

    // Obtener la fecha actual en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split("T")[0];

    // Validación de estado de vencimiento reactiva
    const estaVencida = licenciaHierro.fechaVencimiento && licenciaHierro.fechaVencimiento < hoy;

    // Efecto para limpiar o re-evaluar errores generales si cambia la condicional principal
    useEffect(() => {
        if (!licenciaHierro.poseeLicencia) {
            setErrores({}); // Limpia errores si selecciona "No" posee licencia
        }
    }, [licenciaHierro.poseeLicencia]);

    // Función validadora en tiempo real por campo
    const validarCampo = (campo, valor) => {
        let mensajeError = "";

        if (licenciaHierro.poseeLicencia) {

            if (campo === "fechaEmision") {
                if (!valor) {
                    mensajeError = "La fecha de emisión es obligatoria.";
                } else if (valor > hoy) {
                    mensajeError = "La fecha de emisión no puede ser futura.";
                }
            }

            if (campo === "fechaVencimiento") {
                if (!valor) {
                    mensajeError = "La fecha de vencimiento es obligatoria.";
                } else if (licenciaHierro.fechaEmision && valor < licenciaHierro.fechaEmision) {
                    mensajeError = "No puede ser menor que la fecha de emisión.";
                }
            }
        }

        setErrores((prev) => ({
            ...prev,
            [campo]: mensajeError,
        }));
    };

    // Manejador genérico para actualizar valores y validar al mismo tiempo
    const handleInputChange = (campo, valor) => {
        setLicenciaHierro({
            ...licenciaHierro,
            [campo]: valor
        });
        validarCampo(campo, valor);
    };

    // Manejador del cambio en Número de Licencia (Solo números)
    const handleNumeroLicenciaChange = (e) => {
        const valor = e.target.value;
        if (valor === "" || /^\d+$/.test(valor)) {
            if (valor.length <= 15) {
                handleInputChange("numeroLicencia", valor);
            }
        }
    };

// Interceptor del botón guardar para comprobar validez completa antes de enviar
const handleGuardarClick = (e) => {
    let estadoActiva = false; // Por defecto es false (si no posee licencia o está vencida)

    if (licenciaHierro.poseeLicencia) {
        const camposAValidar = ["fechaEmision", "fechaVencimiento"];
        let tieneErrores = false;
        let nuevosErrores = {};

        camposAValidar.forEach((campo) => {
            const valor = licenciaHierro[campo] || "";
            let mensajeError = "";

            if (campo === "fechaEmision" && !valor) mensajeError = "La fecha de emisión es obligatoria.";
            if (campo === "fechaVencimiento" && !valor) mensajeError = "La fecha de vencimiento es obligatoria.";
            if (campo === "fechaVencimiento" && licenciaHierro.fechaEmision && valor < licenciaHierro.fechaEmision) {
                mensajeError = "No puede ser menor que la fecha de emisión.";
            }

            if (mensajeError) {
                nuevosErrores[campo] = mensajeError;
                tieneErrores = true;
            }
        });

        if (tieneErrores || estaVencida) {
            setErrores(nuevosErrores);
            return;
        }

        // Si posee licencia y pasó las validaciones (no está vencida), entonces está activa
        estadoActiva = true;
    }

    // Actualizamos el estado global/padre agregando el campo 'activa' para el backend
    setLicenciaHierro((prev) => {
        const licenciaActualizada = {
            ...prev,
            activa: estadoActiva
        };
        
        // Ejecutamos el guardado usando un setTimeout para asegurar que 
        // el estado de React se haya procesado correctamente
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
                    <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
                        Debes seleccionar un predio antes de registrar una licencia de hierro ganadero.
                    </p>
                </FormSection>
            ) : (
                <>
                    <FormSection title="📜 Licencia o Certificado de Hierro Ganadero">
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ ...labelStyle, display: "block", marginBottom: "10px" }}>
                                ¿Posee licencia de hierro ganadero?
                            </label>

                            <div style={{ display: "flex", gap: "15px", maxWidth: "400px" }}>
                                <div
                                    onClick={() => setLicenciaHierro({ ...licenciaHierro, poseeLicencia: true })}
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "12px 16px",
                                        border: licenciaHierro.poseeLicencia === true ? "2px solid #136442" : "1px solid #cbd5e1",
                                        backgroundColor: licenciaHierro.poseeLicencia === true ? "#f0fdf4" : "#fff",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    <div style={{
                                        width: "18px",
                                        height: "18px",
                                        borderRadius: "50%",
                                        border: licenciaHierro.poseeLicencia === true ? "5px solid #136442" : "2px solid #cbd5e1",
                                        backgroundColor: "#fff",
                                        boxSizing: "border-box"
                                    }} />
                                    <span style={{ fontSize: "14px", fontWeight: "500", color: "#334155" }}>Sí</span>
                                </div>

                                <div
                                    onClick={() => setLicenciaHierro({ ...licenciaHierro, poseeLicencia: false })}
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "12px 16px",
                                        border: licenciaHierro.poseeLicencia === false ? "2px solid #136442" : "1px solid #cbd5e1",
                                        backgroundColor: licenciaHierro.poseeLicencia === false ? "#f0fdf4" : "#fff",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    <div style={{
                                        width: "18px",
                                        height: "18px",
                                        borderRadius: "50%",
                                        border: licenciaHierro.poseeLicencia === false ? "5px solid #136442" : "2px solid #cbd5e1",
                                        backgroundColor: "#fff",
                                        boxSizing: "border-box"
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
                                                        fechaEmision: nuevaEmision,
                                                        fechaVencimiento: licenciaHierro.fechaVencimiento && licenciaHierro.fechaVencimiento < nuevaEmision ? "" : licenciaHierro.fechaVencimiento
                                                    });
                                                    validarCampo("fechaEmision", nuevaEmision);
                                                }
                                            }}
                                        />
                                        {errores.fechaEmision && <span style={estiloError}> {errores.fechaEmision}</span>}
                                    </div>

                                    <div>
                                        <InputField
                                            label="Fecha de Vencimiento"
                                            type="date"
                                            min={licenciaHierro.fechaEmision && licenciaHierro.fechaEmision > hoy ? licenciaHierro.fechaEmision : hoy}
                                            value={licenciaHierro.fechaVencimiento || ""}
                                            onChange={(e) => {
                                                const nuevaVencimiento = e.target.value;
                                                setLicenciaHierro({
                                                    ...licenciaHierro,
                                                    fechaVencimiento: nuevaVencimiento
                                                });
                                                validarCampo("fechaVencimiento", nuevaVencimiento);
                                            }}
                                        />
                                        {estaVencida && (
                                            <span style={estiloError}> La licencia está vencida</span>
                                        )}
                                        {errores.fechaVencimiento && !estaVencida && (
                                            <span style={estiloError}> {errores.fechaVencimiento}</span>
                                        )}
                                    </div>

                                    <div>
                                        <label style={{ ...labelStyle, display: "block", marginBottom: "8px" }}>
                                            Certificado Digital (PDF/Imagen)
                                        </label>

                                        <label
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "10px",
                                                backgroundColor: "#f8fafc",
                                                border: "2px dashed #cbd5e1",
                                                borderRadius: "10px",
                                                padding: "10px 16px",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                                height: "42px",
                                                boxSizing: "border-box",
                                                width: "100%"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#f1f5f9";
                                                e.currentTarget.style.borderColor = "#136442";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "#f8fafc";
                                                e.currentTarget.style.borderColor = "#cbd5e1";
                                            }}
                                        >
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke={licenciaHierro.certificado ? "#136442" : "#64748b"}
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>

                                            <span style={{
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                color: licenciaHierro.certificado ? "#136442" : "#64748b",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                maxWidth: "200px"
                                            }}>
                                                {licenciaHierro.certificado
                                                    ? licenciaHierro.certificado.name
                                                    : "Seleccionar archivo..."}
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

                                <div style={{ marginBottom: "15px" }}>
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
                                        style={{
                                            ...inputStyle,
                                            resize: "vertical"
                                        }}
                                    />
                                    <small style={{ color: "#64748b", display: "block", marginTop: "5px", fontSize: "11px", textAlign: "right" }}>
                                        {licenciaHierro.observaciones?.length || 0}/250 caracteres
                                    </small>
                                </div>
                            </>
                        )}
                    </FormSection>

                    <div style={{ textAlign: "right", paddingBottom: "40px" }}>
                        <button
                            onClick={handleGuardarClick}
                            style={{
                                ...btnPrincipal,
                                opacity: (estaVencida || Object.values(errores).some(e => e)) ? 0.6 : 1,
                                cursor: (estaVencida || Object.values(errores).some(e => e)) ? "not-allowed" : "pointer"
                            }}
                            disabled={estaVencida}
                        >
                            Guardar Licencia
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}