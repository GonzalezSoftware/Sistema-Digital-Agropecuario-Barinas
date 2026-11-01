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

export const generarPDFReporteGeneralPredios = (municipioSeleccionado, mesSeleccionado, anioSeleccionado, listaPredios = []) => {

    const municipioBuscado = normalizarTexto(municipioSeleccionado);

    // Filtrar por municipio, mes y año de manera robusta
    const prediosMunicipio = listaPredios.filter(p => {
        // 1. Filtrar por municipio (si está vacío, acepta todos)
        const muniPredio = normalizarTexto(p.municipio);
        const cumpleMunicipio = !municipioSeleccionado ||
            muniPredio === municipioBuscado ||
            municipioBuscado.includes(muniPredio) ||
            muniPredio.includes(municipioBuscado);

        if (!cumpleMunicipio) return false;

        // 2. Filtrar por fecha (Mes y Año)
        if (p.fecha_creacion || p.fecha) {
            const fechaPredio = new Date(p.fecha_creacion || p.fecha);
            const anioPredio = fechaPredio.getFullYear().toString();
            const mesPredio = (fechaPredio.getMonth() + 1).toString();

            const cumpleAnio = !anioSeleccionado || anioPredio === anioSeleccionado;
            const cumpleMes = !mesSeleccionado || mesPredio === mesSeleccionado;

            return cumpleAnio && cumpleMes;
        }

        return true;
    });

    // 🛑 Alerta SweetAlert2 si no se consiguen registros en el período o municipio
    if (prediosMunicipio.length === 0) {
        Swal.fire({
            title: 'Sin registros',
            text: `No se encontraron predios registrados ${municipioSeleccionado ? `para el municipio "${municipioSeleccionado}"` : ''} ${mesSeleccionado ? `en el mes seleccionado` : ''} del año ${anioSeleccionado}.`,
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
    const tituloVerde = "LISTA DE PREDIOS: ";
    doc.text(tituloVerde, 12, 33);

    const anchoTituloVerde = doc.getTextWidth(tituloVerde);
    doc.setTextColor(0, 0, 0);
    const nombreNegro = (municipioSeleccionado || "GENERAL (TODOS)").toUpperCase();
    doc.text(nombreNegro, 12 + anchoTituloVerde, 33);

    let currentY = 42;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...verdeBarinas);
    doc.text(`CATASTRO OFICIAL - PERÍODO: ${mesSeleccionado ? `Mes ${mesSeleccionado} /` : ''} Año ${anioSeleccionado}`, 12, currentY);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const filasPredios = prediosMunicipio.map((p, index) => [
        index + 1,
        p.nombre_predio || "S/N",
        p.productor?.nombre || "N/A",
        p.parroquia || "N/A",
        p.superficie ? `${p.superficie} Ha` : "0 Ha",
        p.tipo_propiedad || p.tenencia || "N/A"
    ]);

    autoTable(doc, {
        startY: currentY + 4,
        head: [["N°", "Nombre del Predio", "Productor", "Parroquia", "Superficie", "Tenencia/Tipo"]],
        body: filasPredios,
        theme: "grid",
        headStyles: { fillColor: verdeBarinas, textColor: [255, 255, 250], fontStyle: "bold", fontSize: 8.5 },
        styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { width: 10, halign: "center" },
            1: { width: 50 },
            2: { width: 50 },
            3: { width: 38 },
            4: { width: 24, halign: "center" },
            5: { width: 20, halign: "center" }
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
        doc.text("Reporte institucional generado bajo los términos del Sistema Integral Agropecuario del Estado Barinas.", 12, 272);
        doc.text(`Página ${i} de ${totalPaginas}`, 204, 272, { align: "right" });
    }

    const nombreArchivo = `Catastro_Predios_${municipioSeleccionado ? municipioSeleccionado.replace(/\s+/g, "_") : 'General'}_${anioSeleccionado}.pdf`;
    doc.save(nombreArchivo);

    Swal.fire({
        title: '¡Reporte Exportado!',
        text: `El reporte de catastro se descargó correctamente.`,
        icon: 'success',
        confirmButtonColor: '#136442'
    });
};