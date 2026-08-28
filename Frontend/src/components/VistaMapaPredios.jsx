import React from "react";
import MapaBarinas from "../components/MapaBarinas";

export default function VistaMapaPredios({ listaPredios, municipios }) {
    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", animation: "fadeIn 0.5s" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>

                {/* SECCIÓN SUPERIOR: EL MAPA A TODO ANCHO */}
                <div style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    padding: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    border: "1px solid #e0e0e0",
                    height: "600px"
                }}>
                    <div style={{ height: "100%", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                        <MapaBarinas predios={listaPredios} />
                    </div>
                </div>

                {/* SECCIÓN INFERIOR: RESUMEN POR MUNICIPIO EN CUADRÍCULA */}
                <div style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    border: "1px solid #eee"
                }}>
                    <h4 style={{
                        color: "#136442",
                        marginBottom: "20px",
                        fontWeight: "700",
                        borderBottom: "2px solid #ccc",
                        paddingBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                    }}>
                        Distribución por Municipios
                    </h4>

                    {/* Grid organizado para los contadores */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: "15px"
                    }}>
                        {municipios.map(muni => {
                            const total = listaPredios.filter(p => p.municipio === muni).length;
                            const tieneRegistros = total > 0;

                            return (
                                <div key={muni} style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "15px 10px",
                                    borderRadius: "8px",
                                    border: `1px solid ${tieneRegistros ? "#bbf7d0" : "#e5e7eb"}`,
                                    backgroundColor: tieneRegistros ? "#f0fdf4" : "#f9fafb",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                                    transition: "all 0.2s ease",
                                    cursor: "default"
                                }}>
                                    {/* Nombre del Municipio */}
                                    <span style={{
                                        fontSize: "10px",
                                        fontWeight: "bold",
                                        color: tieneRegistros ? "#136442" : "#6b7280",
                                        marginBottom: "6px",
                                        textAlign: "center",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px"
                                    }}>
                                        {muni}
                                    </span>

                                    {/* Contador Numérico */}
                                    <span style={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        color: tieneRegistros ? "#136442" : "#1f2937",
                                        lineHeight: "1"
                                    }}>
                                        {total}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}