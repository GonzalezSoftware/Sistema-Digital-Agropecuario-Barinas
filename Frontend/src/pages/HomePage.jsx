import logo from "../assets/gobierno.jpg";
import bannerImg from "../assets/banner2.jpg";
import escudo from "../assets/logo2.jpg";

const NAV_ITEMS = [
  { label: "Sobre Nosotros", href: "#sobre-nosotros" },
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
        <div style={{ display: "flex", alignItems: "center", gap: "20px",ap: "20px",
    marginLeft: "-30px" }}>
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
          <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: 700, lineHeight: 1.2, margin: "0 0 20px" }}>
            Sistema Digital Agropecuario<br />del Estado Barinas
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.6, margin: "0 0 36px" }}>
            Portal de información agropecuaria del <strong style={{ color: "#fff" }}>estado Barinas</strong>.
            Registra predios, controla producción animal y vegetal, y visualiza
            estadísticas. Todo en una sola plataforma pensada para el productor venezolano.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#predios" style={{
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

      {/* CARDS */}
      <div style={{ padding: "64px 80px", background: "#f5f7f5" }}>
        <h2 style={{ textAlign: "center", color: "#1b4332", fontSize: "25px", marginBottom: "40px" }}>
          ¿Qué puedes gestionar?
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "28px", maxWidth: "1100px", margin: "0 auto",
        }}>
          {[
            {
              img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
              title: "Registro de Predios",
              desc: "Administra predios con información catastral, ubicación y propietarios.",
              href: "#predios"
            },
            {
              img: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&q=80",
              title: "Producción Animal",
              desc: "Control de inventario ganadero, salud, reproducción y producción.",
              href: "/produccion"
            },
            {
              img: "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=600&q=80",
              title: "Producción Vegetal",
              desc: "Gestión de cultivos, siembras, cosechas e insumos agrícolas.",
              href: "/produccion"
            },
            {
              img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
              title: "Estadísticas",
              desc: "Reportes y estadísticas generales de toda tu actividad agropecuaria.",
              href: "#estadisticas"
            },
          ].map((card) => (
            <a key={card.title} href={card.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff", borderRadius: "12px", overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)", cursor: "pointer",
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
                {/* Imagen */}
                <div style={{ height: "160px", overflow: "hidden" }}>
                  <img src={card.img} alt={card.title} style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transition: "transform 0.3s",
                  }} />
                </div>
                {/* Texto */}
                <div style={{ padding: "24px" }}>
                  <h3 style={{ color: "#589e38", fontSize: "16px", margin: "0 0 10px", fontWeight: 700 }}>
                    {card.title}
                  </h3>
                  <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

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