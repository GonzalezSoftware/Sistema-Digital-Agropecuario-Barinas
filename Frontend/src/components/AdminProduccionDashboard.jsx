import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

export default function AdminProduccionDashboard({ productionState, cargando: cargandoProp, statsProduccion: statsProp }) {
    // Soportar ambas formas de pasar las props (directas o a través de productionState)
    const cargando = cargandoProp ?? productionState?.cargando;
    const statsProduccion = statsProp ?? productionState?.statsProduccion;

    const Spinner = () => <div style={{ color: "#136442", fontWeight: "600" }}>Cargando...</div>;

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "30px" }}>
                <CardStat label="Predios Caracterizados" value={cargando ? <Spinner /> : statsProduccion?.cards?.predios_caracterizados || 0} color="#136442" />
                <CardStat label="Cantidad de semovientes" value={cargando ? <Spinner /> : statsProduccion?.cards?.total_semovientes || 0} color="#136442" />
                <CardStat label="Hectareas sembradas" value={cargando ? <Spinner /> : statsProduccion?.cards?.total_hectareas || 0} color="#136442" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                <div style={chartCard}>
                    <h3 style={chartTitle}>Cantidad por Especie</h3>
                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                        {!statsProduccion?.graficos?.produccion_general ? (
                            <div style={chartPlaceholder}>No hay datos para mostrar</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statsProduccion.graficos.produccion_general}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="cantidad" fill="#136442" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div style={chartCard}>
                    <h3 style={chartTitle}>Destino de Producción Vegetal</h3>
                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                        {!statsProduccion?.graficos?.actividad_reciente ? (
                            <div style={chartPlaceholder}>Sin datos de actividad</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statsProduccion.graficos.actividad_reciente} dataKey="value" innerRadius={60} outerRadius={80}>
                                        {statsProduccion.graficos.actividad_reciente.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
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
const chartPlaceholder = { height: "200px", background: "#f1f5f9", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" };