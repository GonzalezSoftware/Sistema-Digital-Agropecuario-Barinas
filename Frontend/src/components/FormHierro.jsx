import React from "react";

export default function FormHierro({
    predioActivo,
    licenciaHierro,
    setLicenciaHierro,
    guardarLicencia,
    FormSection,
    InputField,
    styles: { labelStyle, inputStyle, grid3, btnPrincipal }
}) {
    // Obtener la fecha actual en formato YYYY-MM-DD para las validaciones
    const hoy = new Date().toISOString().split("T")[0];

    // Validación de estado de vencimiento
    const estaVencida = licenciaHierro.fechaVencimiento && licenciaHierro.fechaVencimiento < hoy;

    // Manejador del cambio en Número de Licencia (Solo números y máximo 15 dígitos)
    const handleNumeroLicenciaChange = (e) => {
        const valor = e.target.value;
        // Expresión regular para permitir únicamente dígitos numéricos
        if (valor === "" || /^\d+$/.test(valor)) {
            if (valor.length <= 15) {
                setLicenciaHierro({
                    ...licenciaHierro,
                    numeroLicencia: valor
                });
            }
        }
    };

    return (
        <div style={{ maxWidth: "950px", margin: "0 auto" }}>
            {/* 🔴 BLOQUE DE VALIDACIÓN DE PREDIO */}
            {!predioActivo ? (
                <FormSection title="⚠️ Selección requerida">
                    <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
                        Debes seleccionar un predio antes de registrar una licencia de hierro ganadero.
                    </p>
                </FormSection>
            ) : (
                <>
                    {/* 📜 SECCIÓN PRINCIPAL: DATOS DE LA LICENCIA */}
                    <FormSection title="📜 Licencia o Certificado de Hierro Ganadero">

                        {/* Selector de condicional: Posee licencia */}
                        <div style={{ maxWidth: "300px", marginBottom: "20px" }}>
                            <label style={labelStyle}>¿Posee licencia de hierro ganadero?</label>
                            <select
                                value={licenciaHierro.poseeLicencia}
                                onChange={(e) =>
                                    setLicenciaHierro({
                                        ...licenciaHierro,
                                        poseeLicencia: e.target.value === "true"
                                    })
                                }
                                style={inputStyle}
                            >
                                <option value="false">No</option>
                                <option value="true">Sí</option>
                            </select>
                        </div>

                        {/* 🔥 Campos condicionales si el productor posee licencia */}
                        {licenciaHierro.poseeLicencia && (
                            <>
                                {/* Primera Fila de Campos: Código y Número */}
                                <div style={grid3}>
                                    <div>
                                        <InputField
                                            label="Código del Hierro"
                                            type="text"
                                            placeholder="Ej: ABC-123"
                                            value={licenciaHierro.codigoHierro || ""}
                                            onChange={(e) => {
                                                // Límite de 12 caracteres para el código
                                                if (e.target.value.length <= 12) {
                                                    setLicenciaHierro({
                                                        ...licenciaHierro,
                                                        codigoHierro: e.target.value
                                                    });
                                                }
                                            }}
                                        />
                                        <small style={{ color: "#64748b", display: "block", marginTop: "-10px", marginBottom: "10px", fontSize: "11px" }}>
                                            Máx. 12 caracteres ({licenciaHierro.codigoHierro?.length || 0}/12)
                                        </small>
                                    </div>

                                    <div>
                                        <InputField
                                            label="Número de Licencia"
                                            type="text"
                                            placeholder="Ej: 00456"
                                            value={licenciaHierro.numeroLicencia || ""}
                                            onChange={handleNumeroLicenciaChange}
                                        />
                                        <small style={{ color: "#64748b", display: "block", marginTop: "-10px", marginBottom: "10px", fontSize: "11px" }}>
                                            Solo números. Máx. 15 dígitos
                                        </small>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Organismo Emisor</label>
                                        <select
                                            value={licenciaHierro.organismoEmisor || ""}
                                            onChange={(e) =>
                                                setLicenciaHierro({
                                                    ...licenciaHierro,
                                                    organismoEmisor: e.target.value
                                                })
                                            }
                                            style={inputStyle}
                                        >
                                            <option value="">Seleccione un organismo</option>
                                            <option value="INSAI">INSAI</option>
                                            <option value="MPPAT">MPPAT</option>
                                            <option value="Gobernación del Estado Barinas">Gobernación del Estado Barinas</option>
                                            <option value="Instituto Nacional de Salud Agrícola Integral">Instituto Nacional de Salud Agrícola Integral</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Segunda Fila de Campos: Fechas y Archivo */}
                                <div style={grid3}>
                                    <div>
                                        <InputField
                                            label="Fecha de Emisión"
                                            type="date"
                                            max={hoy} // Impide mediante el calendario nativo seleccionar fechas futuras
                                            value={licenciaHierro.fechaEmision || ""}
                                            onChange={(e) => {
                                                const nuevaEmision = e.target.value;
                                                // Validación: No permitir fechas futuras
                                                if (nuevaEmision <= hoy) {
                                                    setLicenciaHierro({
                                                        ...licenciaHierro,
                                                        fechaEmision: nuevaEmision,
                                                        // Si la nueva fecha de emisión supera a la de vencimiento actual, la limpiamos
                                                        fechaVencimiento: licenciaHierro.fechaVencimiento && licenciaHierro.fechaVencimiento < nuevaEmision ? "" : licenciaHierro.fechaVencimiento
                                                    });
                                                }
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <InputField
                                            label="Fecha de Vencimiento"
                                            type="date"
                                            // El mínimo permitido será el día de hoy o la fecha de emisión (la que sea más avanzada)
                                            min={licenciaHierro.fechaEmision && licenciaHierro.fechaEmision > hoy ? licenciaHierro.fechaEmision : hoy}
                                            value={licenciaHierro.fechaVencimiento || ""}
                                            onChange={(e) => {
                                                const nuevaVencimiento = e.target.value;
                                                const emision = licenciaHierro.fechaEmision || "";
                                                
                                                // Validaciones: No menor que emisión, ni menor que el día de hoy
                                                if (nuevaVencimiento >= emision) {
                                                    setLicenciaHierro({
                                                        ...licenciaHierro,
                                                        fechaVencimiento: nuevaVencimiento
                                                    });
                                                }
                                            }}
                                        />
                                        {/* Mensaje de alerta reactivo si la licencia seleccionada está vencida */}
                                        {estaVencida && (
                                            <small style={{ color: "#ef4444", display: "block", marginTop: "-10px", marginBottom: "10px", fontSize: "12px", fontWeight: "bold" }}>
                                                ⚠️ La licencia está vencida
                                            </small>
                                        )}
                                    </div>

                                    <InputField
                                        label="Certificado Digital (PDF/Imagen)"
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) =>
                                            setLicenciaHierro({
                                                ...licenciaHierro,
                                                certificado: e.target.files[0]
                                            })
                                        }
                                    />
                                </div>

                                {/* Área de Observaciones */}
                                <div style={{ marginBottom: "15px" }}>
                                    <div style={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
                                        <label style={labelStyle}>Observaciones</label>
                                    </div>
                                    <textarea
                                        rows="4"
                                        placeholder="Añada detalles adicionales sobre la vigencia o estado del herraje..."
                                        value={licenciaHierro.observaciones || ""}
                                        onChange={(e) => {
                                            // Límite de 250 caracteres para las observaciones
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

                    {/* 💾 BOTÓN GUARDAR */}
                    <div style={{ textAlign: "right", paddingBottom: "40px" }}>
                        <button 
                            onClick={guardarLicencia} 
                            style={btnPrincipal}
                            // Opcional: Deshabilita el botón si la licencia cargada está vencida
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