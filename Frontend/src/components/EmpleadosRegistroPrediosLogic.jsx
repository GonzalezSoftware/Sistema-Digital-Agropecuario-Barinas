import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { validarCampoProductor } from "../components/EmpleadosPrediosValidaciones";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const grid3 = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" };
export const gridCheck = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" };
export const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" };
export const inputStyle = { width: "100%", padding: "10px 14px", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" };
export const radioLabel = { fontSize: "13px", color: "#334155", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px", background: "#f1f5f9", borderRadius: "8px" };

export const PARROQUIAS_POR_MUNICIPIO = {
    "Barinas": [
        "Barinas",
        "Alfredo Arvelo Larriva",
        "Alto Barinas",
        "Corazón de Jesús",
        "El Carmen",
        "Juan Antonio Rodríguez Domínguez",
        "Manuel Palacio Fajardo",
        "Ramón Ignacio Méndez",
        "Rómulo Betancourt",
        "Santa Lucía",
        "Torunos",
        "San Silvestre",
        "Santa Inés",
        "Dominga Ortiz de Páez"
    ],
    "Alberto_Arvelo": [
        "Sabaneta",
        "Juan Antonio Rodríguez Domínguez"
    ],
    "Andrés_Eloy": [
        "El Cantón",
        "Santa Cruz de Guacas",
        "Puerto Vivas"
    ],
    "Antonio_Jose": [
        "Ticoporo",
        "Nicolás Pulido",
        "Andrés Bello"
    ],
    "Arismendi": [
        "Arismendi",
        "Guadarrama",
        "La Unión",
        "San Antonio"
    ],
    "Bolívar": [
        "Barinitas",
        "Altamira de Cáceres",
        "Calderas"
    ],
    "Cruz_Paredes": [
        "Barrancas",
        "El Socorro",
        "Masparrito"
    ],
    "Ezequiel_Zamora": [
        "Santa Bárbara",
        "José Ignacio del Pumar",
        "Pedro Briceño Méndez",
        "Ramón Ignacio Méndez"
    ],
    "Obispos": [
        "Obispos",
        "Los Guasimitos",
        "El Real",
        "La Luz"
    ],
    "Pedraza": [
        "Ciudad Bolivia",
        "Ignacio Briceño",
        "José Félix Ribas",
        "Páez"
    ],
    "Rojas": [
        "Libertad",
        "Dolores",
        "Palacio Fajardo",
        "Santa Rosa",
        "Simón Rodríguez"
    ],
    "Sosa": [
        "Ciudad de Nutrias",
        "El Regalo",
        "Puerto Nutrias",
        "Santa Catalina",
        "Simón Bolívar"
    ]
};

export const FormSection = ({ title, children }) => (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#136442", marginBottom: "20px", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px" }}>
            {title}
        </h3>
        {children}
    </div>
);

// Reemplaza tu antiguo InputField por este completo:
export const InputField = ({ label, error, prefix, labelStyle, inputStyle, ...props }) => {
    // Depuración: Muestra en la consola el campo y el error actual que recibe
    console.log(`[InputField] Campo: "${props.name || 'sin nombre'}" | Error recibido:`, error);

    return (
        <div style={{ marginBottom: "15px" }}>
            {label && <label style={labelStyle || { fontSize: "12px", fontWeight: "600", color: "#374151" }}>{label}</label>}
            <div style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "all 0.2s ease",
                border: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                backgroundColor: props.disabled ? "#e2e8f0" : (error ? "#fef2f2" : "#f8fafc")
            }}>
                {prefix && (
                    <div style={{
                        height: "42px",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: error ? "#fee2e2" : "#f1f5f9",
                        borderRight: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                        padding: "0 10px"
                    }}>
                        {prefix}
                    </div>
                )}
                <input
                    {...props}
                    style={{
                        ...(inputStyle || { width: "100%", padding: "10px 14px", fontSize: "13px" }),
                        height: "42px",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        margin: 0,
                        cursor: props.disabled ? "not-allowed" : "text",
                        color: props.disabled ? "#475569" : "#1e293b",
                        fontWeight: props.disabled ? "600" : "normal"
                    }}
                />
            </div>
            {error && (
                <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "5px", fontWeight: "600" }}>
                    {error}
                </p>
            )}
        </div>
    );
};
export const SelectField = ({ label, options = [], error, value, onChange, name, disabled, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>{label}</label>
        <select
            name={name}
            value={value || ""}
            onChange={onChange}
            disabled={disabled}
            {...props}
            style={{
                ...inputStyle,
                height: "42px",
                borderRadius: "8px",
                border: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                backgroundColor: disabled ? "#e2e8f0" : (error ? "#fef2f2" : "#f8fafc"),
                cursor: disabled ? "not-allowed" : "pointer",
                color: disabled ? "#475569" : "#1e293b",
                fontWeight: disabled ? "600" : "normal"
            }}
        >
            <option value="" disabled>Seleccione...</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
        {error && (
            <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "5px", fontWeight: "600" }}>
                {error}
            </p>
        )}
    </div>
);

// Custom Hook para manejar toda la lógica de negocio y eventos
export function useEmpleadosRegistroPrediosLogic({ formData, setFormData, setErrors,errors, municipioEmpleado, prefijoCedula, listaPredios}) {
    
    const manejarCambio = (e) => {
        const { name, value } = e.target;

        // 1. Actualizamos el valor en el formData en tiempo real
        setFormData((prev) => ({
            ...(prev || {}),
            [name]: value
        }));

        // 2. Delegamos toda la validación a tu archivo externo EmpleadosPrediosValidaciones
        if (typeof validarCampoProductor === "function") {
            validarCampoProductor(name, value, formData, setErrors, listaPredios, municipioEmpleado);
        }
    };

    useEffect(() => {
        if (municipioEmpleado && formData.municipio !== municipioEmpleado) {
            setFormData(prev => ({
                ...(prev || {}),
                municipio: municipioEmpleado
            }));
        }
    }, [municipioEmpleado, formData.municipio, setFormData]);

    const obtenerParroquias = () => {
        const muniActual = municipioEmpleado || formData.municipio || "";
        if (!muniActual) return [];

        const limpiarStr = (str) =>
            str ? str.toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

        const muniLimpio = limpiarStr(muniActual);

        const municipioKey = Object.keys(PARROQUIAS_POR_MUNICIPIO).find(
            m => limpiarStr(m) === muniLimpio
        );

        return municipioKey ? PARROQUIAS_POR_MUNICIPIO[municipioKey] : [];
    };

    // Función auxiliar para generar el PDF en Blob usando jsPDF y autoTable
// Función exacta para generar el PDF en Blob manteniendo el diseño oficial de la Ficha Técnica
const generarPDFPredioBlob = (predio) => {
    if (!predio) return null;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter"
    });

    const verdeBarinas = [19, 100, 66];
    const grisOscuro = [40, 40, 40];

    // Cintillo institucional superior
    try {
        doc.addImage("/src/assets/logo.png", "PNG", 12, 5, 22, 16);
        doc.addImage("/src/assets/gobierno.jpg", "JPEG", 37, 5, 28, 16);
    } catch (error) {
        console.warn("No se pudieron cargar las imágenes de los logos en el PDF.", error);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...verdeBarinas);
    doc.text("MINISTERIO DEL PODER POPULAR PARA LA AGRICULTURA Y TIERRA", 204, 10, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("MPPAT — DIRECCIÓN ESTADAL DE REGISTROS AGROPECUARIOS", 204, 14, { align: "right" });

    const fechaEmision = predio.fecha_registro
        ? new Date(predio.fecha_registro).toLocaleDateString()
        : new Date().toLocaleDateString();
    doc.text(`Fecha de Registro: ${fechaEmision}`, 204, 18, { align: "right" });

    doc.setDrawColor(...verdeBarinas);
    doc.setLineWidth(0.6);
    doc.line(12, 25, 204, 25);

    // Título central
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...verdeBarinas);
    const tituloFicha = `FICHA TÉCNICA: ${(predio.nombre_predio || "SIN NOMBRE").toUpperCase()}`;
    doc.text(tituloFicha, 12, 34);

    let currentY = 42;

    // I. Datos del productor (En celdas / grid)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...verdeBarinas);
    doc.text("I. DATOS DEL PRODUCTOR", 12, currentY);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const datosProductor = [
        ["Nombre Completo:", predio.productor?.nombre || "N/A", "Cédula / RIF:", predio.productor?.cedula_rif || "N/A"],
        ["Teléfono Celular:", predio.productor?.telefono || "N/A", "Correo Electrónico:", predio.productor?.correo || "N/A"]
    ];

    autoTable(doc, {
        startY: currentY + 4,
        body: datosProductor,
        theme: "grid",
        styles: { fontSize: 8.5, cellPadding: 2.5, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { fontStyle: "bold", width: 32, textColor: grisOscuro, fillColor: [250, 250, 250] },
            1: { width: 68 },
            2: { fontStyle: "bold", width: 28, textColor: grisOscuro, fillColor: [250, 250, 250] },
            3: { width: 64 }
        },
        margin: { left: 12, right: 12 }
    });

    // II. Datos del predio (En celdas / grid)
    currentY = doc.lastAutoTable.finalY + 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...verdeBarinas);
    doc.text("II. DATOS DEL PREDIO E IDENTIFICACIÓN TERRITORIAL", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const datosPredio = [
        ["Municipio:", predio.municipio || "N/A", "Parroquia:", predio.parroquia || "N/A"],
        ["Comunidad / Sector:", predio.comunidad || "N/A", "Centro Poblado:", predio.centro_poblado || "N/A"],
        ["Superficie Total (Ha):", predio.superficie ? `${predio.superficie} Ha` : "0.00 Ha", "Coordenadas (Latitud/Longitud):", predio.coordenadas || "N/A"],
        ["Tipo de Propiedad:", predio.tipo_propiedad || "N/A", "Tenencia de Tierra:", predio.tenencia || "N/A"],
        ["Vialidad Interna:", predio.vialidad || "N/A", "Dirección Detallada:", predio.direccion || "N/A"]
    ];

    autoTable(doc, {
        startY: currentY + 4,
        body: datosPredio,
        theme: "grid",
        styles: { fontSize: 8.5, cellPadding: 2.5, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { fontStyle: "bold", width: 35, textColor: grisOscuro, fillColor: [250, 250, 250] },
            1: { width: 65 },
            2: { fontStyle: "bold", width: 32, textColor: grisOscuro, fillColor: [250, 250, 250] },
            3: { width: 60 }
        },
        margin: { left: 12, right: 12 }
    });

    // III. Infraestructura (En celdas / grid)
    currentY = doc.lastAutoTable.finalY + 7;
    if (currentY > 230) { doc.addPage(); currentY = 20; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...verdeBarinas);
    doc.text("III. INFRAESTRUCTURA Y ESTRUCTURAS DISPONIBLES", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const infra = predio.infraestructura || {};
    const infreestructureData = [
        ["Corrales:", infra.corrales || 0, "Galpones:", infra.galpones || 0, "Vaqueras:", infra.vaqueras || 0],
        ["Cochineras:", infra.cochineras || 0, "Silos:", infra.silos || 0, "Caballerizas:", infra.caballerizas || 0],
        ["Feedlot:", infra.feedlot || 0, "Lagunas / Reservorios:", infra.lagunas || 0, "Salas de Ordeño:", infra.salas_ordeno || 0],
        ["Queseras:", infra.queseras || 0, "Casas de Habitación:", infra.casas || 0, "Trapiches:", infra.trapiches || 0],
        ["Establos:", infra.establos || 0, "", "", "", ""]
    ];

    autoTable(doc, {
        startY: currentY + 4,
        body: infreestructureData,
        theme: "grid",
        styles: { fontSize: 8.5, cellPadding: 2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { fontStyle: "bold", textColor: verdeBarinas, width: 38, fillColor: [250, 250, 250] },
            1: { width: 26, halign: "center" },
            2: { fontStyle: "bold", textColor: verdeBarinas, width: 38, fillColor: [250, 250, 250] },
            3: { width: 26, halign: "center" },
            4: { fontStyle: "bold", textColor: verdeBarinas, width: 38, fillColor: [250, 250, 250] },
            5: { width: 26, halign: "center" }
        },
        margin: { left: 12, right: 12 }
    });

    // IV. Servicios Básicos (En celdas / grid)
    currentY = doc.lastAutoTable.finalY + 7;
    if (currentY > 235) { doc.addPage(); currentY = 20; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...verdeBarinas);
    doc.text("IV. SERVICIOS BÁSICOS INSTALADOS EN EL PREDIO", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const serviciosFinales = predio.servicios_lectura || predio.servicios || [];
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
        body: [["Servicios Disponibles:", listaServiciosText]],
        theme: "grid",
        styles: { fontSize: 8.5, cellPadding: 3, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { fontStyle: "bold", textColor: verdeBarinas, width: 42, fillColor: [250, 250, 250] },
            1: { fontStyle: serviciosFinales.length > 0 ? "normal" : "italic", textColor: serviciosFinales.length > 0 ? [20, 20, 20] : [110, 110, 110], width: 150 }
        },
        margin: { left: 12, right: 12 }
    });

    // Pie de página dinámico
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(140, 140, 140);

        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(12, 268, 204, 268);

        doc.text("Ficha técnica legalizada bajo los términos del Sistema Integral Agropecuario del Estado Barinas.", 12, 272);
        doc.text(`Página ${i} de ${totalPaginas}`, 204, 272, { align: "right" });
    }

    return doc.output("blob");
};

    const listaParroquias = obtenerParroquias();

    const manejarInfra = (key, e) => {
        const valorOriginal = e.target.value;
        const valorLimpio = valorOriginal.replace(/[^0-9]/g, "");

        setFormData(prev => ({
            ...(prev || {}),
            infraestructura: {
                ...((prev || {}).infraestructura || {}),
                [key]: valorLimpio
            }
        }));

        setErrors(prev => ({
            ...(prev || {}),
            [`infra_${key}`]: valorOriginal !== valorLimpio ? "Solo se permiten números" : ""
        }));
    };

    const manejarChecklist = (campo, item) => {
        setFormData(prev => {
            const currentPrev = prev || {};
            const listaActual = Array.isArray(currentPrev[campo]) ? currentPrev[campo] : [];
            const existe = listaActual.includes(item);
            return {
                ...currentPrev,
                [campo]: existe
                    ? listaActual.filter(s => s !== item)
                    : [...listaActual, item]
            };
        });
    };

    // AQUÍ COLOCAS LA FUNCIÓN QUE VALIDA EL FORMULARIO COMPLETO
    const esFormularioValido = () => {
        const camposRequeridos = [
            "productor_nombre",
            "productor_cedula",
            "productor_telefono",
            "parroquia",
            "comunidad",
            "centro_poblado",
            "coordenadas",
            "nombre_predio",
            "direccion",
            "superficie",
            "tipo_propiedad",
            "tenencia",
            "vialidad",
            "tipo_explotacion"
        ];

        const todosLlenos = camposRequeridos.every(campo => {
            const valor = formData[campo];
            if (Array.isArray(valor)) return valor.length > 0;
            return valor !== undefined && valor !== null && String(valor).trim() !== "";
        });

        const sinErrores = Object.values(errors).every(error => !error || error.trim() === "");

        return todosLlenos && sinErrores;
    };

    const guardarEnDjango = async () => {
        const correoProductor = formData.productor_correo?.trim();

        if (!correoProductor) {
            Swal.fire({
                title: 'Correo obligatorio',
                text: 'Debe ingresar un correo electrónico válido para enviar el código de verificación.',
                icon: 'warning'
            });
            return;
        }

        // 1. Solicitar el envío del código de 6 dígitos
        Swal.fire({
            title: 'Enviando código...',
            text: 'Generando y enviando el código de verificación al correo del productor.',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
           const resCodigo = await fetch('http://127.0.0.1:8000/api/enviar-codigo-correo/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: correoProductor })
            });

            const dataCodigo = await resCodigo.json();

            if (!resCodigo.ok) {
                throw new Error(dataCodigo.error || 'No se pudo enviar el correo de verificación.');
            }

            const codigoServidor = String(dataCodigo.codigo);

            // 2. Mostrar alerta para ingresar el código de 6 dígitos
            const { value: codigoIngresado } = await Swal.fire({
                title: 'Verificación de Correo',
                text: `Se ha enviado un código de 6 dígitos al correo ${correoProductor}. Por favor, ingréselo a continuación:`,
                input: 'text',
                inputAttributes: {
                    maxlength: 6,
                    autocapitalize: 'off',
                    autocorrect: 'off',
                    placeholder: '123456'
                },
                showCancelButton: true,
                confirmButtonText: 'Validar y Registrar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#136442',
                inputValidator: (value) => {
                    if (!value || value.trim().length !== 6) {
                        return '¡Debe ingresar un código válido de 6 dígitos!';
                    }
                }
            });

            if (!codigoIngresado) {
                return; // Si el usuario cancela
            }

            // 3. Validar el código
            if (codigoIngresado.trim() !== codigoServidor) {
                Swal.fire({
                    title: 'Código Incorrecto',
                    text: 'El código ingresado no coincide con el enviado al correo.',
                    icon: 'error',
                    confirmButtonColor: '#136442'
                });
                return;
            }

            // 4. Si el código es correcto, procedemos a guardar el predio
            Swal.fire({
                title: 'Procesando registro...',
                text: 'Guardando los datos del predio en el servidor.',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            const numeroLimpio = formData.productor_telefono ? formData.productor_telefono.replace(/\D/g, '') : '';
            const telefonoFormateado = numeroLimpio ? `58${numeroLimpio}` : '';
            const cedulaCompleta = formData.productor_cedula ? `${prefijoCedula}${formData.productor_cedula.trim()}` : '';
            const serviciosFormateados = Array.isArray(formData.servicios) ? formData.servicios : [];

            const infraestructuraSanitizada = {};
            const infraBase = formData.infraestructura || {};

            Object.keys(infraBase).forEach((key) => {
                const valor = infraBase[key];
                infraestructuraSanitizada[key] = valor !== "" && valor !== undefined ? parseInt(valor, 10) : 0;
                if (isNaN(infraestructuraSanitizada[key])) {
                    infraestructuraSanitizada[key] = 0;
                }
            });

            const sistemasReg = Array.isArray(formData.sistemas_registro) ? formData.sistemas_registro : [];

            const payload = {
                usuario: municipioEmpleado ? `Empleado (${municipioEmpleado})` : "Empleado (Barinas)",
                productor: {
                    cedula_rif: cedulaCompleta,
                    nombre: formData.productor_nombre?.trim(),
                    telefono: telefonoFormateado,
                    correo: correoProductor
                },
                nombre_predio: formData.nombre_predio?.trim(),
                municipio: municipioEmpleado || formData.municipio,
                parroquia: formData.parroquia,
                comunidad: formData.comunidad?.trim(),
                centro_poblado: formData.centro_poblado?.trim(),
                direccion: formData.direccion?.trim(),
                superficie: formData.superficie !== "" ? parseFloat(formData.superficie) : 0,
                coordenadas: formData.coordenadas?.trim() || null,
                tipo_propiedad: formData.tipo_propiedad,
                tenencia: formData.tenencia,
                vialidad: formData.vialidad,
                servicios: serviciosFormateados,
                infraestructura: infraestructuraSanitizada,
                produccion: {
                    tipo_explotacion: formData.tipo_explotacion,
                    registro_sanitario: sistemasReg.includes("Sanitario"),
                    registro_productivo: sistemasReg.includes("Productivo"),
                    registro_reproductivo: sistemasReg.includes("Reproductivo"),
                    registro_financiero: sistemasReg.includes("Financiero")
                }
            };

            const response = await fetch('http://127.0.0.1:8000/api/predios/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const predioCreado = await response.json();
                const idPredioCreado = predioCreado.id_predio || predioCreado.id;

                Swal.fire({
                    title: '¡Registro Exitoso!',
                    text: 'El predio ha sido registrado y la ficha técnica ha sido enviada al correo del productor.',
                    icon: 'success',
                    confirmButtonColor: '#136442'
                }).then((result) => {
                    if (result.isConfirmed) { window.location.reload(); }
                });

                // Generar y enviar el PDF adjunto al correo utilizando FormData
                if (idPredioCreado) {
                    try {
                        const pdfBlob = generarPDFPredioBlob(predioCreado);
                        
                        if (pdfBlob) {
                            const formDataPdf = new FormData();
                            formDataPdf.append('id_predio', idPredioCreado);
                            formDataPdf.append('correo', correoProductor);
                            formDataPdf.append('pdf_file', pdfBlob, `Ficha_Tecnica_${predioCreado.nombre_predio || 'Predio'}.pdf`);

                            fetch('http://127.0.0.1:8000/api/enviar-correo-ficha/', {
                                method: 'POST',
                                body: formDataPdf
                            }).catch(err => console.error("Error enviando correo con ficha adjunta:", err));
                        }
                    } catch (pdfErr) {
                        console.error("Error generando el PDF para el correo:", pdfErr);
                    }
                }

            } else {
                Swal.fire({ title: 'Error al guardar', text: 'Verifique los datos e intente nuevamente.', icon: 'error', confirmButtonColor: '#136442' });
            }
        } catch (error) {
            Swal.fire({ title: 'Error de conexión', text: error.message || 'No se pudo conectar con el servidor.', icon: 'error', confirmButtonColor: '#136442' });
        }
    };

    return {
        listaParroquias,
        manejarCambio,
        manejarInfra,
        manejarChecklist,
        guardarEnDjango,
        esFormularioValido
    };
}