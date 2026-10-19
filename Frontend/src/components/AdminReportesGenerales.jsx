import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { ChartPieIcon, MapIcon, ClipboardDocumentCheckIcon, CubeTransparentIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { generarPDFReporteGeneralPredios } from './ReportesGeneralesListaPredios';
import { generarPDFReporteTotalesPredios } from './ReportesGeneralesTotalesPredios';
import { generarPDFReportePrediosCaracterizados } from './ReportesGeneralesPrediosCaracterizados';
import { generarPDFReporteProduccionGeneral } from './ReportesGeneralesProduccion';

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
    const [municipioCaracterizados, setMunicipioCaracterizados] = useState("");
    const [municipioProduccion, setMunicipioProduccion] = useState(""); // Estado para Producción General

    const handleExportarPredios = (e) => {
        e.preventDefault();
        generarPDFReporteGeneralPredios(municipioPredios, listaPredios);
    };

    const handleExportarTotales = (e) => {
        e.preventDefault();
        generarPDFReporteTotalesPredios(municipioTotales, listaPredios);
    };

    const handleExportarCaracterizados = (e) => {
        e.preventDefault();
        generarPDFReportePrediosCaracterizados(municipioCaracterizados, listaPredios);
    };

    const handleExportarProduccion = (e) => {
        e.preventDefault();
        generarPDFReporteProduccionGeneral(municipioProduccion, listaPredios);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
                
                {/* 1. Lista General de Predios del Municipio */}
                <div style={cardStyle}>
                    <div>
                        <div style={cardHeaderStyle}>
                            <MapIcon style={{ width: "22px", height: "22px", color: "#136442" }} />
                            <h4 style={cardTitleStyle}>1. Lista General de Predios del Municipio</h4>
                        </div>
                        <p style={cardDescStyle}>Exporta el catastro oficial y el detalle de todos los predios registrados del municipio seleccionado en formato PDF.</p>

                        <div style={selectContainerStyle}>
                            <label style={selectLabelStyle}>Seleccione el Municipio:</label>
                            <select value={municipioPredios} onChange={(e) => setMunicipioPredios(e.target.value)} style={selectStyle}>
                                <option value="">Seleccione un municipio...</option>
                                {MUNICIPIOS_BARINAS.map((mun, i) => <option key={i} value={mun}>{mun}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleExportarPredios} style={buttonStyle}>
                        <ArrowDownTrayIcon style={{ width: "18px", height: "18px" }} />
                        <span>Exportar Predios</span>
                    </button>
                </div>

                {/* 2. Reporte General de Totales y Estadísticas */}
                <div style={cardStyle}>
                    <div>
                        <div style={cardHeaderStyle}>
                            <ChartPieIcon style={{ width: "22px", height: "22px", color: "#136442" }} />
                            <h4 style={cardTitleStyle}>2. Reporte de Totales y Estadísticas</h4>
                        </div>
                        <p style={cardDescStyle}>Exporta el resumen consolidado de predios censados, superficie, parroquias y estatus legal de la tierra.</p>

                        <div style={selectContainerStyle}>
                            <label style={selectLabelStyle}>Seleccione el Municipio:</label>
                            <select value={municipioTotales} onChange={(e) => setMunicipioTotales(e.target.value)} style={selectStyle}>
                                <option value="">Seleccione un municipio...</option>
                                {MUNICIPIOS_BARINAS.map((mun, i) => <option key={i} value={mun}>{mun}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleExportarTotales} style={buttonStyle}>
                        <ArrowDownTrayIcon style={{ width: "18px", height: "18px" }} />
                        <span>Exportar Totales</span>
                    </button>
                </div>

                {/* 3. Predios Ya Caracterizados */}
                <div style={cardStyle}>
                    <div>
                        <div style={cardHeaderStyle}>
                            <ClipboardDocumentCheckIcon style={{ width: "22px", height: "22px", color: "#136442" }} />
                            <h4 style={cardTitleStyle}>3. Predios Ya Caracterizados</h4>
                        </div>
                        <p style={cardDescStyle}>Exporta exclusivamente el listado oficial de predios que ya han completado su caracterización productiva.</p>

                        <div style={selectContainerStyle}>
                            <label style={selectLabelStyle}>Seleccione el Municipio:</label>
                            <select value={municipioCaracterizados} onChange={(e) => setMunicipioCaracterizados(e.target.value)} style={selectStyle}>
                                <option value="">Seleccione un municipio...</option>
                                {MUNICIPIOS_BARINAS.map((mun, i) => <option key={i} value={mun}>{mun}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleExportarCaracterizados} style={buttonStyle}>
                        <ArrowDownTrayIcon style={{ width: "18px", height: "18px" }} />
                        <span>Exportar Caracterizados</span>
                    </button>
                </div>

                {/* 4. NUEVA OPCIÓN: Reporte General de Producción */}
                <div style={cardStyle}>
                    <div>
                        <div style={cardHeaderStyle}>
                            <CubeTransparentIcon style={{ width: "22px", height: "22px", color: "#136442" }} />
                            <h4 style={cardTitleStyle}>4. Reporte General de Producción</h4>
                        </div>
                        <p style={cardDescStyle}>Exporta el consolidado agronómico y pecuario: semovientes unitarios por especie, hectáreas sembradas, rubros y destinos.</p>

                        <div style={selectContainerStyle}>
                            <label style={selectLabelStyle}>Seleccione el Municipio:</label>
                            <select value={municipioProduccion} onChange={(e) => setMunicipioProduccion(e.target.value)} style={selectStyle}>
                                <option value="">Seleccione un municipio...</option>
                                {MUNICIPIOS_BARINAS.map((mun, i) => <option key={i} value={mun}>{mun}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleExportarProduccion} style={buttonStyle}>
                        <ArrowDownTrayIcon style={{ width: "18px", height: "18px" }} />
                        <span>Exportar Producción</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

// Estilos reutilizables para las tarjetas
const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
};

const cardHeaderStyle = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" };
const cardTitleStyle = { margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e293b" };
const cardDescStyle = { fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: "1.5" };
const selectContainerStyle = { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" };
const selectLabelStyle = { fontSize: "13px", fontWeight: "600", color: "#334155" };
const selectStyle = {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    outline: "none",
    cursor: "pointer"
};
const buttonStyle = {
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
};