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

const NAV_ITEMS = [
  { label: "Sobre Nosotros", href: "#sobre-nosotros" },
  { label: "Registro de Predios", href: "/predios", isRoute: true },
  { label: "Producción Animal y Vegetal", href: "/produccion", isRoute: true },
  { label: "Estadísticas Generales", href: "/estadística-portalinfo", isRoute: true },
  { label: "Contactos", href: "#contactos" },
];

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
          <button className="nav-btn-primary" onClick={() => navigate("/produccion/login")} style={{
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
              title: "Dashboard de Producción",
              img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
              desc: "Centro de monitoreo institucional que consolida indicadores estratégicos como total de predios, productores, superficie productiva, existencia animal, producción vegetal, municipios atendidos, asistencia técnica, necesidades frecuentes y últimas actualizaciones."
            },
            {
              title: "Selección de Predio",
              img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80",
              desc: "Permite seleccionar el predio sobre el cual se trabajará. Todas las operaciones posteriores quedan asociadas al productor y al predio seleccionado para garantizar trazabilidad y consistencia de la información."
            },
            {
              title: "Caracterización Productiva",
              img: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=600&q=80",
              desc: "Registro inicial de las condiciones generales del predio, incluyendo existencia animal, producción vegetal y maquinaria disponible. Esta información sirve como línea base para el seguimiento institucional."
            },
            {
              title: "Producción General",
              img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80",
              desc: "Registro de volúmenes de producción animal, vegetal y agroindustrial, permitiendo documentar rendimientos, cosechas, producción de leche, carne, queso, huevos, miel y otros productos."
            },
            {
              title: "Sanidad y Asistencia Técnica",
              img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80",
              desc: "Gestión de vacunaciones, desparasitaciones, enfermedades reportadas, mortalidad, visitas técnicas, capacitaciones, inspecciones y recomendaciones realizadas al productor."
            },
            {
              title: "Necesidades del Productor",
              img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
              desc: "Registro y clasificación de requerimientos productivos como financiamiento, semillas, fertilizantes, maquinaria, combustible, vialidad, riego y medicamentos veterinarios según su nivel de prioridad."
            },
            {
              title: "Actualización Productiva",
              img: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80",
              desc: "Permite registrar cambios posteriores a la caracterización inicial, como incremento de animales, adquisición de maquinaria, ampliación de superficie, mejoras de infraestructura o cambios de rubros productivos."
            },
            {
              title: "Reportes y Estadísticas",
              img: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80",
              desc: "Generación de reportes por ubicación, producción, recursos y estadísticas generales para apoyar la toma de decisiones institucionales del MPPAT."
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
            El módulo de Producción Agropecuaria del Ministerio del Poder Popular para la Agricultura Productiva y Tierras (MPPAT)
            permite caracterizar, monitorear y actualizar la información productiva de los predios registrados, consolidando datos
            sobre producción animal, vegetal, agroindustrial, asistencia técnica, necesidades de los productores y estadísticas
            institucionales para la toma de decisiones estratégicas.
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
                texto: "Acceder al Dashboard de Producción para visualizar indicadores institucionales y estadísticas generales.",
              },
              {
                num: "2",
                texto: "Seleccionar el predio registrado sobre el cual se realizará la gestión productiva.",
              },
              {
                num: "3",
                texto: "Registrar o consultar caracterización, producción, asistencia técnica, necesidades y actualizaciones productivas.",
              },
              {
                num: "4",
                texto: "Generar reportes, estadísticas territoriales y análisis para la toma de decisiones institucionales.",
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
                title: "Caracterización Productiva",
                desc: "Registro inicial de existencia animal, producción vegetal, infraestructura y maquinaria disponible en el predio."
              },
              {
                title: "Producción y Seguimiento",
                desc: "Control de producción animal, vegetal y agroindustrial, asistencia técnica, sanidad y necesidades del productor."
              },
              {
                title: "Reportes y Estadísticas",
                desc: "Generación de indicadores institucionales, análisis territoriales, reportes productivos y seguimiento histórico."
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