import React from "react";

export default function PrediosProduccionHero() {
  return (
    <div style={{
      position: "relative", height: "520px", overflow: "hidden",
      display: "flex", alignItems: "center",
      background: "linear-gradient(120deg, #0a3d24 0%, #136442 55%, #1a7a50 100%)",
    }}>
      {/* Patrón decorativo */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%)",
        zIndex: 1,
      }} />
      <img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80"
        alt="Predios"
        style={{
          position: "absolute", right: 0, top: 0,
          width: "52%", height: "100%",
          objectFit: "cover", opacity: 0.3,
          clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      />
      {/* Línea decorativa */}
      <div style={{
        position: "absolute", right: "48%", top: 0, bottom: 0,
        width: "1px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)",
        zIndex: 2,
      }} />

      <div style={{ position: "relative", zIndex: 3, padding: "0 80px", maxWidth: "640px", animation: "fadeInUp 0.8s ease" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(255,255,255,0.1)", borderRadius: "20px",
          padding: "6px 14px", marginBottom: "20px",
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>
            Módulo de Gestión Territorial — MPPAT
          </span>
        </div>
        <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: 700, lineHeight: 1.15, margin: "0 0 18px" }}>
          Registro y Caracterización<br />
          <span style={{ color: "#86efac" }}>de Predios Agropecuarios</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", lineHeight: 1.8, margin: "0 0 36px", maxWidth: "500px" }}>
          Sistema oficial administrado por <strong style={{ color: "#fff" }}>MPPAT</strong> para el registro integral de predios del estado Barinas, junto con el control detallado de su respectiva información productiva, tanto animal como vegetal.
        </p>
        <div style={{ display: "flex", gap: "14px" }}>
          <button className="hero-btn-primary"
            onClick={() => document.getElementById('productor-info').scrollIntoView({ behavior: 'smooth' })}
            style={{
              backgroundColor: "#fff", color: "#136442", padding: "13px 28px",
              borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "14px",
              cursor: "pointer", fontFamily: "'Poppins', sans-serif",
            }}>
            Soy Productor
          </button>
          <button className="hero-btn-secondary"
            onClick={() => document.getElementById('como-funciona').scrollIntoView({ behavior: 'smooth' })}
            style={{
              backgroundColor: "rgba(255,255,255,0.08)", color: "#fff", padding: "13px 28px",
              borderRadius: "8px", border: "1.5px solid rgba(255,255,255,0.3)",
              fontWeight: 600, fontSize: "14px", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
            }}>
            ¿Cómo funciona?
          </button>
        </div>
      </div>

      {/* Badge flotante */}
      <div style={{
        position: "absolute", right: "80px", bottom: "40px", zIndex: 3,
        background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px",
        padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>12</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Municipios</div>
        </div>
        <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.2)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>100%</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Verificado</div>
        </div>
      </div>
    </div>
  );
}