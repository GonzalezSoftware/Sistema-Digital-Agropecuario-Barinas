import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { ChartPieIcon, MapIcon, ClipboardDocumentCheckIcon, CubeTransparentIcon, ArrowDownTrayIcon, UserGroupIcon, ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { generarPDFReporteGeneralPredios } from './ReportesGeneralesListaPredios';
import { generarPDFReporteTotalesPredios } from './ReportesGeneralesTotalesPredios';
import { generarPDFReportePrediosCaracterizados } from './ReportesGeneralesPrediosCaracterizados';
import { generarPDFReporteProduccionGeneral } from './ReportesGeneralesProduccion';
import { generarPDFReporteAnimal } from './ReportesGeneralesAnimal';
import { generarPDFReporteSistemasAnimal } from './ReportesGeneralesSistemasAnimal';
import { generarPDFReporteVegetal } from './ReportesGeneralesVegetal';

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

const ESPECES_ANIMALES = [
    "Bovino", "Bubalino", "Equino", "Ovino", "Porcino", "Caprino", "Cunicola", "Avicola", "Apicola"
];

const SISTEMAS_PRODUCCION_ANIMAL = [
    "Cría", "Ceba", "Doble propósito", "Lechería", "Genética", "Engorde", "Ciclo completo"
];

const LISTA_RUBROS_VEGETALES = [
    "Caraota", "Maíz Blanco", "Maíz Amarillo", "Arroz", "Sorgo",
    "Café", "Cacao", "Caña de Azúcar", "Yuca", "Plátano",
    "Cambur", "Auyama", "Tomate", "Cebolla", "Pimentón"
];

export const AdminReportesGenerales = ({ listaPredios = [] }) => {
    // Estados para los filtros de municipio (ahora con soporte global por defecto)
    const [municipioPredios, setMunicipioPredios] = useState("");
    const [municipioTotales, setMunicipioTotales] = useState("");
    const [municipioCaracterizados, setMunicipioCaracterizados] = useState("");
    const [municipioProduccion, setMunicipioProduccion] = useState("");

    const [filtroAnimal, setFiltroAnimal] = useState({ municipio: "", especie: "" });
    const [filtroSistemasAnimal, setFiltroSistemasAnimal] = useState({ municipio: "", sistema: "" });
    const [filtroVegetal, setFiltroVegetal] = useState({ municipio: "", rubro: "" });

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

    const handleExportarReporteAnimal = (e) => {
        e.preventDefault();
        generarPDFReporteAnimal(filtroAnimal.municipio, filtroAnimal.especie, listaPredios);
    };

    const handleExportarReporteSistemasAnimal = (e) => {
        e.preventDefault();
        generarPDFReporteSistemasAnimal(filtroSistemasAnimal.municipio, filtroSistemasAnimal.sistema, listaPredios);
    };

    const handleExportarReporteVegetal = (e) => {
        e.preventDefault();
        generarPDFReporteVegetal(filtroVegetal.municipio, filtroVegetal.rubro, listaPredios);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "100%", margin: "0 auto", boxSizing: "border-box", fontFamily: "'Poppins', sans-serif" }}>
            
            <style>{`
                .reportes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
                    gap: 20px;
                    width: 100%;
                    box-sizing: border-box;
                    margin: 0 auto;
                }
                @media (max-width: 480px) {
                    .reportes-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            <div className="reportes-grid">
                
                {/* 1. Lista General de Predios */}
                <div style={cardStyle}>
                    <div>
                        <div style={cardHeaderStyle}>
                            <MapIcon style={{ width: "22px", height: "22px", color: "#136442", flexShrink: 0 }} />
                            <h4 style={cardTitleStyle}>1. Lista General de Predios</h4>
                        </div>
                        <p style={cardDescStyle}>Exporta el catastro oficial y el detalle de todos los predios registrados (por municipio o general).</p>
                        <div style={selectContainerStyle}>
                            <label style={selectLabelStyle}>Seleccione el Municipio:</label>
                            <select value={municipioPredios} onChange={(e) => setMunicipioPredios(e.target.value)} style={selectStyle}>
                                <option value="">Todos los municipios (General)...</option>
                                {MUNICIPIOS_BARINAS.map((mun, i) => <option key={i} value={mun}>{mun}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleExportarPredios} style={buttonStyle}>
                        <ArrowDownTrayIcon style={{ width: "18px", height: "18px" }} />
                        <span>Exportar Predios</span>
                    </button>
                </div>

                {/* 2. Reporte General de Totales */}
                <div style={cardStyle}>
                    <div>
                        <div style={cardHeaderStyle}>
                            <ChartPieIcon style={{ width: "22px", height: "22px", color: "#136442", flexShrink: 0 }} />
                            <h4 style={cardTitleStyle}>2. Reporte de Totales y Estadísticas</h4>
                        </div>
                        <p style={cardDescStyle}>Exporta el resumen consolidado de predios censados, superficie, parroquias y estatus legal.</p>
                        <div style={selectContainerStyle}>
                            <label style={selectLabelStyle}>Seleccione el Municipio:</label>
                            <select value={municipioTotales} onChange={(e) => setMunicipioTotales(e.target.value)} style={selectStyle}>
                                <option value="">Todos los municipios (General)...</option>
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
                            <ClipboardDocumentCheckIcon style={{ width: "22px", height: "22px", color: "#136442", flexShrink: 0 }} />
                            <h4 style={cardTitleStyle}>3. Predios Ya Caracterizados</h4>
                        </div>
                        <p style={cardDescStyle}>Exporta exclusivamente el listado oficial de predios que ya han completado su caracterización.</p>
                        <div style={selectContainerStyle}>
                            <label style={selectLabelStyle}>Seleccione el Municipio:</label>
                            <select value={municipioCaracterizados} onChange={(e) => setMunicipioCaracterizados(e.target.value)} style={selectStyle}>
                                <option value="">Todos los municipios (General)...</option>
                                {MUNICIPIOS_BARINAS.map((mun, i) => <option key={i} value={mun}>{mun}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleExportarCaracterizados} style={buttonStyle}>
                        <ArrowDownTrayIcon style={{ width: "18px", height: "18px" }} />
                        <span>Exportar Caracterizados</span>
                    </button>
                </div>

                {/* 4. Reporte General de Producción */}
                <div style={cardStyle}>
                    <div>
                        <div style={cardHeaderStyle}>
                            <CubeTransparentIcon style={{ width: "22px", height: "22px", color: "#136442", flexShrink: 0 }} />
                            <h4 style={cardTitleStyle}>4. Reporte General de Producción</h4>
                        </div>
                        <p style={cardDescStyle}>Exporta el consolidado agronómico y pecuario: semovientes, hectáreas y rubros globales.</p>
                        <div style={selectContainerStyle}>
                            <label style={selectLabelStyle}>Seleccione el Municipio:</label>
                            <select value={municipioProduccion} onChange={(e) => setMunicipioProduccion(e.target.value)} style={selectStyle}>
                                <option value="">Todos los municipios (General)...</option>
                                {MUNICIPIOS_BARINAS.map((mun, i) => <option key={i} value={mun}>{mun}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleExportarProduccion} style={buttonStyle}>
                        <ArrowDownTrayIcon style={{ width: "18px", height: "18px" }} />
                        <span>Exportar Producción</span>
                    </button>
                </div>

                {/* 5. Reporte General Pecuario */}
                <div style={cardStyle}>
                    <div>
                        <div style={cardHeaderStyle}>
                            <UserGroupIcon style={{ width: "22px", height: "22px", color: "#136442", flexShrink: 0 }} />
                            <h4 style={cardTitleStyle}>5. Reporte General Pecuario</h4>
                        </div>
                        <p style={cardDescStyle}>Filtra por especie animal y municipio. Muestra predios ordenados de mayor a menor cantidad de cabezas con datos de productor.</p>
                        
                        <div style={selectContainerStyle}>
                            <label style={selectLabelStyle}>Seleccione el Municipio:</label>
                            <select value={filtroAnimal.municipio} onChange={(e) => setFiltroAnimal({...filtroAnimal, municipio: e.target.value})} style={selectStyle}>
                                <option value="">Todos los municipios (General)...</option>
                                {MUNICIPIOS_BARINAS.map((mun, i) => <option key={i} value={mun}>{mun}</option>)}
                            </select>

                            <label style={{...selectLabelStyle, marginTop: "8px"}}>Seleccione la Especie:</label>
                            <select value={filtroAnimal.especie} onChange={(e) => setFiltroAnimal({...filtroAnimal, especie: e.target.value})} style={selectStyle}>
                                <option value="">Seleccione una especie...</option>
                                {ESPECES_ANIMALES.map((esp, i) => <option key={i} value={esp}>{esp}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleExportarReporteAnimal} style={buttonStyle}>
                        <ArrowDownTrayIcon style={{ width: "18px", height: "18px" }} />
                        <span>Exportar Reporte Animal</span>
                    </button>
                </div>

                {/* 6. Reporte General Sistemas de Producción Animal */}
                <div style={cardStyle}>
                    <div>
                        <div style={cardHeaderStyle}>
                            <ShieldCheckIcon style={{ width: "22px", height: "22px", color: "#136442", flexShrink: 0 }} />
                            <h4 style={cardTitleStyle}>6. Reporte General Sistemas de Producción Animal</h4>
                        </div>
                        <p style={cardDescStyle}>Filtra por sistema productivo (Cría, Ceba, etc.) y municipio, ordenados por rendimiento/volumen.</p>
                        
                        <div style={selectContainerStyle}>
                            <label style={selectLabelStyle}>Seleccione el Municipio:</label>
                            <select value={filtroSistemasAnimal.municipio} onChange={(e) => setFiltroSistemasAnimal({...filtroSistemasAnimal, municipio: e.target.value})} style={selectStyle}>
                                <option value="">Todos los municipios (General)...</option>
                                {MUNICIPIOS_BARINAS.map((mun, i) => <option key={i} value={mun}>{mun}</option>)}
                            </select>

                            <label style={{...selectLabelStyle, marginTop: "8px"}}>Seleccione el Sistema:</label>
                            <select value={filtroSistemasAnimal.sistema} onChange={(e) => setFiltroSistemasAnimal({...filtroSistemasAnimal, sistema: e.target.value})} style={selectStyle}>
                                <option value="">Seleccione un sistema...</option>
                                {SISTEMAS_PRODUCCION_ANIMAL.map((sis, i) => <option key={i} value={sis}>{sis}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleExportarReporteSistemasAnimal} style={buttonStyle}>
                        <ArrowDownTrayIcon style={{ width: "18px", height: "18px" }} />
                        <span>Exportar Sistemas Animales</span>
                    </button>
                </div>

                {/* 7. Reporte General Vegetal */}
                <div style={cardStyle}>
                    <div>
                        <div style={cardHeaderStyle}>
                            <SparklesIcon style={{ width: "22px", height: "22px", color: "#136442", flexShrink: 0 }} />
                            <h4 style={cardTitleStyle}>7. Reporte General Vegetal</h4>
                        </div>
                        <p style={cardDescStyle}>Filtra por rubro agrícola y municipio. Ordenado de mayor a menor cantidad de hectáreas e incluye datos de contacto.</p>
                        
                        <div style={selectContainerStyle}>
                            <label style={selectLabelStyle}>Seleccione el Municipio:</label>
                            <select value={filtroVegetal.municipio} onChange={(e) => setFiltroVegetal({...filtroVegetal, municipio: e.target.value})} style={selectStyle}>
                                <option value="">Todos los municipios (General)...</option>
                                {MUNICIPIOS_BARINAS.map((mun, i) => <option key={i} value={mun}>{mun}</option>)}
                            </select>

                            <label style={{...selectLabelStyle, marginTop: "8px"}}>Seleccione el Rubro:</label>
                            <select value={filtroVegetal.rubro} onChange={(e) => setFiltroVegetal({...filtroVegetal, rubro: e.target.value})} style={selectStyle}>
                                <option value="">Seleccione un rubro...</option>
                                {LISTA_RUBROS_VEGETALES.map((rub, i) => <option key={i} value={rub}>{rub}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleExportarReporteVegetal} style={buttonStyle}>
                        <ArrowDownTrayIcon style={{ width: "18px", height: "18px" }} />
                        <span>Exportar Reporte Vegetal</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

// Estilos visuales estándar adaptativos y centrados
const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
    width: "100%",
    margin: "0 auto"
};
const cardHeaderStyle = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" };
const cardTitleStyle = { margin: 0, fontSize: "15px", fontWeight: "700", color: "#1e293b", wordBreak: "break-word" };
const cardDescStyle = { fontSize: "12.5px", color: "#64748b", marginBottom: "16px", lineHeight: "1.4" };
const selectContainerStyle = { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px", width: "100%", boxSizing: "border-box" };
const selectLabelStyle = { fontSize: "12px", fontWeight: "600", color: "#334155" };
const selectStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "13px",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    outline: "none",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box"
};
const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#136442",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
    width: "100%",
    boxSizing: "border-box"
};