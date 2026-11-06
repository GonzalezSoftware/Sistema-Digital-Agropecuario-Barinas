import logo from "../../assets/gobierno.jpg";
import escudo from "../../assets/logo2.jpg";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';

export default function AdminConfigPage() {
  const navigate = useNavigate();

  // Forzamos explícitamente la URL completa de AWS para evitar cualquier fallo de variables de entorno
  const API_URL = "https://3.145.179.35.nip.io/api/";

  const [adminRegistrado, setAdminRegistrado] = React.useState(null);
  const [nombre, setNombre] = React.useState("");
  const [usuario, setUsuario] = React.useState("");
  const [correo, setCorreo] = React.useState("");
  const [clave, setClave] = React.useState("");
  const [error, setError] = React.useState("");
  const [exito, setExito] = React.useState("");
  const [cargando, setCargando] = React.useState(false);
  const [verClave, setVerClave] = React.useState(false);

  useEffect(() => {
    const urlPeticion = `${API_URL}admin-config/`;
    console.log("🔍 [DEBUG] Intentando conectar con la API en:", urlPeticion);

    fetch(urlPeticion)
      .then(async res => {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const textoHtml = await res.text();
          throw new Error("El servidor respondió con HTML (posible error 404 o configuración de Nginx).");
        }
        return res.json();
      })
      .then(data => {
        setAdminRegistrado(data.configurado);
      })
      .catch(err => {
        console.error("❌ [DEBUG] Error al verificar estado del admin en la BD:", err);
        setAdminRegistrado(false);
      });
  }, [API_URL]);

  // 🛡️ VALIDACIÓN DE SESIÓN ÚNICA AUTOMÁTICA PARA EVITAR SESIONES DUPLICADAS
  useEffect(() => {
    const verificarEstadoSesionAdmin = async () => {
      const usuarioActual = sessionStorage.getItem("admin_usuario");
      const sessionTokenActual = sessionStorage.getItem("admin_session_token");

      if (!usuarioActual || !sessionTokenActual) return;

      try {
        const response = await fetch(`${API_URL}verificar-sesion-activa/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: usuarioActual,
            session_token: sessionTokenActual
          })
        });

        if (response.status === 401) {
          const data = await response.json();
          if (data.motivo === "sesion_duplicada") {
            sessionStorage.clear();
            localStorage.clear();

            await Swal.fire({
              icon: 'warning',
              title: 'Sesión Interrumpida',
              text: data.message || 'Tu sesión ha sido cerrada porque se inició sesión desde otro dispositivo.',
              confirmButtonColor: '#136442',
              confirmButtonText: 'Entendido',
              allowOutsideClick: false,
              allowEscapeKey: false
            });

            window.location.href = '/admin/config';
          }
        }
      } catch (error) {
        console.error("Error al validar sesión activa del admin:", error);
      }
    };

    const intervalo = setInterval(verificarEstadoSesionAdmin, 10000);
    return () => clearInterval(intervalo);
  }, [API_URL]);

  const manejarAccion = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!usuario.trim()) { setError("Ingresa el usuario del administrador."); return; }
    if (!clave.trim()) { setError("Ingresa la contraseña."); return; }

    // Evaluamos estrictamente si ya está registrado para alternar entre Login (2FA) y Registro Inicial
    const esLogin = adminRegistrado === true;

    if (!esLogin) {
      if (!nombre.trim()) { setError("Ingresa el nombre completo."); return; }
      if (!correo.trim()) { setError("Ingresa el correo electrónico."); return; }
    }

    setCargando(true);
    // Si ya existe admin, usamos la ruta de login con 2FA. Si no, la ruta de configuración inicial.
    const urlPost = esLogin ? `${API_URL}login-admin/` : `${API_URL}admin-config/`;

    Swal.fire({
      title: "Procesando...",
      text: !esLogin ? "Registrando administrador..." : "Validando credenciales y enviando código 2FA...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      // Preparamos el cuerpo de la petición de manera limpia según el modo (Login vs Registro)
      const bodyData = esLogin
        ? { usuario: usuario.trim(), clave: clave }
        : { nombre: nombre.trim(), usuario: usuario.trim(), correo: correo.trim(), clave: clave };

      const response = await fetch(urlPost, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Ocurrió un error en el servidor.");
      }

// 🔑 PASO 1: SI EL BACKEND REQUIERE 2FA (ADMINISTRADOR YA REGISTRADO)
      if (esLogin && data.requiere_2fa) {
        setCargando(false);
        Swal.close();

        // Capturamos el correo oculto que envía el backend
        const correoDestino = data.correo_destinatario || "su correo electrónico";

        // Pedir el código de 6 dígitos al usuario mostrando el correo oculto
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
          setCargando(false);
          return;
        }

        Swal.fire({
          title: "Verificando código...",
          text: "Validando autenticación de dos factores.",
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });

        // 🔑 PASO 2: ENVIAR EL CÓDIGO AL ENDPOINT DE VERIFICACIÓN
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

        // Guardar la sesión y el token único
        sessionStorage.setItem("usuario_admin", JSON.stringify(dataVerificar.usuario));
        sessionStorage.setItem("admin_usuario", dataVerificar.usuario.usuario);
        if (dataVerificar.usuario.session_token) {
          sessionStorage.setItem("admin_session_token", dataVerificar.usuario.session_token);
        }

        await Swal.fire({
          icon: "success",
          title: "¡Inicio de Sesión Exitoso!",
          text: "Bienvenido al panel de administración general.",
          confirmButtonColor: "#136442",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });

        navigate("/admin/dashboard");
        return;
      }

      // FLUJO NORMAL DE REGISTRO INICIAL (Cuando no hay admin previo en la BD)
      sessionStorage.setItem("usuario_admin", JSON.stringify(data.usuario));
      sessionStorage.setItem("admin_usuario", data.usuario.usuario);
      if (data.usuario.session_token) {
        sessionStorage.setItem("admin_session_token", data.usuario.session_token);
      }

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "¡Administrador registrado en la Base de Datos con éxito! Redirigiendo...",
        confirmButtonColor: "#136442",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });

      navigate("/admin/dashboard");

    } catch (err) {
      setCargando(false);
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
        confirmButtonColor: "#b91c1c"
      });
    }
  };

  // --- FLUJO DE OLVIDÉ MI CONTRASEÑA ---
  const handleOlvidoPassword = async () => {
    const { value: usuarioInput } = await Swal.fire({
      title: 'Recuperar Contraseña',
      input: 'text',
      inputLabel: 'Ingresa tu nombre de usuario de administrador',
      inputPlaceholder: 'Ej. MPPAT',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar Código',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#136442'
    });

    if (!usuarioInput) return;

    Swal.fire({
      title: "Buscando administrador...",
      text: "Enviando código de verificación al correo registrado.",
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

     try {
      const res = await fetch(`${API_URL}admin/perfil/?usuario=${usuarioInput}`);
      const dataPerfil = await res.json();

      if (!res.ok || !dataPerfil.correo) {
        throw new Error("El usuario no existe o no tiene un correo registrado.");
      }

      const correoAdmin = dataPerfil.correo;

      const resCorreo = await fetch(`${API_URL}admin/enviar-codigo-recuperacion/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correoAdmin })
      });

      const dataCorreo = await resCorreo.json();
      if (!resCorreo.ok) throw new Error(dataCorreo.error || "No se pudo enviar el correo.");

      const { value: codigoIngresado } = await Swal.fire({
        title: 'Código enviado',
        text: `Hemos enviado un código de 6 dígitos a su correo (${correoAdmin.replace(/(.{2})(.*)(@.*)/, "$1***$3")}). Ingréselo a continuación:`,
        input: 'text',
        inputAttributes: {
          maxlength: 6,
          autocapitalize: 'off',
          autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Verificar Código',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#136442'
      });

      if (!codigoIngresado) return;

      if (codigoIngresado.trim() === String(dataCorreo.codigo)) {
        
        await Swal.fire({
          icon: 'success',
          title: '¡Código verificado!',
          text: 'Por favor, establece tu nueva contraseña segura.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#136442',
          allowOutsideClick: false
        });

        let verNuevaClave = false;

        const resultadoPassword = await Swal.fire({
          title: 'Nueva Contraseña',
          html: `
            <div style="text-align: left; font-family: 'Poppins', sans-serif;">
              <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">
                Ingresa tu nueva contraseña cumpliendo con los requisitos de seguridad:
              </p>
              
              <div style="position: relative; margin-bottom: 14px;">
                <input 
                  type="password" 
                  id="swal-input-password" 
                  class="swal2-input" 
                  placeholder="Nueva contraseña" 
                  style="margin: 0; width: 100%; box-sizing: border-box; padding-right: 50px;"
                >
                <button 
                  type="button" 
                  id="btn-toggle-password" 
                  style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #64748b; font-size: 12px; font-weight: 600;"
                >
                  Ver
                </button>
              </div>

              <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px;">
                <span style="font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Requisitos de seguridad:</span>
                <div id="req-length" style="color: #dc2626; margin-bottom: 4px;">❌ Mínimo 8 caracteres</div>
                <div id="req-letter" style="color: #dc2626; margin-bottom: 4px;">❌ Al menos una letra</div>
                <div id="req-upper" style="color: #dc2626; margin-bottom: 4px;">❌ Al menos una letra mayúscula</div>
                <div id="req-symbol" style="color: #dc2626;">❌ Al menos un signo especial (!@#$%^&*)</div>
              </div>
            </div>
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Guardar Contraseña',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#136442',
          didOpen: () => {
            const input = document.getElementById('swal-input-password');
            const btnToggle = document.getElementById('btn-toggle-password');
            const confirmBtn = Swal.getConfirmButton();
            
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.6';
            confirmBtn.style.cursor = 'not-allowed';

            btnToggle.addEventListener('click', () => {
              verNuevaClave = !verNuevaClave;
              input.type = verNuevaClave ? 'text' : 'password';
              btnToggle.textContent = verNuevaClave ? 'Ocultar' : 'Ver';
            });

            input.addEventListener('input', () => {
              const val = input.value;

              const hasLength = val.length >= 8;
              const hasLetter = /[a-zA-Z]/.test(val);
              const hasUpper = /[A-Z]/.test(val);
              const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(val);

              const reqLength = document.getElementById('req-length');
              const reqLetter = document.getElementById('req-letter');
              const reqUpper = document.getElementById('req-upper');
              const reqSymbol = document.getElementById('req-symbol');

              reqLength.innerHTML = hasLength ? ' Mínimo 8 caracteres' : ' Mínimo 8 caracteres';
              reqLength.style.color = hasLength ? '#059669' : '#dc2626';

              reqLetter.innerHTML = hasLetter ? ' Al menos una letra' : ' Al menos una letra';
              reqLetter.style.color = hasLetter ? '#059669' : '#dc2626';

              reqUpper.innerHTML = hasUpper ? 'Al menos una letra mayúscula' : ' Al menos una letra mayúscula';
              reqUpper.style.color = hasUpper ? '#059669' : '#dc2626';

              reqSymbol.innerHTML = hasSymbol ? ' Al menos un signo especial (!@#$%^&*)' : ' Al menos un signo especial (!@#$%^&*)';
              reqSymbol.style.color = hasSymbol ? '#059669' : '#dc2626';

              if (hasLength && hasLetter && hasUpper && hasSymbol) {
                confirmBtn.disabled = false;
                confirmBtn.style.opacity = '1';
                confirmBtn.style.cursor = 'pointer';
              } else {
                confirmBtn.disabled = true;
                confirmBtn.style.opacity = '0.6';
                confirmBtn.style.cursor = 'not-allowed';
              }
            });
          },
          preConfirm: () => {
            return document.getElementById('swal-input-password').value;
          }
        });

        if (!resultadoPassword.isConfirmed || !resultadoPassword.value) return;
        const nuevaClave = resultadoPassword.value;

        const resReset = await fetch(`${API_URL}admin/reset-password/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario: usuarioInput, nueva_clave: nuevaClave })
        });

        const dataReset = await resReset.json();
        if (!resReset.ok) throw new Error(dataReset.error || "No se pudo actualizar la contraseña.");

        Swal.fire({
          icon: 'success',
          title: '¡Contraseña Actualizada!',
          text: 'Ya puedes iniciar sesión con tu nueva contraseña.',
          confirmButtonColor: '#136442'
        });

      } else {
        Swal.fire({ icon: 'error', title: 'Código Incorrecto', text: 'El código ingresado no es válido.' });
      }

    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Atención', text: err.message });
    }
  };

  if (adminRegistrado === null) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(150deg, #0a3d24 0%, #136442 60%, #1a7a50 100%)",
        position: "relative", overflow: "hidden"
      }}>
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
          alt="Predios"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18, zIndex: 1 }}
        />
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <div style={{
            width: "48px", height: "48px", border: "4px solid rgba(255,255,255,0.2)",
            borderTop: "4px solid #86efac", borderRadius: "50%", animation: "spin 0.8s linear infinite"
          }} />
          <div style={{ textAlign: "center" }}>
            <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 600, margin: "0 0 4px" }}>Verificando estado del sistema</h3>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", margin: 0 }}>Conectando con la Base de Datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", overflowX: "hidden" }}>
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
        .admin-main-container { flex: 1; display: flex; }
        .admin-panel-izq {
          width: 50%; position: relative; overflow: hidden;
          background: linear-gradient(150deg, #0a3d24 0%, #136442 60%, #1a7a50 100%);
          display: flex; flex-direction: column; justify-content: center; padding: 56px 48px; gap: 28px;
        }
        .admin-panel-der {
          width: 50%; display: flex; align-items: center; justify-content: center; background: #f8faf8; padding: 40px;
        }
        @media (max-width: 992px) {
          .admin-main-container { flex-direction: column !important; }
          .admin-panel-izq, .admin-panel-der { width: 100% !important; padding: 40px 20px !important; }
          .texto-institucional { display: none !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "68px", backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100, flexShrink: 0,
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

        <button onClick={() => navigate("/predios/login")} style={{
          background: "none", border: "1.5px solid #ccc", color: "#666",
          padding: "8px 16px", borderRadius: "6px", cursor: "pointer",
          fontWeight: 500, fontSize: "13px", fontFamily: "'Poppins', sans-serif", whiteSpace: "nowrap"
        }}>
          ← 
        </button>
      </nav>

      {/* ── DOS PANELES ── */}
      <div className="admin-main-container">
        <div className="admin-panel-izq">
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
                Acceso Restringido
              </span>
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <h1 style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 16px" }}>
              {!adminRegistrado ? "Registro Único del" : "Login de acceso"}<br />
              <span style={{ color: "#86efac" }}>Administrador General</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", lineHeight: 1.8, margin: 0, maxWidth: "380px" }}>
              {!adminRegistrado
                ? "Establece las credenciales maestras que se guardarán de forma segura en tu base de datos relacional."
                : "Área exclusiva para el administrador autorizado por el MPPAT en el estado Barinas. Ingresa tus credenciales institucionales para acceder al sistema."}
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 2, display: "flex", gap: "14px", flexWrap: "wrap" }}>
            {[
              { num: "12", label: "Municipios" },
              { num: "100%", label: "Verificado" },
              { num: "Admin", label: "Gestión Municipal General" },
            ].map(item => (
              <div key={item.label} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px", padding: "14px 18px", textAlign: "center", flex: "1", minWidth: "90px"
              }}>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>{item.num}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel-der">
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
                {!adminRegistrado ? "Configurar Administrador" : "Login de acceso Administrador"}
              </h2>
              <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
                {!adminRegistrado ? "Completa los datos para guardarlos en la BD" : "Ingresa con las credenciales asignadas"}
              </p>
            </div>

            <form onSubmit={manejarAccion}>
              {!adminRegistrado && (
                <>
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
                        width: "100%", padding: "11px 14px", border: "1.5px solid #e0e0e0", borderRadius: "10px",
                        fontSize: "14px", fontFamily: "'Poppins', sans-serif", background: "#fff", color: "#333", boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1b4332", marginBottom: "8px" }}>
                      Correo Electrónico (Recuperación)
                    </label>
                    <input
                      type="email"
                      className="input-login"
                      value={correo}
                      onChange={e => { setCorreo(e.target.value); setError(""); }}
                      placeholder="admin@barinas.gob.ve"
                      style={{
                        width: "100%", padding: "11px 14px", border: "1.5px solid #e0e0e0", borderRadius: "10px",
                        fontSize: "14px", fontFamily: "'Poppins', sans-serif", background: "#fff", color: "#333", boxSizing: "border-box"
                      }}
                    />
                  </div>
                </>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1b4332", marginBottom: "8px" }}>
                  Usuario
                </label>
                <input
                  type="text"
                  className="input-login"
                  value={usuario}
                  onChange={e => { setUsuario(e.target.value); setError(""); }}
                  placeholder="Nombre de usuario"
                  autoComplete="username"
                  style={{
                    width: "100%", padding: "11px 14px", border: "1.5px solid #e0e0e0", borderRadius: "10px",
                    fontSize: "14px", fontFamily: "'Poppins', sans-serif", background: "#fff", color: "#333", boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1b4332", marginBottom: "8px" }}>
                  Contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={verClave ? "text" : "password"}
                    className="input-login"
                    value={clave}
                    onChange={e => { setClave(e.target.value); setError(""); }}
                    placeholder="Contraseña"
                    autoComplete="current-password"
                    style={{
                      width: "100%", padding: "11px 42px 11px 14px", border: "1.5px solid #e0e0e0", borderRadius: "10px",
                      fontSize: "14px", fontFamily: "'Poppins', sans-serif", background: "#fff", color: "#333", boxSizing: "border-box"
                    }}
                  />
                  <button type="button" onClick={() => setVerClave(!verClave)}
                    style={{
                      position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", padding: 0, color: "#aaa",
                    }}>
                    {verClave ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>

              {adminRegistrado && (
                <div style={{ textAlign: "right", marginBottom: "20px" }}>
                  <button
                    type="button"
                    onClick={handleOlvidoPassword}
                    style={{
                      background: "none", border: "none", color: "#136442", fontSize: "12.5px",
                      fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              {error && (
                <div style={{
                  background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "8px",
                  padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#dc2626", boxSizing: "border-box"
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-login"
                disabled={cargando}
                style={{
                  width: "100%", padding: "12px", background: "#136442", color: "#fff", border: "none",
                  borderRadius: "10px", fontSize: "14px", fontWeight: 600, fontFamily: "'Poppins', sans-serif",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxSizing: "border-box"
                }}
              >
                {!adminRegistrado ? "Registrar en Base de Datos" : "Aceptar"}
              </button>
            </form>

            <p style={{ marginTop: "24px", textAlign: "center", fontSize: "11px", color: "#ccc", lineHeight: 1.6 }}>
              Sistema Digital Agropecuario · Estado Barinas<br />
              © 2026 MPPAT · Solo personal autorizado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}