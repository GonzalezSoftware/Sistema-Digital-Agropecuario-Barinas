import React, { useEffect, useState } from "react";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";

// ── ICONOS SVG REALES ──────────────────
const IconInicio = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const IconBuscarPredio = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const IconRegistroInv = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const IconProduccionAnimal = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18"></path><path d="M6 8l6-4 6 4"></path><path d="M6 16l6 4 6-4"></path></svg>
);
const IconProduccionVegetal = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"></path><path d="M5 12a7 7 0 0 1 14 0"></path><path d="M12 12c0-3-2-5-5-5"></path><path d="M12 12c0-3 2-5 5-5"></path></svg>
);
const IconReportes = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);

export default function DashboardProduccion() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [tabActiva, setTabActiva] = useState("inicio");
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);


    useEffect(() => {
        const data = sessionStorage.getItem("usuario_produccion");
        if (!data) navigate("/produccion/login");
        else setUsuario(JSON.parse(data));
    }, [navigate]);

    const [predioSeleccionado, setPredioSeleccionado] = useState(null);

    const [predioActivo, setPredioActivo] = useState(null);
    const [listaPredios, setListaPredios] = useState([]);
    const [busquedaCedula, setBusquedaCedula] = useState("");

    useEffect(() => {
        // Simulación de predios desde backend
        const prediosMock = [
            {
                id: 1,
                productor: "Juan Pérez",
                cedula: "12345678",
                predio: "Finca La Esperanza",
                municipio: "Barinas"
            },
            {
                id: 2,
                productor: "María González",
                cedula: "87654321",
                predio: "Hato San José",
                municipio: "Obispos"
            }
        ];

        setListaPredios(prediosMock);
    }, []);

    const filtrarPredios = listaPredios.filter(p =>
        p.cedula.includes(busquedaCedula)
    );

    const [inventarioInicial, setInventarioInicial] = useState({

        especiesSeleccionadas: [],

        vacunos: {
            toro_reproductor: 0,
            toro_ceba: 0,
            vaca: 0,
            novilla: 0,
            novillo: 0,
            maute: 0,
            mauta: 0,
            becerra: 0,
            becerro: 0
        },

        bufalinos: {
            butoro_reproductor: 0,
            butoro_ceba: 0,
            bufala: 0,
            buvilla: 0,
            buvillo: 0,
            bumauta: 0,
            bumaute: 0,
            bucerra: 0,
            bucerro: 0
        },

        equinos: {
            padrillo: 0,
            caballo_trabajo: 0,
            yegua: 0,
            potra: 0,
            potro: 0,
            potrilla: 0,
            potrillo: 0,
            burro: 0,
            burra: 0
        },

        ovinos: {
            carnero: 0,
            oveja: 0,
            borrego: 0,
            borrega: 0,
            cordero: 0,
            cordera: 0
        },

        caprinos: {
            cabrio: 0,
            cabra: 0,
            cabrilloo: 0,
            cabrilla: 0,
            cabrito: 0,
            cabrita: 0
        },

        porcinos: {
            berraco: 0,
            cerda_gestante: 0,
            cerda_lactante: 0,
            lechon: 0,
            lechona: 0
        },

        conejos: {
            macho: 0,
            madre: 0,
            gazapo: 0
        },

        aves: {
            pollos_engorde: 0,
            gallinas_ponedoras: 0,
            gallinas_descarte: 0,
            codornices: 0,
            patos: 0,
            pavos: 0,
            avestruz: 0,
            guinea: 0,
            otros: 0
        },

        apicultura: {
            colmenas: 0
        },

        maquinariaSeleccionada: [],

        maquinaria_ruedas: {
            tractor: 0,
            rotocultor: 0,
            patrol: 0,
            lowboy: 0,
            payloader: 0,
            cosechadora: 0,
            desgranadora: 0,
            basuca: 0,
            remolque: 0
        },

        implementos: {
            abonadora: 0,
            arados: 0,
            aspergadoras: 0,
            rastra_pesada: 0,
            cultivadora: 0,
            desmalezadora: 0,
            desterronadora: 0,
            encaladora: 0,
            niveladora: 0,
            cegadora: 0,
            sembradora: 0,
            subsolador: 0,
            surcadora: 0,
            trompo_fertilizador: 0
        },

        riego: {
            electrobomba: 0,
            molino_viento: 0,
            motobomba: 0,
            motor_diesel: 0
        },

        otros_equipos: {
            cargadora_madera: 0,
            descortezadora: 0,
            motosierra: 0,
            secadora_granos: 0,
            termonebulizadores: 0,
            trilladora: 0,
            acuicultura_aireacion: 0,
            alimentacion_mecanizada: 0
        }

    });

    const [subAnimal, setSubAnimal] = useState("registroAnimal");

    const [produccionAnimal, setProduccionAnimal] = useState({
        registro: {},
        produccion: [],
        sanidad: [],
        reproduccion: []
    });

    const [subVegetal, setSubVegetal] = useState("planificacion");

    const [planificacion, setPlanificacion] = useState({
        cultivo: "",
        superficie: 0,
        fecha_siembra: "",
        produccion_esperada: 0
    });

    const [produccionVegetal, setProduccionVegetal] = useState({
        cultivo: "",
        produccion_real: 0,
        fecha_cosecha: "",
        observaciones: ""
    });


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
        sessionStorage.removeItem("usuario_produccion");
        navigate("/produccion/login");
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
                        label="Seleccionar Predio"
                        active={tabActiva === "seleccionPredio"}
                        onClick={() => setTabActiva("seleccionPredio")}
                        icon={<IconBuscarPredio />}
                    />

                    <MenuItem
                        label="Inventario"
                        active={tabActiva === "inventario"}
                        onClick={() => setTabActiva("inventario")}
                        icon={<IconRegistroInv />}
                    />

                    <MenuItem
                        label="Agrícola Animal"
                        active={tabActiva === "prodAnimal"}
                        onClick={() => setTabActiva("prodAnimal")}
                        icon={<IconProduccionAnimal />}
                    />

                    <MenuItem
                        label="Agrícola Vegetal"
                        active={tabActiva === "prodVegetal"}
                        onClick={() => setTabActiva("prodVegetal")}
                        icon={<IconProduccionVegetal />}
                    />

                    <MenuItem
                        label="Reportes"
                        active={tabActiva === "reportes"}
                        onClick={() => setTabActiva("reportes")}
                        icon={<IconReportes />}
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
                            {
                                tabActiva === "inicio" && "Módulo de Producción"
                            }
                            {
                                tabActiva === "seleccionPredio" && "Selección de Predio"
                            }
                            {
                                tabActiva === "inventario" && "Gestión de Inventario"
                            }
                            {
                                tabActiva === "prodAnimal" && "Producción Animal"
                            }
                            {
                                tabActiva === "prodVegetal" && "Producción Vegetal"
                            }
                            {
                                tabActiva === "reportes" && "Reportes del Sistema"
                            }
                        </h2>
                        <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Estado Barinas • Sector Agropecuario</p>
                    </div>

                    {predioActivo && (
                        <div style={{
                            background: "#e6f4ea",
                            border: "1px solid #bbf7d0",
                            padding: "8px 15px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}>
                            <span style={{ fontWeight: "700", color: "#136442" }}>
                                🟢 Predio Activo:
                            </span>

                            <span style={{ fontSize: "13px", color: "#0f172a" }}>
                                {predioActivo.predio} — {predioActivo.productor}
                            </span>

                        </div>
                    )}

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
                                <CardStat label="Predios en Producción" value="0" color="#136442" />
                                <CardStat label="Registros de Producción" value="0" color="#136442" />
                                <CardStat label="Movimientos de Inventario" value="0" color="#136442" />
                            </div>

                            {/* ── GRÁFICOS ── */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                                gap: "20px"
                            }}>

                                {/* Gráfico 1 - Barras */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Producción General</h3>
                                    <div style={chartPlaceholder}>Gráfico</div>
                                </div>

                                {/* Gráfico 2 - Circular */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Actividad Reciente</h3>
                                    <div style={chartPlaceholder}>Gráfico</div>
                                </div>

                                {/* Gráfico 3 - Línea */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Flujo del Sistema</h3>
                                    <div style={chartPlaceholder}>Gráfico</div>
                                </div>

                                {/* Gráfico 4 - Comparativo */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Estado del Sistema</h3>
                                    <div style={chartPlaceholder}>Gráfico</div>
                                </div>

                            </div>
                        </div>
                    )}



                    {tabActiva === "seleccionPredio" && (
                        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

                            <FormSection title="🔍 Buscar Predio por Productor">

                                <div style={grid3}>
                                    <InputField
                                        label="Cédula del Productor"
                                        placeholder="Ej: 12345678"
                                        value={busquedaCedula}
                                        onChange={(e) => setBusquedaCedula(e.target.value)}
                                    />
                                </div>

                            </FormSection>

                            {/* LISTA DE RESULTADOS */}
                            <FormSection title="📋 Predios Disponibles">

                                {filtrarPredios.length === 0 && (
                                    <p style={{ color: "#64748b" }}>
                                        No se encontraron predios
                                    </p>
                                )}

                                {filtrarPredios.map((p) => (
                                    <div
                                        key={p.id}
                                        style={{
                                            padding: "15px",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "12px",
                                            marginBottom: "12px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            background: predioActivo?.id === p.id ? "#e6f4ea" : "#fff"
                                        }}
                                    >
                                        <div>
                                            <p style={{ margin: 0, fontWeight: "700" }}>
                                                {p.predio}
                                            </p>
                                            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                                                {p.productor} - CI: {p.cedula}
                                            </p>
                                        </div>

                                        <button
                                            style={{
                                                background: "#136442",
                                                color: "#fff",
                                                border: "none",
                                                padding: "10px 18px",
                                                borderRadius: "10px",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => setPredioActivo(p)}
                                        >
                                            Seleccionar
                                        </button>
                                    </div>
                                ))}

                            </FormSection>

                            {/* PREDIO ACTIVO */}
                            {predioActivo && (
                                <FormSection title="✅ Predio Seleccionado">

                                    <div style={{
                                        background: "#f0fdf4",
                                        padding: "15px",
                                        borderRadius: "12px",
                                        border: "1px solid #bbf7d0"
                                    }}>
                                        <p><b>Predio:</b> {predioActivo.predio}</p>
                                        <p><b>Productor:</b> {predioActivo.productor}</p>
                                        <p><b>Cédula:</b> {predioActivo.cedula}</p>
                                        <p><b>Municipio:</b> {predioActivo.municipio}</p>
                                    </div>

                                </FormSection>
                            )}

                        </div>
                    )}
                    {tabActiva === "inventario" && (
                        <div style={{ maxWidth: "950px", margin: "0 auto" }}>

                            {/* 🔴 BLOQUE DE VALIDACIÓN */}
                            {!predioActivo ? (
                                <FormSection title="⚠️ Selección requerida">
                                    <p style={{ color: "#64748b" }}>
                                        Debes seleccionar un predio antes de registrar inventario.
                                    </p>
                                </FormSection>
                            ) : (
                                <>
                                    <FormSection title="Existencia Animal">

                                        <div style={gridCheck}>
                                            {[
                                                "Vacuno",
                                                "Bufalino",
                                                "Equino",
                                                "Ovino",
                                                "Porcino",
                                                "Caprino",
                                                "Conejo",
                                                "Aves de corral",
                                                "Apicultura",
                                                "Otros"
                                            ].map((item) => (

                                                <label key={item} style={radioLabel}>
                                                    <input
                                                        type="checkbox"
                                                        checked={inventarioInicial.especiesSeleccionadas.includes(item)}
                                                        onChange={() => {

                                                            const existe =
                                                                inventarioInicial.especiesSeleccionadas.includes(item);

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                especiesSeleccionadas: existe
                                                                    ? prev.especiesSeleccionadas.filter(i => i !== item)
                                                                    : [...prev.especiesSeleccionadas, item]
                                                            }));
                                                        }}
                                                    />

                                                    {item}
                                                </label>

                                            ))}
                                        </div>

                                    </FormSection>

                                    {inventarioInicial.especiesSeleccionadas.includes("Vacuno") && (

                                        <FormSection title="Vacunos">

                                            <div style={grid3}>
                                                {Object.keys(inventarioInicial.vacunos).map((item) => (

                                                    <InputField
                                                        key={item}
                                                        label={item.replaceAll("_", " ").toUpperCase()}
                                                        type="number"
                                                        onChange={(e) => {

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                vacunos: {
                                                                    ...prev.vacunos,
                                                                    [item]: parseInt(e.target.value) || 0
                                                                }
                                                            }));

                                                        }}
                                                    />

                                                ))}
                                            </div>

                                        </FormSection>
                                    )}

                                    {inventarioInicial.especiesSeleccionadas.includes("Bufalino") && (

                                        <FormSection title="Bufalinos">

                                            <div style={grid3}>
                                                {Object.keys(inventarioInicial.bufalinos).map((item) => (

                                                    <InputField
                                                        key={item}
                                                        label={item.replaceAll("_", " ").toUpperCase()}
                                                        type="number"
                                                        onChange={(e) => {

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                bufalinos: {
                                                                    ...prev.bufalinos,
                                                                    [item]: parseInt(e.target.value) || 0
                                                                }
                                                            }));

                                                        }}
                                                    />

                                                ))}
                                            </div>

                                        </FormSection>
                                    )}

                                    {inventarioInicial.especiesSeleccionadas.includes("Equino") && (

                                        <FormSection title="Equinos">

                                            <div style={grid3}>
                                                {Object.keys(inventarioInicial.equinos).map((item) => (

                                                    <InputField
                                                        key={item}
                                                        label={item.replaceAll("_", " ").toUpperCase()}
                                                        type="number"
                                                        onChange={(e) => {

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                equinos: {
                                                                    ...prev.equinos,
                                                                    [item]: parseInt(e.target.value) || 0
                                                                }
                                                            }));

                                                        }}
                                                    />

                                                ))}
                                            </div>

                                        </FormSection>
                                    )}

                                    {inventarioInicial.especiesSeleccionadas.includes("Ovino") && (

                                        <FormSection title="Ovinos">

                                            <div style={grid3}>
                                                {Object.keys(inventarioInicial.ovinos).map((item) => (

                                                    <InputField
                                                        key={item}
                                                        label={item.replaceAll("_", " ").toUpperCase()}
                                                        type="number"
                                                        onChange={(e) => {

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                ovinos: {
                                                                    ...prev.ovinos,
                                                                    [item]: parseInt(e.target.value) || 0
                                                                }
                                                            }));

                                                        }}
                                                    />

                                                ))}
                                            </div>

                                        </FormSection>
                                    )}

                                    {inventarioInicial.especiesSeleccionadas.includes("Caprino") && (

                                        <FormSection title="Caprinos">

                                            <div style={grid3}>
                                                {Object.keys(inventarioInicial.caprinos).map((item) => (

                                                    <InputField
                                                        key={item}
                                                        label={item.replaceAll("_", " ").toUpperCase()}
                                                        type="number"
                                                        onChange={(e) => {

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                caprinos: {
                                                                    ...prev.caprinos,
                                                                    [item]: parseInt(e.target.value) || 0
                                                                }
                                                            }));

                                                        }}
                                                    />

                                                ))}
                                            </div>

                                        </FormSection>
                                    )}

                                    {inventarioInicial.especiesSeleccionadas.includes("Porcino") && (

                                        <FormSection title="Porcinos">

                                            <div style={grid3}>
                                                {Object.keys(inventarioInicial.porcinos).map((item) => (

                                                    <InputField
                                                        key={item}
                                                        label={item.replaceAll("_", " ").toUpperCase()}
                                                        type="number"
                                                        onChange={(e) => {

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                porcinos: {
                                                                    ...prev.porcinos,
                                                                    [item]: parseInt(e.target.value) || 0
                                                                }
                                                            }));

                                                        }}
                                                    />

                                                ))}
                                            </div>

                                        </FormSection>
                                    )}

                                    {inventarioInicial.especiesSeleccionadas.includes("Conejo") && (

                                        <FormSection title="Conejos">

                                            <div style={grid3}>
                                                {Object.keys(inventarioInicial.conejos).map((item) => (

                                                    <InputField
                                                        key={item}
                                                        label={item.replaceAll("_", " ").toUpperCase()}
                                                        type="number"
                                                        onChange={(e) => {

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                conejos: {
                                                                    ...prev.conejos,
                                                                    [item]: parseInt(e.target.value) || 0
                                                                }
                                                            }));

                                                        }}
                                                    />

                                                ))}
                                            </div>

                                        </FormSection>
                                    )}

                                    {inventarioInicial.especiesSeleccionadas.includes("Aves de corral") && (

                                        <FormSection title="Aves">

                                            <div style={grid3}>
                                                {Object.keys(inventarioInicial.aves).map((item) => (

                                                    <InputField
                                                        key={item}
                                                        label={item.replaceAll("_", " ").toUpperCase()}
                                                        type="number"
                                                        onChange={(e) => {

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                aves: {
                                                                    ...prev.aves,
                                                                    [item]: parseInt(e.target.value) || 0
                                                                }
                                                            }));

                                                        }}
                                                    />

                                                ))}
                                            </div>

                                        </FormSection>
                                    )}

                                    {inventarioInicial.especiesSeleccionadas.includes("Apicultura") && (

                                        <FormSection title="Apicultura">

                                            <div style={grid3}>
                                                {Object.keys(inventarioInicial.apicultura).map((item) => (

                                                    <InputField
                                                        key={item}
                                                        label={item.replaceAll("_", " ").toUpperCase()}
                                                        type="number"
                                                        onChange={(e) => {

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                apicultura: {
                                                                    ...prev.apicultura,
                                                                    [item]: parseInt(e.target.value) || 0
                                                                }
                                                            }));

                                                        }}
                                                    />

                                                ))}
                                            </div>

                                        </FormSection>
                                    )}

                                    <FormSection title="Maquinarias y Equipos">

                                        <div style={gridCheck}>

                                            {[
                                                "Maquinaria Agrícola",
                                                "Implementos Agrícolas",
                                                "Equipos de Riego",
                                                "Otros Equipos"
                                            ].map((item) => (

                                                <label key={item} style={radioLabel}>
                                                    <input
                                                        type="checkbox"
                                                        checked={inventarioInicial.maquinariaSeleccionada.includes(item)}
                                                        onChange={() => {

                                                            const existe =
                                                                inventarioInicial.maquinariaSeleccionada.includes(item);

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                maquinariaSeleccionada: existe
                                                                    ? prev.maquinariaSeleccionada.filter(i => i !== item)
                                                                    : [...prev.maquinariaSeleccionada, item]
                                                            }));

                                                        }}
                                                    />

                                                    {item}
                                                </label>

                                            ))}

                                        </div>

                                    </FormSection>

                                    {inventarioInicial.maquinariaSeleccionada.includes("Maquinaria Agrícola") && (

                                        <FormSection title="Maquinaria Agrícola de Ruedas">

                                            <div style={grid3}>

                                                {Object.keys(inventarioInicial.maquinaria_ruedas).map((item) => (

                                                    <InputField
                                                        key={item}
                                                        label={item.replaceAll("_", " ").toUpperCase()}
                                                        type="number"
                                                        onChange={(e) => {

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                maquinaria_ruedas: {
                                                                    ...prev.maquinaria_ruedas,
                                                                    [item]: parseInt(e.target.value) || 0
                                                                }
                                                            }));

                                                        }}
                                                    />

                                                ))}

                                            </div>

                                        </FormSection>
                                    )}

                                    {inventarioInicial.maquinariaSeleccionada.includes("Implementos Agrícolas") && (

                                        <FormSection title="Implemetos Agrícolas">

                                            <div style={grid3}>

                                                {Object.keys(inventarioInicial.implementos).map((item) => (

                                                    <InputField
                                                        key={item}
                                                        label={item.replaceAll("_", " ").toUpperCase()}
                                                        type="number"
                                                        onChange={(e) => {

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                implementos: {
                                                                    ...prev.implementos,
                                                                    [item]: parseInt(e.target.value) || 0
                                                                }
                                                            }));

                                                        }}
                                                    />

                                                ))}

                                            </div>

                                        </FormSection>
                                    )}

                                    {inventarioInicial.maquinariaSeleccionada.includes("Equipos de Riego") && (

                                        <FormSection title="Equipos de Riego">

                                            <div style={grid3}>

                                                {Object.keys(inventarioInicial.riego).map((item) => (

                                                    <InputField
                                                        key={item}
                                                        label={item.replaceAll("_", " ").toUpperCase()}
                                                        type="number"
                                                        onChange={(e) => {

                                                            setInventarioInicial(prev => ({
                                                                ...prev,
                                                                riego: {
                                                                    ...prev.riego,
                                                                    [item]: parseInt(e.target.value) || 0
                                                                }
                                                            }));

                                                        }}
                                                    />

                                                ))}

                                            </div>

                                        </FormSection>
                                    )}

                                    {/* 💾 BOTÓN GUARDAR */}
                                    <div style={{ textAlign: "right", paddingBottom: "40px" }}>
                                        <button
                                            onClick={() => {
                                                console.log({
                                                    predio: predioActivo,
                                                    inventario
                                                });
                                            }}
                                            style={btnPrincipal}
                                        >
                                            Guardar Inventario
                                        </button>
                                    </div>
                                </>
                            )}

                        </div>
                    )}

                    {tabActiva === "prodAnimal" && (

                        <div style={{ maxWidth: "950px", margin: "0 auto" }}>

                            {!predioActivo ? (
                                <FormSection title="⚠️ Selección requerida">
                                    <p style={{ color: "#64748b" }}>
                                        Debes seleccionar un predio.
                                    </p>
                                </FormSection>
                            ) : (
                                <>
                                    {/* 🔽 AQUÍ VA TODO TU MÓDULO */}

                                    {/* SUBMENÚ */}
                                    <FormSection title="🐄 Producción Animal">
                                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

                                            <button onClick={() => setSubAnimal("registroAnimal")} style={btnPrincipal}>
                                                Registro Animal
                                            </button>

                                            <button onClick={() => setSubAnimal("produccion")} style={btnPrincipal}>
                                                Producción
                                            </button>

                                            <button onClick={() => setSubAnimal("sanidad")} style={btnPrincipal}>
                                                Sanidad
                                            </button>

                                            <button onClick={() => setSubAnimal("reproduccion")} style={btnPrincipal}>
                                                Reproducción
                                            </button>

                                        </div>
                                    </FormSection>

                                    {subAnimal === "registroAnimal" && (
                                        <FormSection title="Registro Animal del Predio">

                                            <div style={grid3}>
                                                <InputField label="Vacunos" type="number" />
                                                <InputField label="Bufalinos" type="number" />
                                                <InputField label="Equinos" type="number" />
                                                <InputField label="Porcinos" type="number" />
                                                <InputField label="Aves" type="number" />
                                                <InputField label="Otros" type="number" />
                                            </div>

                                            <div style={{ textAlign: "right", marginTop: "20px" }}>
                                                <button style={btnPrincipal}>
                                                    Guardar Registro Animal
                                                </button>
                                            </div>

                                        </FormSection>
                                    )}

                                    {subAnimal === "produccion" && (
                                        <FormSection title="Registro de Producción Animal">

                                            <div style={grid3}>
                                                <InputField label="Leche (Lts)" type="number" />
                                                <InputField label="Carne (Kg)" type="number" />
                                                <InputField label="Huevos (Unidades)" type="number" />
                                                <InputField label="Miel (Kg)" type="number" />
                                            </div>

                                            <div style={grid3}>
                                                <InputField label="Fecha" type="date" />
                                                <InputField label="Observaciones" />
                                            </div>

                                            <div style={{ textAlign: "right", marginTop: "20px" }}>
                                                <button style={btnPrincipal}>
                                                    Registrar Producción
                                                </button>
                                            </div>

                                        </FormSection>
                                    )}

                                    {subAnimal === "sanidad" && (
                                        <FormSection title="Control Sanitario">

                                            <div style={grid3}>
                                                <InputField label="Vacunaciones" />
                                                <InputField label="Enfermedades Detectadas" />
                                                <InputField label="Tratamientos Aplicados" />
                                            </div>

                                            <div style={grid3}>
                                                <InputField label="Fecha" type="date" />
                                            </div>

                                            <div style={{ textAlign: "right", marginTop: "20px" }}>
                                                <button style={btnPrincipal}>
                                                    Registrar Sanidad
                                                </button>
                                            </div>

                                        </FormSection>
                                    )}

                                    {subAnimal === "reproduccion" && (
                                        <FormSection title="Control de Reproducción">

                                            <div style={grid3}>
                                                <InputField label="Ciclos de Monta" />
                                                <InputField label="Gestaciones" />
                                                <InputField label="Partos" />
                                                <InputField label="Tasa de Natalidad (%)" type="number" />
                                            </div>

                                            <div style={grid3}>
                                                <InputField label="Fecha" type="date" />
                                            </div>

                                            <div style={{ textAlign: "right", marginTop: "20px" }}>
                                                <button style={btnPrincipal}>
                                                    Registrar Reproducción
                                                </button>
                                            </div>

                                        </FormSection>
                                    )}

                                </>
                            )}

                        </div>
                    )}

                    {tabActiva === "prodVegetal" && (

                        <div style={{ maxWidth: "950px", margin: "0 auto" }}>

                            {!predioActivo ? (
                                <FormSection title="⚠️ Selección requerida">
                                    <p style={{ color: "#64748b" }}>
                                        Debes seleccionar un predio.
                                    </p>
                                </FormSection>
                            ) : (
                                <>
                                    {/* SUBMENÚ */}
                                    <FormSection title="🌱 Producción Vegetal">

                                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                            <button onClick={() => setSubVegetal("planificacion")} style={btnPrincipal}>Planificación</button>
                                            <button onClick={() => setSubVegetal("produccion")} style={btnPrincipal}>Producción</button>
                                            <button onClick={() => setSubVegetal("comparacion")} style={btnPrincipal}>Comparación</button>
                                        </div>

                                    </FormSection>

                                    {subVegetal === "planificacion" && (
                                        <FormSection title="Planificación de Siembra">

                                            <div style={grid3}>
                                                <InputField
                                                    label="Cultivo"
                                                    value={planificacion.cultivo}
                                                    onChange={(e) => setPlanificacion(prev => ({ ...prev, cultivo: e.target.value }))}
                                                />

                                                <InputField
                                                    label="Superficie (Ha)"
                                                    type="number"
                                                    onChange={(e) => setPlanificacion(prev => ({ ...prev, superficie: parseInt(e.target.value) || 0 }))}
                                                />

                                                <InputField
                                                    label="Fecha de Siembra"
                                                    type="date"
                                                    onChange={(e) => setPlanificacion(prev => ({ ...prev, fecha_siembra: e.target.value }))}
                                                />

                                                <InputField
                                                    label="Producción Esperada (Kg)"
                                                    type="number"
                                                    onChange={(e) => setPlanificacion(prev => ({ ...prev, produccion_esperada: parseInt(e.target.value) || 0 }))}
                                                />
                                            </div>

                                            <div style={{ textAlign: "right", marginTop: "20px" }}>
                                                <button style={btnPrincipal}>Guardar Planificación</button>
                                            </div>

                                        </FormSection>
                                    )}

                                    {subVegetal === "produccion" && (
                                        <FormSection title="Registro de Producción (Cosecha)">

                                            <div style={grid3}>
                                                <InputField
                                                    label="Cultivo"
                                                    value={produccionVegetal.cultivo}
                                                    onChange={(e) => setProduccionVegetal(prev => ({ ...prev, cultivo: e.target.value }))}
                                                />

                                                <InputField
                                                    label="Producción Real (Kg)"
                                                    type="number"
                                                    onChange={(e) => setProduccionVegetal(prev => ({ ...prev, produccion_real: parseInt(e.target.value) || 0 }))}
                                                />

                                                <InputField
                                                    label="Fecha de Cosecha"
                                                    type="date"
                                                    onChange={(e) => setProduccionVegetal(prev => ({ ...prev, fecha_cosecha: e.target.value }))}
                                                />

                                                <InputField
                                                    label="Observaciones"
                                                    onChange={(e) => setProduccionVegetal(prev => ({ ...prev, observaciones: e.target.value }))}
                                                />
                                            </div>

                                            <div style={{ textAlign: "right", marginTop: "20px" }}>
                                                <button style={btnPrincipal}>Registrar Cosecha</button>
                                            </div>

                                        </FormSection>
                                    )}

                                    {subVegetal === "comparacion" && (
                                        <FormSection title="Comparación Plan vs Producción">

                                            <div style={{
                                                background: "#f8fafc",
                                                padding: "20px",
                                                borderRadius: "12px",
                                                border: "1px solid #e2e8f0"
                                            }}>

                                                <p><b>Cultivo:</b> {planificacion.cultivo}</p>
                                                <p><b>Producción Esperada:</b> {planificacion.produccion_esperada} Kg</p>
                                                <p><b>Producción Real:</b> {produccionVegetal.produccion_real} Kg</p>

                                                <hr />

                                                <p>
                                                    <b>Diferencia:</b>{" "}
                                                    {produccionVegetal.produccion_real - planificacion.produccion_esperada} Kg
                                                </p>

                                                <p>
                                                    <b>Rendimiento (%):</b>{" "}
                                                    {planificacion.produccion_esperada > 0
                                                        ? ((produccionVegetal.produccion_real / planificacion.produccion_esperada) * 100).toFixed(2)
                                                        : 0
                                                    } %
                                                </p>

                                            </div>

                                        </FormSection>
                                    )}
                                </>
                            )}

                        </div>
                    )}

                    {tabActiva === "reportes" && (

                        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

                            {/* 🔴 VALIDACIÓN */}
                            {!predioActivo ? (
                                <FormSection title="⚠️ Selección requerida">
                                    <p>Debe seleccionar un predio para ver reportes específicos.</p>
                                </FormSection>
                            ) : (

                                <>
                                    {/* ── NIVEL ESPECÍFICO ── */}
                                    <FormSection title="📊 Reporte del Predio Seleccionado">

                                        <div style={grid3}>
                                            <CardStat label="Nombre del Predio" value={predioActivo.predio} color="#136442" />
                                            <CardStat label="Productor" value={predioActivo.productor} color="#136442" />
                                            <CardStat label="Municipio" value={predioActivo.municipio} color="#136442" />
                                        </div>

                                    </FormSection>

                                    {/* ── PRODUCCIÓN ANIMAL ── */}
                                    <FormSection title="🐄 Producción Animal">

                                        <div style={chartCard}>
                                            <h3 style={chartTitle}>Distribución de Especies</h3>
                                            <div style={chartPlaceholder}>Gráfico Animal</div>
                                        </div>

                                    </FormSection>

                                    {/* ── PRODUCCIÓN VEGETAL ── */}
                                    <FormSection title="🌱 Producción Vegetal">

                                        <div style={chartCard}>
                                            <h3 style={chartTitle}>Producción por Rubro</h3>
                                            <div style={chartPlaceholder}>Gráfico Cultivos</div>
                                        </div>

                                    </FormSection>
                                </>
                            )}

                            {/* ── NIVEL GLOBAL ── */}
                            <FormSection title="🌎 Reporte Global del Sistema">

                                <div style={grid3}>
                                    <CardStat label="Total Predios" value="0" color="#136442" />
                                    <CardStat label="Producción Total" value="0" color="#136442" />
                                    <CardStat label="Rendimiento Promedio" value="0%" color="#136442" />
                                </div>

                                <div style={{ marginTop: "20px" }}>
                                    <div style={chartCard}>
                                        <h3 style={chartTitle}>Comparación General</h3>
                                        <div style={chartPlaceholder}>
                                            Comparación entre predios
                                        </div>
                                    </div>
                                </div>

                            </FormSection>

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
