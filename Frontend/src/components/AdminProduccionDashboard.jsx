import React from "react";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, PieChart, Pie, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

export default function AdminProduccionDashboard({ productionState, cargando: cargandoProp, statsProduccion: statsProp }) {
    // Soportar ambas formas de pasar las props (directas o a través de productionState)
    const cargando = cargandoProp ?? productionState?.cargando;
    const statsProduccion = statsProp ?? productionState?.statsProduccion;

    // Componente Spinner corporativo animado
    const Spinner = ({ color = "#136442" }) => {
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
                width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
        );
    };

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* ── TARJETAS DE ESTADÍSTICAS ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "30px" }}>
                <CardStat label="Predios Caracterizados" value={cargando ? <Spinner /> : statsProduccion?.cards?.predios_caracterizados || 0} color="#136442" />
                <CardStat label="Cantidad de semovientes" value={cargando ? <Spinner /> : statsProduccion?.cards?.total_semovientes || 0} color="#136442" />
                <CardStat label="Hectareas sembradas" value={cargando ? <Spinner /> : statsProduccion?.cards?.total_hectareas || 0} color="#136442" />
            </div>

            {/* ── GRILLA DE GRÁFICOS ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>

                {/* 1. Gráfico 1: Cantidad por Especie */}
                <div style={chartCard}>
                    <h3 style={chartTitle}>Cantidad por Especie</h3>
                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : !statsProduccion?.graficos?.produccion_general ? (
                            <div style={chartPlaceholder}>No hay datos para mostrar</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statsProduccion.graficos.produccion_general}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="cantidad" fill="#136442" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* 2. Gráfico 2: Destino de Producción Vegetal */}
                <div style={chartCard}>
                    <h3 style={chartTitle}>Destino de Producción Vegetal</h3>
                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : !statsProduccion?.graficos?.destino_produccion_vegetal ? (
                            <div style={chartPlaceholder}>Sin datos de destino vegetal</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statsProduccion.graficos.destino_produccion_vegetal}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                    >
                                        {statsProduccion.graficos.destino_produccion_vegetal.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || ['#136442', '#28a745', '#8bc34a', '#558b2f'][index % 4]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* 3. Gráfico 3: Capacidades Productivas Pecuarias (Radar) */}
                <div style={chartCard}>
                    <h3 style={chartTitle}>Capacidades Productivas Pecuarias (Global)</h3>
                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : !statsProduccion?.graficos?.digitalizacion_radar ? (
                            <div style={chartPlaceholder}>Sin datos de capacidades</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={statsProduccion.graficos.digitalizacion_radar}>
                                    <PolarGrid stroke="#e0e0e0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} tick={{ fontSize: 9 }} axisLine={false} />
                                    <Radar name="Volumen / Unidades" dataKey="A" stroke="#136442" fill="#136442" fillOpacity={0.5} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* 4. Gráfico 4: Parque de Maquinaria */}
                <div style={chartCard}>
                    <h3 style={chartTitle}>Parque de Maquinaria y Vehículos Agrícolas</h3>
                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                        {cargando ? (
                            <div style={{ ...chartPlaceholder, border: 'none' }}><Spinner /></div>
                        ) : !statsProduccion?.graficos?.tipo_explotacion ? (
                            <div style={chartPlaceholder}>Sin datos de maquinaria</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statsProduccion.graficos.tipo_explotacion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="cantidad" fill="#28a745" radius={[6, 6, 0, 0]} barSize={35} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

const CardStat = ({ label, value, color }) => (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "20px", borderTop: `4px solid ${color}`, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px", fontWeight: "500" }}>{label}</p>
        <h3 style={{ margin: "10px 0 0", fontSize: "28px", color: "#1e293b", fontWeight: "700" }}>{value}</h3>
    </div>
);

const chartCard = { background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" };
const chartTitle = { fontSize: "14px", fontWeight: "700", color: "#136442", marginBottom: "15px" };
const chartPlaceholder = { height: "200px", background: "#f1f5f9", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: "12px" };