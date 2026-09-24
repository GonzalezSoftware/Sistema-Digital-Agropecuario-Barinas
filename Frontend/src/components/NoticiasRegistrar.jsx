import React, { useState } from "react";

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

        setCargando(true);
        setMensaje({ texto: "", tipo: "" });

        // FormData es obligatorio para enviar archivos e imágenes hacia Django
        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descripcion", descripcion);
        if (imagen) {
            formData.append("imagen", imagen);
        }

        try {
            // URL de tu API en Django (ajusta el puerto si es necesario, ej: 8000)
            const respuesta = await fetch("http://localhost:8000/api/noticias/", {
                method: "POST",
                body: formData,
                // Nota: No incluyas 'Content-Type': 'multipart/form-data' manualmente en los headers,
                // el navegador lo calcula y añade el boundary por sí solo al usar FormData.
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                setMensaje({ texto: "¡Noticia registrada y publicada con éxito en la base de datos!", tipo: "exito" });
                setTitulo("");
                setDescripcion("");
                setImagen(null);
                document.getElementById("input-imagen").value = "";
            } else {
                setMensaje({ texto: resultado.error || "Hubo un error al registrar la noticia.", tipo: "error" });
            }
        } catch (error) {
            console.error("Error de red:", error);
            setMensaje({ texto: "Error de conexión con el servidor de Django.", tipo: "error" });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ background: "#ffffff", padding: "32px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
            <h3 style={{ color: "#136442", marginTop: 0, fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                Registrar Nueva Noticia
            </h3>
            <p style={{ color: "#475569", fontSize: "14px", marginBottom: "24px" }}>
                Completa los campos a continuación para publicar un comunicado oficial en el sistema.
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
                        style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px dashed #cbd5e1",
                            fontSize: "14px",
                            backgroundColor: "#f8fafc",
                            cursor: "pointer"
                        }}
                    />
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Formatos aceptados: JPG, PNG, WEBP.
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
                        fontSize: "15px",
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