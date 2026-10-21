import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

export const generarPDFReporteAnimal = (municipioFiltro, especieFiltro, listaPredios) => {
    if (!especieFiltro) {
        Swal.fire({ icon: "warning", title: "Especie requerida", text: "Debe seleccionar una especie animal para generar este reporte.", confirmButtonColor: "#136442" });
        return;
    }

    // Función auxiliar para resolver la discrepancia entre singular y plural
    const obtenerSubObjetoAnimal = (existenciaAnimal, especie) => {
        if (!existenciaAnimal) return {};
        const claveMinuscula = especie.toLowerCase();
        
        if (existenciaAnimal[claveMinuscula + "s"]) return existenciaAnimal[claveMinuscula + "s"];
        if (existenciaAnimal[claveMinuscula]) return existenciaAnimal[claveMinuscula];
        
        for (const key of Object.keys(existenciaAnimal)) {
            if (key.toLowerCase().includes(claveMinuscula)) {
                return existenciaAnimal[key];
            }
        }
        return {};
    };

    let prediosFiltrados = listaPredios.filter(p => {
        const cumpleMun = municipioFiltro ? p.municipio?.toLowerCase() === municipioFiltro.toLowerCase() : true;
        const animalesPredio = p.existencia_animal || {};
        
        const especiesSel = animalesPredio.especiesSeleccionadas || [];
        const estaSeleccionada = especiesSel.includes(especieFiltro);
        
        const subObj = obtenerSubObjetoAnimal(animalesPredio, especieFiltro);
        const tieneValores = subObj && typeof subObj === "object" && Object.values(subObj).some(val => Number(val) > 0);

        return cumpleMun && (estaSeleccionada || tieneValores);
    });

    let datosProcesados = prediosFiltrados.map(p => {
        const animalData = p.existencia_animal || {};
        let subObjeto = obtenerSubObjetoAnimal(animalData, especieFiltro);
        
        let totalCabezas = 0;
        let subespeciesMatriz = [];

        if (typeof subObjeto === "object" && subObjeto !== null) {
            Object.entries(subObjeto).forEach(([subKey, subVal]) => {
                if (subKey === "id") return;
                const num = Number(subVal);
                if (!isNaN(num) && num > 0) {
                    totalCabezas += num;
                    const nombreFormateado = subKey.replace(/_/g, " ").toUpperCase();
                    subespeciesMatriz.push({ categoria: nombreFormateado, cantidad: num });
                }
            });
        } else if (typeof subObjeto === "number") {
            totalCabezas = subObjeto;
        }

        return { predio: p, totalCabezas, subespeciesMatriz };
    });

    // Ordenar predios de mayor a menor según la cantidad total
    datosProcesados.sort((a, b) => b.totalCabezas - a.totalCabezas);

    if (datosProcesados.length === 0) {
        Swal.fire({ icon: "info", title: "Sin registros", text: "No se encontraron predios con la especie e información seleccionada.", confirmButtonColor: "#136442" });
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

    // Título del reporte
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...verdeBarinas);
    doc.text(`REPORTE GENERAL PECUARIO: (${especieFiltro.toUpperCase()})`, 12, 33);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    doc.text(`Municipio: ${municipioFiltro || "Todos los municipios"}`, 12, 38);

    // ── CONSTRUCCIÓN DE LA TABLA CON CELDAS ORGANIZADAS ──
    let bodyTabla = [];

    datosProcesados.forEach((item, index) => {
        const p = item.predio;
        const prod = p.productor || {};
        
        // 1. FILA PRINCIPAL (VERDE CLARO): Número de orden individual + Predio + Superficie + Productor + Contacto + Total General
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
                content: `${p.superficie || 0} Ha`,
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
                content: `TOTAL: ${item.totalCabezas}`,
                styles: { fontStyle: "bold", fillColor: verdeClaro, textColor: verdeBarinas, fontSize: 8, halign: "center", font: "helvetica" }
            }
        ]);

        // 2. FILAS INTERNAS (BLANCAS): Desglose limpio de subespecies sin símbolos extraños
        if (item.subespeciesMatriz.length > 0) {
            item.subespeciesMatriz.forEach(sub => {
                bodyTabla.push([
                    { content: "", styles: { fillColor: [255, 255, 255] } },
                    { 
                        content: `   ${sub.categoria}`, 
                        colSpan: 4, 
                        styles: { fontStyle: "normal", textColor: grisOscuro, fontSize: 7.5, fillColor: [255, 255, 255], font: "helvetica" } 
                    },
                    { 
                        content: `${sub.cantidad} Unidades`, 
                        styles: { fontStyle: "bold", textColor: grisOscuro, fontSize: 7.5, halign: "center", fillColor: [255, 255, 255], font: "helvetica" } 
                    }
                ]);
            });
        } else {
            bodyTabla.push([
                { content: "", styles: { fillColor: [255, 255, 255] } },
                { 
                    content: "   Sin desgloses específicos registrados", 
                    colSpan: 4, 
                    styles: { fontStyle: "italic", textColor: [120, 120, 120], fontSize: 7.5, fillColor: [255, 255, 255], font: "helvetica" } 
                },
                { 
                    content: "0 Unidades", 
                    styles: { fontStyle: "bold", halign: "center", fontSize: 7.5, fillColor: [255, 255, 255], font: "helvetica" } 
                }
            ]);
        }
    });

    autoTable(doc, {
        startY: 42,
        head: [["#", "Predio", "Superficie", "Productor", "Contacto", "Cantidad Total Unitaria"]],
        body: bodyTabla,
        theme: "grid",
        headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold", textColor: [255, 255, 255], font: "helvetica" },
        styles: { fontSize: 7.5, cellPadding: 2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: {
            0: { width: 10, halign: "center" },
            1: { width: 35 },
            2: { width: 18, halign: "center" },
            3: { width: 32 },
            4: { width: 42 },
            5: { width: 35, halign: "center" }
        },
        margin: { left: 12, right: 12 }
    });

    // Paginación inferior
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(140, 140, 140);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(12, 268, 204, 268);
        doc.text("Reporte General de Producción Animal.", 12, 272);
        doc.text(`Página ${i} de ${totalPaginas}`, 204, 272, { align: "right" });
    }

    doc.save(`Reporte_Animal_${especieFiltro}_${municipioFiltro || "General"}.pdf`);
};