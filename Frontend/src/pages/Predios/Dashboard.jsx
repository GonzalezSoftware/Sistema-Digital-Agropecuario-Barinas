import React, { useEffect, useState } from "react";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Solución para que los iconos de los marcadores aparezcan correctamente
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


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

const IconHistorial = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [tabActiva, setTabActiva] = useState("inicio");
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);
    const [listaPredios, setListaPredios] = useState([]);

    const PARROQUIAS_POR_MUNICIPIO = {
        "Barinas": ["Barinas", "Alfredo Arvelo Larriva", "Alto Barinas", "Corazón de Jesús", "El Carmen", "Juan Antonio Rodríguez Domínguez", "Manuel Palacio Fajardo", "Ramón Ignacio Méndez", "Rómulo Betancourt", "Santa Lucía", "Torunos", "Domínguez Martínez"],
        "Alberto Arvelo Torrealba": ["Sabaneta", "Rodríguez Domínguez"],
        "Andrés Eloy Blanco": ["El Cantón", "Santa Cruz de Guahaba", "Puerto Vivas"],
        "Antonio José de Sucre": ["Bum Bum", "Ticoporo", "Andrés Bello"],
        "Arismendi": ["Arismendi", "Guadarrama", "La Unión", "San Antonio"],
        "Bolívar": ["Barinitas", "Altamira de Cáceres", "Calderas"],
        "Cruz Paredes": ["Barrancas", "El Socorro", "Masparrito"],
        "Ezequiel Zamora": ["Santa Bárbara", "José Ignacio del Pumar", "Pedro Briceño Méndez", "Ramón Ignacio Méndez"],
        "Obispos": ["Obispos", "Guasimitos", "El Real", "La Luz"],
        "Pedraza": ["Ciudad Bolivia", "José Ignacio del Pumar", "Páez", "Reyes Cueto"],
        "Rojas": ["Libertad", "Dolores", "Palacios Fajardo", "Santa Rosa"],
        "Sosa": ["Ciudad de Nutrias", "El Regalo", "Puerto de Nutrias", "Santa Catalina"]
    };

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

    // EL NUEVO: Para cargar datos cuando entres a la pestaña historial
    useEffect(() => {
        if (tabActiva === "historial") {
            obtenerHistorial();
        }
    }, [tabActiva]);

    // ── AQUÍ VAN LAS FUNCIONES ──

    const obtenerHistorial = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/predios/');
            const data = await response.json();
            setListaPredios(data);
        } catch (error) {
            console.error("Error al obtener el historial:", error);
        }
    };

    const [busqueda, setBusqueda] = useState("");

    // Filtramos la lista en tiempo real según el nombre del predio o del productor
    const prediosFiltrados = listaPredios.filter((p) => {
        const term = busqueda.toLowerCase();
        const nombrePredio = p.nombre_predio?.toLowerCase() || "";
        const nombreProductor = p.productor?.nombre?.toLowerCase() || "";

        return nombrePredio.includes(term) || nombreProductor.includes(term);
    });

    const [predioSeleccionado, setPredioSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    // Función para abrir el detalle
    const manejarVerDetalles = (predio) => {
        setPredioSeleccionado(predio);
        setMostrarModal(true);
    };

    const [editando, setEditando] = useState(false);
    // Estado para feedback visual de carga
    const [cargandoAccion, setCargandoAccion] = useState(false);

    const estiloInput = {
        width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #136442",
        fontSize: "14px", marginTop: "5px", outline: "none"
    };

    const estiloP = { margin: "5px 0", fontSize: "14px", color: "#333" };

    const estiloBoton = {
        padding: "10px 18px", color: "#fff", border: "none", borderRadius: "8px",
        cursor: "pointer", fontWeight: "bold", fontSize: "11px", transition: "opacity 0.2s"
    };

    // Handlers de Actualización Visual (Tiempo Real en el Modal)
    const actualizarProductor = (campo, valor) => {
        setPredioSeleccionado(prev => ({ ...prev, productor: { ...prev.productor, [campo]: valor } }));
    };

    const actualizarPredio = (campo, valor) => {
        setPredioSeleccionado(prev => ({ ...prev, [campo]: valor }));
    };

    const actualizarInfraestructura = (campo, valor) => {
        setPredioSeleccionado(prev => ({ ...prev, infraestructura: { ...prev.infraestructura, [campo]: parseInt(valor) || 0 } }));
    };

    const actualizarProduccion = (campo, valor) => {
        setPredioSeleccionado(prev => ({ ...prev, produccion: { ...prev.produccion, [campo]: valor } }));
    };

    // ── ACCIONES REALES API ──

    const guardarCambiosReal = async () => {
        setCargandoAccion(true);
        try {
            const datosAEnviar = JSON.parse(JSON.stringify(predioSeleccionado));

            // Eliminamos la cédula para que el serializador de Django no intente validarla
            if (datosAEnviar.productor) {
                delete datosAEnviar.productor.cedula_rif;
            }

            const response = await fetch(`http://127.0.0.1:8000/api/predios/${predioSeleccionado.id_predio}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosAEnviar)
            });

            if (response.ok) {
                const data = await response.json();
                alert("¡Censo actualizado correctamente en el sistema!");

                // Actualizamos la lista local
                setListaPredios(prev => prev.map(p => p.id_predio === data.id_predio ? data : p));
                setEditando(false);
            } else {
                const err = await response.json();
                alert("Error del servidor: " + JSON.stringify(err));
            }
        } catch (error) {
            alert("Error crítico: El servidor de Barinas no responde o hay un error en el código Django.");
        } finally {
            setCargandoAccion(false);
        }
    };

    // 2. ELIMINAR DEFINITIVO (DELETE)
    const eliminarDefinitivoReal = async () => {
        if (!window.confirm(`¿ESTÁ COMPLETAMENTE SEGURO? Esta acción eliminará permanentemente el predio "${predioSeleccionado.nombre_predio}" de la base de datos.`)) {
            return;
        }

        setCargandoAccion(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/predios/${predioSeleccionado.id_predio}/`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("Predio eliminado correctamente.");
                // Removemos el predio de la lista principal
                setListaPredios(prevLista => prevLista.filter(p => p.id_predio !== predioSeleccionado.id_predio));
                setMostrarModal(false);
                setPredioSeleccionado(null);
            } else {
                alert("Error al intentar eliminar el registro.");
            }
        } catch (error) {
            console.error("Error Red:", error);
            alert("Error de conexión al intentar eliminar.");
        } finally {
            setCargandoAccion(false);
        }
    };


    // ── MANEJADORES DE EVENTOS (SIN RECORTES) ──────────────────────────────
    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const nuevoEstado = { ...prev, [name]: value };

            // Si cambia el municipio, reseteamos la parroquia
            if (name === "municipio") {
                nuevoEstado.parroquia = "";
            }

            return nuevoEstado;
        });
    };

    // Añade este estado al principio de tu Dashboard
    const [mapId, setMapId] = useState(Date.now());
    const [mapKey, setMapKey] = useState(0);

    const manejarCambioTab = (tab) => {
        if (tab === 'mapa') {
            setMapKey(prev => prev + 1); // Esto fuerza a React a destruir el mapa viejo
        }
        setTabActiva(tab);
    };

    const [mapInstance, setMapInstance] = useState(null);
    const [cargandoMapa, setCargandoMapa] = useState(false);

    let DefaultIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    // Funciones de utilidad para el estado Barinas
    const utmToLatLng = (este, norte) => {
        // Si no hay datos, centramos el mapa en la ciudad de Barinas
        if (!este || !norte) return [8.6226, -70.2075];

        // Conversión aproximada para el Huso 19N
        const lat = 8.6226 + (norte - 953500) / 110000;
        const lng = -70.2075 + (este - 367000) / 110000;
        return [lat, lng];
    };

    const abrirEnGoogleMaps = (este, norte) => {
        const [lat, lng] = utmToLatLng(este, norte);
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, '_blank');
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
        try {
            const response = await fetch('http://127.0.0.1:8000/api/predios/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Si tienes autenticación, añade el token aquí
                },
                body: JSON.stringify({
                    // Datos del Productor
                    productor: {
                        cedula_rif: formData.productor_cedula,
                        nombre: formData.productor_nombre,
                        telefono: formData.productor_telefono,
                        correo: formData.productor_correo
                    },
                    // Datos del Predio
                    nombre_predio: formData.nombre_predio,
                    municipio: formData.municipio,
                    parroquia: formData.parroquia,
                    comunidad: formData.comunidad,
                    superficie: formData.superficie,
                    este: formData.este,
                    norte: formData.norte,
                    tenencia: formData.tenencia,
                    vialidad: formData.vialidad,
                    servicios: formData.servicios,
                    centro_poblado: formData.centro_poblado,
                    direccion: formData.direccion,
                    tipo_propiedad: formData.tipo_propiedad,

                    // Relación con Infraestructura
                    infraestructura: formData.infraestructura,

                    // Relación con Producción
                    produccion: {
                        tipo_explotacion: formData.tipo_explotacion,
                        registro_sanitario: formData.sistemas_registro.includes("Sanitario"),
                        registro_productivo: formData.sistemas_registro.includes("Productivo"),
                        registro_reproductivo: formData.sistemas_registro.includes("Reproductivo"),
                        registro_financiero: formData.sistemas_registro.includes("Financiero")
                    }
                })
            });

            if (response.ok) {
                alert("¡Registro completado con éxito en Barinas!");
                // Aquí puedes limpiar el formulario o redirigir
            } else {
                const errorData = await response.json();
                console.error("Error del servidor:", errorData);
                alert("Error al guardar: " + JSON.stringify(errorData));
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor.");
        }
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
                        onClick={() => manejarCambioTab("inicio")}
                        icon={<IconInicio />}
                    />

                    <MenuItem
                        label="Registro"
                        active={tabActiva === "predios"}
                        onClick={() => manejarCambioTab("predios")}
                        icon={<IconRegistro />}
                    />

                    <MenuItem
                        label="Historial"
                        active={tabActiva === "historial"}
                        onClick={() => manejarCambioTab("historial")}
                        icon={<IconHistorial />}
                    />

                    <MenuItem
                        label="Mapa de Predios"
                        active={tabActiva === "mapa"}
                        onClick={() => manejarCambioTab("mapa")}
                        icon={<IconMapa />}
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
                                    <SelectField
                                        label="Municipio"
                                        name="municipio"
                                        options={Object.keys(PARROQUIAS_POR_MUNICIPIO)}
                                        onChange={manejarCambio}
                                    />

                                    <SelectField
                                        label="Parroquia"
                                        name="parroquia"
                                        // Si no hay municipio seleccionado, mostramos lista vacía
                                        options={formData.municipio ? PARROQUIAS_POR_MUNICIPIO[formData.municipio] : []}
                                        onChange={manejarCambio}
                                        disabled={!formData.municipio} // Deshabilitado hasta que elija municipio
                                    />

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

                    {tabActiva === "historial" && (
                        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

                            {/* ── TÍTULO Y BUSCADOR ── */}
                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                marginBottom: "20px", flexWrap: "wrap", gap: "10px"
                            }}>
                                <h2 style={{ color: "#136442", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                                    Historial de Predios Registrados
                                </h2>

                                <div style={{ position: "relative", width: "100%", maxWidth: "350px" }}>
                                    <input
                                        type="text" placeholder="Buscar por productor o predio..."
                                        value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                                        style={{
                                            width: "100%", padding: "10px 15px", borderRadius: "8px",
                                            border: "1px solid #ccc", fontSize: "14px", outline: "none",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* ── TABLA DE REGISTROS ── */}
                            <div style={{
                                backgroundColor: "#fff", padding: "20px", borderRadius: "12px",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eee", overflowX: "auto"
                            }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "2px solid #136442", color: "#136442" }}>
                                            <th style={{ fontSize: "14px", padding: "12px" }}>ID</th>
                                            <th style={{ fontSize: "14px", padding: "12px" }}>Nombre del Predio</th>
                                            <th style={{ fontSize: "14px", padding: "12px" }}>Productor</th>
                                            <th style={{ fontSize: "14px", padding: "12px" }}>Municipio</th>
                                            <th style={{ fontSize: "14px", padding: "12px" }}>Superficie</th>
                                            <th style={{ fontSize: "14px", padding: "12px" }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prediosFiltrados.length > 0 ? (
                                            prediosFiltrados.map((p) => (
                                                <tr key={p.id_predio} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>#{p.id_predio}</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.nombre_predio}</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.productor?.nombre || "Sin nombre"}</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.municipio}</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.superficie} Ha</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>
                                                        <button onClick={() => manejarVerDetalles(p)} style={{ backgroundColor: "#f0fdf4", color: "#136442", border: "1px solid #136442", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                                                            Ver Detalles
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#999" }}>No se encontraron registros.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* ── MODAL INTEGRAL DE FICHA TÉCNICA ── */}
                            {mostrarModal && predioSeleccionado && (
                                <div style={{
                                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                                    backgroundColor: "rgba(0,0,0,0.7)", display: "flex",
                                    justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "15px"
                                }}>
                                    <div style={{
                                        backgroundColor: "#fff", width: "100%", maxWidth: "950px", maxHeight: "95vh",
                                        borderRadius: "12px", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                                        display: "flex", flexDirection: "column"
                                    }}>
                                        {/* Encabezado Dinámico */}
                                        <div style={{
                                            backgroundColor: editando ? "#0ea5e9" : "#136442",
                                            padding: "18px 25px", color: "#fff", display: "flex",
                                            justifyContent: "space-between", alignItems: "center",
                                            position: "sticky", top: 0, zIndex: 10, transition: "background-color 0.3s"
                                        }}>
                                            <h3 style={{ margin: 0, fontSize: "16px" }}>
                                                {cargandoAccion ? "PROCESANDO..." : editando ? "MODO EDICIÓN ACTIVADO" : `FICHA TÉCNICA: ${predioSeleccionado.nombre_predio.toUpperCase()}`}
                                            </h3>
                                            <button onClick={() => { if (!cargandoAccion) { setMostrarModal(false); setEditando(false); } }} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "22px" }}>✕</button>
                                        </div>

                                        <div style={{ padding: "30px", opacity: cargandoAccion ? 0.5 : 1, pointerEvents: cargandoAccion ? 'none' : 'auto' }}>

                                            {/* I. DATOS DEL PRODUCTOR */}
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px", marginBottom: "35px" }}>
                                                <div style={{ gridColumn: "span 3", borderBottom: "2px solid #136442", paddingBottom: "5px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "14px" }}>I. DATOS DEL PRODUCTOR</strong>
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>NOMBRE COMPLETO</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.productor?.nombre} onChange={(e) => actualizarProductor('nombre', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.productor?.nombre}</p>}
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>CÉDULA / RIF</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.productor?.cedula_rif} onChange={(e) => actualizarProductor('cedula_rif', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.productor?.cedula_rif}</p>}
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>TELÉFONO</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.productor?.telefono} onChange={(e) => actualizarProductor('telefono', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.productor?.telefono || "N/A"}</p>}
                                                </div>
                                                <div style={{ gridColumn: "span 3" }}>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>CORREO ELECTRÓNICO</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.productor?.correo} onChange={(e) => actualizarProductor('correo', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.productor?.correo || "N/A"}</p>}
                                                </div>
                                            </div>

                                            {/* II. GEORREFERENCIACIÓN Y UBICACIÓN */}
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px", marginBottom: "35px" }}>
                                                <div style={{ gridColumn: "span 3", borderBottom: "2px solid #136442", paddingBottom: "5px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "14px" }}>II. GEORREFERENCIACIÓN Y UBICACIÓN</strong>
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>MUNICIPIO</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.municipio} onChange={(e) => actualizarPredio('municipio', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.municipio}</p>}
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>PARROQUIA</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.parroquia} onChange={(e) => actualizarPredio('parroquia', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.parroquia}</p>}
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>COMUNIDAD / SECTOR</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.comunidad} onChange={(e) => actualizarPredio('comunidad', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.comunidad}</p>}
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>CENTRO POBLADO</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.centro_poblado} onChange={(e) => actualizarPredio('centro_poblado', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.centro_poblado}</p>}
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>UTM ESTE</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.este} onChange={(e) => actualizarPredio('este', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.este}</p>}
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>UTM NORTE</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.norte} onChange={(e) => actualizarPredio('norte', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.norte}</p>}
                                                </div>
                                            </div>

                                            {/* III, IV y V. IDENTIFICACIÓN Y TENENCIA */}
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px", marginBottom: "35px", padding: "20px", backgroundColor: "#f8faf9", borderRadius: "10px" }}>
                                                <div style={{ gridColumn: "span 3", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "14px" }}>III. IDENTIFICACIÓN Y IV. TENENCIA</strong>
                                                </div>
                                                <div style={{ gridColumn: "span 2" }}>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>DIRECCIÓN EXACTA</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.direccion} onChange={(e) => actualizarPredio('direccion', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.direccion || "N/A"}</p>}
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>SUPERFICIE (HA)</small>
                                                    {editando ? <input type="number" style={estiloInput} value={predioSeleccionado.superficie} onChange={(e) => actualizarPredio('superficie', e.target.value)} /> : <p style={estiloP}><strong>{predioSeleccionado.superficie} Ha</strong></p>}
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>TIPO DE PROPIEDAD</small>
                                                    {editando ? (
                                                        <select style={estiloInput} value={predioSeleccionado.tipo_propiedad} onChange={(e) => actualizarPredio('tipo_propiedad', e.target.value)}>
                                                            <option value="Público">Público</option>
                                                            <option value="Privado">Privado</option>
                                                        </select>
                                                    ) : <p style={estiloP}>{predioSeleccionado.tipo_propiedad}</p>}
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>TENENCIA DE LA TIERRA</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.tenencia} onChange={(e) => actualizarPredio('tenencia', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.tenencia}</p>}
                                                </div>
                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>CONDICIÓN VIALIDAD</small>
                                                    {editando ? (
                                                        <select style={estiloInput} value={predioSeleccionado.vialidad} onChange={(e) => actualizarPredio('vialidad', e.target.value)}>
                                                            <option value="Excelente">Excelente</option>
                                                            <option value="Bueno">Bueno</option>
                                                            <option value="Regular">Regular</option>
                                                            <option value="Malo">Malo</option>
                                                        </select>
                                                    ) : <p style={estiloP}>{predioSeleccionado.vialidad}</p>}
                                                </div>
                                            </div>

                                            {/* VI. INFRAESTRUCTURA */}
                                            <div style={{ marginBottom: "35px" }}>
                                                <div style={{ borderBottom: "2px solid #136442", paddingBottom: "5px", marginBottom: "15px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "14px" }}>VI. INFRAESTRUCTURA</strong>
                                                </div>
                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
                                                    {[
                                                        { k: 'corrales', l: 'CORRALES' }, { k: 'galpones', l: 'GALPONES' }, { k: 'vaqueras', l: 'VAQUERAS' },
                                                        { k: 'cochineras', l: 'COCHINERAS' }, { k: 'silos', l: 'SILOS' }, { k: 'caballerizas', l: 'CABALLERIZAS' },
                                                        { k: 'feedlot', l: 'FEEDLOT' }, { k: 'lagunas', l: 'LAGUNAS' }, { k: 'salas_ordeno', l: 'SALAS ORDEÑO' },
                                                        { k: 'queseras', l: 'QUESERAS' }, { k: 'casas', l: 'CASAS' }, { k: 'trapiches', l: 'TRAPICHES' }, { k: 'establos', l: 'ESTABLOS' }
                                                    ].map((item) => (
                                                        <div key={item.k} style={{ border: "1px solid #eee", padding: "10px", borderRadius: "8px", textAlign: "center", backgroundColor: predioSeleccionado.infraestructura?.[item.k] > 0 ? "#f0fdf4" : "#fff" }}>
                                                            <small style={{ color: "#777", fontSize: "10px", display: "block" }}>{item.l}</small>
                                                            {editando ? (
                                                                <input type="number" style={{ ...estiloInput, textAlign: "center" }} value={predioSeleccionado.infraestructura?.[item.k]} onChange={(e) => actualizarInfraestructura(item.k, e.target.value)} />
                                                            ) : (
                                                                <span style={{ fontWeight: "bold", fontSize: "16px", color: predioSeleccionado.infraestructura?.[item.k] > 0 ? "#136442" : "#333" }}>{predioSeleccionado.infraestructura?.[item.k] || 0}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* VII. MODELO DE PRODUCCIÓN */}
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "25px" }}>
                                                <div style={{ border: "1px solid #e0e0e0", padding: "15px", borderRadius: "8px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "13px", display: "block", marginBottom: "10px" }}>TIPO DE EXPLOTACIÓN</strong>
                                                    {editando ? (
                                                        <select style={estiloInput} value={predioSeleccionado.produccion?.tipo_explotacion} onChange={(e) => actualizarProduccion('tipo_explotacion', e.target.value)}>
                                                            <option value="Intensivo">Intensivo</option>
                                                            <option value="Semi Intensivo">Semi Intensivo</option>
                                                            <option value="Extensivo">Extensivo</option>
                                                        </select>
                                                    ) : (
                                                        <span style={{ fontSize: "18px", fontWeight: "bold" }}>{predioSeleccionado.produccion?.tipo_explotacion}</span>
                                                    )}
                                                </div>
                                                <div style={{ border: "1px solid #e0e0e0", padding: "15px", borderRadius: "8px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "13px", display: "block", marginBottom: "10px" }}>SISTEMAS DE REGISTRO</strong>
                                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                        {[
                                                            { k: 'registro_sanitario', l: 'SANITARIO' }, { k: 'registro_productivo', l: 'PRODUCTIVO' },
                                                            { k: 'registro_reproductivo', l: 'REPRODUCTIVO' }, { k: 'registro_financiero', l: 'FINANCIERO' }
                                                        ].map((reg) => (
                                                            <div
                                                                key={reg.k}
                                                                onClick={() => editando && actualizarProduccion(reg.k, !predioSeleccionado.produccion?.[reg.k])}
                                                                style={{
                                                                    display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "20px",
                                                                    backgroundColor: predioSeleccionado.produccion?.[reg.k] ? "#136442" : "#f0f0f0",
                                                                    color: predioSeleccionado.produccion?.[reg.k] ? "#fff" : "#999",
                                                                    fontSize: "11px", fontWeight: "bold", cursor: editando ? "pointer" : "default", transition: "all 0.2s"
                                                                }}
                                                            >
                                                                {predioSeleccionado.produccion?.[reg.k] ? "✓" : "○"} {reg.l}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── BOTONERA FINAL FUNCIONAL ── */}
                                        <div style={{
                                            padding: "20px 30px", backgroundColor: "#f4f4f4", display: "flex",
                                            justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #ddd",
                                            position: "sticky", bottom: 0, zIndex: 10
                                        }}>
                                            <button
                                                onClick={eliminarDefinitivoReal}
                                                disabled={cargandoAccion}
                                                style={{ ...estiloBoton, backgroundColor: "#ef4444", opacity: cargandoAccion ? 0.5 : 1 }}
                                            >
                                                ELIMINAR
                                            </button>

                                            <button
                                                onClick={() => editando ? guardarCambiosReal() : setEditando(true)}
                                                disabled={cargandoAccion}
                                                style={{ ...estiloBoton, backgroundColor: editando ? "#0ea5e9" : "#136442", opacity: cargandoAccion ? 0.5 : 1 }}
                                            >
                                                {cargandoAccion ? "PROCESANDO..." : editando ? "CONFIRMAR CAMBIOS" : "EDITAR FICHA"}
                                            </button>

                                            <button
                                                onClick={() => setEditando(false)}
                                                disabled={cargandoAccion || !editando}
                                                style={{ ...estiloBoton, backgroundColor: "#6b7280", opacity: (cargandoAccion || !editando) ? 0.5 : 1 }}
                                            >
                                                SOLO VISUALIZAR
                                            </button>

                                            <button
                                                onClick={() => { setMostrarModal(false); setEditando(false); }}
                                                disabled={cargandoAccion}
                                                style={{ ...estiloBoton, backgroundColor: "#374151", opacity: cargandoAccion ? 0.5 : 1 }}
                                            >
                                                SALIR DE FICHA
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {tabActiva === "mapa" && !cargandoMapa && (
                        <div
                            key={`container-${mapKey}`} // Usamos mapKey para evitar el error de inicialización
                            id="contenedor-mapa-agro"
                            style={{
                                height: "calc(100vh - 150px)",
                                width: "100%",
                                borderRadius: "12px",
                                overflow: "hidden",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                            }}
                        >
                            <MapContainer
                                center={[8.6226, -70.2075]}
                                zoom={9} // Un poco más de zoom para que Barinas se vea bien
                                style={{ height: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; OpenStreetMap contributors'
                                />

                                {/* Aquí es donde irán tus marcadores de predios cuando los cargues */}
                                {listaPredios.map((predio) => (
                                    <Marker
                                        key={predio.id_predio}
                                        position={utmToLatLng(predio.este, predio.norte)}
                                    >
                                        <Popup>
                                            <strong>{predio.nombre_predio}</strong><br />
                                            Productor: {predio.productor?.nombre}
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
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

const thStyle = { padding: "15px", fontWeight: "600" };
const tdStyle = { padding: "12px 15px", fontSize: "14px", color: "#333" };
const btnSmall = {
    backgroundColor: "#136442",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px"
};