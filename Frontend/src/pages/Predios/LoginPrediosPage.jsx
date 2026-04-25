import logo from "../../assets/gobierno.jpg";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";
import React from "react";

const USUARIOS = [
  { usuario: "admin", clave: "admin123", rol: "Administrador", nombre: "Carlos Pérez" },
  { usuario: "empleado", clave: "empleado123", rol: "Empleado MPPAT", nombre: "María González" },
];

export default function LoginPrediosPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = React.useState("");
  const [clave, setClave] = React.useState("");
  const [error, setError] = React.useState("");
  const [cargando, setCargando] = React.useState(false);
  const [verClave, setVerClave] = React.useState(false);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!usuario.trim()) { setError("Ingresa tu usuario."); return; }
    if (!clave.trim()) { setError("Ingresa tu contraseña."); return; }
    setCargando(true);
    await new Promise(r => setTimeout(r, 900));
    const encontrado = USUARIOS.find(u => u.usuario === usuario.trim() && u.clave === clave);
    if (encontrado) {
      sessionStorage.setItem("usuario_predios", JSON.stringify(encontrado));
      navigate("/predios/Dashboard");
    } else {
      setError("Usuario o contraseña incorrectos.");
      setCargando(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .input-login:focus {
          border-color: #136442 !important;
          box-shadow: 0 0 0 3px rgba(19,100,66,0.12) !important;
          outline: none;
        }
        .btn-login:hover:not(:disabled) {
          background: #0d4a2f !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(19,100,66,0.35) !important;
        }
        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
        .link-volver:hover  { color: #136442 !important; }
        .nav-btn-primary:hover { background: #0d4a2f !important; transform: translateY(-1px); }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: "flex", alignItems: "center",
        padding: "0 48px", height: "68px", backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100,
        gap: "24px", flexShrink: 0,
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
          <button className="nav-btn-primary" style={{
            background: "#136442", border: "none", color: "#fff",
            padding: "8px 22px", borderRadius: "6px", cursor: "pointer",
            fontWeight: 600, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
            transition: "all 0.2s",
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

      {/* ── DOS PANELES ── */}
      <div style={{ flex: 1, display: "flex" }}>

        {/* ── PANEL IZQUIERDO ── */}
        <div style={{
          width: "50%", position: "relative", overflow: "hidden",
          background: "linear-gradient(150deg, #0a3d24 0%, #136442 60%, #1a7a50 100%)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "56px 48px", gap: "28px",
        }}>
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
            alt="Predios"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.18,
            }}
          />

          {/* Badge */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.1)", borderRadius: "20px",
              padding: "6px 14px",
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
              <span style={{
                fontSize: "11px", fontWeight: 600, letterSpacing: "2px",
                textTransform: "uppercase", color: "rgba(255,255,255,0.8)"
              }}>
                Acceso Restringido
              </span>
            </div>
          </div>

          {/* Texto */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <h1 style={{
              color: "#fff", fontSize: "30px", fontWeight: 700,
              lineHeight: 1.2, margin: "0 0 16px"
            }}>
              Registro y Caracterización<br />
              <span style={{ color: "#86efac" }}>de Predios Agropecuarios</span>
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.65)", fontSize: "14px",
              lineHeight: 1.8, margin: 0, maxWidth: "380px"
            }}>
              Área exclusiva para personal autorizado de ASOGABA.
              Ingresa tus credenciales para acceder al sistema de gestión territorial.
            </p>
          </div>

          {/* Stats */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", gap: "14px" }}>
            {[
              { num: "11", label: "Municipios" },
              { num: "100%", label: "Verificado" },
              { num: "2", label: "Roles de acceso" },
            ].map(item => (
              <div key={item.label} style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px", padding: "14px 18px", textAlign: "center",
              }}>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>{item.num}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PANEL DERECHO ── */}
        <div style={{
          width: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          background: "#f8faf8", padding: "40px",
        }}>
          <div style={{ width: "100%", maxWidth: "400px", animation: "fadeInUp 0.5s ease" }}>

            {/* Encabezado */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{
                width: "54px", height: "54px", borderRadius: "14px",
                background: "#e8f5e9", display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: "18px",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="#136442" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <h2 style={{ color: "#1b4332", fontSize: "24px", fontWeight: 700, margin: "0 0 6px" }}>
                Iniciar sesión
              </h2>
              <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
                Ingresa tus credenciales de acceso
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={manejarLogin}>

              {/* Usuario */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block", fontSize: "13px", fontWeight: 600,
                  color: "#1b4332", marginBottom: "8px"
                }}>
                  Usuario
                </label>
                <div style={{ position: "relative" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{
                      position: "absolute", left: "14px", top: "50%",
                      transform: "translateY(-50%)", pointerEvents: "none"
                    }}>
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    className="input-login"
                    value={usuario}
                    onChange={e => { setUsuario(e.target.value); setError(""); }}
                    placeholder="Tu nombre de usuario"
                    autoComplete="username"
                    style={{
                      width: "100%", padding: "11px 14px 11px 42px",
                      border: "1.5px solid #e0e0e0", borderRadius: "10px",
                      fontSize: "14px", fontFamily: "'Poppins', sans-serif",
                      background: "#fff", color: "#333",
                      boxSizing: "border-box", transition: "all 0.2s",
                    }}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block", fontSize: "13px", fontWeight: 600,
                  color: "#1b4332", marginBottom: "8px"
                }}>
                  Contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{
                      position: "absolute", left: "14px", top: "50%",
                      transform: "translateY(-50%)", pointerEvents: "none"
                    }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    type={verClave ? "text" : "password"}
                    className="input-login"
                    value={clave}
                    onChange={e => { setClave(e.target.value); setError(""); }}
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    style={{
                      width: "100%", padding: "11px 42px 11px 42px",
                      border: "1.5px solid #e0e0e0", borderRadius: "10px",
                      fontSize: "14px", fontFamily: "'Poppins', sans-serif",
                      background: "#fff", color: "#333",
                      boxSizing: "border-box", transition: "all 0.2s",
                    }}
                  />
                  <button type="button" onClick={() => setVerClave(!verClave)}
                    style={{
                      position: "absolute", right: "14px", top: "50%",
                      transform: "translateY(-50%)", background: "none",
                      border: "none", cursor: "pointer", padding: 0,
                      color: "#aaa", display: "flex", alignItems: "center",
                    }}>
                    {verClave ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  background: "#fff5f5", border: "1px solid #fecaca",
                  borderRadius: "8px", padding: "10px 14px",
                  marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span style={{ fontSize: "13px", color: "#dc2626" }}>{error}</span>
                </div>
              )}

              {/* Botón */}
              <button type="submit" className="btn-login" disabled={cargando}
                style={{
                  width: "100%", padding: "12px",
                  background: "#136442", color: "#fff", border: "none",
                  borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif", cursor: "pointer",
                  transition: "all 0.2s", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: "8px",
                }}>
                {cargando ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Verificando...
                  </>
                ) : "Ingresar al sistema"}
              </button>
            </form>

            {/* Volver */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button onClick={() => navigate("/predios")} className="link-volver"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "13px", color: "#aaa", fontFamily: "'Poppins', sans-serif",
                  transition: "color 0.2s",
                }}>
                ← Volver al módulo de predios
              </button>
            </div>

            <p style={{
              marginTop: "24px", textAlign: "center",
              fontSize: "11px", color: "#ccc", lineHeight: 1.6
            }}>
              Sistema Digital Agropecuario · Estado Barinas<br />
              © 2026 ASOGABA · Solo personal autorizado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}