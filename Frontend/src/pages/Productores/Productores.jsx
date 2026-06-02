import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../../assets/gobierno.jpg";
import escudo from "../../assets/logo2.jpg";
import axios from 'axios';

// 1. AÑADIMOS EL COMPONENTE SPINNER
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
        <svg ref={spinnerRef} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
};

// Componente InputField con el diseño solicitado
const InputField = ({ label, error, prefix, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "8px", textTransform: "uppercase" }}>{label}</label>

        <div style={{
            display: "flex",
            alignItems: "center",
            borderRadius: "8px",
            overflow: "hidden",
            transition: "all 0.2s ease",
            border: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
            backgroundColor: error ? "#fef2f2" : "#f8fafc"
        }}>
            {prefix && (
                <div style={{
                    height: "42px",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: error ? "#fee2e2" : "#f1f5f9",
                    borderRight: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                }}>
                    {prefix}
                </div>
            )}
            <input
                {...props}
                style={{
                    padding: "0 14px",
                    fontSize: "14px",
                    color: "#1e293b",
                    border: "none",
                    backgroundColor: "transparent",
                    width: "100%",
                    height: "42px",
                    outline: "none",
                    margin: 0
                }}
            />
        </div>
        {error && (
            <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "5px", fontWeight: "600" }}>{error}</p>
        )}
    </div>
);

export default function Productores() {
    const navigate = useNavigate();
    const [cedula, setCedula] = useState("");
    const [prefijo, setPrefijo] = useState("V-");
    const [errors, setErrors] = useState({});
    const [buscando, setBuscando] = useState(false);
    const [resultado, setResultado] = useState(null);

    const buscarProductorEnBD = async () => {
        const cedulaLimpia = cedula.replace(/\D/g, '');
        const cedulaCompleta = `${prefijo}${cedulaLimpia}`;

        setResultado(null);
        setErrors({});
        setBuscando(true);

        try {
            // Apuntamos directamente al puerto 8000 de Django
            const url = "http://127.0.0.1:8000/api/productores/buscar/" + cedulaCompleta + "/";
            console.log("Consultando a:", url);

            const response = await axios.get(url);
            setResultado(response.data);
        } catch (error) {
            console.log("Error detallado:", error.response);
            if (error.response && error.response.status === 404) {
                setResultado({ existe: false });
            } else {
                console.error("Error de conexión:", error);
            }
        } finally {
            setBuscando(false);
        }
    };

    const NAV_ITEMS = [
        { label: "Productores", href: "/productores", isRoute: true },
        { label: "Registro de Predios", href: "/predios", isRoute: true },
        { label: "Producción Animal y Vegetal", href: "/produccion", isRoute: true },
        { label: "Estadísticas Generales", href: "/estadística-portalinfo", isRoute: true },
        { label: "Contactos", href: "#contactos" },
    ];

    const validarCampoProductor = (value) => {
        const regexCedula = prefijo === "V-" ? /^[0-9]{7,8}$/ : /^[0-9]{5,8}$/;

        if (value === "") {
            setErrors({});
        } else if (!regexCedula.test(value)) {
            setErrors({ productor_cedula: prefijo === "V-" ? "La cédula venezolana debe tener 7 u 8 números" : "La cédula extranjera debe tener entre 5 y 8 números" });
        } else {
            setErrors({});
        }
    };

    const handleCedulaChange = (e) => {
        const valorNumerico = e.target.value.replace(/\D/g, '');
        setCedula(valorNumerico);
        validarCampoProductor(valorNumerico);
    };

    return (
        <div style={{ fontFamily: "'Poppins', sans-serif" }}>

            {/* NAVBAR */}
            <nav style={{ display: "flex", alignItems: "center", padding: "0 48px", height: "68px", backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100, gap: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", cursor: "pointer" }} onClick={() => navigate("/")}>
                    <img src={logo} alt="Logo" style={{ height: 45 }} />
                    <img src={escudo} alt="Escudo" style={{ height: 45 }} />
                </div>
                <span style={{ fontSize: "12px", color: "#888", fontStyle: "italic", lineHeight: 1.4, borderLeft: "2px solid #e0e0e0", paddingLeft: "16px" }}>
                    Estado Barinas<br /><strong style={{ color: "#589e38", fontStyle: "normal" }}>Venezuela</strong>
                </span>
                <div style={{ flex: 1 }} />
                <button onClick={() => navigate("/")} style={{ background: "none", border: "1.5px solid #aaa", color: "#666", padding: "8px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>← Portal</button>
            </nav>

            {/* HERO PRODUCTORES */}
            <div id="productor-info" style={{ position: "relative", height: "520px", overflow: "hidden", display: "flex", alignItems: "center", background: "linear-gradient(120deg, #0a3d24 0%, #136442 55%, #1a7a50 100%)" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%)", zIndex: 1 }} />
                <img src="https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?q=80&w=735&auto=format&fit=crop" alt="Productores" style={{ position: "absolute", right: 0, top: 0, width: "52%", height: "100%", objectFit: "cover", opacity: 0.3, clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
                <div style={{ position: "absolute", right: "48%", top: 0, bottom: 0, width: "1px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)", zIndex: 2 }} />

                <div style={{ position: "relative", zIndex: 3, padding: "0 80px", maxWidth: "640px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "20px", padding: "6px 14px", marginBottom: "20px" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
                        <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>Módulo de Información — MPPAT</span>
                    </div>
                    <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: 700, lineHeight: 1.15, margin: "0 0 18px" }}>Consulta y Gestión<br /><span style={{ color: "#86efac" }}>de Datos del Productor</span></h1>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", lineHeight: 1.8, margin: "0 0 36px" }}>Ingrese su número de cédula para acceder a su ficha técnica, historial de predios y registros actualizados ante el sistema agropecuario del estado Barinas.</p>
                </div>
            </div>

            {/* SECCIÓN DE CONSULTA */}
            <div style={{ padding: "80px 20px", display: "flex", justifyContent: "center", background: "#f8faf9" }}>
                <div style={{ width: "100%", maxWidth: "450px", padding: "40px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "1px solid #eef0ee" }}>
                    <h3 style={{ color: "#1b4332", margin: "0 0 24px", fontSize: "18px", textAlign: "center" }}>Verificar Identidad</h3>

                    <InputField
                        label="Cédula de Identidad"
                        value={cedula}
                        onChange={handleCedulaChange}
                        error={errors.productor_cedula}
                        maxLength={8}
                        placeholder="31067189"
                        prefix={
                            <select
                                value={prefijo}
                                onChange={(e) => {
                                    setPrefijo(e.target.value);
                                    validarCampoProductor(cedula);
                                }}
                                style={{ border: "none", padding: "0 10px", backgroundColor: "transparent", fontWeight: "600", color: "#475569", cursor: "pointer", height: "100%" }}
                            >
                                <option value="V-">V-</option>
                                <option value="E-">E-</option>
                            </select>
                        }
                    />

                    <button
                        onClick={buscarProductorEnBD}
                        disabled={buscando || !cedula}
                        style={{
                            width: "100%", padding: "14px", backgroundColor: "#136442", color: "#fff", border: "none", borderRadius: "8px",
                            fontWeight: 600, fontSize: "14px", cursor: buscando ? "not-allowed" : "pointer",
                            display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"
                        }}
                    >
                        {buscando ? <Spinner color="#fff" /> : "Consultar Datos"}
                    </button>

                    {resultado && (
                        <div style={{ marginTop: "20px", padding: "15px", borderRadius: "8px", backgroundColor: resultado.existe ? "#dcfce7" : "#fee2e2", border: resultado.existe ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
                            {resultado.existe ? (
                                <p style={{ color: "#166534", margin: 0, fontSize: "14px" }}>Productor encontrado: <strong>{resultado.nombre}</strong></p>
                            ) : (
                                <p style={{ color: "#991b1b", margin: 0, fontSize: "14px" }}>No se encontró un productor con esa cédula.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <footer style={{ background: "#fff", color: "#555", borderTop: "1px solid #e8e8e8" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "56px 80px 40px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                            <img src={logo} alt="Logo" style={{ height: 50 }} />
                            <img src={escudo} alt="Escudo" style={{ height: 40 }} />
                        </div>
                        <p style={{ fontSize: "14px", lineHeight: 1.8, color: "#777" }}>Ecosistema digital agropecuario del estado Barinas. Plataforma oficial para el registro y gestión de la actividad productiva del campo barinés.</p>
                    </div>
                    <div>
                        <h4 style={{ color: "#1b4332", fontSize: "14px", fontWeight: 600, margin: "0 0 20px", textTransform: "uppercase" }}>Navegación</h4>
                        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                            {NAV_ITEMS.map(item => <li key={item.label}><a href={item.href} style={{ color: "#777", textDecoration: "none", fontSize: "14px" }}>{item.label}</a></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: "#1b4332", fontSize: "14px", fontWeight: 600, margin: "0 0 20px", textTransform: "uppercase" }}>Contacto</h4>
                        <p style={{ color: "#777", fontSize: "13px" }}>agrosistema@barinas.gob.ve<br />(0273) 300-0000</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}