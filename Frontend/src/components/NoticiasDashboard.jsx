import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NoticiasSidebar } from "./NoticiasSidebar";
import { NoticiasHeader } from "./NoticiasHeader";
import NoticiasRegistrar from "./NoticiasRegistrar"; // <--- Importación actualizada con el nuevo nombre
import NoticiasEditarEliminar from "./NoticiasEditarEliminar";
import gobierno from "../assets/gobierno.jpg";
import escudo from "../assets/logo2.jpg";

export default function NoticiasDashboard() {
    const [vistaActiva, setVistaActiva] = useState("registrar");
    const [empleadoData, setEmpleadoData] = useState(null);
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
        <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Poppins', sans-serif" }}>
            <NoticiasSidebar 
                empleadoData={empleadoData}
                vistaActiva={vistaActiva} 
                setVistaActiva={setVistaActiva} 
                cerrarSesion={cerrarSesion} 
            />

            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", padding: "30px 40px" }}>
                <NoticiasHeader 
                    vistaActiva={vistaActiva} 
                    escudo={escudo} 
                    gobierno={gobierno} 
                />

                <div style={{ flex: 1, maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
                    
                    {/* VISTA 1: REGISTRAR NOTICIA */}
                    {vistaActiva === "registrar" && <NoticiasRegistrar />}

                    {/* VISTA 2: EDITAR / ELIMINAR NOTICIA */}
                    {vistaActiva === "gestion" && <NoticiasEditarEliminar />}
                </div>
            </main>
        </div>
    );
}