import React from 'react';

export const AdminHeader = ({ vistaActiva, escudo }) => {
    return (
        <header style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "10px"
        }}>
            <div>
               <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#242525", margin: 0 }}>
    {vistaActiva === "inicio"
        ? "Panel Administrativo"
        : vistaActiva === "credenciales"
            ? "Credenciales de Usuarios"
            : vistaActiva === "georreferenciacion"
                ? "Georreferenciación de Predios"
                : vistaActiva === "reportes"
                    ? "Reportes del Sistema"
                    : vistaActiva === "configuracion"
                        ? "Configuración del Sistema"
                        : "Historial de Actividad"}
</h2>
                <p style={{ margin: "0px 0 0 0", fontSize: "13px", color: "#64748b" }}>Admin Predios • Estado Barinas</p>
            </div>

            {/* --- LOGO / ESCUDO --- */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    src={escudo}
                    alt="Logo Escudo"
                    style={{ height: "40px", objectFit: "contain" }}
                />
            </div>
        </header>
    );
};