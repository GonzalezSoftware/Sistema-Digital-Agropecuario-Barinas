import logo from "../../assets/logo.png";
import escudo from "../../assets/escudo.png";
import { useNavigate } from "react-router-dom";


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
          <strong style={{ color: "#589e38", fontStyle: "normal" }}>Venezuela</strong>
        </span>

        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => navigate("/")} style={{
            background: "none", border: "1.5px solid #589e38", color: "#589e38",
            padding: "8px 20px", borderRadius: "6px", cursor: "pointer",
            fontWeight: 600, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
          }}>
            ← Volver al Portal
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        position: "relative", height: "340px", overflow: "hidden",
        display: "flex", alignItems: "center",
        background: "linear-gradient(120deg, #136442 0%, #1e8a5a 60%, #27a869 100%)",
      }}>
        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=80"
          alt="Producción Agropecuaria"
          style={{
            position: "absolute", right: 0, top: 0,
            width: "55%", height: "100%",
            objectFit: "cover", opacity: 0.4,
            clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, padding: "0 80px", maxWidth: "580px" }}>
          <span style={{
            fontSize: "12px", fontWeight: 600, letterSpacing: "2px",
            textTransform: "uppercase", color: "rgba(255,255,255,0.7)",
          }}>
            Módulo de Gestión
          </span>

          <h1 style={{
            color: "#fff", fontSize: "38px",
            fontWeight: 700, lineHeight: 1.2,
            margin: "10px 0 16px"
          }}>
            Gestión Productiva Agropecuaria
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "15px",
            lineHeight: 1.6,
            margin: "0 0 28px"
          }}>
            Administra y controla la producción agrícola y pecuaria de los predios
            del estado Barinas. Registra rubros productivos, animales, ciclos
            reproductivos, producción y datos técnicos que permiten mejorar la
            toma de decisiones del productor.
          </p>

          <button style={{
            backgroundColor: "#fff",
            color: "#136442",
            padding: "12px 28px",
            borderRadius: "6px",
            border: "none",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
          }}>
            + Registrar Producción
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div style={{ padding: "56px 80px", background: "#f5f7f5" }}>

        <h2 style={{
          textAlign: "center",
          color: "#1b4332",
          fontSize: "24px",
          marginBottom: "40px"
        }}>
          Funciones del módulo productivo
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}>

          {[
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
            },
          ].map((card) => (

            <div key={card.title} style={{
              background: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(88,158,56,0.15)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
              }}
            >

              <div style={{ height: "150px", overflow: "hidden" }}>
                <img src={card.img} alt={card.title} style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }} />
              </div>

              <div style={{ padding: "20px" }}>
                <h3 style={{
                  color: "#136442",
                  fontSize: "15px",
                  margin: "0 0 8px",
                  fontWeight: 700
                }}>
                  {card.title}
                </h3>

                <p style={{
                  color: "#555",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {card.desc}
                </p>
              </div>

            </div>
          ))}
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