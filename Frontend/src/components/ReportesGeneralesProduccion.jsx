// src/pages/Produccion/ReportesGeneralesProduccion.js
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

export const generarPDFReporteProduccionGeneral = (municipioSeleccionado, listaPredios = []) => {
    if (!municipioSeleccionado) {
        Swal.fire({
            title: 'Selección requerida',
            text: 'Por favor seleccione un municipio para generar el reporte general de producción.',
            icon: 'warning',
            confirmButtonColor: '#136442'
        });
        return;
    }

    const municipioBuscado = normalizarTexto(municipioSeleccionado);

    // Filtramos predios del municipio con caracterización completada
    const prediosMunicipio = listaPredios.filter(p => {
        const muniPredio = normalizarTexto(p.municipio);
        const coincideMuni = (
            muniPredio === municipioBuscado ||
            municipioBuscado.includes(muniPredio) ||
            muniPredio.includes(municipioBuscado)
        );
        return coincideMuni && p.caracterizacion_completada === true;
    });

    if (prediosMunicipio.length === 0) {
        Swal.fire({
            title: 'Sin registros',
            text: `No se encontraron predios caracterizados para el municipio "${municipioSeleccionado}".`,
            icon: 'info',
            confirmButtonColor: '#136442'
        });
        return;
    }

    // ── PROCESAMIENTO Y CONSOLIDACIÓN DE DATOS DE PRODUCCIÓN ──
    const totalPrediosCaracterizados = prediosMunicipio.length;
    let totalSemovientesGeneral = 0;
    let totalHectareasSembradas = 0;

    // Diccionarios para acumular
    const semovientesEspecies = {}; // Ej: { Bovinos: { toro: 5, vaca: 12 }, ... }
    const sistemasProduccionConteo = {}; // Ej: { Lechería: 10, Ceba: 15 }
    const rubrosVegetalesConteo = {}; // Ej: { Maíz: { hectareas: 50, produccion: 12000 } }
    const destinosProduccionConteo = {}; // Ej: { Venta: 40, Consumo: 15 }

    prediosMunicipio.forEach(p => {
        const animalData = p.existencia_animal || {};
        
        // 1. Procesamiento de Semovientes por Especie y Subespecie
        Object.entries(animalData).forEach(([especieKey, detalleEspecie]) => {
            if (especieKey.startsWith("capacidad") || especieKey === "especiesSeleccionadas") return;
            if (detalleEspecie && typeof detalleEspecie === "object") {
                const nombreEspecie = especieKey.toUpperCase();
                if (!semovientesEspecies[nombreEspecie]) semovientesEspecies[nombreEspecie] = {};

                Object.entries(detalleEspecie).forEach(([subKey, subVal]) => {
                    if (subKey === "id") return;
                    const cantidad = Number(subVal) || 0;
                    if (cantidad > 0) {
                        const subNombreClean = subKey.replace(/_/g, " ").toUpperCase();
                        semovientesEspecies[nombreEspecie][subNombreClean] = (semovientesEspecies[nombreEspecie][subNombreClean] || 0) + cantidad;
                        totalSemovientesGeneral += cantidad;
                    }
                });
            }
        });

        // 2. Procesamiento de Sistemas de Producción
        ['capacidadBovina', 'capacidadBubalina', 'capacidadEquina', 'capacidadOvina', 'capacidadPorcina', 'capacidadCaprino', 'capacidadCunicola', 'capacidadAvicola', 'capacidadApicola'].forEach(capKey => {
            const capObj = animalData[capKey] || {};
            const sistemasArr = capObj.sistemas || [];
            sistemasArr.forEach(sistema => {
                if (sistema) {
                    const sisClean = sistema.toString().trim();
                    sistemasProduccionConteo[sisClean] = (sistemasProduccionConteo[sisClean] || 0) + 1;
                }
            });
        });

        // 3. Procesamiento de Rubros Vegetales y Destinos
        const rubrosArr = p.rubros_vegetales || p.produccion?.rubros_vegetales || [];
        rubrosArr.forEach(r => {
            const nombreRubro = r.rubro ? r.rubro.trim() : "No especificado";
            const ha = parseFloat(r.hectareas) || 0;
            const prodEst = parseFloat(r.produccion_estimada) || 0;
            const destino = r.destino ? r.destino.trim() : "No especificado";

            totalHectareasSembradas += ha;

            if (!rubrosVegetalesConteo[nombreRubro]) {
                rubrosVegetalesConteo[nombreRubro] = { hectareas: 0, produccion: 0 };
            }
            rubrosVegetalesConteo[nombreRubro].hectareas += ha;
            rubrosVegetalesConteo[nombreRubro].produccion += prodEst;

            destinosProduccionConteo[destino] = (destinosProduccionConteo[destino] || 0) + ha;
        });
    });

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
        console.warn("Logos institucionales omitidos en PDF.", error);
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
        const tituloVerde = "REPORTE GENERAL DE PRODUCCIÓN: ";
        doc.text(tituloVerde, 12, 33);

        // 2. Calcular el ancho del texto verde para posicionar el nombre a continuación
        const anchoTituloVerde = doc.getTextWidth(tituloVerde);

        // 3. Imprimir el nombre del predio en color negro (o gris oscuro)
        doc.setTextColor(0, 0, 0); // O puedes usar tu constante grisOscuro
        const nombreNegro = (municipioSeleccionado || "SIN NOMBRE").toUpperCase();
        doc.text(nombreNegro, 12 + anchoTituloVerde, 33);


    let currentY = 42;

    // --- I. INDICADORES MACRO DE PRODUCCIÓN ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...verdeBarinas);
    doc.text("I. RESUMEN MACRO DE PRODUCCIÓN MUNICIPAL", 12, currentY);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(12, currentY + 2, 204, currentY + 2);

    autoTable(doc, {
        startY: currentY + 4,
        body: [
            ["Predios Caracterizados:", `${totalPrediosCaracterizados} Predios`, "Total Semovientes Registrados:", `${totalSemovientesGeneral.toLocaleString()}`],
            ["Superficie Agrícola Sembrada:", `${totalHectareasSembradas.toFixed(2)} Hectáreas (Ha)`, "Municipio Evaluado:", municipioSeleccionado]
        ],
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { fontStyle: "bold", width: 45, textColor: grisOscuro, fillColor: [250, 250, 250] },
            1: { width: 57, halign: "center" },
            2: { fontStyle: "bold", width: 52, textColor: grisOscuro, fillColor: [250, 250, 250] },
            3: { width: 40, halign: "center" }
        },
        margin: { left: 12, right: 12 }
    });

    // --- II. INVENTARIO DE SEMOVIENTES POR ESPECIE Y SUBESPECIE ---
    currentY = doc.lastAutoTable.finalY + 7;
    if (currentY > 215) { doc.addPage(); currentY = 20; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...verdeBarinas);
    doc.text("II. INVENTARIO UNITARIO DE SEMOVIENTES (ESPECIES Y SUBESPECIES)", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    let filasSemovientes = [];
    Object.entries(semovientesEspecies).forEach(([esp, subObj]) => {
        filasSemovientes.push([{ content: `ESPECIE: ${esp}`, colSpan: 2, styles: { fontStyle: "bold", fillColor: [230, 240, 235], textColor: verdeBarinas } }]);
        Object.entries(subObj).forEach(([subName, subVal]) => {
            filasSemovientes.push([subName, `${subVal.toLocaleString()} Unidades`]);
        });
    });

    if (filasSemovientes.length === 0) {
        filasSemovientes = [["Sin inventario animal registrado en los predios caracterizados.", ""]];
    }

    autoTable(doc, {
        startY: currentY + 4,
        head: [["Categoría / Subespecie Pecuaria", "Cantidad Total Unitaria"]],
        body: filasSemovientes,
        theme: "grid",
        headStyles: { fillColor: verdeBarinas, textColor: [255, 255, 250], fontStyle: "bold", fontSize: 8.5 },
        styles: { fontSize: 8, cellPadding: 2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: { 0: { width: 135 }, 1: { width: 57, halign: "center" } },
        margin: { left: 12, right: 12 }
    });

    // --- III. PRODUCCIÓN VEGETAL Y RUBROS SEMBRADOS ---
    currentY = doc.lastAutoTable.finalY + 7;
    if (currentY > 215) { doc.addPage(); currentY = 20; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...verdeBarinas);
    doc.text("III. PRODUCCIÓN VEGETAL Y RUBROS AGRÍCOLAS", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    const filasRubros = Object.keys(rubrosVegetalesConteo).length > 0
        ? Object.entries(rubrosVegetalesConteo).map(([rubro, info], idx) => [
            idx + 1,
            rubro,
            `${info.hectareas.toFixed(2)} Ha`,
            `${info.produccion.toLocaleString()} Kg`
          ])
        : [["-", "No se han registrado rubros vegetales.", "-", "-"]];

    autoTable(doc, {
        startY: currentY + 4,
        head: [["N°", "Rubro Agrícola", "Superficie Sembrada", "Producción Estimada"]],
        body: filasRubros,
        theme: "grid",
        headStyles: { fillColor: verdeBarinas, textColor: [255, 255, 250], fontStyle: "bold", fontSize: 8.5 },
        styles: { fontSize: 8, cellPadding: 2.5, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { width: 12, halign: "center" },
            1: { width: 90 },
            2: { width: 48, halign: "center" },
            3: { width: 42, halign: "center" }
        },
        margin: { left: 12, right: 12 }
    });

    // --- IV. SISTEMAS DE PRODUCCIÓN Y DESTINOS ---
    currentY = doc.lastAutoTable.finalY + 7;
    if (currentY > 215) { doc.addPage(); currentY = 20; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...verdeBarinas);
    doc.text("IV. SISTEMAS DE PRODUCCIÓN Y DESTINOS COMERCIALES", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    let filasSistemasDestinos = [];
    filasSistemasDestinos.push([{ content: "SISTEMAS PRODUCTIVOS ACTIVOS", colSpan: 2, styles: { fontStyle: "bold", fillColor: [230, 240, 235], textColor: verdeBarinas } }]);
    
    Object.entries(sistemasProduccionConteo).forEach(([sis, cant]) => {
        filasSistemasDestinos.push([sis, `${cant} Predio(s) que lo implementan`]);
    });

    filasSistemasDestinos.push([{ content: "DESTINOS DE LA PRODUCCIÓN VEGETAL", colSpan: 2, styles: { fontStyle: "bold", fillColor: [230, 240, 235], textColor: verdeBarinas } }]);
    
    Object.entries(destinosProduccionConteo).forEach(([dest, cantHa]) => {
        filasSistemasDestinos.push([dest, `${cantHa.toFixed(2)} Ha asociadas`]);
    });

    autoTable(doc, {
        startY: currentY + 4,
        head: [["Componente / Parámetro Productivo", "Frecuencia / Magnitud"]],
        body: filasSistemasDestinos,
        theme: "grid",
        headStyles: { fillColor: verdeBarinas, textColor: [255, 250, 250], fontStyle: "bold", fontSize: 8.5 },
        styles: { fontSize: 8, cellPadding: 2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: { 0: { width: 125 }, 1: { width: 67, halign: "center" } },
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
        doc.text("Reporte general de producción agrícola y pecuaria — Sistema Integral Agropecuario del Estado Barinas.", 12, 272);
        doc.text(`Página ${i} de ${totalPaginas}`, 204, 272, { align: "right" });
    }

    const nombreArchivo = `Reporte_Produccion_General_${municipioSeleccionado.replace(/\s+/g, "_")}.pdf`;
    doc.save(nombreArchivo);

    Swal.fire({
        title: '¡Reporte de Producción Exportado!',
        text: `El reporte general de producción para ${municipioSeleccionado} se descargó correctamente.`,
        icon: 'success',
        confirmButtonColor: '#136442'
    });
};