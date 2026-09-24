import React from "react";
import logo from "../assets/gobierno.jpg";
import escudo from "../assets/logo2.jpg";

const NAV_ITEMS = [
  { label: "Productores", href: "/productores" },
  { label: "Predios y Producción", href: "/predios", isRoute: true },
  { label: "Estadísticas Generales", href: "/estadística-portalinfo", isRoute: true },
  { label: "Contactos", href: "#contactos" },
];

export default function PortalNavBar() {
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

      {/* Texto institucional pegado al logo */}
      <span style={{
        fontSize: "12px", color: "#888", fontStyle: "italic",
        lineHeight: 1.4, borderLeft: "2px solid #e0e0e0", paddingLeft: "16px",
      }}>
        Estado Barinas<br />
        <strong style={{ color: "#589e38", fontStyle: "normal" }}>Venezuela</strong>
      </span>

      {/* Links alineados a la izquierda */}
      <ul style={{
        display: "flex", gap: "8px", listStyle: "none",
        margin: 0, padding: 0, flex: 1, justifyContent: "flex-start",
      }}>
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <a href={item.href} style={{
              textDecoration: "none", color: "#444", fontSize: "13.5px",
              fontWeight: 400, padding: "6px 14px", borderRadius: "6px",
              display: "block", transition: "background 0.2s, color 0.2s",
              whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif",
            }}
              onMouseEnter={e => { e.target.style.background = "#f0faf0"; e.target.style.color = "#589e38"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#444"; }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}