import logo from "../../assets/logo.png";
import escudo from "../../assets/escudo.png";
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


      {/* HERO */}
      <div style={{
        background: "linear-gradient(120deg, #0d4a2f 0%, #136442 60%, #1a7a50 100%)",
        padding: "80px",
        color: "#fff"
      }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
          Estadísticas Agropecuarias
        </h1>

        <p style={{ opacity: 0.85 }}>
          Panel de estadísticas del registro de predios agropecuarios del
          estado Barinas.
        </p>
      </div>


      {/* TARJETAS DE ESTADÍSTICAS */}
      <div style={{
        padding: "60px 80px",
        background: "#f5f7f5"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "24px"
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              borderBottom: "4px solid #136442"
            }}>
              <div style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#136442",
                marginBottom: "8px"
              }}>
                {stat.numero}
              </div>

              <div style={{
                fontSize: "14px",
                color: "#666"
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* GRÁFICOS */}
      <div style={{ padding: "60px 80px", background: "#fff" }}>
        <h2 style={{ marginBottom: "30px", color: "#1b4332" }}>
          Distribución de Predios
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px"
        }}>

          {/* GRÁFICO 1 */}
          <div style={{
            background: "#f5f7f5",
            padding: "30px",
            borderRadius: "12px"
          }}>
            <h3 style={{ marginBottom: "20px", color: "#136442" }}>
              Predios por Municipio
            </h3>

            <div style={{
              height: "220px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999"
            }}>
              Aquí irá un gráfico
            </div>
          </div>


          {/* GRÁFICO 2 */}
          <div style={{
            background: "#f5f7f5",
            padding: "30px",
            borderRadius: "12px"
          }}>
            <h3 style={{ marginBottom: "20px", color: "#136442" }}>
              Superficie Registrada
            </h3>

            <div style={{
              height: "220px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999"
            }}>
              Aquí irá un gráfico
            </div>
          </div>

        </div>
      </div>


      {/* TABLA MUNICIPIOS */}
      <div style={{ padding: "60px 80px", background: "#f5f7f5" }}>
        <h2 style={{ marginBottom: "30px", color: "#1b4332" }}>
          Predios por Municipio
        </h2>

        <div style={{
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}>

          <table style={{
            width: "100%",
            borderCollapse: "collapse"
          }}>
            <thead style={{ background: "#136442", color: "#fff" }}>
              <tr>
                <th style={{ padding: "14px", textAlign: "left" }}>Municipio</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Predios</th>
              </tr>
            </thead>

            <tbody>
              {municipios.map((m) => (
                <tr key={m.nombre} style={{
                  borderBottom: "1px solid #eee"
                }}>
                  <td style={{ padding: "14px" }}>{m.nombre}</td>
                  <td style={{ padding: "14px" }}>{m.predios}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>


      {/* FOOTER */}
      <footer style={{
        background: "#0f2d1f",
        color: "rgba(255,255,255,0.5)",
        padding: "24px 80px",
        textAlign: "center",
        fontSize: "13px"
      }}>
        © 2026 Ecosistema Digital Agropecuario, Estado Barinas.
      </footer>

    </div>
  );
}