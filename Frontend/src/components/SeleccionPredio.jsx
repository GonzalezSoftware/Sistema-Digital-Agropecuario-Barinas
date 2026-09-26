import React from "react";

export default function AdminProduccionSeleccionarPredio({
    busquedaCedula,
    setBusquedaCedula,
    cargando,
    filtrarPredios,
    predioActivo,
    setPredioActivo,
    setPredioSeleccionado,
    setMostrarModal,
    mostrarModal,
    predioSeleccionado,
    InputField,
    Spinner
}) {
    // Estilos internos reutilizados para el modal
    const estiloContenedorSeccion = {
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "16px",
        marginBottom: "20px"
    };

    const estiloTituloSeccion = {
        color: "#136442",
        fontWeight: "bold",
        fontSize: "14px",
        marginBottom: "12px",
        borderBottom: "2px solid #136442",
        paddingBottom: "5px"
    };

    const estiloGridTresColumnas = {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "15px"
    };

    const estiloLabel = {
        color: "#6b7280",
        fontSize: "11px",
        display: "block",
        marginBottom: "4px"
    };

    const estiloP = {
        color: "#1f2937",
        fontSize: "13px",
        fontWeight: "600",
        margin: 0
    };

    const estiloTh = {
        padding: "10px",
        textAlign: "left",
        borderBottom: "1px solid #ddd"
    };

    const estiloTd = {
        padding: "10px",
        borderBottom: "1px solid #eee",
        color: "#374151"
    };

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", fontFamily: "'Poppins', sans-serif" }}>

            {/* SECCIÓN BUSCAR */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
                <h3 style={{ color: "#136442", marginBottom: "15px", fontSize: "16px" }}>Buscar Predio por Productor</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px" }}>
                    <InputField
                        label="Cédula del Productor"
                        placeholder="Ej: 12345678"
                        value={busquedaCedula}
                        onChange={(e) => setBusquedaCedula(e.target.value)}
                    />
                </div>
            </div>

            {/* LISTA DE RESULTADOS */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <h3 style={{ color: "#136442", marginBottom: "15px", fontSize: "16px" }}>Predios Disponibles</h3>

                {cargando ? (
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "40px 0",
                        flexDirection: "column",
                        gap: "10px"
                    }}>
                        <Spinner color="#136442" />
                        <p style={{ color: "#136442", fontWeight: "600", fontSize: "14px", margin: 0 }}>
                            Buscando información...
                        </p>
                    </div>
                ) : filtrarPredios.length === 0 ? (
                    <p style={{ color: "#64748b", textAlign: "center", padding: "20px 0" }}>No se encontraron predios</p>
                ) : (
                    filtrarPredios.map((p) => (
                        <div
                            key={p.id_predio}
                            style={{
                                padding: "15px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                marginBottom: "12px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background:
                                    predioActivo?.id_predio === p.id_predio
                                        ? "#e6f4ea"
                                        : "#fff",
                            }}
                        >
                            <div>
                                <p style={{ margin: 0, fontWeight: "700", color: "#0f172a" }}>
                                    {p.nombre_predio}
                                </p>
                                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                                    {p.productor?.nombre} - CI: {p.productor?.cedula_rif}
                                </p>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    style={{
                                        background: "#136442",
                                        color: "#fff",
                                        border: "none",
                                        padding: "10px 18px",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        fontWeight: "600"
                                    }}
                                    onClick={() => {
                                        setPredioActivo(p);
                                        setPredioSeleccionado(p);
                                    }}
                                >
                                    Seleccionar
                                </button>

                                <button
                                    style={{
                                        background: "#0ea5e9",
                                        color: "#fff",
                                        border: "none",
                                        padding: "10px 18px",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        fontWeight: "600"
                                    }}
                                    onClick={() => {
                                        setPredioSeleccionado(p);
                                        setMostrarModal(true);
                                    }}
                                >
                                    Ver Ficha
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── MODAL INTEGRAL DE FICHA TÉCNICA ── */}
            {mostrarModal && predioSeleccionado && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                        padding: "15px",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            width: "100%",
                            maxWidth: "1000px",
                            maxHeight: "95vh",
                            borderRadius: "12px",
                            overflowY: "auto",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                            display: "flex",
                            flexDirection: "column",
                            fontFamily: "sans-serif"
                        }}
                    >
                        {/* HEADER DEL MODAL */}
                        <div
                            style={{
                                backgroundColor: "#136442",
                                padding: "18px 25px",
                                color: "#fff",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                position: "sticky",
                                top: 0,
                                zIndex: 10,
                            }}
                        >
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                                {`FICHA TÉCNICA INTEGRAL: ${(predioSeleccionado.nombre_predio || "").toUpperCase()}`}
                            </h3>

                            <button
                                onClick={() => setMostrarModal(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontSize: "22px",
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* CONTENIDO DEL MODAL */}
                        <div style={{ padding: "30px", overflowY: "auto" }}>

                            {/* I. DATOS DEL PRODUCTOR */}
                            <div style={estiloContenedorSeccion}>
                                <div style={estiloTituloSeccion}>I. DATOS DEL PRODUCTOR</div>
                                <div style={estiloGridTresColumnas}>
                                    <div>
                                        <small style={estiloLabel}>NOMBRE COMPLETO</small>
                                        <p style={estiloP}>{predioSeleccionado.productor?.nombre || "N/A"}</p>
                                    </div>
                                    <div>
                                        <small style={estiloLabel}>CÉDULA / RIF</small>
                                        <p style={estiloP}>{predioSeleccionado.productor?.cedula_rif || "N/A"}</p>
                                    </div>
                                    <div>
                                        <small style={estiloLabel}>TELÉFONO</small>
                                        <p style={estiloP}>{predioSeleccionado.productor?.telefono || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* II. GEORREFERENCIACIÓN Y UBICACIÓN */}
                            <div style={estiloContenedorSeccion}>
                                <div style={estiloTituloSeccion}>II. GEORREFERENCIACIÓN Y UBICACIÓN</div>
                                <div style={estiloGridTresColumnas}>
                                    <div><small style={estiloLabel}>MUNICIPIO</small><p style={estiloP}>{predioSeleccionado.municipio || "N/A"}</p></div>
                                    <div><small style={estiloLabel}>PARROQUIA</small><p style={estiloP}>{predioSeleccionado.parroquia || "N/A"}</p></div>
                                    <div><small style={estiloLabel}>COMUNIDAD</small><p style={estiloP}>{predioSeleccionado.comunidad || "N/A"}</p></div>
                                </div>
                            </div>

                            {/* III. RUBROS VEGETALES */}
                            <div style={estiloContenedorSeccion}>
                                <div style={estiloTituloSeccion}>III. INTENCIONALIDAD DE SIEMBRA (RUBROS VEGETALES)</div>
                                {predioSeleccionado.rubros_vegetales && predioSeleccionado.rubros_vegetales.length > 0 ? (
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginTop: "10px" }}>
                                        <thead>
                                            <tr style={{ backgroundColor: "#136442", color: "#fff" }}>
                                                <th style={estiloTh}>Rubro</th>
                                                <th style={estiloTh}>Superficie (Ha)</th>
                                                <th style={estiloTh}>Estado</th>
                                                <th style={estiloTh}>Producción Estimada</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {predioSeleccionado.rubros_vegetales.map((rubro, i) => (
                                                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                                                    <td style={estiloTd}><strong>{rubro.rubro}</strong></td>
                                                    <td style={estiloTd}>{rubro.hectareas} Ha</td>
                                                    <td style={estiloTd}>{rubro.estado}</td>
                                                    <td style={estiloTd}>{rubro.produccion_estimada} Kg</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ fontSize: "13px", color: "#666" }}>Sin rubros vegetales declarados.</p>
                                )}
                            </div>

{/* IV. CARACTERIZACIÓN DE SEMOVIENTES (INVENTARIO ANIMAL) */}
                            <div style={estiloContenedorSeccion}>
                                <div style={estiloTituloSeccion}>IV. INVENTARIO DE SEMOVIENTES / GANADERÍA</div>
                                {predioSeleccionado.existencia_animal && Object.keys(predioSeleccionado.existencia_animal).length > 0 ? (
                                    <div>
                                        {Object.entries(predioSeleccionado.existencia_animal).map(([especie, detalleEspecie], idxEspecie) => {
                                            // Validamos que el detalle sea un objeto con datos y con propiedades
                                            if (!detalleEspecie || typeof detalleEspecie !== "object" || Object.keys(detalleEspecie).length === 0) {
                                                return null;
                                            }

                                            return (
                                                <div key={idxEspecie} style={{ marginBottom: "15px" }}>
                                                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#136442", marginBottom: "8px", textTransform: "capitalize" }}>
                                                        {especie.replace(/_/g, " ")}:
                                                    </p>
                                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                                                        {Object.entries(detalleEspecie).map(([subKey, subValue], idxSub) => (
                                                            <div key={idxSub} style={{ background: "#fff", padding: "8px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                                                                <small style={{ ...estiloLabel, textTransform: "uppercase" }}>{subKey.replace(/_/g, " ")}</small>
                                                                <p style={{ ...estiloP, fontSize: "14px" }}>{subValue !== null && subValue !== undefined ? subValue : 0}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: "13px", color: "#666" }}>Sin inventario animal registrado en este predio.</p>
                                )}
                            </div>

                            {/* V. MAQUINARIA, IMPLEMENTOS Y EQUIPOS */}
                            <div style={estiloContenedorSeccion}>
                                <div style={estiloTituloSeccion}>V. MAQUINARIA, IMPLEMENTOS Y EQUIPOS</div>
                                {predioSeleccionado.maquinaria && Object.keys(predioSeleccionado.maquinaria).length > 0 ? (
                                    <div>
                                        {Object.entries(predioSeleccionado.maquinaria).map(([tipoMaquinaria, detalleMaquinaria], idxMaq) => {
                                            // Validamos que contenga elementos para mostrar
                                            if (!detalleMaquinaria || typeof detalleMaquinaria !== "object" || Object.keys(detalleMaquinaria).length === 0) {
                                                return null;
                                            }

                                            return (
                                                <div key={idxMaq} style={{ marginBottom: "15px" }}>
                                                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#136442", marginBottom: "8px", textTransform: "capitalize" }}>
                                                        {tipoMaquinaria.replace(/_/g, " ")}:
                                                    </p>
                                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                                                        <thead>
                                                            <tr style={{ backgroundColor: "#136442", color: "#fff" }}>
                                                                <th style={estiloTh}>Elemento / Equipo</th>
                                                                <th style={estiloTh}>Cantidad</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Object.entries(detalleMaquinaria).map(([itemKey, itemValue], i) => (
                                                                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                                                                    <td style={estiloTd}><strong>{itemKey.replace(/_/g, " ").toUpperCase()}</strong></td>
                                                                    <td style={estiloTd}>{itemValue !== null && itemValue !== undefined ? itemValue : 0}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: "13px", color: "#666" }}>Sin maquinaria o equipos registrados.</p>
                                )}
                            </div>

                        </div>

                        {/* FOOTER DEL MODAL */}
                        <div
                            style={{
                                padding: "20px 30px",
                                backgroundColor: "#f4f4f4",
                                display: "flex",
                                justifyContent: "space-between",
                                borderTop: "1px solid #ddd",
                            }}
                        >

                            <button
                                onClick={() => setMostrarModal(false)}
                                style={{
                                    backgroundColor: "#374151",
                                    color: "#fff",
                                    border: "none",
                                    padding: "10px 18px",
                                    borderRadius: "10px",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }}
                            >
                                CERRAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}