import React from "react";

export default function PortalSobreNosotros() {
  return (
    <div id="sobre-nosotros" style={{
      padding: "50px 80px", background: "#fff",
      display: "flex", alignItems: "center", gap: "64px",
      maxWidth: "1100px", margin: "0 auto",
    }}>
      <div style={{ flex: 1 }}>
        <span style={{ color: "#589e38", fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>
          Sobre Nosotros
        </span>
        <h2 style={{ color: "#1b4332", fontSize: "32px", margin: "12px 0 20px" }}>
          Tecnología al servicio del campo barinés
        </h2>
        <p style={{ color: "#555", fontSize: "16px", lineHeight: 1.7 }}>
          Somos un ecosistema digital diseñado para modernizar la gestión agropecuaria
          del estado Barinas. Centralizamos la información de predios, producción y
          estadísticas en un solo lugar, accesible para productores de todas las escalas,
          desde el pequeño agricultor hasta las grandes explotaciones ganaderas.
        </p>
        <p style={{ color: "#555", fontSize: "16px", lineHeight: 1.7, marginTop: "16px" }}>
          Barinas, tierra llanera y de gran vocación agropecuaria, merece una herramienta
          a la altura de su potencial productivo.
        </p>
      </div>

      <div style={{ flex: 1, borderRadius: "16px", overflow: "hidden", height: "320px" }}>
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
          alt="Campo agropecuario"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}