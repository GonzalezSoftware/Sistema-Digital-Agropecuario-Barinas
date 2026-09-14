import { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const useReportes = (prediosOriginales = []) => {
    const [busqueda, setBusqueda] = useState("");

    // Filtrar predios basados en el nombre del predio o del productor
    const prediosFiltrados = useMemo(() => {
        if (!busqueda.trim()) return prediosOriginales;
        const texto = busqueda.toLowerCase();
        return prediosOriginales.filter((p) => {
            const nombrePredio = p.nombre_predio?.toLowerCase() || "";
            const nombreProductor = p.productor?.nombre?.toLowerCase() || "";
            return nombrePredio.includes(texto) || nombreProductor.includes(texto);
        });
    }, [prediosOriginales, busqueda]);

    // Lógica para la generación de la Ficha Técnica en PDF
    const generarPDFPredio = (predio) => {
        console.log("DATOS REALES DEL PREDIO RECIBIDOS EN EL PDF:", predio);

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "letter"
        });

        const verdeBarinas = [19, 100, 66];
        const grisOscuro = [40, 40, 40];
        const grisSuave = [245, 247, 246];

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

        // Título central
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...verdeBarinas);
        const tituloFicha = `FICHA TÉCNICA: ${(predio.nombre_predio || "SIN NOMBRE").toUpperCase()}`;
        doc.text(tituloFicha, 12, 34);

        // I. Datos del productor
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...verdeBarinas);
        doc.text("I. DATOS DEL PRODUCTOR", 12, 44);

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(12, 46, 204, 46);

        const datosProductor = [
            ["Nombre Completo:", predio.productor?.nombre || "N/A", "Cédula / RIF:", predio.productor?.cedula_rif || "N/A"],
            ["Teléfono Celular:", predio.productor?.telefono || "N/A", "Correo Electrónico:", predio.productor?.correo || "N/A"]
        ];

        autoTable(doc, {
            startY: 48,
            body: datosProductor,
            theme: "plain",
            styles: { fontSize: 9, cellPadding: 2.5, font: "helvetica" },
            columnStyles: {
                0: { fontStyle: "bold", width: 32, textColor: grisOscuro },
                1: { width: 68 },
                2: { fontStyle: "bold", width: 28, textColor: grisOscuro },
                3: { width: 64 }
            },
            margin: { left: 12, right: 12 }
        });

        // II. Datos del predio
        let currentY = doc.lastAutoTable.finalY + 7;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...verdeBarinas);
        doc.text("II. DATOS DEL PREDIO E IDENTIFICACIÓN TERRITORIAL", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const datosPredio = [
            ["Municipio:", predio.municipio || "N/A", "Parroquia:", predio.parroquia || "N/A"],
            ["Comunidad / Sector:", predio.comunidad || "N/A", "Centro Poblado:", predio.centro_poblado || "N/A"],
            ["Superficie Total (Ha):", predio.superficie ? `${predio.superficie} Ha` : "0.00 Ha", "Coordenadas UTM:", predio.coordenadas || "N/A"],
            ["Tipo de Propiedad:", predio.tipo_propiedad || "N/A", "Tenencia de Tierra:", predio.tenencia || "N/A"],
            ["Vialidad Interna:", predio.vialidad || "N/A", "Dirección Detallada:", predio.direccion || "N/A"]
        ];

        autoTable(doc, {
            startY: currentY + 4,
            body: datosPredio,
            theme: "plain",
            styles: { fontSize: 9, cellPadding: 2.5, font: "helvetica" },
            columnStyles: {
                0: { fontStyle: "bold", width: 35, textColor: grisOscuro },
                1: { width: 65 },
                2: { fontStyle: "bold", width: 32, textColor: grisOscuro },
                3: { width: 60 }
            },
            margin: { left: 12, right: 12 }
        });

        // III. Infraestructura
        currentY = doc.lastAutoTable.finalY + 7;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
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
            theme: "plain",
            styles: { fontSize: 9, cellPadding: 2, font: "helvetica" },
            willDrawCell: (data) => {
                if (data.column.index % 2 === 0) {
                    doc.setFillColor(...grisSuave);
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F");
                }
            },
            columnStyles: {
                0: { fontStyle: "bold", textColor: verdeBarinas, width: 38 },
                1: { width: 26, halign: "center" },
                2: { fontStyle: "bold", textColor: verdeBarinas, width: 38 },
                3: { width: 26, halign: "center" },
                4: { fontStyle: "bold", textColor: verdeBarinas, width: 38 },
                5: { width: 26, halign: "center" }
            },
            margin: { left: 12, right: 12 }
        });

        // IV. Régimen de Producción
        currentY = doc.lastAutoTable.finalY + 7;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...verdeBarinas);
        doc.text("IV. RÉGIMEN SOCIO-PRODUCTIVO Y CONTROLES", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const prod = predio.produccion || {};
        const datosProduccion = [
            ["Tipo de Explotación Económica principal:", prod.tipo_explotacion || "N/A"],
            ["Cuenta con Registro Sanitario Vigente:", prod.registro_sanitario ? "SÍ (Verificado)" : "NO"],
            ["Mantiene Registro de Control Productivo:", prod.registro_productivo ? "SÍ (Verificado)" : "NO"],
            ["Mantiene Registro de Control Reproductivo:", prod.registro_reproductivo ? "SÍ (Verificado)" : "NO"],
            ["Mantiene Registro Financiero / Contable:", prod.registro_financiero ? "SÍ (Verificado)" : "NO"]
        ];

        autoTable(doc, {
            startY: currentY + 4,
            body: datosProduccion,
            theme: "striped",
            headStyles: { fillColor: verdeBarinas },
            styles: { fontSize: 9, cellPadding: 2.5, font: "helvetica" },
            columnStyles: {
                0: { fontStyle: "bold", width: 130, textColor: grisOscuro },
                1: { halign: "center", fontStyle: "bold", textColor: verdeBarinas, width: 62 }
            },
            margin: { left: 12, right: 12 }
        });

        // V. Servicios Básicos
        currentY = doc.lastAutoTable.finalY + 7;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...verdeBarinas);
        doc.text("V. SERVICIOS BÁSICOS INSTALADOS EN EL PREDIO", 12, currentY);
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
            body: [[listaServiciosText]],
            theme: "plain",
            styles: {
                fontSize: 9,
                cellPadding: 4,
                font: "helvetica",
                fontStyle: serviciosFinales.length > 0 ? "normal" : "italic",
                textColor: serviciosFinales.length > 0 ? [20, 20, 20] : [110, 110, 110]
            },
            willDrawCell: (data) => {
                doc.setFillColor(...grisSuave);
                doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F");
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

        const fileSanitizado = `Ficha_Tecnica_Predio_${(predio.nombre_predio || "Registro").replace(/\s+/g, "_")}.pdf`;
        doc.save(fileSanitizado);
    };

    return {
        busqueda,
        setBusqueda,
        prediosFiltrados,
        generarPDFPredio
    };
};