import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NoticiasSidebar } from "./NoticiasSidebar";
import { NoticiasHeader } from "./NoticiasHeader";
import NoticiasRegistrar from "./NoticiasRegistrar";
import NoticiasEditarEliminar from "./NoticiasEditarEliminar";
import gobierno from "../assets/gobierno.jpg";
import escudo from "../assets/logo2.jpg";

export default function NoticiasDashboard() {
    const [vistaActiva, setVistaActiva] = useState("registrar");
    const [empleadoData, setEmpleadoData] = useState(null);
    const [sidebarAbierto, setSidebarAbierto] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const usuarioGuardado = sessionStorage.getItem("usuario_predios");
        if (usuarioGuardado) {
            setEmpleadoData(JSON.parse(usuarioGuardado));
        }
    }, []);

    const cerrarSesion = () => {
        sessionStorage.removeItem("usuario_predios");
        navigate("/predios/login");
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Poppins', sans-serif", width: "100%", overflowX: "hidden", boxSizing: "border-box", position: "relative" }}>
            <style>{`
                .dashboard-noticias-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 30px 40px;
                    box-sizing: border-box;
                    min-width: 0;
                }
                @media (max-width: 992px) {
                    .dashboard-noticias-main {
                        padding: 16px 12px !important;
                        padding-top: 70px !important;
                    }
                }
            `}</style>

            {/* Sidebar con soporte móvil desplegable */}
            <NoticiasSidebar 
                empleadoData={empleadoData}
                vistaActiva={vistaActiva} 
                setVistaActiva={setVistaActiva} 
                cerrarSesion={cerrarSesion}
                isOpen={sidebarAbierto}
                setIsOpen={setSidebarAbierto}
            />

            <main className="dashboard-noticias-main">
                <NoticiasHeader 
                    vistaActiva={vistaActiva} 
                    escudo={escudo} 
                    gobierno={gobierno}
                    onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
                />

                <div style={{ flex: 1, maxWidth: "1100px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
                    {vistaActiva === "registrar" && <NoticiasRegistrar />}
                    {vistaActiva === "gestion" && <NoticiasEditarEliminar />}
                </div>
            </main>
        </div>
    );
}