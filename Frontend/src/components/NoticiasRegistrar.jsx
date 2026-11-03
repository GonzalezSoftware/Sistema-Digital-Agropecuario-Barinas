import React, { useState } from "react";
import Swal from "sweetalert2";

export default function NoticiasRegistrar() {
    const API_URL = "https://3.145.179.35.nip.io/api/";

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [autor, setAutor] = useState("");
    const [imagen, setImagen] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    const manejarSeleccionImagen = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const LIMITE_MAXIMO = 1 * 1024 * 1024;

        if (archivo.size <= LIMITE_MAXIMO) {
            setImagen(archivo);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(archivo);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                const MAX_DIMENSION = 1200;
                if (width > height && width > MAX_DIMENSION) {
                    height = Math.round((height * MAX_DIMENSION) / width);
                    width = MAX_DIMENSION;
                } else if (height > MAX_DIMENSION) {
                    width = Math.round((width * MAX_DIMENSION) / height);
                    height = MAX_DIMENSION;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            Swal.fire({
                                icon: "error",
                                title: "Error al procesar",
                                text: "No se pudo procesar la imagen seleccionada.",
                                confirmButtonColor: "#136442"
                            });
                            e.target.value = "";
                            setImagen(null);
                            return;
                        }

                        if (blob.size > LIMITE_MAXIMO) {
                            Swal.fire({
                                icon: "warning",
                                title: "Imagen demasiado pesada",
                                text: `Incluso tras comprimirla, la imagen supera 1 MB (${(blob.size / (1024 * 1024)).toFixed(2)} MB). Por favor, selecciona una foto más pequeña.`,
                                confirmButtonColor: "#136442"
                            });
                            e.target.value = "";
                            setImagen(null);
                            return;
                        }

                        const archivoComprimido = new File([blob], archivo.name.replace(/\.[^/.]+$/, ".jpg"), {
                            type: "image/jpeg",
                            lastModified: Date.now(),
                        });

                        setImagen(archivoComprimido);
                    },
                    "image/jpeg",
                    0.70
                );
            };
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titulo.trim() || !descripcion.trim()) {
            setMensaje({ texto: "Por favor, completa el título y la descripción.", tipo: "error" });
            return;
        }

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
        formData.append("autor", autor || "Redacción");
        if (imagen) {
            formData.append("imagen", imagen);
        }

        try {
            const respuesta = await fetch(`${API_URL}noticias/pendientes/`, {
                method: "POST",
                body: formData,
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    text: "¡Noticia enviada al administrador para revisión!",
                    timer: 2500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.reload();
                });

                setMensaje({ texto: "¡Noticia enviada al administrador para revisión!", tipo: "exito" });
                setTitulo("");
                setDescripcion("");
                setAutor("");
                setImagen(null);
                const inputImg = document.getElementById("input-imagen");
                if (inputImg) inputImg.value = "";
            } else {
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
                text: "Error de conexión con el servidor de AWS."
            });
            setMensaje({ texto: "Error de conexión con el servidor de AWS.", tipo: "error" });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", width: "100%", boxSizing: "border-box" }}>
            
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

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%", boxSizing: "border-box" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                        Título de la Noticia
                    </label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ej: Jornada extraordinaria..."
                        style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", width: "100%", boxSizing: "border-box" }}
                        required
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                        Autor / Fuente
                    </label>
                    <input
                        type="text"
                        value={autor}
                        onChange={(e) => setAutor(e.target.value)}
                        placeholder="Ej: Dirección Estadal..."
                        style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", width: "100%", boxSizing: "border-box" }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                        Contenido / Descripción
                    </label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Redacta los detalles del comunicado..."
                        rows={5}
                        style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", resize: "vertical", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
                        required
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                        Imagen Ilustrativa
                    </label>
                    <input
                        id="input-imagen"
                        type="file"
                        accept="image/*"
                        onChange={manejarSeleccionImagen}
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
                            fontSize: "12px",
                            fontWeight: "500",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            width: "fit-content"
                        }}
                    >
                        Seleccionar Imagen
                    </label>
                    <span style={{ fontSize: "11px", color: "#64748b", wordBreak: "break-word" }}>
                        {imagen ? `Archivo listo: ${imagen.name} (${(imagen.size / 1024).toFixed(0)} KB)` : "Formatos aceptados: JPG, PNG, WEBP (Máx. 1 MB)."}
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={cargando}
                    style={{
                        backgroundColor: "#136442",
                        color: "#ffffff",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: cargando ? "not-allowed" : "pointer",
                        opacity: cargando ? 0.7 : 1,
                        marginTop: "10px",
                        width: "100%",
                        boxSizing: "border-box"
                    }}
                >
                    {cargando ? "Publicando..." : "Publicar Noticia"}
                </button>
            </form>
        </div>
    );
}