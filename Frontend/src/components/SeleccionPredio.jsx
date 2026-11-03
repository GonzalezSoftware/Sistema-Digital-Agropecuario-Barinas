import React, { useState, useEffect } from "react";

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
    // ── ESTADO DE PAGINACIÓN ──
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;

    useEffect(() => {
        setPaginaActual(1);
    }, [busquedaCedula]);

    // Función auxiliar para formatear ortográficamente el texto del municipio en la vista
    const formatearMunicipio = (texto) => {
        if (!texto) return "N/A";
        return texto
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase());
    };

    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const prediosPaginados = filtrarPredios.slice(indicePrimerElemento, indiceUltimoElemento);
    const totalPaginas = Math.ceil(filtrarPredios.length / elementosPorPagina);

    // Estilos internos reutilizados
    const estiloContenedorSeccion = {
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "16px",
        marginBottom: "20px",
        boxSizing: "border-box"
    };

    const estiloTituloSeccion = {
        color: "#136442",
        fontWeight: "bold",
        fontSize: "14px",
        marginBottom: "12px",
        borderBottom: "2px solid #136442",
        paddingBottom: "5px"
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
        margin: 0,
        wordBreak: "break-word"
    };

    const estiloTh = {
        padding: "10px",
        textAlign: "left",
        borderBottom: "1px solid #ddd"
    };

    const estiloTd = {
        padding: "10px",
        borderBottom: "1px solid #eee",
        color: "#374151",
        wordBreak: "break-word"
    };

    return (
        <div className="seleccionar-predio-wrapper">
            <style>{`
                .seleccionar-predio-wrapper {
                    width: 100% !important;
                    max-width: 950px;
                    margin: 0 auto;
                    box-sizing: border-box !important;
                    padding: 0 8px;
                    overflow-x: hidden !important;
                    font-family: 'Poppins', sans-serif;
                }
                .seleccionar-predio-wrapper * {
                    box-sizing: border-box !important;
                    min-width: 0;
                }
                .predio-card-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    border: 1px solid #e2e8f0;
                    borderRadius: 12px;
                    margin-bottom: 12px;
                    background: #fff;
                    width: 100%;
                    gap: 12px;
                }
                .predio-card-botones {
                    display: flex;
                    gap: 8px;
                    flex-shrink: 0;
                }
                .grid-modal-productor {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 15px;
                }
                .grid-modal-ubicacion {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                }
                .grid-modal-animales {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                }

                @media (max-width: 992px) {
                    .grid-modal-productor {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                    .grid-modal-ubicacion {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                    .grid-modal-animales {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }

                @media (max-width: 768px) {
                    .seleccionar-predio-wrapper {
                        padding: 0 4px !important;
                    }
                    .predio-card-item {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 12px !important;
                    }
                    .predio-card-botones {
                        width: 100% !important;
                        flex-direction: column !important;
                    }
                    .predio-card-botones button {
                        width: 100% !important;
                    }
                    .grid-modal-productor,
                    .grid-modal-ubicacion,
                    .grid-modal-animales {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            {/* SECCIÓN BUSCAR */}
            <div style={{ background: "#fff", padding: "16px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "16px", width: "100%" }}>
                <h3 style={{ color: "#136442", marginBottom: "12px", fontSize: "15px" }}>Buscar Predio por Productor</h3>
                <div style={{ width: "100%" }}>
                    <InputField
                        label="Cédula del Productor"
                        placeholder="Ej: 12345678"
                        value={busquedaCedula}
                        onChange={(e) => setBusquedaCedula(e.target.value)}
                    />
                </div>
            </div>

            {/* LISTA DE RESULTADOS */}
            <div style={{ background: "#fff", padding: "16px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", width: "100%" }}>
                <h3 style={{ color: "#136442", marginBottom: "12px", fontSize: "15px" }}>Predios Disponibles</h3>

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
                        <p style={{ color: "#136442", fontWeight: "600", fontSize: "13px", margin: 0 }}>
                            Buscando información...
                        </p>
                    </div>
                ) : prediosPaginados.length === 0 ? (
                    <p style={{ color: "#64748b", textAlign: "center", padding: "20px 0" }}>No se encontraron predios</p>
                ) : (
                    prediosPaginados.map((p) => (
                        <div
                            key={p.id_predio}
                            className="predio-card-item"
                            style={{
                                background: predioActivo?.id_predio === p.id_predio ? "#e6f4ea" : "#fff",
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: 0, flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                    <p style={{ margin: 0, fontWeight: "700", color: "#0f172a", wordBreak: "break-word" }}>
                                        {p.nombre_predio}
                                    </p>
                                    <span style={{
                                        padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "600",
                                        backgroundColor: p.caracterizacion_completada ? "#dcfce7" : "#fee2e2",
                                        color: p.caracterizacion_completada ? "#166534" : "#991b1b"
                                    }}>
                                        {p.caracterizacion_completada ? "Caracterizado" : "No Caracterizado"}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: "12px", color: "#64748b", wordBreak: "break-word" }}>
                                    {p.productor?.nombre} - CI: {p.productor?.cedula_rif}
                                </p>
                            </div>

                            <div className="predio-card-botones">
                                <button
                                    style={{
                                        background: "#136442",
                                        color: "#fff",
                                        border: "none",
                                        padding: "10px 16px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        fontSize: "12px"
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
                                        padding: "10px 16px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        fontSize: "12px"
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

                {/* ── CONTROLES DE PAGINACIÓN ── */}
                {!cargando && totalPaginas > 1 && (
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #eee", flexWrap: "wrap", gap: "10px"
                    }}>
                        <span style={{ fontSize: "12px", color: "#666" }}>
                            Mostrando del <strong>{indicePrimerElemento + 1}</strong> al <strong>{Math.min(indiceUltimoElemento, filtrarPredios.length)}</strong> de <strong>{filtrarPredios.length}</strong> predios
                        </span>

                        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                            <button
                                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                disabled={paginaActual === 1}
                                style={{
                                    padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc",
                                    backgroundColor: paginaActual === 1 ? "#f5f5f5" : "#fff",
                                    color: paginaActual === 1 ? "#aaa" : "#136442",
                                    cursor: paginaActual === 1 ? "not-allowed" : "pointer",
                                    fontWeight: "bold", fontSize: "12px"
                                }}
                            >
                                Anterior
                            </button>

                            <span style={{ fontSize: "12px", padding: "0 6px", fontWeight: "bold", color: "#333" }}>
                                Pág. {paginaActual} de {totalPaginas}
                            </span>

                            <button
                                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                disabled={paginaActual === totalPaginas}
                                style={{
                                    padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc",
                                    backgroundColor: paginaActual === totalPaginas ? "#f5f5f5" : "#fff",
                                    color: paginaActual === totalPaginas ? "#aaa" : "#136442",
                                    cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer",
                                    fontWeight: "bold", fontSize: "12px"
                                }}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
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
                        padding: "8px",
                        boxSizing: "border-box"
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            width: "100%",
                            maxWidth: "1000px",
                            maxHeight: "92vh",
                            borderRadius: "12px",
                            overflowY: "auto",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                            display: "flex",
                            flexDirection: "column",
                            boxSizing: "border-box"
                        }}
                    >
                        {/* HEADER DEL MODAL */}
                        <div
                            style={{
                                backgroundColor: "#136442",
                                padding: "14px 16px",
                                color: "#fff",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                position: "sticky",
                                top: 0,
                                zIndex: 10,
                            }}
                        >
                            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "bold", wordBreak: "break-word" }}>
                                {`FICHA TÉCNICA INTEGRAL: ${(predioSeleccionado.nombre_predio || "").toUpperCase()}`}
                            </h3>

                            <button
                                onClick={() => setMostrarModal(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    padding: "4px"
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* CONTENIDO DEL MODAL */}
                        <div style={{ padding: "16px", overflowY: "auto" }}>

                            {/* I. DATOS DEL PRODUCTOR */}
                            <div style={estiloContenedorSeccion}>
                                <div style={estiloTituloSeccion}>I. DATOS DEL PRODUCTOR</div>
                                <div className="grid-modal-productor">
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
                                    <div>
                                        <small style={estiloLabel}>CORREO ELECTRÓNICO</small>
                                        <p style={estiloP}>{predioSeleccionado.productor?.correo || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* II. GEORREFERENCIACIÓN Y UBICACIÓN */}
                            <div style={estiloContenedorSeccion}>
                                <div style={estiloTituloSeccion}>II. GEORREFERENCIACIÓN Y UBICACIÓN</div>
                                <div className="grid-modal-ubicacion">
                                    <div><small style={estiloLabel}>MUNICIPIO</small><p style={estiloP}>{formatearMunicipio(predioSeleccionado.municipio)}</p></div>
                                    <div><small style={estiloLabel}>PARROQUIA</small><p style={estiloP}>{predioSeleccionado.parroquia || "N/A"}</p></div>
                                    <div><small style={estiloLabel}>COMUNIDAD</small><p style={estiloP}>{predioSeleccionado.comunidad || "N/A"}</p></div>
                                </div>
                            </div>

                            {/* III. RUBROS VEGETALES */}
                            <div style={estiloContenedorSeccion}>
                                <div style={estiloTituloSeccion}>III. INTENCIONALIDAD DE SIEMBRA (RUBROS VEGETALES)</div>
                                {predioSeleccionado.rubros_vegetales && predioSeleccionado.rubros_vegetales.length > 0 ? (
                                    <div style={{ width: "100%", overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginTop: "10px", minWidth: "500px" }}>
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
                                    </div>
                                ) : (
                                    <p style={{ fontSize: "13px", color: "#666" }}>Sin rubros vegetales declarados.</p>
                                )}
                            </div>

                            {/* IV. CARACTERIZACIÓN DE SEMOVIENTES (INVENTARIO ANIMAL) */}
                            <div style={estiloContenedorSeccion}>
                                <div style={estiloTituloSeccion}>IV. INVENTARIO DE SEMOVIENTES / GANADERÍA</div>
                                {predioSeleccionado.existencia_animal && Object.keys(predioSeleccionado.existencia_animal).length > 0 ? (
                                    <div>
                                        {Object.entries(predioSeleccionado.existencia_animal)
                                            .filter(([especie, detalleEspecie]) => {
                                                if (!detalleEspecie || typeof detalleEspecie !== "object") return false;

                                                const tieneValores = Object.values(detalleEspecie.toObject ? detalleEspecie.toObject() : detalleEspecie).some(val => {
                                                    if (Array.isArray(val)) return val.length > 0;
                                                    const num = Number(val);
                                                    return !isNaN(num) && num > 0;
                                                });

                                                return tieneValores;
                                            })
                                            .map(([especie, detalleEspecie], idxEspecie) => {

                                                const subElementosFiltrados = Object.entries(detalleEspecie).filter(([subKey, subValue]) => {
                                                    if (Array.isArray(subValue)) return subValue.length > 0;
                                                    const num = Number(subValue);
                                                    return subValue !== null && subValue !== undefined && subValue !== "" && num !== 0;
                                                });

                                                if (subElementosFiltrados.length === 0) return null;

                                                return (
                                                    <div key={idxEspecie} style={{ marginBottom: "15px" }}>
                                                        <p style={{ fontSize: "13px", fontWeight: "600", color: "#136442", marginBottom: "8px", textTransform: "capitalize" }}>
                                                            {especie.replace(/_/g, " ")}:
                                                        </p>
                                                        <div className="grid-modal-animales">
                                                            {subElementosFiltrados.map(([subKey, subValue], idxSub) => (
                                                                <div key={idxSub} style={{ background: "#fff", padding: "8px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                                                                    <small style={{ ...estiloLabel, textTransform: "uppercase" }}>{subKey.replace(/_/g, " ")}</small>
                                                                    <p style={{ ...estiloP, fontSize: "14px" }}>
                                                                        {Array.isArray(subValue) ? subValue.join(", ") : subValue}
                                                                    </p>
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
                                            if (!detalleMaquinaria || typeof detalleMaquinaria !== "object" || Object.keys(detalleMaquinaria).length === 0) {
                                                return null;
                                            }

                                            return (
                                                <div key={idxMaq} style={{ marginBottom: "15px" }}>
                                                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#136442", marginBottom: "8px", textTransform: "capitalize" }}>
                                                        {tipoMaquinaria.replace(/_/g, " ")}:
                                                    </p>
                                                    <div style={{ width: "100%", overflowX: "auto" }}>
                                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "400px" }}>
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
                                padding: "12px 16px",
                                backgroundColor: "#f4f4f4",
                                display: "flex",
                                justifyContent: "space-between",
                                borderTop: "1px solid #ddd",
                                position: "sticky",
                                bottom: 0,
                                zIndex: 10
                            }}
                        >
                            <button
                                onClick={() => setMostrarModal(false)}
                                style={{
                                    backgroundColor: "#374151",
                                    color: "#fff",
                                    border: "none",
                                    padding: "10px 18px",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    width: "100%"
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