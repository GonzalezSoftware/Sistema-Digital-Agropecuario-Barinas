import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { ChartPieIcon, MapIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { generarPDFReporteGeneralPredios } from './ReportesGeneralesListaPredios';
import { generarPDFReporteTotalesPredios } from './ReportesGeneralesTotalesPredios';

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

export const AdminReportesGenerales = ({ listaPredios = [] }) => {
    const [municipioPredios, setMunicipioPredios] = useState("");
    const [municipioTotales, setMunicipioTotales] = useState("");
    const [municipioProduccion, setMunicipioProduccion] = useState("");

    const handleExportarPredios = (e) => {
        e.preventDefault();
        generarPDFReporteGeneralPredios(municipioPredios, listaPredios);
    };

    const handleExportarTotales = (e) => {
        e.preventDefault();
        generarPDFReporteTotalesPredios(municipioTotales, listaPredios);
    };

    const handleExportarProduccion = (e) => {
        e.preventDefault();
        if (!municipioProduccion) {
            Swal.fire({
                title: 'Selección requerida',
                text: 'Por favor seleccione un municipio para el reporte de producción.',
                icon: 'warning',
                confirmButtonColor: '#136442'
            });
            return;
        }

        Swal.fire({
            title: 'En desarrollo',
            text: `Exportando reporte general de producción para el municipio: ${municipioProduccion}...`,
            icon: 'info',
            confirmButtonColor: '#136442'
        });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "24px" }}>
                
                {/* 1. Lista General de Predios del Municipio (Catastro Detallado) */}
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
                                1. Lista General de Predios del Municipio
                            </h4>
                        </div>
                        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: "1.5" }}>
                            Exporta el catastro oficial y el detalle de todos los predios registrados del municipio seleccionado en un formato PDF formal.
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
                                <option value="">Seleccione un municipio...</option>
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

                {/* 2. Reporte General de Totales y Estadísticas del Dashboard */}
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
                                2. Reporte de Totales y Estadísticas
                            </h4>
                        </div>
                        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: "1.5" }}>
                            Exporta el resumen consolidado de predios censados, superficie total, distribución por parroquias y estatus legal de la tierra.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                                Seleccione el Municipio:
                            </label>
                            <select
                                value={municipioTotales}
                                onChange={(e) => setMunicipioTotales(e.target.value)}
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
                                <option value="">Seleccione un municipio...</option>
                                {MUNICIPIOS_BARINAS.map((mun, index) => (
                                    <option key={index} value={mun}>{mun}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleExportarTotales}
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
                        <span>Exportar Totales</span>
                    </button>
                </div>

            </div>
        </div>
    );
};