import logo from "../../assets/gobierno.jpg";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import PrediosProduccionHero from "../../components/PrediosProduccionHero";
import PrediosProduccionInformacion from "../../components/PrediosProduccionInformacion";
import Footer from "../../components/Footer";
import {
  IconPhone, IconMail, IconClock, IconMap, IconClipboard, IconHistory, IconBarChart,
  IconUsers, IconLayers, IconMapPin, IconTrendingUp, IconCheckCircle, IconContact,
  IconVisit, IconRegister, IconFile, IconInfo,
  IconDashboard, IconSelect, IconSliders, IconRefresh, IconFileText,
  NAV_ITEMS, GlobalStyles
} from "../../components/ui/PrediosProduccionUI";

export default function PrediosPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", margin: 0, padding: 0, paddingTop: "68px" }}>

      <GlobalStyles />

      {/* Navbar Fijo */}
      <PrediosProduccionNavbar logo={logo} escudo={escudo} />

      {/* Hero */}
      <PrediosProduccionHero />

      {/* Información */}
      <PrediosProduccionInformacion
        IconClipboard={IconClipboard}
        IconMap={IconMap}
        IconHistory={IconHistory}
        IconBarChart={IconBarChart}
        IconCheckCircle={IconCheckCircle}
        IconPhone={IconPhone}
        IconMail={IconMail}
        IconClock={IconClock}
        IconDashboard={IconDashboard}
        IconSelect={IconSelect}
        IconSliders={IconSliders}
        IconTrendingUp={IconTrendingUp}
        IconRefresh={IconRefresh}
        IconFileText={IconFileText}
      />

      {/* Footer */}
      <Footer logo={logo} escudo={escudo} NAV_ITEMS={NAV_ITEMS} />

    </div>
  );
}

function PrediosProduccionNavbar({ logo, escudo }) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "68px", backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100,
        fontFamily: "'Poppins', sans-serif", boxSizing: "border-box",
      }}>
        {/* Logo + Escudo + Texto Institucional */}
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

        {/* Botones de escritorio */}
        <div className="nav-desktop-buttons" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => navigate("/predios/login")} style={{
            background: "#136442", border: "none", color: "#fff",
            padding: "8px 18px", borderRadius: "6px", cursor: "pointer",
            fontWeight: 600, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
            whiteSpace: "nowrap"
          }}>
            Acceso Empleados
          </button>
          <button onClick={() => navigate("/")} style={{
            background: "none", border: "1.5px solid #ccc", color: "#666",
            padding: "8px 16px", borderRadius: "6px", cursor: "pointer",
            fontWeight: 500, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
            whiteSpace: "nowrap"
          }}>
            ← 
          </button>
        </div>

        {/* Botón Hamburguesa para Móviles */}
        <button 
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="btn-hamburguesa"
          style={{
            display: "none", background: "none", border: "none", 
            cursor: "pointer", fontSize: "24px", color: "#1b4332", padding: "4px"
          }}
          aria-label="Abrir menú"
        >
          {menuAbierto ? "✕" : "☰"}
        </button>
      </nav>

      {/* Menú desplegable móvil (Fijo para que permanezca visible al hacer scroll) */}
      {menuAbierto && (
        <div style={{
          position: "fixed", top: "68px", left: 0, width: "100%",
          background: "#fff", boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          padding: "20px", display: "flex", flexDirection: "column", gap: "12px",
          zIndex: 99, borderTop: "1px solid #eee", boxSizing: "border-box"
        }}>
          <button 
            onClick={() => { setMenuAbierto(false); navigate("/predios/login"); }}
            style={{
              background: "#136442", border: "none", color: "#fff",
              padding: "12px 18px", borderRadius: "8px", cursor: "pointer",
              fontWeight: 600, fontSize: "14px", textAlign: "center", width: "100%"
            }}
          >
            Acceso Empleados
          </button>
          <button 
            onClick={() => { setMenuAbierto(false); navigate("/"); }}
            style={{
              background: "#f8faf9", border: "1px solid #ccc", color: "#444",
              padding: "12px 18px", borderRadius: "8px", cursor: "pointer",
              fontWeight: 500, fontSize: "14px", textAlign: "center", width: "100%"
            }}
          >
            ← Volver al Portal
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-buttons {
            display: none !important;
          }
          .btn-hamburguesa {
            display: block !important;
          }
          .texto-institucional {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}