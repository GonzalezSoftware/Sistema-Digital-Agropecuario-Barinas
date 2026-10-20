// src/pages/Produccion/ReportesGeneralesPrediosCaracterizados.js
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

export const generarPDFReportePrediosCaracterizados = (municipioSeleccionado, listaPredios = []) => {
    if (!municipioSeleccionado) {
        Swal.fire({
            title: 'Selección requerida',
            text: 'Por favor seleccione un municipio para generar el reporte de predios caracterizados.',
            icon: 'warning',
            confirmButtonColor: '#136442'
        });
        return;
    }

    const municipioBuscado = normalizarTexto(municipioSeleccionado);

    // Filtramos por municipio y evaluamos estrictamente que tengan la caracterización completada
    const prediosMunicipio = listaPredios.filter(p => {
        const muniPredio = normalizarTexto(p.municipio);
        const coincideMunicipio = (
            muniPredio === municipioBuscado ||
            municipioBuscado.includes(muniPredio) ||
            muniPredio.includes(municipioBuscado)
        );
        return coincideMunicipio && p.caracterizacion_completada === true;
    });

    if (prediosMunicipio.length === 0) {
        Swal.fire({
            title: 'Sin registros',
            text: `No se encontraron predios con caracterización completada para el municipio "${municipioSeleccionado}".`,
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

    // 1. Imprimir la etiqueta en color verde
    doc.setTextColor(...verdeBarinas);
    const tituloVerde = "LISTA DE PREDIOS CARACTERIZADOS: ";
    doc.text(tituloVerde, 12, 33);

    // 2. Calcular el ancho del texto verde para posicionar el nombre a continuación
    const anchoTituloVerde = doc.getTextWidth(tituloVerde);

    // 3. Imprimir el nombre del predio en color negro (o gris oscuro)
    doc.setTextColor(0, 0, 0); // O puedes usar tu constante grisOscuro
    const nombreNegro = (municipioSeleccionado || "SIN NOMBRE").toUpperCase();
    doc.text(nombreNegro, 12 + anchoTituloVerde, 33);


    let currentY = 42;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...verdeBarinas);
    doc.text("LISTA OFICIAL DE PREDIOS CON CARACTERIZACIÓN COMPLETADA", 12, currentY);

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

    const nombreArchivo = `Predios_Caracterizados_${municipioSeleccionado.replace(/\s+/g, "_")}.pdf`;
    doc.save(nombreArchivo);

    Swal.fire({
        title: '¡Reporte Exportado!',
        text: `El reporte de predios caracterizados para el municipio ${municipioSeleccionado} se descargó correctamente.`,
        icon: 'success',
        confirmButtonColor: '#136442'
    });
};