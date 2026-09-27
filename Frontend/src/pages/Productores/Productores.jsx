import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../../assets/gobierno.jpg";
import escudo from "../../assets/logo2.jpg";
import axios from 'axios';
import Swal from 'sweetalert2';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
            const response = await axios.get(url);
            setResultado(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setResultado({ existe: false });
            } else {
                console.error("Error de conexión:", error);
            }
        } finally {
            setBuscando(false);
        }
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
        const telefonoProductor = resultado?.productor?.telefono || resultado?.telefono;

        if (!resultado || !telefonoProductor) {
            Swal.fire({
                icon: "warning",
                title: "Datos incompletos",
                text: "El productor no posee un número de teléfono registrado en el sistema para realizar la validación.",
                confirmButtonColor: '#136442',
            });
            return;
        }

        const confirmacion = await Swal.fire({
            title: "¿Exportar ficha técnica?",
            text: `Se enviará un código de validación al WhatsApp registrado del productor`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, enviar código",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#136442",
        });

        if (!confirmacion.isConfirmed) return;

        let codigoServidor = "";
        try {
            const envio = await axios.post("http://127.0.0.1:8000/api/enviar-codigo/", { telefono: telefonoProductor });
            codigoServidor = envio.data.codigo.toString();

            await Swal.fire({
                icon: "success",
                title: "Código enviado",
                text: "El código de seguridad fue enviado al WhatsApp del productor",
                confirmButtonColor: "#136442",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error de comunicación",
                text: "No se pudo despachar el código de validación.",
                confirmButtonColor: "#d32f2f",
            });
            return;
        }

        const { value: codigoUsuario } = await Swal.fire({
            title: "Validación de Seguridad",
            input: "text",
            inputLabel: "Ingrese el código recibido por el productor",
            inputPlaceholder: "Código de verificación",
            confirmButtonText: "Verificar y Descargar",
            confirmButtonColor: "#136442",
            showCancelButton: true,
        });

        if (!codigoUsuario || codigoUsuario !== codigoServidor) {
            Swal.fire({
                icon: "error",
                title: "Código inválido",
                text: "El código ingresado no coincide o fue cancelado.",
                confirmButtonColor: "#d32f2f",
            });
            return;
        }

        try {
            const cedulaRif = resultado?.cedula_rif;

            Swal.fire({
                title: 'Buscando...',
                text: 'Consultando registros del productor, por favor espere.',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            const { data } = await axios.get(`http://127.0.0.1:8000/api/predios/`, {
                params: { cedula: cedulaRif }
            });

            const listaPredios = Array.isArray(data) ? data : data.results;

            if (!listaPredios || listaPredios.length === 0) {
                Swal.close();
                Swal.fire({
                    icon: "error",
                    title: "Predio no encontrado",
                    text: "Este productor no tiene un predio registrado.",
                    confirmButtonColor: "#d32f2f",
                });
                return;
            }

            const predioCompleto = listaPredios[0];
            await GenerarFichaProductor(predioCompleto);
            Swal.close();

        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al intentar generar el PDF.",
                confirmButtonColor: "#d32f2f",
            });
        }
    };

// FUNCIÓN DE PDF GLOBAL CON TODAS LAS SECCIONES Y CAMPOS EN 0 INCLUIDOS
    const GenerarFichaProductor = (predio) => {
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

        // Cintillo institucional
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
        doc.setFontSize(12);
        doc.setTextColor(...verdeBarinas);
        doc.text(`FICHA TÉCNICA INTEGRAL: ${(predio.nombre_predio || "SIN NOMBRE").toUpperCase()}`, 12, 33);

        let currentY = 40;

        // ────────────────────────────────────────────────────────
        // SECCIÓN I: IDENTIFICACIÓN GENERAL Y DATOS DEL PRODUCTOR
        // ────────────────────────────────────────────────────────
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...verdeBarinas);
        doc.text("I. IDENTIFICACIÓN GENERAL Y DATOS DEL PRODUCTOR", 12, currentY);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const infoGeneral = [
            ["Productor:", predio.productor?.nombre || "N/A", "Cédula / RIF:", predio.productor?.cedula_rif || "N/A"],
            ["Teléfono:", predio.productor?.telefono || "N/A", "Correo:", predio.productor?.correo || "N/A"],
            ["Municipio:", predio.municipio || "N/A", "Parroquia:", predio.parroquia || "N/A"],
            ["Comunidad / Sector:", predio.comunidad || "N/A", "Centro Poblado:", predio.centro_poblado || "N/A"],
            ["Superficie Total:", predio.superficie !== null && predio.superficie !== undefined ? `${predio.superficie} Ha` : "0.00 Ha", "Coordenadas UTM:", predio.coordenadas || "N/A"],
            ["Tipo de Propiedad:", predio.tipo_propiedad || "N/A", "Tenencia:", predio.tenencia || "N/A"],
            ["Vialidad Interna:", predio.vialidad || "N/A", "Dirección:", predio.direccion || "N/A"]
        ];

        autoTable(doc, {
            startY: currentY + 4,
            body: infoGeneral,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
            columnStyles: {
                0: { fontStyle: "bold", width: 32, textColor: grisOscuro, fillColor: [250, 250, 250] },
                1: { width: 70 },
                2: { fontStyle: "bold", width: 32, textColor: grisOscuro, fillColor: [250, 250, 250] },
                3: { width: 58 }
            },
            margin: { left: 12, right: 12 }
        });

        // ────────────────────────────────────────────────────────
        // SECCIÓN II: INFRAESTRUCTURA Y ESTRUCTURAS DISPONIBLES
        // ────────────────────────────────────────────────────────
        currentY = doc.lastAutoTable.finalY + 6;
        if (currentY > 230) { doc.addPage(); currentY = 20; }

        doc.setFont("helvetica", "bold");
        doc.text("II. INFRAESTRUCTURA Y ESTRUCTURAS DISPONIBLES", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const infra = predio.infraestructura || {};
        const infraData = [
            ["Corrales:", infra.corrales !== undefined ? infra.corrales : 0, "Galpones:", infra.galpones !== undefined ? infra.galpones : 0, "Vaqueras:", infra.vaqueras !== undefined ? infra.vaqueras : 0],
            ["Cochineras:", infra.cochineras !== undefined ? infra.cochineras : 0, "Silos:", infra.silos !== undefined ? infra.silos : 0, "Caballerizas:", infra.caballerizas !== undefined ? infra.caballerizas : 0],
            ["Feedlot:", infra.feedlot !== undefined ? infra.feedlot : 0, "Lagunas:", infra.lagunas !== undefined ? infra.lagunas : 0, "Salas de Ordeño:", infra.salas_ordeno !== undefined ? infra.salas_ordeno : 0],
            ["Queseras:", infra.queseras !== undefined ? infra.queseras : 0, "Casas:", infra.casas !== undefined ? infra.casas : 0, "Trapiches:", infra.trapiches !== undefined ? infra.trapiches : 0],
            ["Establos:", infra.establos !== undefined ? infra.establos : 0, "", "", "", ""]
        ];

        autoTable(doc, {
            startY: currentY + 4,
            body: infraData,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
            columnStyles: {
                0: { fontStyle: "bold", width: 34, textColor: grisOscuro, fillColor: [250, 250, 250] },
                1: { width: 30, halign: "center" },
                2: { fontStyle: "bold", width: 34, textColor: grisOscuro, fillColor: [250, 250, 250] },
                3: { width: 30, halign: "center" },
                4: { fontStyle: "bold", width: 38, textColor: grisOscuro, fillColor: [250, 250, 250] },
                5: { width: 26, halign: "center" }
            },
            margin: { left: 12, right: 12 }
        });

        // ────────────────────────────────────────────────────────
        // SECCIÓN III: RÉGIMEN SOCIO-PRODUCTIVO Y CONTROLES
        // ────────────────────────────────────────────────────────
        currentY = doc.lastAutoTable.finalY + 6;
        if (currentY > 230) { doc.addPage(); currentY = 20; }

        doc.setFont("helvetica", "bold");
        doc.text("III. RÉGIMEN SOCIO-PRODUCTIVO Y CONTROLES", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const prod = predio.produccion || {};
        const datosProduccion = [
            ["Tipo de Explotación principal:", prod.tipo_explotacion || "N/A"],
            ["Registro Sanitario Vigente:", prod.registro_sanitario ? "SÍ" : "NO"],
            ["Registro de Control Productivo:", prod.registro_productivo ? "SÍ" : "NO"],
            ["Registro de Control Reproductivo:", prod.registro_reproductivo ? "SÍ" : "NO"],
            ["Registro Financiero / Contable:", prod.registro_financiero ? "SÍ" : "NO"]
        ];

        autoTable(doc, {
            startY: currentY + 4,
            body: datosProduccion,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2.2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
            columnStyles: {
                0: { fontStyle: "bold", width: 130, textColor: grisOscuro, fillColor: [250, 250, 250] },
                1: { halign: "center", fontStyle: "bold", textColor: verdeBarinas, width: 62 }
            },
            margin: { left: 12, right: 12 }
        });

        // ────────────────────────────────────────────────────────
        // SECCIÓN IV: INTENCIONALIDAD DE SIEMBRA (RUBROS VEGETALES)
        // ────────────────────────────────────────────────────────
        currentY = doc.lastAutoTable.finalY + 6;
        if (currentY > 230) { doc.addPage(); currentY = 20; }

        doc.setFont("helvetica", "bold");
        doc.text("IV. INTENCIONALIDAD DE SIEMBRA (RUBROS VEGETALES)", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const rubros = predio.rubros_vegetales || [];
        const bodyRubros = rubros.length > 0
            ? rubros.map(r => [
                r.rubro || "N/A",
                r.hectareas !== null && r.hectareas !== undefined ? `${r.hectareas} Ha` : "0 Ha",
                r.estado || "N/A",
                r.riego || "N/A",
                r.ciclo_productivo || "N/A",
                r.produccion_estimada !== null && r.produccion_estimada !== undefined ? `${r.produccion_estimada} Kg` : "0 Kg",
                r.destino || "N/A"
            ])
            : [["Sin rubros vegetales declarados.", "", "", "", "", "", ""]];

        autoTable(doc, {
            startY: currentY + 4,
            head: [["Rubro", "Superficie", "Estado", "Riego", "Ciclo", "Prod. Estimada", "Destino"]],
            body: bodyRubros,
            theme: "grid",
            headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold", textColor: [255, 255, 255] },
            styles: { fontSize: 8, cellPadding: 2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
            margin: { left: 12, right: 12 }
        });

        // ────────────────────────────────────────────────────────
        // SECCIÓN V: INVENTARIO DE SEMOVIENTES Y CAPACIDAD PRODUCTIVA (Dinámico)
        // ────────────────────────────────────────────────────────
        currentY = doc.lastAutoTable.finalY + 6;
        if (currentY > 230) { doc.addPage(); currentY = 20; }

        doc.setFont("helvetica", "bold");
        doc.text("V. INVENTARIO DE SEMOVIENTES Y CAPACIDAD PRODUCTIVA", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const existenciaAnimal = predio.existencia_animal || {};
        let bodySemovientes = [];

        if (Object.keys(existenciaAnimal).length > 0) {
            Object.entries(existenciaAnimal).forEach(([especie, detalleEspecie]) => {
                if (!detalleEspecie || typeof detalleEspecie !== "object" || Object.keys(detalleEspecie).length === 0) return;
                
                bodySemovientes.push([{ content: `ESPECIE: ${especie.replace(/_/g, " ").toUpperCase()}`, colSpan: 2, styles: { fontStyle: "bold", fillColor: [230, 240, 235], textColor: verdeBarinas } }]);

                Object.entries(detalleEspecie).forEach(([subKey, subValue]) => {
                    if (subKey === "id") return;
                    const valorFinal = (subValue !== null && subValue !== undefined) ? subValue : 0;
                    bodySemovientes.push([
                        subKey.replace(/_/g, " ").toUpperCase(),
                        valorFinal
                    ]);
                });
            });
        }

        if (bodySemovientes.length === 0) {
            bodySemovientes = [["Sin inventario animal o capacidad productiva registrada en este predio.", ""]];
        }

        autoTable(doc, {
            startY: currentY + 4,
            head: [["Categoría / Indicador Productivo", "Cantidad / Valor"]],
            body: bodySemovientes,
            theme: "grid",
            headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold", textColor: [255, 255, 255] },
            styles: { fontSize: 8, cellPadding: 1.8, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
            columnStyles: { 0: { width: 140 }, 1: { width: 52, halign: "center" } },
            margin: { left: 12, right: 12 }
        });

        // ────────────────────────────────────────────────────────
        // SECCIÓN VI: MAQUINARIA, IMPLEMENTOS Y EQUIPOS (Dinámico)
        // ────────────────────────────────────────────────────────
        currentY = doc.lastAutoTable.finalY + 6;
        if (currentY > 230) { doc.addPage(); currentY = 20; }

        doc.setFont("helvetica", "bold");
        doc.text("VI. MAQUINARIA, IMPLEMENTOS Y EQUIPOS", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const maquinaria = predio.maquinaria || {};
        let bodyMaquinaria = [];

        if (Object.keys(maquinaria).length > 0) {
            Object.entries(maquinaria).forEach(([tipoMaq, detalleMaq]) => {
                if (!detalleMaq || typeof detalleMaq !== "object" || Object.keys(detalleMaq).length === 0) return;

                bodyMaquinaria.push([{ content: `TIPO: ${tipoMaq.replace(/_/g, " ").toUpperCase()}`, colSpan: 2, styles: { fontStyle: "bold", fillColor: [230, 240, 235], textColor: verdeBarinas } }]);

                Object.entries(detalleMaq).forEach(([itemKey, itemVal]) => {
                    if (itemKey === "id") return;
                    const valMaq = (itemVal !== null && itemVal !== undefined) ? itemVal : 0;
                    bodyMaquinaria.push([
                        itemKey.replace(/_/g, " ").toUpperCase(),
                        valMaq
                    ]);
                });
            });
        }

        if (bodyMaquinaria.length === 0) {
            bodyMaquinaria = [["Sin maquinaria o equipos registrados.", ""]];
        }

        autoTable(doc, {
            startY: currentY + 4,
            head: [["Elemento / Equipo", "Cantidad"]],
            body: bodyMaquinaria,
            theme: "grid",
            headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold", textColor: [255, 255, 255] },
            styles: { fontSize: 8, cellPadding: 1.8, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
            columnStyles: { 0: { width: 140 }, 1: { width: 52, halign: "center" } },
            margin: { left: 12, right: 12 }
        });

        // ────────────────────────────────────────────────────────
        // SECCIÓN VII: SERVICIOS BÁSICOS INSTALADOS EN EL PREDIO
        // ────────────────────────────────────────────────────────
        currentY = doc.lastAutoTable.finalY + 6;
        if (currentY > 235) { doc.addPage(); currentY = 20; }

        doc.setFont("helvetica", "bold");
        doc.text("VII. SERVICIOS BÁSICOS INSTALADOS EN EL PREDIO", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const serviciosFinales = predio.servicios_lectura || [];
        const serviciosProcesados = serviciosFinales.map(s => {
            if (!s) return "";
            const str = s.toString();
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        });

        const listaServiciosText = serviciosProcesados.length > 0
            ? serviciosProcesados.join("   |   ")
            : "Ningún servicio básico declarado en el registro territorial.";

        autoTable(doc, {
            startY: currentY + 4,
            body: [["SERVICIOS DISPONIBLES", listaServiciosText]],
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
            columnStyles: {
                0: { fontStyle: "bold", width: 45, textColor: grisOscuro, fillColor: [250, 250, 250] },
                1: { width: 147, fontStyle: serviciosFinales.length > 0 ? "normal" : "italic", textColor: serviciosFinales.length > 0 ? [20, 20, 20] : [110, 110, 110] }
            },
            margin: { left: 12, right: 12 }
        });

        // Pie de página
        const totalPaginas = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPaginas; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(140, 140, 140);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
            doc.line(12, 268, 204, 268);
            doc.text("Ficha Técnica Integral de Caracterización — UTMPPAPT.", 12, 272);
            doc.text(`Página ${i} de ${totalPaginas}`, 204, 272, { align: "right" });
        }

        const fileSanitizado = `Ficha_Tecnica_Integral_${(predio.nombre_predio || "Predio").replace(/\s+/g, "_")}.pdf`;
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