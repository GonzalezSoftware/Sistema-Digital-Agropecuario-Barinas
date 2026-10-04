import React, { useState } from "react";
import Swal from "sweetalert2"; // <--- 1. Importar SweetAlert2

export default function NoticiasRegistrar() {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titulo.trim() || !descripcion.trim()) {
            setMensaje({ texto: "Por favor, completa el título y la descripción.", tipo: "error" });
            return;
        }

        // 2. Mostrar alerta de carga con SweetAlert2
        Swal.fire({
            title: "Enviando noticia...",
            text: "Por favor, espera un momento.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setCargando(true);
        setMensaje({ texto: "", tipo: "" });

        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descripcion", descripcion);
        if (imagen) {
            formData.append("imagen", imagen);
        }

        try {
            const respuesta = await fetch("http://localhost:8000/api/noticias/pendientes/", {
                method: "POST",
                body: formData,
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                // 3. Mostrar alerta de éxito y recargar al terminar
                Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    text: "¡Noticia enviada al administrador para revisión!",
                    timer: 2500,
                    showConfirmButton: false
                }).then(() => {
                    // 🔄 Recarga la página automáticamente después de la alerta
                    window.location.reload();
                });

                setMensaje({ texto: "¡Noticia enviada al administrador para revisión!", tipo: "exito" });
                setTitulo("");
                setDescripcion("");
                setImagen(null);
                const inputImg = document.getElementById("input-imagen");
                if (inputImg) inputImg.value = "";
            } else {
                // Mostrar alerta de error del servidor
                Swal.fire({
                    icon: "error",
                    title: "Atención",
                    text: resultado.error || "Hubo un error al registrar la noticia."
                });
                setMensaje({ texto: resultado.error || "Hubo un error al registrar la noticia.", tipo: "error" });
            }
        } catch (error) {
            console.error("Error de red:", error);
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "Error de conexión con el servidor de Django."
            });
            setMensaje({ texto: "Error de conexión con el servidor de Django.", tipo: "error" });
        } finally {
            setCargando(false);
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

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Campo Título */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                        Título de la Noticia
                    </label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ej: Jornada extraordinaria de registro agropecuario..."
                        style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "14px",
                            outline: "none",
                            transition: "border-color 0.2s"
                        }}
                        required
                    />
                </div>

                {/* Campo Descripción */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                        Contenido / Descripción
                    </label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Redacta los detalles del comunicado oficial aquí..."
                        rows={5}
                        style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "14px",
                            outline: "none",
                            resize: "vertical",
                            fontFamily: "inherit"
                        }}
                        required
                    />
                </div>

                {/* Campo Imagen */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                        Imagen Ilustrativa
                    </label>

                    <input
                        id="input-imagen"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImagen(e.target.files[0])}
                        style={{ display: "none" }}
                    />

                    <label
                        htmlFor="input-imagen"
                        style={{
                            backgroundColor: "#f0fdf4",
                            color: "#136442",
                            border: "1px solid #136442",
                            padding: "8px 14px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "500",
                            fontFamily: "Poppins, sans-serif",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            width: "fit-content",
                            textAlign: "center",
                            transition: "background-color 0.2s"
                        }}
                    >
                        Seleccionar Imagen
                    </label>

                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {imagen ? `Archivo seleccionado: ${imagen.name}` : "Formatos aceptados: JPG, PNG, WEBP."}
                    </span>
                </div>

                {/* Botón de Enviar */}
                <button
                    type="submit"
                    disabled={cargando}
                    style={{
                        backgroundColor: "#136442",
                        color: "#ffffff",
                        padding: "14px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: cargando ? "not-allowed" : "pointer",
                        opacity: cargando ? 0.7 : 1,
                        transition: "background 0.2s",
                        marginTop: "10px"
                    }}
                >
                    {cargando ? "Publicando..." : "Publicar Noticia"}
                </button>
            </form>
        </div>
    );
}