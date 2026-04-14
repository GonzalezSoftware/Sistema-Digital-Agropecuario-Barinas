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
        <div style={{ display: "flex", alignItems: "center", gap: "20px",ap: "20px",
            marginLeft: "-30px" }}>
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
                title: "Registro Catastral",
                desc: "Superficie, uso del suelo, topografía, cobertura vegetal y características físico-naturales completas.",
                tag: "Core",
              },
              {
                Icon: IconMap,
                title: "Mapa Interactivo",
                desc: "Geolocalización GPS precisa visualizada en mapa interactivo del estado Barinas con Leaflet.",
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

      {/* ESTADÍSTICAS */}
      <div style={{ padding: "72px 80px", background: "#fff" }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <span style={{ color: "#136442", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
            Estadísticas del módulo
          </span>
          <h2 style={{ color: "#1b4332", fontSize: "28px", margin: "10px 0 8px", fontWeight: 700 }}>
            Predios registrados en el estado Barinas
          </h2>
          <p style={{ color: "#777", fontSize: "14px", marginBottom: "48px", lineHeight: 1.7 }}>
            Datos actualizados y verificados por el equipo técnico del MPPAT
          </p>

          {/* Métricas principales */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" }}>
            {[
              { Icon: IconLayers, numero: "0", label: "Predios Registrados", sub: "En el sistema" },
              { Icon: IconTrendingUp, numero: "0 ha", label: "Superficie Total", sub: "Hectáreas catastradas" },
              { Icon: IconMapPin, numero: "11", label: "Municipios", sub: "Estado Barinas" },
              { Icon: IconUsers, numero: "0", label: "Productores", sub: "Registrados" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card" style={{
                background: "#f8faf8", borderRadius: "14px", padding: "28px 20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                border: "1px solid #eef0ee", borderBottom: "3px solid #136442",
              }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "11px", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <stat.Icon />
                </div>
                <div style={{ fontSize: "30px", fontWeight: 700, color: "#136442", marginBottom: "4px", lineHeight: 1 }}>{stat.numero}</div>
                <div style={{ fontSize: "14px", color: "#1b4332", fontWeight: 600, marginBottom: "4px" }}>{stat.label}</div>
                <div style={{ fontSize: "12px", color: "#aaa" }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Métricas secundarias */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" }}>
            {[
              { numero: "0", label: "Predios Agrícolas" },
              { numero: "0", label: "Predios Pecuarios" },
              { numero: "0", label: "Predios Mixtos" },
              { numero: "0", label: "Fichas Generadas" },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "#f8faf8", borderRadius: "10px", padding: "18px 16px", border: "1px solid #eef0ee", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#136442", marginBottom: "4px" }}>{stat.numero}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* FILA 1 — Barras municipios + Dona uso suelo */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px", marginBottom: "24px" }}>

            {/* Barras SVG — Predios por municipio */}
            <div style={{ background: "#f8faf8", borderRadius: "14px", padding: "28px", border: "1px solid #eef0ee" }}>
              <h3 style={{ color: "#1b4332", fontSize: "15px", fontWeight: 700, margin: "0 0 4px" }}>Predios por Municipio</h3>
              <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 20px" }}>Distribución geográfica — se llenará con datos reales</p>
              {(() => {
                const municipios = ["Barinas", "Obispos", "Cruz P.", "Bolívar", "Rojas", "Pedraza", "Sucre", "Arismendi", "Sto. Dom.", "Sosa", "E. Zamora"];
                const valores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                const maxVal = Math.max(...valores, 1);
                const w = 520, h = 200, padL = 8, padR = 8, padT = 10, padB = 50;
                const barW = (w - padL - padR) / municipios.length;
                const colores = ["#136442", "#1a7a50", "#136442", "#1a7a50", "#136442", "#1a7a50", "#136442", "#1a7a50", "#136442", "#1a7a50", "#136442"];
                return (
                  <svg width="100%" viewBox={`0 0 ${w} ${h + padB}`} style={{ overflow: "visible" }}>
                    {[0, 25, 50, 75, 100].map(v => {
                      const y = padT + (h - padT) * (1 - v / 100);
                      return <line key={v} x1={padL} x2={w - padR} y1={y} y2={y} stroke="#f0f0f0" strokeWidth="1" />;
                    })}
                    {municipios.map((m, i) => {
                      const barH = Math.max(((valores[i] / maxVal) * (h - padT - 4)), 4);
                      const x = padL + i * barW + barW * 0.15;
                      const bw = barW * 0.7;
                      const y = padT + (h - padT) - barH;
                      return (
                        <g key={m}>
                          <rect x={x} y={y} width={bw} height={barH} fill={colores[i]} rx="4" opacity="0.85" />
                          <text x={x + bw / 2} y={h + padT + 14} textAnchor="middle" fontSize="9" fill="#999" transform={`rotate(-35, ${x + bw / 2}, ${h + padT + 14})`}>{m}</text>
                        </g>
                      );
                    })}
                    <line x1={padL} x2={w - padR} y1={h + padT - 0} y2={h + padT} stroke="#e0e0e0" strokeWidth="1" />
                  </svg>
                );
              })()}
            </div>

            {/* Dona SVG — Uso del suelo */}
            <div style={{ background: "#f8faf8", borderRadius: "14px", padding: "28px", border: "1px solid #eef0ee" }}>
              <h3 style={{ color: "#1b4332", fontSize: "15px", fontWeight: 700, margin: "0 0 4px" }}>Uso del Suelo</h3>
              <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 16px" }}>Clasificación por tipo de actividad</p>
              {(() => {
                const data = [
                  { name: "Pecuario", value: 45, color: "#136442" },
                  { name: "Agrícola", value: 30, color: "#1e8a5a" },
                  { name: "Mixto", value: 18, color: "#4ade80" },
                  { name: "Forestal", value: 7, color: "#bbf7d0" },
                ];
                const cx = 90, cy = 90, r = 72, ri = 44;
                let angle = -90;
                const slices = data.map(d => {
                  const deg = (d.value / 100) * 360;
                  const start = angle;
                  angle += deg;
                  return { ...d, start, end: angle };
                });
                const arc = (cx, cy, r, startDeg, endDeg) => {
                  const toRad = d => (d * Math.PI) / 180;
                  const x1 = cx + r * Math.cos(toRad(startDeg));
                  const y1 = cy + r * Math.sin(toRad(startDeg));
                  const x2 = cx + r * Math.cos(toRad(endDeg));
                  const y2 = cy + r * Math.sin(toRad(endDeg));
                  const large = endDeg - startDeg > 180 ? 1 : 0;
                  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
                };
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <svg width="180" height="180">
                      {slices.map((s, i) => (
                        <path key={i}
                          d={`${arc(cx, cy, r, s.start, s.end)} L ${cx + ri * Math.cos((s.end * Math.PI) / 180)} ${cy + ri * Math.sin((s.end * Math.PI) / 180)} A ${ri} ${ri} 0 ${s.end - s.start > 180 ? 1 : 0} 0 ${cx + ri * Math.cos((s.start * Math.PI) / 180)} ${cy + ri * Math.sin((s.start * Math.PI) / 180)} Z`}
                          fill={s.color} opacity="0.9"
                        />
                      ))}
                      <circle cx={cx} cy={cy} r={ri - 2} fill="#f8faf8" />
                      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="#136442">100%</text>
                      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#aaa">Catastrado</text>
                    </svg>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {data.map(d => (
                        <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: d.color }} />
                          <span style={{ fontSize: "12px", color: "#555", flex: 1 }}>{d.name}</span>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#136442" }}>{d.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* FILA 2 — Radar + Área crecimiento */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "24px", marginBottom: "24px" }}>

            {/* Radar SVG */}
            <div style={{ background: "#f8faf8", borderRadius: "14px", padding: "28px", border: "1px solid #eef0ee" }}>
              <h3 style={{ color: "#1b4332", fontSize: "15px", fontWeight: 700, margin: "0 0 4px" }}>Características del Territorio</h3>
              <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 8px" }}>Indicadores físico-naturales promedio</p>
              {(() => {
                const data = [
                  { label: "Fertilidad", val: 78 },
                  { label: "Agua", val: 65 },
                  { label: "Accesib.", val: 82 },
                  { label: "Cobertura", val: 55 },
                  { label: "Topograf.", val: 90 },
                  { label: "Clima", val: 73 },
                ];
                const cx = 150, cy = 140, maxR = 95, n = data.length;
                const toRad = d => (d * Math.PI) / 180;
                const angle = i => toRad(-90 + (360 / n) * i);
                const rings = [20, 40, 60, 80, 100];
                const point = (i, pct) => {
                  const r = (pct / 100) * maxR;
                  return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
                };
                const dataPoints = data.map((d, i) => point(i, d.val));
                const polygon = dataPoints.map(p => p.join(",")).join(" ");
                return (
                  <svg width="100%" viewBox="0 0 300 280">
                    {rings.map(r => {
                      const pts = data.map((_, i) => point(i, r)).map(p => p.join(",")).join(" ");
                      return <polygon key={r} points={pts} fill="none" stroke="#e8e8e8" strokeWidth="1" />;
                    })}
                    {data.map((_, i) => {
                      const [x, y] = point(i, 100);
                      return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e8e8e8" strokeWidth="1" />;
                    })}
                    <polygon points={polygon} fill="#136442" fillOpacity="0.15" stroke="#136442" strokeWidth="2" />
                    {dataPoints.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#136442" />)}
                    {data.map((d, i) => {
                      const [x, y] = point(i, 115);
                      return <text key={i} x={x} y={y} textAnchor="middle" fontSize="10" fill="#777" dominantBaseline="middle">{d.label}</text>;
                    })}
                    {data.map((d, i) => {
                      const [x, y] = point(i, d.val);
                      return <text key={i} x={x + 6} y={y - 6} fontSize="9" fill="#136442" fontWeight="700">{d.val}</text>;
                    })}
                  </svg>
                );
              })()}
            </div>

            {/* Área SVG — Crecimiento */}
            <div style={{ background: "#f8faf8", borderRadius: "14px", padding: "28px", border: "1px solid #eef0ee" }}>
              <h3 style={{ color: "#1b4332", fontSize: "15px", fontWeight: 700, margin: "0 0 4px" }}>Crecimiento de Registros</h3>
              <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 20px" }}>Proyección mensual de predios a registrar</p>
              {(() => {
                const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                const valores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                const w = 480, h = 180, padL = 32, padR = 16, padT = 16, padB = 24;
                const innerW = w - padL - padR;
                const innerH = h - padT - padB;
                const maxV = Math.max(...valores, 10);
                const pts = meses.map((_, i) => {
                  const x = padL + (i / (meses.length - 1)) * innerW;
                  const y = padT + innerH - (valores[i] / maxV) * innerH;
                  return [x, y];
                });
                const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
                const areaD = `${lineD} L ${pts[pts.length - 1][0]} ${padT + innerH} L ${pts[0][0]} ${padT + innerH} Z`;
                return (
                  <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
                    <defs>
                      <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#136442" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#136442" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[0, 25, 50, 75, 100].map(v => {
                      const y = padT + innerH - (v / 100) * innerH;
                      return (
                        <g key={v}>
                          <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                          <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#bbb">{Math.round(maxV * v / 100)}</text>
                        </g>
                      );
                    })}
                    <path d={areaD} fill="url(#gradArea)" />
                    <path d={lineD} fill="none" stroke="#136442" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {pts.map(([x, y], i) => (
                      <g key={i}>
                        <circle cx={x} cy={y} r="5" fill="#fff" stroke="#136442" strokeWidth="2" />
                        <text x={x} y={h - 4} textAnchor="middle" fontSize="9" fill="#999">{meses[i]}</text>
                      </g>
                    ))}
                    <line x1={padL} x2={w - padR} y1={padT + innerH} y2={padT + innerH} stroke="#e0e0e0" strokeWidth="1" />
                  </svg>
                );
              })()}
            </div>
          </div>

          {/* FILA 3 — Barras horizontales + Topografía + Agua */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "32px" }}>

            {/* Barras horizontales — Superficie */}
            <div style={{ background: "#f8faf8", borderRadius: "14px", padding: "28px", border: "1px solid #eef0ee" }}>
              <h3 style={{ color: "#1b4332", fontSize: "14px", fontWeight: 700, margin: "0 0 4px" }}>Superficie por Tipo</h3>
              <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 20px" }}>Hectáreas por categoría</p>
              {(() => {
                const data = [
                  { tipo: "Pecuario", val: 0, color: "#136442" },
                  { tipo: "Agrícola", val: 0, color: "#1e8a5a" },
                  { tipo: "Mixto", val: 0, color: "#27a869" },
                  { tipo: "Forestal", val: 0, color: "#4ade80" },
                ];
                const maxV = Math.max(...data.map(d => d.val), 1);
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {data.map(d => (
                      <div key={d.tipo}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#555", fontWeight: 500 }}>{d.tipo}</span>
                          <span style={{ fontSize: "12px", color: "#136442", fontWeight: 700 }}>{d.val} ha</span>
                        </div>
                        <div style={{ background: "#eef0ee", borderRadius: "8px", height: "10px", overflow: "hidden" }}>
                          <div style={{
                            width: `${(d.val / maxV) * 100}%`, height: "100%",
                            background: d.color, borderRadius: "8px",
                            minWidth: d.val > 0 ? "4px" : "0",
                            transition: "width 1s ease",
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Dona SVG — Topografía */}
            <div style={{ background: "#f8faf8", borderRadius: "14px", padding: "28px", border: "1px solid #eef0ee" }}>
              <h3 style={{ color: "#1b4332", fontSize: "14px", fontWeight: 700, margin: "0 0 4px" }}>Topografía</h3>
              <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 12px" }}>Distribución por relieve</p>
              {(() => {
                const data = [
                  { name: "Plano", value: 60, color: "#136442" },
                  { name: "Ondulado", value: 28, color: "#4ade80" },
                  { name: "Quebrado", value: 12, color: "#bbf7d0" },
                ];
                const cx = 110, cy = 100, r = 72, ri = 44;
                let angle = -90;
                const toRad = d => (d * Math.PI) / 180;
                const slices = data.map(d => {
                  const deg = (d.value / 100) * 360;
                  const start = angle; angle += deg;
                  return { ...d, start, end: angle };
                });
                const arc = (cx, cy, r, s, e) => {
                  const x1 = cx + r * Math.cos(toRad(s)), y1 = cy + r * Math.sin(toRad(s));
                  const x2 = cx + r * Math.cos(toRad(e)), y2 = cy + r * Math.sin(toRad(e));
                  const large = e - s > 180 ? 1 : 0;
                  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
                };
                return (
                  <div>
                    <svg width="220" height="200">
                      {slices.map((s, i) => (
                        <path key={i}
                          d={`${arc(cx, cy, r, s.start, s.end)} L ${cx + ri * Math.cos(toRad(s.end))} ${cy + ri * Math.sin(toRad(s.end))} A ${ri} ${ri} 0 ${s.end - s.start > 180 ? 1 : 0} 0 ${cx + ri * Math.cos(toRad(s.start))} ${cy + ri * Math.sin(toRad(s.start))} Z`}
                          fill={s.color}
                        />
                      ))}
                      <circle cx={cx} cy={cy} r={ri - 2} fill="#f8faf8" />
                      {slices.map((s, i) => {
                        const mid = (s.start + s.end) / 2;
                        const lx = cx + (r * 0.65) * Math.cos(toRad(mid));
                        const ly = cy + (r * 0.65) * Math.sin(toRad(mid));
                        return <text key={i} x={lx} y={ly} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700" dominantBaseline="middle">{s.value}%</text>;
                      })}
                    </svg>
                    <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "8px" }}>
                      {data.map(d => (
                        <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: d.color }} />
                          <span style={{ fontSize: "11px", color: "#666" }}>{d.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Barras SVG — Fuente de agua */}
            <div style={{ background: "#f8faf8", borderRadius: "14px", padding: "28px", border: "1px solid #eef0ee" }}>
              <h3 style={{ color: "#1b4332", fontSize: "14px", fontWeight: 700, margin: "0 0 4px" }}>Fuente de Agua</h3>
              <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 16px" }}>Disponibilidad hídrica</p>
              {(() => {
                const data = [
                  { fuente: "Río", val: 0, color: "#136442" },
                  { fuente: "Pozo", val: 0, color: "#1e8a5a" },
                  { fuente: "Lluvia", val: 0, color: "#27a869" },
                  { fuente: "Riego", val: 0, color: "#86efac" },
                ];
                const maxV = Math.max(...data.map(d => d.val), 1);
                const w = 240, h = 160, padL = 8, padR = 8, padT = 10, padB = 28;
                const barW = (w - padL - padR) / data.length;
                return (
                  <svg width="100%" viewBox={`0 0 ${w} ${h + padB}`}>
                    {[0, 25, 50, 75, 100].map(v => {
                      const y = padT + (h - padT) * (1 - v / 100);
                      return <line key={v} x1={padL} x2={w - padR} y1={y} y2={y} stroke="#f0f0f0" strokeWidth="1" />;
                    })}
                    {data.map((d, i) => {
                      const barH = Math.max(((d.val / maxV) * (h - padT - 4)), 4);
                      const x = padL + i * barW + barW * 0.15;
                      const bw = barW * 0.7;
                      const y = padT + (h - padT) - barH;
                      return (
                        <g key={d.fuente}>
                          <rect x={x} y={y} width={bw} height={barH} fill={d.color} rx="4" />
                          <text x={x + bw / 2} y={h + padT + 16} textAnchor="middle" fontSize="10" fill="#999">{d.fuente}</text>
                        </g>
                      );
                    })}
                    <line x1={padL} x2={w - padR} y1={h + padT} y2={h + padT} stroke="#e0e0e0" strokeWidth="1" />
                  </svg>
                );
              })()}
            </div>
          </div>

          {/* Municipios */}
          <div style={{ background: "#f8faf8", borderRadius: "14px", padding: "28px 32px", border: "1px solid #eef0ee" }}>
            <h3 style={{ color: "#1b4332", fontSize: "15px", fontWeight: 700, margin: "0 0 20px" }}>
              Municipios del estado Barinas — Cobertura del sistema
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {[
                { nombre: "Barinas", predios: 0 },
                { nombre: "Obispos", predios: 0 },
                { nombre: "Cruz Paredes", predios: 0 },
                { nombre: "Bolívar", predios: 0 },
                { nombre: "Rojas", predios: 0 },
                { nombre: "Pedraza", predios: 0 },
                { nombre: "Sucre", predios: 0 },
                { nombre: "Arismendi", predios: 0 },
                { nombre: "Antonio José de Sucre", predios: 0 },
                { nombre: "Sosa", predios: 0 },
                { nombre: "Ezequiel Zamora", predios: 0 },
              ].map((m) => (
                <div key={m.nombre} style={{
                  background: "#fff", border: "1px solid #d4edda", borderRadius: "20px",
                  padding: "6px 16px", display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#136442" }} />
                  <span style={{ fontSize: "12px", color: "#136442", fontWeight: 500 }}>{m.nombre}</span>
                  <span style={{ fontSize: "11px", color: "#aaa", borderLeft: "1px solid #eee", paddingLeft: "8px" }}>
                    {m.predios} predios
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{
        background: "#0a3d24", color: "rgba(255,255,255,0.45)",
        padding: "28px 80px", display: "flex",
        justifyContent: "space-between", alignItems: "center", fontSize: "13px",
      }}>
        <span>© 2026 Sistema Digital Agropecuario, Estado Barinas.</span>
        <span style={{ fontSize: "12px" }}>Administrado por el MPPAT · Todos los dereccios reservados</span>
      </footer>

    </div>
  );
}