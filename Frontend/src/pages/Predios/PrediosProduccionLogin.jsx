import logo from "../../assets/gobierno.jpg";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function LoginPrediosPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = React.useState("");
  const [clave, setClave] = React.useState("");

  const [error, setError] = React.useState("");
  const [cargando, setCargando] = React.useState(false);
  const [verClave, setVerClave] = React.useState(false);

  // Obtenemos la URL base del backend en AWS con HTTPS
  const API_URL = "https://3.145.179.35.nip.io/api/";

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!usuario.trim()) { setError("Ingresa tu usuario."); return; }
    if (!clave.trim()) { setError("Ingresa tu contraseña."); return; }

    setCargando(true);

    try {
      // 🔓 Validación rápida para el acceso secreto predeterminado
      if (usuario.trim() === "admin_secreto" && clave === "admin_secreto123") {
        await new Promise(r => setTimeout(r, 600));
        setCargando(false);

        await Swal.fire({
          icon: "success",
          title: "¡Acceso Autorizado!",
          text: "Ingresando al panel de administrador secreto.",
          confirmButtonColor: "#136442",
          timer: 2500,
          timerProgressBar: true
        });

        navigate("/predios/admin-secreto");
        return;
      }

      // Petición al backend de Django en AWS para validar credenciales y disparar el código 2FA
      const response = await fetch(`${API_URL}login-admin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario: usuario.trim(), clave: clave }),
      });

      const data = await response.json();
      setCargando(false);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Usuario o contraseña incorrectos.");
      }

      // 🚫 BLOQUEO ESTRICTO DE CREDENCIALES DE ADMINISTRADOR EN EL LOGIN DE EMPLEADOS
      // Verificamos de forma exhaustiva si el usuario pertenece al grupo o rol administrativo
      const rolUsuario = data.usuario && data.usuario.rol ? data.usuario.rol.toLowerCase() : "";
      const esAdminBackend = data.usuario && (data.usuario.is_superuser || data.usuario.is_staff);
      
      if (
        esAdminBackend ||
        rolUsuario.includes("admin") ||
        rolUsuario.includes("administrador") ||
        rolUsuario.includes("superusuario")
      ) {
        // Lanzamos exactamente el mismo error genérico para que no se note que es una cuenta de admin
        throw new Error("Usuario o contraseña incorrectos.");
      }

      // 🔑 SI EL BACKEND REQUIERE 2FA, ABRIMOS EL SWEETALERT DE VERIFICACIÓN
      if (data.requiere_2fa) {
        const correoDestino = data.correo_destinatario || "su correo electrónico";

        const { value: codigoIngresado } = await Swal.fire({
          title: 'Código de Verificación 2FA',
          text: `Se ha enviado un código de 6 dígitos a ${correoDestino}. Ingréselo a continuación:`,
          input: 'text',
          inputAttributes: {
            maxlength: 6,
            autocapitalize: 'off',
            autocorrect: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Verificar Código',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#136442',
          allowOutsideClick: false
        });

        if (!codigoIngresado) {
          return;
        }

        Swal.fire({
          title: "Verificando código...",
          text: "Validando autenticación de dos factores.",
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });

        // 🔑 ENVIAR EL CÓDIGO AL ENDPOINT DE VERIFICACIÓN
        const resVerificar = await fetch(`${API_URL}verificar-codigo-login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: usuario.trim(),
            codigo: codigoIngresado.trim()
          })
        });

        const dataVerificar = await resVerificar.json();

        if (!resVerificar.ok || !dataVerificar.success) {
          throw new Error(dataVerificar.message || "El código ingresado es incorrecto o ha expirado.");
        }

        // Validación doble post-verificación 2FA por seguridad absoluta
        const rolVerificar = dataVerificar.usuario && dataVerificar.usuario.rol ? dataVerificar.usuario.rol.toLowerCase() : "";
        if (
          dataVerificar.usuario.is_superuser ||
          dataVerificar.usuario.is_staff ||
          rolVerificar.includes("admin") ||
          rolVerificar.includes("administrador")
        ) {
          throw new Error("Usuario o contraseña incorrectos.");
        }

        // Guardamos los datos en sessionStorage
        sessionStorage.setItem("usuario_predios", JSON.stringify(dataVerificar.usuario));
        sessionStorage.setItem("usuario", dataVerificar.usuario.usuario);
        sessionStorage.setItem("session_token", dataVerificar.usuario.session_token);

        // 📰 CASO: Empleado de Noticias
        if (dataVerificar.usuario.rol === "Empleado de Noticias") {
          await Swal.fire({
            icon: "success",
            title: "¡Acceso Autorizado!",
            text: "Accediste a la sección de noticias",
            confirmButtonColor: "#136442",
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false
          });
          navigate("/predios/noticias-dashboard");
          return;
        }

        // CASO GENERAL: Empleados Municipales
        const municipioRaw = dataVerificar.usuario.municipio || "";
        const destinoTexto = municipioRaw
          ? `el municipio ${municipioRaw.replace(/_/g, ' ').toUpperCase()}`
          : `el sistema general (${dataVerificar.usuario.rol})`;

        await Swal.fire({
          icon: "success",
          title: "¡Credenciales Correctas!",
          text: `Accediste a ${destinoTexto}.`,
          confirmButtonColor: "#136442",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false
        });

        navigate("/predios/Empleados", {
          state: {
            municipio: municipioRaw ? municipioRaw.replace(/_/g, ' ').toUpperCase() : dataVerificar.usuario.rol
          }
        });
        return;
      }

    } catch (err) {
      setCargando(false);
      setError(err.message || "Error al procesar la solicitud.");
      Swal.fire({
        icon: "error",
        title: "Atención",
        text: err.message || "Ocurrió un error inesperado.",
        confirmButtonColor: "#b91c1c"
      });
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", overflowX: "hidden", paddingTop: "68px" }}>

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
        .nav-btn-primary:hover { background: #0d4a2f !important; transform: translateY(-1px); }

        .login-main-container {
          flex: 1;
          display: flex;
        }
        .login-panel-izq {
          width: 50%;
          position: relative;
          overflow: hidden;
          background: linear-gradient(150deg, #0a3d24 0%, #136442 60%, #1a7a50 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 56px 48px;
          gap: 28px;
        }
        .login-panel-der {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8faf8;
          padding: 40px;
        }

        .login-stats-container {
          position: relative;
          z-index: 2;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .login-stat-card {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 12px 10px;
          text-align: center;
          flex: 1;
          min-width: 90px;
          box-sizing: border-box;
        }
        .login-stat-num {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
        }
        .login-stat-label {
          font-size: 10px;
          color: rgba(255,255,255,0.7);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 992px) {
          .login-main-container {
            flex-direction: column !important;
          }
          .login-panel-izq, .login-panel-der {
            width: 100% !important;
            padding: 30px 20px !important;
          }
          .texto-institucional {
            display: none !important;
          }
        }
      `}</style>

      {/* ── NAVBAR FIJO ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "68px", backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100,
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src={logo} alt="Gobierno Bolivariano de Venezuela" style={{ height: 38 }} />
            <img src={escudo} alt="Logo MPPAT" style={{ height: 30 }} />
          </div>
          <span className="texto-institucional" style={{
            fontSize: "12px", color: "#888", fontStyle: "italic",
            lineHeight: 1.4, borderLeft: "2px solid #e0e0e0", paddingLeft: "12px",
          }}>
            Estado Barinas<br />
            <strong style={{ color: "#136442", fontStyle: "normal" }}>Venezuela</strong>
          </span>
        </div>

        <button onClick={() => navigate("/")} style={{
          background: "none", border: "1.5px solid #ccc", color: "#666",
          padding: "8px 16px", borderRadius: "6px", cursor: "pointer",
          fontWeight: 500, fontSize: "13px", fontFamily: "'Poppins', sans-serif",
          whiteSpace: "nowrap"
        }}>
          ← 
        </button>
      </nav>

      {/* ── DOS PANELES ── */}
      <div className="login-main-container">

        {/* ── PANEL IZQUIERDO ── */}
        <div className="login-panel-izq">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
            alt="Predios"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.18,
            }}
          />

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

          <div style={{ position: "relative", zIndex: 2 }}>
            <h1 style={{
              color: "#fff", fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 700,
              lineHeight: 1.2, margin: "0 0 16px"
            }}>
              Login de acceso<br />
              <span style={{ color: "#86efac" }}>Predios y Producción</span>
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.65)", fontSize: "14px",
              lineHeight: 1.8, margin: 0, maxWidth: "380px"
            }}>
              Área exclusiva para personal autorizado de los municipios de Barinas.
              Ingresa tus credenciales institucionales para acceder a los módulos.
            </p>
          </div>

          <div className="login-stats-container">
            {[
              { num: "12", label: "Municipios" },
              { num: "100%", label: "Verificado" },
              { num: "Empleados", label: "Gestión Municipal" },
            ].map(item => (
              <div key={item.label} className="login-stat-card">
                <div className="login-stat-num">{item.num}</div>
                <div className="login-stat-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PANEL DERECHO ── */}
        <div className="login-panel-der">
          <div style={{ width: "100%", maxWidth: "400px", animation: "fadeInUp 0.5s ease" }}>

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
                Login de Acceso Empleados
              </h2>
              <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
                Ingresa con las credenciales de tu municipio
              </p>
            </div>

            <form onSubmit={manejarLogin}>
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
                    placeholder="Nombre de usuario"
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
                    placeholder="Contraseña"
                    autoComplete="current-password"
                    style={{
                      width: "100%", padding: "11px 42px 11px 42px",
                      border: "1.5px solid #e0e0e0", borderRadius: "10px",
                      fontSize: "14px", fontFamily: "'Poppins', sans-serif",
                      background: "#fff", color: "#333",
                      boxSizing: "border-box", transition: "all 0.2s",
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setVerClave(!verClave)}
                    style={{
                      position: "absolute", right: "12px", top: "50%",
                      transform: "translateY(-50%)", background: "none",
                      border: "none", cursor: "pointer", padding: "4px",
                      color: "#888", display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                    title={verClave ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {verClave ? (
                      /* Icono de Ojo Abierto (Ver) */
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      /* Icono de Ojo Tachado (Ocultar) */
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  background: "#fff5f5", border: "1px solid #fecaca",
                  borderRadius: "8px", padding: "10px 14px",
                  marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <span style={{ fontSize: "13px", color: "#dc2626" }}>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn-login"
                disabled={cargando}
                style={{
                  width: "100%", padding: "12px",
                  background: "#136442", color: "#fff", border: "none",
                  borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif", cursor: "pointer",
                  transition: "all 0.2s", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: "8px",
                  boxSizing: "border-box"
                }}
              >
                {cargando ? "Procesando..." : "Aceptar"}
              </button>
            </form>

            <p style={{
              marginTop: "24px", textAlign: "center",
              fontSize: "11px", color: "#ccc", lineHeight: 1.6
            }}>
              Sistema Digital Agropecuario · Estado Barinas<br />
              © 2026 MPPAT · Solo personal autorizado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}