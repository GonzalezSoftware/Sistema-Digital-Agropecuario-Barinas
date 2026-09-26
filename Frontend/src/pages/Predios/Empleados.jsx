import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import escudo from "../../assets/logo2.jpg";
import logo from "../../assets/gobierno.jpg";

// Hook con los datos y estados globales ya definidos
import { useDashboardProduccion } from "../../hooks/useProduccion";

// Components
import AdminProduccionDashboard from "../../components/AdminProduccionDashboard";
import AdminProduccionSeleccionarPredio from "../../components/SeleccionPredio";
import FormHierro from "../../components/FormHierro"; // 🔹 Componente de Licencia de Hierro
import FormCaracterizacion from "../../components/FormCaracterizacion";
import SeccionReportes from "../../components/SeccionReportes"; 
import { EmpleadoHeader } from '../../components/EmpleadoHeader';
import { EmpleadoSidebar } from '../../components/EmpleadoSidebar';

const Spinner = ({ color }) => (
    <div style={{ width: "30px", height: "30px", border: `3px solid ${color}33`, borderTop: `3px solid ${color}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
);

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

export default function EmpleadoDashboard() {
    const navigate = useNavigate();
    const [vistaActiva, setVistaActiva] = useState("inicio");

    // 🔹 Consumimos todo del hook, incluyendo las propiedades de la licencia de hierro
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
        setPredioSeleccionado,
        setMostrarModal,
        mostrarModal,
        predioSeleccionado,
        generarPDFPredio,
        listaPredios, 
        rubrosVegetales,
        setRubrosVegetales,
        inventarioInicial,
        setInventarioInicial,
        subCaracterizacion,
        setSubCaracterizacion,
        setTabActiva,
        // Variables de Licencia de Hierro extraídas del hook
        licenciaHierro,
        setLicenciaHierro,
        guardarLicencia
    } = useDashboardProduccion();

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

                <main style={{ padding: "26px 50px", flex: 1, boxSizing: "border-box", overflowY: "auto" }}>
                    <EmpleadoHeader vistaActiva={vistaActiva} escudo={escudo} gobierno={logo} />

                    {vistaActiva === "inicio" ? (
                        <div>
                            <h2>Panel General - Municipio {municipioEmpleado || "Asignado"}</h2>
                            <p>Resumen de predios y superficies registrados en tu jurisdicción.</p>
                        </div>
                    ) : vistaActiva === "produccion_inicio" ? (
                        <div>
                            <div style={{ marginBottom: "20px" }}>
                                <h2 style={{ color: "#1e293b", fontSize: "22px", fontWeight: "700" }}>
                                    Dashboard de Producción - Municipio {municipioEmpleado || "Asignado"}
                                </h2>
                                <p style={{ color: "#64748b", fontSize: "14px" }}>
                                    Visualización de indicadores productivos y pecuarios del municipio asignado.
                                </p>
                            </div>

                            <AdminProduccionDashboard
                                productionState={{
                                    cargando: cargando,
                                    statsProduccion: statsProduccion
                                }}
                            />
                        </div>
                    ) : vistaActiva === "produccion_seleccionar_predio" ? (
                        <div>
                            <div style={{ marginBottom: "20px" }}>
                                <h2 style={{ color: "#1e293b", fontSize: "22px", fontWeight: "700" }}>
                                    Seleccionar Predio - Municipio {municipioEmpleado || "Asignado"}
                                </h2>
                                <p style={{ color: "#64748b", fontSize: "14px" }}>
                                    Busca y selecciona el predio con el que deseas trabajar en las siguientes pestañas de caracterización.
                                </p>
                            </div>

                            <AdminProduccionSeleccionarPredio
                                busquedaCedula={busquedaCedula}
                                setBusquedaCedula={setBusquedaCedula}
                                cargando={cargando}
                                filtrarPredios={filtrarPredios} 
                                predioActivo={predioActivo}
                                setPredioActivo={setPredioActivo}
                                setPredioSeleccionado={setPredioSeleccionado}
                                setMostrarModal={setMostrarModal}
                                mostrarModal={mostrarModal}
                                predioSeleccionado={predioSeleccionado}
                                generarPDFPredio={generarPDFPredio}
                                InputField={InputField}
                                Spinner={Spinner}
                            />
                        </div>
                    ) : vistaActiva === "produccion_caracterizacion" ? (
                        <div>
                            <div style={{ marginBottom: "20px" }}>
                                <h2 style={{ color: "#1e293b", fontSize: "22px", fontWeight: "700" }}>
                                    Caracterización Productiva - Municipio {municipioEmpleado || "Asignado"}
                                </h2>
                                <p style={{ color: "#64748b", fontSize: "14px" }}>
                                    Predio activo actual: <strong style={{ color: "#136442" }}>{predioActivo?.nombre_predio || "Ninguno seleccionado"}</strong>
                                </p>
                            </div>

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
                        </div>
                    ) : vistaActiva === "produccion_hierro" ? (
                        /* 🔹 Vista Integrada de Licencia de Hierro */
                        <div>
                            <div style={{ marginBottom: "20px" }}>
                                <h2 style={{ color: "#1e293b", fontSize: "22px", fontWeight: "700" }}>
                                    Licencia de Hierro Ganadero — Municipio {municipioEmpleado || "Asignado"}
                                </h2>
                                <p style={{ color: "#64748b", fontSize: "14px" }}>
                                    Predio activo actual: <strong style={{ color: "#136442" }}>{predioActivo?.nombre_predio || "Ninguno seleccionado"}</strong>
                                </p>
                            </div>

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
                            <h3>Actualización Productiva - Municipio {municipioEmpleado}</h3>
                        </div>
                    ) : vistaActiva === "produccion_reportes" ? (
                        <div>
                            <div style={{ marginBottom: "20px" }}>
                                <h2 style={{ color: "#1e293b", fontSize: "22px", fontWeight: "700" }}>
                                    Reportes y Fichas Técnicas — Municipio {municipioEmpleado || "Asignado"}
                                </h2>
                                <p style={{ color: "#64748b", fontSize: "14px" }}>
                                    Generación de fichas técnicas en PDF para los predios registrados en tu jurisdicción.
                                </p>
                            </div>

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