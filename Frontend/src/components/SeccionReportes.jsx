import React, { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function SeccionReportes({ listaPredios }) {
    const [busqueda, setBusqueda] = useState("");

    const prediosFiltrados = listaPredios.filter((p) => {
        const term = busqueda.toLowerCase();
        const nombrePredio = p.nombre_predio?.toLowerCase() || "";
        const nombreProductor = p.productor?.nombre?.toLowerCase() || "";
        return nombrePredio.includes(term) || nombreProductor.includes(term);
    });

    const generarPDFPredio = (predio) => {
        if (!predio || !predio.caracterizacion_completada) {
            alert("No se puede exportar el PDF debido a que la caracterización de este predio no ha sido completada.");
            return;
        }

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "letter"
        });

        const verdeBarinas = [19, 100, 66];
        const grisOscuro = [40, 40, 40];

        // ────────────────────────────────────────────────────────
        // CINTILLO INSTITUCIONAL (MEMBRETE)
        // ────────────────────────────────────────────────────────
        try {
            doc.addImage("/src/assets/logo.png", "PNG", 12, 5, 22, 16);
            doc.addImage("/src/assets/gobierno.jpg", "JPEG", 37, 5, 28, 16);
        } catch (error) {
            console.warn("Logos institucionales omitidos.");
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

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...verdeBarinas);
        doc.text(`FICHA TÉCNICA INTEGRAL: ${(predio.nombre_predio || "SIN NOMBRE").toUpperCase()}`, 12, 33);

        let currentY = 40;

        // ────────────────────────────────────────────────────────
        // I. DATOS DEL PRODUCTOR
        // ────────────────────────────────────────────────────────
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...verdeBarinas);
        doc.text("I. DATOS DEL PRODUCTOR", 12, currentY);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const datosProductor = [
            [
                "NOMBRE COMPLETO:", predio.productor?.nombre || "N/A",
                "CÉDULA / RIF:", predio.productor?.cedula_rif || "N/A",
                "TELÉFONO:", predio.productor?.telefono || "N/A"
            ]
        ];

        autoTable(doc, {
            startY: currentY + 4,
            body: datosProductor,
            theme: "plain",
            styles: { fontSize: 8, cellPadding: 2, font: "helvetica" },
            columnStyles: {
                0: { fontStyle: "bold", textColor: grisOscuro, width: 32 },
                1: { width: 45 },
                2: { fontStyle: "bold", textColor: grisOscuro, width: 25 },
                3: { width: 35 },
                4: { fontStyle: "bold", textColor: grisOscuro, width: 22 },
                5: { width: 33 }
            },
            margin: { left: 12, right: 12 }
        });

        // ────────────────────────────────────────────────────────
        // II. GEORREFERENCIACIÓN Y UBICACIÓN
        // ────────────────────────────────────────────────────────
        currentY = doc.lastAutoTable.finalY + 6;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...verdeBarinas);
        doc.text("II. GEORREFERENCIACIÓN Y UBICACIÓN", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const datosUbicacion = [
            [
                "MUNICIPIO:", predio.municipio || "N/A",
                "PARROQUIA:", predio.parroquia || "N/A",
                "COMUNIDAD:", predio.comunidad || "N/A"
            ]
        ];

        autoTable(doc, {
            startY: currentY + 4,
            body: datosUbicacion,
            theme: "plain",
            styles: { fontSize: 8, cellPadding: 2, font: "helvetica" },
            columnStyles: {
                0: { fontStyle: "bold", textColor: grisOscuro, width: 25 },
                1: { width: 43 },
                2: { fontStyle: "bold", textColor: grisOscuro, width: 25 },
                3: { width: 43 },
                4: { fontStyle: "bold", textColor: grisOscuro, width: 25 },
                5: { width: 31 }
            },
            margin: { left: 12, right: 12 }
        });

        // ────────────────────────────────────────────────────────
        // III. INTENCIONALIDAD DE SIEMBRA (RUBROS VEGETALES)
        // ────────────────────────────────────────────────────────
        currentY = doc.lastAutoTable.finalY + 6;
        if (currentY > 240) { doc.addPage(); currentY = 20; }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...verdeBarinas);
        doc.text("III. INTENCIONALIDAD DE SIEMBRA (RUBROS VEGETALES)", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const rubros = predio.rubros_vegetales || [];
        const bodyRubros = rubros.length > 0
            ? rubros.map(r => [
                r.rubro || "N/A",
                r.hectareas ? `${r.hectareas} Ha` : "0 Ha",
                r.estado || "N/A",
                r.produccion_estimada ? `${r.produccion_estimada} Kg` : "0 Kg"
            ])
            : [["Sin rubros vegetales declarados.", "", "", ""]];

        autoTable(doc, {
            startY: currentY + 4,
            head: [["Rubro", "Superficie (Ha)", "Estado", "Producción Estimada"]],
            body: bodyRubros,
            theme: "striped",
            headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold" },
            styles: { fontSize: 8, cellPadding: 2, font: "helvetica" },
            columnStyles: { 0: { width: 65 }, 1: { width: 45 }, 2: { width: 45 }, 3: { width: 37 } },
            margin: { left: 12, right: 12 }
        });

        // ────────────────────────────────────────────────────────
        // IV. INVENTARIO DE SEMOVIENTES / GANADERÍA
        // ────────────────────────────────────────────────────────
        currentY = doc.lastAutoTable.finalY + 6;
        if (currentY > 230) { doc.addPage(); currentY = 20; }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...verdeBarinas);
        doc.text("IV. INVENTARIO DE SEMOVIENTES / GANADERÍA", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const existenciaAnimal = predio.existencia_animal || {};
        let bodySemovientes = [];

        if (Object.keys(existenciaAnimal).length > 0) {
            Object.entries(existenciaAnimal).forEach(([especie, detalleEspecie]) => {
                if (!detalleEspecie || typeof detalleEspecie !== "object" || Object.keys(detalleEspecie).length === 0) return;
                
                // Fila de cabecera de especie dentro de la tabla o separador
                bodySemovientes.push([{ content: `ESPECIE: ${especie.replace(/_/g, " ").toUpperCase()}`, colSpan: 2, styles: { fontStyle: "bold", fillColor: [230, 240, 235], textColor: verdeBarinas } }]);

                Object.entries(detalleEspecie).forEach(([subKey, subValue]) => {
                    if (subKey === "id") return;
                    bodySemovientes.push([
                        subKey.replace(/_/g, " ").toUpperCase(),
                        subValue !== null && subValue !== undefined ? subValue : 0
                    ]);
                });
            });
        }

        if (bodySemovientes.length === 0) {
            bodySemovientes = [["Sin inventario animal registrado en este predio.", ""]];
        }

        autoTable(doc, {
            startY: currentY + 4,
            head: [["Categoría / Subtipo", "Cantidad / Unidades"]],
            body: bodySemovientes,
            theme: "grid",
            headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold" },
            styles: { fontSize: 8, cellPadding: 1.8, font: "helvetica" },
            columnStyles: { 0: { width: 140 }, 1: { width: 52 } },
            margin: { left: 12, right: 12 }
        });

        // ────────────────────────────────────────────────────────
        // V. MAQUINARIA, IMPLEMENTOS Y EQUIPOS
        // ────────────────────────────────────────────────────────
        currentY = doc.lastAutoTable.finalY + 6;
        if (currentY > 230) { doc.addPage(); currentY = 20; }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...verdeBarinas);
        doc.text("V. MAQUINARIA, IMPLEMENTOS Y EQUIPOS", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const maquinaria = predio.maquinaria || {};
        let bodyMaquinaria = [];

        if (Object.keys(maquinaria).length > 0) {
            Object.entries(maquinaria).forEach(([tipoMaq, detalleMaq]) => {
                if (!detalleMaq || typeof detalleMaq !== "object" || Object.keys(detalleMaq).length === 0) return;

                bodyMaquinaria.push([{ content: `TIPO: ${tipoMaq.replace(/_/g, " ").toUpperCase()}`, colSpan: 2, styles: { fontStyle: "bold", fillColor: [230, 240, 235], textColor: verdeBarinas } }]);

                Object.entries(detalleMaq).forEach(([itemKey, itemVal]) => {
                    if (itemKey === "id") return;
                    bodyMaquinaria.push([
                        itemKey.replace(/_/g, " ").toUpperCase(),
                        itemVal !== null && itemVal !== undefined ? itemVal : 0
                    ]);
                });
            });
        }

        if (bodyMaquinaria.length === 0) {
            bodyMaquinaria = [["Sin maquinaria o equipos registrados.", ""]];
        }

        autoTable(doc, {
            startY: currentY + 4,
            head: [["Elemento / Equipo", "Cantidad"]],
            body: bodyMaquinaria,
            theme: "grid",
            headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold" },
            styles: { fontSize: 8, cellPadding: 1.8, font: "helvetica" },
            columnStyles: { 0: { width: 140 }, 1: { width: 52 } },
            margin: { left: 12, right: 12 }
        });

        // ────────────────────────────────────────────────────────
        // PIE DE PÁGINA
        // ────────────────────────────────────────────────────────
        const totalPaginas = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPaginas; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(140, 140, 140);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
            doc.line(12, 268, 204, 268);
            doc.text("Ficha Técnica Integral de Caracterización — UTMPPAPT.", 12, 272);
            doc.text(`Página ${i} de ${totalPaginas}`, 204, 272, { align: "right" });
        }

        const fileSanitizado = `Ficha_Tecnica_Integral_${(predio.nombre_predio || "Predio").replace(/\s+/g, "_")}.pdf`;
        doc.save(fileSanitizado);
    };

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: "20px", flexWrap: "wrap", gap: "10px"
            }}>
                <h2 style={{ color: "#136442", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                    Historial de Predios Registrados
                </h2>

                <div style={{ position: "relative", width: "100%", maxWidth: "350px" }}>
                    <input
                        type="text" placeholder="Buscar por productor o predio..."
                        value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                        style={{
                            width: "100%", padding: "10px 15px", borderRadius: "8px",
                            border: "1.4px solid #ccc", fontSize: "14px", outline: "none",
                        }}
                    />
                </div>
            </div>

            <div style={{
                backgroundColor: "#fff", padding: "20px", borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eee", overflowX: "auto"
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #136442", color: "#136442" }}>
                            <th style={{ fontSize: "14px", padding: "12px" }}>#</th>
                            <th style={{ fontSize: "14px", padding: "12px" }}>Nombre del Predio</th>
                            <th style={{ fontSize: "14px", padding: "12px" }}>Productor</th>
                            <th style={{ fontSize: "14px", padding: "12px" }}>Municipio</th>
                            <th style={{ fontSize: "14px", padding: "12px" }}>Superficie</th>
                            <th style={{ fontSize: "14px", padding: "12px" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prediosFiltrados.length > 0 ? (
                            prediosFiltrados.map((p, index) => (
                                <tr
                                    key={p.id_predio || index}
                                    style={{
                                        borderBottom: "1px solid #f0f0f0",
                                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb"
                                    }}
                                >
                                    <td style={{ fontSize: "13px", padding: "12px" }}>{index + 1}</td>
                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.nombre_predio}</td>
                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.productor?.nombre || "Sin nombre"}</td>
                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.municipio}</td>
                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.superficie} Ha</td>
                                    <td style={{ fontSize: "13px", padding: "12px" }}>
                                        <button
                                            onClick={() => generarPDFPredio(p)}
                                            style={{ backgroundColor: "#f0fdf4", color: "#136442", border: "1px solid #136442", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                                        >
                                            Generar Ficha PDF
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#999" }}>No se encontraron registros.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}