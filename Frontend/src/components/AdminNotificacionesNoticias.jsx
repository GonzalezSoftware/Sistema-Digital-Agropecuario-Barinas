import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/AdminUI";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import DocumentTextIcon from "@heroicons/react/24/solid/DocumentTextIcon";
import Swal from "sweetalert2"; // <--- 1. Importar SweetAlert2

export default function NotificacionesNoticias({ onActualizarConteo }) { // <--- 1. Recibe la prop aquí
    const [pendientes, setPendientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    const cargarPendientes = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/noticias/pendientes/");
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
            const res = await fetch(`http://localhost:8000/api/noticias/pendientes/${id}/resolver/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion, usuario: "Administrador" })
            });

            const data = await res.json();
            
            if (res.ok) {
                // 👇 Actualizamos el contador antes de mostrar la alerta final si es necesario
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
                    // 🔄 Recarga la página automáticamente después de que se oculte el SweetAlert
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
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                Noticias Propuestas por Empleados
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
                Revisa la información enviada antes de publicarla oficialmente en el sistema.
            </p>

            {mensaje.texto && (
                <div style={{
                    padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px",
                    backgroundColor: mensaje.tipo === "exito" ? "#d1fae5" : "#fee2e2",
                    color: mensaje.tipo === "exito" ? "#065f46" : "#991b1b"
                }}>
                    {mensaje.texto}
                </div>
            )}

            {pendientes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    <DocumentTextIcon style={{ width: "48px", height: "48px", margin: "0 auto 10px", color: "#cbd5e1" }} />
                    <p style={{ fontSize: "14px" }}>No hay noticias pendientes por revisar.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {pendientes.map((item) => (
                        <div key={item.id} style={{
                            display: "flex", flexDirection: "column", gap: "12px",
                            padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#136442", backgroundColor: "#dcfce7", padding: "2px 8px", borderRadius: "4px" }}>
                                        Enviado por: {item.empleado}
                                    </span>
                                    <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "8px 0 4px 0" }}>
                                        {item.titulo}
                                    </h4>
                                </div>
                                <span style={{ fontSize: "12px", color: "#64748b" }}>
                                    {new Date(item.fecha).toLocaleString()}
                                </span>
                            </div>

                            <p style={{ fontSize: "14px", color: "#475569", margin: 0, whiteSpace: "pre-wrap" }}>
                                {item.descripcion}
                            </p>

                            {item.imagen && (
                                <div>
                                    <img src={item.imagen} alt="Ilustración propuesta" style={{ maxHeight: "150px", borderRadius: "6px", objectFit: "cover" }} />
                                </div>
                            )}

                            <div style={{ display: "flex", gap: "10px", marginTop: "8px", justifyContent: "flex-end" }}>
                                <button
                                    onClick={() => manejarAccion(item.id, "rechazar")}
                                    style={{
                                        backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5",
                                        padding: "8px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                                        display: "flex", alignItems: "center", gap: "6px"
                                    }}
                                >
                                    <XCircleIcon style={{ width: "16px", height: "16px" }} /> Rechazar
                                </button>
                                <button
                                    onClick={() => manejarAccion(item.id, "aprobar")}
                                    style={{
                                        backgroundColor: "#136442", color: "#ffffff", border: "none",
                                        padding: "8px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                                        display: "flex", alignItems: "center", gap: "6px"
                                    }}
                                >
                                    <CheckCircleIcon style={{ width: "16px", height: "16px" }} /> Aceptar y Publicar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}