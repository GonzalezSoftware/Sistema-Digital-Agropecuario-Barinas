import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../../assets/gobierno.jpg";
import escudo from "../../assets/logo2.jpg";
import axios from 'axios';
import Swal from 'sweetalert2';

// 1. AÑADIMOS EL COMPONENTE SPINNER
const Spinner = ({ color = "#136442" }) => {
    const spinnerRef = (el) => {
        if (el) {
            el.animate(
                [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
                { duration: 1000, iterations: Infinity }
            );
        }
    };
    return (
        <svg ref={spinnerRef} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
};

// Componente InputField con el diseño solicitado
const InputField = ({ label, error, prefix, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "8px", textTransform: "uppercase" }}>{label}</label>

        <div style={{
            display: "flex",
            alignItems: "center",
            borderRadius: "8px",
            overflow: "hidden",
            transition: "all 0.2s ease",
            border: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
            backgroundColor: error ? "#fef2f2" : "#f8fafc"
        }}>
            {prefix && (
                <div style={{
                    height: "42px",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: error ? "#fee2e2" : "#f1f5f9",
                    borderRight: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                }}>
                    {prefix}
                </div>
            )}
            <input
                {...props}
                style={{
                    padding: "0 14px",
                    fontSize: "14px",
                    color: "#1e293b",
                    border: "none",
                    backgroundColor: "transparent",
                    width: "100%",
                    height: "42px",
                    outline: "none",
                    margin: 0
                }}
            />
        </div>
        {error && (
            <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "5px", fontWeight: "600" }}>{error}</p>
        )}
    </div>
);

export default function Productores() {


    const navigate = useNavigate();
    const [cedula, setCedula] = useState("");
    const [prefijo, setPrefijo] = useState("V-");
    const [errors, setErrors] = useState({});
    const [buscando, setBuscando] = useState(false);
    const [resultado, setResultado] = useState(null);

    const buscarProductorEnBD = async () => {
        const cedulaLimpia = cedula.replace(/\D/g, '');
        const cedulaCompleta = `${prefijo}${cedulaLimpia}`;

        setResultado(null);
        setErrors({});
        setBuscando(true);

        try {
            const url = "http://127.0.0.1:8000/api/productores/buscar/" + cedulaCompleta + "/";
            console.log("Consultando a:", url);

            const response = await axios.get(url);
            setResultado(response.data);
        } catch (error) {
            console.log("Error detallado:", error.response);
            if (error.response && error.response.status === 404) {
                setResultado({ existe: false });
            } else {
                console.error("Error de conexión:", error);
            }
        } finally {
            setBuscando(false);
        }
    };

    // FUNCIÓN PARA ENLAZAR LA EXPORTACIÓN
    const handleExportar = () => {
        console.log("Exportando los datos de:", resultado);
        alert(`Exportando ficha técnica de: ${resultado.nombre}`);
        // Aquí puedes agregar tu lógica (ej: abrir PDF, llamar API, etc.)
    };

    const NAV_ITEMS = [
        { label: "Productores", href: "/productores", isRoute: true },
        { label: "Registro de Predios", href: "/predios", isRoute: true },
        { label: "Producción Animal y Vegetal", href: "/produccion", isRoute: true },
        { label: "Estadísticas Generales", href: "/estadística-portalinfo", isRoute: true },
        { label: "Contactos", href: "#contactos" },
    ];

    const validarCampoProductor = (value) => {
        const regexCedula = prefijo === "V-" ? /^[0-9]{7,8}$/ : /^[0-9]{5,8}$/;

        if (value === "") {
            setErrors({});
        } else if (!regexCedula.test(value)) {
            setErrors({ productor_cedula: prefijo === "V-" ? "La cédula venezolana debe tener 7 u 8 números" : "La cédula extranjera debe tener entre 5 y 8 números" });
        } else {
            setErrors({});
        }
    };

    const handleCedulaChange = (e) => {
        const valorNumerico = e.target.value.replace(/\D/g, '');
        setCedula(valorNumerico);
        validarCampoProductor(valorNumerico);
    };

const exportarFichaConValidacion = async () => {
    // 1. Extraemos el teléfono directamente del resultado que ya devolvió la búsqueda
    const telefonoProductor = resultado?.telefono;

    if (!resultado || !telefonoProductor) {
        Swal.fire({
            icon: "warning",
            title: "Datos incompletos",
            text: "El productor no posee un número de teléfono registrado en el sistema para realizar la validación.",
            confirmButtonColor: '#136442',
            didOpen: () => {
                const popup = Swal.getPopup();
                if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
            },
        });
        return;
    }

    // 2. Confirmación inicial de la exportación
    const confirmacion = await Swal.fire({
        title: "¿Exportar ficha técnica?",
        text: `Se enviará un código de validación al WhatsApp registrado del productor (${telefonoProductor}).`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, enviar código",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#136442",
        didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
        },
    });

    if (!confirmacion.isConfirmed) return;

    // 3. Enviar código a Django vía WhatsApp
    let codigoServidor = "";
    try {
        const envio = await axios.post("http://127.0.0.1:8000/api/enviar-codigo/", { telefono: telefonoProductor });
        codigoServidor = envio.data.codigo.toString();

        await Swal.fire({
            icon: "success",
            title: "Código enviado",
            text: "El código de seguridad fue enviado al WhatsApp del productor",
            confirmButtonColor: "#136442",
            didOpen: () => {
                const popup = Swal.getPopup();
                if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
            },
        });
    } catch (error) {
        console.error("Error enviando WhatsApp:", error);
        Swal.fire({
            icon: "error",
            title: "Error de comunicación",
            text: "No se pudo despachar el código de validación.",
            confirmButtonColor: "#d32f2f",
            didOpen: () => {
                const popup = Swal.getPopup();
                if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
            },
        });
        return;
    }

    // 4. Solicitar el código introducido por el usuario
    const { value: codigoUsuario } = await Swal.fire({
        title: "Validación de Seguridad",
        input: "text",
        inputLabel: "Ingrese el código recibido por el productor",
        inputPlaceholder: "Código de verificación",
        confirmButtonText: "Verificar y Descargar",
        confirmButtonColor: "#136442",
        showCancelButton: true,
        didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
        },
    });

    if (!codigoUsuario) {
        Swal.fire({
            icon: "warning",
            title: "Validación cancelada",
            confirmButtonColor: "#136442",
            didOpen: () => {
                const popup = Swal.getPopup();
                if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
            },
        });
        return;
    }

    // 5. Comparar códigos
    if (codigoUsuario !== codigoServidor) {
        Swal.fire({
            icon: "error",
            title: "Código inválido",
            text: "El código ingresado no coincide con el enviado.",
            confirmButtonColor: "#d32f2f",
            didOpen: () => {
                const popup = Swal.getPopup();
                if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
            },
        });
        return;
    }

    // 6. ¡Éxito! Ejecutar la descarga de la ficha técnica
    generarFichaProductor();
};

// Función encargada estrictamente de la ejecución del PDF
const generarFichaProductor = (predio) => {
    console.log("DATOS REALES DEL PREDIO EN EL PDF:", predio);

    if (!predio || !predio.caracterizacion_completada) {
        alert("No se puede exportar el PDF debido a que la caracterización de este predio no ha sido completada.");
        return;
    }

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter"
    });

    const verdeBarinas = [19, 100, 66];
    const grisOscuro = [40, 40, 40];

    // ────────────────────────────────────────────────────────
    // CINTILLO INSTITUCIONAL
    // ────────────────────────────────────────────────────────
    try {
        doc.addImage("/src/assets/logo.png", "PNG", 12, 5, 22, 16);
        doc.addImage("/src/assets/gobierno.jpg", "JPEG", 37, 5, 28, 16);
    } catch (error) {
        console.warn("Logos institucionales omitidos.");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...verdeBarinas);
    doc.text("MINISTERIO DEL PODER POPULAR PARA LA AGRICULTURA PRODUCTIVA Y TIERRAS", 204, 10, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("MPPAPT — DIRECCIÓN ESTADAL DE REGISTROS AGROPECUARIOS", 204, 14, { align: "right" });

    const fechaEmision = predio.fecha_registro
        ? new Date(predio.fecha_registro).toLocaleDateString()
        : new Date().toLocaleDateString();
    doc.text(`Fecha de Registro: ${fechaEmision}`, 204, 18, { align: "right" });

    doc.setDrawColor(...verdeBarinas);
    doc.setLineWidth(0.6);
    doc.line(12, 25, 204, 25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...verdeBarinas);
    doc.text(`FICHA TÉCNICA DE CARACTERIZACIÓN AGROPECUARIA: ${(predio.nombre_predio || "SIN NOMBRE").toUpperCase()}`, 12, 33);

    // ────────────────────────────────────────────────────────
    // SECCIÓN I: IDENTIFICACIÓN GENERAL
    // ────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("I. IDENTIFICACIÓN GENERAL", 12, 42);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(12, 44, 204, 44);

    const infoGeneral = [
        ["Productor:", predio.productor?.nombre || "N/A", "Cédula / RIF:", predio.productor?.cedula_rif || "N/A"],
        ["Municipio:", predio.municipio || "N/A", "Parroquia:", predio.parroquia || "N/A"],
        ["Superficie Total:", predio.superficie ? `${predio.superficie} Ha` : "0.00 Ha", "Coordenadas UTM:", predio.coordenadas || "N/A"]
    ];

    autoTable(doc, {
        startY: 46,
        body: infoGeneral,
        theme: "plain",
        styles: { fontSize: 8.5, cellPadding: 1.8, font: "helvetica" },
        columnStyles: {
            0: { fontStyle: "bold", width: 28, textColor: grisOscuro },
            1: { width: 72 },
            2: { fontStyle: "bold", width: 28, textColor: grisOscuro },
            3: { width: 64 }
        },
        margin: { left: 12, right: 12 }
    });

    // ────────────────────────────────────────────────────────
    // SECCIÓN II: EXISTENCIA ANIMAL
    // ────────────────────────────────────────────────────────
    let currentY = doc.lastAutoTable.finalY + 6;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...verdeBarinas);
    doc.text("II. INVENTARIO DE EXISTENCIA ANIMAL (REBAÑOS)", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const extAnimal = predio.existencia_animal || {};
    let bodyAnimales = [];

    const mapeoEspecies = [
        { clave: "bovinos", capacidad: "capacidadBovina", etiqueta: "GANADO BOVINO (VACUNO)" },
        { clave: "vacunos", capacidad: "capacidadVacuna", etiqueta: "GANADO BOVINO (VACUNO)" },
        { clave: "bubalinos", capacidad: "capacidadBubalina", etiqueta: "GANADO BUBALINO" },
        { clave: "equinos", capacidad: "capacidadEquina", etiqueta: "GANADO EQUINO" },
        { clave: "ovinos", capacidad: "capacidadOvina", etiqueta: "GANADO OVINO" },
        { clave: "porcinos", capacidad: "capacidadPorcina", etiqueta: "GANADO PORCINO" },
        { clave: "caprinos", capacidad: "capacidadCaprino", etiqueta: "GANADO CAPRINO" },
        { clave: "cunicola", capacidad: "capacidadCunicola", etiqueta: "CUNÍCULA" },
        { clave: "avicola", capacidad: "capacidadAvicola", etiqueta: "AVÍCOLA" },
        { clave: "apicola", capacidad: "capacidadApicola", etiqueta: "APÍCOLA" }
    ];

    mapeoEspecies.forEach(esp => {
        const datosEspecie = extAnimal[esp.clave];
        if (datosEspecie && typeof datosEspecie === 'object' && Object.keys(datosEspecie).length > 0) {
            const capData = extAnimal[esp.capacidad] || {};
            let capTexto = "No especificada";
            if (Object.keys(capData).length > 0) {
                capTexto = Object.entries(capData)
                    .filter(([k]) => k !== "id")
                    .map(([k, v]) => `${k.replace(/_/g, " ").toUpperCase()}: ${Array.isArray(v) ? v.join(", ") : v}`)
                    .join(" | ");
            }

            Object.entries(datosEspecie).forEach(([subcat, cant]) => {
                if (subcat === "id" || cant === 0 || cant === "0") return;
                bodyAnimales.push([
                    esp.etiqueta,
                    subcat.replace(/_/g, " ").toUpperCase(),
                    `${cant} Unid.`,
                    capTexto
                ]);
            });
        }
    });

    if (bodyAnimales.length === 0) {
        bodyAnimales = [["Sin existencias animales declaradas o registradas.", "", "", ""]];
    }

    autoTable(doc, {
        startY: currentY + 4,
        head: [["Especie", "Subtipo / Categoría", "Cantidad", "Capacidad Productiva"]],
        body: bodyAnimales,
        theme: "striped",
        headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold" },
        styles: { fontSize: 8.5, cellPadding: 2, font: "helvetica" },
        columnStyles: { 0: { width: 45 }, 1: { width: 45 }, 2: { width: 25 }, 3: { width: 82 } },
        margin: { left: 12, right: 12 }
    });

    // ────────────────────────────────────────────────────────
    // SECCIÓN III: INTENCIONALIDAD DE SIEMBRA (RUBROS VEGETALES)
    // ────────────────────────────────────────────────────────
    currentY = doc.lastAutoTable.finalY + 6;
    doc.setFont("helvetica", "bold");
    doc.text("III. INTENCIONALIDAD DE SIEMBRA (RUBROS VEGETALES)", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const rubros = predio.rubros_vegetales || [];
    const bodyRubros = rubros.length > 0
        ? rubros.map(r => [
            r.rubro || "N/A",
            r.hectareas ? `${r.hectareas} Ha` : "0 Ha",
            r.estado || "N/A",
            r.riego || "N/A",
            r.ciclo_productivo || "N/A",
            r.produccion_estimada ? `${r.produccion_estimada} Kg` : "0 Kg",
            r.destino || "N/A"
          ])
        : [["Sin rubros vegetales declarados.", "", "", "", "", "", ""]];

    autoTable(doc, {
        startY: currentY + 4,
        head: [["Rubro", "Superficie", "Estado", "Riego", "Ciclo", "Prod. Estimada", "Destino"]],
        body: bodyRubros,
        theme: "striped",
        headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold" },
        styles: { fontSize: 8.5, cellPadding: 2, font: "helvetica" },
        margin: { left: 12, right: 12 }
    });

    // ────────────────────────────────────────────────────────
    // SECCIÓN IV: MECANIZACIÓN Y MAQUINARIAS (CON OTROS EQUIPOS)
    // ────────────────────────────────────────────────────────
    currentY = doc.lastAutoTable.finalY + 6;
    doc.setFont("helvetica", "bold");
    doc.text("IV. MECANIZACIÓN Y EQUIPOS TECNOLÓGICOS", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const maquinaria = predio.maquinaria || {};
    let bodyMaquinarias = [];

    // 1. Procesar Maquinaria Agrícola sobre Ruedas
    if (maquinaria.maquinaria_ruedas && typeof maquinaria.maquinaria_ruedas === 'object') {
        Object.entries(maquinaria.maquinaria_ruedas).forEach(([maq, num]) => {
            if (num === 0 || num === "0" || maq === "id") return;
            bodyMaquinarias.push([
                "MAQUINARIA SOBRE RUEDAS",
                maq.replace(/_/g, " ").toUpperCase(),
                `${num} Unid.`
            ]);
        });
    }

    // 2. Procesar Implementos
    if (maquinaria.implementos && typeof maquinaria.implementos === 'object') {
        Object.entries(maquinaria.implementos).forEach(([imp, num]) => {
            if (num === 0 || num === "0" || imp === "id") return;
            bodyMaquinarias.push([
                "IMPLEMENTOS AGRÍCOLAS",
                imp.replace(/_/g, " ").toUpperCase(),
                `${num} Unid.`
            ]);
        });
    }

    // 3. Procesar Equipamientos de Riego
    if (maquinaria.riego && typeof maquinaria.riego === 'object') {
        Object.entries(maquinaria.riego).forEach(([bom, cant]) => {
            if (cant === 0 || cant === "0" || bom === "id") return;
            bodyMaquinarias.push([
                "EQUIPOS DE RIEGO",
                bom.replace(/_/g, " ").toUpperCase(),
                `${cant} Unid.`
            ]);
        });
    }

    // 4. Procesar Otros Equipos (Agregado para solventar la omisión)
    if (maquinaria.otros_equipos && typeof maquinaria.otros_equipos === 'object') {
        Object.entries(maquinaria.otros_equipos).forEach(([eq, cant]) => {
            if (cant === 0 || cant === "0" || eq === "id") return;
            bodyMaquinarias.push([
                "OTROS EQUIPOS / TECNOLOGÍA",
                eq.replace(/_/g, " ").toUpperCase(),
                `${cant} Unid.`
            ]);
        });
    }

    if (bodyMaquinarias.length === 0) {
        bodyMaquinarias = [["No se registraron maquinarias o equipos tecnológicos.", "", ""]];
    }

    autoTable(doc, {
        startY: currentY + 4,
        head: [["Categoría", "Nombre de la Maquinaria / Equipo", "Cantidad"]],
        body: bodyMaquinarias,
        theme: "striped",
        headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold" },
        styles: { fontSize: 8.5, cellPadding: 2, font: "helvetica" },
        columnStyles: { 0: { width: 60 }, 1: { width: 95 }, 2: { width: 37 } },
        margin: { left: 12, right: 12 }
    });

    // ────────────────────────────────────────────────────────
    // PIE DE PÁGINA
    // ────────────────────────────────────────────────────────
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(140, 140, 140);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(12, 268, 204, 268);
        doc.text("Ficha Técnica de Caracterización Territorial y Productiva — UTMPPAPT.", 12, 272);
        doc.text(`Página ${i} de ${totalPaginas}`, 204, 272, { align: "right" });
    }

    const fileSanitizado = `Ficha_Caracterizacion_Limpia_${(predio.nombre_predio || "Predio").replace(/\s+/g, "_")}.pdf`;
    doc.save(fileSanitizado);
};


    return (
        <div style={{ fontFamily: "'Poppins', sans-serif" }}>

            {/* NAVBAR */}
            <nav style={{ display: "flex", alignItems: "center", padding: "0 48px", height: "68px", backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100, gap: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", cursor: "pointer" }} onClick={() => navigate("/")}>
                    <img src={logo} alt="Logo" style={{ height: 45 }} />
                    <img src={escudo} alt="Escudo" style={{ height: 45 }} />
                </div>
                <span style={{ fontSize: "12px", color: "#888", fontStyle: "italic", lineHeight: 1.4, borderLeft: "2px solid #e0e0e0", paddingLeft: "16px" }}>
                    Estado Barinas<br /><strong style={{ color: "#589e38", fontStyle: "normal" }}>Venezuela</strong>
                </span>
                <div style={{ flex: 1 }} />
                <button onClick={() => navigate("/")} style={{ background: "none", border: "1.5px solid #aaa", color: "#666", padding: "8px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>← Portal</button>
            </nav>

            {/* HERO PRODUCTORES */}
            <div id="productor-info" style={{ position: "relative", height: "520px", overflow: "hidden", display: "flex", alignItems: "center", background: "linear-gradient(120deg, #0a3d24 0%, #136442 55%, #1a7a50 100%)" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%)", zIndex: 1 }} />
                <img src="https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?q=80&w=735&auto=format&fit=crop" alt="Productores" style={{ position: "absolute", right: 0, top: 0, width: "52%", height: "100%", objectFit: "cover", opacity: 0.3, clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
                <div style={{ position: "absolute", right: "48%", top: 0, bottom: 0, width: "1px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)", zIndex: 2 }} />

                <div style={{ position: "relative", zIndex: 3, padding: "0 80px", maxWidth: "640px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "20px", padding: "6px 14px", marginBottom: "20px" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
                        <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>Módulo de Información — MPPAT</span>
                    </div>
                    <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: 700, lineHeight: 1.15, margin: "0 0 18px" }}>Consulta y Gestión<br /><span style={{ color: "#86efac" }}>de Datos del Productor</span></h1>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", lineHeight: 1.8, margin: "0 0 36px" }}>Ingrese su número de cédula para acceder a su ficha técnica, historial de predios y registros actualizados ante el sistema agropecuario del estado Barinas.</p>
                </div>
            </div>

            {/* SECCIÓN DE CONSULTA */}
            <div style={{ padding: "80px 20px", display: "flex", justifyContent: "center", background: "#f8faf9" }}>
                <div style={{ width: "100%", maxWidth: "450px", padding: "40px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "1px solid #eef0ee" }}>
                    <h3 style={{ color: "#1b4332", margin: "0 0 24px", fontSize: "18px", textAlign: "center" }}>Verificar Identidad</h3>

                    <InputField
                        label="Cédula de Identidad"
                        value={cedula}
                        onChange={handleCedulaChange}
                        error={errors.productor_cedula}
                        maxLength={8}
                        placeholder="31067189"
                        prefix={
                            <select
                                value={prefijo}
                                onChange={(e) => {
                                    setPrefijo(e.target.value);
                                    validarCampoProductor(cedula);
                                }}
                                style={{ border: "none", padding: "0 10px", backgroundColor: "transparent", fontWeight: "600", color: "#475569", cursor: "pointer", height: "100%" }}
                            >
                                <option value="V-">V-</option>
                                <option value="E-">E-</option>
                            </select>
                        }
                    />

                    <button
                        onClick={buscarProductorEnBD}
                        disabled={buscando || !cedula}
                        style={{
                            width: "100%", padding: "14px", backgroundColor: "#136442", color: "#fff", border: "none", borderRadius: "8px",
                            fontWeight: 600, fontSize: "14px", cursor: buscando ? "not-allowed" : "pointer",
                            display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"
                        }}
                    >
                        {buscando ? <Spinner color="#fff" /> : "Consultar Datos"}
                    </button>

                    {resultado && (
                        <div style={{ marginTop: "20px", padding: "15px", borderRadius: "8px", backgroundColor: resultado.existe ? "#dcfce7" : "#fee2e2", border: resultado.existe ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
                            {resultado.existe ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <p style={{ color: "#166534", margin: 0, fontSize: "14px" }}>
                                        Productor encontrado: <strong>{resultado.nombre}</strong>
                                    </p>
                                    {/*BOTÓN DE EXPORTAR */}
                                    <button
                                        onClick={exportarFichaConValidacion}
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            backgroundColor: "#16a34a",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "6px",
                                            fontWeight: "600",
                                            fontSize: "13px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "6px",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                            transition: "background-color 0.2s"
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#15803d"}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#16a34a"}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        Exportar Documento
                                    </button>
                                </div>
                            ) : (
                                <p style={{ color: "#991b1b", margin: 0, fontSize: "14px" }}>No se encontró un productor con esa cédula.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <footer style={{ background: "#fff", color: "#555", borderTop: "1px solid #e8e8e8" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "56px 80px 40px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                            <img src={logo} alt="Logo" style={{ height: 50 }} />
                            <img src={escudo} alt="Escudo" style={{ height: 40 }} />
                        </div>
                        <p style={{ fontSize: "14px", lineHeight: 1.8, color: "#777" }}>Ecosistema digital agropecuario del estado Barinas. Plataforma oficial para el registro y gestión de la actividad productiva del campo barinés.</p>
                    </div>
                    <div>
                        <h4 style={{ color: "#1b4332", fontSize: "14px", fontWeight: 600, margin: "0 0 20px", textTransform: "uppercase" }}>Navegación</h4>
                        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                            {NAV_ITEMS.map(item => <li key={item.label}><a href={item.href} style={{ color: "#777", textDecoration: "none", fontSize: "14px" }}>{item.label}</a></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: "#1b4332", fontSize: "14px", fontWeight: 600, margin: "0 0 20px", textTransform: "uppercase" }}>Contacto</h4>
                        <p style={{ color: "#777", fontSize: "13px" }}>agrosistema@barinas.gob.ve<br />(0273) 300-0000</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}