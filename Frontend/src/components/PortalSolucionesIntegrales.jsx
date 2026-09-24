import React from "react";

export default function PortalSolucionesIntegrales() {
  const solutions = [
    { img: "https://images.unsplash.com/photo-1591389703635-e15a07b842d7?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Registro de Predios", desc: "Administra información catastral, ubicación y gestión de terrenos." },
    { img: "https://images.unsplash.com/photo-1454179083322-198bb4daae41?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Producción Animal", desc: "Control de inventario ganadero, salud, reproducción y rendimiento." },
    { img: "https://images.unsplash.com/photo-1554402100-8d1d9f3dff80?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Producción Vegetal", desc: "Gestión de ciclos de siembra, cosechas e insumos agrícolas." },
    { img: "https://images.unsplash.com/flagged/photo-1553267252-d100936057c1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Estadísticas", desc: "Reportes visuales y análisis de tu actividad agropecuaria." },
    { img: "https://plus.unsplash.com/premium_photo-1661389248634-912a0e92b85d?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Reportes", desc: "Generación de informes detallados sobre la rentabilidad y el flujo de caja." },
    { img: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Actualización de Predio", desc: "Modifica datos catastrales, linderos y mejoras en tiempo real." }
  ];

  return (
    <>
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
          {solutions.map((card, idx) => (
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
    </>
  );
}