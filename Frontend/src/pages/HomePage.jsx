import logo from "../assets/gobierno.jpg";
import bannerImg from "../assets/banner2.jpg";
import escudo from "../assets/logo2.jpg";

const NAV_ITEMS = [
  { label: "Productores", href: "/productores" },
  { label: "Registro de Predios", href: "/predios", isRoute: true },
  { label: "Producción Animal y Vegetal", href: "/produccion", isRoute: true },
  { label: "Estadísticas Generales", href: "/estadística-portalinfo", isRoute: true },
  { label: "Contactos", href: "#contactos" },
];

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", margin: 0, padding: 0 }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center",
        padding: "0 48px", height: "68px", backgroundColor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100,
        fontFamily: "'Poppins', sans-serif", gap: "24px",
      }}>
        {/* Logo + Escudo */}
        <div style={{
          display: "flex", alignItems: "center", gap: "20px", ap: "20px",
          marginLeft: "-30px"
        }}>
          <img src={logo} alt="Gobierno Bolivariano de Venezuela" style={{ height: 45 }} />
          <img src={escudo} alt="Logo MPPAT" style={{ height: 35 }} />

        </div>

        {/* Texto institucional pegado al logo */}
        <span style={{
          fontSize: "12px", color: "#888", fontStyle: "italic",
          lineHeight: 1.4, borderLeft: "2px solid #e0e0e0", paddingLeft: "16px",
        }}>
          Estado Barinas<br />
          <strong style={{ color: "#589e38", fontStyle: "normal" }}>Venezuela</strong>
        </span>

        {/* Links centrados */}
        <ul style={{
          display: "flex", gap: "8px", listStyle: "none",
          margin: 0, padding: 0, flex: 1, justifyContent: "flex-end",
        }}>
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              {item.isRoute ? (
                <a href={item.href} style={{
                  textDecoration: "none", color: "#444", fontSize: "13.5px",
                  fontWeight: 400, padding: "6px 14px", borderRadius: "6px",
                  display: "block", transition: "background 0.2s, color 0.2s",
                  whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif",
                }}
                  onMouseEnter={e => { e.target.style.background = "#f0faf0"; e.target.style.color = "#589e38"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#444"; }}
                >
                  {item.label}
                </a>
              ) : (
                <a href={item.href} style={{
                  textDecoration: "none", color: "#444", fontSize: "13.5px",
                  fontWeight: 400, padding: "6px 14px", borderRadius: "6px",
                  display: "block", transition: "background 0.2s, color 0.2s",
                  whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif",
                }}
                  onMouseEnter={e => { e.target.style.background = "#f0faf0"; e.target.style.color = "#589e38"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#444"; }}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* HERO BANNER */}
      <div style={{
        position: "relative", height: "520px", overflow: "hidden",
        display: "flex", alignItems: "center",
        background: "linear-gradient(120deg, #136442 0%",
      }}>
        <img src={bannerImg} alt="Banner" style={{
          position: "absolute", right: 0, top: 0,
          width: "55%", height: "100%",
          objectFit: "cover", opacity: 0.5,
          clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }} />

        <div style={{ position: "relative", zIndex: 2, padding: "0 80px", maxWidth: "580px" }}>
          <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: 700, lineHeight: 1.15, margin: "0 0 18px" }}>
            Sistema Digital Agropecuario<br />
            <span style={{ color: "#86efac" }}>del Estado Barinas</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.6, margin: "0 0 36px" }}>
            Portal de información agropecuaria del <strong style={{ color: "#fff" }}>estado Barinas</strong>.
            Registra predios, controla producción animal y vegetal, y visualiza
            estadísticas. Todo en una sola plataforma pensada para el productor venezolano.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="../Predios" style={{
              backgroundColor: "#fff", color: "#589e38", padding: "14px 32px",
              borderRadius: "4px", textDecoration: "none", fontWeight: 600, fontSize: "14px",
            }}>Registrar Predio</a>
            <a href="#sobre-nosotros" style={{
              border: "2px solid rgba(255,255,255,0.7)", color: "#fff", padding: "14px 32px",
              borderRadius: "4px", textDecoration: "none", fontWeight: 600, fontSize: "14px",
            }}>Saber más</a>
          </div>
        </div>
      </div>

      {/* PORTAL INFORMATIVO - DISEÑO ESTÁTICO */}
      <div id="portal-informativo" style={{ padding: "80px 20px", background: "#f8faf9" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>

          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ color: "#1b4332", fontSize: "32px" }}>Noticias del Sector Agropecuario</h2>
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

            {/* BOTÓN IZQUIERDA (SIN FUNCIÓN) */}
            <button style={navButtonStyle("left")}> &lt; </button>

            {/* CONTENEDOR DE NOTICIAS (ESTÁTICO) */}
            <div style={{
              display: "flex",
              gap: "25px",
              overflow: "hidden",
              padding: "40px 10px",
              width: "100%",
              maxWidth: "1010px", // Exactamente 3 tarjetas
              margin: "0 auto",
              justifyContent: "center"
            }}>
              {[1, 2, 3].map((item) => (
                <div key={item} className="tarjeta-noticia" style={{
                  minWidth: "320px",
                  background: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                  transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease"
                }}>
                  <div style={{ height: "180px", background: "#cbd5e1", borderRadius: "16px 16px 0 0" }} />
                  <div style={{ padding: "20px" }}>
                    <div style={{ width: "40%", height: "10px", background: "#e2e8f0", marginBottom: "10px", borderRadius: "4px" }} />
                    <div style={{ width: "90%", height: "18px", background: "#cbd5e1", borderRadius: "4px" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* BOTÓN DERECHA (SIN FUNCIÓN) */}
            <button style={navButtonStyle("right")}> &gt; </button>
          </div>
        </div>
      </div>

      <style>{`
  .tarjeta-noticia {
    transform: scale(0.9); 
  }
  .tarjeta-noticia:hover {
    transform: scale(1.01) !important;
    box-shadow: 0 30px 40px -10px rgba(0,0,0,0.2) !important;
  }
  @keyframes aparecer {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .tarjeta-noticia { animation: aparecer 0.8s ease-out forwards; }
`}
      </style>

     <div style={{ padding: "20px", background: "#f8faf9" }}>
  <div style={{ textAlign: "center", marginBottom: "60px" }}>
    <span style={{ color: "#589e38", fontSize: "12px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase" }}>
      Soluciones Integrales
    </span>
    <h2 style={{ color: "#1b4332", fontSize: "32px", margin: "10px 0" }}>¿Qué puedes gestionar hoy?</h2>
  </div>

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    width: "95%",
    margin: "0 auto",
  }}>
    {[
      { img: "https://images.unsplash.com/photo-1591389703635-e15a07b842d7?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Registro de Predios", desc: "Administra información catastral, ubicación y gestión de terrenos." },
      { img: "https://images.unsplash.com/photo-1454179083322-198bb4daae41?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Producción Animal", desc: "Control de inventario ganadero, salud, reproducción y rendimiento." },
      { img: "https://images.unsplash.com/photo-1554402100-8d1d9f3dff80?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Producción Vegetal", desc: "Gestión de ciclos de siembra, cosechas e insumos agrícolas." },
      { img: "https://images.unsplash.com/flagged/photo-1553267252-d100936057c1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Estadísticas", desc: "Reportes visuales y análisis de tu actividad agropecuaria." },
      { img: "https://plus.unsplash.com/premium_photo-1661389248634-912a0e92b85d?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Reportes", desc: "Generación de informes detallados sobre la rentabilidad y el flujo de caja." },
      { img: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Actualización de Predio", desc: "Modifica datos catastrales, linderos y mejoras en tiempo real." }
    ].map((card, idx) => (
      <div key={idx} className="card-container" style={{
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)"
      }}>
        <div style={{ height: "180px", overflow: "hidden" }}>
          <img src={card.img} alt={card.title} className="card-img" style={{
            width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s ease"
          }} />
        </div>

        <div style={{ padding: "25px" }}>
          <div style={{
            width: "30px", height: "3px", background: "#589e38",
            marginBottom: "15px", borderRadius: "2px", opacity: 0.8
          }} />
          <h3 style={{ color: "#1b4332", fontSize: "19px", margin: "0 0 10px", fontWeight: 700 }}>
            {card.title}
          </h3>
          <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            {card.desc}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

<style>{`
  .card-container:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -10px rgba(88, 158, 56, 0.15) !important;
  }
  .card-container:hover .card-img {
    transform: scale(1.05);
  }
`}</style>

      {/* SOBRE NOSOTROS */}
      <div id="sobre-nosotros" style={{
        padding: "50px 80px", background: "#fff",
        display: "flex", alignItems: "center", gap: "64px",
        maxWidth: "1100px", margin: "0 auto",
      }}>
        <div style={{ flex: 1 }}>
          <span style={{ color: "#589e38", fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Sobre Nosotros
          </span>
          <h2 style={{ color: "#1b4332", fontSize: "32px", margin: "12px 0 20px" }}>
            Tecnología al servicio del campo barinés
          </h2>
          <p style={{ color: "#555", fontSize: "16px", lineHeight: 1.7 }}>
            Somos un ecosistema digital diseñado para modernizar la gestión agropecuaria
            del estado Barinas. Centralizamos la información de predios, producción y
            estadísticas en un solo lugar, accesible para productores de todas las escalas,
            desde el pequeño agricultor hasta las grandes explotaciones ganaderas.
          </p>
          <p style={{ color: "#555", fontSize: "16px", lineHeight: 1.7, marginTop: "16px" }}>
            Barinas, tierra llanera y de gran vocación agropecuaria, merece una herramienta
            a la altura de su potencial productivo.
          </p>
        </div>

        {/* Imagen real en lugar del emoji */}
        <div style={{ flex: 1, borderRadius: "16px", overflow: "hidden", height: "320px" }}>
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
            alt="Campo agropecuario"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>



      {/* CONTACTOS */}
      <div id="contactos" style={{
        background: "#f5f7f5", padding: "64px 80px",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* Encabezado */}
          <div style={{ marginBottom: "48px" }}>
            <span style={{
              fontSize: "12px", fontWeight: 600, letterSpacing: "2px",
              textTransform: "uppercase", color: "#589e38",
            }}>
              Contacto
            </span>
            <h2 style={{ fontSize: "30px", fontWeight: 700, margin: "10px 0 12px", color: "#1b4332" }}>
              ¿Tienes alguna pregunta?
            </h2>
            <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.7, maxWidth: "500px" }}>
              Estamos disponibles para orientarte sobre el uso del sistema agropecuario del estado Barinas.
            </p>
          </div>

          {/* Tarjetas horizontales */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>

            {/* Correo */}
            <div style={{
              background: "#fff", borderRadius: "12px", padding: "32px 24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex",
              flexDirection: "column", alignItems: "flex-start", gap: "12px",
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "10px",
                background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#589e38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <p style={{ fontSize: "12px", color: "#999", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
                Correo electrónico
              </p>
              <a href="mailto:agrosistema@barinas.gob.ve" style={{
                color: "#1b4332", textDecoration: "none", fontSize: "14px", fontWeight: 600,
              }}>
                agrosistema@barinas.gob.ve
              </a>
            </div>

            {/* Teléfono */}
            <div style={{
              background: "#fff", borderRadius: "12px", padding: "32px 24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex",
              flexDirection: "column", alignItems: "flex-start", gap: "12px",
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "10px",
                background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#589e38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .9h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <p style={{ fontSize: "12px", color: "#999", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
                Teléfono
              </p>
              <a href="tel:+582733000000" style={{
                color: "#1b4332", textDecoration: "none", fontSize: "14px", fontWeight: 600,
              }}>
                (0273) 300-0000
              </a>
            </div>

            {/* Ubicación */}
            <div style={{
              background: "#fff", borderRadius: "12px", padding: "32px 24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex",
              flexDirection: "column", alignItems: "flex-start", gap: "12px",
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "10px",
                background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#589e38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p style={{ fontSize: "12px", color: "#999", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
                Ubicación
              </p>
              <span style={{ color: "#1b4332", fontSize: "14px", fontWeight: 600, lineHeight: 1.6 }}>
                Barinas, Estado Barinas<br />Venezuela
              </span>
            </div>

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

const navButtonStyle = (side) => ({
  position: "absolute",
  [side === "left" ? "left" : "right"]: "-20px",
  zIndex: 10,
  background: "#589e38",
  color: "#fff",
  border: "none",
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  fontSize: "20px",
  cursor: "pointer",
  boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
  transition: "all 0.2s ease"
});