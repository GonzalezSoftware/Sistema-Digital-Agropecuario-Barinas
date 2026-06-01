import logo from "../../assets/gobierno.jpg";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";
import React from "react";

const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .9h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconMap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

const IconClipboard = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const IconCamera = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconBarChart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const IconUsers = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const IconLayers = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconMapPin = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconTrendingUp = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconCheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconContact = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconVisit = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const IconRegister = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconFile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconInfo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const NAV_ITEMS = [
  { label: "Sobre Nosotros", href: "#sobre-nosotros" },
  { label: "Registro de Predios", href: "/predios", isRoute: true },
  { label: "Producción Animal y Vegetal", href: "/produccion", isRoute: true },
  { label: "Estadísticas Generales", href: "/estadística-portalinfo", isRoute: true },
  { label: "Contactos", href: "#contactos" },
];

export default function PrediosPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", margin: 0, padding: 0 }}>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .hero-btn-primary:hover {
          background: #f0f9f4 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        .hero-btn-secondary:hover {
          background: rgba(255,255,255,0.15) !important;
          transform: translateY(-2px);
        }
        .nav-btn-primary:hover {
          background: #0d4a2f !important;
          transform: translateY(-1px);
        }
        .feature-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 40px rgba(19,100,66,0.15) !important;
        }
        .stat-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 32px rgba(19,100,66,0.12) !important;
        }
        .step-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 28px rgba(0,0,0,0.1) !important;
        }
        .contact-card:hover {
          border-color: #136442 !important;
          transform: translateY(-3px) !important;
        }
        * { transition: transform 0.25s ease, box-shadow 0.25s ease; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center",
        padding: "0 48px", height: "68px", backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100,
        gap: "24px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "20px", ap: "20px",
          marginLeft: "-30px"
        }}>
          <img src={logo} alt="Gobierno Bolivariano de Venezuela" style={{ height: 45 }} />
          <img src={escudo} alt="Logo MPPAT" style={{ height: 35 }} />

        </div>
        <span style={{
          fontSize: "12px", color: "#888", fontStyle: "italic",
          lineHeight: 1.4, borderLeft: "2px solid #e0e0e0", paddingLeft: "16px",
        }}>
          Estado Barinas<br />
          <strong style={{ color: "#136442", fontStyle: "normal" }}>Venezuela</strong>
        </span>
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

      {/* HERO */}
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
            Sistema oficial administrado por <strong style={{ color: "#fff" }}>MPPAT</strong> para el
            registro, caracterización y gestión territorial de predios agropecuarios del estado Barinas.
            Personal técnico autorizado garantiza la veracidad de cada dato ingresado.
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
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>11</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Municipios</div>
          </div>
          <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.2)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>100%</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Verificado</div>
          </div>
        </div>
      </div>

      {/* AVISO INSTITUCIONAL */}
      <div style={{
        background: "#f0faf4", borderLeft: "4px solid #136442",
        padding: "18px 80px", display: "flex", alignItems: "center", gap: "14px",
      }}>
        <div style={{
          minWidth: "36px", height: "36px", borderRadius: "8px",
          background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <IconInfo />
        </div>
        <p style={{ margin: 0, fontSize: "14px", color: "#1b4332", lineHeight: 1.6 }}>
          <strong>Información importante:</strong> El registro de predios es realizado exclusivamente
          por empleados autorizados de MPPAT para garantizar la veracidad de los datos.
          Si eres productor, comunícate con nosotros a través de los canales indicados más abajo.
        </p>
      </div>

      {/* CÓMO FUNCIONA */}
      <div id="como-funciona" style={{ padding: "72px 80px", background: "#f8faf8" }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <span style={{ color: "#136442", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
            ¿Cómo funciona?
          </span>
          <h2 style={{ color: "#1b4332", fontSize: "28px", margin: "10px 0 8px", fontWeight: 700 }}>
            Proceso de registro de un predio
          </h2>
          <p style={{ color: "#777", fontSize: "14px", marginBottom: "48px", lineHeight: 1.7, maxWidth: "500px" }}>
            Cada predio pasa por un proceso técnico riguroso antes de ser registrado oficialmente en el sistema.
          </p>

          {/* Línea conectora */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", top: "28px", left: "12.5%", right: "12.5%",
              height: "2px", background: "linear-gradient(to right, #136442, #4ade80, #136442)",
              zIndex: 0, opacity: 0.3,
            }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", position: "relative", zIndex: 1 }}>
              {[
                { numero: "01", title: "Contacto inicial", desc: "El productor contacta al MPPAT por teléfono o correo para solicitar el registro de su predio.", Icon: IconContact },
                { numero: "02", title: "Visita técnica", desc: "Personal autorizado realiza visita al predio para verificar y levantar la información en campo.", Icon: IconVisit },
                { numero: "03", title: "Registro en sistema", desc: "El técnico ingresa la información catastral, GPS, superficie y características físico-naturales.", Icon: IconRegister },
                { numero: "04", title: "Ficha técnica", desc: "Se genera la ficha técnica oficial del predio, disponible para consulta y descarga en PDF.", Icon: IconFile },
              ].map((paso) => (
                <div key={paso.numero} className="step-card" style={{
                  background: "#fff", borderRadius: "14px", padding: "28px 24px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  border: "1px solid #eef0ee",
                }}>
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "12px",
                    background: "#e8f5e9", display: "flex", alignItems: "center",
                    justifyContent: "center", marginBottom: "16px",
                  }}>
                    <paso.Icon />
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#aaa", letterSpacing: "1px", marginBottom: "6px" }}>
                    PASO {paso.numero}
                  </div>
                  <h3 style={{ color: "#1b4332", fontSize: "15px", margin: "0 0 10px", fontWeight: 700 }}>
                    {paso.title}
                  </h3>
                  <p style={{ color: "#777", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                    {paso.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FUNCIONALIDADES */}
      <div style={{ padding: "72px 80px", background: "#fff" }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <span style={{ color: "#136442", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
            Funcionalidades
          </span>
          <h2 style={{ color: "#1b4332", fontSize: "28px", margin: "10px 0 8px", fontWeight: 700 }}>
            Capacidades del sistema
          </h2>
          <p style={{ color: "#777", fontSize: "14px", marginBottom: "48px", maxWidth: "500px", lineHeight: 1.7 }}>
            Herramientas de precisión diseñadas para la gestión territorial profesional.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {[
              {
                Icon: IconClipboard,
                title: "Información del predio",
                desc: "Nombre del predio, productor, coordenadas (latitud y longitud), infraestructura, servicios básicos y mucho más...",
                tag: "Core",
              },
              {
                Icon: IconMap,
                title: "Mapa Interactivo",
                desc: "Georreferenciación precisa visualizada en mapa interactivo del estado Barinas con Leaflet.",
                tag: "Geo",
              },
              {
                Icon: IconCamera,
                title: "Galería Fotográfica",
                desc: "Registro fotográfico oficial del predio para documentación, verificación y seguimiento.",
                tag: "Media",
              },
              {
                Icon: IconBarChart,
                title: "Reportes Oficiales",
                desc: "Fichas técnicas en PDF, exportación a Excel y reportes estadísticos por municipio.",
                tag: "Reportes",
              },
            ].map((card) => (
              <div key={card.title} className="feature-card" style={{
                background: "#fff", borderRadius: "14px", padding: "28px 24px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                border: "1px solid #eef0ee",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "12px",
                    background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <card.Icon />
                  </div>
                  <span style={{
                    fontSize: "10px", fontWeight: 700, color: "#136442",
                    background: "#e8f5e9", padding: "3px 10px", borderRadius: "20px",
                    letterSpacing: "0.5px",
                  }}>
                    {card.tag}
                  </span>
                </div>
                <h3 style={{ color: "#1b4332", fontSize: "15px", margin: "0 0 10px", fontWeight: 700 }}>
                  {card.title}
                </h3>
                <p style={{ color: "#777", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PARA PRODUCTORES */}
      <div id="productor-info" style={{ padding: "72px 80px", background: "#f8faf8" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <span style={{ color: "#136442", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
            Para productores
          </span>
          <h2 style={{ fontSize: "28px", fontWeight: 700, margin: "10px 0 8px", color: "#1b4332" }}>
            ¿Deseas registrar tu predio?
          </h2>
          <p style={{ color: "#777", fontSize: "14px", lineHeight: 1.7, maxWidth: "560px", marginBottom: "48px" }}>
            El proceso es sencillo. Personal técnico del MPPAT se encargará de todo el registro
            de manera oficial y verificada. Solo debes seguir estos pasos:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "48px" }}>
            {[
              { num: "1", texto: "Comunícate con el MPPAT por teléfono o correo electrónico.", check: true },
              { num: "2", texto: "Solicita formalmente el registro de tu predio agropecuario.", check: true },
              { num: "3", texto: "Coordina la fecha de visita técnica con el personal asignado.", check: true },
              { num: "4", texto: "Recibe tu ficha técnica oficial una vez completado el proceso.", check: true },
            ].map((paso) => (
              <div key={paso.num} className="step-card" style={{
                background: "#fff", borderRadius: "14px", padding: "24px 20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                border: "1px solid #eef0ee",
                borderTop: "3px solid #136442",
              }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "8px",
                  background: "#e8f5e9", display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: "14px",
                  fontSize: "14px", fontWeight: 700, color: "#136442",
                }}>
                  {paso.num}
                </div>
                <p style={{ color: "#555", fontSize: "13px", lineHeight: 1.7, margin: "0 0 12px" }}>
                  {paso.texto}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <IconCheckCircle />
                  <span style={{ fontSize: "11px", color: "#136442", fontWeight: 600 }}>Requerido</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tarjetas de contacto */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              { Icon: IconPhone, label: "Teléfono", value: "(0273) 300-0000", href: "tel:+582733000000", isLink: true },
              { Icon: IconMail, label: "Correo electrónico", value: "agrosistema@barinas.gob.ve", href: "mailto:agrosistema@barinas.gob.ve", isLink: true },
              { Icon: IconClock, label: "Horario de atención", value: "Lunes a Viernes · 8:00am – 4:00pm", isLink: false },
            ].map((item) => (
              <div key={item.label} className="contact-card" style={{
                background: "#fff", borderRadius: "14px", padding: "28px 24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex",
                flexDirection: "column", alignItems: "flex-start", gap: "12px",
                border: "1px solid #eef0ee",
              }}>
                <div style={{
                  width: "46px", height: "46px", borderRadius: "11px",
                  background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <item.Icon />
                </div>
                <p style={{ fontSize: "11px", color: "#aaa", margin: 0, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600 }}>
                  {item.label}
                </p>
                {item.isLink ? (
                  <a href={item.href} style={{ color: "#1b4332", textDecoration: "none", fontSize: "14px", fontWeight: 600, lineHeight: 1.5 }}>
                    {item.value}
                  </a>
                ) : (
                  <span style={{ color: "#1b4332", fontSize: "14px", fontWeight: 600, lineHeight: 1.5 }}>
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
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