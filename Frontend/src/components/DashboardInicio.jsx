import React from 'react';
import {
    ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Radar, ScatterChart, Scatter, Treemap
} from 'recharts';
import { Spinner, CardStat } from './ui/AdminUI';

// ── COMPONENTE PERSONALIZADO PARA EL TREEMAP ──
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
                    strokeWidth: 1, // Reducimos el borde para que no "contamine" la vista
                }}
            />
            {width > 60 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#F8FAFC" // Usamos un blanco tipo "Humo" (Slate 50) que quita el efecto de brillo agresivo
                    fontSize={10}
                    fontWeight="100" // Bajamos de 600 a 500 para que la letra sea más fina y nítida
                    style={{
                        pointerEvents: 'none',
                        textShadow: 'none', // Forzamos a que no tenga sombras
                        letterSpacing: '0.02em'
                    }}
                >
                    {name}
                </text>
            )}
        </g>
    );
};

export default function DashboardInicio({
    cargando,
    totalPredios,
    superficieTotal,
    municipiosCubiertos,
    totalMunicipiosBarinas,
    listaPredios,
    datosGrafico,
    datosTenencia,
    datosServicios,
    datosVialidad,
    datosIntensidad,
    datosDispersion,
    datosLegales,
    chartCard,
    chartTitle,
    chartPlaceholder
}) {
    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
            {/* ── TARJETAS DE ESTADÍSTICAS ── */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "24px",
                marginBottom: "30px"
            }}>
                <CardStat
                    label="Predios Censados"
                    value={cargando ? <Spinner /> : totalPredios}
                    color="#136442"
                />

                <CardStat
                    label="Superficie Total"
                    value={cargando ? <Spinner /> : `${superficieTotal.toLocaleString()} Ha`}
                    color="#136442"
                />

                <CardStat
                    label="Municipios Cubiertos"
                    value={cargando ? <Spinner /> : `${municipiosCubiertos} / ${totalMunicipiosBarinas}`}
                    color="#136442"
                />
            </div>

            {/* ── GRÁFICOS ── */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "20px"
            }}>
                {/* Gráfico 1 - Barras */}
                <div style={chartCard}>
                    <h3 style={chartTitle}>Predios por Municipio</h3>
                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : listaPredios.length === 0 ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><p style={{ color: '#999' }}>No hay datos para mostrar</p></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={datosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 11, fontWeight: 500 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 11 }} allowDecimals={false} dx={-10} domain={[0, dataMax => (dataMax <= 1 ? 1 : dataMax + 1)]} />
                                    <Tooltip cursor={{ fill: 'rgba(19, 100, 66, 0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} itemStyle={{ color: '#136442', fontWeight: 'bold' }} />
                                    <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} barSize={35}>
                                        {datosGrafico.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#136442' : '#4CAF50'} fillOpacity={0.8 + (index * -0.1)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Gráfico 2 - Circular (Dona) */}
                <div style={chartCard}>
                    <h3 style={chartTitle}>Estatus Legal de la Tierra</h3>
                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : listaPredios.length === 0 ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><p style={{ color: '#999' }}>Sin datos de tenencia</p></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={datosTenencia} cx="50%" cy="45%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" animationDuration={1000}>
                                        {datosTenencia.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Gráfico 3 - Radar (Servicios Básicos) */}
                <div style={chartCard}>
                    <h3 style={chartTitle}>Cobertura de Servicios Básicos (%)</h3>
                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : listaPredios.length === 0 ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><p style={{ color: '#999' }}>Sin datos de servicios</p></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={datosServicios}>
                                    <PolarGrid stroke="#e0e0e0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 11, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} />
                                    <Radar name="Cobertura" dataKey="A" stroke="#136442" fill="#136442" fillOpacity={0.5} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => [`${value.toFixed(1)}%`, "Cobertura"]} />
                                </RadarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Gráfico 4 - Vialidad */}
                <div style={chartCard}>
                    <h3 style={chartTitle}>Estado de la Vialidad</h3>
                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : listaPredios.length === 0 ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><p style={{ color: '#999' }}>Sin datos de vialidad</p></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={datosVialidad} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="estado" type="category" tick={{ fontSize: 12, fontWeight: 'bold' }} width={80} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                                    <Bar dataKey="cantidad" radius={[0, 5, 5, 0]} barSize={30}>
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

                {/* Gráfico 5 - Intensidad de Producción */}
                <div style={chartCard}>
                    <h3 style={chartTitle}>Intensidad de Producción por Municipio</h3>
                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : listaPredios.length === 0 ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><p style={{ color: '#999' }}>No hay datos para mostrar</p></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={datosIntensidad} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="municipio" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 11, fontWeight: 500 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 11 }} allowDecimals={false} dx={-10} domain={[0, dataMax => (dataMax <= 1 ? 1 : dataMax + 0.5)]} />
                                    <Tooltip cursor={{ fill: 'rgba(19, 100, 66, 0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                                    <Bar dataKey="Intensivo" fill="#136442" barSize={35} radius={[6, 6, 6, 6]} />
                                    <Bar dataKey="Semi Intensivo" fill="#4CAF50" barSize={35} radius={[6, 6, 6, 6]} />
                                    <Bar dataKey="Extensivo" fill="#82ca9d" barSize={35} radius={[6, 6, 6, 6]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Gráfico 6 - Dispersión: Superficie vs Infraestructura */}
                <div style={chartCard}>
                    <h3 style={chartTitle}>Relación Superficie vs. Infraestructura</h3>
                    <div style={{ width: '100%', height: 350, marginTop: '20px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : listaPredios.length === 0 ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><p style={{ color: '#999' }}>No hay datos para mostrar</p></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis type="number" dataKey="superficie" name="Superficie" unit=" Ha" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 11 }} />
                                    <YAxis type="number" dataKey="infraestructura" name="Infraestructura" unit=" und" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                                    <Scatter name="Predios" data={datosDispersion} fill="#136442" fillOpacity={0.6} />
                                </ScatterChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Gráfico 7 - Treemap de Tenencia de Tierras (Ancho Completo) */}
                <div style={{ ...chartCard, gridColumn: '1 / -1', width: '100%' }}>
                    <h3 style={chartTitle}>Distribución por Tenencia (Superficie)</h3>
                    <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : listaPredios.length === 0 ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><p style={{ color: '#999' }}>No hay datos de superficie en Aiven</p></div>
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