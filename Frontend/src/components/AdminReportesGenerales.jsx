import React, { useState } from 'react';
import { DocumentChartBarIcon, ArrowDownTrayIcon, MapIcon, ChartPieIcon } from "@heroicons/react/24/solid";

// Lista de los 12 municipios del Estado Barinas
const MUNICIPIOS_BARINAS = [
    "Alberto Arvelo Torrealba",
    "Andrés Eloy Blanco",
    "Antonio José de Sucre",
    "Arismendi",
    "Barinas",
    "Bolívar",
    "Cruz Paredes",
    "Ezequiel Zamora",
    "Obispos",
    "Pedraza",
    "Rojas",
    "Sosa"
];

export const AdminReportesGenerales = () => {
    // Estados independientes para cada tipo de reporte
    const [municipioPredios, setMunicipioPredios] = useState("");
    const [municipioProduccion, setMunicipioProduccion] = useState("");

    const handleExportarPredios = (e) => {
        e.preventDefault();
        if (!municipioPredios) {
            alert("Por favor seleccione un municipio para el reporte de predios.");
            return;
        }
        // Simulación de exportación (Front-end)
        alert(`Exportando reporte general de predios para el municipio: ${municipioPredios}... (Próximamente conexión backend)`);
    };

    const handleExportarProduccion = (e) => {
        e.preventDefault();
        if (!municipioProduccion) {
            alert("Por favor seleccione un municipio para el reporte de producción.");
            return;
        }
        // Simulación de exportación (Front-end)
        alert(`Exportando reporte general de producción para el municipio: ${municipioProduccion}... (Próximamente conexión backend)`);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>

            {/* Contenedor de las dos opciones de reportes (Lado a lado con grid flexible) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "24px" }}>
                
                {/* 1. Reporte General de Predios */}
                <div style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                            <MapIcon style={{ width: "22px", height: "22px", color: "#136442" }} />
                            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
                                1. Reporte General de Predios
                            </h4>
                        </div>
                        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: "1.5" }}>
                            Exporta el catastro y la información detallada de todos los predios registrados  por el municipio seleccionado.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                                Seleccione el Municipio:
                            </label>
                            <select
                                value={municipioPredios}
                                onChange={(e) => setMunicipioPredios(e.target.value)}
                                style={{
                                    padding: "12px",
                                    borderRadius: "10px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "14px",
                                    backgroundColor: "#f8fafc",
                                    color: "#1e293b",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                            >
                                <option value="">Seleccione un municipio </option>
                                {MUNICIPIOS_BARINAS.map((mun, index) => (
                                    <option key={index} value={mun}>{mun}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleExportarPredios}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            backgroundColor: "#136442",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "10px",
                            padding: "12px 16px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0f4d34"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#136442"}
                    >
                        <ArrowDownTrayIcon style={{ width: "18px", height: "18px" }} />
                        <span>Exportar Predios</span>
                    </button>
                </div>

                {/* 2. Reporte General de Producción */}
                <div style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                            <ChartPieIcon style={{ width: "22px", height: "22px", color: "#136442" }} />
                            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
                                2. Reporte General de Producción
                            </h4>
                        </div>
                        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: "1.5" }}>
                            Exporta el resumen de producción agrícola y pecuaria consolidada correspondiente al municipio seleccionado.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                                Seleccione el Municipio:
                            </label>
                            <select
                                value={municipioProduccion}
                                onChange={(e) => setMunicipioProduccion(e.target.value)}
                                style={{
                                    padding: "12px",
                                    borderRadius: "10px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "14px",
                                    backgroundColor: "#f8fafc",
                                    color: "#1e293b",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                            >
                                <option value="">Seleccione un municipio </option>
                                {MUNICIPIOS_BARINAS.map((mun, index) => (
                                    <option key={index} value={mun}>{mun}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleExportarProduccion}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            backgroundColor: "#136442",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "10px",
                            padding: "12px 16px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0f4d34"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#136442"}
                    >
                        <ArrowDownTrayIcon style={{ width: "18px", height: "18px" }} />
                        <span>Exportar Producción</span>
                    </button>
                </div>

            </div>
        </div>
    );
};