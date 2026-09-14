import React from 'react';
import { useReportes } from '../hooks/useReportes'; // Ajusta la ruta según tu estructura

export const ReportesView = ({ predios = [] }) => {
    const {
        busqueda,
        setBusqueda,
        prediosFiltrados,
        generarPDFPredio
    } = useReportes(predios);

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
                        {prediosFiltrados.length > 0 ? (
                            prediosFiltrados.map((p, index) => (
                                <tr
                                    key={p.id_predio}
                                    style={{
                                        borderBottom: "1px solid #f0f0f0",
                                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                                        color: "#4b4b4b",
                                        fontWeight: "500"
                                    }}
                                >
                                    <td style={{ fontSize: "13px", padding: "12px" }}>{index + 1}</td>
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                                    No se encontraron registros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};