import React from "react";
import bannerImg from "../assets/banner2.jpg";

export default function PortalHero() {
  return (
    <div className="portal-hero-container" style={{
      position: "relative", minHeight: "520px", overflow: "hidden",
      display: "flex", alignItems: "center",
      background: "linear-gradient(120deg, #136442 0%)",
    }}>
      {/* Imagen de fondo adaptada */}
      <img src={bannerImg} alt="Banner" className="hero-bg-img" style={{
        position: "absolute", right: 0, top: 0,
        width: "55%", height: "100%",
        objectFit: "cover", opacity: 0.5,
        clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)",
      }} />

      {/* Contenido principal */}
      <div className="hero-content" style={{ position: "relative", zIndex: 2, padding: "60px 80px", maxWidth: "580px" }}>
        <h1 style={{ color: "#fff", fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 18px" }}>
          Sistema Digital Agropecuario<br />
          <span style={{ color: "#86efac" }}>del Estado Barinas</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.6, margin: "0 0 36px" }}>
          Portal de información agropecuaria del <strong style={{ color: "#fff" }}>estado Barinas</strong>.
          Registra predios, controla producción animal y vegetal, y visualiza
          estadísticas. Todo en una sola plataforma pensada para el productor venezolano.
        </p>
        <div className="hero-buttons" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <a href="../Predios" style={{
            backgroundColor: "#fff", color: "#589e38", padding: "14px 32px",
            borderRadius: "4px", textDecoration: "none", fontWeight: 600, fontSize: "14px",
            textAlign: "center"
          }}>Registrar Predio</a>
          <a href="#sobre-nosotros" style={{
            border: "2px solid rgba(255,255,255,0.7)", color: "#fff", padding: "14px 32px",
            borderRadius: "4px", textDecoration: "none", fontWeight: 600, fontSize: "14px",
            textAlign: "center"
          }}>Saber más</a>
        </div>
      </div>

      {/* Estilos responsivos con Media Queries */}
      <style>{`
        @media (max-width: 768px) {
          .portal-hero-container {
            padding: 20px 0;
            text-align: center;
          }
          .hero-content {
            padding: 40px 20px !important;
            max-width: 100% !important;
          }
          .hero-bg-img {
            width: 100% !important;
            opacity: 0.25 !important;
            clip-path: none !important;
          }
          .hero-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}