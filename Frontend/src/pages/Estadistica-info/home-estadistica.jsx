import logo from "../../assets/logo.png";
import escudo from "../../assets/escudo.png";
import bannerImg from "../../assets/banner.jpg";

const STATS = [
  { title: "Predios Registrados", value: "1,284", desc: "Unidades productivas registradas en el sistema." },
  { title: "Producción Ganadera", value: "85,420", desc: "Cabezas de ganado registradas en el estado." },
  { title: "Producción Vegetal", value: "12,950 ha", desc: "Hectáreas cultivadas en diferentes rubros." },
  { title: "Productores Activos", value: "3,642", desc: "Productores registrados en la plataforma." },
];

export default function EstadisticasPage() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        padding: "0 48px",
        height: "68px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img src={escudo} alt="Escudo" style={{ height: 55 }} />
          <img src={logo} alt="Logo" style={{ height: 50 }} />
        </div>

        <span style={{
          fontSize: "12px",
          color: "#888",
          marginLeft: "16px",
          borderLeft: "2px solid #e0e0e0",
          paddingLeft: "16px"
        }}>
          Estado Barinas <br />
          <strong style={{ color: "#589e38" }}>Venezuela</strong>
        </span>
      </nav>

      {/* HERO */}
      <div style={{
        position: "relative",
        height: "420px",
        display: "flex",
        alignItems: "center",
        padding: "0 80px",
        background: "linear-gradient(120deg,#136442,#589e38)"
      }}>

        <img
          src={bannerImg}
          alt="banner"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "55%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.4
          }}
        />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "550px" }}>
          <h1 style={{
            color: "#fff",
            fontSize: "38px",
            marginBottom: "20px"
          }}>
            Estadísticas Agropecuarias
            <br /> Estado Barinas
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "15px",
            lineHeight: 1.6
          }}>
            Visualiza datos consolidados de la actividad agropecuaria del
            estado Barinas. Información actualizada sobre producción,
            predios registrados y participación de productores.
          </p>
        </div>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div style={{
        padding: "70px 80px",
        background: "#f5f7f5"
      }}>

        <h2 style={{
          textAlign: "center",
          color: "#1b4332",
          marginBottom: "50px",
          fontSize: "28px"
        }}>
          Indicadores Generales
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          gap: "30px",
          maxWidth: "1100px",
          margin: "0 auto"
        }}>

          {STATS.map((stat) => (
            <div key={stat.title} style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "32px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              textAlign: "center"
            }}>

              <h3 style={{
                fontSize: "38px",
                color: "#589e38",
                margin: "0 0 10px"
              }}>
                {stat.value}
              </h3>

              <h4 style={{
                fontSize: "16px",
                color: "#1b4332",
                marginBottom: "10px"
              }}>
                {stat.title}
              </h4>

              <p style={{
                fontSize: "14px",
                color: "#666",
                lineHeight: 1.6
              }}>
                {stat.desc}
              </p>

            </div>
          ))}

        </div>
      </div>

      {/* SECCIÓN INFORMACIÓN */}
      <div style={{
        padding: "70px 80px",
        background: "#fff",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>

        <h2 style={{
          color: "#1b4332",
          fontSize: "28px",
          marginBottom: "20px"
        }}>
          Información del Sistema Estadístico
        </h2>

        <p style={{
          fontSize: "16px",
          color: "#555",
          lineHeight: 1.7
        }}>
          El Sistema Digital Agropecuario del Estado Barinas recopila
          información proveniente de productores registrados, instituciones
          agrícolas y registros territoriales para generar estadísticas
          confiables sobre la actividad productiva del estado.
        </p>

        <p style={{
          fontSize: "16px",
          color: "#555",
          lineHeight: 1.7,
          marginTop: "16px"
        }}>
          Estos datos permiten apoyar la toma de decisiones estratégicas,
          impulsar políticas agrícolas y fortalecer el desarrollo del
          sector agropecuario en la región llanera.
        </p>

      </div>

      {/* FOOTER SIMPLE */}
      <footer style={{
        background: "#fff",
        borderTop: "1px solid #e8e8e8",
        padding: "24px",
        textAlign: "center",
        fontSize: "13px",
        color: "#7c7c7c"
      }}>
        © 2026 Sistema Digital Agropecuario del Estado Barinas
      </footer>

    </div>
  );
}