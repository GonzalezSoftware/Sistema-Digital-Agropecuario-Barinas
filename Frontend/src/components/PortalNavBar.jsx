import React, { useState } from "react";
import logo from "../assets/gobierno.jpg";
import escudo from "../assets/logo2.jpg";

const NAV_ITEMS = [
  { label: "Productores", href: "/productores" },
  { label: "Predios y Producción", href: "/predios", isRoute: true },
  { label: "Contactos", href: "#contactos" },
];

export default function PortalNavBar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "68px", backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100,
        fontFamily: "'Poppins', sans-serif",
      }}>
        {/* Izquierda: Logos y Texto Institucional */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={logo} alt="Gobierno Bolivariano de Venezuela" style={{ height: 48 }} />
            <img src={escudo} alt="Logo MPPAT" style={{ height: 30 }} />
          </div>

          {/* Texto institucional (oculto en móviles muy pequeños mediante clase CSS) */}
          <span className="texto-institucional" style={{
            fontSize: "12px", color: "#888", fontStyle: "italic",
            lineHeight: 1.4, borderLeft: "2px solid #e0e0e0", paddingLeft: "12px",
          }}>
            Estado Barinas<br />
            <strong style={{ color: "#589e38", fontStyle: "normal" }}>Venezuela</strong>
          </span>
        </div>

        {/* Links para Escritorio */}
        <ul className="nav-desktop" style={{
          display: "flex", gap: "8px", listStyle: "none",
          margin: 0, padding: 0, alignItems: "center"
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

        {/* Botón Hamburguesa para Móvil */}
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

      {/* Menú desplegable para dispositivos móviles */}
      {menuAbierto && (
        <div style={{
          position: "absolute", top: "68px", left: 0, width: "100%",
          background: "#fff", boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
          padding: "20px", display: "flex", flexDirection: "column", gap: "12px",
          zIndex: 99, borderTop: "1px solid #eee"
        }}>
          {NAV_ITEMS.map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              onClick={() => setMenuAbierto(false)}
              style={{
                textDecoration: "none", color: "#333", fontSize: "15px",
                fontWeight: 500, padding: "10px 14px", borderRadius: "6px",
                backgroundColor: "#f8faf9", display: "block"
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* Estilos CSS responsivos integrados */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop {
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