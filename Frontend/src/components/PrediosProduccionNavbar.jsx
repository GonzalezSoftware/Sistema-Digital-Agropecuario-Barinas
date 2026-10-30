import React from "react";
import { useNavigate } from "react-router-dom";

export default function PrediosProduccionNavbar({ logo, escudo }) {
  const navigate = useNavigate();

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", height: "68px", backgroundColor: "#fff",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100,
      fontFamily: "'Poppins', sans-serif",
    }}>
      {/* Logo + Escudo + Texto */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/")}>
          {logo && <img src={logo} alt="Gobierno Bolivariano de Venezuela" style={{ height: 38 }} />}
          {escudo && <img src={escudo} alt="Logo MPPAT" style={{ height: 30 }} />}
        </div>
        <span className="texto-institucional" style={{
          fontSize: "12px", color: "#888", fontStyle: "italic",
          lineHeight: 1.4, borderLeft: "2px solid #e0e0e0", paddingLeft: "12px",
        }}>
          Estado Barinas<br />
          <strong style={{ color: "#136442", fontStyle: "normal" }}>Venezuela</strong>
        </span>
      </div>

      {/* Botones de acción derecha */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button className="nav-btn-primary" onClick={() => navigate("/predios/login")} style={{
          background: "#136442", border: "none", color: "#fff",
          padding: "8px 16px", borderRadius: "6px", cursor: "pointer",
          fontWeight: 600, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
          whiteSpace: "nowrap"
        }}>
          Acceso Empleados
        </button>
        <button onClick={() => navigate("/")} style={{
          background: "none", border: "1.5px solid #ccc", color: "#666",
          padding: "8px 14px", borderRadius: "6px", cursor: "pointer",
          fontWeight: 500, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
          whiteSpace: "nowrap"
        }}>
          ← Portal
        </button>
      </div>

      <style>{`
        @media (max-width: 576px) {
          .texto-institucional {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}