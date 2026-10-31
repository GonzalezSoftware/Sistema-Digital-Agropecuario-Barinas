import React, { useState, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function PortalInformativo() {
  // URL del servidor backend en AWS con HTTPS
  const API_URL = "https://3.145.179.35.nip.io/api/";

  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
  
  // Referencia para el contenedor deslizante del carrusel
  const carruselRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}noticias/`)
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

  // Función para desplazar el carrusel de manera suave por tarjeta
  const scrollCarrusel = (direccion) => {
    if (carruselRef.current) {
      // Ancho aproximado de la tarjeta (300px de minWidth/ancho + 20px de gap)
      const anchoTarjeta = 300; 
      carruselRef.current.scrollBy({
        left: direccion === "left" ? -anchoTarjeta : anchoTarjeta,
        behavior: "smooth"
      });
    }
  };

  const navButtonStyle = (side) => ({
    position: "absolute",
    [side === "left" ? "left" : "right"]: "-20px",
    zIndex: 10,
    background: "#589e38",
    color: "#fff",
    border: "none",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    fontSize: "20px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s ease, transform 0.2s ease",
  });

  return (
    <>
      <div id="portal-informativo" style={{ padding: "60px 16px", background: "#f8faf9" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>

          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ color: "#1b4332", fontSize: "clamp(24px, 4vw, 32px)", margin: 0 }}>
              Noticias del Sector Agropecuario
            </h2>
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

            {/* BOTÓN IZQUIERDA */}
            {!cargando && noticias.length > 3 && (
              <button 
                className="carrusel-btn" 
                onClick={() => scrollCarrusel("left")}
                style={navButtonStyle("left")}
                aria-label="Anterior"
              > 
                &lt; 
              </button>
            )}

            {/* CONTENEDOR DE NOTICIAS */}
            <div 
              ref={carruselRef}
              style={{
                display: "flex",
                gap: "20px",
                overflowX: "auto",
                padding: "20px 10px",
                width: "100%",
                maxWidth: "1010px",
                margin: "0 auto",
                justifyContent: noticias.length > 0 && noticias.length < 3 ? "center" : "flex-start",
                scrollbarWidth: "none", // Ocultar barra en Firefox
                msOverflowStyle: "none", // Ocultar barra en IE/Edge
                scrollBehavior: "smooth",
              }}
            >
              {cargando ? (
                <p style={{ textAlign: "center", color: "#64748b", width: "100%" }}>Cargando noticias recientes...</p>
              ) : noticias.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b", width: "100%" }}>No hay noticias disponibles en este momento.</p>
              ) : (
                noticias.map((item) => (
                  <div 
                    key={item.id} 
                    className="tarjeta-noticia" 
                    onClick={() => setNoticiaSeleccionada(item)}
                    style={{
                      minWidth: "300px",
                      maxWidth: "320px",
                      width: "100%",
                      background: "#fff",
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      cursor: "pointer",
                      flexShrink: 0
                    }}
                  >
                    {/* Contenedor de la Imagen */}
                    {item.imagen ? (
                      <div style={{ height: "180px", width: "100%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        <img 
                          src={item.imagen} 
                          alt={item.titulo} 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                      </div>
                    ) : (
                      <div style={{ height: "180px", background: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: "12px" }}>
                        Sin imagen
                      </div>
                    )}

                    {/* Contenido de la Tarjeta */}
                    <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "8px", flex: 1, justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontSize: "11px", color: "#589e38", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                          {new Date(item.fecha).toLocaleDateString()}
                        </span>
                        <h3 style={{ fontSize: "16px", color: "#1e293b", margin: 0, fontWeight: "600", lineHeight: "1.4" }}>
                          {item.titulo}
                        </h3>
                        <p style={{ fontSize: "13px", color: "#64748b", margin: "8px 0 0 0", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {item.descripcion}
                        </p>
                      </div>

                      {/* Autor y Leer completo */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "12px" }}>
                        <span style={{ fontSize: "12px", color: "#136442", fontWeight: "600" }}>
                          Autor: {item.autor || "Redacción"}
                        </span>
                        <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600" }}>
                          Leer completo →
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* BOTÓN DERECHA */}
            {!cargando && noticias.length > 3 && (
              <button 
                className="carrusel-btn" 
                onClick={() => scrollCarrusel("right")}
                style={navButtonStyle("right")}
                aria-label="Siguiente"
              > 
                &gt; 
              </button>
            )}
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
          padding: "16px",
          boxSizing: "border-box"
        }}>
          <div style={{
            background: "#ffffff",
            width: "100%",
            maxWidth: "700px",
            maxHeight: "85vh",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}>
            {/* Botón Cerrar Modal */}
            <button
              onClick={() => setNoticiaSeleccionada(null)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
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

            {/* Contenido con scroll interno */}
            <div style={{ overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* Imagen Grande */}
              {noticiaSeleccionada.imagen && (
                <div style={{ width: "100%", maxHeight: "280px", background: "#0f172a", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <img
                    src={noticiaSeleccionada.imagen}
                    alt={noticiaSeleccionada.titulo}
                    style={{ width: "100%", maxHeight: "280px", objectFit: "cover" }}
                  />
                </div>
              )}

              <div>
                <span style={{ fontSize: "12px", color: "#589e38", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  Publicado el: {new Date(noticiaSeleccionada.fecha).toLocaleString()}
                </span>
                <h2 style={{ fontSize: "clamp(18px, 4vw, 22px)", color: "#1e293b", margin: 0, lineHeight: "1.3" }}>
                  {noticiaSeleccionada.titulo}
                </h2>
              </div>

              <div style={{
                fontSize: "14px",
                color: "#475569",
                lineHeight: "1.7",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word"
              }}>
                {noticiaSeleccionada.descripcion}
              </div>

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginTop: "8px" }}>
                <span style={{ fontSize: "13px", color: "#136442", fontWeight: "600" }}>
                  Autor: {noticiaSeleccionada.autor || "Redacción"}
                </span>
              </div>

            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Ocultar barra de desplazamiento visualmente pero mantener la funcionalidad de scroll */
        div::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .carrusel-btn {
            display: none !important;
          }
        }
        .tarjeta-noticia:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
          transition: all 0.3s ease;
        }
        .carrusel-btn:hover {
          background: #467d2c !important;
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}