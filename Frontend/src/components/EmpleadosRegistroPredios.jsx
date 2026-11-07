// src/components/EmpleadosRegistroPredios.jsx
import React from "react";
import {
    labelStyle,
    radioLabel,
    FormSection,
    InputField,
    SelectField,
    useEmpleadosRegistroPrediosLogic
} from "../components/EmpleadosRegistroPrediosLogic";

export default function EmpleadosRegistroPredios({
    formData = {},
    setFormData = () => { },
    errors = {},
    setErrors = () => { },
    verificarCedulaDuplicada = () => { },
    camposBloqueados = false,
    prefijoCedula = "V-",
    setPrefijoCedula = () => { },
    municipioEmpleado = ""
}) {

    // Extraemos la lógica y funciones del archivo auxiliar
    const {
        listaParroquias,
        manejarCambio,
        manejarInfra,
        manejarChecklist,
        guardarEnDjango,
        esFormularioValido
    } = useEmpleadosRegistroPrediosLogic({
        formData,
        setFormData,
        setErrors,
        errors,
        municipioEmpleado,
        prefijoCedula
    });

    // Función para abrir Google Maps con las coordenadas actuales
    const abrirGoogleMaps = () => {
        const coordenadas = formData.coordenadas ? formData.coordenadas.trim() : "";
        if (coordenadas) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordenadas)}`, "_blank");
        } else {
            window.open("https://www.google.com/maps", "_blank");
        }
    };

    return (
        <div className="registro-predios-wrapper">
            {/* ── ESTILOS CSS RESPONSIVE ESTRICTOS ── */}
            <style>{`
                .registro-predios-wrapper {
                    width: 100% !important;
                    max-width: 950px;
                    margin: 0 auto;
                    box-sizing: border-box !important;
                    padding: 0 8px !important;
                    overflow-x: hidden !important;
                }
                .registro-predios-wrapper * {
                    box-sizing: border-box !important;
                    min-width: 0;
                }
                .registro-grid-productor,
                .registro-grid-3 {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 12px;
                    width: 100%;
                }
                .registro-grid-check {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
                    gap: 10px;
                    width: 100%;
                }
                .productor-accion-cell {
                    grid-column: span 3;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 12px;
                }
                .registro-btn-finalizar-container {
                    text-align: right;
                    padding-bottom: 40px;
                    width: 100%;
                }
                .registro-btn-finalizar {
                    padding: 12px 28px;
                    border-radius: 8px;
                    color: #fff;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    width: auto;
                }

                @media (max-width: 992px) {
                    .registro-grid-productor,
                    .registro-grid-3 {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                    .productor-accion-cell {
                        grid-column: span 2 !important;
                    }
                }

                @media (max-width: 768px) {
                    .registro-predios-wrapper {
                        padding: 0 4px !important;
                    }
                    .registro-grid-productor,
                    .registro-grid-3,
                    .registro-grid-check {
                        grid-template-columns: 1fr !important;
                        gap: 10px !important;
                    }
                    .productor-accion-cell {
                        grid-column: span 1 !important;
                        flex-direction: column !important;
                        align-items: stretch !important;
                        justify-content: flex-start !important;
                    }
                    .productor-accion-cell button {
                        width: 100% !important;
                        border-radius: 10px !important;
                        height: 44px !important;
                    }
                    .registro-btn-finalizar-container {
                        text-align: center !important;
                    }
                    .registro-btn-finalizar {
                        width: 100% !important;
                    }
                }
            `}</style>

            <FormSection title="I. Datos del Productor">
                <div className="registro-grid-productor">
                    <InputField
                        label="Nombre Completo"
                        name="productor_nombre"
                        value={formData.productor_nombre || ""}
                        onChange={manejarCambio}
                        error={errors.productor_nombre}
                    />

                    <InputField
                        label="Cédula"
                        name="productor_cedula"
                        value={formData.productor_cedula || ""}
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '');
                            manejarCambio(e);
                        }}
                        error={errors.productor_cedula}
                        maxLength={8}
                        prefix={
                            <select
                                value={prefijoCedula}
                                onChange={(e) => setPrefijoCedula(e.target.value)}
                                style={{ backgroundColor: "transparent", border: "none", outline: "none", color: "#475569", fontSize: "14px", fontWeight: "600", padding: "0 6px", cursor: "pointer", height: "100%" }}
                            >
                                <option value="V-">V-</option>
                                <option value="E-">E-</option>
                            </select>
                        }
                    />

                    <InputField
                        label="Teléfono"
                        name="productor_telefono"
                        value={formData.productor_telefono || ""}
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '');
                            manejarCambio(e);
                        }}
                        error={errors.productor_telefono}
                        maxLength={10}
                        placeholder="4141234567"
                        prefix={
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "0 8px", color: "#475569", fontSize: "13px", fontWeight: "600", userSelect: "none", height: "100%" }}>
                                <span>🇻🇪</span>
                                <span>+58</span>
                            </div>
                        }
                    />

                    <InputField
                        label="Correo"
                        name="productor_correo"
                        value={formData.productor_correo || ""}
                        onChange={manejarCambio}
                        error={errors.productor_correo}
                    />

                    
                </div>
            </FormSection>

            <FormSection title="II. Georreferenciación y Ubicación">
                <div className="registro-grid-3">
                    <InputField
                        label="Municipio"
                        name="municipio"
                        value={
                            (municipioEmpleado || formData.municipio || "")
                                .replace(/_/g, " ")
                                .toLowerCase()
                                .replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
                        }
                        disabled={true}
                    />

                    <SelectField
                        label="Parroquia"
                        name="parroquia"
                        value={formData.parroquia || ""}
                        options={listaParroquias}
                        onChange={manejarCambio}
                        error={errors.parroquia}
                    />

                    <InputField
                        label="Comunidad / Sector"
                        name="comunidad"
                        value={formData.comunidad || ""}
                        onChange={manejarCambio}
                        error={errors.comunidad}
                    />
                    <InputField
                        label="Centro Poblado"
                        name="centro_poblado"
                        value={formData.centro_poblado || ""}
                        onChange={manejarCambio}
                        error={errors.centro_poblado}
                    />

                    {/* Celda de Coordenadas con el botón Maps justo al lado */}
                    <div>
                        <label style={{ ...labelStyle, whiteSpace: "nowrap" }}>
                            Coordenadas (Latitud, Longitud)
                        </label>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%" }}>
                            <input
                                type="text"
                                name="coordenadas"
                                value={formData.coordenadas || ""}
                                placeholder="Ej: 8.097364, -69.312631"
                                onChange={manejarCambio}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    padding: "10px",
                                    borderRadius: "10px",
                                    border: errors.coordenadas ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                                    fontSize: "14px",
                                    outline: "none",
                                    backgroundColor: "#f8fafc"
                                }}
                            />
                            <button
                                type="button"
                                onClick={abrirGoogleMaps}
                                title="Abrir ubicación en Google Maps"
                                style={{
                                    backgroundColor: "#136442",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "10px",
                                    height: "42px",
                                    padding: "0 10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "4px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    fontSize: "12px",
                                    flexShrink: 0
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span>Maps</span>
                            </button>
                        </div>
                        {errors.coordenadas && (
                            <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", fontWeight: "600" }}>
                                {errors.coordenadas}
                            </p>
                        )}
                    </div>
                </div>
            </FormSection>

            <FormSection title="III. Identificación del Predio">
                <div className="registro-grid-3">
                    <InputField
                        label="Nombre del Predio"
                        name="nombre_predio"
                        value={formData.nombre_predio || ""}
                        onChange={manejarCambio}
                        error={errors.nombre_predio}
                        maxLength={50}
                    />
                    <InputField
                        label="Dirección"
                        name="direccion"
                        value={formData.direccion || ""}
                        onChange={manejarCambio}
                        error={errors.direccion}
                        placeholder="Ej: Carretera vieja, entrada al lado de la escuela"
                    />
                    <InputField
                        label="Superficie (Ha)"
                        type="number"
                        name="superficie"
                        value={formData.superficie || ""}
                        onChange={manejarCambio}
                        error={errors.superficie}
                    />
                    <SelectField
                        label="Tipo de Propiedad"
                        name="tipo_propiedad"
                        value={formData.tipo_propiedad || ""}
                        options={["Público", "Privado"]}
                        onChange={manejarCambio}
                        error={errors.tipo_propiedad}
                    />
                </div>
            </FormSection>

            <FormSection title="IV. Tenencia de la Tierra">
                <div className="registro-grid-check">
                    {[
                        "Propiedad", "Ocupación", "Comunidad", "Título Supletorio",
                        "Arrendamiento", "Adjudicación", "Concesión",
                        "Derecho de Permanencia", "Aparcería", "Otra"
                    ].map(t => (
                        <label key={t} style={radioLabel}>
                            <input
                                type="radio"
                                name="tenencia"
                                value={t}
                                checked={formData.tenencia === t}
                                onChange={manejarCambio}
                            /> {t}
                        </label>
                    ))}
                </div>
            </FormSection>

            <FormSection title="V. Servicios Básicos">
                <div className="registro-grid-check">
                    {["Agua", "Electricidad", "Gas", "Internet", "Teléfono", "Transporte"].map(s => (
                        <label key={s} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer", color: "#334155" }}>
                            <input
                                type="checkbox"
                                checked={(formData.servicios || []).includes(s)}
                                onChange={() => manejarChecklist("servicios", s)}
                            /> {s}
                        </label>
                    ))}
                </div>
                <div style={{ marginTop: "16px" }}>
                    <SelectField
                        label="Condición de la Vialidad"
                        name="vialidad"
                        value={formData.vialidad || ""}
                        options={["Excelente", "Bueno", "Regular", "Malo"]}
                        onChange={manejarCambio}
                        error={errors.vialidad}
                    />
                </div>
            </FormSection>

            <FormSection title="VI. Infraestructura">
                <div className="registro-grid-3">
                    {Object.keys(formData.infraestructura || {
                        corrales: 0, galpones: 0, vaqueras: 0, cochineras: 0,
                        silos: 0, caballerizas: 0, feedlot: 0, lagunas: 0,
                        salas_ordeno: 0, queseras: 0, casas: 0, trapiches: 0, establos: 0
                    }).map((key) => (
                        <InputField
                            key={key}
                            label={key.replace("_", " ").toUpperCase()}
                            type="text"
                            inputMode="numeric"
                            value={(formData.infraestructura || {})[key] ?? ""}
                            onChange={(e) => manejarInfra(key, e)}
                            error={errors[`infra_${key}`]}
                            placeholder="0"
                        />
                    ))}
                </div>
            </FormSection>

            <FormSection title="VII. Modelo de Producción">
                <SelectField
                    label="Tipo de Explotación"
                    name="tipo_explotacion"
                    value={formData.tipo_explotacion || ""}
                    options={["Intensivo", "Semi Intensivo", "Extensivo"]}
                    onChange={manejarCambio}
                    error={errors.tipo_explotacion}
                />
                <div style={{ marginTop: "16px" }}>
                    <p style={labelStyle}>Sistemas de Registro</p>
                    <div className="registro-grid-check">
                        {["Sanitario", "Productivo", "Reproductivo", "Financiero"].map(s => (
                            <label key={s} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer", color: "#334155" }}>
                                <input
                                    type="checkbox"
                                    checked={(formData.sistemas_registro || []).includes(s)}
                                    onChange={() => manejarChecklist("sistemas_registro", s)}
                                /> {s}
                            </label>
                        ))}
                    </div>
                </div>
            </FormSection>

            <div className="registro-btn-finalizar-container">
                <button
                    type="button"
                    onClick={guardarEnDjango}
                    disabled={!esFormularioValido()}
                    className="registro-btn-finalizar"
                    style={{
                        backgroundColor: esFormularioValido() ? "#136442" : "#ccc",
                        cursor: esFormularioValido() ? "pointer" : "not-allowed",
                        opacity: esFormularioValido() ? 1 : 0.7,
                        boxShadow: esFormularioValido() ? "0 4px 14px rgba(19, 100, 66, 0.3)" : "none"
                    }}
                >
                    Finalizar Registro
                </button>
            </div>
        </div>
    );
}