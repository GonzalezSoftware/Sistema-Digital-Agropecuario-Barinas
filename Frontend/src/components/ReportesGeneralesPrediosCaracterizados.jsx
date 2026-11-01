// src/pages/Produccion/ReportesGeneralesPrediosCaracterizados.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import logoGobierno from "../assets/gobierno.jpg";
import logoEscudo from "../assets/logo.png";

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

export const generarPDFReportePrediosCaracterizados = (municipioSeleccionado, mesSeleccionado, anioSeleccionado, listaPredios = []) => {

    const municipioBuscado = normalizarTexto(municipioSeleccionado);

    // Filtrado estricto por Municipio, Caracterización completada, Mes y Año (`fecha_registro`)
    const prediosMunicipio = listaPredios.filter(p => {
        // 1. Filtrar por municipio (si está vacío, acepta todos)
        const muniPredio = normalizarTexto(p.municipio);
        const coincideMunicipio = !municipioSeleccionado || (
            muniPredio === municipioBuscado ||
            municipioBuscado.includes(muniPredio) ||
            muniPredio.includes(municipioBuscado)
        );

        if (!coincideMunicipio) return false;

        // 2. Evaluar estrictamente que la caracterización esté completada
        if (p.caracterizacion_completada !== true) return false;

        // 3. Extraer el campo de fecha de Django (fecha_registro)
        const rawFecha = p.fecha_registro || p.fecha_creacion || p.fecha;
        if (!rawFecha) return false;

        const fechaPredio = new Date(rawFecha);
        if (isNaN(fechaPredio.getTime())) return false;

        const anioPredio = fechaPredio.getFullYear().toString();
        const mesPredio = (fechaPredio.getMonth() + 1).toString();

        // 4. Validación estricta de Año y Mes
        const cumpleAnio = !anioSeleccionado || anioPredio === anioSeleccionado.toString().trim();
        const cumpleMes = !mesSeleccionado || mesPredio === mesSeleccionado.toString().trim();

        return cumpleAnio && cumpleMes;
    });

    // 🛑 Alerta SweetAlert2 estricta si no se consiguen registros
    if (prediosMunicipio.length === 0) {
        Swal.fire({
            title: 'Sin registros',
            text: `No se encontraron predios caracterizados ${municipioSeleccionado ? `para el municipio "${municipioSeleccionado}"` : 'en general'} para ${mesSeleccionado ? `el mes seleccionado` : 'todos los meses'} del año ${anioSeleccionado || 'especificado'}.`,
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
        doc.addImage(logoGobierno, "JPEG", 12, 5, 42, 16);
        doc.addImage(logoEscudo, "PNG", 57, 8, 28, 10);
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

    const fechaEmision = new Date().toLocaleDateString();
    doc.text(`Fecha de Emisión: ${fechaEmision}`, 204, 18, { align: "right" });

    doc.setDrawColor(...verdeBarinas);
    doc.setLineWidth(0.6);
    doc.line(12, 25, 204, 25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.setTextColor(...verdeBarinas);
    const tituloVerde = "LISTA DE PREDIOS CARACTERIZADOS: ";
    doc.text(tituloVerde, 12, 33);

    const anchoTituloVerde = doc.getTextWidth(tituloVerde);
    doc.setTextColor(0, 0, 0);
    const nombreNegro = (municipioSeleccionado || "GENERAL (TODOS)").toUpperCase();
    doc.text(nombreNegro, 12 + anchoTituloVerde, 33);

    let currentY = 42;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...verdeBarinas);
    doc.text(`PERÍODO: ${mesSeleccionado ? `Mes ${mesSeleccionado} /` : 'Todos los meses'} Año ${anioSeleccionado}`, 12, currentY);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const filasPredios = prediosMunicipio.map((p, index) => [
        index + 1,
        p.nombre_predio || "S/N",
        p.productor?.nombre || "N/A",
        p.parroquia || "N/A",
        p.superficie ? `${p.superficie} Ha` : "0 Ha",
        p.produccion?.tipo_explotacion || "Caracterizado"
    ]);

    autoTable(doc, {
        startY: currentY + 4,
        head: [["N°", "Nombre del Predio", "Productor", "Parroquia", "Superficie", "Explotación / Estado"]],
        body: filasPredios,
        theme: "grid",
        headStyles: { fillColor: verdeBarinas, textColor: [255, 255, 250], fontStyle: "bold", fontSize: 8.5 },
        styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { width: 10, halign: "center" },
            1: { width: 48 },
            2: { width: 48 },
            3: { width: 38 },
            4: { width: 24, halign: "center" },
            5: { width: 24, halign: "center" }
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
        doc.text("Reporte institucional de predios caracterizados bajo los términos del Sistema Integral Agropecuario.", 12, 272);
        doc.text(`Página ${i} de ${totalPaginas}`, 204, 272, { align: "right" });
    }

    const nombreArchivo = `Predios_Caracterizados_${municipioSeleccionado ? municipioSeleccionado.replace(/\s+/g, "_") : 'General'}_${anioSeleccionado}.pdf`;
    doc.save(nombreArchivo);

    Swal.fire({
        title: '¡Reporte Exportado!',
        text: `El reporte de predios caracterizados se descargó correctamente.`,
        icon: 'success',
        confirmButtonColor: '#136442'
    });
};