import logo from "../../assets/logo.png";
import escudo from "../../assets/gobierno.jpg";
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
          <img src={escudo} alt="Escudo" style={{ height: 45 }} />
          <img src={logo} alt="Logo" style={{ height: 35 }} />
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
            Registrar Produccion
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
              Módulo de Gestión Territorial — MPPAT
            </span>
          </div>
          <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: 700, lineHeight: 1.15, margin: "0 0 18px" }}>
             Gestión y Administración<br />
            <span style={{ color: "#86efac" }}>de la Producción Agropecuaria</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", lineHeight: 1.8, margin: "0 0 36px", maxWidth: "500px" }}>
             Administra y controla la producción agrícola y pecuaria de los predios del estado
             Barinas en coordinación con el Ministerio del Poder Popular para la Agricultura Productiva y Tierras. 
             Registra rubros productivos, animales, ciclos reproductivos y datos técnicos que permiten mejorar la toma de decisiones y fortalecer el control institucional.
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


      

{/* FUNCIONES - PORTAL INFORMATIVO */}
<div style={{ padding: "56px 80px", background: "#f5f7f5" }}>

  <span style={{
    color: "#136442",
    fontWeight: 600,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "2px"
  }}>
    Capacidades del Sistema
  </span>

  <h2 style={{
    color: "#1b4332",
    fontSize: "28px",
    margin: "10px 0 8px",
    fontWeight: 700
  }}>
    Funcionalidades del Módulo de Producción
  </h2>

  <p style={{
    color: "#777",
    fontSize: "14px",
    marginBottom: "48px",
    lineHeight: 1.7,
    maxWidth: "600px"
  }}>
    Este módulo permite al Ministerio del Poder Popular para la Agricultura Productiva y Tierras (MPPAT)
    gestionar, controlar y analizar la producción agropecuaria de los predios registrados,
    integrando información técnica, productiva, económica y sanitaria para la toma de decisiones.
  </p>

  {(() => {

    const funciones = [
      {
        title: "Producción Vegetal",
        img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80",
        desc: "Registro y control de cultivos, siembras, cosechas, manejo agronómico y rendimiento por hectárea."
      },
      {
        title: "Producción Animal",
        img: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=600&q=80",
        desc: "Gestión de inventario animal, producción pecuaria, alimentación, sanidad y control reproductivo."
      },
      {
        title: "Planificación Productiva",
        img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80",
        desc: "Permite planificar ciclos agrícolas y pecuarios, estimando producción y recursos necesarios."
      },
      {
        title: "Gestión Económica",
        img: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80",
        desc: "Control de costos, ingresos y análisis de rentabilidad de la producción agropecuaria."
      },
      {
        title: "Trazabilidad Productiva",
        img: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80",
        desc: "Seguimiento detallado de la producción desde su origen, insumos utilizados y destino final."
      },
      {
        title: "Control de Insumos",
        img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
        desc: "Gestión de fertilizantes, alimentos, medicamentos y recursos utilizados en el predio."
      },
      {
        title: "Indicadores y Análisis",
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
        desc: "Generación automática de indicadores productivos, rendimiento y estadísticas del sistema."
      },
      {
        title: "Alertas y Seguimiento",
        img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80",
        desc: "Detección de problemas productivos, sanitarios o de rendimiento para acciones oportunas."
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


{/* FLUJO DEL MÓDULO DE PRODUCCIÓN */}
<div id="modulo-produccion-info" style={{ padding: "72px 80px", background: "#f8faf8" }}>

  <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

    <span style={{
      color: "#136442",
      fontWeight: 600,
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "2px"
    }}>
      Módulo de Producción Agropecuaria
    </span>

    <h2 style={{
      fontSize: "28px",
      fontWeight: 700,
      margin: "10px 0 8px",
      color: "#1b4332"
    }}>
      ¿Cómo funciona el sistema?
    </h2>

    <p style={{
      color: "#777",
      fontSize: "14px",
      lineHeight: 1.7,
      maxWidth: "650px",
      marginBottom: "48px"
    }}>
      El módulo de producción del sistema del Ministerio del Poder Popular para la Agricultura Productiva y Tierras (MPPAT)
      permite gestionar de forma integral la producción vegetal y animal de cada predio, registrando datos técnicos,
      productivos, económicos y sanitarios para su análisis y control.
    </p>

    {/* PASOS DEL FLUJO */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "20px",
      marginBottom: "48px"
    }}>

      {[
        {
          num: "1",
          texto: "Iniciar Sesion y Acceder al dashboard del módulo de producción agropecuaria.",
        },
        {
          num: "2",
          texto: "Seleccionar el predio previamente registrado en el sistema.",
        },
        {
          num: "3",
          texto: "Registrar producción vegetal o producción animal según corresponda.",
        },
        {
          num: "4",
          texto: "Consultar indicadores, reportes, trazabilidad y análisis productivo.",
        }
      ].map((paso) => (
        <div key={paso.num} style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "24px 20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          border: "1px solid #eef0ee",
          borderTop: "3px solid #136442",
        }}>

          <div style={{
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            background: "#e8f5e9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "14px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#136442",
          }}>
            {paso.num}
          </div>

          <p style={{
            color: "#555",
            fontSize: "13px",
            lineHeight: 1.7,
            margin: 0
          }}>
            {paso.texto}
          </p>

        </div>
      ))}

    </div>

    {/* SUBSISTEMAS DEL MODULO */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px"
    }}>

      {[
        {
          title: "Producción Vegetal",
          desc: "Registro de cultivos, siembra, cosecha, rendimiento y manejo agronómico."
        },
        {
          title: "Producción Animal",
          desc: "Control de inventario pecuario, sanidad, reproducción y producción."
        },
        {
          title: "Gestión Integral",
          desc: "Trazabilidad, indicadores, análisis económico y reportes del sistema."
        }
      ].map((item) => (
        <div key={item.title} style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "26px 22px",
          border: "1px solid #eef0ee",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
        }}>

          <h3 style={{
            color: "#136442",
            fontSize: "15px",
            marginBottom: "10px"
          }}>
            {item.title}
          </h3>

          <p style={{
            color: "#555",
            fontSize: "13px",
            lineHeight: 1.6
          }}>
            {item.desc}
          </p>

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
          { numero: "0", label: "Predios Registrados", icon: "📍" },
          { numero: "0", label: "Productores Activos", icon: "👨‍🌾" },
          { numero: "0", label: "Producción Total", icon: "📊" },
          { numero: "0", label: "Superficie Cultivada", icon: "🌾" },
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