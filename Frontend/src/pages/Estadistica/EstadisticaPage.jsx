import logo from "../../assets/gobierno.jpg";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";

export default function EstadisticaPage() {
  const navigate = useNavigate();

  const stats = [
    { numero: "0", label: "Predios Registrados" },
    { numero: "0 ha", label: "Superficie Total" },
    { numero: "0", label: "Productores Activos" },
    { numero: "11", label: "Municipios Cubiertos" },
  ];

  const municipios = [
    { nombre: "Barinas", predios: 0 },
    { nombre: "Alberto Arvelo", predios: 0 },
    { nombre: "Antonio José de Sucre", predios: 0 },
    { nombre: "Bolívar", predios: 0 },
    { nombre: "Cruz Paredes", predios: 0 },
    { nombre: "Ezequiel Zamora", predios: 0 },
  ];

  const NAV_ITEMS = [
    { label: "Sobre Nosotros", href: "#sobre-nosotros" },
    { label: "Registro de Predios", href: "/predios", isRoute: true },
    { label: "Producción Animal y Vegetal", href: "/produccion", isRoute: true },
    { label: "Estadísticas Generales", href: "/estadística-portalinfo", isRoute: true },
    { label: "Contactos", href: "#contactos" },
  ];


  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center",
        padding: "0 48px", height: "68px", backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100,
        gap: "24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", cursor: "pointer" }}
          onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" style={{ height: 45 }} />
          <img src={escudo} alt="Escudo" style={{ height: 45 }} />
        </div>

        <span style={{
          fontSize: "12px", color: "#888", fontStyle: "italic",
          lineHeight: 1.4, borderLeft: "2px solid #e0e0e0", paddingLeft: "16px",
        }}>
          Estado Barinas<br />
          <strong style={{ color: "#589e38", fontStyle: "normal" }}>Venezuela</strong>
        </span>

        <div style={{ flex: 1 }} />

        <button onClick={() => navigate("/")} style={{
          background: "none",
          border: "1.5px solid #aaa",
          color: "#666",
          padding: "8px 20px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "13px"
        }}>
          ← Portal
        </button>
      </nav>


      {/* HERO ESTADÍSTICAS */}
      <div style={{
        position: "relative", height: "400px", overflow: "hidden",
        display: "flex", alignItems: "center",
        background: "linear-gradient(120deg, #0a3d24 0%, #136442 55%, #1a7a50 100%)",
      }}>
        {/* Patrón decorativo */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%)",
          zIndex: 1,
        }} />

        {/* Imagen decorativa - Ajustada para estadísticas */}
        <img
          src="https://images.unsplash.com/flagged/photo-1553267252-d100936057c1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Estadísticas"
          style={{
            position: "absolute", right: 0, top: 0,
            width: "52%", height: "100%",
            objectFit: "cover", opacity: 0.25,
            clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 3, padding: "0 80px", maxWidth: "640px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.1)", borderRadius: "20px",
            padding: "6px 14px", marginBottom: "20px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#86efac" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>
              Panel de Análisis
            </span>
          </div>

          <h1 style={{ color: "#fff", fontSize: "40px", fontWeight: 700, lineHeight: 1.15, margin: "0 0 18px" }}>
            Estadísticas <br />
            <span style={{ color: "#86efac" }}>Agropecuarias Barinas</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", lineHeight: 1.8, maxWidth: "500px" }}>
            Panel de control y visualización de datos registrados en el Sistema de Gestión Territorial del estado Barinas.
          </p>
        </div>
      </div>




      <div style={{ 
  padding: "100px 40px", 
  display: "flex", 
  flexDirection: "column", 
  alignItems: "center", 
  textAlign: "center",
  background: "#ffffff",
  minHeight: "400px" 
}}>
  {/* Elemento decorativo sutil (Línea) */}
  <div style={{ width: "40px", height: "3px", background: "#136442", marginBottom: "32px" }} />

  <h2 style={{ 
    color: "#0a3d24", 
    fontSize: "24px", 
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    margin: "0 0 16px" 
  }}>
    Módulo en Proceso de Implementación
  </h2>
  
  <p style={{ 
    color: "#475569", 
    fontSize: "15px", 
    maxWidth: "400px", 
    lineHeight: "1.8",
    marginBottom: "40px" 
  }}>
    Esta sección del sistema se encuentra actualmente en fase de desarrollo técnico. 
  </p>
</div>



      {/* FOOTER */}
      <footer style={{ background: "#fff", color: "#555", fontFamily: "'Poppins', sans-serif", borderTop: "1px solid #e8e8e8" }}>

        {/* Cuerpo del footer */}
        <div style={{
          maxWidth: "1100px", margin: "0 auto", padding: "56px 80px 40px",
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px",
        }}>

          {/* Columna 1 - Logo y descripción */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <img src={logo} alt="Logo" style={{ height: 50 }} />
              <img src={escudo} alt="Escudo" style={{ height: 40 }} />
            </div>
            <p style={{ fontSize: "14px", lineHeight: 1.8, color: "#777", maxWidth: "280px" }}>
              Ecosistema digital agropecuario del estado Barinas. Plataforma oficial para el registro
              y gestión de la actividad productiva del campo barinés.
            </p>
            {/* Redes sociales */}
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              {/* Facebook */}
              <a href="#" style={{
                width: "36px", height: "36px", borderRadius: "8px",
                background: "#f0f0f0", display: "flex",
                alignItems: "center", justifyContent: "center", transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#589e38"}
                onMouseLeave={e => e.currentTarget.style.background = "#f0f0f0"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#555">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="#" style={{
                width: "36px", height: "36px", borderRadius: "8px",
                background: "#f0f0f0", display: "flex",
                alignItems: "center", justifyContent: "center", transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#589e38"}
                onMouseLeave={e => e.currentTarget.style.background = "#f0f0f0"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#555">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" style={{
                width: "36px", height: "36px", borderRadius: "8px",
                background: "#f0f0f0", display: "flex",
                alignItems: "center", justifyContent: "center", transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#589e38"}
                onMouseLeave={e => e.currentTarget.style.background = "#f0f0f0"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="#555" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" style={{
                width: "36px", height: "36px", borderRadius: "8px",
                background: "#f0f0f0", display: "flex",
                alignItems: "center", justifyContent: "center", transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#589e38"}
                onMouseLeave={e => e.currentTarget.style.background = "#f0f0f0"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#555">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#fff" />
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2 - Navegación */}
          <div>
            <h4 style={{ color: "#1b4332", fontSize: "14px", fontWeight: 600, margin: "0 0 20px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Navegación
            </h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {NAV_ITEMS.map(item => (
                <li key={item.label}>
                  <a href={item.href} style={{
                    color: "#777", textDecoration: "none", fontSize: "14px",
                    transition: "color 0.2s",
                  }}
                    onMouseEnter={e => e.target.style.color = "#589e38"}
                    onMouseLeave={e => e.target.style.color = "#777"}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 - Contacto rápido */}
          <div>
            <h4 style={{ color: "#1b4332", fontSize: "14px", fontWeight: 600, margin: "0 0 20px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Contacto
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#589e38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "2px", minWidth: "16px" }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:agrosistema@barinas.gob.ve" style={{ color: "#777", fontSize: "13px", textDecoration: "none" }}>
                  agrosistema@barinas.gob.ve
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#589e38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ minWidth: "16px" }}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .9h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span style={{ color: "#777", fontSize: "13px" }}>(0273) 300-0000</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#589e38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "2px", minWidth: "16px" }}>
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span style={{ color: "#777", fontSize: "13px" }}>Barinas, Estado Barinas, Venezuela</span>
              </div>
            </div>
          </div>

        </div>

        {/* Línea divisora */}
        <div style={{ borderTop: "1px solid #e8e8e8", margin: "0 80px" }} />

        {/* Barra inferior */}
        <div style={{
          maxWidth: "1100px", margin: "0 auto", padding: "20px 80px",
          display: "flex", justifyContent: "center", alignItems: "center",
        }}>
          <span style={{ fontSize: "13px", color: "#999", textAlign: "center" }}>
            © 2026 Ecosistema Digital Agropecuario, Estado Barinas. Todos los derechos reservados.
          </span>
        </div>

      </footer>
    </div>
  );
}