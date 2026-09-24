import React, { useState, useEffect } from "react";
import { TrashIcon, PencilSquareIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function NoticiasEditarEliminar() {
    const [noticias, setNoticias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
    
    // Estado para la noticia que se está editando actualmente
    const [noticiaEditando, setNoticiaEditando] = useState(null);
    const [nuevoTitulo, setNuevoTitulo] = useState("");
    const [nuevaDescripcion, setNuevaDescripcion] = useState("");
    const [nuevaImagen, setNuevaImagen] = useState(null);

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

    // Función para eliminar noticia
    const eliminarNoticia = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta noticia?")) return;

        try {
            const respuesta = await fetch(`http://localhost:8000/api/noticias/${id}/`, {
                method: "DELETE",
            });

            if (respuesta.ok) {
                setNoticias(noticias.filter((n) => n.id !== id));
                setMensaje({ texto: "Noticia eliminada correctamente.", tipo: "exito" });
            } else {
                setMensaje({ texto: "No se pudo eliminar la noticia.", tipo: "error" });
            }
        } catch (error) {
            console.error("Error de red:", error);
            setMensaje({ texto: "Error de conexión al eliminar.", tipo: "error" });
        }
    };

    // Activar modo edición
    const iniciarEdicion = (noticia) => {
        setNoticiaEditando(noticia.id);
        setNuevoTitulo(noticia.titulo);
        setNuevaDescripcion(noticia.descripcion);
        setNuevaImagen(null);
    };

    // Guardar cambios de edición
    const guardarEdicion = async (id) => {
        const formData = new FormData();
        formData.append("titulo", nuevoTitulo);
        formData.append("descripcion", nuevaDescripcion);
        if (nuevaImagen) {
            formData.append("imagen", nuevaImagen);
        }

        try {
            const respuesta = await fetch(`http://localhost:8000/api/noticias/${id}/`, {
                method: "PUT",
                body: formData,
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                setMensaje({ texto: "¡Noticia actualizada con éxito!", tipo: "exito" });
                setNoticiaEditando(null);
                obtenerNoticias(); // Recargar lista
            } else {
                setMensaje({ texto: resultado.error || "Error al actualizar la noticia.", tipo: "error" });
            }
        } catch (error) {
            console.error("Error de red:", error);
            setMensaje({ texto: "Error de conexión al actualizar.", tipo: "error" });
        }
    };

    return (
        <div style={{ background: "#ffffff", padding: "32px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
            <h3 style={{ color: "#136442", marginTop: 0, fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                Gestión de Artículos (Editar y Eliminar)
            </h3>
            <p style={{ color: "#475569", fontSize: "14px", marginBottom: "24px" }}>
                Aquí puedes visualizar todas las noticias registradas en la base de datos, modificarlas o eliminarlas.
            </p>

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
                            flexDirection: "column",
                            gap: "12px",
                            padding: "20px",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            backgroundColor: "#f8fafc"
                        }}>
                            {noticiaEditando === noticia.id ? (
                                /* Formulario de Edición en línea */
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <input
                                        type="text"
                                        value={nuevoTitulo}
                                        onChange={(e) => setNuevoTitulo(e.target.value)}
                                        style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                                    />
                                    <textarea
                                        value={nuevaDescripcion}
                                        onChange={(e) => setNuevaDescripcion(e.target.value)}
                                        rows={3}
                                        style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", fontFamily: "inherit" }}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setNuevaImagen(e.target.files[0])}
                                        style={{ fontSize: "13px" }}
                                    />
                                    <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                                        <button
                                            onClick={() => guardarEdicion(noticia.id)}
                                            style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#136442", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                                        >
                                            <CheckIcon style={{ width: "16px", height: "16px" }} /> Guardar
                                        </button>
                                        <button
                                            onClick={() => setNoticiaEditando(null)}
                                            style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#64748b", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                                        >
                                            <XMarkIcon style={{ width: "16px", height: "16px" }} /> Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Vista Normal de la Noticia */
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                                    <div style={{ display: "flex", gap: "16px", flex: 1 }}>
                                        {noticia.imagen && (
                                            <img
                                                src={noticia.imagen}
                                                alt="Noticia"
                                                style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                            />
                                        )}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>{noticia.titulo}</h4>
                                            <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: "1.4" }}>{noticia.descripcion}</p>
                                            <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                                                Publicado el: {new Date(noticia.fecha).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Botones de Acción */}
                                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                                        <button
                                            onClick={() => iniciarEdicion(noticia)}
                                            title="Editar"
                                            style={{ background: "#e0f2fe", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", color: "#0284c7" }}
                                        >
                                            <PencilSquareIcon style={{ width: "18px", height: "18px" }} />
                                        </button>
                                        <button
                                            onClick={() => eliminarNoticia(noticia.id)}
                                            title="Eliminar"
                                            style={{ background: "#fee2e2", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", color: "#dc2626" }}
                                        >
                                            <TrashIcon style={{ width: "18px", height: "18px" }} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}