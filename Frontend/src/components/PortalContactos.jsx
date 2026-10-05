import React, { useState, useEffect } from "react";

export default function PortalContactos() {
  const [contacto, setContacto] = useState({
    correo: "",
    telefono: ""
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/contacto-info/")
      .then(res => res.json())
      .then(data => {
        if (data) {
          setContacto({
            correo: data.correo || "agrosistema@barinas.gob.ve",
            telefono: data.telefono || "(0273) 300-0000"
          });
        }
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al obtener datos de contacto públicos:", err);
        setCargando(false);
      });
  }, []);

  return (
    <div id="contactos" style={{
      background: "#f5f7f5", padding: "64px 80px",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Encabezado */}
        <div style={{ marginBottom: "48px" }}>
          <span style={{
            fontSize: "12px", fontWeight: 600, letterSpacing: "2px",
            textTransform: "uppercase", color: "#589e38",
          }}>
            Contacto
          </span>
          <h2 style={{ fontSize: "30px", fontWeight: 700, margin: "10px 0 12px", color: "#1b4332" }}>
            ¿Tienes alguna pregunta?
          </h2>
          <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.7, maxWidth: "500px" }}>
            Estamos disponibles para orientarte sobre el uso del sistema agropecuario del estado Barinas.
          </p>
        </div>

        {/* Tarjetas horizontales */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>

          {/* Correo */}
          <div style={{
            background: "#fff", borderRadius: "12px", padding: "32px 24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex",
            flexDirection: "column", alignItems: "flex-start", gap: "12px",
          }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "10px",
              background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#589e38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <p style={{ fontSize: "12px", color: "#999", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
              Correo electrónico
            </p>
            {cargando ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0" }}>
                <div style={{
                  width: "16px", height: "16px", border: "2px solid #e2e8f0", borderTop: "2px solid #589e38",
                  borderRadius: "50%", animation: "spin 0.8s linear infinite"
                }} />
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>Cargando...</span>
              </div>
            ) : (
              <a href={`mailto:${contacto.correo}`} style={{
                color: "#1b4332", textDecoration: "none", fontSize: "14px", fontWeight: 600,
              }}>
                {contacto.correo}
              </a>
            )}
          </div>

          {/* Teléfono */}
          <div style={{
            background: "#fff", borderRadius: "12px", padding: "32px 24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex",
            flexDirection: "column", alignItems: "flex-start", gap: "12px",
          }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "10px",
              background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#589e38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .9h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
            </div>
            <p style={{ fontSize: "12px", color: "#999", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
              Teléfono
            </p>
            {cargando ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0" }}>
                <div style={{
                  width: "16px", height: "16px", border: "2px solid #e2e8f0", borderTop: "2px solid #589e38",
                  borderRadius: "50%", animation: "spin 0.8s linear infinite"
                }} />
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>Cargando...</span>
              </div>
            ) : (
              <a href={`tel:${contacto.telefono}`} style={{
                color: "#1b4332", textDecoration: "none", fontSize: "14px", fontWeight: 600,
              }}>
                {contacto.telefono}
              </a>
            )}
          </div>

          {/* Ubicación */}
          <div style={{
            background: "#fff", borderRadius: "12px", padding: "32px 24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex",
            flexDirection: "column", alignItems: "flex-start", gap: "12px",
          }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "10px",
              background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#589e38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <p style={{ fontSize: "12px", color: "#999", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
              Ubicación
            </p>
            <span style={{ color: "#1b4332", fontSize: "14px", fontWeight: 600, lineHeight: 1.6 }}>
              Barinas, Estado Barinas<br />Venezuela
            </span>
          </div>

        </div>
      </div>

      {/* Animación del spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}