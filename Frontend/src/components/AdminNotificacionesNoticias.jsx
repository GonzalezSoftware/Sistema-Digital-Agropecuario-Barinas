import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/AdminUI";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import DocumentTextIcon from "@heroicons/react/24/solid/DocumentTextIcon";
import Swal from "sweetalert2";

export default function NotificacionesNoticias({ onActualizarConteo }) {
    // URL del servidor backend en AWS con HTTPS
    const API_URL = "https://3.145.179.35.nip.io/api/";

    const [pendientes, setPendientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    const cargarPendientes = async () => {
        try {
            const res = await fetch(`${API_URL}noticias/pendientes/`);
            const data = await res.json();
            setPendientes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al cargar notificaciones:", err);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarPendientes();
    }, []);

    const manejarAccion = async (id, accion) => {
        const esAprobar = accion === "aprobar";
        
        Swal.fire({
            title: esAprobar ? "Publicando noticia..." : "Rechazando noticia...",
            text: "Por favor, espera un momento.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const res = await fetch(`${API_URL}noticias/pendientes/${id}/resolver/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion, usuario: "Administrador" })
            });

            const data = await res.json();
            
            if (res.ok) {
                if (onActualizarConteo) {
                    onActualizarConteo();
                }

                Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    text: data.mensaje,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.reload();
                });

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Atención",
                    text: data.error || "Error al procesar la solicitud"
                });
            }
        } catch (error) {
            console.error("Error de red:", error);
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor."
            });
        }
    };

    if (cargando) {
        return <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}><Spinner /></div>;
    }

    return (
        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", width: "100%", boxSizing: "border-box", fontFamily: "'Poppins', sans-serif" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>
                Noticias Propuestas por Empleados
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "18px", lineHeight: "1.4" }}>
                Revisa la información enviada antes de publicarla oficialmente en el sistema.
            </p>

            {mensaje.texto && (
                <div style={{
                    padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px",
                    backgroundColor: mensaje.tipo === "exito" ? "#d1fae5" : "#fee2e2",
                    color: mensaje.tipo === "exito" ? "#065f46" : "#991b1b",
                    boxSizing: "border-box"
                }}>
                    {mensaje.texto}
                </div>
            )}

            {pendientes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                    <DocumentTextIcon style={{ width: "48px", height: "48px", margin: "0 auto 10px", color: "#cbd5e1" }} />
                    <p style={{ fontSize: "14px", margin: 0 }}>No hay noticias pendientes por revisar.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", boxSizing: "border-box" }}>
                    {pendientes.map((item) => (
                        <div key={item.id} style={{
                            display: "flex", flexDirection: "column", gap: "12px",
                            padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc",
                            boxSizing: "border-box", width: "100%"
                        }}>
                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: 0, flex: 1 }}>
                                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#136442", backgroundColor: "#dcfce7", padding: "2px 8px", borderRadius: "4px", width: "fit-content" }}>
                                        Enviado por: {item.empleado}
                                    </span>
                                    <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "4px 0 0 0", wordBreak: "break-word" }}>
                                        {item.titulo}
                                    </h4>
                                </div>
                                <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>
                                    {new Date(item.fecha).toLocaleString()}
                                </span>
                            </div>

                            <p style={{ fontSize: "13.5px", color: "#475569", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: "1.4" }}>
                                {item.descripcion}
                            </p>

                            {/* Campo de Autor añadido */}
                            <div>
                                <span style={{ fontSize: "12px", color: "#136442", fontWeight: "600" }}>
                                    Autor: {item.autor || "Redacción"}
                                </span>
                            </div>

                            {item.imagen && (
                                <div style={{ 
                                    width: "100%", 
                                    height: "260px", 
                                    background: "#0f172a", 
                                    overflow: "hidden", 
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <img 
                                        src={item.imagen} 
                                        alt="Ilustración propuesta" 
                                        style={{ 
                                            width: "100%", 
                                            height: "100%", 
                                            objectFit: "cover", 
                                            display: "block" 
                                        }} 
                                    />
                                </div>
                            )}

                            <div style={{ display: "flex", gap: "10px", marginTop: "6px", justifyContent: "flex-end", flexWrap: "wrap", width: "100%", boxSizing: "border-box" }}>
                                <button
                                    onClick={() => manejarAccion(item.id, "rechazar")}
                                    style={{
                                        backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5",
                                        padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                                        display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Poppins', sans-serif"
                                    }}
                                >
                                    <XCircleIcon style={{ width: "16px", height: "16px", flexShrink: 0 }} /> Rechazar
                                </button>
                                <button
                                    onClick={() => manejarAccion(item.id, "aprobar")}
                                    style={{
                                        backgroundColor: "#136442", color: "#ffffff", border: "none",
                                        padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                                        display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Poppins', sans-serif"
                                    }}
                                >
                                    <CheckCircleIcon style={{ width: "16px", height: "16px", flexShrink: 0 }} /> Aceptar y Publicar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}