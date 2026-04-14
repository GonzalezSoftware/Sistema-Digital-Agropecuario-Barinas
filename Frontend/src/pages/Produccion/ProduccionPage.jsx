import logo from "../../assets/logo.png";
import escudo from "../../assets/escudo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

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

const IconCheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#136442" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);


export default function GestionProductivaPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", margin: 0, padding: 0 }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center",
        padding: "0 48px", height: "68px", backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100,
        gap: "24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", cursor: "pointer" }}
          onClick={() => navigate("/")}>
          <img src={escudo} alt="Escudo" style={{ height: 58 }} />
          <img src={logo} alt="Logo" style={{ height: 52 }} />
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
            Registrar Productor
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
        
        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=80"
          alt="Producción Agropecuaria"
          style={{
            position: "absolute", right: 0, top: 0,
            width: "55%", height: "100%",
            objectFit: "cover", opacity: 0.4,
            clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        />

                <div style={{ position: "relative", zIndex: 3, padding: "0 80px", maxWidth: "640px", animation: "fadeInUp 0.8s ease" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.1)", borderRadius: "20px",
            padding: "6px 14px", marginBottom: "20px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>
              Módulo de Gestión Territorial — ASOGABA
            </span>
          </div>
          <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: 700, lineHeight: 1.15, margin: "0 0 18px" }}>
             Gestión y Administración<br />
            <span style={{ color: "#86efac" }}>de la Producción Agropecuaria</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", lineHeight: 1.8, margin: "0 0 36px", maxWidth: "500px" }}>
             Administra y controla la producción agrícola y pecuaria de los predios del estado
             Barinas. Registra rubros productivos, animales, ciclos reproductivos, producción y
             datos técnicos que permiten mejorar la toma de decisiones del productor.
          </p>
          <div style={{ display: "flex", gap: "14px" }}>
            <button className="hero-btn-primary"
              onClick={() => document.getElementById('como-funciona').scrollIntoView({ behavior: 'smooth' })}
              style={{
                backgroundColor: "#fff", color: "#136442", padding: "13px 28px",
                borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "14px",
                cursor: "pointer", fontFamily: "'Poppins', sans-serif",
              }}>
              ¿Para que Sirve?
            </button>
          </div>
        </div>
      
      </div>
      

      

      

{/* FUNCIONES - TABS */}
<div style={{ padding: "56px 80px", background: "#f5f7f5" }}>
<span style={{ color: "#136442", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
            ¿Para que Sirve?
          </span>
          <h2 style={{ color: "#1b4332", fontSize: "28px", margin: "10px 0 8px", fontWeight: 700 }}>
            Funciones del Sistema
          </h2>
          <p style={{ color: "#777", fontSize: "14px", marginBottom: "48px", lineHeight: 1.7, maxWidth: "500px" }}>
            Cada productor tendrá disponible las siguientes funciones para una mejor Gestión y Adminitración de su Producción Agropecuaria en base a sus predios.
          </p>

  {(() => {

    const funciones = [
      {
        title: "Registro de Producción",
        img: "https://images.unsplash.com/photo-1592982537447-6f2a6a0d58c2?w=600&q=80",
        desc: "Registra rubros agrícolas, cultivos y especies animales presentes en cada predio."
      },
      {
        title: "Control Reproductivo",
        img: "https://images.unsplash.com/photo-1603484477859-abe6a73f9364?w=600&q=80",
        desc: "Administra ciclos reproductivos del ganado incluyendo montas, partos y diagnósticos."
      },
      {
        title: "Sanidad Animal",
        img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&q=80",
        desc: "Registra vacunas, enfermedades, tratamientos y controles sanitarios del hato."
      },
      {
        title: "Gestión de Cultivos",
        img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80",
        desc: "Controla siembras, condiciones de cultivo, fertilización y producción agrícola."
      },
      {
        title: "Uso de Insumos",
        img: "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=600&q=80",
        desc: "Registra fertilizantes, alimentos, medicamentos y otros insumos utilizados."
      },
      {
        title: "Historial Productivo",
        img: "https://images.unsplash.com/photo-1554224155-1696413565d3?w=600&q=80",
        desc: "Consulta el historial completo de producción vegetal y animal del predio."
      },
      {
        title: "Indicadores Productivos",
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
        desc: "Calcula automáticamente indicadores técnicos de rendimiento agrícola y pecuario."
      },
      {
        title: "Alertas Productivas",
        img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80",
        desc: "Detecta problemas productivos como baja producción, enfermedades o retrasos."
      }
    ];

    const [tab, setTab] = useState(0);

    return (

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* PESTAÑAS */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "30px"
        }}>

          {funciones.map((f, index) => (
            <button
              key={index}
              onClick={() => setTab(index)}
              style={{
                padding: "10px 18px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                background: tab === index ? "#2d6a4f" : "#e6efe9",
                color: tab === index ? "#fff" : "#1b4332",
                transition: "0.2s"
              }}
            >
              {f.title}
            </button>
          ))}

        </div>

        {/* CONTENIDO */}
        <div style={{
          background: "#fff",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr"
        }}>

          <div style={{ height: "320px" }}>
            <img
              src={funciones[tab].img}
              alt={funciones[tab].title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </div>

          <div style={{
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>

            <h3 style={{
              color: "#136442",
              fontSize: "20px",
              marginBottom: "16px"
            }}>
              {funciones[tab].title}
            </h3>

            <p style={{
              color: "#555",
              fontSize: "15px",
              lineHeight: 1.7
            }}>
              {funciones[tab].desc}
            </p>

          </div>

        </div>

      </div>

    );

  })()}

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
            El proceso es sencillo. Personal técnico de ASOGABA se encargará de todo el registro
            de manera oficial y verificada. Solo debes seguir estos pasos:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "48px" }}>
            {[
              { num: "1", texto: "Comunícate con ASOGABA por teléfono o correo electrónico.", check: true },
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
      <div style={{ padding: "56px 80px", background: "#fff" }}>

        <h2 style={{
          textAlign: "center",
          color: "#1b4332",
          fontSize: "24px",
          marginBottom: "40px"
        }}>
          Resumen Productivo
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "24px",
          maxWidth: "900px",
          margin: "0 auto",
        }}>

          {[
            { numero: "0", label: "Rubros Agrícolas", icon: "🌱" },
            { numero: "0", label: "Animales Registrados", icon: "🐄" },
            { numero: "0", label: "Producciones Registradas", icon: "📊" },
            { numero: "0", label: "Alertas Activas", icon: "⚠️" },
          ].map((stat) => (

            <div key={stat.label} style={{
              background: "#f5f7f5",
              borderRadius: "12px",
              padding: "28px 20px",
              textAlign: "center",
              border: "1px solid #e8e8e8",
            }}>

              <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                {stat.icon}
              </div>

              <div style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#136442",
                marginBottom: "6px"
              }}>
                {stat.numero}
              </div>

              <div style={{ fontSize: "13px", color: "#666" }}>
                {stat.label}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{
        background: "#0f2d1f",
        color: "rgba(255,255,255,0.5)",
        padding: "24px 80px",
        display: "flex",
        justifyContent: "center",
        fontSize: "13px",
      }}>
        <span>
          © 2026 Ecosistema Digital Agropecuario, Estado Barinas. Todos los derechos reservados.
        </span>
      </footer>

    </div>
  );
}