import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import escudo from "../../assets/logo2.jpg";
import logo from "../../assets/gobierno.jpg"; // <-- 1. Importado aquí

// Hooks
import { useEstadisticasPredios } from "../../hooks/useEstadisticasPredios";

// Components
import DashboardEmpleado from '../../components/EmpleadoDashboard';
import { EmpleadoHeader } from '../../components/EmpleadoHeader';
import { EmpleadoSidebar } from '../../components/EmpleadoSidebar';

// Estilos UI
import {
    estiloInput, estiloBoton, InputField, Spinner, CardStat,
    chartCard, chartTitle, chartPlaceholder, avatarWrapper
} from "../../components/ui/AdminUI";

// Importación de iconos
import PresentationChartBarIcon from "@heroicons/react/24/solid/PresentationChartBarIcon";
import PowerIcon from "@heroicons/react/24/solid/PowerIcon";

export default function EmpleadoDashboard() {
    const navigate = useNavigate();
    const [empleadoData, setEmpleadoData] = useState(null);
    const [vistaActiva, setVistaActiva] = useState("inicio");

    const [cargando, setCargando] = useState(false);
    const [listaPredios, setListaPredios] = useState([]);

    // 1. Cargar datos generales de predios
    useEffect(() => {
        setCargando(true);
        fetch("/api/predios/")
            .then(res => res.json())
            .then(data => {
                setListaPredios(Array.isArray(data) ? data : data.results || []);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error al cargar los datos:", err);
                setCargando(false);
            });
    }, []);

    // 2. Obtener sesión del empleado y limpiar datos si aplica
    useEffect(() => {
        const sesion = sessionStorage.getItem("usuario_predios");
        if (!sesion) {
            navigate("/predios/login");
            return;
        }
        
        const usuarioParseado = JSON.parse(sesion);

        if (usuarioParseado.nombre) {
            usuarioParseado.nombre = usuarioParseado.nombre.replace(/admin/gi, "").trim();
            if (!usuarioParseado.nombre) usuarioParseado.nombre = "Funcionario Autorizado";
        }
        
        if (usuarioParseado.usuario) {
            usuarioParseado.usuario = usuarioParseado.usuario.replace(/admin/gi, "").trim();
            if (!usuarioParseado.usuario) usuarioParseado.usuario = "Funcionario Autorizado";
        }

        setEmpleadoData(usuarioParseado);
    }, [navigate]);

    // 3. Filtrar los predios según el municipio asignado al empleado 
    const nombreMunicipioAsignado = empleadoData?.municipio || empleadoData?.municipio_asignado || "Municipio Asignado";
    
    const prediosDelMunicipio = listaPredios.filter(p => 
        p.municipio?.toLowerCase() === nombreMunicipioAsignado.toLowerCase()
    );

    // 4. Calcular métricas exclusivas para este municipio filtrado
    const totalPrediosMunicipio = prediosDelMunicipio.length;
    const superficieTotalMunicipio = prediosDelMunicipio.reduce((acc, p) => acc + (parseFloat(p.superficie) || 0), 0);

    const estadisticasMunicipio = useEstadisticasPredios(prediosDelMunicipio);

    const cerrarSesion = () => {
        sessionStorage.removeItem("usuario_predios");
        navigate("/predios/login"); 
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", fontFamily: "'Poppins', sans-serif" }}>

            {/* ── CONTENEDOR PRINCIPAL ── */}
            <div style={{ display: "flex", flex: 1 }}>

                <EmpleadoSidebar
                    empleadoData={empleadoData}
                    vistaActiva={vistaActiva}
                    setVistaActiva={setVistaActiva}
                    cerrarSesion={cerrarSesion}
                    PresentationChartBarIcon={PresentationChartBarIcon}
                    PowerIcon={PowerIcon}
                />

                {/* ── CONTENIDO PRINCIPAL DERECHO DINÁMICO ── */}
                <main style={{ padding: "26px 50px", flex: 1, boxSizing: "border-box", overflowY: "auto" }}>

                    {/* Pasamos 'logo' (gobierno.jpg) al Header junto con el escudo */}
                    <EmpleadoHeader vistaActiva={vistaActiva} escudo={escudo} gobierno={logo} />

                    {vistaActiva === "inicio" ? (
                        <DashboardEmpleado
                            cargando={cargando}
                            totalPrediosMunicipio={totalPrediosMunicipio}
                            superficieTotalMunicipio={superficieTotalMunicipio}
                            nombreMunicipio={nombreMunicipioAsignado}
                            listaPredios={prediosDelMunicipio}
                            datosTenencia={estadisticasMunicipio.datosTenencia}
                            datosServicios={estadisticasMunicipio.datosServicios}
                            datosVialidad={estadisticasMunicipio.datosVialidad}
                            datosDispersion={estadisticasMunicipio.datosDispersion}
                            datosLegales={estadisticasMunicipio.datosLegales}
                            chartCard={chartCard}
                            chartTitle={chartTitle}
                            chartPlaceholder={chartPlaceholder}
                        />
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