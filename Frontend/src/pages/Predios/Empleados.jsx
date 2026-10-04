import React, { useState, useEffect } from 'react';
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
import FormHierro from "../../components/FormHierro";
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
        licenciaHierro,
        setLicenciaHierro,
        guardarLicencia,
    } = useDashboardProduccion();

    // ── AQUÍ PUEDES COLOCARLO ──
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
        tipo_explotacion: "Extensivo",
        sistemas_registro: []
    };

    const [formData, setFormData] = useState(formInicial);
    const [errors, setErrors] = useState({});
    const [camposBloqueados, setCamposBloqueados] = useState({});
    const [prefijoCedula, setPrefijoCedula] = useState("V-");

    const PARROQUIAS_POR_MUNICIPIO = {
        "Barinas": ["Catedral", "Alto Barinas", "Manuel Palacio Fajardo", "San Juan de Guanay", "Torunos"],
    };

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

    // Filtramos la lista general de predios solo para el municipio del empleado
    const prediosMunicipio = listaPredios.filter(
        (predio) => predio.municipio === municipioEmpleado
    );

    // 🔹 AQUÍ INTEGRAMOS EL HOOK DE HISTORIAL (Reemplaza las funciones locales vacías)
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
        eliminarDefinitivoReal
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

    const cargandoDashboard = cargando || (!listaPredios || listaPredios.length === 0);
    const totalPrediosMunicipio = prediosMunicipio.length;
    const superficieTotalMunicipio = prediosMunicipio.reduce(
        (acc, predio) => acc + Number(predio.superficie || 0),
        0
    );

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

                    {vistaActiva === "inicio" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <DashboardInicio
                                cargando={cargandoDashboard}
                                totalPredios={totalPrediosMunicipio}
                                superficieTotal={superficieTotalMunicipio}
                                municipiosCubiertos={1}
                                totalMunicipiosBarinas={1}
                                listaPredios={prediosMunicipio}
                                datosGrafico={[{ name: municipioEmpleado, cantidad: totalPrediosMunicipio }]}
                                datosTenencia={datosTenenciaMunicipio}
                                datosServicios={datosServiciosMunicipio}
                                datosVialidad={datosVialidadMunicipio}
                                datosIntensidad={datosIntensidadMunicipio}
                                datosDispersion={prediosMunicipio.map(p => ({ superficie: Number(p.superficie || 0), infraestructura: Object.values(p.infraestructura || {}).reduce((a, b) => a + Number(b), 0) }))}
                                datosLegales={datosLegalesMunicipio}
                                chartCard={chartCard}
                                chartTitle={chartTitle}
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
                            InputField={InputField}
                            errors={errors}
                        />
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
                                modo="caracterizacion" // 🔹 Activa el flujo completo con validación WhatsApp
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
                    ) : vistaActiva === "produccion_hierro" ? (
                        <div>
                            <FormHierro
                                predioActivo={predioActivo}
                                licenciaHierro={licenciaHierro}
                                setLicenciaHierro={setLicenciaHierro}
                                guardarLicencia={guardarLicencia}
                                FormSection={({ title, children }) => (
                                    <div style={{ background: "#ffffff", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                                        <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", marginBottom: "16px" }}>{title}</h3>
                                        {children}
                                    </div>
                                )}
                                InputField={InputField}
                                styles={{
                                    labelStyle: { fontSize: "12px", fontWeight: "600", color: "#374151" },
                                    inputStyle: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "13px", boxSizing: "border-box" },
                                    grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" },
                                    btnPrincipal: { backgroundColor: "#136442", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "13px" },
                                    radioLabel: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151", cursor: "pointer" }
                                }}
                            />
                        </div>
                    ) : vistaActiva === "produccion_actualizacion" ? (
                        <div>
                            <FormCaracterizacion
                                modo="actualizacion" // 🔹 Activa la precarga de datos y el guardado directo sin WhatsApp
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
                        <div>
                            <SeccionReportes listaPredios={listaPredios} />
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