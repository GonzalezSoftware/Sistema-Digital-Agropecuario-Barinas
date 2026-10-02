import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/AdminUI";
import ClockIcon from "@heroicons/react/24/solid/ClockIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import DocumentTextIcon from "@heroicons/react/24/solid/DocumentTextIcon";

export default function AdminBitacora() {
    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtroModulo, setFiltroModulo] = useState("TODOS");

    // Estados para la paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 10;

    useEffect(() => {
        fetch("/api/bitacora/")
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

    // Cada vez que cambie el filtro, regresamos a la página 1
    const manejarCambioFiltro = (e) => {
        setFiltroModulo(e.target.value);
        setPaginaActual(1);
    };

    const registrosFiltrados = registros.filter(item => {
        if (filtroModulo === "TODOS") return true;
        
        const normalizar = (texto) => 
            (texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

        return normalizar(item.modulo) === normalizar(filtroModulo);
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
        <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
                        Historial de Movimientos y Auditoría
                    </h3>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
                        Registro de acciones realizadas por los usuarios y administradores en el sistema.
                    </p>
                </div>

                {/* Filtro por Módulo */}
                <div>
                    <select
                        value={filtroModulo}
                        onChange={manejarCambioFiltro}
                        style={{
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "13px",
                            outline: "none",
                            backgroundColor: "#f8fafc",
                            cursor: "pointer"
                        }}
                    >
                        <option value="TODOS">Todos los módulos</option>
                        <option value="Noticias">Noticias</option>
                        <option value="Predios">Predios</option>
                        <option value="Produccion">Producción</option>
                    </select>
                </div>
            </div>

            {registrosFiltrados.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    <DocumentTextIcon style={{ width: "48px", height: "48px", margin: "0 auto 10px", color: "#cbd5e1" }} />
                    <p style={{ fontSize: "14px", fontWeight: "500" }}>No hay registros en la bitácora todavía.</p>
                </div>
            ) : (
                <>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
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
                                                <ClockIcon style={{ width: "14px", height: "14px", color: "#94a3b8" }} />
                                                {new Date(item.fecha_hora).toLocaleString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: "12px", fontWeight: "600" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <UserIcon style={{ width: "14px", height: "14px", color: "#136442" }} />
                                                {item.usuario}
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
                                                    item.accion === "EDITAR" ? "#854d0e" : "#991b1b"
                                            }}>
                                                {item.accion}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px", fontWeight: "500", color: "#0f172a" }}>
                                            {item.modulo}
                                        </td>
                                        <td style={{ padding: "12px", color: "#475569" }}>
                                            {item.descripcion}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Controles de Paginación */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #e2e8f0", flexWrap: "wrap", gap: "10px" }}>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>
                            Mostrando {indicePrimerRegistro + 1} - {Math.min(indiceUltimoRegistro, registrosFiltrados.length)} de {registrosFiltrados.length} registros
                        </span>
                        
                        <div style={{ display: "flex", gap: "6px" }}>
                            <button
                                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                disabled={paginaActual === 1}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #cbd5e1",
                                    backgroundColor: paginaActual === 1 ? "#f1f5f9" : "#ffffff",
                                    color: paginaActual === 1 ? "#94a3b8" : "#334155",
                                    cursor: paginaActual === 1 ? "not-allowed" : "pointer",
                                    fontSize: "13px",
                                    fontWeight: "500"
                                }}
                            >
                                Anterior
                            </button>

                            <span style={{ padding: "6px 12px", fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                                Página {paginaActual} de {totalPaginas || 1}
                            </span>

                            <button
                                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #cbd5e1",
                                    backgroundColor: (paginaActual === totalPaginas || totalPaginas === 0) ? "#f1f5f9" : "#ffffff",
                                    color: (paginaActual === totalPaginas || totalPaginas === 0) ? "#94a3b8" : "#334155",
                                    cursor: (paginaActual === totalPaginas || totalPaginas === 0) ? "not-allowed" : "pointer",
                                    fontSize: "13px",
                                    fontWeight: "500"
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