import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo2.jpg";

// ── REGISTROS PREVIOS EN MEMORIA (simulando base de datos) ────────────────────
// En la Fase 2 esto vendrá del backend Django
let registrosPrevios = [];

export default function Dashboard() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [tabActiva, setTabActiva] = useState("inicio");
    const [imagenCedula, setImagenCedula] = useState(null);
    const [previaCedula, setPreviaCedula] = useState(null);
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);

    const formInicial = {
        nombre_predio: "", codigo_catastral: "", actividad: "Agrícola",
        superficie: "", tipo_suelo: "Franco", clima: "Tropical de Sabana",
        municipio: "Barinas", parroquia: "", sector: "",
        punto_referencia: "", latitud: "", longitud: "",
        productor_nombre: "", productor_cedula: "", productor_telefono: "",
    };

    const [formData, setFormData] = useState(formInicial);
    const [errores, setErrores] = useState({});
    const [tocados, setTocados] = useState({});

    useEffect(() => {
        const data = sessionStorage.getItem("usuario_predios");
        if (!data) navigate("/predios/login");
        else setUsuario(JSON.parse(data));
    }, [navigate]);

    // ── VALIDACIONES ──────────────────────────────────────────────────────────
    const validarCampo = (name, value) => {
        let msg = "";

        switch (name) {
            case "nombre_predio":
                if (!value.trim()) msg = "El nombre del predio es obligatorio.";
                else if (value.trim().length < 3) msg = "Mínimo 3 caracteres.";
                else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-\.]+$/.test(value)) msg = "Solo letras, números, espacios y guiones.";
                break;

            case "codigo_catastral":
                if (!value.trim()) msg = "El código catastral es obligatorio.";
                else if (!/^\d{2}-\d{2}-\d{2}-\d{4,}$/.test(value.trim())) msg = "Formato requerido: 00-00-00-0000";
                else if (registrosPrevios.some(r => r.codigo_catastral === value.trim())) msg = "Este código catastral ya está registrado.";
                break;

            case "superficie":
                if (!value) msg = "La superficie es obligatoria.";
                else if (isNaN(value) || parseFloat(value) <= 0) msg = "Debe ser un número mayor a 0.";
                else if (parseFloat(value) > 99999) msg = "Máximo 99.999 hectáreas.";
                break;

            case "parroquia":
                if (!value.trim()) msg = "La parroquia es obligatoria.";
                else if (value.trim().length < 3) msg = "Mínimo 3 caracteres.";
                else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) msg = "Solo letras y espacios.";
                break;

            case "sector":
                if (!value.trim()) msg = "El sector es obligatorio.";
                else if (value.trim().length < 3) msg = "Mínimo 3 caracteres.";
                else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-]+$/.test(value)) msg = "Solo letras, números y guiones.";
                break;

            case "punto_referencia":
                if (!value.trim()) msg = "El punto de referencia es obligatorio.";
                else if (value.trim().length < 5) msg = "Mínimo 5 caracteres.";
                break;

            case "latitud":
                if (!value.trim()) msg = "La latitud es obligatoria.";
                else if (isNaN(value)) msg = "Debe ser un número válido.";
                else if (parseFloat(value) < -90 || parseFloat(value) > 90) msg = "Rango válido: -90 a 90.";
                break;

            case "longitud":
                if (!value.trim()) msg = "La longitud es obligatoria.";
                else if (isNaN(value)) msg = "Debe ser un número válido.";
                else if (parseFloat(value) < -180 || parseFloat(value) > 180) msg = "Rango válido: -180 a 180.";
                break;

            case "productor_nombre":
                if (!value.trim()) msg = "El nombre del productor es obligatorio.";
                else if (value.trim().length < 5) msg = "Mínimo 5 caracteres.";
                else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) msg = "Solo letras y espacios.";
                break;

            case "productor_cedula":
                if (!value.trim()) msg = "La cédula es obligatoria.";
                else if (!/^\d{6,8}$/.test(value.trim())) msg = "Solo números, entre 6 y 8 dígitos.";
                else if (registrosPrevios.some(r => r.productor_cedula === value.trim())) msg = "Esta cédula ya está registrada.";
                break;

            case "productor_telefono":
                if (!value.trim()) msg = "El teléfono es obligatorio.";
                else if (!/^\d{11}$/.test(value.trim())) msg = "Ingresa 11 dígitos numéricos. Ej: 04141234567";
                break;

            default:
                break;
        }

        return msg;
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTocados(prev => ({ ...prev, [name]: true }));
        setErrores(prev => ({ ...prev, [name]: validarCampo(name, value) }));
    };

    const manejarBlur = (e) => {
        const { name, value } = e.target;
        setTocados(prev => ({ ...prev, [name]: true }));
        setErrores(prev => ({ ...prev, [name]: validarCampo(name, value) }));
    };

    // ── IMAGEN CÉDULA ─────────────────────────────────────────────────────────
    const manejarImagenCedula = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const tiposValidos = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (!tiposValidos.includes(file.type)) {
            setErrores(prev => ({ ...prev, cedula_imagen: "Solo JPG, PNG o PDF." }));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrores(prev => ({ ...prev, cedula_imagen: "El archivo supera los 5MB." }));
            return;
        }
        setErrores(prev => ({ ...prev, cedula_imagen: "" }));
        setImagenCedula(file);
        if (file.type !== "application/pdf") {
            const reader = new FileReader();
            reader.onload = (ev) => setPreviaCedula(ev.target.result);
            reader.readAsDataURL(file);
        } else {
            setPreviaCedula("pdf");
        }
    };

    // ── VALIDACIÓN GLOBAL ─────────────────────────────────────────────────────
    // Busca esta línea y actualízala:
    const camposTodos = [
        "nombre_predio", "codigo_catastral", "superficie", "parroquia",
        "sector", "punto_referencia", "latitud", "longitud",
        "productor_nombre", "productor_cedula", "productor_telefono",
    ];

    const hayErrores = camposTodos.some(c => validarCampo(c, formData[c] ?? "") !== "");
    const faltaCampo = camposTodos.some(c => !formData[c]?.toString().trim());
    const esInvalido = hayErrores || faltaCampo || !imagenCedula;

    // ── LIMPIAR FORMULARIO ────────────────────────────────────────────────────
    const limpiarFormulario = () => {
        setFormData(formInicial);
        setErrores({});
        setTocados({});
        setImagenCedula(null);
        setPreviaCedula(null);
        // Limpiar input file
        const inputFile = document.getElementById("cedula-upload");
        if (inputFile) inputFile.value = "";
    };

    // 🔴 SOLO SE MODIFICÓ LA FUNCIÓN guardarEnDjango (lo demás está intacto)

    const guardarEnDjango = async () => {
        // Marcar todos como tocados para mostrar errores
        const nuevosTocados = {};
        camposTodos.forEach(c => nuevosTocados[c] = true);
        setTocados(nuevosTocados);

        // Recalcular errores actuales
        const nuevosErrores = {};
        camposTodos.forEach(c => {
            nuevosErrores[c] = validarCampo(c, formData[c] ?? "");
        });
        setErrores(nuevosErrores);

        if (esInvalido) return;

        // 1. Creamos un objeto FormData
        const dataenviar = new FormData();

        // 🔥 CORRECCIÓN: limpiar valores antes de enviar
        Object.keys(formData).forEach(key => {
            let valor = formData[key];

            if (typeof valor === "string") {
                valor = valor.trim();
            }

            if (valor !== undefined && valor !== null) {
                dataenviar.append(key, valor);
            }
        });

        // 🔥 CORRECCIÓN: enviar archivo correctamente
        if (imagenCedula) {
            dataenviar.append("cedula_imagen", imagenCedula, imagenCedula.name);
        }

        // 🔍 DEBUG (puedes quitarlo luego)
        for (let pair of dataenviar.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/predios/", {
                method: "POST",
                body: dataenviar,
            });

            if (response.ok) {
                setGuardadoExitoso(true);
                setTimeout(() => setGuardadoExitoso(false), 3000);
                limpiarFormulario();
                setTabActiva("inicio");
            } else {
                const error = await response.json();
                alert("Error del servidor: " + JSON.stringify(error));
            }
        } catch (err) {
            alert("Error de conexión: Asegúrate que Django esté corriendo.");
        }
    };

    const cerrarSesion = () => {
        sessionStorage.removeItem("usuario_predios");
        navigate("/predios/login");
    };

    if (!usuario) return null;

    return (
        <div style={{ display: "flex", height: "100vh", backgroundColor: "#f0f4f2", fontFamily: "'Poppins', sans-serif" }}>

            {/* ── SIDEBAR ── */}
            <aside style={{
                width: "250px", backgroundColor: "#136442",
                display: "flex", flexDirection: "column", padding: "24px 16px",
                boxShadow: "4px 0 10px rgba(0,0,0,0.1)", zIndex: 10,
            }}>
                <div style={{ marginBottom: "20px", padding: "0 10px" }}>
                    <div style={{ background: "#fff", padding: "15px 30px", borderRadius: "8px", display: "flex", alignItems: "center" }}>
                        <img src={logo} alt="Logo" style={{ height: "40px", margin: "0 auto" }} />
                    </div>
                </div>
                <nav style={{ flex: 1 }}>
                    <MenuItem label="Panel de Inicio" active={tabActiva === "inicio"} onClick={() => setTabActiva("inicio")} icon={<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />} />
                    <MenuItem label="Módulo de Predios" active={tabActiva === "predios"} onClick={() => setTabActiva("predios")} icon={<path d="M3 21h18M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2M3 7l9 4 9-4M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />} />
                    <MenuItem label="Mapa Interactivo" active={tabActiva === "mapa"} onClick={() => setTabActiva("mapa")} icon={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>} />
                </nav>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 10px", marginBottom: "15px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#136442", color: "#fff", border: "1px solid #86efac", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                            {usuario.nombre.charAt(0)}
                        </div>
                        <div style={{ overflow: "hidden" }}>
                            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#fff" }}>{usuario.nombre}</p>
                            <p style={{ margin: 0, fontSize: "11px", color: "#86efac" }}>{usuario.rol}</p>
                        </div>
                    </div>
                    <button onClick={cerrarSesion} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "rgba(142,9,9,0.2)", color: "#fca5a5", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                <header style={{ height: "68px", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", padding: "0 32px", justifyContent: "space-between", flexShrink: 0 }}>
                    <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#136442", margin: 0 }}>
                        {tabActiva === "inicio" ? "Panel Administrativo" : tabActiva === "predios" ? "Registro de Predio" : "Mapa Interactivo"}
                    </h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button style={headerButtonStyle}>PDF</button>
                            <button style={headerButtonStyle}>Excel</button>
                        </div>
                        <div style={{ height: "24px", width: "1px", background: "#e2e8f0" }} />
                        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                            Estado Barinas, <span style={{ color: "#136442" }}>Venezuela</span>
                        </div>
                    </div>
                </header>

                {/* Notificación éxito */}
                {guardadoExitoso && (
                    <div style={{
                        position: "fixed", top: "20px", right: "20px", zIndex: 999,
                        background: "#136442", color: "#fff", padding: "14px 24px",
                        borderRadius: "12px", boxShadow: "0 8px 24px rgba(19,100,66,0.3)",
                        display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: 600,
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        ¡Predio registrado exitosamente!
                    </div>
                )}

                <section style={{ flex: 1, padding: "32px", overflowY: "auto" }}>

                    {/* ── TAB INICIO ── */}
                    {tabActiva === "inicio" && (
                        <div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "32px" }}>
                                <CardStat label="Total Predios" value={registrosPrevios.length} color="#136442" subValue="+0 esta semana" />
                                <CardStat label="Superficie Total" value="0.00 Ha" color="#136442" subValue="Registros en Barinas" />
                                <CardStat label="Productores" value={registrosPrevios.length} color="#136442" subValue="Censo 2026" />
                                <CardStat label="Municipios Activos" value="0/12" color="#86efac" subValue="Cobertura de datos" />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "24px" }}>
                                <div style={cardContainerStyle}>
                                    <h3 style={cardTitleStyle}>Flujo de Registros Catastrales</h3>
                                    <div style={{ height: "180px", display: "flex", alignItems: "flex-end", gap: "8px" }}>
                                        {[40, 20, 60, 30, 90, 50, 40, 70, 20, 10, 5, 0].map((h, i) => (
                                            <div key={i} style={{ flex: 1, background: "#f1f5f9", height: "100%", borderRadius: "4px", position: "relative" }}>
                                                <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${h}%`, background: "#136442", borderRadius: "4px", opacity: 0.8 }} />
                                            </div>
                                        ))}
                                    </div>
                                    <div style={labelRowStyle}><span>ENE</span><span>MAY</span><span>DIC</span></div>
                                </div>
                                <div style={cardContainerStyle}>
                                    <h3 style={cardTitleStyle}>Vocación del Suelo</h3>
                                    <div style={{ position: "relative", height: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <svg width="120" height="120" viewBox="0 0 36 36">
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                                        </svg>
                                        <div style={{ position: "absolute", textAlign: "center" }}>
                                            <span style={{ display: "block", fontSize: "20px", fontWeight: 800, color: "#136442" }}>0%</span>
                                            <span style={{ fontSize: "9px", color: "#94a3b8" }}>SIN DATA</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                                        <LegendItem color="#136442" label="Agrícola" />
                                        <LegendItem color="#86efac" label="Pecuario" />
                                    </div>
                                </div>
                                <div style={cardContainerStyle}>
                                    <h3 style={cardTitleStyle}>Tipos de Suelo</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
                                        {["Arenoso", "Arcilloso", "Franco"].map(tipo => (
                                            <div key={tipo}>
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                                                    <span>{tipo}</span><span style={{ fontWeight: 700 }}>0%</span>
                                                </div>
                                                <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                                                    <div style={{ height: "100%", width: "0%", background: "#86efac" }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TAB PREDIOS ── */}
                    {tabActiva === "predios" && (
                        <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                                <div>
                                    <h2 style={{ color: "#136442", margin: 0, fontSize: "22px", fontWeight: 700 }}>Registro de Nuevo Predio</h2>
                                    <p style={{ color: "#64748b", fontSize: "13px", margin: "4px 0 0" }}>Todos los campos son obligatorios para completar el registro.</p>
                                </div>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button onClick={() => { limpiarFormulario(); setTabActiva("inicio"); }}
                                        style={{ background: "#fff", color: "#64748b", border: "1px solid #e2e8f0", padding: "10px 20px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                                        Cancelar
                                    </button>
                                    <button onClick={guardarEnDjango} disabled={esInvalido}
                                        title={esInvalido ? "Completa todos los campos correctamente" : ""}
                                        style={{
                                            background: esInvalido ? "#94a3b8" : "#136442",
                                            color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px",
                                            fontWeight: 600, cursor: esInvalido ? "not-allowed" : "pointer",
                                            fontFamily: "'Poppins', sans-serif", transition: "background 0.2s",
                                        }}>
                                        Guardar Registro
                                    </button>
                                </div>
                            </div>

                            {/* SECCIÓN 1 */}
                            <FormSection title="1. Información Técnica del Predio">
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                                    <InputField name="nombre_predio" value={formData.nombre_predio} onChange={manejarCambio} onBlur={manejarBlur} error={tocados.nombre_predio ? errores.nombre_predio : ""} label="Nombre del Predio" placeholder="Ej: Finca San José" />
                                    <InputField name="codigo_catastral" value={formData.codigo_catastral} onChange={manejarCambio} onBlur={manejarBlur} error={tocados.codigo_catastral ? errores.codigo_catastral : ""} label="Código Catastral" placeholder="00-00-00-0000" />
                                    <SelectField name="actividad" value={formData.actividad} onChange={manejarCambio} label="Tipo de Actividad" options={["Agrícola", "Pecuario", "Mixto"]} />
                                    <InputField name="superficie" value={formData.superficie} onChange={manejarCambio} onBlur={manejarBlur} error={tocados.superficie ? errores.superficie : ""} label="Superficie Total (Ha)" type="number" placeholder="0.00" />
                                    <SelectField name="tipo_suelo" value={formData.tipo_suelo} onChange={manejarCambio} label="Tipo de Suelo" options={["Arenoso", "Limoso", "Arcilloso", "Franco", "Salino"]} />
                                    <SelectField name="clima" value={formData.clima} onChange={manejarCambio} label="Clima" options={["Tropical Lluvioso", "Tropical de Sabana", "Semiárido"]} />
                                </div>
                            </FormSection>

                            {/* SECCIONES 2 y 3 */}
                            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
                                <FormSection title="2. Ubicación Política">
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                        <SelectField name="municipio" value={formData.municipio} onChange={manejarCambio} label="Municipio"
                                            options={["Alberto Arvelo Torrealba", "Andrés Eloy Blanco", "Antonio José de Sucre", "Arismendi", "Barinas", "Bolívar", "Cruz Paredes", "Ezequiel Zamora", "Obispos", "Pedraza", "Rojas", "Sosa"]} />
                                        <InputField name="parroquia" value={formData.parroquia} onChange={manejarCambio} onBlur={manejarBlur} error={tocados.parroquia ? errores.parroquia : ""} label="Parroquia" placeholder="Nombre de parroquia" />
                                        <InputField name="sector" value={formData.sector} onChange={manejarCambio} onBlur={manejarBlur} error={tocados.sector ? errores.sector : ""} label="Sector / Caserío" placeholder="Ej: El Gaván" />
                                        <InputField name="punto_referencia" value={formData.punto_referencia} onChange={manejarCambio} onBlur={manejarBlur} error={tocados.punto_referencia ? errores.punto_referencia : ""} label="Punto de Referencia" placeholder="Cerca de..." />
                                    </div>
                                </FormSection>
                                <FormSection title="3. Coordenadas GPS">
                                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                        <InputField name="latitud" value={formData.latitud} onChange={manejarCambio} onBlur={manejarBlur} error={tocados.latitud ? errores.latitud : ""} label="Latitud" placeholder="Ej: 8.6230" />
                                        <InputField name="longitud" value={formData.longitud} onChange={manejarCambio} onBlur={manejarBlur} error={tocados.longitud ? errores.longitud : ""} label="Longitud" placeholder="Ej: -70.2120" />
                                        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: 1.5 }}>
                                            💡 Usa Google Maps para obtener las coordenadas exactas del predio.
                                        </p>
                                    </div>
                                </FormSection>
                            </div>

                            {/* SECCIÓN 4 */}
                            <FormSection title="4. Datos del Productor Responsable">
                                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "20px", alignItems: "start" }}>
                                    <InputField name="productor_nombre" value={formData.productor_nombre} onChange={manejarCambio} onBlur={manejarBlur} error={tocados.productor_nombre ? errores.productor_nombre : ""} label="Nombre Completo" placeholder="Ej: Juan Pérez García" />
                                    <InputField name="productor_cedula" value={formData.productor_cedula} onChange={manejarCambio} onBlur={manejarBlur} error={tocados.productor_cedula ? errores.productor_cedula : ""} label="Cédula (solo números)" placeholder="12345678" />
                                    <InputField name="productor_telefono" value={formData.productor_telefono} onChange={manejarCambio} onBlur={manejarBlur} error={tocados.productor_telefono ? errores.productor_telefono : ""} label="Teléfono (11 dígitos)" placeholder="04141234567" />

                                    {/* CARGA IMAGEN CÉDULA */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
                                            Foto de Cédula <span style={{ color: "#94a3b8", fontWeight: 400 }}>(JPG, PNG, PDF · máx. 5MB)</span>
                                        </label>
                                        <label htmlFor="cedula-upload" style={{
                                            minHeight: "80px", border: errores.cedula_imagen ? "1.5px dashed #ef4444" : "1.5px dashed #cbd5e1",
                                            borderRadius: "8px", display: "flex", flexDirection: "column",
                                            alignItems: "center", justifyContent: "center",
                                            backgroundColor: imagenCedula ? "#f0faf4" : "#f8fafc",
                                            cursor: "pointer", padding: "8px", gap: "4px", transition: "all 0.2s",
                                        }}>
                                            {previaCedula === "pdf" ? (
                                                <div style={{ textAlign: "center" }}>
                                                    <span style={{ fontSize: "28px" }}>📄</span>
                                                    <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#136442", fontWeight: 600 }}>{imagenCedula?.name}</p>
                                                    <p style={{ margin: 0, fontSize: "10px", color: "#94a3b8" }}>Clic para cambiar</p>
                                                </div>
                                            ) : previaCedula ? (
                                                <div style={{ textAlign: "center", width: "100%" }}>
                                                    <img src={previaCedula} alt="Cédula" style={{ maxWidth: "100%", maxHeight: "70px", borderRadius: "6px", objectFit: "contain" }} />
                                                    <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#94a3b8" }}>Clic para cambiar</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                        <polyline points="17 8 12 3 7 8" />
                                                        <line x1="12" y1="3" x2="12" y2="15" />
                                                    </svg>
                                                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>Subir imagen</span>
                                                </>
                                            )}
                                        </label>
                                        <input id="cedula-upload" type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={manejarImagenCedula} style={{ display: "none" }} />
                                        {errores.cedula_imagen && (
                                            <span style={{ color: "#ef4444", fontSize: "10px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                                </svg>
                                                {errores.cedula_imagen}
                                            </span>
                                        )}
                                        {!imagenCedula && !errores.cedula_imagen && (
                                            <span style={{ color: "#f59e0b", fontSize: "10px", fontWeight: 600 }}>
                                                Requerido para guardar.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </FormSection>
                        </div>
                    )}

                    {/* ── TAB MAPA ── */}
                    {tabActiva === "mapa" && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: "16px" }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                                <line x1="8" y1="2" x2="8" y2="18" />
                                <line x1="16" y1="6" x2="16" y2="22" />
                            </svg>
                            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Mapa interactivo — Fase 3</p>
                            <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>Se integrará Leaflet.js con los predios registrados.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

// ── COMPONENTES ───────────────────────────────────────────────────────────────

const FormSection = ({ title, children }) => (
    <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
        <h3 style={{ color: "#136442", marginTop: 0, marginBottom: "20px", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <div style={{ width: "4px", height: "16px", background: "#86efac", borderRadius: "2px" }} />{title}
        </h3>
        {children}
    </div>
);

const InputField = ({ label, name, value, onChange, onBlur, error, type = "text", placeholder }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>{label}</label>
        <input
            name={name} value={value} onChange={onChange} onBlur={onBlur}
            type={type} placeholder={placeholder}
            style={{
                height: "42px", padding: "0 14px", borderRadius: "8px",
                border: error ? "1.5px solid #ef4444" : "1.5px solid #cbd5e1",
                fontSize: "13px", outline: "none", fontFamily: "'Poppins', sans-serif",
                background: error ? "#fff5f5" : "#fff", transition: "border-color 0.2s, background 0.2s",
            }}
        />
        {error && (
            <span style={{ color: "#ef4444", fontSize: "10px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
            </span>
        )}
    </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>{label}</label>
        <select name={name} value={value} onChange={onChange}
            style={{ height: "42px", padding: "0 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13px", backgroundColor: "#fff", fontFamily: "'Poppins', sans-serif", outline: "none" }}>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const MenuItem = ({ label, active, onClick, icon }) => (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", cursor: "pointer", borderRadius: "10px", marginBottom: "8px", backgroundColor: active ? "rgba(134,239,172,0.15)" : "transparent", color: active ? "#86efac" : "rgba(255,255,255,0.7)", transition: "all 0.2s" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
        <span style={{ fontSize: "14px" }}>{label}</span>
    </div>
);

const CardStat = ({ label, value, color, subValue }) => (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", borderTop: `4px solid ${color}` }}>
        <p style={{ margin: 0, fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>{label}</p>
        <h3 style={{ margin: "8px 0 2px", fontSize: "26px", color: "#0f172a", fontWeight: 800 }}>{value}</h3>
        <p style={{ margin: 0, fontSize: "10px", color: "#94a3b8" }}>{subValue}</p>
    </div>
);

const LegendItem = ({ color, label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: color }} />
        <span style={{ fontSize: "11px", color: "#64748b" }}>{label}</span>
    </div>
);

const cardContainerStyle = { background: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column" };
const cardTitleStyle = { color: "#0f172a", margin: "0 0 20px 0", fontSize: "15px", fontWeight: 700 };
const labelRowStyle = { display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "10px", marginTop: "10px" };
const headerButtonStyle = { padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" };