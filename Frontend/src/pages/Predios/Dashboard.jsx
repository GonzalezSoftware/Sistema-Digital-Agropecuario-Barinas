import React, { useEffect, useState } from "react";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";
import MapaBarinas from "../../components/MapaBarinas";


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

import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Corregir iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapaInteractivo = ({ predios }) => {
    // Límites de Barinas para que el mapa no se pierda
    const boundsBarinas = [
        [7.0, -71.8], // Sur-Oeste
        [9.5, -67.5]  // Norte-Este
    ];

    return (
        <MapContainer
            center={[8.6226, -70.2075]}
            zoom={8}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            maxBounds={boundsBarinas}
        >
            {/* Capa de mapa elegante y profesional (Light Mode) */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            />

            {predios.map((p, idx) => {
                // Validación de coordenadas (ajusta según tu formato de DB)
                const coords = p.coordenadas ? p.coordenadas.split(',').map(Number) : null;

                if (coords && coords.length === 2) {
                    return (
                        <Marker key={idx} position={[coords[0], coords[1]]}>
                            <Popup>
                                <div style={{ textAlign: 'center' }}>
                                    <strong style={{ color: '#2d572c' }}>{p.nombre_predio}</strong><br />
                                    <span>Municipio: {p.municipio}</span><br />
                                    <small>Coord: {p.coordenadas}</small>
                                </div>
                            </Popup>
                        </Marker>
                    );
                }
                return null;
            })}

            <ZoomControl position="bottomright" />
        </MapContainer>
    );
};

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

    const MUNICIPIOS = [
        "Alberto Arvelo Torrealba", "Andrés Eloy Blanco", "Antonio José de Sucre",
        "Arismendi", "Barinas", "Bolívar", "Cruz Paredes",
        "Ezequiel Zamora", "Obispos", "Pedraza", "Rojas", "Sosa"
    ];

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
        coordenadas: "",

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

    //---------------------------------Validaciones del registro-------------------------------------

    const [errors, setErrors] = useState({
        productor_nombre: "",
        productor_cedula: "",
        productor_telefono: "",
        productor_correo: "",
        municipio: "",
        parroquia: "",
        comunidad: "",
        centro_poblado: "",
        coordenadas: ""
    });

    const verificarCedulaDuplicada = (cedula) => {
        // 1. Aseguramos que comparamos peras con peras (Strings sin espacios)
        const cedulaLimpia = String(cedula).trim();

        // 2. Buscamos en la lista que trajo obtenerHistorial
        const existe = listaPredios.some(p => {
            // Accedemos según tu modelo: p.productor.cedula_rif
            const cedulaEnDB = p.productor?.cedula_rif;
            return String(cedulaEnDB).trim() === cedulaLimpia;
        });

        if (existe) {
            setErrors(prev => ({
                ...prev,
                productor_cedula: "Esta cédula ya se encuentra registrada"
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                productor_cedula: ""
            }));
        }
    };
    const validarCampoProductor = (name, value) => {
        let mensaje = "";

        if (name === "productor_nombre") {
            if (value.trim().length < 3) {
                mensaje = "El nombre es muy corto";
            } else if (value.length > 40) {
                mensaje = "Máximo 40 caracteres permitidos";
            } else if (/[0-9]/.test(value)) {
                mensaje = "El nombre no debe contener números";
            } else if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(value)) {
                mensaje = "No se permiten signos ni símbolos";
            }
        }
        if (name === "productor_cedula") {
            const regexSoloNumeros = /^[0-9]{7,8}$/;

            if (value === "") {
                mensaje = ""; // Si está vacío no hay error, solo está incompleto
            } else if (!regexSoloNumeros.test(value)) {
                mensaje = "La cédula debe tener 7 u 8 números";
            } else {
                // SOLO si tiene el formato correcto, buscamos duplicados
                verificarCedulaDuplicada(value);
                return; // Salimos para que verificarCedulaDuplicada se encargue del setErrors
            }

            // Actualizamos errores de formato (si no entró al else)
            setErrors(prev => ({ ...prev, [name]: mensaje }));
        }

        if (name === "productor_telefono") {
            // Solo números, exactamente 11 dígitos
            if (value === "") {
                mensaje = "";
            } else if (!/^[0-9]{11}$/.test(value)) {
                mensaje = "El teléfono debe tener exactamente 11 números (Ej: 04141234567)";
            }
        }

        if (name === "productor_correo" && value !== "") {
            // Esta regex verifica que tenga el formato básico Y que termine exactamente en @gmail.com o @hotmail.com
            const regexDominiosPermitidos = /^[^\s@]+@(gmail\.com|hotmail\.com)$/i;

            if (!regexDominiosPermitidos.test(value)) {
                mensaje = "Solo se permiten correos @gmail.com o @hotmail.com";
            }
        }

        // --- DENTRO DE validarCampoProductor ---

        // Municipio y Parroquia (Obligatorios)
        if (name === "municipio" || name === "parroquia") {
            if (value === "") mensaje = "Este campo es obligatorio";
        }

        if (name === "comunidad" || name === "centro_poblado") {
            const soloLetrasYEspacios = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

            if (value.trim() === "") {
                mensaje = "Indique la localidad";
            } else if (value.length < 3) {
                mensaje = "El nombre es muy corto";
            } else if (value.length > 30) {
                mensaje = "Máximo 30 caracteres permitidos"; // <-- Nueva validación
            } else if (!soloLetrasYEspacios.test(value)) {
                mensaje = "Solo letras y espacios";
            }
        }

        // COORDENADAS (La más importante)
        if (name === "coordenadas") {
            if (value === "") {
                mensaje = "Pegue las coordenadas de Google Maps";
            } else {
                // Regex para validar formato: Numero, Numero (con negativos opcionales)
                const regexCoords = /^-?\d+\.\d+,\s*-?\d+\.\d+$/;
                if (!regexCoords.test(value)) {
                    mensaje = "Formato inválido. Use: 8.123, -70.123";
                }
            }
        }

        // --- SECCIÓN III: IDENTIFICACIÓN DEL PREDIO ---

        // Nombre del Predio
        if (name === "nombre_predio") {
            if (value.trim() === "") {
                mensaje = "El nombre del predio es obligatorio";
            } else if (value.length < 3) {
                mensaje = "Nombre demasiado corto";
            } else if (value.length > 50) {
                mensaje = "Máximo 50 caracteres";
            }
        }

        // Dirección (Detalle de cómo llegar o referencia)
        if (name === "direccion") {
            if (value.trim() === "") {
                mensaje = "La dirección es necesaria para la ubicación física";
            } else if (value.length < 10) {
                mensaje = "Por favor, sea más específico (mín. 10 caracteres)";
            }
        }

        // Superficie (Numérica y mayor a cero)
        if (name === "superficie") {
            const valorNum = parseFloat(value);
            if (value === "") {
                mensaje = "Indique las hectáreas";
            } else if (isNaN(valorNum) || valorNum <= 0) {
                mensaje = "Debe ser un número mayor a 0";
            }
        }

        // Tipo de Propiedad
        if (name === "tipo_propiedad") {
            if (value === "") {
                mensaje = "Seleccione el tipo de propiedad";
            }
        }

        if (name === "vialidad") {
            if (value === "") {
                mensaje = "Debe calificar el estado de la vía de acceso";
            }
        }

        // Validación para los campos de infraestructura: Solo enteros positivos
        const validarInfraestructura = (valor) => {
            if (valor === "") return ""; // Permitimos vacío para que el usuario pueda borrar

            // Regex que verifica que SOLO haya números del inicio al fin
            const soloNumerosEnteros = /^\d+$/;

            if (!soloNumerosEnteros.test(valor)) {
                return "Solo se permiten números enteros";
            }

            return "";
        };

        // --- SECCIÓN VII: MODELO DE PRODUCCIÓN ---

        if (name === "tipo_explotacion") {
            if (value === "") {
                mensaje = "Seleccione el tipo de explotación";
            }
        }

        setErrors(prev => ({ ...prev, [name]: mensaje }));
    };

    //----------------------------

    //Función desactivar Botón
    const esFormularioValido = () => {
        // 1. Que no existan mensajes de error en el estado
        const sinErrores = Object.values(errors).every(error => error === "");

        // 2. Que los campos críticos tengan datos
        const camposObligatorios =
            formData.productor_nombre.trim() !== "" &&
            formData.productor_cedula.trim() !== "" &&
            formData.municipio !== "" &&
            formData.parroquia !== "" &&
            formData.coordenadas.trim() !== "" &&
            formData.nombre_predio.trim() !== "" &&
            formData.superficie !== "" &&
            formData.tipo_propiedad !== "" &&
            formData.vialidad !== "" &&
            formData.tipo_explotacion !== "";

        return sinErrores && camposObligatorios;
    };


    // Obtenemos una lista de los municipios que ya tienen al menos un predio registrado
    const municipiosConRegistros = [...new Set(listaPredios.map(p => p.municipio))];

    // Contamos cuántos hay
    const totalMunicipiosBarinas = MUNICIPIOS.length; // Esto dará 12
    const cantidadCubiertos = municipiosConRegistros.length;

    useEffect(() => {
        const data = sessionStorage.getItem("usuario_predios");
        if (!data) {
            navigate("/predios/login");
        } else {
            setUsuario(JSON.parse(data));
            // CARGA LOS DATOS AQUÍ APENAS INICIA
            obtenerHistorial();
        }
    }, [navigate]);

    // ── AQUÍ VAN LAS FUNCIONES ──

    const [cargando, setCargando] = useState(true);

    const obtenerHistorial = async () => {
        setCargando(true); // Empieza a cargar
        try {
            const response = await fetch('http://127.0.0.1:8000/api/predios/');
            const data = await response.json();
            setListaPredios(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargando(false); // Terminó (con éxito o error)
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

        // Actualizamos el dato
        setFormData(prev => {
            const nuevoEstado = { ...prev, [name]: value };
            if (name === "municipio") nuevoEstado.parroquia = "";
            return nuevoEstado;
        });

        // Validamos en tiempo real
        validarCampoProductor(name, value);
    };

    const manejarCambioTab = (tab) => {

        setTabActiva(tab);
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

    const manejarInfra = (key, e) => {
        // Obtenemos el valor directamente del evento e
        const valorOriginal = e.target.value;

        // Filtramos: solo dejamos los números
        const valorLimpio = valorOriginal.replace(/[^0-9]/g, "");

        // Actualizamos el estado del formulario
        setFormData(prev => ({
            ...prev,
            infraestructura: {
                ...prev.infraestructura,
                [key]: valorLimpio
            }
        }));

        // Opcional: Si quieres mostrar error si intentan meter letras
        if (valorOriginal !== valorLimpio) {
            setErrors(prev => ({
                ...prev,
                [`infra_${key}`]: "Solo se permiten números"
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                [`infra_${key}`]: ""
            }));
        }
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
                    coordenadas: formData.coordenadas,
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
                                <CardStat
                                    label="Predios Censados"
                                    value={cargando ? <Spinner /> : listaPredios.length}
                                    color="#136442"
                                />

                                <CardStat
                                    label="Superficie Total"
                                    value={cargando ? <Spinner /> : `${listaPredios.reduce((acc, p) => acc + parseFloat(p.superficie || 0), 0).toLocaleString()} Ha`}
                                    color="#136442"
                                />

                                <CardStat
                                    label="Municipios Cubiertos"
                                    value={cargando ? <Spinner /> : `${cantidadCubiertos} / ${totalMunicipiosBarinas}`}
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
                                    <InputField
                                        label="Nombre Completo"
                                        name="productor_nombre"
                                        value={formData.productor_nombre}
                                        onChange={manejarCambio}
                                        error={errors.productor_nombre} // Pasamos el mensaje de error
                                    />
                                    <InputField
                                        label="Cédula (Solo números)"
                                        name="productor_cedula"
                                        value={formData.productor_cedula}
                                        onChange={manejarCambio}
                                        error={errors.productor_cedula}
                                        maxLength={9}
                                    />
                                    <InputField
                                        label="Teléfono"
                                        name="productor_telefono"
                                        value={formData.productor_telefono}
                                        onChange={manejarCambio}
                                        error={errors.productor_telefono}
                                    />
                                    <InputField
                                        label="Correo (Opcional)"
                                        name="productor_correo"
                                        value={formData.productor_correo}
                                        onChange={manejarCambio}
                                        error={errors.productor_correo}
                                    />
                                </div>
                            </FormSection>

                            <FormSection title="II. Georreferenciación y Ubicación">
                                <div style={grid3}>
                                    <SelectField
                                        label="Municipio"
                                        name="municipio"
                                        options={Object.keys(PARROQUIAS_POR_MUNICIPIO)}
                                        onChange={manejarCambio}
                                        error={errors.municipio}
                                    />
                                    <SelectField
                                        label="Parroquia"
                                        name="parroquia"
                                        options={formData.municipio ? PARROQUIAS_POR_MUNICIPIO[formData.municipio] : []}
                                        onChange={manejarCambio}
                                        disabled={!formData.municipio}
                                        error={errors.parroquia}
                                    />
                                    <InputField
                                        label="Comunidad / Sector"
                                        name="comunidad"
                                        value={formData.comunidad}
                                        onChange={manejarCambio}
                                        error={errors.comunidad}
                                    />
                                    <InputField
                                        label="Centro Poblado"
                                        name="centro_poblado"
                                        value={formData.centro_poblado}
                                        onChange={manejarCambio}
                                        error={errors.centro_poblado}
                                    />

                                    <InputField
                                        label="Coordenadas (Latitud, Longitud)"
                                        name="coordenadas"
                                        value={formData.coordenadas}
                                        placeholder="Ej: 8.097364, -69.312631"
                                        onChange={manejarCambio}
                                        error={errors.coordenadas}
                                    />
                                </div>
                            </FormSection>

                            <FormSection title="III. Identificación del Predio">
                                <div style={grid3}>
                                    <InputField
                                        label="Nombre del Predio"
                                        name="nombre_predio"
                                        value={formData.nombre_predio}
                                        onChange={manejarCambio}
                                        error={errors.nombre_predio}
                                        maxLength={50}
                                    />
                                    <InputField
                                        label="Dirección"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={manejarCambio}
                                        error={errors.direccion}
                                        placeholder="Ej: Carretera vieja, entrada al lado de la escuela"
                                    />
                                    <InputField
                                        label="Superficie (Ha)"
                                        type="number"
                                        name="superficie"
                                        value={formData.superficie}
                                        onChange={manejarCambio}
                                        error={errors.superficie}
                                    />

                                    <SelectField
                                        label="Tipo de Propiedad"
                                        name="tipo_propiedad"
                                        value={formData.tipo_propiedad}
                                        options={["Público", "Privado"]}
                                        onChange={manejarCambio}
                                        error={errors.tipo_propiedad}
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
                                        value={formData.vialidad} // Asegúrate de tener el value conectado
                                        options={["Excelente", "Bueno", "Regular", "Malo"]}
                                        onChange={manejarCambio}
                                        error={errors.vialidad} // <--- Feedback visual
                                    />
                                </div>
                            </FormSection>

                            <FormSection title="VI. Infraestructura">
                                <div style={grid3}>
                                    {Object.keys(formData.infraestructura).map((key) => (
                                        <InputField
                                            key={key}
                                            label={key.replace("_", " ").toUpperCase()}
                                            type="text"
                                            inputMode="numeric"
                                            value={formData.infraestructura[key] || ""} // Agregamos el || "" por seguridad
                                            onChange={(e) => manejarInfra(key, e)} // <--- Pasamos el evento 'e' completo
                                            error={errors[`infra_${key}`]}
                                            placeholder="0"
                                        />
                                    ))}
                                </div>
                            </FormSection>

                            <FormSection title="VII. Modelo de Producción">
                                <SelectField
                                    label="Tipo de Explotación"
                                    name="tipo_explotacion"
                                    value={formData.tipo_explotacion}
                                    options={["Intensivo", "Semi Intensivo", "Extensivo"]}
                                    onChange={manejarCambio}
                                    error={errors.tipo_explotacion} // <--- Vinculación del error
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
                                <button
                                    onClick={guardarEnDjango}
                                    disabled={!esFormularioValido()} // Se desactiva si el form no es válido
                                    style={{
                                        ...btnPrincipal,
                                        backgroundColor: esFormularioValido() ? "#136442" : "#ccc", // Gris si está desactivado
                                        cursor: esFormularioValido() ? "pointer" : "not-allowed", // Cursor de bloqueo
                                        opacity: esFormularioValido() ? 1 : 0.7,
                                        boxShadow: esFormularioValido() ? "0 4px 14px rgba(19, 100, 66, 0.3)" : "none"
                                    }}
                                >
                                    Finalizar Registro
                                </button>
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

                                                {/* --- CAMBIO AQUÍ: CAMPO ÚNICO DE COORDENADAS --- */}
                                                <div style={{ gridColumn: "span 2" }}>
                                                    <small style={{ color: "#136442", fontWeight: "bold" }}>COORDENADAS (LATITUD Y LONGITUD)</small>
                                                    {/* --- CORRECCIÓN: Usar el nombre exacto del modelo --- */}
                                                    {editando ? (
                                                        <input
                                                            type="text"
                                                            style={{ ...estiloInput, border: "1px solid #0ea5e9", letterSpacing: "1px" }}
                                                            placeholder="Ej: 8.097364, -69.312631"
                                                            value={predioSeleccionado.coordenadas || ""}
                                                            onChange={(e) => actualizarPredio('coordenadas', e.target.value)}
                                                        />
                                                    ) : (
                                                        <p style={{ ...estiloP, backgroundColor: "#f0fdf4", padding: "8px", borderRadius: "6px", border: "1px" }}>
                                                            <strong>{predioSeleccionado.coordenadas || "Sin coordenadas registradas"}</strong>
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <small style={{ color: "#888", fontWeight: "bold" }}>CENTRO POBLADO</small>
                                                    {editando ? <input style={estiloInput} value={predioSeleccionado.centro_poblado} onChange={(e) => actualizarPredio('centro_poblado', e.target.value)} /> : <p style={estiloP}>{predioSeleccionado.centro_poblado}</p>}
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

                    {tabActiva === "mapa" && (
                        <div style={{ maxWidth: "1200px", margin: "0 auto", animation: "fadeIn 0.5s" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>

                                {/* SECCIÓN SUPERIOR: EL MAPA A TODO ANCHO */}
                                <div style={{
                                    width: "100%",
                                    backgroundColor: "#fff",
                                    borderRadius: "16px",
                                    padding: "12px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                    border: "1px solid #e0e0e0",
                                    height: "600px"
                                }}>
                                    <div style={{ height: "100%", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                                        <MapaBarinas predios={listaPredios} />
                                    </div>
                                </div>

                                {/* SECCIÓN INFERIOR: RESUMEN POR MUNICIPIO EN CUADRÍCULA */}
                                <div style={{
                                    width: "100%",
                                    backgroundColor: "#fff",
                                    padding: "25px",
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                                    border: "1px solid #f0f0f0"
                                }}>
                                    <h4 style={{
                                        color: "#2d572c",
                                        marginBottom: "20px",
                                        fontWeight: "700",
                                        borderBottom: "2px solid #e8f5e9",
                                        paddingBottom: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px"
                                    }}>
                                        📊 Distribución por Municipios
                                    </h4>

                                    {/* Grid para que los contadores se vean organizados en filas */}
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                                        gap: "15px"
                                    }}>
                                        {MUNICIPIOS.map(muni => {
                                            const total = listaPredios.filter(p => p.municipio === muni).length;
                                            return (
                                                <div key={muni} style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    padding: "12px 15px",
                                                    borderRadius: "12px",
                                                    backgroundColor: total > 0 ? "#f1f8e9" : "#fafafa",
                                                    border: `1px solid ${total > 0 ? "#c5e1a5" : "#eee"}`,
                                                    transition: "transform 0.2s ease",
                                                    cursor: "default"
                                                }}>
                                                    <span style={{
                                                        fontWeight: total > 0 ? "600" : "400",
                                                        color: total > 0 ? "#33691e" : "#888",
                                                        fontSize: "14px"
                                                    }}>
                                                        {muni}
                                                    </span>
                                                    <span style={{
                                                        backgroundColor: total > 0 ? "#33691e" : "#ccc",
                                                        color: "#fff",
                                                        padding: "4px 12px",
                                                        borderRadius: "8px",
                                                        fontSize: "13px",
                                                        fontWeight: "bold",
                                                        minWidth: "35px",
                                                        textAlign: "center"
                                                    }}>
                                                        {total}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

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

const InputField = ({ label, error, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>{label}</label>
        <input
            {...props}
            style={{
                ...inputStyle,
                // Si hay error, el borde se pone rojo y el fondo cambia levemente
                border: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                backgroundColor: error ? "#fef2f2" : "#f8fafc"
            }}
        />
        {/* Si existe un error, lo mostramos justo debajo del input */}
        {error && (
            <p style={{
                color: "#ef4444",
                fontSize: "11px",
                marginTop: "5px",
                fontWeight: "600",
                animation: "fadeIn 0.3s ease"
            }}>
                {error}
            </p>
        )}
    </div>
);

const SelectField = ({ label, options, error, ...props }) => (
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
