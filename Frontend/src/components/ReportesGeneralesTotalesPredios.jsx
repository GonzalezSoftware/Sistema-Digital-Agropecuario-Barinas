import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

const normalizarTexto = (str) => {
    if (!str) return "";
    return str
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[_]/g, " ")
        .trim();
};

export const generarPDFReporteTotalesPredios = (municipioSeleccionado, listaPredios = []) => {

    const municipioBuscado = normalizarTexto(municipioSeleccionado);

    const prediosMunicipio = listaPredios.filter(p => {
        const muniPredio = normalizarTexto(p.municipio);
        return (
            muniPredio === municipioBuscado ||
            municipioBuscado.includes(muniPredio) ||
            muniPredio.includes(municipioBuscado)
        );
    });

    if (prediosMunicipio.length === 0) {
        Swal.fire({
            title: 'Sin registros',
            text: `No se encontraron predios registrados para el municipio "${municipioSeleccionado}".`,
            icon: 'info',
            confirmButtonColor: '#136442'
        });
        return;
    }

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter"
    });

    const verdeBarinas = [19, 100, 66];
    const grisOscuro = [40, 40, 40];

    // Cintillo institucional superior
    try {
        doc.addImage("/src/assets/gobierno.jpg", "JPEG", 12, 5, 42, 16);
        doc.addImage("/src/assets/logo.png", "PNG", 57, 8, 28, 10);
    } catch (error) {
        console.warn("No se pudieron cargar las imágenes de los logos en el PDF.", error);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...verdeBarinas);
    doc.text("MINISTERIO DEL PODER POPULAR PARA LA AGRICULTURA Y TIERRAS", 204, 10, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("MPPAT — DIRECCIÓN ESTADAL DE REGISTROS AGROPECUARIOS", 204, 14, { align: "right" });

    const fechaEmision = new Date().toLocaleDateString();
    doc.text(`Fecha de Emisión: ${fechaEmision}`, 204, 18, { align: "right" });

    doc.setDrawColor(...verdeBarinas);
    doc.setLineWidth(0.6);
    doc.line(12, 25, 204, 25);




    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    // 1. Imprimir la etiqueta en color verde
    doc.setTextColor(...verdeBarinas);
    const tituloVerde = "REPORTE DE TOTALES Y ESTADÍSTICAS: ";
    doc.text(tituloVerde, 12, 33);

    // 2. Calcular el ancho del texto verde para posicionar el nombre a continuación
    const anchoTituloVerde = doc.getTextWidth(tituloVerde);

    // 3. Imprimir el nombre del predio en color negro (o gris oscuro)
    doc.setTextColor(0, 0, 0); // O puedes usar tu constante grisOscuro
    const nombreNegro = (municipioSeleccionado || "SIN NOMBRE").toUpperCase();
    doc.text(nombreNegro, 12 + anchoTituloVerde, 33);


    let currentY = 42;

    // --- I. Resumen General ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...verdeBarinas);
    doc.text("I. INDICADORES GENERALES MUNICIPALES", 12, currentY);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const totalPredios = prediosMunicipio.length;
    const superficieTotal = prediosMunicipio.reduce((acc, p) => acc + (parseFloat(p.superficie) || 0), 0);

    const datosGenerales = [
        ["Total de Predios Censados:", `${totalPredios} Predios`, "Superficie Territorial Total:", `${superficieTotal.toFixed(2)} Ha`]
    ];

    autoTable(doc, {
        startY: currentY + 4,
        body: datosGenerales,
        theme: "grid",
        styles: { fontSize: 8.5, cellPadding: 3, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { fontStyle: "bold", width: 45, textColor: grisOscuro, fillColor: [250, 250, 250] },
            1: { width: 57, halign: "center" },
            2: { fontStyle: "bold", width: 52, textColor: grisOscuro, fillColor: [250, 250, 250] },
            3: { width: 40, halign: "center" }
        },
        margin: { left: 12, right: 12 }
    });

    // --- II. Predios por Parroquias ---
    currentY = doc.lastAutoTable.finalY + 7;
    if (currentY > 215) { doc.addPage(); currentY = 20; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...verdeBarinas);
    doc.text("II. DISTRIBUCIÓN DE PREDIOS POR PARROQUIAS", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const parroquiasConteo = {};
    prediosMunicipio.forEach(p => {
        const par = p.parroquia || "No especificada";
        parroquiasConteo[par] = (parroquiasConteo[par] || 0) + 1;
    });

    const filasParroquias = Object.keys(parroquiasConteo).map((par, index) => [
        index + 1,
        par,
        `${parroquiasConteo[par]} Predios`,
        `${((parroquiasConteo[par] / totalPredios) * 100).toFixed(1)}%`
    ]);

    autoTable(doc, {
        startY: currentY + 4,
        head: [["N°", "Parroquia", "Cantidad de Predios", "Porcentaje del Total"]],
        body: filasParroquias,
        theme: "grid",
        headStyles: { fillColor: verdeBarinas, textColor: [255, 255, 250], fontStyle: "bold", fontSize: 8.5 },
        styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { width: 12, halign: "center" },
            1: { width: 90 },
            2: { width: 48, halign: "center" },
            3: { width: 44, halign: "center" }
        },
        margin: { left: 12, right: 12 }
    });

    // --- III. Estatus Legal de la Tierra (Tenencia) ---
    currentY = doc.lastAutoTable.finalY + 7;
    if (currentY > 215) { doc.addPage(); currentY = 20; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...verdeBarinas);
    doc.text("III. ESTATUS LEGAL Y TENENCIA DE LA TIERRA", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const tenenciaConteo = {};
    const superficieTenencia = {};
    prediosMunicipio.forEach(p => {
        const ten = p.tenencia || "No especificada";
        tenenciaConteo[ten] = (tenenciaConteo[ten] || 0) + 1;
        superficieTenencia[ten] = (superficieTenencia[ten] || 0) + (parseFloat(p.superficie) || 0);
    });

    const filasTenencia = Object.keys(tenenciaConteo).map((ten, index) => [
        index + 1,
        ten,
        `${tenenciaConteo[ten]} Predios`,
        `${superficieTenencia[ten].toFixed(2)} Ha`
    ]);

    autoTable(doc, {
        startY: currentY + 4,
        head: [["N°", "Régimen / Tenencia", "Total Predios", "Superficie Acumulada"]],
        body: filasTenencia,
        theme: "grid",
        headStyles: { fillColor: verdeBarinas, textColor: [255, 255, 250], fontStyle: "bold", fontSize: 8.5 },
        styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { width: 12, halign: "center" },
            1: { width: 90 },
            2: { width: 48, halign: "center" },
            3: { width: 44, halign: "center" }
        },
        margin: { left: 12, right: 12 }
    });

    // --- IV. Estado de la Vialidad ---
    currentY = doc.lastAutoTable.finalY + 7;
    if (currentY > 215) { doc.addPage(); currentY = 20; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...verdeBarinas);
    doc.text("IV. ESTADO DE LA VIALIDAD INTERNA Y DE ACCESO", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const vialidadConteo = {};
    prediosMunicipio.forEach(p => {
        const vial = p.vialidad || "No especificada";
        vialidadConteo[vial] = (vialidadConteo[vial] || 0) + 1;
    });

    const filasVialidad = Object.keys(vialidadConteo).map((vial, index) => [
        index + 1,
        vial,
        `${vialidadConteo[vial]} Predios`,
        `${((vialidadConteo[vial] / totalPredios) * 100).toFixed(1)}%`
    ]);

    autoTable(doc, {
        startY: currentY + 4,
        head: [["N°", "Condición de Vialidad", "Cantidad de Predios", "Porcentaje del Total"]],
        body: filasVialidad,
        theme: "grid",
        headStyles: { fillColor: verdeBarinas, textColor: [255, 255, 250], fontStyle: "bold", fontSize: 8.5 },
        styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { width: 12, halign: "center" },
            1: { width: 90 },
            2: { width: 48, halign: "center" },
            3: { width: 44, halign: "center" }
        },
        margin: { left: 12, right: 12 }
    });

    // --- V. Cobertura de Servicios Básicos ---
    currentY = doc.lastAutoTable.finalY + 7;
    if (currentY > 215) { doc.addPage(); currentY = 20; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...verdeBarinas);
    doc.text("V. COBERTURA DE SERVICIOS BÁSICOS INSTALADOS", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const serviciosConteo = {};
    prediosMunicipio.forEach(p => {
        // Soporta tanto arreglos de servicios_lectura como de servicios
        const serviciosPredio = p.servicios_lectura || p.servicios || [];
        serviciosPredio.forEach(s => {
            if (s) {
                const servNombre = s.toString().charAt(0).toUpperCase() + s.toString().slice(1).toLowerCase();
                serviciosConteo[servNombre] = (serviciosConteo[servNombre] || 0) + 1;
            }
        });
    });

    const filasServicios = Object.keys(serviciosConteo).length > 0
        ? Object.keys(serviciosConteo).map((serv, index) => [
            index + 1,
            serv,
            `${serviciosConteo[serv]} Predios`,
            `${((serviciosConteo[serv] / totalPredios) * 100).toFixed(1)}%`
        ])
        : [["-", "No se han declarado servicios básicos en este municipio.", "-", "-"]];

    autoTable(doc, {
        startY: currentY + 4,
        head: [["N°", "Servicio Básico", "Predios con Cobertura", "Porcentaje del Total"]],
        body: filasServicios,
        theme: "grid",
        headStyles: { fillColor: verdeBarinas, textColor: [255, 255, 250], fontStyle: "bold", fontSize: 8.5 },
        styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { width: 12, halign: "center" },
            1: { width: 90 },
            2: { width: 48, halign: "center" },
            3: { width: 44, halign: "center" }
        },
        margin: { left: 12, right: 12 }
    });

    // Pie de página dinámico institucional
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(140, 140, 140);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(12, 268, 204, 268);
        doc.text("Reporte estadístico consolidado bajo los términos del Sistema Integral Agropecuario del Estado Barinas.", 12, 272);
        doc.text(`Página ${i} de ${totalPaginas}`, 204, 272, { align: "right" });
    }

    const nombreArchivo = `Reporte_Totales_Predios_${municipioSeleccionado.replace(/\s+/g, "_")}.pdf`;
    doc.save(nombreArchivo);

    Swal.fire({
        title: '¡Reporte de Totales Exportado!',
        text: `El resumen estadístico detallado para ${municipioSeleccionado} se descargó correctamente.`,
        icon: 'success',
        confirmButtonColor: '#136442'
    });
};