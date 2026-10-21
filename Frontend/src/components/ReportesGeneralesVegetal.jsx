import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

export const generarPDFReporteVegetal = (municipioFiltro, rubroFiltro, listaPredios) => {
    if (!rubroFiltro) {
        Swal.fire({ icon: "warning", title: "Rubro requerido", text: "Debe seleccionar un rubro vegetal para generar este reporte.", confirmButtonColor: "#136442" });
        return;
    }

    let prediosFiltrados = listaPredios.filter(p => {
        const cumpleMun = municipioFiltro ? p.municipio?.toLowerCase() === municipioFiltro.toLowerCase() : true;
        const rubros = p.rubros_vegetales || [];
        const tieneRubro = rubros.some(r => r.rubro?.toLowerCase() === rubroFiltro.toLowerCase());
        return cumpleMun && tieneRubro;
    });

    let datosProcesados = prediosFiltrados.map(p => {
        const rubros = p.rubros_vegetales || [];
        let totalHectareasRubro = 0;
        let totalProdEstimada = 0;
        let detalleRubrosList = [];

        rubros.forEach(r => {
            if (r.rubro?.toLowerCase() === rubroFiltro.toLowerCase()) {
                const ha = Number(r.hectareas || 0);
                const prod = Number(r.produccion_estimada || 0);
                totalHectareasRubro += ha;
                totalProdEstimada += prod;
                detalleRubrosList.push({
                    estado: r.estado || "N/A",
                    riego: r.riego || "N/A",
                    ciclo: r.ciclo_productivo || "N/A",
                    hectareas: ha,
                    produccion: prod
                });
            }
        });

        return { predio: p, totalHectareasRubro, totalProdEstimada, detalleRubrosList };
    });

    // Ordenar de mayor a menor según las hectáreas del rubro
    datosProcesados.sort((a, b) => b.totalHectareasRubro - a.totalHectareasRubro);

    if (datosProcesados.length === 0) {
        Swal.fire({ icon: "info", title: "Sin registros", text: "No se encontraron predios con el rubro vegetal seleccionado.", confirmButtonColor: "#136442" });
        return;
    }

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const verdeBarinas = [19, 100, 66];
    const verdeClaro = [230, 240, 235];
    const grisOscuro = [40, 40, 40];

    // ── CINTILLO INSTITUCIONAL UNIFICADO ──
    try {
        doc.addImage("/src/assets/gobierno.jpg", "JPEG", 12, 5, 42, 16);
        doc.addImage("/src/assets/logo.png", "PNG", 57, 8, 28, 10);
    } catch (error) {
        console.warn("Logos institucionales omitidos.");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...verdeBarinas);
    doc.text("MINISTERIO DEL PODER POPULAR PARA LA AGRICULTURA Y TIERRAS", 204, 10, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("MPPAT — DIRECCIÓN ESTADAL DE REGISTROS AGROPECUARIOS", 204, 14, { align: "right" });
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 204, 18, { align: "right" });

    doc.setDrawColor(...verdeBarinas);
    doc.setLineWidth(0.6);
    doc.line(12, 25, 204, 25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...verdeBarinas);
    doc.text(`REPORTE GENERAL VEGETAL: (${rubroFiltro.toUpperCase()})`, 12, 33);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    doc.text(`Municipio: ${municipioFiltro || "Todos los municipios"}`, 12, 38);

    // ── CONSTRUCCIÓN DE LA TABLA ──
    let bodyTabla = [];

    datosProcesados.forEach((item, index) => {
        const p = item.predio;
        const prod = p.productor || {};
        
        // Fila principal verde claro organizada en celdas
        bodyTabla.push([
            {
                content: `#${index + 1}`,
                styles: { fontStyle: "bold", fillColor: verdeClaro, textColor: verdeBarinas, fontSize: 7.5, halign: "center", font: "helvetica" }
            },
            {
                content: (p.nombre_predio || "S/N").toUpperCase(),
                styles: { fontStyle: "bold", fillColor: verdeClaro, textColor: verdeBarinas, fontSize: 7.5, font: "helvetica" }
            },
            {
                content: `${item.totalHectareasRubro} Ha`,
                styles: { fontStyle: "bold", fillColor: verdeClaro, textColor: verdeBarinas, fontSize: 7.5, halign: "center", font: "helvetica" }
            },
            {
                content: prod.nombre || "N/A",
                styles: { fontStyle: "bold", fillColor: verdeClaro, textColor: verdeBarinas, fontSize: 7.5, font: "helvetica" }
            },
            {
                content: `C.I/RIF: ${prod.cedula_rif || "N/A"}\nTelf: ${prod.telefono || "N/A"}`,
                styles: { fillColor: verdeClaro, textColor: verdeBarinas, fontSize: 7, font: "helvetica" }
            },
            {
                content: `${item.totalProdEstimada} Kg`,
                styles: { fontStyle: "bold", fillColor: verdeClaro, textColor: verdeBarinas, fontSize: 8, halign: "center", font: "helvetica" }
            }
        ]);

        // Filas internas blancas con el desglose de los cultivos de ese rubro
        if (item.detalleRubrosList.length > 0) {
            item.detalleRubrosList.forEach(det => {
                bodyTabla.push([
                    { content: "", styles: { fillColor: [255, 255, 255] } },
                    { 
                        content: `   Estado: ${det.estado} | Riego: ${det.riego} | Ciclo: ${det.ciclo}`, 
                        colSpan: 4, 
                        styles: { fontStyle: "normal", textColor: grisOscuro, fontSize: 7.5, fillColor: [255, 255, 255], font: "helvetica" } 
                    },
                    { 
                        content: `${det.produccion} Kg`, 
                        styles: { fontStyle: "bold", textColor: grisOscuro, fontSize: 7.5, halign: "center", fillColor: [255, 255, 255], font: "helvetica" } 
                    }
                ]);
            });
        }
    });

    autoTable(doc, {
        startY: 42,
        head: [["#", "Predio", "Hectáreas Rubro", "Productor", "Contacto", "Prod. Estimada"]],
        body: bodyTabla,
        theme: "grid",
        headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold", textColor: [255, 255, 255], font: "helvetica" },
        styles: { fontSize: 7.5, cellPadding: 2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { width: 10, halign: "center" },
            1: { width: 35 },
            2: { width: 22, halign: "center" },
            3: { width: 32 },
            4: { width: 38 },
            5: { width: 35, halign: "center" }
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
        doc.text("Reporte General de Producción Vegetal.", 12, 272);
        doc.text(`Página ${i} de ${totalPaginas}`, 204, 272, { align: "right" });
    }

    doc.save(`Reporte_Vegetal_${rubroFiltro}_${municipioFiltro || "General"}.pdf`);
};