import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/AdminUI";
import ClockIcon from "@heroicons/react/24/solid/ClockIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import DocumentTextIcon from "@heroicons/react/24/solid/DocumentTextIcon";
import ArrowDownTrayIcon from "@heroicons/react/24/solid/ArrowDownTrayIcon";
import Swal from "sweetalert2";
import { generarPDFBitacora } from "./ReporteBitacoraPDF";

export default function AdminBitacora() {
    // URL del servidor backend en AWS con HTTPS
    const API_URL = "https://3.145.179.35.nip.io/api/";

    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtroModulo, setFiltroModulo] = useState("TODOS");
    
    // Estados para fechas
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    // Fecha máxima permitida (Hoy en formato YYYY-MM-DD local)
    const obtenerFechaLocalHoy = () => {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    };
    const fechaMaxima = obtenerFechaLocalHoy();

    // Obtener la fecha del primer registro histórico de la bitácora (en formato YYYY-MM-DD)
    const obtenerFechaMinimaHistorica = () => {
        if (!registros || registros.length === 0) return "";
        const fechasTimestamps = registros.map(item => new Date(item.fecha_hora).getTime());
        const minTimestamp = Math.min(...fechasTimestamps);
        const fechaMinima = new Date(minTimestamp);
        
        const anio = fechaMinima.getFullYear();
        const mes = String(fechaMinima.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaMinima.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    };
    const fechaMinimaPermitida = obtenerFechaMinimaHistorica();

    useEffect(() => {
        fetch(`${API_URL}bitacora/`)
            .then(res => res.json())
            .then(data => {
                setRegistros(Array.isArray(data) ? data : []);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error al cargar la bitácora:", err);
                setCargando(false);
            });
    }, []);

    const manejarCambioFiltro = (e) => {
        setFiltroModulo(e.target.value);
        setPaginaActual(1);
    };

    // Validaciones robustas de fechas con SweetAlert2
    const validarFechas = (inicio, fin) => {
        const hoyStr = fechaMaxima;
        const primerRegistroStr = fechaMinimaPermitida;

        if (inicio && inicio > hoyStr) {
            Swal.fire({
                title: 'Fecha no válida',
                text: 'La fecha de inicio no puede ser posterior al día de hoy.',
                icon: 'warning',
                confirmButtonColor: '#136442'
            });
            return false;
        }

        if (fin && fin > hoyStr) {
            Swal.fire({
                title: 'Fecha no válida',
                text: 'La fecha final no puede ser posterior al día de hoy.',
                icon: 'warning',
                confirmButtonColor: '#136442'
            });
            return false;
        }

        if (inicio && primerRegistroStr && inicio < primerRegistroStr) {
            Swal.fire({
                title: 'Fecha fuera de rango',
                text: `No existen registros en la bitácora anteriores al ${primerRegistroStr.split('-').reverse().join('/')}.`,
                icon: 'warning',
                confirmButtonColor: '#136442'
            });
            return false;
        }

        if (inicio && fin && inicio > fin) {
            Swal.fire({
                title: 'Rango incorrecto',
                text: 'La fecha de inicio no puede ser posterior a la fecha final.',
                icon: 'warning',
                confirmButtonColor: '#136442'
            });
            return false;
        }

        return true;
    };

    const handleCambioFechaInicio = (e) => {
        const nuevaFecha = e.target.value;
        if (validarFechas(nuevaFecha, fechaFin)) {
            setFechaInicio(nuevaFecha);
            setPaginaActual(1);
        } else {
            e.target.value = fechaInicio;
        }
    };

    const handleCambioFechaFin = (e) => {
        const nuevaFecha = e.target.value;
        if (validarFechas(fechaInicio, nuevaFecha)) {
            setFechaFin(nuevaFecha);
            setPaginaActual(1);
        } else {
            e.target.value = fechaFin;
        }
    };

    const manejarExportarPDF = () => {
        if (!validarFechas(fechaInicio, fechaFin)) return;
        generarPDFBitacora(filtroModulo, fechaInicio, fechaFin, registros);
    };

    // Estados para la paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 10;

    // Filtrado de registros corrigiendo el desfase de zona horaria local
    const registrosFiltrados = registros.filter(item => {
        if (filtroModulo !== "TODOS") {
            const normalizar = (texto) => 
                (texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
            if (normalizar(item.modulo) !== normalizar(filtroModulo)) return false;
        }

        if (fechaInicio || fechaFin) {
            const dItem = new Date(item.fecha_hora);
            const anioI = dItem.getFullYear();
            const mesI = String(dItem.getMonth() + 1).padStart(2, '0');
            const diaI = String(dItem.getDate()).padStart(2, '0');
            const fechaItemStr = `${anioI}-${mesI}-${diaI}`;

            if (fechaInicio && fechaItemStr < fechaInicio) return false;
            if (fechaFin && fechaItemStr > fechaFin) return false;
        }

        return true;
    });

    // Cálculos de paginación
    const indiceUltimoRegistro = paginaActual * registrosPorPagina;
    const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
    const registrosPaginados = registrosFiltrados.slice(indicePrimerRegistro, indiceUltimoRegistro);
    const totalPaginas = Math.ceil(registrosFiltrados.length / registrosPorPagina);

    if (cargando) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <Spinner />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", width: "100%", boxSizing: "border-box", fontFamily: "'Poppins', sans-serif" }}>
            
            <style>{`
                .bitacora-filtros {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    flex-wrap: wrap;
                    width: 100%;
                }
                @media (max-width: 900px) {
                    .bitacora-filtros {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .bitacora-filtros select,
                    .bitacora-filtros input,
                    .bitacora-filtros button {
                        width: 100% !important;
                    }
                }
            `}</style>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "15px", width: "100%", boxSizing: "border-box" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", margin: 0, wordBreak: "break-word" }}>
                        Historial de Movimientos y Auditoría
                    </h3>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0", lineHeight: "1.4" }}>
                        Registro de acciones realizadas por los usuarios y administradores en el sistema.
                    </p>
                </div>

                {/* Filtros y Botón de Exportar PDF */}
                <div className="bitacora-filtros">
                    
                    {/* Filtro Módulo */}
                    <select
                        value={filtroModulo}
                        onChange={manejarCambioFiltro}
                        style={{
                            padding: "9px 12px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "13px",
                            outline: "none",
                            backgroundColor: "#f8fafc",
                            cursor: "pointer",
                            boxSizing: "border-box",
                            color: "#1e293b"
                        }}
                    >
                        <option value="TODOS">Todos los módulos</option>
                        <option value="Noticias">Noticias</option>
                        <option value="Predios">Predios</option>
                        <option value="Produccion">Producción</option>
                    </select>

                    {/* Fecha Desde */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%", boxSizing: "border-box" }}>
                        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", minWidth: "45px" }}>Desde:</span>
                        <input
                            type="date"
                            value={fechaInicio}
                            min={fechaMinimaPermitida}
                            max={fechaMaxima}
                            onChange={handleCambioFechaInicio}
                            style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", width: "100%", boxSizing: "border-box", color: "#1e293b" }}
                        />
                    </div>

                    {/* Fecha Hasta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%", boxSizing: "border-box" }}>
                        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", minWidth: "45px" }}>Hasta:</span>
                        <input
                            type="date"
                            value={fechaFin}
                            min={fechaMinimaPermitida}
                            max={fechaMaxima}
                            onChange={handleCambioFechaFin}
                            style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", width: "100%", boxSizing: "border-box", color: "#1e293b" }}
                        />
                    </div>

                    {/* Botón Exportar PDF */}
                    <button
                        onClick={manejarExportarPDF}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            backgroundColor: "#136442",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "9px 14px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "background 0.2s",
                            boxSizing: "border-box",
                            whiteSpace: "nowrap"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0f4d34"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#136442"}
                    >
                        <ArrowDownTrayIcon style={{ width: "16px", height: "16px", flexShrink: 0 }} />
                        <span>Exportar PDF</span>
                    </button>
                </div>
            </div>

            {registrosFiltrados.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                    <DocumentTextIcon style={{ width: "48px", height: "48px", margin: "0 auto 10px", color: "#cbd5e1" }} />
                    <p style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>No hay registros que coincidan con los filtros seleccionados.</p>
                </div>
            ) : (
                <>
                    <div style={{ overflowX: "auto", width: "100%" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px", minWidth: "650px" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#475569", backgroundColor: "#f8fafc" }}>
                                    <th style={{ padding: "12px" }}>Fecha / Hora</th>
                                    <th style={{ padding: "12px" }}>Usuario / Rol</th>
                                    <th style={{ padding: "12px" }}>Acción</th>
                                    <th style={{ padding: "12px" }}>Módulo</th>
                                    <th style={{ padding: "12px" }}>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrosPaginados.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9", color: "#334155" }}>
                                        <td style={{ padding: "12px", whiteSpace: "nowrap", color: "#64748b" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <ClockIcon style={{ width: "14px", height: "14px", color: "#94a3b8", flexShrink: 0 }} />
                                                {new Date(item.fecha_hora).toLocaleString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: "12px", fontWeight: "600" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <UserIcon style={{ width: "14px", height: "14px", color: "#136442", flexShrink: 0 }} />
                                                <span style={{ wordBreak: "break-all" }}>{item.usuario}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                            <span style={{
                                                padding: "4px 8px",
                                                borderRadius: "6px",
                                                fontSize: "11px",
                                                fontWeight: "700",
                                                backgroundColor:
                                                    item.accion === "CREAR" ? "#dcfce7" :
                                                    item.accion === "EDITAR" ? "#fef9c3" : "#fee2e2",
                                                color:
                                                    item.accion === "CREAR" ? "#166534" :
                                                    item.accion === "EDITAR" ? "#854d0e" : "#991b1b",
                                                whiteSpace: "nowrap",
                                                display: "inline-block"
                                            }}>
                                                {item.accion}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px", fontWeight: "500", color: "#0f172a", whiteSpace: "nowrap" }}>
                                            {item.modulo}
                                        </td>
                                        <td style={{ padding: "12px", color: "#475569", wordBreak: "break-word" }}>
                                            {item.descripcion}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Controles de Paginación */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #e2e8f0", flexWrap: "wrap", gap: "12px", width: "100%", boxSizing: "border-box" }}>
                        <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                            Mostrando {indicePrimerRegistro + 1} - {Math.min(indiceUltimoRegistro, registrosFiltrados.length)} de {registrosFiltrados.length} registros
                        </span>
                        
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <button
                                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                disabled={paginaActual === 1}
                                style={{
                                    padding: "7px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    backgroundColor: paginaActual === 1 ? "#f1f5f9" : "#ffffff",
                                    color: paginaActual === 1 ? "#94a3b8" : "#334155",
                                    cursor: paginaActual === 1 ? "not-allowed" : "pointer",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    fontFamily: "'Poppins', sans-serif"
                                }}
                            >
                                Anterior
                            </button>

                            <span style={{ padding: "6px 8px", fontSize: "12.5px", fontWeight: "600", color: "#1e293b", whiteSpace: "nowrap" }}>
                                Pág. {paginaActual} de {totalPaginas || 1}
                            </span>

                            <button
                                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                                style={{
                                    padding: "7px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    backgroundColor: (paginaActual === totalPaginas || totalPaginas === 0) ? "#f1f5f9" : "#ffffff",
                                    color: (paginaActual === totalPaginas || totalPaginas === 0) ? "#94a3b8" : "#334155",
                                    cursor: (paginaActual === totalPaginas || totalPaginas === 0) ? "not-allowed" : "pointer",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    fontFamily: "'Poppins', sans-serif"
                                }}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}