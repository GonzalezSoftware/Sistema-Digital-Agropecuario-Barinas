import React, { useEffect, useState } from "react";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import FormHierro from "../../components/FormHierro";
import FormCaracterizacion from "../../components/FormCaracterizacion";

// ── ICONOS SVG DEL DASHBOARD PRODUCCIÓN ──────────────────
const IconInicio = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);
const IconBuscarPredio = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);
const IconLicencia = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <circle cx="12" cy="15" r="2"></circle>
        <path d="M10.8 16.8L10 20l2-1 2 1-.8-3.2"></path>
    </svg>
);
const IconCaracterizacion = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 11l3 3L22 4"></path>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
);
const IconReportes = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
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

    const [codigoGenerado, setCodigoGenerado] = useState("");
    const [codigoIngresado, setCodigoIngresado] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [predioSeleccionado, setPredioSeleccionado] = useState(null);

    const [editando, setEditando] = useState(false);
    const [cargandoAccion, setCargandoAccion] = useState(false);

    const [mostrarFicha, setMostrarFicha] = useState(false);
    const [predioFicha, setPredioFicha] = useState(null);


    const [predios, setPredios] = useState([]);
    const [predioActivo, setPredioActivo] = useState(null);
    const [listaPredios, setListaPredios] = useState([]);
    const [busquedaCedula, setBusquedaCedula] = useState("");


    useEffect(() => {
        const obtenerPredios = async () => {
            try {
                setCargando(true);

                const response = await fetch("http://127.0.0.1:8000/api/predios/");
                const data = await response.json();

                console.log(data);

                setListaPredios(data);
            } catch (error) {
                console.error("Error obteniendo predios:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerPredios();
    }, []);

    const filtrarPredios = listaPredios.filter((p) =>
        p.productor?.cedula_rif?.includes(busquedaCedula),
    );

    const [cargando, setCargando] = useState(false);


    const [licenciaHierro, setLicenciaHierro] = useState({
        poseeLicencia: false,
        fechaEmision: "",
        fechaVencimiento: "",
        observaciones: "",
        imagenHierro: null,    // Para el campo imagen_hierro
        certificado: null      // Para el campo certificado_pdf
    });

    const [subCaracterizacion, setSubCaracterizacion] = useState("animal");

    const [rubrosVegetales, setRubrosVegetales] = useState([
        {
            rubro: "",
            hectareas: "",
            estado: "",
            riego: "",
            ciclo_productivo: "",
            tipo_produccion: "",
            produccion_estimada: "",
            destino: ""
        }
    ]);

    const [inventarioInicial, setInventarioInicial] = useState({
        especiesSeleccionadas: [],

        bovinos: {
            toro_reproductor: 0,
            toro_ceba: 0,
            vaca: 0,
            novilla: 0,
            novillo: 0,
            maute: 0,
            mauta: 0,
            becerra: 0,
            becerro: 0,
        },

        capacidadBovina: {
            leche_diaria: 0,
            carne_anual: 0,
            sistemas: [],
        },

        bubalinos: {
            butoro_reproductor: 0,
            butoro_ceba: 0,
            bufala: 0,
            buvilla: 0,
            buvillo: 0,
            bumauta: 0,
            bumaute: 0,
            bucerra: 0,
            bucerro: 0,
        },

        capacidadBubalina: {
            leche_diaria: 0,
            carne_anual: 0,
            partos_anuales: 0,
            reproductores: 0,
            sistemas: [],
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
            burra: 0,
        },

        capacidadEquina: {
            sistemas: [],
            trabajo_agricola: 0,
            transporte: 0,
            reproduccion: 0,
            deporte: 0,
            exhibicion: 0,
            turismo: 0,
            carga: 0,
        },

        ovinos: {
            carnero: 0,
            oveja: 0,
            borrego: 0,
            borrega: 0,
            cordero: 0,
            cordera: 0,
        },

        capacidadOvina: {
            sistemas: [],
            carne_anual: 0,
            leche_diaria: 0,
            lana_anual: 0,
            cria: 0,
            reproduccion: 0,
            doble_proposito: 0,
            genetica: 0,
        },

        porcinos: {
            berraco: 0,
            cerda_gestante: 0,
            cerda_lactante: 0,
            lechon: 0,
            lechona: 0,
        },

        capacidadPorcina: {
            sistemas: [],
            cria: 0,
            engorde: 0,
            reproduccion: 0,
            ciclo_completo: 0,
            genetica: 0,
            carne_anual: 0,
        },

        caprinos: {
            cabrio: 0,
            cabra: 0,
            cabrillo: 0,
            cabrilla: 0,
            cabrito: 0,
            cabrita: 0,
        },

        capacidadCaprino: {
            sistemas: [],
            vientres: 0,
            engorde: 0,
            leche_diaria: 0,
            carne_anual: 0,
        },

        cunicola: {
            macho: 0,
            madre: 0,
            gazapo: 0,
        },

        capacidadCunicola: {
            sistemas: [],
            jaulas_madre: 0,
            reproductoras: 0,
            carne_anual: 0
        },

        avicola: {
            pollos_engorde: 0,
            gallinas_ponedoras: 0,
            gallinas_descarte: 0,
            codornices: 0,
            patos: 0,
            pavos: 0,
            avestruz: 0,
            guinea: 0,
            otros: 0,
        },

        capacidadAvicola: {
            sistemas: [],
            capacidad_alojamiento: 0,
            produccion_huevos: 0,
            capacidad_lote: 0,
        },

        apicola: {
            colmenas: 0,
        },

        capacidadApicola: {
            sistemas: [],
            colmenas_activas: 0,
            miel_anual: 0,
            nucleos_anuales: 0,
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
            remolque: 0,
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
            trompo_fertilizador: 0,
        },

        riego: {
            electrobomba: 0,
            molino_viento: 0,
            motobomba: 0,
            motor_diesel: 0,
        },

        otros_equipos: {
            cargadora_madera: 0,
            descortezadora: 0,
            motosierra: 0,
            secadora_granos: 0,
            termonebulizadores: 0,
            trilladora: 0,
            acuicultura_aireacion: 0,
            alimentacion_mecanizada: 0,
        },
    });


    // ── MANEJADORES DE EVENTOS (SIN RECORTES) ──────────────────────────────
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const manejarChecklist = (item) => {
        setFormData((prev) => {
            const existe = prev.servicios.includes(item);
            return {
                ...prev,
                servicios: existe
                    ? prev.servicios.filter((s) => s !== item)
                    : [...prev.servicios, item],
            };
        });
    };

    const manejarInfra = (campo, valor) => {
        setFormData((prev) => ({
            ...prev,
            infraestructura: {
                ...prev.infraestructura,
                [campo]: parseInt(valor) || 0,
            },
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

const guardarLicencia = async (datosActualizados) => {
    // Si viene del interceptor del formulario, usamos esos datos optimizados; 
    // de lo contrario, cae en el estado general
    const licenciaData = datosActualizados || licenciaHierro;

    if (!licenciaData.poseeLicencia) {
        Swal.fire({ icon: "info", title: "No se requiere registro si no posee licencia." });
        return;
    }

    try {
        const formData = new FormData();

        // Relación con el predio activo
        formData.append("predio", predioActivo.id_predio);

        // Mapeo exacto con las variables de Django (snake_case)
        formData.append("fecha_emision", licenciaData.fechaEmision);

        // --- NUEVA ADICIÓN: Campo booleano 'activa' ---
        // Se envía de forma explícita el valor booleano derivado de la validación
        formData.append("activa", licenciaData.activa ?? true);

        // Campos opcionales (evitamos enviar strings vacíos en fechas o textos)
        if (licenciaData.fechaVencimiento) {
            formData.append("fecha_vencimiento", licenciaData.fechaVencimiento);
        }
        if (licenciaData.observaciones) {
            formData.append("observaciones", licenciaData.observaciones);
        }

        // Manejo de archivos binarios hacia Django
        if (licenciaData.imagenHierro) {
            formData.append("imagen_hierro", licenciaData.imagenHierro);
        }
        if (licenciaData.certificado) {
            // Se envía bajo el nombre exacto del FileField en el modelo
            formData.append("certificado_pdf", licenciaData.certificado);
        }

        await axios.post(
            "http://127.0.0.1:8000/api/licencias-hierro/",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        Swal.fire({
            icon: "success",
            title: "Licencia registrada exitosamente",
            didOpen: () => {
                const popup = Swal.getPopup();
                if (popup) {
                    popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
                }
            }
        });

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Error al guardar",
            text: error.response?.data ? JSON.stringify(error.response.data) : "Consulte la consola",
            didOpen: () => {
                const popup = Swal.getPopup();
                if (popup) {
                    popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
                }
            }
        });
    }
};

    const cerrarSesion = () => {
        sessionStorage.removeItem("usuario_produccion");
        navigate("/produccion/login");
    };

    if (!usuario) return null;

    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                backgroundColor: "#f8fafc",
                fontFamily: "'Poppins', sans-serif",
            }}
        >
            {/* Importación de Poppins Global */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

            {/* ── SIDEBAR REDISEÑADO ── */}
            <aside style={sidebarContainerStyle}>
                {/* Encabezado: Info del Usuario */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "15px",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        borderRadius: "18px",
                        marginBottom: "25px",
                    }}
                >
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

                    <div
                        style={{ display: "flex", flexDirection: "column", minWidth: 0 }}
                    >
                        <span
                            style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "#fff",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {usuario.nombre}
                        </span>

                        <span
                            style={{
                                fontSize: "11px",
                                color: "#86efac",
                            }}
                        >
                            {usuario.rol || "Analista"}
                        </span>
                    </div>
                </div>

                {/* Navegación */}
                <nav
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        paddingRight: "6px",
                        marginBottom: "15px",
                    }}
                >
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
                        label="Licencia de Hierro Ganadero"
                        active={tabActiva === "hierro"}
                        onClick={() => {
                            // 1. Verificamos si el predio activo tiene un productor y si ese productor ya tiene licencias
                            const tieneLicencia = predioActivo?.productor?.licencias?.length > 0;

                            if (tieneLicencia) {
                                Swal.fire({
                                    icon: "warning",
                                    title: "Licencia ya registrada",
                                    text: "Este predio (o su productor asociado) ya posee una Licencia de Hierro registrada en el sistema.",
                                    didOpen: () => {
                                        const popup = Swal.getPopup();
                                        if (popup) {
                                            popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
                                        }
                                    }
                                });
                                return; // Bloquea el cambio de pestaña
                            }

                            // Si no tiene licencia, permitimos el acceso normal
                            setTabActiva("hierro");
                        }}
                        icon={<IconLicencia />}
                    />

                    <MenuItem
                        label="Caracterización"
                        active={tabActiva === "caracterizacion"}
                        onClick={() => {

                            if (
                                predioActivo?.caracterizacion_completada
                            ) {

                                Swal.fire({

                                    icon: "warning",

                                    title: "Caracterización ya realizada",

                                    text:
                                        "Este predio ya posee una caracterización productiva registrada. Debe utilizar la opción de Actualización Productiva.",
                                    didOpen: () => {
                                        const popup = Swal.getPopup();
                                        if (popup) {
                                            popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
                                        }
                                    }
                                });

                                return;
                            }

                            setTabActiva("caracterizacion");
                        }}
                        icon={<IconCaracterizacion />}
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
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ marginRight: "8px" }}
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Cerrar Sesión
                </button>
            </aside>

            {/* ── CONTENIDO PRINCIPAL ── */}
            <main
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <header
                    style={{
                        ...headerContainerStyle,
                        justifyContent: "space-between", // Empuja el logo a la derecha
                        paddingRight: "40px", // Espaciado lateral
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontSize: "20px",
                                fontWeight: 700,
                                color: "#0f172a",
                                margin: 0,
                            }}
                        >
                            {tabActiva === "inicio"
                                ? "Dashboard Producción"
                                : tabActiva === "seleccionPredio"
                                    ? "Selección de Predio"
                                    : tabActiva === "hierro"
                                        ? "Licencia de Hierro Ganadero"
                                        : tabActiva === "caracterizacion"
                                            ? "Caracterización Productiva"
                                            : "Reportes y Estadísticas"}
                        </h2>
                        <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                            Estado Barinas • Sector Agropecuario
                        </p>
                    </div>

                    {predioActivo && (
                        <div
                            style={{
                                background: "#e6f4ea",
                                border: "1px solid #bbf7d0",
                                padding: "8px 15px",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: "700",
                                    color: "#136442",
                                }}
                            >
                                🟢 Predio Activo:
                            </span>

                            <span
                                style={{
                                    fontSize: "13px",
                                    color: "#0f172a",
                                }}
                            >
                                {predioActivo.nombre_predio} — {predioActivo.productor?.nombre}
                            </span>
                        </div>
                    )}

                    {/* --- LOGO MPPAT / ESCUDO --- */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img src={escudo} alt="Logo MPPAT" style={logoDerechoStyle} />
                    </div>
                </header>

                <section style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
                    {guardadoExitoso && (
                        <div style={alertStyle}>¡Registro sincronizado con éxito!</div>
                    )}



                    {tabActiva === "inicio" && (
                        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                            {/* ── CARDS PRINCIPALES ── */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                    gap: "24px",
                                    marginBottom: "30px",
                                }}
                            >
                                <CardStat
                                    label="Predios en ISAIAS"
                                    value="0"
                                    color="#136442"
                                />
                                <CardStat
                                    label="Registros de Producción"
                                    value="0"
                                    color="#136442"
                                />
                                <CardStat
                                    label="Movimientos de Produccion"
                                    value="0"
                                    color="#136442"
                                />
                            </div>

                            {/* ── GRÁFICOS ── */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                                    gap: "20px",
                                }}
                            >
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

                                {cargando ? (
                                    /* ESTADO 1: CARGANDO */
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "40px 0",
                                        flexDirection: "column",
                                        gap: "10px"
                                    }}>
                                        <Spinner color="#136442" />
                                        <p style={{ color: "#136442", fontWeight: "600", fontSize: "14px", margin: 0 }}>
                                            Buscando información...
                                        </p>
                                    </div>
                                ) : filtrarPredios.length === 0 ? (
                                    /* ESTADO 2: NO HAY RESULTADOS */
                                    <p style={{ color: "#64748b" }}>No se encontraron predios</p>
                                ) : (
                                    /* ESTADO 3: MOSTRAR INFORMACIÓN */
                                    filtrarPredios.map((p) => (
                                        <div
                                            key={p.id_predio}
                                            style={{
                                                padding: "15px",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: "12px",
                                                marginBottom: "12px",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                background:
                                                    predioActivo?.id_predio === p.id_predio
                                                        ? "#e6f4ea"
                                                        : "#fff",
                                            }}
                                        >
                                            <div>
                                                <p style={{ margin: 0, fontWeight: "700" }}>
                                                    {p.nombre_predio}
                                                </p>

                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "12px",
                                                        color: "#64748b",
                                                    }}
                                                >
                                                    {p.productor?.nombre} - CI: {p.productor?.cedula_rif}
                                                </p>
                                            </div>

                                            <div style={{ display: "flex", gap: "10px" }}>

                                                {/* BOTÓN SELECCIONAR */}
                                                <button
                                                    style={{
                                                        background: "#136442",
                                                        color: "#fff",
                                                        border: "none",
                                                        padding: "10px 18px",
                                                        borderRadius: "10px",
                                                        cursor: "pointer",
                                                        fontWeight: "600"
                                                    }}
                                                    onClick={() => {
                                                        setPredioActivo(p);
                                                    }}
                                                >
                                                    Seleccionar
                                                </button>

                                                {/* BOTÓN VER FICHA */}
                                                <button
                                                    style={{
                                                        background: "#0ea5e9",
                                                        color: "#fff",
                                                        border: "none",
                                                        padding: "10px 18px",
                                                        borderRadius: "10px",
                                                        cursor: "pointer",
                                                        fontWeight: "600"
                                                    }}
                                                    onClick={() => {
                                                        console.log("PREDIO:", p);
                                                        setPredioSeleccionado(p);
                                                        setMostrarModal(true);
                                                    }}
                                                >
                                                    Ver Ficha
                                                </button>

                                            </div>
                                        </div>
                                    ))
                                )}
                            </FormSection>

                            {/* ── MODAL INTEGRAL DE FICHA TÉCNICA ── */}
                            {mostrarModal && predioSeleccionado && (
                                <div
                                    style={{
                                        position: "fixed",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0,0,0,0.7)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        zIndex: 1000,
                                        padding: "15px",
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: "#fff",
                                            width: "100%",
                                            maxWidth: "1000px",
                                            maxHeight: "95vh",
                                            borderRadius: "12px",
                                            overflowY: "auto",
                                            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                                            display: "flex",
                                            flexDirection: "column",
                                            fontFamily: "sans-serif"
                                        }}
                                    >
                                        {/* HEADER */}
                                        <div
                                            style={{
                                                backgroundColor: editando ? "#0ea5e9" : "#136442",
                                                padding: "18px 25px",
                                                color: "#fff",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                position: "sticky",
                                                top: 0,
                                                zIndex: 10,
                                            }}
                                        >
                                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                                                {editando
                                                    ? "MODO EDICIÓN ACTIVADO"
                                                    : `FICHA TÉCNICA INTEGRAL: ${predioSeleccionado.nombre_predio?.toUpperCase()}`}
                                            </h3>

                                            <button
                                                onClick={() => {
                                                    setMostrarModal(false);
                                                    setEditando(false);
                                                }}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "#fff",
                                                    cursor: "pointer",
                                                    fontSize: "22px",
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* CONTENIDO DEL MODAL */}
                                        <div style={{ padding: "30px", overflowY: "auto" }}>

                                            {/* 🧵 SECCIÓN I: DATOS DEL PRODUCTOR */}
                                            <div style={estiloContenedorSeccion}>
                                                <div style={estiloTituloSeccion}>I. DATOS DEL PRODUCTOR</div>
                                                <div style={estiloGridTresColumnas}>
                                                    <div>
                                                        <small style={estiloLabel}>NOMBRE COMPLETO</small>
                                                        <p style={estiloP}>{predioSeleccionado.productor?.nombre || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <small style={estiloLabel}>CÉDULA / RIF</small>
                                                        <p style={estiloP}>{predioSeleccionado.productor?.cedula_rif || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <small style={estiloLabel}>TELÉFONO</small>
                                                        <p style={estiloP}>{predioSeleccionado.productor?.telefono || "N/A"}</p>
                                                    </div>
                                                    <div style={{ gridColumn: "span 3" }}>
                                                        <small style={estiloLabel}>CORREO ELECTRÓNICO</small>
                                                        <p style={estiloP}>{predioSeleccionado.productor?.correo || "N/A"}</p>
                                                    </div>
                                                </div>

                                            </div>

                                            {/* 🧵 SECCIÓN I: DATOS DEL PRODUCTOR */}
                                            <div style={estiloContenedorSeccion}>
                                                <div style={estiloTituloSeccion}>LICENCIA DE HIERRO GANADERO ASOCIADA</div>
                                                <div style={estiloGridTresColumnas}>
                                                    {predioSeleccionado.productor?.licencias && predioSeleccionado.productor.licencias.length > 0 ? (
                                                        predioSeleccionado.productor.licencias.map((lic, index) => (
                                                            <div key={index} style={estiloGridTresColumnas}>
                                                                <div><small style={estiloLabel}>EMISIÓN</small><p style={estiloP}>{lic.fecha_emision}</p></div>
                                                                <div><small style={estiloLabel}>VENCIMIENTO</small><p style={estiloP}>{lic.fecha_vencimiento}</p></div>
                                                                <div><small style={estiloLabel}>OBSERVACIONES</small><p style={estiloP}>{lic.observaciones || "Ninguna"}</p></div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>⚠️ No posee Licencia de Hierro registrada para este productor en el sistema.</p>
                                                    )}

                                                </div>

                                            </div>

                                            {/* 🧵 SECCIÓN II: GEORREFERENCIACIÓN Y UBICACIÓN */}
                                            <div style={estiloContenedorSeccion}>
                                                <div style={estiloTituloSeccion}>II. GEORREFERENCIACIÓN Y UBICACIÓN</div>
                                                <div style={estiloGridTresColumnas}>
                                                    <div>
                                                        <small style={estiloLabel}>MUNICIPIO</small>
                                                        <p style={estiloP}>{predioSeleccionado.municipio || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <small style={estiloLabel}>PARROQUIA</small>
                                                        <p style={estiloP}>{predioSeleccionado.parroquia || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <small style={estiloLabel}>COMUNIDAD</small>
                                                        <p style={estiloP}>{predioSeleccionado.comunidad || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <small style={estiloLabel}>CENTRO POBLADO</small>
                                                        <p style={estiloP}>{predioSeleccionado.centro_poblado || "N/A"}</p>
                                                    </div>
                                                    <div style={{ gridColumn: "span 2" }}>
                                                        <small style={estiloLabel}>COORDENADAS GEOGRÁFICAS (LAT, LNG)</small>
                                                        <p style={estiloP}>{predioSeleccionado.coordenadas || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 🧵 SECCIÓN III: IDENTIFICACIÓN Y TENENCIA */}
                                            <div style={{ ...estiloContenedorSeccion, backgroundColor: "#f8faf9" }}>
                                                <div style={estiloTituloSeccion}>III. IDENTIFICACIÓN Y TENENCIA</div>
                                                <div style={estiloGridTresColumnas}>
                                                    <div style={{ gridColumn: "span 2" }}>
                                                        <small style={estiloLabel}>DIRECCIÓN EXACTA</small>
                                                        <p style={estiloP}>{predioSeleccionado.direccion || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <small style={estiloLabel}>SUPERFICIE TOTAL</small>
                                                        <p style={estiloP}>{predioSeleccionado.superficie || 0} Ha</p>
                                                    </div>
                                                    <div>
                                                        <small style={estiloLabel}>TIPO PROPIEDAD</small>
                                                        <p style={estiloP}>{predioSeleccionado.tipo_propiedad || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <small style={estiloLabel}>ESTADO DE TENENCIA</small>
                                                        <p style={estiloP}>{predioSeleccionado.tenencia || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <small style={estiloLabel}>ESTADO DE VIALIDAD INTERNA/ACCESO</small>
                                                        <p style={estiloP}>{predioSeleccionado.vialidad || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 🧵 SECCIÓN IV: GENERALIDADES DE PRODUCCIÓN E INFRAESTRUCTURA */}
                                            <div style={estiloContenedorSeccion}>
                                                <div style={estiloTituloSeccion}>IV. DATOS OPERATIVOS Y SISTEMAS DE EXPLOTACIÓN</div>
                                                <div style={estiloGridTresColumnas}>
                                                    <div>
                                                        <small style={estiloLabel}>SISTEMA DE EXPLOTACIÓN</small>
                                                        <p style={estiloP}>{predioSeleccionado.produccion?.tipo_explotacion || "No caracterizado"}</p>
                                                    </div>
                                                    <div>
                                                        <small style={estiloLabel}>REGISTROS SANITARIOS</small>
                                                        <p style={estiloP}>{predioSeleccionado.produccion?.registro_sanitario ? "🟢 Habilitado / Posee" : "🔴 No posee"}</p>
                                                    </div>
                                                    <div>
                                                        <small style={estiloLabel}>REGISTROS PRODUCTIVOS / REPRODUCTIVOS</small>
                                                        <p style={estiloP}>
                                                            {predioSeleccionado.produccion?.registro_productivo ? " Productivos (SÍ) " : " Productivos (NO) "} <br />
                                                            {predioSeleccionado.produccion?.registro_reproductivo ? " Reproductivos (SÍ)" : " Reproductivos (NO)"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <h4 style={estiloSubtituloInterno}> Inventario de Infraestructura Disponible</h4>
                                                {predioSeleccionado.infraestructura ? (
                                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px" }}>
                                                        {Object.entries(predioSeleccionado.infraestructura).map(([key, val]) => {
                                                            if (key === "id") return null;
                                                            return (
                                                                <div key={key} style={{ fontSize: "13px", borderBottom: "1px solid #e5e7eb", paddingBottom: "4px" }}>
                                                                    <span style={{ textTransform: "capitalize", color: "#4b5563" }}>{key.replace("_", " ")}:</span> <strong>{val}</strong>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p style={{ fontSize: "13px", color: "#666" }}>No hay registros de infraestructura.</p>
                                                )}
                                            </div>

                                            {/* 🧵 SECCIÓN V: RUBROS VEGETALES */}
                                            <div style={estiloContenedorSeccion}>
                                                <div style={estiloTituloSeccion}>V. INTENCIONALIDAD DE SIEMBRA (RUBROS VEGETALES)</div>
                                                {predioSeleccionado.rubros_vegetales && predioSeleccionado.rubros_vegetales.length > 0 ? (
                                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginTop: "10px" }}>
                                                        <thead>
                                                            <tr style={{ backgroundColor: "#136442", color: "#fff" }}>
                                                                <th style={estiloTh}>Rubro</th>
                                                                <th style={estiloTh}>Superficie (Ha)</th>
                                                                <th style={estiloTh}>Estado</th>
                                                                <th style={estiloTh}>Riego</th>
                                                                <th style={estiloTh}>Ciclo</th>
                                                                <th style={estiloTh}>Producción Estimada</th>
                                                                <th style={estiloTh}>Destino</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {predioSeleccionado.rubros_vegetales.map((rubro, i) => (
                                                                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                                                                    <td style={estiloTd}><strong>{rubro.rubro}</strong></td>
                                                                    <td style={estiloTd}>{rubro.hectareas} Ha</td>
                                                                    <td style={estiloTd}>{rubro.estado}</td>
                                                                    <td style={estiloTd}>{rubro.riego}</td>
                                                                    <td style={estiloTd}>{rubro.ciclo_productivo}</td>
                                                                    <td style={estiloTd}>{rubro.produccion_estimada} Kg</td>
                                                                    <td style={estiloTd}>{rubro.destino}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p style={{ fontSize: "13px", color: "#666" }}>Sin rubros vegetales declarados.</p>
                                                )}
                                            </div>

                                            {/* 🧵 SECCIÓN VI: EXISTENCIA ANIMAL (DINÁMICA POR ESPECIE) */}
                                            <div style={estiloContenedorSeccion}>
                                                <div style={estiloTituloSeccion}>VI. INVENTARIO DE EXISTENCIA ANIMAL (REBAÑOS)</div>
                                                <div style={{ marginBottom: "15px" }}>
                                                    <span style={estiloLabel}>ESPECIES IDENTIFICADAS EN EL PREDIO: </span>
                                                    {predioSeleccionado.existencia_animal?.especiesSeleccionadas?.map((sp, idx) => (
                                                        <span key={idx} style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "3px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", marginRight: "6px" }}>
                                                            {sp}
                                                        </span>
                                                    )) || "Ninguna"}
                                                </div>

                                                {/* Mapear dinámicamente el Ganado Vacuno si existe cantidades */}
                                                {predioSeleccionado.existencia_animal?.vacunos && (
                                                    <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "15px", marginBottom: "15px" }}>
                                                        <h5 style={{ margin: "0 0 10px 0", color: "#111827", fontSize: "14px" }}>🐄 Desglose de Ganado Vacuno (Bovino)</h5>
                                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                                                            {Object.entries(predioSeleccionado.existencia_animal.vacunos).map(([cat, cant]) => (
                                                                <div key={cat} style={{ backgroundColor: "#f3f4f6", padding: "8px", borderRadius: "4px", textAlign: "center" }}>
                                                                    <small style={{ textTransform: "uppercase", fontSize: "10px", color: "#6b7280", display: "block" }}>{cat}</small>
                                                                    <strong style={{ fontSize: "16px", color: "#1f2937" }}>{cant}</strong>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div style={{ marginTop: "10px", fontSize: "12px", color: "#374151", backgroundColor: "#eff6ff", padding: "8px", borderRadius: "4px" }}>
                                                            <strong>Capacidad Productiva:</strong> Sistemas: {predioSeleccionado.existencia_animal.capacidadVacuna?.sistemas?.join(", ") || "No definido"} |
                                                            🥛 Leche Diaria: {predioSeleccionado.existencia_animal.capacidadVacuna?.leche_diaria || 0} Lts | 🥩 Carne Anual Est.: {predioSeleccionado.existencia_animal.capacidadVacuna?.carne_anual || 0} Kg
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Alerta si tiene otras especies con registros en cero para no saturar */}
                                                <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>💡 Especies secundarias (Bufalinos, Porcinos, Ovinos, Aves, Apicultura) sin existencias declaradas permanecen ocultas en la vista resumida.</p>
                                            </div>

                                            {/* 🧵 SECCIÓN VII: MAQUINARIA Y EQUIPOS DE RIEGO */}
                                            <div style={estiloContenedorSeccion}>
                                                <div style={estiloTituloSeccion}>VII. MECANIZACIÓN Y EQUIPOS TECNOLÓGICOS</div>

                                                {predioSeleccionado.maquinaria?.maquinaria_ruedas && (
                                                    <div style={{ marginBottom: "15px" }}>
                                                        <h5 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#374151" }}>🚜 Maquinaria Agrícola sobre Ruedas</h5>
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                                            {Object.entries(predioSeleccionado.maquinaria.maquinaria_ruedas).map(([maq, num]) => {
                                                                if (num === 0 || maq === "id") return null;
                                                                return (
                                                                    <span key={maq} style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: "6px", fontSize: "12px" }}>
                                                                        <span style={{ textTransform: "capitalize" }}>{maq}:</span> <strong>{num} Unid.</strong>
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {predioSeleccionado.maquinaria?.riego && (
                                                    <div>
                                                        <h5 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#374151" }}>💧 Infraestructura y Equipamientos de Riego</h5>
                                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                                                            {Object.entries(predioSeleccionado.maquinaria.riego).map(([bom, cant]) => {
                                                                if (cant === 0 || bom === "id") return null;
                                                                return (
                                                                    <div key={bom} style={{ border: "1px solid #bfdbfe", backgroundColor: "#eff6ff", padding: "6px", borderRadius: "4px", fontSize: "12px" }}>
                                                                        <span style={{ textTransform: "capitalize", color: "#1e40af" }}>{bom}:</span> <strong>{cant}</strong>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                        </div>

                                        {/* BOTONES DEL MODAL */}
                                        <div
                                            style={{
                                                padding: "20px 30px",
                                                backgroundColor: "#f4f4f4",
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: "10px",
                                                borderTop: "1px solid #ddd",
                                            }}
                                        >
                                            <button
                                                onClick={() => {
                                                    setMostrarModal(false);
                                                    setEditando(false);
                                                }}
                                                style={{
                                                    ...estiloBoton,
                                                    backgroundColor: "#374151",
                                                }}
                                            >
                                                CERRAR
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PREDIO ACTIVO */}
                            {predioActivo && (
                                <FormSection title="📄 Ficha del Predio Seleccionado">
                                    <div
                                        style={{
                                            background: "#f8fafc",
                                            padding: "25px",
                                            borderRadius: "16px",
                                            border: "1px solid #dbeafe",
                                        }}
                                    >
                                        <div style={grid3}>
                                            <div>
                                                <p style={labelStyle}>Nombre del Predio</p>
                                                <p>{predioActivo.nombre_predio}</p>
                                            </div>

                                            <div>
                                                <p style={labelStyle}>Productor</p>
                                                <p>{predioActivo.productor?.nombre}</p>
                                            </div>

                                            <div>
                                                <p style={labelStyle}>Cédula / RIF</p>
                                                <p>{predioActivo.productor?.cedula_rif}</p>
                                            </div>

                                            <div>
                                                <p style={labelStyle}>Municipio</p>
                                                <p>{predioActivo.municipio}</p>
                                            </div>

                                            <div>
                                                <p style={labelStyle}>Parroquia</p>
                                                <p>{predioActivo.parroquia || "No registrado"}</p>
                                            </div>

                                            <div>
                                                <p style={labelStyle}>Comunidad</p>
                                                <p>{predioActivo.comunidad || "No registrado"}</p>
                                            </div>

                                            <div>
                                                <p style={labelStyle}>Centro Poblado</p>
                                                <p>{predioActivo.centro_poblado || "No registrado"}</p>
                                            </div>

                                            <div>
                                                <p style={labelStyle}>Superficie</p>
                                                <p>{predioActivo.superficie} Ha</p>
                                            </div>

                                            <div>
                                                <p style={labelStyle}>Tenencia</p>
                                                <p>{predioActivo.tenencia}</p>
                                            </div>

                                            <div>
                                                <p style={labelStyle}>Tipo Propiedad</p>
                                                <p>{predioActivo.tipo_propiedad || "No registrado"}</p>
                                            </div>

                                            <div>
                                                <p style={labelStyle}>Vialidad</p>
                                                <p>{predioActivo.vialidad || "No registrado"}</p>
                                            </div>

                                            <div>
                                                <p style={labelStyle}>Fecha Registro</p>

                                                <p>
                                                    {predioActivo.fecha_registro
                                                        ? new Date(
                                                            predioActivo.fecha_registro,
                                                        ).toLocaleDateString()
                                                        : "Sin fecha"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </FormSection>
                            )}
                        </div>
                    )}

                    {tabActiva === "hierro" && (
                        <FormHierro
                            predioActivo={predioActivo}
                            licenciaHierro={licenciaHierro}
                            setLicenciaHierro={setLicenciaHierro}
                            guardarLicencia={guardarLicencia}
                            FormSection={FormSection}
                            InputField={InputField}
                            styles={{ labelStyle, inputStyle, grid3, btnPrincipal }}
                        />
                    )}

                    {tabActiva === "caracterizacion" && (
                        <FormCaracterizacion
                            predioActivo={predioActivo}
                            rubrosVegetales={rubrosVegetales}
                            setRubrosVegetales={setRubrosVegetales}
                            inventarioInicial={inventarioInicial}
                            setInventarioInicial={setInventarioInicial}
                            setTabActiva={setTabActiva}
                            subCaracterizacion={subCaracterizacion}
                            setSubCaracterizacion={setSubCaracterizacion}
                        />
                    )}

                    {tabActiva === "reportes" && (
                        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                            {/* 🔴 VALIDACIÓN */}
                            {!predioActivo ? (
                                <FormSection title="⚠️ Selección requerida">
                                    <p>
                                        Debe seleccionar un predio para ver reportes específicos.
                                    </p>
                                </FormSection>
                            ) : (
                                <>
                                    {/* ── NIVEL ESPECÍFICO ── */}
                                    <FormSection title="📊 Reporte del Predio Seleccionado">
                                        <div style={grid3}>
                                            <CardStat
                                                label="Nombre del Predio"
                                                value={predioActivo.predio}
                                                color="#136442"
                                            />
                                            <CardStat
                                                label="Productor"
                                                value={predioActivo.productor}
                                                color="#136442"
                                            />
                                            <CardStat
                                                label="Municipio"
                                                value={predioActivo.municipio}
                                                color="#136442"
                                            />
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
                                    <CardStat
                                        label="Producción Total"
                                        value="0"
                                        color="#136442"
                                    />
                                    <CardStat
                                        label="Rendimiento Promedio"
                                        value="0%"
                                        color="#136442"
                                    />
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
            userSelect: "none",
        }}
        onMouseDown={(e) => e.preventDefault()} // evita “flash” de focus
    >
        {icon}
        <span style={{ fontSize: "14px" }}>{label}</span>
    </div>
);

export const FormSection = ({ title, children }) => (
    <div
        style={{
            background: "#fff",
            padding: "28px",
            borderRadius: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            marginBottom: "24px",
            border: "1px solid #e2e8f0",
        }}
    >
        <h3
            style={{
                fontSize: "13px",
                color: "#136442",
                marginBottom: "25px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
            }}
        >
            {title}
        </h3>
        {children}
    </div>
);

export const InputField = ({ label, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>{label}</label>
        <input {...props} style={inputStyle} />
    </div>
);

export const SelectField = ({ label, options, error, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>{label}</label>
        <select
            {...props}
            style={{
                ...inputStyle,
                border: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0"
            }}
        >
            <option value="">Seleccione una opción...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        {error && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "5px", fontWeight: "600" }}>{error}</p>}
    </div>
);

const CardStat = ({ label, value, color }) => (
    <div
        style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "20px",
            borderTop: `4px solid ${color}`,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
        }}
    >
        <p
            style={{
                margin: 0,
                color: "#64748b",
                fontSize: "13px",
                fontWeight: "500",
            }}
        >
            {label}
        </p>
        <h3
            style={{
                margin: "10px 0 0",
                fontSize: "28px",
                color: "#1e293b",
                fontWeight: "700",
            }}
        >
            {value}
        </h3>
    </div>
);

const chartCard = {
    background: "#fff",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
};

const chartTitle = {
    fontSize: "14px",
    fontWeight: "700",
    color: "#136442",
    marginBottom: "15px",
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
    border: "2px dashed #cbd5e1",
};

// ── ESTILOS SIDEBAR Y GENERAL ──────────────────────────────────────────────────
const sidebarContainerStyle = {
    width: "290px",
    height: "100vh",
    backgroundColor: "#136442",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    color: "#fff",
    boxShadow: "4px 0 10px rgba(0,0,0,0.05)",
    overflow: "hidden",
};
const brandContainer = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "35px",
    paddingLeft: "10px",
};
const logoSquare = {
    width: "38px",
    height: "38px",
    background: "#fff",
    color: "#136442",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "14px",
};
const brandText = {
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
};
const userCardStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: "18px",
    marginBottom: "30px",
};
const avatarWrapper = {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    overflow: "hidden",
    border: "2px solid rgba(255,255,255,0.2)",
};
const userNameStyle = { fontSize: "14px", fontWeight: "600", color: "#fff" };
const userRoleLabel = { fontSize: "11px", color: "#86efac" };
const sectionLabel = {
    fontSize: "10px",
    fontWeight: "700",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "1.5px",
    marginBottom: "15px",
    paddingLeft: "10px",
};
const logoutButtonStyle = {
    background: "rgba(255,255,255,0.05)",
    color: "#fca5a5",
    border: "none",
    padding: "14px",
    borderRadius: "15px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};
const headerContainerStyle = {
    height: "85px",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    padding: "0 40px",
    borderBottom: "1px solid #f1f5f9",
};
export const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#f8fafc",
};
export const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "8px",
};
export const grid3 = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
};
export const gridCheck = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "15px",
};
export const radioLabel = {
    fontSize: "13px",
    color: "#334155",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "10px",
    background: "#f1f5f9",
    borderRadius: "8px",
};
export const btnPrincipal = {
    background: "#136442",
    color: "#fff",
    border: "none",
    padding: "16px 40px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(19, 100, 66, 0.3)",
};
const alertStyle = {
    background: "#136442",
    color: "#fff",
    padding: "15px 25px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontWeight: "500",
    textAlign: "center",
};
const logoDerechoStyle = {
    height: "40px", // Un poco más grande para que destaque
    width: "auto",
    objectFit: "contain",
    opacity: "0.9",
};


const estiloInput = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    marginTop: "5px",
    fontSize: "14px"
};

const estiloP = {
    margin: "6px 0 0 0",
    fontWeight: "500",
    color: "#111827"
};

const estiloBoton = {
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer"
};

const Spinner = ({ color = "#136442" }) => {
    // Creamos una referencia para el elemento
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
            width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
};









const estiloContenedorSeccion = {
    marginBottom: "30px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#fff"
};

const estiloTituloSeccion = {
    color: "#136442",
    fontSize: "14px",
    fontWeight: "bold",
    borderBottom: "2px solid #136442",
    paddingBottom: "6px",
    marginBottom: "15px",
    textTransform: "uppercase"
};

const estiloSubtituloInterno = {
    margin: "15px 0 10px 0",
    fontSize: "13px",
    color: "#1f2937",
    fontWeight: "600"
};

const estiloGridTresColumnas = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px"
};

const estiloLabel = {
    color: "#4b5563",
    fontSize: "11px",
    fontWeight: "600",
    display: "block",
    marginBottom: "4px"
};


const estiloTh = {
    padding: "10px",
    textAlign: "left",
    borderBottom: "2px solid #115e59"
};

const estiloTd = {
    padding: "10px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151"
};

