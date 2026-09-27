import React from "react";
import {
    grid3,
    gridCheck,
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

    return (
        <div style={{ maxWidth: "950px", margin: "0 auto" }}>
            <FormSection title="I. Datos del Productor">
                <div style={grid3}>
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
                                style={{ backgroundColor: "transparent", border: "none", outline: "none", color: "#475569", fontSize: "14px", fontWeight: "600", padding: "0 10px", cursor: "pointer", height: "100%" }}
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
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0 12px", color: "#475569", fontSize: "14px", fontWeight: "600", userSelect: "none", height: "100%" }}>
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

                    <div style={{ gridColumn: "span 2", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                        <span style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
                            Si el productor ya se encuentra registrado, presionar la lupa para cargar sus datos.
                        </span>

                        <button
                            type="button"
                            onClick={() => verificarCedulaDuplicada(formData.productor_cedula)}
                            disabled={camposBloqueados}
                            title="Buscar productor"
                            style={{
                                padding: "8px",
                                backgroundColor: "transparent",
                                color: camposBloqueados ? "#cbd5e1" : "#16a34a",
                                border: "1px solid #16a34a",
                                borderRadius: "50%",
                                cursor: camposBloqueados ? "not-allowed" : "pointer",
                                height: "42px",
                                width: "42px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </FormSection>

            <FormSection title="II. Georreferenciación y Ubicación">
                <div style={grid3}>
                    <InputField
                        label="Municipio"
                        name="municipio"
                        value={municipioEmpleado || formData.municipio || ""}
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
                    <InputField
                        label="Coordenadas (Latitud, Longitud)"
                        name="coordenadas"
                        value={formData.coordenadas || ""}
                        placeholder="Ej: 8.097364, -69.312631"
                        onChange={manejarCambio}
                        error={errors.coordenadas}
                    />
                </div>
            </FormSection>

            <FormSection title="III. Identificación del Predio">
                <div style={grid3}>
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
                <div style={gridCheck}>
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
                <div style={gridCheck}>
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
                <div style={{ marginTop: "20px" }}>
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
                <div style={grid3}>
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
                <div style={{ marginTop: "20px" }}>
                    <p style={labelStyle}>Sistemas de Registro</p>
                    <div style={gridCheck}>
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

            <div style={{ textAlign: "right", paddingBottom: "50px" }}>
                <button
                    type="button"
                    onClick={guardarEnDjango}
                    disabled={!esFormularioValido()}
                    style={{
                        padding: "12px 28px",
                        borderRadius: "8px",
                        color: "#fff",
                        fontWeight: "600",
                        border: "none",
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