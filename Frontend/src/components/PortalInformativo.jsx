import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function PortalInformativo() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null); // Estado para el modal

  useEffect(() => {
    fetch("http://localhost:8000/api/noticias/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNoticias(data);
        }
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al cargar las noticias para el portal:", error);
        setCargando(false);
      });
  }, []);

  const navButtonStyle = (side) => ({
    position: "absolute",
    [side === "left" ? "left" : "right"]: "-20px",
    zIndex: 10,
    background: "#589e38",
    color: "#fff",
    border: "none",
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    fontSize: "20px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
    transition: "all 0.2s ease"
  });

  return (
    <>
      <div id="portal-informativo" style={{ padding: "80px 20px", background: "#f8faf9" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>

          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ color: "#1b4332", fontSize: "32px" }}>Noticias del Sector Agropecuario</h2>
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

            {/* BOTÓN IZQUIERDA */}
            <button style={navButtonStyle("left")}> &lt; </button>

            {/* CONTENEDOR DE NOTICIAS */}
            <div style={{
              display: "flex",
              gap: "25px",
              overflowX: "auto",
              padding: "40px 10px",
              width: "100%",
              maxWidth: "1010px",
              margin: "0 auto",
              justifyContent: noticias.length > 0 ? "flex-start" : "center"
            }}>
              {cargando ? (
                <p style={{ textAlign: "center", color: "#64748b", width: "100%" }}>Cargando noticias recientes...</p>
              ) : noticias.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b", width: "100%" }}>No hay noticias disponibles en este momento.</p>
              ) : (
                noticias.map((item) => (
                  <div 
                    key={item.id} 
                    className="tarjeta-noticia" 
                    onClick={() => setNoticiaSeleccionada(item)} // Abre el modal al hacer clic
                    style={{
                      minWidth: "320px",
                      maxWidth: "320px",
                      background: "#fff",
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                      transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      cursor: "pointer"
                    }}
                  >
                    {/* Contenedor de la Imagen: Se usa background oscuro para que si la imagen es vertical u horizontal, se vea completa */}
                    {item.imagen ? (
                      <div style={{ height: "190px", width: "100%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        <img 
                          src={item.imagen} 
                          alt={item.titulo} 
                          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} 
                        />
                      </div>
                    ) : (
                      <div style={{ height: "190px", background: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: "12px" }}>
                        Sin imagen
                      </div>
                    )}

                    {/* Contenido de la Tarjeta */}
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                      <span style={{ fontSize: "11px", color: "#589e38", fontWeight: "600", textTransform: "uppercase" }}>
                        {new Date(item.fecha).toLocaleDateString()}
                      </span>
                      <h3 style={{ fontSize: "16px", color: "#1e293b", margin: 0, fontWeight: "600", lineHeight: "1.4" }}>
                        {item.titulo}
                      </h3>
                      <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {item.descripcion}
                      </p>
                      <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600", marginTop: "8px" }}>
                        Leer completo →
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* BOTÓN DERECHA */}
            <button style={navButtonStyle("right")}> &gt; </button>
          </div>
        </div>
      </div>

      {/* --- MODAL PARA VER NOTICIA COMPLETA --- */}
      {noticiaSeleccionada && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px",
          boxSizing: "border-box"
        }}>
          <div style={{
            background: "#ffffff",
            width: "100%",
            maxWidth: "700px",
            maxHeight: "90vh",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
            animation: "aparecerModal 0.3s ease-out"
          }}>
            {/* Botón Cerrar Modal */}
            <button
              onClick={() => setNoticiaSeleccionada(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(0, 0, 0, 0.6)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10
              }}
            >
              <XMarkIcon style={{ width: "20px", height: "20px" }} />
            </button>

            {/* Contenido con scroll interno si es muy largo */}
            <div style={{ overflowY: "auto", padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Imagen Grande y Completa */}
              {noticiaSeleccionada.imagen && (
                <div style={{ width: "100%", maxHeight: "350px", background: "#0f172a", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <img
                    src={noticiaSeleccionada.imagen}
                    alt={noticiaSeleccionada.titulo}
                    style={{ maxWidth: "100%", maxHeight: "350px", objectFit: "contain" }}
                  />
                </div>
              )}

              {/* Fecha y Título */}
              <div>
                <span style={{ fontSize: "12px", color: "#589e38", fontWeight: "600", textTransform: "uppercase" }}>
                  Publicado el: {new Date(noticiaSeleccionada.fecha).toLocaleString()}
                </span>
                <h2 style={{ fontSize: "22px", color: "#1e293b", margin: "8px 0 0 0", lineHeight: "1.3" }}>
                  {noticiaSeleccionada.titulo}
                </h2>
              </div>

              {/* Descripción completa (con saltos de línea preservados) */}
              <div style={{
                fontSize: "15px",
                color: "#475569",
                lineHeight: "1.7",
                whiteSpace: "pre-wrap", /* Mantiene los párrafos y saltos originales */
                wordBreak: "break-word"
              }}>
                {noticiaSeleccionada.descripcion}
              </div>

            </div>
          </div>
        </div>
      )}

      <style>{`
        .tarjeta-noticia {
          transform: scale(0.9); 
        }
        .tarjeta-noticia:hover {
          transform: scale(1.01) !important;
          box-shadow: 0 30px 40px -10px rgba(0,0,0,0.2) !important;
        }
        @keyframes aparecer {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes aparecerModal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .tarjeta-noticia { animation: aparecer 0.8s ease-out forwards; }
      `}</style>
    </>
  );
}