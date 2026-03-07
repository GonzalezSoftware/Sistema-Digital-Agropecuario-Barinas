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
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button onClick={() => navigate("/predios/login")} style={{
            background: "#136442", border: "none", color: "#fff",
            padding: "8px 20px", borderRadius: "6px", cursor: "pointer",
            fontWeight: 600, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
          }}>
            Iniciar Sesión
          </button>
          <button onClick={() => navigate("/predios/registro")} style={{
            background: "none", border: "1.5px solid #136442", color: "#136442",
            padding: "8px 20px", borderRadius: "6px", cursor: "pointer",
            fontWeight: 600, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
          }}>
            Registrarse
          </button>
          <button onClick={() => navigate("/")} style={{
            background: "none", border: "1.5px solid #aaa", color: "#666",
            padding: "8px 20px", borderRadius: "6px", cursor: "pointer",
            fontWeight: 500, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
          }}>
            ← Portal
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        position: "relative", height: "480px", overflow: "hidden",
        display: "flex", alignItems: "center",
        background: "linear-gradient(120deg, #0d4a2f 0%, #136442 60%, #1a7a50 100%)",
      }}>
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
          alt="Predios"
          style={{
            position: "absolute", right: 0, top: 0,
            width: "55%", height: "100%",
            objectFit: "cover", opacity: 0.35,
            clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 2, padding: "0 80px", maxWidth: "620px" }}>
          <span style={{
            fontSize: "12px", fontWeight: 600, letterSpacing: "2px",
            textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
          }}>
            Módulo de Gestión Territorial
          </span>
          <h1 style={{ color: "#fff", fontSize: "40px", fontWeight: 700, lineHeight: 1.2, margin: "10px 0 16px" }}>
            Registro y Caracterización<br />de Predios Agropecuarios
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", lineHeight: 1.7, margin: "0 0 32px", maxWidth: "480px" }}>
            Plataforma oficial para el registro, caracterización y gestión de predios
            agropecuarios del <strong style={{ color: "#fff" }}>estado Barinas</strong>.
            Accede con tu cuenta o regístrate como productor.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <button onClick={() => navigate("/predios/login")} style={{
              backgroundColor: "#fff", color: "#136442", padding: "13px 32px",
              borderRadius: "6px", border: "none", fontWeight: 700, fontSize: "14px",
              cursor: "pointer", fontFamily: "'Poppins', sans-serif",
            }}>
              Iniciar Sesión
            </button>
            <button onClick={() => navigate("/predios/registro")} style={{
              backgroundColor: "transparent", color: "#fff", padding: "13px 32px",
              borderRadius: "6px", border: "2px solid rgba(255,255,255,0.6)",
              fontWeight: 600, fontSize: "14px", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
            }}>
              Registrarse como Productor
            </button>
          </div>
        </div>
      </div>

      {/* CÓMO FUNCIONA */}
      <div style={{ padding: "64px 80px", background: "#f5f7f5" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <span style={{ color: "#136442", fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
            ¿Cómo funciona?
          </span>
          <h2 style={{ color: "#1b4332", fontSize: "26px", margin: "10px 0 40px" }}>
            Tres pasos para registrar tu predio
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {[
              {
                numero: "01",
                title: "Crea tu cuenta",
                desc: "Regístrate como productor con tu cédula, nombre completo y datos de contacto.",
                icon: "👤",
              },
              {
                numero: "02",
                title: "Registra tu predio",
                desc: "Ingresa la información catastral, ubicación GPS, superficie y características del terreno.",
                icon: "📋",
              },
              {
                numero: "03",
                title: "Gestiona tu información",
                desc: "Consulta, edita y descarga la ficha técnica de tus predios en cualquier momento.",
                icon: "📁",
              },
            ].map((paso) => (
              <div key={paso.numero} style={{
                background: "#fff", borderRadius: "12px", padding: "32px 28px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                borderTop: "4px solid #136442",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "28px" }}>{paso.icon}</span>
                  <span style={{ fontSize: "32px", fontWeight: 700, color: "#e0ede6" }}>{paso.numero}</span>
                </div>
                <h3 style={{ color: "#1b4332", fontSize: "16px", margin: "0 0 10px", fontWeight: 700 }}>
                  {paso.title}
                </h3>
                <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  {paso.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FUNCIONALIDADES */}
      <div style={{ padding: "64px 80px", background: "#fff" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <span style={{ color: "#136442", fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Funcionalidades
          </span>
          <h2 style={{ color: "#1b4332", fontSize: "26px", margin: "10px 0 40px" }}>
            Todo lo que puedes gestionar
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
            {[
              {
                img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80",
                title: "Registro de Predios",
                desc: "Información catastral, superficie, uso del suelo y características físico-naturales.",
              },
              {
                img: "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=600&q=80",
                title: "Mapa Interactivo",
                desc: "Visualiza la ubicación de tus predios en el mapa con coordenadas GPS precisas.",
              },
              {
                img: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&q=80",
                title: "Galería de Imágenes",
                desc: "Sube y gestiona fotografías de tus predios para documentación visual.",
              },
              {
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
                title: "Reportes y Fichas",
                desc: "Genera fichas técnicas en PDF y exporta datos a Excel por municipio.",
              },
            ].map((card) => (
              <div key={card.title} style={{
                background: "#fff", borderRadius: "12px", overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                transition: "transform 0.2s, box-shadow 0.2s",
                border: "1px solid #f0f0f0",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(19,100,66,0.12)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
                }}
              >
                <div style={{ height: "150px", overflow: "hidden" }}>
                  <img src={card.img} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "20px" }}>
                  <h3 style={{ color: "#136442", fontSize: "15px", margin: "0 0 8px", fontWeight: 700 }}>
                    {card.title}
                  </h3>
                  <p style={{ color: "#666", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div style={{ padding: "56px 80px", background: "#f5f7f5" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "#1b4332", fontSize: "24px", marginBottom: "40px" }}>
            Predios registrados en el estado Barinas
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {[
              { numero: "0", label: "Predios Registrados", color: "#136442" },
              { numero: "0 ha", label: "Superficie Total", color: "#136442" },
              { numero: "11", label: "Municipios", color: "#136442" },
              { numero: "0", label: "Productores", color: "#136442" },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: "#fff", borderRadius: "12px", padding: "28px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderBottom: "3px solid #136442",
              }}>
                <div style={{ fontSize: "30px", fontWeight: 700, color: stat.color, marginBottom: "8px" }}>
                  {stat.numero}
                </div>
                <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
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