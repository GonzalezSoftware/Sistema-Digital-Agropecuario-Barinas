import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

export default function NoticiasEditarEliminar() {
    const API_URL = "https://3.145.179.35.nip.io/api/";

    const [noticias, setNoticias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    const obtenerNoticias = async () => {
        try {
            const respuesta = await fetch(`${API_URL}noticias/`);
            const datos = await respuesta.json();
            if (respuesta.ok) {
                setNoticias(datos);
            } else {
                setMensaje({ texto: "Error al cargar las noticias.", tipo: "error" });
            }
        } catch (error) {
            console.error("Error de red:", error);
            setMensaje({ texto: "Error de conexión con el servidor.", tipo: "error" });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerNoticias();
    }, []);

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
            const respuesta = await fetch(`${API_URL}noticias/${id}/`, {
                method: "DELETE",
            });

            if (respuesta.ok) {
                Swal.fire({
                    icon: "success",
                    title: "¡Eliminado!",
                    text: "Noticia eliminada correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.reload();
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
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", width: "100%", boxSizing: "border-box" }}>
            <style>{`
                .noticia-card-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 16px;
                    borderRadius: 10px;
                    border: 1px solid #e2e8f0;
                    backgroundColor: #f8fafc;
                    width: 100%;
                    box-sizing: border-box;
                }
                @media (max-width: 768px) {
                    .noticia-card-item {
                        flex-direction: column !important;
                        align-items: stretch !important;
                    }
                    .noticia-card-item img {
                        width: 100% !important;
                        height: 160px !important;
                    }
                }
            `}</style>

            {mensaje.texto && (
                <div style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "13px",
                    backgroundColor: mensaje.tipo === "exito" ? "#d1fae5" : "#fee2e2",
                    color: mensaje.tipo === "exito" ? "#065f46" : "#991b1b",
                    border: `1px solid ${mensaje.tipo === "exito" ? "#a7f3d0" : "#fca5a5"}`,
                    wordBreak: "break-word"
                }}>
                    {mensaje.texto}
                </div>
            )}

            {cargando ? (
                <p style={{ textAlign: "center", color: "#64748b", padding: "20px", fontSize: "13px" }}>Cargando noticias...</p>
            ) : noticias.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b", padding: "20px", fontSize: "13px" }}>No hay noticias registradas todavía.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", boxSizing: "border-box" }}>
                    {noticias.map((noticia) => (
                        <div key={noticia.id} className="noticia-card-item">
                            <div style={{ display: "flex", gap: "14px", flex: 1, minWidth: 0, flexDirection: "row" }} className="noticia-inner-content">
                                {noticia.imagen && (
                                    <img
                                        src={noticia.imagen}
                                        alt="Noticia"
                                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #cbd5e1", flexShrink: 0 }}
                                    />
                                )}
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: 0 }}>
                                    <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#1e293b", wordBreak: "break-word" }}>{noticia.titulo}</h4>
                                    <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.4", wordBreak: "break-word" }}>{noticia.descripcion}</p>
                                    
                                    <span style={{ fontSize: "11px", color: "#136442", fontWeight: "600", marginTop: "2px" }}>
                                        Autor: {noticia.autor || "Redacción"}
                                    </span>

                                    <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                                        Publicado el: {new Date(noticia.fecha).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Botón de Eliminar */}
                            <div style={{ display: "flex", gap: "8px", flexShrink: 0, alignSelf: "flex-end" }}>
                                <button
                                    onClick={() => eliminarNoticia(noticia.id)}
                                    title="Eliminar"
                                    style={{ background: "#fee2e2", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", color: "#dc2626", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "500" }}
                                >
                                    <TrashIcon style={{ width: "16px", height: "16px" }} />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}