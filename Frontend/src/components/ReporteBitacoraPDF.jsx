import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

export const generarPDFBitacora = (moduloFiltro, fechaInicio, fechaFin, listaRegistros = []) => {
    // Filtrar los registros por módulo y por rango de fechas (corrigiendo la hora final)
    const registrosFiltrados = listaRegistros.filter(item => {
        // Filtro por módulo
        if (moduloFiltro && moduloFiltro !== "TODOS") {
            const normalizar = (texto) => 
                (texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
            if (normalizar(item.modulo) !== normalizar(moduloFiltro)) return false;
        }

        // Filtro por fecha usando comparación de fechas locales estrictas
        if (fechaInicio || fechaFin) {
            const dItem = new Date(item.fecha_hora);
            const anioI = dItem.getFullYear();
            const mesI = String(dItem.getMonth() + 1).padStart(2, '0');
            const diaI = String(dItem.getDate()).padStart(2, '0');
            const fechaItemStr = `${anioI}-${mesI}-${diaI}`;

            if (fechaInicio && fechaItemStr < fechaInicio) return false;
            if (fechaFin && fechaItemStr > fechaFin) return false;
        }

        return true;
    });

    if (registrosFiltrados.length === 0) {
        Swal.fire({
            title: 'Sin registros',
            text: 'No hay movimientos en la bitácora que coincidan con los filtros y el rango de fechas seleccionados.',
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

    // Título del reporte
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...verdeBarinas);
    doc.text("REPORTE DE AUDITORÍA Y MOVIMIENTOS DE BITÁCORA", 12, 33);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...grisOscuro);
    
    const textoFiltroFechas = fechaInicio && fechaFin 
        ? `Desde: ${fechaInicio.split('-').reverse().join('/')} hasta ${fechaFin.split('-').reverse().join('/')}` 
        : fechaInicio ? `Desde: ${fechaInicio.split('-').reverse().join('/')}` : fechaFin ? `Hasta: ${fechaFin.split('-').reverse().join('/')}` : "Histórico completo";

    doc.text(`Módulo: ${moduloFiltro === "TODOS" ? "Todos" : moduloFiltro} | Rango: ${textoFiltroFechas}`, 12, 39);

    let currentY = 44;

    const filasBitacora = registrosFiltrados.map((item, index) => [
        index + 1,
        new Date(item.fecha_hora).toLocaleString(),
        item.usuario || "N/A",
        item.accion || "N/A",
        item.modulo || "N/A",
        item.descripcion || "Sin descripción"
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [["N°", "Fecha / Hora", "Usuario", "Acción", "Módulo", "Descripción del Movimiento"]],
        body: filasBitacora,
        theme: "grid",
        headStyles: { fillColor: verdeBarinas, textColor: [255, 255, 250], fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 7.5, cellPadding: 2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { width: 10, halign: "center" },
            1: { width: 32 },
            2: { width: 30 },
            3: { width: 20, halign: "center" },
            4: { width: 24 },
            5: { width: 76 }
        },
        margin: { left: 12, right: 12 }
    });

    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(140, 140, 140);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(12, 268, 204, 268);
        doc.text("Reporte de auditoría oficial generado bajo los términos del Sistema Integral Agropecuario del Estado Barinas.", 12, 272);
        doc.text(`Página ${i} de ${totalPaginas}`, 204, 272, { align: "right" });
    }

    const nombreArchivo = `Reporte_Bitacora_${moduloFiltro.replace(/\s+/g, "_")}.pdf`;
    doc.save(nombreArchivo);

    Swal.fire({
        title: '¡Reporte Exportado!',
        text: 'El reporte de bitácora con los filtros seleccionados se descargó con éxito.',
        icon: 'success',
        confirmButtonColor: '#136442'
    });
};