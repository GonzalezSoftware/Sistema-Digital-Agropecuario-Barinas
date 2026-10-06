import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function HistorialPredios({
    tabActiva,
    busqueda,
    setBusqueda,
    prediosFiltrados,
    manejarVerDetalles,
    mostrarModal,
    predioSeleccionado,
    setMostrarModal,
    editando,
    setEditando,
    cargandoAccion,
    estiloInput,
    estiloBoton,
    actualizarProductor,
    actualizarPredio,
    actualizarInfraestructura,
    actualizarProduccion,
    guardarCambiosReal,
    eliminarDefinitivoReal,
    cambiarDueñoPredio,
    InputField,
    errors,
    esAdmin
}) {
    // ── ESTADO DE PAGINACIÓN ──
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;

    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda]);

    if (tabActiva !== "historial") return null;

    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const prediosPaginados = prediosFiltrados.slice(indicePrimerElemento, indiceUltimoElemento);
    const totalPaginas = Math.ceil(prediosFiltrados.length / elementosPorPagina);

    // Verificamos si el predio seleccionado está inhabilitado (por cambio de dueño)
    const estaInhabilitado = predioSeleccionado?.estado === 'inactivo' || predioSeleccionado?.inhabilitado === true;

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* ── TÍTULO Y BUSCADOR ── */}
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: "20px", flexWrap: "wrap", gap: "10px"
            }}>
                <h2 style={{ color: "#136442", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                    Historial de Predios Registrados
                </h2>

                <div style={{ position: "relative", width: "100%", maxWidth: "350px" }}>
                    <input
                        type="text"
                        placeholder="Buscar por productor o predio..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{
                            width: "100%", padding: "10px 15px", borderRadius: "8px",
                            border: "1.4px solid #ccc", fontSize: "14px", outline: "none",
                        }}
                    />
                </div>
            </div>

            {/* ── TABLA DE REGISTROS ── */}
            <div style={{
                backgroundColor: "#fff", padding: "20px", borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eee", overflowX: "auto"
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #136442", color: "#136442" }}>
                            <th style={{ fontSize: "14px", padding: "12px" }}>#</th>
                            <th style={{ fontSize: "14px", padding: "12px" }}>Nombre del Predio</th>
                            <th style={{ fontSize: "14px", padding: "12px" }}>Productor</th>
                            <th style={{ fontSize: "14px", padding: "12px" }}>Municipio</th>
                            <th style={{ fontSize: "14px", padding: "12px" }}>Superficie</th>
                            <th style={{ fontSize: "14px", padding: "12px" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prediosPaginados.length > 0 ? (
                            prediosPaginados.map((p, index) => {
                                const numeroFila = indicePrimerElemento + index + 1;
                                const inhabilitadoFila = p.estado === 'inactivo' || p.inhabilitado === true;

                                return (
                                    <tr
                                        key={p.id_predio}
                                        style={{
                                            borderBottom: "1px solid #f0f0f0",
                                            backgroundColor: inhabilitadoFila ? "#f3f4f6" : (index % 2 === 0 ? "#ffffff" : "#f9fafb"),
                                            color: inhabilitadoFila ? "#9ca3af" : "#4b4b4b",
                                            fontWeight: "500",
                                            textDecoration: inhabilitadoFila ? "line-through" : "none"
                                        }}
                                    >
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{numeroFila}</td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>
                                            {p.nombre_predio} {inhabilitadoFila && <span style={{ textDecoration: 'none', color: '#dc2626', fontSize: '10px', fontWeight: 'bold', marginLeft: '6px', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>INHABILITADO (CAMBIO DE DUEÑO)</span>}
                                        </td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{p.productor?.nombre || "Sin nombre"}</td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{p.municipio}</td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{p.superficie} Ha</td>
                                        <td style={{ fontSize: "13px", padding: "12px", textDecoration: "none" }}>
                                            <button
                                                onClick={() => manejarVerDetalles(p)}
                                                style={{
                                                    backgroundColor: inhabilitadoFila ? "#e5e7eb" : "#f0fdf4",
                                                    color: inhabilitadoFila ? "#4b5563" : "#136442",
                                                    border: `1px solid ${inhabilitadoFila ? "#9ca3af" : "#136442"}`,
                                                    padding: "6px 12px",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                    fontFamily: "Poppins, sans-serif"
                                                }}
                                            >
                                                {inhabilitadoFila ? "Ver Histórico" : "Ver Detalles"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#999" }}>No se encontraron registros.</td></tr>
                        )}
                    </tbody>
                </table>

                {/* ── CONTROLES DE PAGINACIÓN ── */}
                {totalPaginas > 1 && (
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #eee", flexWrap: "wrap", gap: "10px"
                    }}>
                        <span style={{ fontSize: "13px", color: "#666" }}>
                            Mostrando del <strong>{indicePrimerElemento + 1}</strong> al <strong>{Math.min(indiceUltimoElemento, prediosFiltrados.length)}</strong> de <strong>{prediosFiltrados.length}</strong> predios
                        </span>

                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
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

                            <span style={{ fontSize: "13px", padding: "0 8px", fontWeight: "bold", color: "#333" }}>
                                Página {paginaActual} de {totalPaginas}
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
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.7)", display: "flex",
                    justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "15px"
                }}>
                    <div style={{
                        backgroundColor: "#fff", width: "100%", maxWidth: "950px", maxHeight: "95vh",
                        borderRadius: "12px", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        display: "flex", flexDirection: "column"
                    }}>
                        {/* Encabezado Dinámico */}
                        <div style={{
                            backgroundColor: estaInhabilitado ? "#b91c1c" : "#136442",
                            padding: "18px 25px", color: "#fff", display: "flex",
                            justifyContent: "space-between", alignItems: "center",
                            position: "sticky", top: 0, zIndex: 10
                        }}>
                            <h3 style={{ margin: 0, fontSize: "16px" }}>
                                {estaInhabilitado
                                    ? `PREDIO INHABILITADO (CAMBIO DE DUEÑO): ${predioSeleccionado.nombre_predio.toUpperCase()}`
                                    : cargandoAccion ? "PROCESANDO..." : editando ? "MODO EDICIÓN ACTIVADO" : `FICHA TÉCNICA: ${predioSeleccionado.nombre_predio.toUpperCase()}`}
                            </h3>
                            <button onClick={() => { if (!cargandoAccion) { setMostrarModal(false); setEditando(false); } }} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "22px" }}>✕</button>
                        </div>

                        {/* Aviso en caso de estar inhabilitado */}
                        {estaInhabilitado && (
                            <div style={{ backgroundColor: "#fef2f2", color: "#991b1b", padding: "12px 25px", borderBottom: "1px solid #fca5a5", fontSize: "13px", fontWeight: "bold" }}>
                                ⚠ Este predio se encuentra inhabilitado por cambio de dueño. Sus datos están congelados únicamente para consulta histórica y conservación de gráficos.
                            </div>
                        )}

                        <div style={{ padding: "30px", opacity: cargandoAccion ? 0.5 : 1, pointerEvents: cargandoAccion || estaInhabilitado ? 'none' : 'auto' }}>
                            {/* I. DATOS DEL PRODUCTOR */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px", marginBottom: "35px" }}>
                                <div style={{ gridColumn: "span 3", borderBottom: `2px solid ${estaInhabilitado ? "#b91c1c" : "#136442"}`, paddingBottom: "5px" }}>
                                    <strong style={{ color: estaInhabilitado ? "#b91c1c" : "#136442", fontSize: "14px" }}>I. DATOS DEL PRODUCTOR</strong>
                                </div>
                                <div>
                                    <InputField
                                        label="Nombre Completo"
                                        name="nombre"
                                        value={predioSeleccionado.productor?.nombre || "N/A"}
                                        onChange={(e) => editando && actualizarProductor('nombre', e.target.value)}
                                        disabled={!editando || estaInhabilitado}
                                        error={errors?.productor_nombre}
                                    />
                                </div>
                                <div>
                                    <InputField
                                        label="Cédula / RIF"
                                        name="productor_cedula"
                                        value={predioSeleccionado.productor?.cedula_rif || "N/A"}
                                        disabled={true}
                                        style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                                    />
                                </div>
                                <div>
                                    <InputField
                                        label="Teléfono"
                                        name="telefono"
                                        value={predioSeleccionado.productor?.telefono || "N/A"}
                                        onChange={(e) => editando && actualizarProductor('telefono', e.target.value)}
                                        disabled={!editando || estaInhabilitado}
                                        error={errors?.productor_telefono}
                                    />
                                </div>
                                <div style={{ gridColumn: "span 3" }}>
                                    <InputField
                                        label="Correo Electrónico"
                                        name="correo"
                                        value={predioSeleccionado.productor?.correo || "N/A"}
                                        onChange={(e) => editando && actualizarProductor('correo', e.target.value)}
                                        disabled={!editando || estaInhabilitado}
                                        error={errors?.productor_correo}
                                    />
                                </div>
                            </div>

                            {/* II. GEORREFERENCIACIÓN Y UBICACIÓN */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px", marginBottom: "35px" }}>
                                <div style={{ gridColumn: "span 3", borderBottom: "2px solid #136442", paddingBottom: "5px" }}>
                                    <strong style={{ color: "#136442", fontSize: "14px" }}>II. GEORREFERENCIACIÓN Y UBICACIÓN</strong>
                                </div>
                                <div><InputField label="Municipio" value={predioSeleccionado.municipio || "N/A"} disabled={true} /></div>
                                <div><InputField label="Parroquia" value={predioSeleccionado.parroquia || "N/A"} disabled={true} /></div>
                                <div><InputField label="Comunidad / Sector" value={predioSeleccionado.comunidad || "N/A"} disabled={true} /></div>
                                <div style={{ gridColumn: "span 2" }}><InputField label="Coordenadas" value={predioSeleccionado.coordenadas || "Sin coordenadas"} disabled={true} /></div>
                                <div><InputField label="Centro Poblado" value={predioSeleccionado.centro_poblado || "N/A"} disabled={true} /></div>
                            </div>

                            {/* III y IV. IDENTIFICACIÓN Y TENENCIA */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px", marginBottom: "35px" }}>
                                <div style={{ gridColumn: "span 3", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
                                    <strong style={{ color: "#136442", fontSize: "14px" }}>III. IDENTIFICACIÓN Y IV. TENENCIA</strong>
                                </div>
                                <div style={{ gridColumn: "span 2" }}>
                                    <InputField
                                        label="Dirección Exacta"
                                        value={predioSeleccionado.direccion || "N/A"}
                                        onChange={(e) => editando && actualizarPredio('direccion', e.target.value)}
                                        disabled={!editando || estaInhabilitado}
                                    />
                                </div>
                                <div>
                                    <InputField
                                        label="Superficie (Ha)"
                                        value={predioSeleccionado.superficie || "N/A"}
                                        onChange={(e) => editando && actualizarPredio('superficie', e.target.value)}
                                        disabled={!editando || estaInhabilitado}
                                    />
                                </div>
                                <div>
                                    {editando && !estaInhabilitado ? (
                                        <>
                                            <small style={{ color: "#888", fontWeight: "bold", display: "block", marginBottom: "4px" }}>TIPO DE PROPIEDAD</small>
                                            <select style={estiloInput} value={predioSeleccionado.tipo_propiedad || ""} onChange={(e) => actualizarPredio('tipo_propiedad', e.target.value)}>
                                                <option value="Público">Público</option>
                                                <option value="Privado">Privado</option>
                                            </select>
                                        </>
                                    ) : (
                                        <InputField label="Tipo de Propiedad" value={predioSeleccionado.tipo_propiedad || "N/A"} disabled={true} />
                                    )}
                                </div>
                                <div>
                                    <InputField
                                        label="Tenencia de la Tierra"
                                        value={predioSeleccionado.tenencia || "N/A"}
                                        onChange={(e) => editando && actualizarPredio('tenencia', e.target.value)}
                                        disabled={!editando || estaInhabilitado}
                                    />
                                </div>
                                <div>
                                    {editando && !estaInhabilitado ? (
                                        <>
                                            <small style={{ color: "#888", fontWeight: "bold", display: "block", marginBottom: "4px" }}>CONDICIÓN VIALIDAD</small>
                                            <select style={estiloInput} value={predioSeleccionado.vialidad || ""} onChange={(e) => actualizarPredio('vialidad', e.target.value)}>
                                                <option value="Excelente">Excelente</option>
                                                <option value="Bueno">Bueno</option>
                                                <option value="Regular">Regular</option>
                                                <option value="Malo">Malo</option>
                                            </select>
                                        </>
                                    ) : (
                                        <InputField label="Condición Vialidad" value={predioSeleccionado.vialidad || "N/A"} disabled={true} />
                                    )}
                                </div>
                            </div>

                            {/* VI. INFRAESTRUCTURA */}
                            <div style={{ marginBottom: "35px" }}>
                                <div style={{ borderBottom: "2px solid #136442", paddingBottom: "5px", marginBottom: "15px" }}>
                                    <strong style={{ color: "#136442", fontSize: "14px" }}>VI. INFRAESTRUCTURA</strong>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
                                    {[
                                        { k: 'corrales', l: 'CORRALES' }, { k: 'galpones', l: 'GALPONES' }, { k: 'vaqueras', l: 'VAQUERAS' },
                                        { k: 'cochineras', l: 'COCHINERAS' }, { k: 'silos', l: 'SILOS' }, { k: 'caballerizas', l: 'CABALLERIZAS' },
                                        { k: 'feedlot', l: 'FEEDLOT' }, { k: 'lagunas', l: 'LAGUNAS' }, { k: 'salas_ordeno', l: 'SALAS ORDEÑO' },
                                        { k: 'queseras', l: 'QUESERAS' }, { k: 'casas', l: 'CASAS' }, { k: 'trapiches', l: 'TRAPICHES' }, { k: 'establos', l: 'ESTABLOS' }
                                    ].map((item) => {
                                        const valorAsignado = Number(predioSeleccionado.infraestructura?.[item.k] || 0);
                                        const tieneCantidad = valorAsignado > 0;
                                        return (
                                            <div key={item.k} style={{
                                                border: "1px solid", borderColor: tieneCantidad ? "#bbf7d0" : "#e2e8f0",
                                                padding: "12px 10px", borderRadius: "8px", textAlign: "center",
                                                backgroundColor: tieneCantidad ? "#f0fdf4" : "#fff"
                                            }}>
                                                <small style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", display: "block", marginBottom: "6px" }}>{item.l}</small>
                                                {editando && !estaInhabilitado ? (
                                                    <input
                                                        type="number" min="0" value={valorAsignado}
                                                        onChange={(e) => actualizarInfraestructura(item.k, e.target.value)}
                                                        style={{ width: "100%", background: "transparent", border: "none", outline: "none", textAlign: "center", fontWeight: "bold", fontSize: "18px", color: "#136442" }}
                                                    />
                                                ) : (
                                                    <span style={{ fontWeight: "bold", fontSize: "18px", color: tieneCantidad ? "#136442" : "#333" }}>{valorAsignado}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* V. SERVICIOS BÁSICOS */}
                            <div style={{ marginBottom: "35px" }}>
                                <div style={{ borderBottom: "2px solid #136442", paddingBottom: "5px", marginBottom: "15px" }}>
                                    <strong style={{ color: "#136442", fontSize: "14px" }}>V. SERVICIOS BÁSICOS</strong>
                                </div>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {[
                                        { id: 'Agua', l: 'Agua' },
                                        { id: 'Electricidad', l: 'Electricidad' },
                                        { id: 'Gas', l: 'Gas' },
                                        { id: 'Internet', l: 'Internet' },
                                        { id: 'Teléfono', l: 'Teléfono' },
                                        { id: 'Transporte', l: 'Transporte' }
                                    ].map((srv) => {
                                        const poseeServicio = predioSeleccionado.servicios_lectura?.includes(srv.id);

                                        return (
                                            <div
                                                key={srv.id}
                                                onClick={() => {
                                                    if (editando && !estaInhabilitado) {
                                                        const nuevosServicios = poseeServicio
                                                            ? predioSeleccionado.servicios_lectura.filter(s => s !== srv.id)
                                                            : [...(predioSeleccionado.servicios_lectura || []), srv.id];

                                                        actualizarPredio('servicios_lectura', nuevosServicios);
                                                    }
                                                }}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    padding: "10px 18px",
                                                    borderRadius: "8px",
                                                    backgroundColor: poseeServicio ? "#136442" : "#f1f5f9",
                                                    color: poseeServicio ? "#fff" : "#475569",
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                    border: "1px solid",
                                                    borderColor: poseeServicio ? "#136442" : "#cbd5e1",
                                                    cursor: editando && !estaInhabilitado ? "pointer" : "default",
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                <span style={{ fontSize: "14px", fontWeight: "bold", color: poseeServicio ? "#fff" : "#94a3b8" }}>
                                                    {poseeServicio ? "✓" : "○"}
                                                </span>
                                                {srv.l}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* VII. MODELO DE PRODUCCIÓN */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "25px" }}>
                                <div style={{ border: "1px solid #e0e0e0", padding: "15px", borderRadius: "8px" }}>
                                    <strong style={{ color: "#136442", fontSize: "13px", display: "block", marginBottom: "10px" }}>TIPO DE EXPLOTACIÓN</strong>
                                    {editando && !estaInhabilitado ? (
                                        <select style={estiloInput} value={predioSeleccionado.produccion?.tipo_explotacion || ""} onChange={(e) => actualizarProduccion('tipo_explotacion', e.target.value)}>
                                            <option value="Intensivo">Intensivo</option>
                                            <option value="Semi Intensivo">Semi Intensivo</option>
                                            <option value="Extensivo">Extensivo</option>
                                        </select>
                                    ) : (
                                        <span style={{ fontSize: "18px", fontWeight: "bold" }}>{predioSeleccionado.produccion?.tipo_explotacion}</span>
                                    )}
                                </div>
                                <div style={{ border: "1px solid #e0e0e0", padding: "15px", borderRadius: "8px" }}>
                                    <strong style={{ color: "#136442", fontSize: "13px", display: "block", marginBottom: "10px" }}>SISTEMAS DE REGISTRO</strong>
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                        {[
                                            { k: 'registro_sanitario', l: 'SANITARIO' }, { k: 'registro_productivo', l: 'PRODUCTIVO' },
                                            { k: 'registro_reproductivo', l: 'REPRODUCTIVO' }, { k: 'registro_financiero', l: 'FINANCIERO' }
                                        ].map((reg) => (
                                            <div
                                                key={reg.k}
                                                onClick={() => editando && !estaInhabilitado && actualizarProduccion(reg.k, !predioSeleccionado.produccion?.[reg.k])}
                                                style={{
                                                    display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "20px",
                                                    backgroundColor: predioSeleccionado.produccion?.[reg.k] ? "#136442" : "#f0f0f0",
                                                    color: predioSeleccionado.produccion?.[reg.k] ? "#fff" : "#999",
                                                    fontSize: "11px", fontWeight: "bold", cursor: editando && !estaInhabilitado ? "pointer" : "default", transition: "all 0.2s"
                                                }}
                                            >
                                                {predioSeleccionado.produccion?.[reg.k] ? "✓" : "○"} {reg.l}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── BOTONERA FINAL ── */}
                        <div style={{
                            padding: "20px 30px", backgroundColor: "#f4f4f4", display: "flex",
                            justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #ddd",
                            position: "sticky", bottom: 0, zIndex: 10
                        }}>
                            {/* Botón de Cambio de Dueño con SweetAlert2 (solo visible para empleados si el predio sigue activo) */}
                            {!esAdmin && !estaInhabilitado && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        Swal.fire({
                                            title: "¿Estás seguro?",
                                            text: "Esto inhabilitará permanentemente este registro en el historial para dar paso al nuevo predio.",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonColor: "#b91c1c",
                                            cancelButtonColor: "#374151",
                                            confirmButtonText: "Sí, registrar cambio",
                                            cancelButtonText: "Cancelar"
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                cambiarDueñoPredio(predioSeleccionado);
                                            }
                                        });
                                    }}
                                    disabled={cargandoAccion}
                                    style={{ ...estiloBoton, backgroundColor: "#b91c1c" }}
                                >
                                    CAMBIO DE DUEÑO
                                </button>
                            )}

                            {/* Botón de Eliminar exclusivo de Admin (si aplica) */}
                            {esAdmin && (
                                <button type="button" onClick={eliminarDefinitivoReal} disabled={cargandoAccion} style={{ ...estiloBoton, backgroundColor: "#ce3a3a" }}>
                                    ELIMINAR
                                </button>
                            )}

                            {/* Botón de Editar / Guardar Cambios (bloqueado si está inhabilitado) */}
                            {!estaInhabilitado && (
                                <button type="button" onClick={() => editando ? guardarCambiosReal() : setEditando(true)} style={{ ...estiloBoton, backgroundColor: "#136442" }}>
                                    {cargandoAccion ? "PROCESANDO..." : editando ? "CONFIRMAR CAMBIOS" : "EDITAR FICHA"}
                                </button>
                            )}

                            {/* Botón Salir */}
                            <button type="button" onClick={() => { setMostrarModal(false); setEditando(false); }} style={{ ...estiloBoton, backgroundColor: "#374151" }}>
                                SALIR DE FICHA
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}