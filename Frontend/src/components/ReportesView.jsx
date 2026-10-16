import React, { useState, useEffect } from 'react';
import { useReportes } from '../hooks/useReportes'; // Ajusta la ruta según tu estructura

// 1. Componente Spinner corporativo integrado
export const Spinner = ({ color = "#136442" }) => {
    const spinnerRef = (el) => {
        if (el) {
            el.animate(
                [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
                { duration: 1000, iterations: Infinity }
            );
        }
    };

    return (
        <svg
            ref={spinnerRef}
            width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
};

export const ReportesView = ({ predios = [], cargando }) => {
    const {
        busqueda,
        setBusqueda,
        prediosFiltrados,
        generarPDFPredio
    } = useReportes(predios);

    // ── ESTADO DE PAGINACIÓN ──
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;

    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda]);

    // 2. Validación de carga idéntica a las demás vistas
    if (cargando) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px",
                gap: "12px",
                color: "#136442",
                fontSize: "13px",
                fontWeight: "500"
            }}>
                <Spinner color="#136442" />
                <span>Cargando reportes...</span>
            </div>
        );
    }

    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const prediosPaginados = prediosFiltrados.slice(indicePrimerElemento, indiceUltimoElemento);
    const totalPaginas = Math.ceil(prediosFiltrados.length / elementosPorPagina);

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* ── TÍTULO Y BUSCADOR ── */}
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: "20px", flexWrap: "wrap", gap: "10px"
            }}>
                <h2 style={{ color: "#136442", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                    Reportes de Predios
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

                                return (
                                    <tr
                                        key={p.id_predio}
                                        style={{
                                            borderBottom: "1px solid #f0f0f0",
                                            backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                                            color: "#4b4b4b",
                                            fontWeight: "500"
                                        }}
                                    >
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{numeroFila}</td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{p.nombre_predio}</td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{p.productor?.nombre || "Sin nombre"}</td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{p.municipio}</td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{p.superficie} Ha</td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>
                                            <button
                                                onClick={() => {
                                                    const servicios = p.servicios_lectura || [];
                                                    const predioParaPDF = {
                                                        ...p,
                                                        servicios_lectura: servicios
                                                    };
                                                    generarPDFPredio(predioParaPDF);
                                                }}
                                                style={{
                                                    backgroundColor: "#f0fdf4",
                                                    color: "#136442",
                                                    border: "1px solid #136442",
                                                    padding: "6px 12px",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                    fontFamily: "Poppins, sans-serif"
                                                }}
                                            >
                                                Generar Ficha PDF
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                                    No se encontraron registros.
                                </td>
                            </tr>
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
        </div>
    );
};