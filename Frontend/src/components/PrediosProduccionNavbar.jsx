import React from "react";
import { useNavigate } from "react-router-dom";

export default function PrediosProduccionNavbar({ logo, escudo }) {
  const navigate = useNavigate();

  return (
    <nav style={{
      display: "flex", alignItems: "center",
      padding: "0 48px", height: "68px", backgroundColor: "#fff",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100,
      fontFamily: "'Poppins', sans-serif", gap: "24px",
    }}>
      {/* Logo + Escudo */}
      <div style={{
        display: "flex", alignItems: "center", gap: "20px",
        marginLeft: "-30px"
      }}>
        <img src={logo} alt="Gobierno Bolivariano de Venezuela" style={{ height: 45 }} />
        <img src={escudo} alt="Logo MPPAT" style={{ height: 35 }} />
      </div>

      {/* Texto institucional */}
      <span style={{
        fontSize: "12px", color: "#888", fontStyle: "italic",
        lineHeight: 1.4, borderLeft: "2px solid #e0e0e0", paddingLeft: "16px",
      }}>
        Estado Barinas<br />
        <strong style={{ color: "#136442", fontStyle: "normal" }}>Venezuela</strong>
      </span>

      {/* Botones de acción derecha */}
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button className="nav-btn-primary" onClick={() => navigate("/predios/login")} style={{
          background: "#136442", border: "none", color: "#fff",
          padding: "8px 22px", borderRadius: "6px", cursor: "pointer",
          fontWeight: 600, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
        }}>
          Acceso Empleados
        </button>
        <button onClick={() => navigate("/")} style={{
          background: "none", border: "1.5px solid #ccc", color: "#666",
          padding: "8px 20px", borderRadius: "6px", cursor: "pointer",
          fontWeight: 500, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
        }}>
          ← Portal
        </button>
      </div>
    </nav>
  );
}