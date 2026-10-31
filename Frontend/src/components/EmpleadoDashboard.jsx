import React from 'react';
import {
    ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Radar, ScatterChart, Scatter, Treemap
} from 'recharts';
import { Spinner, CardStat } from './ui/AdminUI';

const CustomTreemapContent = (props) => {
    const { x, y, width, height, name, index } = props;
    const colors = ['#136442', '#1b8a5b', '#34d399', '#6ee7b7', '#a7f3d0'];

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: colors[index % colors.length],
                    stroke: '#fff',
                    strokeWidth: 1,
                }}
            />
            {width > 50 && height > 25 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#F8FAFC"
                    fontSize={10}
                    fontWeight="100"
                    style={{ pointerEvents: 'none' }}
                >
                    {name}
                </text>
            )}
        </g>
    );
};

export default function DashboardEmpleado({
    cargando,
    totalPrediosMunicipio,
    superficieTotalMunicipio,
    listaPredios,
    datosTenencia,
    datosServicios,
    datosVialidad,
    datosDispersion,
    datosLegales,
    chartCard,
    chartTitle,
    chartPlaceholder
}) {
    return (
        <div className="empleado-dashboard-wrapper">
            {/* ── REGLAS CSS ISOLADAS PARA CONTROLAR EL ANCHO MÓVIL EXACTO ── */}
            <style>{`
                .empleado-dashboard-wrapper {
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 auto;
                    box-sizing: border-box !important;
                    padding: 8px;
                    overflow-x: hidden !important;
                }
                .empleado-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 16px;
                    margin-bottom: 20px;
                    width: 100%;
                    box-sizing: border-box;
                }
                .empleado-charts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 16px;
                    width: 100%;
                    box-sizing: border-box;
                }
                .empleado-card-container {
                    width: 100% !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                    min-width: 0 !important;
                    overflow: hidden !important;
                }
                .empleado-treemap-card {
                    grid-column: 1 / -1;
                    width: 100%;
                    box-sizing: border-box;
                }

                /* 🔹 AJUSTES FORZADOS PARA DISPOSITIVOS MÓVILES (Heredados idénticos a Admin) */
                @media (max-width: 768px) {
                    .empleado-dashboard-wrapper {
                        padding: 4px !important;
                    }
                    .empleado-stats-grid {
                        grid-template-columns: 1fr !important;
                        gap: 12px !important;
                    }
                    .empleado-charts-grid {
                        grid-template-columns: 1fr !important;
                        gap: 14px !important;
                    }
                    .empleado-treemap-card {
                        grid-column: 1 / 1 !important;
                    }
                    .empleado-chart-inner {
                        height: 240px !important;
                    }
                }
            `}</style>

            {/* ── TARJETAS DE ESTADÍSTICAS ── */}
            <div className="empleado-stats-grid">
                <CardStat
                    label="Predios Censados (Municipio)"
                    value={cargando ? <Spinner /> : totalPrediosMunicipio}
                    color="#136442"
                />

                <CardStat
                    label="Superficie Total Local"
                    value={cargando ? <Spinner /> : `${superficieTotalMunicipio.toLocaleString()} Ha`}
                    color="#136442"
                />
            </div>

            {/* ── GRÁFICOS RESPONSIVE ── */}
            <div className="empleado-charts-grid">
                
                {/* Gráfico 1 - Estatus Legal */}
                <div style={chartCard} className="empleado-card-container">
                    <h3 style={chartTitle}>Estatus Legal de la Tierra</h3>
                    <div className="empleado-chart-inner" style={{ width: '100%', height: 270, marginTop: '14px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : listaPredios.length === 0 ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><p style={{ color: '#999' }}>Sin datos de tenencia</p></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={datosTenencia} cx="50%" cy="45%" innerRadius={48} outerRadius={68} paddingAngle={5} dataKey="value" animationDuration={1000}>
                                        {datosTenencia.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Gráfico 2 - Radar (Servicios Básicos) */}
                <div style={chartCard} className="empleado-card-container">
                    <h3 style={chartTitle}>Cobertura de Servicios Básicos (%)</h3>
                    <div className="empleado-chart-inner" style={{ width: '100%', height: 270, marginTop: '14px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : listaPredios.length === 0 ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><p style={{ color: '#999' }}>Sin datos de servicios</p></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="60%" data={datosServicios}>
                                    <PolarGrid stroke="#e0e0e0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} axisLine={false} />
                                    <Radar name="Cobertura" dataKey="A" stroke="#136442" fill="#136442" fillOpacity={0.5} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => [`${value.toFixed(1)}%`, "Cobertura"]} />
                                </RadarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Gráfico 3 - Vialidad */}
                <div style={chartCard} className="empleado-card-container">
                    <h3 style={chartTitle}>Estado de la Vialidad</h3>
                    <div className="empleado-chart-inner" style={{ width: '100%', height: 270, marginTop: '14px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : listaPredios.length === 0 ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><p style={{ color: '#999' }}>Sin datos de vialidad</p></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={datosVialidad} margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="estado" type="category" tick={{ fontSize: 11, fontWeight: 'bold' }} width={70} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                                    <Bar dataKey="cantidad" radius={[0, 5, 5, 0]} barSize={22}>
                                        {datosVialidad.map((entry, index) => {
                                            const colors = { Excelente: '#0d5437', Bueno: '#338261', Regular: '#82ca9d', Malo: '#c8e6c9' };
                                            return <Cell key={`cell-${index}`} fill={colors[entry.estado] || '#8884d8'} />;
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Gráfico 4 - Dispersión */}
                <div style={chartCard} className="empleado-card-container">
                    <h3 style={chartTitle}>Relación Superficie vs. Infraestructura</h3>
                    <div className="empleado-chart-inner" style={{ width: '100%', height: 270, marginTop: '14px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : listaPredios.length === 0 ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><p style={{ color: '#999' }}>No hay datos para mostrar</p></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -15 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis type="number" dataKey="superficie" name="Superficie" unit=" Ha" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
                                    <YAxis type="number" dataKey="infraestructura" name="Infraestructura" unit=" und" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} allowDecimals={false} />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                                    <Scatter name="Predios" data={datosDispersion} fill="#136442" fillOpacity={0.6} />
                                </ScatterChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Gráfico 5 - Treemap */}
                <div style={chartCard} className="empleado-card-container empleado-treemap-card">
                    <h3 style={chartTitle}>Distribución por Tenencia (Superficie)</h3>
                    <div style={{ width: '100%', height: 320, marginTop: '14px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : listaPredios.length === 0 ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><p style={{ color: '#999' }}>No hay datos de superficie en el municipio</p></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <Treemap
                                    data={datosLegales}
                                    dataKey="size"
                                    aspectRatio={4 / 3}
                                    stroke="#fff"
                                    content={<CustomTreemapContent />}
                                >
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                            fontSize: '12px'
                                        }}
                                        formatter={(value, name, props) => [
                                            `${value} Hectáreas (${props.payload.porcentaje}%)`,
                                            props.payload.name
                                        ]}
                                    />
                                </Treemap>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}