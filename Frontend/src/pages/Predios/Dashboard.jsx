import React, { useEffect, useState } from "react";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";

// ── ICONOS SVG REALES ──────────────────
const IconInicio = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const IconRegistro = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const IconMapa = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [tabActiva, setTabActiva] = useState("inicio");
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);

    // ── ESTADO INICIAL COMPLETO ─────────────────────────
    const formInicial = {
        // PRODUCTOR
        productor_nombre: "",
        productor_cedula: "",
        productor_telefono: "",
        productor_correo: "",

        // UBICACIÓN
        municipio: "Barinas",
        parroquia: "",
        comunidad: "",
        centro_poblado: "",
        este: "",
        norte: "",

        // PREDIO
        nombre_predio: "",
        direccion: "",
        superficie: "",
        tipo_propiedad: "Privado",

        // TENENCIA
        tenencia: "Propiedad",

        // SERVICIOS
        servicios: [],
        vialidad: "Regular",

        // INFRAESTRUCTURA
        infraestructura: {
            corrales: 0,
            galpones: 0,
            vaqueras: 0,
            cochineras: 0,
            silos: 0,
            caballerizas: 0,
            feedlot: 0,
            lagunas: 0,
            salas_ordeno: 0,
            queseras: 0,
            casas: 0,
            trapiches: 0,
            establos: 0
        },

        // PRODUCCIÓN
        tipo_explotacion: "Extensivo",
        sistemas_registro: []
    };

    const [formData, setFormData] = useState(formInicial);

    useEffect(() => {
        const data = sessionStorage.getItem("usuario_predios");
        if (!data) navigate("/predios/login");
        else setUsuario(JSON.parse(data));
    }, [navigate]);

    // ── MANEJADORES DE EVENTOS (SIN RECORTES) ──────────────────────────────
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const manejarChecklist = (item) => {
        setFormData(prev => {
            const existe = prev.servicios.includes(item);
            return {
                ...prev,
                servicios: existe
                    ? prev.servicios.filter(s => s !== item)
                    : [...prev.servicios, item]
            };
        });
    };

    const manejarInfra = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            infraestructura: { ...prev.infraestructura, [campo]: parseInt(valor) || 0 }
        }));
    };

    const guardarEnDjango = async () => {
        console.log("Datos capturados:", formData);
        setGuardadoExitoso(true);
        setTimeout(() => {
            setGuardadoExitoso(false);
            setTabActiva("inicio");
        }, 2500);
    };

    const cerrarSesion = () => {
        sessionStorage.removeItem("usuario_predios");
        navigate("/predios/login");
    };

    if (!usuario) return null;

    return (
        <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Poppins', sans-serif" }}>

            {/* Importación de Poppins Global */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

            {/* ── SIDEBAR REDISEÑADO ── */}
            <aside style={sidebarContainerStyle}>

                {/* Encabezado: Info del Usuario */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "15px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: "18px",
                    marginBottom: "25px"
                }}>
                    <div style={avatarWrapper}>
                        <img
                            src={
                                usuario.foto ||
                                `https://ui-avatars.com/api/?name=${usuario.nombre}&background=136442&color=ffffff&bold=true`
                            }
                            alt="Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                        <span style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            {usuario.nombre}
                        </span>

                        <span style={{
                            fontSize: "11px",
                            color: "#86efac"
                        }}>
                            {usuario.rol || "Analista"}
                        </span>
                    </div>
                </div>

                {/* Navegación */}
                <nav style={{ flex: 1 }}>
                    <MenuItem
                        label="Inicio"
                        active={tabActiva === "inicio"}
                        onClick={() => setTabActiva("inicio")}
                        icon={<IconInicio />}
                    />

                    <MenuItem
                        label="Registro"
                        active={tabActiva === "predios"}
                        onClick={() => setTabActiva("predios")}
                        icon={<IconRegistro />}
                    />

                </nav>

                {/* Botón cerrar sesión */}
                <button onClick={cerrarSesion} style={logoutButtonStyle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        style={{ marginRight: "8px" }}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Cerrar Sesión
                </button>

            </aside>

            {/* ── CONTENIDO PRINCIPAL ── */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <header style={{
                    ...headerContainerStyle,
                    justifyContent: "space-between", // Empuja el logo a la derecha
                    paddingRight: "40px"             // Espaciado lateral
                }}>
                    <div>
                        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                            {tabActiva === "inicio" ? "Dashboard de Gestión" : tabActiva === "mapa" ? "Georreferenciación" : "Ficha Técnica de Censo"}
                        </h2>
                        <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Estado Barinas • Sector Agropecuario</p>
                    </div>

                    {/* --- LOGO MPPAT / ESCUDO --- */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                            src={escudo}
                            alt="Logo MPPAT"
                            style={logoDerechoStyle}
                        />
                    </div>
                </header>

                <section style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
                    {guardadoExitoso && <div style={alertStyle}>¡Registro sincronizado con éxito!</div>}

                    {tabActiva === "inicio" && (
                        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

                            {/* ── CARDS PRINCIPALES ── */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                gap: "24px",
                                marginBottom: "30px"
                            }}>
                                <CardStat label="Predios Censados" value="0" color="#136442" />
                                <CardStat label="Superficie Total" value="0" color="#136442" />
                                <CardStat label="Municipios Cubiertos" value="0/0" color="#136442" />
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
                                    <div style={chartPlaceholder}>Gráfico de Barras</div>
                                </div>

                                {/* Gráfico 2 - Circular */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Tenencia de la Tierra</h3>
                                    <div style={chartPlaceholder}>Gráfico Circular</div>
                                </div>

                                {/* Gráfico 3 - Línea */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Superficie Registrada</h3>
                                    <div style={chartPlaceholder}>Gráfico de Línea</div>
                                </div>

                                {/* Gráfico 4 - Comparativo */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Infraestructura</h3>
                                    <div style={chartPlaceholder}>Gráfico Comparativo</div>
                                </div>

                            </div>
                        </div>
                    )}

                    {tabActiva === "predios" && (
                        <div style={{ maxWidth: "950px", margin: "0 auto" }}>

                            <FormSection title="I. Datos del Productor">
                                <div style={grid3}>
                                    <InputField label="Nombre Completo" name="productor_nombre" onChange={manejarCambio} />
                                    <InputField label="Cédula / RIF" name="productor_cedula" onChange={manejarCambio} />
                                    <InputField label="Teléfono" name="productor_telefono" onChange={manejarCambio} />
                                    <InputField label="Correo (Opcional)" name="productor_correo" onChange={manejarCambio} />
                                </div>
                            </FormSection>

                            <FormSection title="II. Georreferenciación y Ubicación">
                                <div style={grid3}>
                                    <SelectField label="Municipio" name="municipio" options={["Barinas", "Bolívar", "Obispos", "Pedraza"]} onChange={manejarCambio} />
                                    <InputField label="Parroquia" name="parroquia" onChange={manejarCambio} />
                                    <InputField label="Comunidad / Sector" name="comunidad" onChange={manejarCambio} />
                                    <InputField label="Centro Poblado" name="centro_poblado" onChange={manejarCambio} />
                                    <InputField label="UTM Este" name="este" onChange={manejarCambio} />
                                    <InputField label="UTM Norte" name="norte" onChange={manejarCambio} />
                                </div>
                            </FormSection>

                            <FormSection title="III. Identificación del Predio">
                                <div style={grid3}>
                                    <InputField label="Nombre del Predio" name="nombre_predio" onChange={manejarCambio} />
                                    <InputField label="Dirección" name="direccion" onChange={manejarCambio} />
                                    <InputField label="Superficie (Ha)" type="number" name="superficie" onChange={manejarCambio} />

                                    <SelectField
                                        label="Tipo de Propiedad"
                                        name="tipo_propiedad"
                                        options={["Público", "Privado"]}
                                        onChange={manejarCambio}
                                    />
                                </div>
                            </FormSection>

                            <FormSection title="IV. Tenencia de la Tierra">
                                <div style={gridCheck}>
                                    {[
                                        "Propiedad", "Ocupación", "Comunidad", "Título Supletorio",
                                        "Arrendamiento", "Adjudicación", "Concesión",
                                        "Derecho de Permanencia", "Aparcería", "Otra"
                                    ].map(t => (
                                        <label key={t} style={radioLabel}>
                                            <input
                                                type="radio"
                                                name="tenencia"
                                                value={t}
                                                checked={formData.tenencia === t}
                                                onChange={manejarCambio}
                                            /> {t}
                                        </label>
                                    ))}
                                </div>
                            </FormSection>

                            <FormSection title="V. Servicios Básicos">
                                <div style={gridCheck}>
                                    {["Agua", "Electricidad", "Gas", "Internet", "Teléfono", "Transporte"].map(s => (
                                        <label key={s} style={radioLabel}>
                                            <input
                                                type="checkbox"
                                                checked={formData.servicios.includes(s)}
                                                onChange={() => manejarChecklist(s)}
                                            /> {s}
                                        </label>
                                    ))}
                                </div>

                                <div style={{ marginTop: "20px" }}>
                                    <SelectField
                                        label="Condición de la Vialidad"
                                        name="vialidad"
                                        options={["Excelente", "Bueno", "Regular", "Malo"]}
                                        onChange={manejarCambio}
                                    />
                                </div>
                            </FormSection>

                            <FormSection title="VI. Infraestructura">
                                <div style={grid3}>
                                    {Object.keys(formData.infraestructura).map((key) => (
                                        <InputField
                                            key={key}
                                            label={key.replace("_", " ").toUpperCase()}
                                            type="number"
                                            onChange={(e) => manejarInfra(key, e.target.value)}
                                        />
                                    ))}
                                </div>
                            </FormSection>

                            <FormSection title="VII. Modelo de Producción">

                                <SelectField
                                    label="Tipo de Explotación"
                                    name="tipo_explotacion"
                                    options={["Intensivo", "Semi Intensivo", "Extensivo"]}
                                    onChange={manejarCambio}
                                />

                                <div style={{ marginTop: "20px" }}>
                                    <p style={labelStyle}>Sistemas de Registro</p>

                                    <div style={gridCheck}>
                                        {["Sanitario", "Productivo", "Reproductivo", "Financiero"].map(s => (
                                            <label key={s} style={radioLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.sistemas_registro.includes(s)}
                                                    onChange={() => {
                                                        const existe = formData.sistemas_registro.includes(s);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            sistemas_registro: existe
                                                                ? prev.sistemas_registro.filter(i => i !== s)
                                                                : [...prev.sistemas_registro, s]
                                                        }));
                                                    }}
                                                /> {s}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                            </FormSection>

                            <div style={{ textAlign: "right", paddingBottom: "50px" }}>
                                <button onClick={guardarEnDjango} style={btnPrincipal}>Finalizar Registro</button>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

// ── COMPONENTES REUTILIZABLES MEJORADOS ──────────────────────────────────────────────
const MenuItem = ({ label, active, onClick, icon }) => (
    <div
        onClick={onClick}
        style={{
            padding: "14px 18px",
            borderRadius: "14px",
            cursor: "pointer",
            marginBottom: "6px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "all 0.25s ease",
            backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
            color: active ? "#fff" : "#a7f3d0",
            boxShadow: active ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
            fontWeight: active ? "600" : "400",

            // 🔥 QUITA EFECTO BLANCO AL HACER CLICK
            outline: "none",
            WebkitTapHighlightColor: "transparent",
            userSelect: "none"
        }}
        onMouseDown={(e) => e.preventDefault()} // evita “flash” de focus
    >
        {icon}
        <span style={{ fontSize: "14px" }}>{label}</span>
    </div>
);

const FormSection = ({ title, children }) => (
    <div style={{ background: "#fff", padding: "28px", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "24px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "13px", color: "#136442", marginBottom: "25px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>{title}</h3>
        {children}
    </div>
);

const InputField = ({ label, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>{label}</label>
        <input {...props} style={inputStyle} />
    </div>
);

const SelectField = ({ label, options, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>{label}</label>
        <select {...props} style={inputStyle}>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const CardStat = ({ label, value, color }) => (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "20px", borderTop: `4px solid ${color}`, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px", fontWeight: "500" }}>{label}</p>
        <h3 style={{ margin: "10px 0 0", fontSize: "28px", color: "#1e293b", fontWeight: "700" }}>{value}</h3>
    </div>
);

const chartCard = {
    background: "#fff",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0"
};

const chartTitle = {
    fontSize: "14px",
    fontWeight: "700",
    color: "#136442",
    marginBottom: "15px"
};

const chartPlaceholder = {
    height: "200px",
    background: "#f1f5f9",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
    border: "2px dashed #cbd5e1"
};

// ── ESTILOS SIDEBAR Y GENERAL ──────────────────────────────────────────────────
const sidebarContainerStyle = {
    width: "290px", backgroundColor: "#136442", padding: "25px",
    display: "flex", flexDirection: "column", color: "#fff", boxShadow: "4px 0 10px rgba(0,0,0,0.05)"
};
const brandContainer = { display: "flex", alignItems: "center", gap: "12px", marginBottom: "35px", paddingLeft: "10px" };
const logoSquare = { width: "38px", height: "38px", background: "#fff", color: "#136442", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "14px" };
const brandText = { fontSize: "18px", fontWeight: "700", letterSpacing: "-0.5px" };
const userCardStyle = { display: "flex", alignItems: "center", gap: "12px", padding: "15px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "18px", marginBottom: "30px" };
const avatarWrapper = { width: "45px", height: "45px", borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)" };
const userNameStyle = { fontSize: "14px", fontWeight: "600", color: "#fff" };
const userRoleLabel = { fontSize: "11px", color: "#86efac" };
const sectionLabel = { fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.4)", letterSpacing: "1.5px", marginBottom: "15px", paddingLeft: "10px" };
const logoutButtonStyle = { background: "rgba(255,255,255,0.05)", color: "#fca5a5", border: "none", padding: "14px", borderRadius: "15px", cursor: "pointer", fontWeight: "600", fontSize: "13px", marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center" };
const headerContainerStyle = { height: "85px", background: "#fff", display: "flex", alignItems: "center", padding: "0 40px", borderBottom: "1px solid #f1f5f9" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", backgroundColor: "#f8fafc" };
const labelStyle = { display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "8px" };
const grid3 = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" };
const gridCheck = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "15px" };
const radioLabel = { fontSize: "13px", color: "#334155", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px", background: "#f1f5f9", borderRadius: "8px" };
const btnPrincipal = { background: "#136442", color: "#fff", border: "none", padding: "16px 40px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(19, 100, 66, 0.3)" };
const alertStyle = { background: "#136442", color: "#fff", padding: "15px 25px", borderRadius: "12px", marginBottom: "20px", fontWeight: "500", textAlign: "center" };
const logoDerechoStyle = {
    height: "40px", // Un poco más grande para que destaque
    width: "auto",
    objectFit: "contain",
    opacity: "0.9"
};
