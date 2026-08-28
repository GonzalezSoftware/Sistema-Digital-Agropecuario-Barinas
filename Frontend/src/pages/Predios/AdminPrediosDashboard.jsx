import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import escudo from "../../assets/logo2.jpg";
import {
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, RadarChart, Radar,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter,
    Treemap, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


//Hooks
import { useEstadisticasPredios } from "../../hooks/useEstadisticasPredios";
import { useHistorialPredios } from '../../hooks/useHistorialPredios';

//Components
import DashboardInicio from '../../components/DashboardInicio';
import HistorialPredios from '../../components/HistorialPredios';
import { CredencialesMunicipios } from '../../components/CredencialesMunicipios';
import { AdminHeader } from '../../components/Header';
import { AdminSidebar } from '../../components/Sidebar';
import VistaMapaPredios from "../../components/VistaMapaPredios";

//Estilos UI
import {
    estiloInput, estiloBoton, InputField, Spinner, CardStat,
    chartCard, chartTitle, chartPlaceholder, avatarWrapper
} from "../../components/ui/AdminUI";

/// Importación de iconos
import PresentationChartBarIcon from "@heroicons/react/24/solid/PresentationChartBarIcon";
import KeyIcon from "@heroicons/react/24/solid/KeyIcon";
import PowerIcon from "@heroicons/react/24/solid/PowerIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ClockIcon from "@heroicons/react/24/solid/ClockIcon";
import MapPinIcon from "@heroicons/react/24/solid/MapPinIcon";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Importación de las 12 fotos de los municipios desde Frontend/src/assets/
import albertoArvelo from "../../assets/alberto_arvelo.jpg";
import andresEloy from "../../assets/andres_eloy.jpg";
import antonioJose from "../../assets/antonio_jose.jpg";
import arismendi from "../../assets/arismendi.jpg";
import barinasImg from "../../assets/barinas.jpg";
import bolivar from "../../assets/bolivar.jpg";
import cruzParedes from "../../assets/cruz_paredes.jpg";
import ezequielZamora from "../../assets/ezequiel_zamora.jpg";
import obispos from "../../assets/obispos.jpg";
import pedraza from "../../assets/pedraza.jpg";
import rojas from "../../assets/rojas.jpg";
import sosa from "../../assets/sosa.jpg";


export default function AdminPrediosDashboard() {
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState(null);
    const [vistaActiva, setVistaActiva] = useState("inicio");

    // Estado de credenciales por municipio
    const [credenciales, setCredenciales] = useState({});
    const [cargando, setCargando] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(false);

    // Listado oficial de los 12 municipios de Barinas vinculados a su respectiva imagen
    const MUNICIPIOS_BARINAS = [
        { id: "alberto_arvelo", nombre: "Alberto Arvelo Torrealba", capital: "Sabaneta", imagen: albertoArvelo },
        { id: "andres_eloy", nombre: "Andrés Eloy Blanco", capital: "El Cantón", imagen: andresEloy },
        { id: "antonio_jose", nombre: "Antonio José de Sucre", capital: "Socopó", imagen: antonioJose },
        { id: "arismendi", nombre: "Arismendi", capital: "Arismendi", imagen: arismendi },
        { id: "barinas", nombre: "Barinas", capital: "Barinas", imagen: barinasImg },
        { id: "bolivar", nombre: "Bolívar", capital: "Barinitas", imagen: bolivar },
        { id: "cruz_paredes", nombre: "Cruz Paredes", capital: "Barrancas", imagen: cruzParedes },
        { id: "ezequiel_zamora", nombre: "Ezequiel Zamora", capital: "Santa Bárbara", imagen: ezequielZamora },
        { id: "obispos", nombre: "Obispos", capital: "Obispos", imagen: obispos },
        { id: "pedraza", nombre: "Pedraza", capital: "Ciudad Bolivia", imagen: pedraza },
        { id: "rojas", nombre: "Rojas", capital: "Libertad", imagen: rojas },
        { id: "sosa", nombre: "Sosa", capital: "Ciudad de Nutrias", imagen: sosa },
    ];

    const MUNICIPIOS = [
        "Alberto Arvelo Torrealba", "Andrés Eloy Blanco", "Antonio José de Sucre",
        "Arismendi", "Barinas", "Bolívar", "Cruz Paredes",
        "Ezequiel Zamora", "Obispos", "Pedraza", "Rojas", "Sosa"
    ];












    // ---------------------------------------- DASHBOARD ------------------------------------------------------

    const [listaPredios, setListaPredios] = useState([]);
    const {
        totalPredios,
        superficieTotal,
        municipiosCubiertos,
        totalMunicipiosBarinas,
        datosGrafico,
        datosTenencia,
        datosServicios,
        datosVialidad,
        datosIntensidad,
        datosDispersion,
        datosLegales
    } = useEstadisticasPredios(listaPredios);

    // ---------------------------------------- HISTORIAL --------------------------------------------------

    const {
        busqueda,
        setBusqueda,
        predioSeleccionado,
        setPredioSeleccionado,
        mostrarModal,
        setMostrarModal,
        editando,
        setEditando,
        cargandoAccion,
        prediosFiltrados,
        manejarVerDetalles,
        actualizarProductor,
        actualizarPredio,
        actualizarInfraestructura,
        actualizarProduccion,
        guardarCambiosReal,
        eliminarDefinitivoReal
    } = useHistorialPredios(listaPredios);

    useEffect(() => {
        setCargando(true);
        fetch("/api/predios/") // Ajusta la ruta según tu URL de Django DRF
            .then(res => res.json())
            .then(data => {
                // Si tu ViewSet usa paginación, puede venir en data.results, si no, es data directamente
                setListaPredios(Array.isArray(data) ? data : data.results || []);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error al cargar los predios:", err);
                setCargando(false);
            });
    }, []);

    useEffect(() => {
        const sesion = sessionStorage.getItem("usuario_admin");
        if (!sesion) {
            navigate("/predios/admin-secreto");
            return;
        }
        setAdminData(JSON.parse(sesion));
    }, [navigate]);

    useEffect(() => {
        if (vistaActiva === "credenciales") {
            setCargandoDatos(true);
            fetch("/api/credenciales-municipios/")
                .then(res => res.json())
                .then(data => {
                    setCredenciales(data);
                    setCargandoDatos(false);
                })
                .catch(err => {
                    console.log("Error cargando credenciales:", err);
                    setCargandoDatos(false);
                });
        }
    }, [vistaActiva]);

    const cerrarSesion = () => {
        sessionStorage.removeItem("usuario_admin");
        navigate("/predios/admin-secreto");
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", fontFamily: "'Poppins', sans-serif" }}>

            {/* ── CONTENEDOR PRINCIPAL ── */}
            <div style={{ display: "flex", flex: 1 }}>

                <AdminSidebar
                    adminData={adminData}
                    vistaActiva={vistaActiva}
                    setVistaActiva={setVistaActiva}
                    cerrarSesion={cerrarSesion}
                    PresentationChartBarIcon={PresentationChartBarIcon}
                    KeyIcon={KeyIcon}
                    ClockIcon={ClockIcon}
                    PowerIcon={PowerIcon}
                />

                {/* ── CONTENIDO PRINCIPAL DERECHO DINÁMICO ── */}
                <main style={{ padding: "26px 50px", flex: 1, boxSizing: "border-box", overflowY: "auto" }}>

                    <AdminHeader vistaActiva={vistaActiva} escudo={escudo} />

                    {vistaActiva === "inicio" ? (
                        <DashboardInicio
                            cargando={cargando}
                            totalPredios={totalPredios}
                            superficieTotal={superficieTotal}
                            municipiosCubiertos={municipiosCubiertos}
                            totalMunicipiosBarinas={totalMunicipiosBarinas}
                            listaPredios={listaPredios}
                            datosGrafico={datosGrafico}
                            datosTenencia={datosTenencia}
                            datosServicios={datosServicios}
                            datosVialidad={datosVialidad}
                            datosIntensidad={datosIntensidad}
                            datosDispersion={datosDispersion}
                            datosLegales={datosLegales}
                            chartCard={chartCard}
                            chartTitle={chartTitle}
                            chartPlaceholder={chartPlaceholder}
                        />
                    ) : vistaActiva === "credenciales" ? (
                        <CredencialesMunicipios
                            MUNICIPIOS_BARINAS={MUNICIPIOS_BARINAS}
                            credenciales={credenciales}
                            setCredenciales={setCredenciales}
                            cargandoDatos={cargandoDatos}
                            CheckCircleIcon={CheckCircleIcon}
                            ExclamationCircleIcon={ExclamationCircleIcon}
                            KeyIcon={KeyIcon}
                            XMarkIcon={XMarkIcon}
                            UserIcon={UserIcon}
                            LockClosedIcon={LockClosedIcon}
                        />
                    ) : vistaActiva === "historial" ? (
                        <HistorialPredios
                            tabActiva={vistaActiva}
                            busqueda={busqueda}
                            setBusqueda={setBusqueda}
                            prediosFiltrados={prediosFiltrados}
                            manejarVerDetalles={manejarVerDetalles}
                            mostrarModal={mostrarModal}
                            predioSeleccionado={predioSeleccionado}
                            setMostrarModal={setMostrarModal}
                            editando={editando}
                            setEditando={setEditando}
                            cargandoAccion={cargandoAccion}
                            estiloInput={estiloInput}
                            estiloBoton={estiloBoton}
                            actualizarProductor={actualizarProductor}
                            actualizarPredio={actualizarPredio}
                            actualizarInfraestructura={actualizarInfraestructura}
                            actualizarProduccion={actualizarProduccion}
                            guardarCambiosReal={guardarCambiosReal}
                            eliminarDefinitivoReal={eliminarDefinitivoReal}
                            InputField={InputField}
                            errors={{}}
                        />
                    ) : vistaActiva === "georreferenciacion" ? (
                        <VistaMapaPredios
                            listaPredios={listaPredios}
                            municipios={MUNICIPIOS}
                        />
                    ) : (
                        /* --- VISTA POR DEFECTO (Si el estado no coincide con ninguna) --- */
                        <div>
                            <p>Selecciona una sección válida en el menú lateral.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

