import logo from "../../assets/logo.png";
import escudo from "../../assets/escudo.png";
import { useNavigate } from "react-router-dom";

export default function PrediosPage() {
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
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
          alt="Predios"
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
          <h1 style={{ color: "#fff", fontSize: "38px", fontWeight: 700, lineHeight: 1.2, margin: "10px 0 16px" }}>
            Registro de Predios
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.6, margin: "0 0 28px" }}>
            Administra y consulta los predios agropecuarios del estado Barinas.
            Registra información catastral, ubicación geográfica y datos del propietario.
          </p>
          <button style={{
            backgroundColor: "#fff", color: "#136442", padding: "12px 28px",
            borderRadius: "6px", border: "none", fontWeight: 700, fontSize: "14px",
            cursor: "pointer", fontFamily: "'Poppins', sans-serif",
          }}>
            + Registrar Nuevo Predio
          </button>
        </div>
      </div>

      {/* CARDS INFORMATIVAS */}
      <div style={{ padding: "56px 80px", background: "#f5f7f5" }}>
        <h2 style={{ textAlign: "center", color: "#1b4332", fontSize: "24px", marginBottom: "40px" }}>
          ¿Qué puedes hacer en este módulo?
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px", maxWidth: "1000px", margin: "0 auto",
        }}>
          {[
            {
              img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80",
              title: "Registrar Predios",
              desc: "Ingresa nuevos predios con toda su información catastral, superficie y ubicación.",
            },
            {
              img: "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=600&q=80",
              title: "Consultar Predios",
              desc: "Visualiza el listado completo de predios registrados con sus datos detallados.",
            },
            {
              img: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&q=80",
              title: "Gestionar Propietarios",
              desc: "Administra la información de los propietarios vinculados a cada predio.",
            },
            {
              img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
              title: "Reportes",
              desc: "Genera reportes por municipio, superficie total y distribución de predios.",
            },
          ].map((card) => (
            <div key={card.title} style={{
              background: "#fff", borderRadius: "12px", overflow: "hidden",
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
                  width: "100%", height: "100%", objectFit: "cover",
                }} />
              </div>
              <div style={{ padding: "20px" }}>
                <h3 style={{ color: "#136442", fontSize: "15px", margin: "0 0 8px", fontWeight: 700 }}>
                  {card.title}
                </h3>
                <p style={{ color: "#555", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ESTADÍSTICAS RÁPIDAS */}
      <div style={{ padding: "56px 80px", background: "#fff" }}>
        <h2 style={{ textAlign: "center", color: "#1b4332", fontSize: "24px", marginBottom: "40px" }}>
          Resumen de Predios Registrados
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "24px", maxWidth: "900px", margin: "0 auto",
        }}>
          {[
            { numero: "0", label: "Predios Registrados", icon: "🏡" },
            { numero: "0 ha", label: "Superficie Total", icon: "📐" },
            { numero: "11", label: "Municipios", icon: "📍" },
            { numero: "0", label: "Propietarios", icon: "👤" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "#f5f7f5", borderRadius: "12px", padding: "28px 20px",
              textAlign: "center", border: "1px solid #e8e8e8",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "26px", fontWeight: 700, color: "#136442", marginBottom: "6px" }}>
                {stat.numero}
              </div>
              <div style={{ fontSize: "13px", color: "#666" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{
        background: "#0f2d1f", color: "rgba(255,255,255,0.5)",
        padding: "24px 80px", display: "flex",
        justifyContent: "center", fontSize: "13px",
      }}>
        <span>© 2026 Ecosistema Digital Agropecuario, Estado Barinas. Todos los derechos reservados.</span>
      </footer>

    </div>
  );
}