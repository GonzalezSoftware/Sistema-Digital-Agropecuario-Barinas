import logo from "../../assets/gobierno.jpg";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

export default function AdminConfigPage() {
  const navigate = useNavigate();
  
  // 1. Iniciamos en null para evitar que pinte "Configurar" y luego cambie a "Iniciar Sesión"
  const [adminRegistrado, setAdminRegistrado] = React.useState(null); 
  
  const [nombre, setNombre] = React.useState("");
  const [usuario, setUsuario] = React.useState("");
  const [clave, setClave] = React.useState("");
  const [error, setError] = React.useState("");
  const [exito, setExito] = React.useState("");
  const [cargando, setCargando] = React.useState(false);
  const [verClave, setVerClave] = React.useState(false);

  // Consultamos a Django al cargar la página
  useEffect(() => {
    fetch("http://localhost:8000/api/admin-config/")
      .then(res => res.json())
      .then(data => {
        setAdminRegistrado(data.configurado); // true o false real
      })
      .catch(err => {
        console.error("Error al verificar estado del admin en la BD:", err);
        setAdminRegistrado(false); // Por seguridad si falla la red, permitimos registrar
      });
  }, []);

  const manejarAccion = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!usuario.trim()) { setError("Ingresa el usuario del administrador."); return; }
    if (!clave.trim()) { setError("Ingresa la contraseña."); return; }
    if (!adminRegistrado && !nombre.trim()) { setError("Ingresa el nombre completo."); return; }

    setCargando(true);

    try {
      const response = await fetch("http://localhost:8000/api/admin-config/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          usuario: usuario.trim(),
          clave: clave
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error en el servidor.");
      }

      if (!adminRegistrado) {
        setExito("¡Administrador registrado en la Base de Datos con éxito! Redirigiendo...");
      } else {
        setExito("¡Inicio de sesión exitoso! Redirigiendo...");
      }

      // Guardamos la sesión del administrador
      sessionStorage.setItem("usuario_admin", JSON.stringify(data.usuario));
      
      // REDIRIGIDO AL NUEVO PANEL DE ADMINISTRADOR ESPECIALIZADO
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1200);

    } catch (err) {
      setError(err.message);
      setCargando(false);
    }
  };

  // 2. Mientras Django responde, mostramos un estado de carga profesional con la misma imagen de fondo
  if (adminRegistrado === null) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(150deg, #0a3d24 0%, #136442 60%, #1a7a50 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Imagen de fondo con opacidad igual al panel izquierdo */}
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
          alt="Predios"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18, zIndex: 1 }}
        />

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulseText {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
          }
        `}</style>
        
        {/* Contenido centrado con zIndex superior para que esté por encima de la imagen */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid rgba(255,255,255,0.2)",
            borderTop: "4px solid #86efac",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />

          <div style={{ textAlign: "center", animation: "pulseText 1.5s ease-in-out infinite" }}>
            <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 600, margin: "0 0 4px" }}>
              Verificando estado del sistema
            </h3>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", margin: 0 }}>
              Conectando con la Base de Datos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
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
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: "flex", alignItems: "center",
        padding: "0 48px", height: "68px", backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100,
        gap: "24px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginLeft: "-30px" }}>
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
          <button onClick={() => navigate("/predios/login")} style={{
            background: "none", border: "1.5px solid #ccc", color: "#666",
            padding: "8px 20px", borderRadius: "6px", cursor: "pointer",
            fontWeight: 500, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
          }}>
            ← Ir al Login General
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
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.1)", borderRadius: "20px", padding: "6px 14px",
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>
                Base de Datos Real (Django)
              </span>
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <h1 style={{ color: "#fff", fontSize: "30px", fontWeight: 700, lineHeight: 1.2, margin: "0 0 16px" }}>
              {!adminRegistrado ? "Registro Único del" : "Control de Acceso del"}<br />
              <span style={{ color: "#86efac" }}>Administrador del Sistema</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", lineHeight: 1.8, margin: 0, maxWidth: "380px" }}>
              {!adminRegistrado 
                ? "Establece las credenciales maestras que se guardarán de forma segura en tu base de datos relacional."
                : "Ingresa con tu usuario y contraseña de administrador maestro para gestionar el sistema."}
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 2, display: "flex", gap: "14px" }}>
            {[
              { num: "Admin", label: "Control Total" },
              { num: "Django", label: "DB Conectada" },
              { num: "Seguro", label: "Hash Pass" },
            ].map(item => (
              <div key={item.label} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px", padding: "14px 18px", textAlign: "center",
              }}>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>{item.num}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PANEL DERECHO ── */}
        <div style={{ width: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8faf8", padding: "40px" }}>
          <div style={{ width: "100%", maxWidth: "400px", animation: "fadeInUp 0.5s ease" }}>

            <div style={{ marginBottom: "28px" }}>
              <div style={{
                width: "54px", height: "54px", borderRadius: "14px",
                background: "#e8f5e9", display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: "18px",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="#136442" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2 style={{ color: "#1b4332", fontSize: "24px", fontWeight: 700, margin: "0 0 6px" }}>
                {!adminRegistrado ? "Configurar Administrador" : "Iniciar Sesión (Admin)"}
              </h2>
              <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
                {!adminRegistrado ? "Completa los datos para guardarlos en la BD" : "Introduce tus credenciales maestras"}
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={manejarAccion}>

              {/* Si no está registrado, pedimos el Nombre Completo */}
              {!adminRegistrado && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1b4332", marginBottom: "8px" }}>
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="input-login"
                    value={nombre}
                    onChange={e => { setNombre(e.target.value); setError(""); }}
                    placeholder="Ej. Ing. José González"
                    style={{
                      width: "100%", padding: "11px 14px",
                      border: "1.5px solid #e0e0e0", borderRadius: "10px",
                      fontSize: "14px", fontFamily: "'Poppins', sans-serif",
                      background: "#fff", color: "#333", boxSizing: "border-box", transition: "all 0.2s",
                    }}
                  />
                </div>
              )}

              {/* Usuario */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1b4332", marginBottom: "8px" }}>
                  Usuario de Administrador
                </label>
                <input
                  type="text"
                  className="input-login"
                  value={usuario}
                  onChange={e => { setUsuario(e.target.value); setError(""); }}
                  placeholder="Ej. admin_master"
                  autoComplete="username"
                  style={{
                    width: "100%", padding: "11px 14px",
                    border: "1.5px solid #e0e0e0", borderRadius: "10px",
                    fontSize: "14px", fontFamily: "'Poppins', sans-serif",
                    background: "#fff", color: "#333", boxSizing: "border-box", transition: "all 0.2s",
                  }}
                />
              </div>

              {/* Contraseña */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1b4332", marginBottom: "8px" }}>
                  Contraseña Segura
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={verClave ? "text" : "password"}
                    className="input-login"
                    value={clave}
                    onChange={e => { setClave(e.target.value); setError(""); }}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    style={{
                      width: "100%", padding: "11px 42px 11px 14px",
                      border: "1.5px solid #e0e0e0", borderRadius: "10px",
                      fontSize: "14px", fontFamily: "'Poppins', sans-serif",
                      background: "#fff", color: "#333", boxSizing: "border-box", transition: "all 0.2s",
                    }}
                  />
                  <button type="button" onClick={() => setVerClave(!verClave)}
                    style={{
                      position: "absolute", right: "14px", top: "50%",
                      transform: "translateY(-50%)", background: "none",
                      border: "none", cursor: "pointer", padding: 0, color: "#aaa",
                    }}>
                    {verClave ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>

              {/* Mensaje de Error */}
              {error && (
                <div style={{
                  background: "#fff5f5", border: "1px solid #fecaca",
                  borderRadius: "8px", padding: "10px 14px", marginBottom: "16px",
                  fontSize: "13px", color: "#dc2626"
                }}>
                  {error}
                </div>
              )}

              {/* Mensaje de Éxito */}
              {exito && (
                <div style={{
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: "8px", padding: "10px 14px", marginBottom: "16px",
                  fontSize: "13px", color: "#16a34a"
                }}>
                  {exito}
                </div>
              )}

              {/* Botón */}
              <button type="submit" className="btn-login" disabled={cargando}
                style={{
                  width: "100%", padding: "12px",
                  background: "#136442", color: "#fff", border: "none",
                  borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif", cursor: "pointer",
                  transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}>
                {cargando ? "Procesando..." : (!adminRegistrado ? "Registrar en Base de Datos" : "Ingresar al Panel Admin")}
              </button>
            </form>

            <p style={{ marginTop: "24px", textAlign: "center", fontSize: "11px", color: "#ccc", lineHeight: 1.6 }}>
              Sistema Digital Agropecuario · Estado Barinas<br />
              © 2026 ASOGABA · Base de Datos Conectada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}