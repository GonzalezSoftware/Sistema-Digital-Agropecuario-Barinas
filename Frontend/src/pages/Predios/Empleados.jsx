import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import escudo from "../../assets/logo2.jpg";
import logo from "../../assets/gobierno.jpg";
import Swal from "sweetalert2";

// Hook con los datos y estados globales ya definidos
import { useDashboardProduccion } from "../../hooks/useProduccion";

// Hook para la gestión del historial y peticiones a la API
import { useHistorialPredios } from "../../hooks/useHistorialPredios";

// Components
import AdminProduccionDashboard from "../../components/AdminProduccionDashboard";
import AdminProduccionSeleccionarPredio from "../../components/SeleccionPredio";
import FormCaracterizacion from "../../components/FormCaracterizacion";
import SeccionReportes from "../../components/SeccionReportes";
import { EmpleadoHeader } from '../../components/EmpleadoHeader';
import { EmpleadoSidebar } from '../../components/EmpleadoSidebar';
import EmpleadosRegistroPredios from "../../components/EmpleadosRegistroPredios";
import DashboardInicio from "../../components/DashboardInicio";
import { Spinner } from "../../components/ui/AdminUI";
import { useGraficosPredios } from "../../components/EmpleadosObtenerGraficosPredios";
import HistorialPredios from '../../components/HistorialPredios';
import MapaBarinas from "../../components/MapaBarinas";
import { ReportesView } from "../../components/ReportesView";

const InputField = ({ label, placeholder, value, onChange, type = "text" }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "13px" }}
        />
    </div>
);

// Estilos UI
import {
    estiloInput, estiloBoton,
} from "../../components/ui/AdminUI";

export default function EmpleadoDashboard() {
    // URL del servidor backend en AWS con HTTPS
    const API_URL = "https://3.145.179.35.nip.io/api/";

    const navigate = useNavigate();
    const [vistaActiva, setVistaActiva] = useState("inicio");

    // 🔹 Consumimos las propiedades necesarias del hook global de producción
    const {
        usuario,
        cargando,
        statsProduccion,
        cerrarSesion,
        municipioEmpleado,
        busquedaCedula,
        setBusquedaCedula,
        filtrarPredios,
        predioActivo,
        setPredioActivo,
        setPredioSeleccionado: setPredioSeleccionadoGlobal,
        setMostrarModal: setMostrarModalGlobal,
        mostrarModal: mostrarModalGlobal,
        predioSeleccionado: predioSeleccionadoGlobal,
        generarPDFPredio,
        listaPredios,
        rubrosVegetales,
        setRubrosVegetales,
        inventarioInicial,
        setInventarioInicial,
        subCaracterizacion,
        setSubCaracterizacion,
        setTabActiva,
        guardarLicencia,
    } = useDashboardProduccion();

    const cambiarDueñoPredio = async (predioSeleccionado) => {
        try {
            console.log("Enviando petición para el predio ID:", predioSeleccionado.id_predio);

            Swal.fire({
                title: "Procesando...",
                text: "Actualizando el estado del predio, por favor espere.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch(`${API_URL}predios/${predioSeleccionado.id_predio}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    estado: 'inactivo',
                    inhabilitado: true
                })
            });

            console.log("Código de respuesta del servidor:", response.status);

            if (!response.ok) {
                const errorTexto = await response.text();
                console.error("Detalle del error del servidor:", errorTexto);
                throw new Error("No se pudo procesar la solicitud (Error " + response.status + ")");
            }

            await Swal.fire({
                title: "¡Predio Inhabilitado!",
                text: "El predio ha sido marcado como inactivo correctamente.",
                icon: "success",
                confirmButtonColor: "#136442"
            });

            window.location.reload();

        } catch (error) {
            console.error("Error en cambio de dueño:", error);
            Swal.fire({
                title: "Error",
                text: error.message || "No se pudo completar la acción.",
                icon: "error",
                confirmButtonColor: "#b91c1c"
            });
        }
    };

    useEffect(() => {
        if (municipioEmpleado) {
            sessionStorage.setItem("municipio_empleado", municipioEmpleado);
        }
    }, [municipioEmpleado]);

    useEffect(() => {
        if (vistaActiva === "produccion_caracterizacion" && predioActivo) {
            if (predioActivo.caracterizacion_completada) {
                Swal.fire({
                    icon: "warning",
                    title: "Acción restringida",
                    text: "Este predio ya posee una caracterización completada.",
                    confirmButtonColor: "#136442"
                });
                setVistaActiva("produccion_seleccionar_predio");
            }
        }
    }, [vistaActiva, predioActivo]);

    useEffect(() => {
        if (vistaActiva === "produccion_actualizacion" && predioActivo) {
            if (!predioActivo.caracterizacion_completada) {
                Swal.fire({
                    icon: "warning",
                    title: "Acción restringida",
                    text: "Este predio no posee una caracterización completada. No se puede actualizar.",
                    confirmButtonColor: "#136442"
                });
                setVistaActiva("produccion_seleccionar_predio");
            }
        }
    }, [vistaActiva, predioActivo]);

    // ── ESTADO INICIAL COMPLETO Y LOCAL ──
    const formInicial = {
        productor_nombre: "",
        productor_cedula: "",
        productor_telefono: "",
        productor_correo: "",
        municipio: municipioEmpleado || "Barinas",
        parroquia: "",
        comunidad: "",
        centro_poblado: "",
        coordenadas: "",
        nombre_predio: "",
        direccion: "",
        superficie: "",
        tipo_propiedad: "Privado",
        tenencia: "Propiedad",
        servicios: [],
        vialidad: "Regular",
        infraestructura: {
            corrales: 0, galpones: 0, vaqueras: 0, cochineras: 0, silos: 0,
            caballerizas: 0, feedlot: 0, lagunas: 0, salas_ordeno: 0,
            queseras: 0, casas: 0, trapiches: 0, establos: 0
        },
        tipo_explotacion: "Extensivo",
        sistemas_registro: []
    };

    const [formData, setFormData] = useState(formInicial);
    const [errors, setErrors] = useState({});
    const [camposBloqueados, setCamposBloqueados] = useState({});
    const [prefijoCedula, setPrefijoCedula] = useState("V-");

    const PARROQUIAS_POR_MUNICIPIO = useMemo(() => ({
        "Alberto Arvelo Torrealba": ["Sabaneta", "Rodriguez Domínguez"],
        "Andrés Eloy Blanco": ["El Cantón", "Santa Cruz de Guacas", "Puerto Vivas"],
        "Antonio José de Sucre": ["Ticoporo", "Andrés Bello", "Nicolás Pulido"],
        "Arismendi": ["Arismendi", "Guadarrama", "La Unión", "San Antonio"],
        "Barinas": ["Catedral", "Alto Barinas", "Manuel Palacio Fajardo", "San Juan de Guanay", "Torunos", "El Carmen", "San Silvestre", "Santa Inés", "Santa Lucía", "Juan Antonio Rodríguez Domínguez"],
        "Bolívar": ["Barinitas", "Altamira de Cáceres", "Calderas"],
        "Cruz Paredes": ["Barrancas", "El Socorro", "Masparrito"],
        "Ezequiel Zamora": ["Santa Bárbara", "Ramón Ignacio Méndez", "José Ignacio del Pumar", "Santa Rosa"],
        "Obispos": ["Obispos", "El Real", "La Luz", "Los Guasimitos"],
        "Pedraza": ["Ciudad Bolivia", "Ignacio Briceño", "José Félix Ribas", "Páez"],
        "Rojas": ["Libertad", "Dolores", "Palacios Fajardo", "Santa Rosa", "Simón Bolívar"],
        "Sosa": ["Ciudad de Nutrias", "El Regalo", "Puerto Nutrias", "Santa Lucía"]
    }), []);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validarCampoProductor = () => true;
    const verificarCedulaDuplicada = async () => false;
    const guardarEnDjango = async () => {
        console.log("Guardando formulario:", formData);
    };
    const esFormularioValido = () => true;

    // 🔹 FILTRADO DE PREDIOS
    const prediosMunicipio = useMemo(() => {
        if (!Array.isArray(listaPredios)) return [];
        return listaPredios.filter((predio) => predio && predio.municipio === municipioEmpleado);
    }, [listaPredios, municipioEmpleado]);

    // 🔹 HOOK DE HISTORIAL
    const {
        busqueda: busquedaHistorial,
        setBusqueda: setBusquedaHistorial,
        predioSeleccionado: predioSeleccionadoHistorial,
        setPredioSeleccionado: setPredioSeleccionadoHistorial,
        mostrarModal: mostrarModalHistorial,
        setMostrarModal: setMostrarModalHistorial,
        editando: editandoHistorial,
        setEditando: setEditandoHistorial,
        cargandoAccion: cargandoAccionHistorial,
        prediosFiltrados,
        manejarVerDetalles,
        actualizarProductor,
        actualizarPredio,
        actualizarInfraestructura,
        actualizarProduccion,
        guardarCambiosReal,
        eliminarDefinitivoReal,
    } = useHistorialPredios(prediosMunicipio);

    // Gráficos del municipio
    const {
        datosGrafico,
        datosTenencia: datosTenenciaMunicipio,
        datosServicios: datosServiciosMunicipio,
        datosVialidad: datosVialidadMunicipio,
        datosIntensidad: datosIntensidadMunicipio,
        datosDispersion,
        datosDigitalizacion,
        datosLegales: datosLegalesMunicipio
    } = useGraficosPredios(prediosMunicipio);

    const cargandoDashboard = cargando;
    const totalPrediosMunicipio = prediosMunicipio.length;
    const superficieTotalMunicipio = prediosMunicipio.reduce(
        (acc, predio) => acc + Number(predio?.superficie || 0),
        0
    );

    // ── CÁLCULO DE PARROQUIAS PARA EL GRÁFICO (CON PRUEBA VISUAL DE DIAGNÓSTICO) ──
    const [errorCalculoParroquias, setErrorCalculoParroquias] = useState(null);

    const datosGraficoParroquias = useMemo(() => {
        try {
            setErrorCalculoParroquias(null);
            const parroquiasDelMunicipio = PARROQUIAS_POR_MUNICIPIO[municipioEmpleado] || [];
            
            const conteoParroquias = {};
            parroquiasDelMunicipio.forEach(parroquia => {
                conteoParroquias[parroquia] = 0;
            });

            prediosMunicipio.forEach((predio) => {
                const parroquiaPredio = predio?.parroquia ? String(predio.parroquia).trim() : "";
                if (conteoParroquias.hasOwnProperty(parroquiaPredio)) {
                    conteoParroquias[parroquiaPredio] += 1;
                } else if (parroquiaPredio) {
                    conteoParroquias[parroquiaPredio] = (conteoParroquias[parroquiaPredio] || 0) + 1;
                }
            });

            const resultado = Object.keys(conteoParroquias).map(parroquia => ({
                name: parroquia,
                cantidad: conteoParroquias[parroquia]
            }));

            return resultado;
        } catch (err) {
            console.error("Error en datosGraficoParroquias:", err);
            setErrorCalculoParroquias(err.message);
            return [];
        }
    }, [municipioEmpleado, prediosMunicipio, PARROQUIAS_POR_MUNICIPIO]);

    const chartCard = {
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
    };
    const chartTitle = { fontSize: "15px", fontWeight: "600", color: "#1e293b", margin: 0 };
    const chartPlaceholder = { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b" };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ display: "flex", flex: 1 }}>

                <EmpleadoSidebar
                    empleadoData={usuario}
                    vistaActiva={vistaActiva}
                    setVistaActiva={setVistaActiva}
                    cerrarSesion={cerrarSesion}
                    predioActivo={predioActivo}
                />

                <main style={{ padding: "26px 50px", flex: 1, boxSizing: "border-box", overflowY: "auto", position: "relative" }}>
                    <EmpleadoHeader vistaActiva={vistaActiva} escudo={escudo} gobierno={logo} />

                    {/* 🛠️ RECUADRO DE DIAGNÓSTICO VISUAL EN VIVO */}
                    <div style={{ backgroundColor: "#1e293b", color: "#fff", padding: "12px 18px", borderRadius: "8px", marginBottom: "15px", fontSize: "12px", fontFamily: "monospace" }}>
                        <strong>[DIAGNÓSTICO EN VIVO]</strong> | 
                        Municipio Asignado: <code>{municipioEmpleado || "Ninguno"}</code> | 
                        Predios en este municipio: <code>{prediosMunicipio.length}</code> | 
                        Parroquias detectadas para el gráfico: <code>{JSON.stringify(datosGraficoParroquias)}</code>
                        {errorCalculoParroquias && <div style={{ color: "#f87171", marginTop: "4px" }}>⚠️ Error: {errorCalculoParroquias}</div>}
                    </div>

                    {vistaActiva === "inicio" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <DashboardInicio
                                cargando={cargandoDashboard}
                                totalPredios={totalPrediosMunicipio}
                                superficieTotal={superficieTotalMunicipio}
                                municipiosCubiertos={1}
                                totalMunicipiosBarinas={1}
                                listaPredios={prediosMunicipio}
                                datosGrafico={datosGraficoParroquias}
                                datosTenencia={datosTenenciaMunicipio}
                                datosServicios={datosServiciosMunicipio}
                                datosVialidad={datosVialidadMunicipio}
                                datosIntensidad={datosIntensidadMunicipio}
                                datosDispersion={prediosMunicipio.map(p => ({ superficie: Number(p?.superficie || 0), infraestructura: Object.values(p?.infraestructura || {}).reduce((a, b) => a + Number(b), 0) }))}
                                datosLegales={datosLegalesMunicipio}
                                chartCard={chartCard}
                                chartTitle={`Predios por Parroquia (${municipioEmpleado || "Municipio"})`}
                                chartPlaceholder={chartPlaceholder}
                                Spinner={Spinner}
                            />
                        </div>
                    ) : vistaActiva === "predios_registro" ? (
                        <div>
                            <EmpleadosRegistroPredios
                                formData={formData}
                                setFormData={setFormData}
                                errors={errors}
                                setErrors={setErrors}
                                manejarCambio={manejarCambio}
                                validarCampoProductor={validarCampoProductor}
                                verificarCedulaDuplicada={verificarCedulaDuplicada}
                                guardarEnDjango={guardarEnDjango}
                                esFormularioValido={esFormularioValido}
                                camposBloqueados={camposBloqueados}
                                prefijoCedula={prefijoCedula}
                                setPrefijoCedula={setPrefijoCedula}
                                PARROQUIAS_POR_MUNICIPIO={PARROQUIAS_POR_MUNICIPIO}
                                municipioEmpleado={municipioEmpleado}
                            />
                        </div>
                    ) : vistaActiva === "predios_historial" ? (
                        <div style={{ maxWidth: "1100px", margin: "0 auto", animation: "fadeIn 0.5s" }}>
                            {cargandoDashboard ? (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
                                    <Spinner />
                                </div>
                            ) : (
                                <HistorialPredios
                                    tabActiva="historial"
                                    busqueda={busquedaHistorial}
                                    setBusqueda={setBusquedaHistorial}
                                    prediosFiltrados={prediosFiltrados}
                                    manejarVerDetalles={manejarVerDetalles}
                                    mostrarModal={mostrarModalHistorial}
                                    predioSeleccionado={predioSeleccionadoHistorial}
                                    setMostrarModal={setMostrarModalHistorial}
                                    editando={editandoHistorial}
                                    setEditando={setEditandoHistorial}
                                    cargandoAccion={cargandoAccionHistorial}
                                    estiloInput={estiloInput}
                                    estiloBoton={estiloBoton}
                                    actualizarProductor={actualizarProductor}
                                    actualizarPredio={actualizarPredio}
                                    actualizarInfraestructura={actualizarInfraestructura}
                                    actualizarProduccion={actualizarProduccion}
                                    guardarCambiosReal={guardarCambiosReal}
                                    eliminarDefinitivoReal={eliminarDefinitivoReal}
                                    cambiarDueñoPredio={cambiarDueñoPredio}
                                    InputField={InputField}
                                    errors={errors}
                                    esAdmin={false}
                                />
                            )}
                        </div>
                    ) : vistaActiva === "predios_georreferenciacion" ? (
                        <div style={{ maxWidth: "1200px", margin: "0 auto", animation: "fadeIn 0.5s" }}>
                            {cargandoDashboard ? (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
                                    <Spinner />
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                    <div style={{
                                        width: "100%", backgroundColor: "#fff", borderRadius: "16px",
                                        padding: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                        border: "1px solid #e0e0e0", height: "600px"
                                    }}>
                                        <div style={{ height: "100%", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                                            <MapaBarinas predios={prediosMunicipio} />
                                        </div>
                                    </div>
                                    <div style={{
                                        width: "100%", backgroundColor: "#fff", padding: "25px",
                                        borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                                        border: "1px solid #eee"
                                    }}>
                                        <h4 style={{
                                            color: "#136442", marginBottom: "20px", fontWeight: "700",
                                            borderBottom: "2px solid #ccc", paddingBottom: "10px",
                                            display: "flex", alignItems: "center", gap: "10px",
                                            fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px"
                                        }}>
                                            Resumen Jurisdiccional - Municipio {municipioEmpleado || "Asignado"}
                                        </h4>
                                        <div style={{
                                            display: "flex", flexDirection: "column", alignItems: "center",
                                            justifyContent: "center", padding: "20px", borderRadius: "8px",
                                            border: "1px solid #bbf7d0", backgroundColor: "#f0fdf4",
                                            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                                        }}>
                                            <span style={{
                                                fontSize: "12px", fontWeight: "bold", color: "#136442",
                                                marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px"
                                            }}>
                                                Total Predios Georreferenciados en {municipioEmpleado}
                                            </span>
                                            <span style={{ fontSize: "24px", fontWeight: "bold", color: "#136442", lineHeight: "1" }}>
                                                {prediosMunicipio.length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : vistaActiva === "predios_reportes" ? (
                        <div style={{ maxWidth: "1200px", margin: "0 auto", animation: "fadeIn 0.5s" }}>
                            {cargandoDashboard ? (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
                                    <Spinner />
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    <div style={{
                                        backgroundColor: "#fff", padding: "20px", borderRadius: "12px",
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eee", overflowX: "auto"
                                    }}>
                                        <ReportesView predios={prediosMunicipio} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : vistaActiva === "produccion_inicio" ? (
                        <div>
                            <AdminProduccionDashboard
                                productionState={{
                                    cargando: cargando,
                                    statsProduccion: statsProduccion
                                }}
                            />
                        </div>
                    ) : vistaActiva === "produccion_seleccionar_predio" ? (
                        <div>
                            <AdminProduccionSeleccionarPredio
                                busquedaCedula={busquedaCedula}
                                setBusquedaCedula={setBusquedaCedula}
                                cargando={cargando}
                                filtrarPredios={filtrarPredios}
                                predioActivo={predioActivo}
                                setPredioActivo={setPredioActivo}
                                setPredioSeleccionado={setPredioSeleccionadoGlobal}
                                setMostrarModal={setMostrarModalGlobal}
                                mostrarModal={mostrarModalGlobal}
                                predioSeleccionado={predioSeleccionadoGlobal}
                                generarPDFPredio={generarPDFPredio}
                                InputField={InputField}
                                Spinner={Spinner}
                            />
                        </div>
                    ) : vistaActiva === "produccion_caracterizacion" ? (
                        <div>
                            <FormCaracterizacion
                                modo="caracterizacion"
                                predioActivo={predioActivo}
                                rubrosVegetales={rubrosVegetales}
                                setRubrosVegetales={setRubrosVegetales}
                                inventarioInicial={inventarioInicial}
                                setInventarioInicial={setInventarioInicial}
                                setTabActiva={setTabActiva}
                                subCaracterizacion={subCaracterizacion}
                                setSubCaracterizacion={setSubCaracterizacion}
                            />
                        </div>
                    ) : vistaActiva === "produccion_actualizacion" ? (
                        <div>
                            <FormCaracterizacion
                                modo="actualizacion"
                                predioActivo={predioActivo}
                                rubrosVegetales={rubrosVegetales}
                                setRubrosVegetales={setRubrosVegetales}
                                inventarioInicial={inventarioInicial}
                                setInventarioInicial={setInventarioInicial}
                                setTabActiva={setTabActiva}
                                subCaracterizacion={subCaracterizacion}
                                setSubCaracterizacion={setSubCaracterizacion}
                            />
                        </div>
                    ) : vistaActiva === "produccion_reportes" ? (
                        <div style={{ maxWidth: "1200px", margin: "0 auto", animation: "fadeIn 0.5s" }}>
                            {cargandoDashboard ? (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
                                    <Spinner />
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    <div style={{
                                        backgroundColor: "#fff", padding: "20px", borderRadius: "12px",
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eee", overflowX: "auto"
                                    }}>
                                        <SeccionReportes listaPredios={listaPredios} cargando={cargandoDashboard} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <p>Selecciona una sección válida en el menú lateral.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}