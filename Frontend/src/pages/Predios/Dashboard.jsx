import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Dashboard() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [tabActiva, setTabActiva] = useState("inicio");

    useEffect(() => {
        const data = sessionStorage.getItem("usuario_predios");
        if (!data) {
            navigate("/predios/login");
        } else {
            setUsuario(JSON.parse(data));
        }
    }, [navigate]);

    const cerrarSesion = () => {
        sessionStorage.removeItem("usuario_predios");
        navigate("/predios/login");
    };

    if (!usuario) return null;

    return (
        <div style={{ display: "flex", height: "100vh", backgroundColor: "#f0f4f2", fontFamily: "'Poppins', sans-serif" }}>

            {/* ── SIDEBAR IZQUIERDO ── */}
            <aside style={{
                width: "280px", backgroundColor: "#136442",
                display: "flex", flexDirection: "column", padding: "24px 16px",
                boxShadow: "4px 0 10px rgba(0,0,0,0.1)", zIndex: 10
            }}>
                {/* Logo Section */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px", padding: "0 10px" }}>
                    <div style={{ background: "#fff", padding: "5px", borderRadius: "8px", display: "flex", alignItems: "center" }}>
                        <img src={logo} alt="Logo" style={{ height: "40px" }} />
                    </div>
                    <div>
                        <span style={{ fontWeight: 700, color: "#fff", fontSize: "16px", display: "block", letterSpacing: "0.5px" }}>MPPAT</span>
                        <span style={{ fontSize: "10px", color: "#86efac", textTransform: "uppercase", fontWeight: 600 }}>Sistema de Predios</span>
                    </div>
                </div>

                {/* Menú de Navegación */}
                <nav style={{ flex: 1 }}>
                    <MenuItem
                        label="Panel de Inicio"
                        active={tabActiva === "inicio"}
                        onClick={() => setTabActiva("inicio")}
                        icon={<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />}
                    />
                    <MenuItem
                        label="Módulo de Predios"
                        active={tabActiva === "predios"}
                        onClick={() => setTabActiva("predios")}
                        icon={<path d="M3 21h18M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2M3 7l9 4 9-4M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />}
                    />
                    <MenuItem
                        label="Mapa Interactivo"
                        active={tabActiva === "mapa"}
                        onClick={() => setTabActiva("mapa")}
                        icon={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>}
                    />
                </nav>

                {/* Info Usuario y Salir */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 10px", marginBottom: "15px" }}>
                        <div style={{
                            width: "40px", height: "40px", borderRadius: "10px",
                            background: "#136442", color: "#fff", border: "1px solid #86efac",
                            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700
                        }}>
                            {usuario.nombre.charAt(0)}
                        </div>
                        <div style={{ overflow: "hidden" }}>
                            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#fff" }}>{usuario.nombre}</p>
                            <p style={{ margin: 0, fontSize: "11px", color: "#86efac" }}>{usuario.rol}</p>
                        </div>
                    </div>
                    <button onClick={cerrarSesion} style={{
                        width: "100%", padding: "10px", borderRadius: "8px", border: "none",
                        background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", fontSize: "12px",
                        fontWeight: 600, cursor: "pointer", transition: "all 0.3s"
                    }} onMouseOver={(e) => e.target.style.background = "rgba(239, 68, 68, 0.4)"}
                        onMouseOut={(e) => e.target.style.background = "rgba(239, 68, 68, 0.2)"}>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* ── CONTENIDO PRINCIPAL ── */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                {/* Topbar */}
                <header style={{
                    height: "68px", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0",
                    display: "flex", alignItems: "center", padding: "0 32px", justifyContent: "space-between"
                }}>
                    <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#136442" }}>
                        {tabActiva === "inicio" ? "Panel Administrativo" : "Gestión Territorial Barinas"}
                    </h2>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                        Estado Barinas, <span style={{ color: "#136442" }}>Venezuela</span>
                    </div>
                </header>

                {/* Área de trabajo */}
                <section style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
                    {tabActiva === "inicio" && (
                        <>
                            {/* ── METRICAS PRINCIPALES ── */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "32px" }}>
                                <CardStat label="Total Predios" value="0" color="#136442" />
                                <CardStat label="Superficie Total (Ha)" value="0.00" color="#136442" />
                                <CardStat label="Productores" value="0" color="#136442" />
                                <CardStat label="Municipios Activos" value="0" color="#86efac" />
                            </div>

                            {/* ── SECCIÓN DE GRÁFICOS ── */}
                            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "32px" }}>

                                {/* Gráfico de Tendencia (Grande) */}
                                <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                                    <h3 style={{ color: "#136442", marginTop: 0, fontSize: "16px", marginBottom: "20px" }}>Registros de Predios (Últimos 6 meses)</h3>
                                    <div style={{ height: "250px", display: "flex", alignItems: "flex-end", gap: "15px", padding: "10px", borderBottom: "2px solid #f1f5f9" }}>
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <div key={i} style={{ flex: 1, background: "#f1f5f9", height: "10%", borderRadius: "4px 4px 0 0", position: "relative" }}>
                                                <span style={{ position: "absolute", bottom: "-25px", left: "50%", transform: "translateX(-50%)", fontSize: "10px", color: "#94a3b8" }}>Mes {i}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Distribución por Uso de Suelo */}
                                <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                                    <h3 style={{ color: "#136442", marginTop: 0, fontSize: "16px", marginBottom: "20px" }}>Uso del Suelo</h3>
                                    <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ width: "140px", height: "140px", borderRadius: "50%", border: "15px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>0% Datos</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: "20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748b", marginBottom: "5px" }}>
                                            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#136442" }}></div> Agrícola
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748b" }}>
                                            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#86efac" }}></div> Pecuario
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── TABLA DE ÚLTIMOS MOVIMIENTOS ── */}
                            <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                                    <h3 style={{ color: "#136442", margin: 0, fontSize: "16px" }}>Últimos Predios Registrados</h3>
                                    <span style={{ color: "#64748b", fontSize: "12px" }}>Estado Barinas</span>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid #f1f5f9", textAlign: "left" }}>
                                            {["Código", "Nombre del Predio", "Municipio", "Superficie", "Estatus"].map(h => (
                                                <th key={h} style={{ padding: "12px", fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
                                                No hay datos disponibles para mostrar en este período.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {tabActiva === "predios" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h2 style={{ color: "#136442", margin: 0, fontSize: "24px" }}>Registro de Nuevo Predio</h2>
                                    <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0 0" }}>Ingrese los datos técnicos del predio agrícola/pecuario.</p>
                                </div>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button style={{ background: "#fff", color: "#64748b", border: "1px solid #e2e8f0", padding: "10px 20px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
                                    <button style={{ background: "#136442", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Guardar Registro</button>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                    <FormSection title="1. Datos Generales">
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                            <InputField label="Nombre del Predio" placeholder="Ej: Finca San José" />
                                            <InputField label="Código Catastral" placeholder="00-00-00-..." />
                                            <SelectField label="Tipo de Actividad" options={["Agrícola", "Pecuario", "Mixto"]} />
                                            <InputField label="Superficie Total (Ha)" type="number" placeholder="0.00" />
                                        </div>
                                    </FormSection>

                                    <FormSection title="2. Ubicación Política">
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                            <SelectField label="Municipio" options={["Barinas", "Bolívar", "Cruz Paredes", "Obispos", "Pedraza", "Rojas", "Sosa", "Zamora"]} />
                                            <InputField label="Parroquia" placeholder="Nombre de parroquia" />
                                            <InputField label="Sector / Caserío" placeholder="Nombre del sector" />
                                            <InputField label="Punto de Referencia" placeholder="Cerca de..." />
                                        </div>
                                    </FormSection>

                                    <FormSection title="3. Georreferenciación (UTM)">
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                                            <InputField label="Norte (Y)" placeholder="0000000.00" />
                                            <InputField label="Este (X)" placeholder="000000.00" />
                                            <SelectField label="Huso" options={["18", "19"]} />
                                        </div>
                                    </FormSection>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                    <FormSection title="Productor Responsable">
                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                            <InputField label="Cédula / RIF" placeholder="V-00000000-0" />
                                            <InputField label="Nombre Completo" placeholder="Propietario o Representante" />
                                            <InputField label="Teléfono" placeholder="04xx-0000000" />
                                        </div>
                                    </FormSection>
                                    <FormSection title="Estatus de Tenencia">
                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                            <SelectField label="Condición Jurídica" options={["Propio", "Adjudicado (INTI)", "Arrendado"]} />
                                            <div style={{ padding: "20px", border: "2px dashed #e2e8f0", borderRadius: "12px", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>
                                                Subir Soporte Legal (PDF)
                                            </div>
                                        </div>
                                    </FormSection>
                                </div>
                            </div>
                        </div>
                    )}

                    {tabActiva === "mapa" && (
                        <div style={{ background: "#fff", height: "600px", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                            <h3 style={{ color: "#136442", marginTop: 0 }}>Visor Geográfico de Barinas</h3>
                            <div style={{ background: "#f8fafc", height: "90%", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", flexDirection: "column", gap: "10px" }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                                </svg>
                                Cargando capas cartográficas...
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

// ── SUB-COMPONENTES AUXILIARES ──

const MenuItem = ({ label, active, onClick, icon }) => (
    <div onClick={onClick} style={{
        display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px",
        cursor: "pointer", borderRadius: "10px", marginBottom: "8px", transition: "all 0.2s",
        backgroundColor: active ? "rgba(134, 239, 172, 0.15)" : "transparent",
        color: active ? "#86efac" : "rgba(255,255,255,0.7)",
        fontWeight: active ? 600 : 400,
        borderLeft: active ? "4px solid #86efac" : "4px solid transparent"
    }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icon}
        </svg>
        <span style={{ fontSize: "14px" }}>{label}</span>
    </div>
);

const CardStat = ({ label, value, color }) => (
    <div style={{
        background: "#fff", padding: "24px", borderRadius: "16px",
        border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        borderTop: `4px solid ${color}`
    }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>{label}</p>
        <h3 style={{ margin: "8px 0 0", fontSize: "32px", color: "#0f172a", fontWeight: 800 }}>{value}</h3>
    </div>
);

const FormSection = ({ title, children }) => (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ color: "#136442", marginTop: 0, marginBottom: "20px", fontSize: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>{title}</h3>
        {children}
    </div>
);

const InputField = ({ label, type = "text", placeholder }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>{label}</label>
        <input 
            type={type} 
            placeholder={placeholder}
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none" }}
        />
    </div>
);

const SelectField = ({ label, options }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>{label}</label>
        <select style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", backgroundColor: "#fff", outline: "none" }}>
            <option value="">Seleccione...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);