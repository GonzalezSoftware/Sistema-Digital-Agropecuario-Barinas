import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

export default function NoticiasEditarEliminar() {
    const [noticias, setNoticias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    // Cargar noticias al montar el componente
    const obtenerNoticias = async () => {
        try {
            const respuesta = await fetch("http://localhost:8000/api/noticias/");
            const datos = await respuesta.json();
            if (respuesta.ok) {
                setNoticias(datos);
            } else {
                setMensaje({ texto: "Error al cargar las noticias.", tipo: "error" });
            }
        } catch (error) {
            console.error("Error de red:", error);
            setMensaje({ texto: "Error de conexión con el servidor de Django.", tipo: "error" });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerNoticias();
    }, []);

    // Función para eliminar noticia con SweetAlert2
    const eliminarNoticia = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Estás seguro de que deseas eliminar esta noticia?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#136442",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) return;

        try {
            const respuesta = await fetch(`http://localhost:8000/api/noticias/${id}/`, {
                method: "DELETE",
            });

            if (respuesta.ok) {
                setNoticias(noticias.filter((n) => n.id !== id));

                Swal.fire({
                    icon: "success",
                    title: "¡Eliminado!",
                    text: "Noticia eliminada correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo eliminar la noticia.",
                    confirmButtonColor: "#136442"
                });
            }
        } catch (error) {
            console.error("Error de red:", error);
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor.",
                confirmButtonColor: "#136442"
            });
        }
    };

    return (
        <div style={{ background: "#ffffff", padding: "32px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>

            {mensaje.texto && (
                <div style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "14px",
                    backgroundColor: mensaje.tipo === "exito" ? "#d1fae5" : "#fee2e2",
                    color: mensaje.tipo === "exito" ? "#065f46" : "#991b1b",
                    border: `1px solid ${mensaje.tipo === "exito" ? "#a7f3d0" : "#fca5a5"}`
                }}>
                    {mensaje.texto}
                </div>
            )}

            {cargando ? (
                <p style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>Cargando noticias...</p>
            ) : noticias.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>No hay noticias registradas todavía.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {noticias.map((noticia) => (
                        <div key={noticia.id} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "16px",
                            padding: "20px",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            backgroundColor: "#f8fafc"
                        }}>
                            <div style={{ display: "flex", gap: "16px", flex: 1 }}>
                                {noticia.imagen && (
                                    <img
                                        src={noticia.imagen}
                                        alt="Noticia"
                                        style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                    />
                                )}
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>{noticia.titulo}</h4>
                                    <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: "1.4" }}>{noticia.descripcion}</p>
                                    
                                    {/* Autor de la noticia */}
                                    <span style={{ fontSize: "12px", color: "#136442", fontWeight: "600", marginTop: "2px" }}>
                                        Autor: {noticia.autor || "Redacción"}
                                    </span>

                                    <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                                        Publicado el: {new Date(noticia.fecha).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Botón de Eliminar */}
                            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                                <button
                                    onClick={() => eliminarNoticia(noticia.id)}
                                    title="Eliminar"
                                    style={{ background: "#fee2e2", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", color: "#dc2626" }}
                                >
                                    <TrashIcon style={{ width: "18px", height: "18px" }} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}