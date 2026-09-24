import React from "react";

// Fallback por seguridad si algún icono no llega como prop
const FallbackIcon = () => <span style={{ fontSize: "16px" }}>📌</span>;

export default function PrediosProduccionInformacion({
  // Iconos del Módulo de Predios
  IconClipboard, IconMap, IconHistory, IconBarChart,
  // Iconos del Módulo de Producción
  IconDashboard, IconSelect, IconSliders, IconTrendingUp, IconRefresh, IconFileText,
  // Iconos de Pasos y Contacto
  IconCheckCircle, IconPhone, IconMail, IconClock
}) {
  return (
    <>
      {/* FUNCIONALIDADES / MÓDULO DE PREDIOS */}
      <div style={{ padding: "72px 90px", background: "#ffffff" }}>
        <div style={{ maxWidth: "1070px", margin: "0 auto" }}>

          {/* Encabezado Predios */}
          <div style={{ marginBottom: "36px" }}>
            <span style={{
              color: "#136442",
              fontWeight: 600,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "block",
              marginBottom: "8px"
            }}>
              Funcionalidades del Sistema
            </span>
            <h2 style={{
              color: "#1b4332",
              fontSize: "30px",
              margin: "0 0 8px",
              fontWeight: 700,
              letterSpacing: "-0.5px"
            }}>
              Módulo de Predios
            </h2>
            <p style={{
              color: "#666",
              fontSize: "14px",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: "600px"
            }}>
              Herramientas de precisión diseñadas para la gestión territorial, georreferenciación y documentación oficial de predios agropecuarios.
            </p>
          </div>

          {/* Grilla Predios (4 columnas) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {[
              {
                Icon: IconClipboard || FallbackIcon,
                title: "Información del predio",
                desc: "Nombre del predio, productor, coordenadas (latitud y longitud), infraestructura, servicios básicos y mucho más...",
                tag: "Core",
              },
              {
                Icon: IconMap || FallbackIcon,
                title: "Mapa Interactivo",
                desc: "Georreferenciación precisa visualizada en mapa interactivo del estado Barinas con Leaflet.",
                tag: "Geo",
              },
              {
                Icon: IconHistory || FallbackIcon, // Asegúrate de renombrar el componente del icono si lo prefieres
                title: "Historial de Predios Registrados",
                desc: "Seguimiento cronológico y consulta del historial oficial de los predios registrados en el sistema.",
                tag: "Historial",
              },
              {
                Icon: IconBarChart || FallbackIcon,
                title: "Reportes Oficiales",
                desc: "Fichas técnicas en PDF, exportación a Excel y reportes estadísticos por municipio.",
                tag: "Reportes",
              },
            ].map((card) => {
              const CurrentIcon = card.Icon;
              return (
                <div key={card.title} className="feature-card" style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "28px 24px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  border: "1px solid #eef0ee",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "12px",
                        background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#136442"
                      }}>
                        <CurrentIcon />
                      </div>
                      <span style={{
                        fontSize: "10px", fontWeight: 700, color: "#136442",
                        background: "#e8f5e9", padding: "4px 10px", borderRadius: "20px",
                        letterSpacing: "0.5px",
                      }}>
                        {card.tag}
                      </span>
                    </div>
                    <h3 style={{ color: "#1b4332", fontSize: "16px", margin: "0 0 10px", fontWeight: 700 }}>
                      {card.title}
                    </h3>
                    <p style={{ color: "#666", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* MÓDULO DE PRODUCCIÓN ANIMAL Y VEGETAL */}
      <div style={{ padding: "72px 90px", background: "#fcfdfc", borderTop: "1px solid #edf2ed" }}>
        <div style={{ maxWidth: "1070px", margin: "0 auto" }}>

          {/* Encabezado Producción */}
          <div style={{ marginBottom: "36px" }}>
            <span style={{
              color: "#136442",
              fontWeight: 600,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "block",
              marginBottom: "8px"
            }}>
              Rendimiento y Control
            </span>
            <h2 style={{
              color: "#1b4332",
              fontSize: "30px",
              margin: "0 0 8px",
              fontWeight: 700,
              letterSpacing: "-0.5px"
            }}>
              Producción Animal y Vegetal
            </h2>
            <p style={{
              color: "#666",
              fontSize: "14px",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: "600px"
            }}>
              Monitoreo integral de volúmenes de cosecha, existencias pecuarias, caracterización productiva y reportes estratégicos para la toma de decisiones.
            </p>
          </div>

          {/* Grilla Producción (3 columnas) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {[
              {
                Icon: IconDashboard || FallbackIcon,
                title: "Dashboard de Producción",
                desc: "Centro de monitoreo institucional con indicadores estratégicos, superficie, existencia animal y últimas actualizaciones.",
                tag: "Monitoreo",
              },
              {
                Icon: IconSelect || FallbackIcon,
                title: "Selección de Predio",
                desc: "Asocia todas las operaciones posteriores al productor y predio seleccionado para garantizar trazabilidad y consistencia.",
                tag: "Gestión",
              },
              {
                Icon: IconSliders || FallbackIcon,
                title: "Caracterización Productiva",
                desc: "Registro inicial de condiciones generales, existencia animal, producción vegetal y maquinaria como línea base.",
                tag: "Base",
              },
              {
                Icon: IconTrendingUp || FallbackIcon,
                title: "Producción General",
                desc: "Documenta rendimientos, cosechas, producción de leche, carne, queso, huevos, miel y otros rubros agroindustriales.",
                tag: "Volúmenes",
              },
              {
                Icon: IconRefresh || FallbackIcon,
                title: "Actualización Productiva",
                desc: "Registra cambios posteriores como incremento de animales, adquisición de maquinaria o ampliación de superficie.",
                tag: "Evolución",
              },
              {
                Icon: IconFileText || FallbackIcon,
                title: "Reportes y Estadísticas",
                desc: "Generación de reportes por ubicación, producción y recursos para apoyar la toma de decisiones institucionales.",
                tag: "Reportes",
              },
            ].map((card) => {
              const CurrentIcon = card.Icon;
              return (
                <div key={card.title} className="feature-card" style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "28px 24px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  border: "1px solid #eef0ee",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "12px",
                        background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#136442"
                      }}>
                        <CurrentIcon />
                      </div>
                      <span style={{
                        fontSize: "10px", fontWeight: 700, color: "#136442",
                        background: "#e8f5e9", padding: "4px 10px", borderRadius: "20px",
                        letterSpacing: "0.5px",
                      }}>
                        {card.tag}
                      </span>
                    </div>
                    <h3 style={{ color: "#1b4332", fontSize: "16px", margin: "0 0 10px", fontWeight: 700 }}>
                      {card.title}
                    </h3>
                    <p style={{ color: "#666", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* PARA PRODUCTORES (Con el mismo estilo visual unificado) */}
      <div id="productor-info" style={{ padding: "72px 90px", background: "#ffffff", borderTop: "1px solid #edf2ed" }}>
        <div style={{ maxWidth: "1070px", margin: "0 auto" }}>

          {/* Encabezado Para Productores */}
          <div style={{ marginBottom: "36px" }}>
            <span style={{
              color: "#136442",
              fontWeight: 600,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "block",
              marginBottom: "8px"
            }}>
              Para Productores
            </span>
            <h2 style={{
              color: "#1b4332",
              fontSize: "30px",
              margin: "0 0 8px",
              fontWeight: 700,
              letterSpacing: "-0.5px"
            }}>
              ¿Deseas registrar tu predio?
            </h2>
            <p style={{
              color: "#666",
              fontSize: "14px",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: "600px"
            }}>
              El proceso es sencillo. Personal técnico del MPPAT se encargará de todo el registro de manera oficial y verificada. Solo debes seguir estos pasos:
            </p>
          </div>

          {/* Grilla de Pasos (4 columnas adaptadas con el estilo de tarjeta limpio) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "48px" }}>
            {[
              { num: "1", texto: "Comunícate con el MPPAT por teléfono o correo electrónico." },
              { num: "2", texto: "Solicita formalmente el registro de tu predio agropecuario." },
              { num: "3", texto: "Coordina la fecha de visita técnica con el personal asignado." },
              { num: "4", texto: "Recibe tu ficha técnica oficial una vez completado el proceso." },
            ].map((paso) => {
              const CheckIcon = IconCheckCircle || FallbackIcon;
              return (
                <div key={paso.num} className="step-card" style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "28px 24px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  border: "1px solid #eef0ee",
                  borderTop: "3px solid #136442",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{
                      width: "38px", height: "38px", borderRadius: "10px",
                      background: "#e8f5e9", display: "flex", alignItems: "center",
                      justifyContent: "center", marginBottom: "18px",
                      fontSize: "14px", fontWeight: 700, color: "#136442",
                    }}>
                      {paso.num}
                    </div>
                    <p style={{ color: "#666", fontSize: "13px", lineHeight: 1.6, margin: "0 0 20px" }}>
                      {paso.texto}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckIcon />
                    <span style={{ fontSize: "11px", color: "#136442", fontWeight: 600 }}>Requerido</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tarjetas de contacto (3 columnas con el mismo diseño estético) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {[
              { Icon: IconPhone || FallbackIcon, label: "Teléfono", value: "(0273) 300-0000", href: "tel:+582733000000", isLink: true },
              { Icon: IconMail || FallbackIcon, label: "Correo electrónico", value: "agrosistema@barinas.gob.ve", href: "mailto:agrosistema@barinas.gob.ve", isLink: true },
              { Icon: IconClock || FallbackIcon, label: "Horario de atención", value: "Lunes a Viernes · 8:00am – 4:00pm", isLink: false },
            ].map((item) => {
              const ItemIcon = item.Icon;
              return (
                <div key={item.label} className="contact-card" style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "28px 24px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "12px",
                  border: "1px solid #eef0ee",
                }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#136442"
                  }}>
                    <ItemIcon />
                  </div>
                  <p style={{ fontSize: "10px", color: "#888", margin: 0, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>
                    {item.label}
                  </p>
                  {item.isLink ? (
                    <a href={item.href} style={{ color: "#1b4332", textDecoration: "none", fontSize: "14px", fontWeight: 600, lineHeight: 1.5 }}>
                      {item.value}
                    </a>
                  ) : (
                    <span style={{ color: "#1b4332", fontSize: "14px", fontWeight: 600, lineHeight: 1.5 }}>
                      {item.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}