import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// 1. Importación correcta de los logos mediante los assets de Vite
import logoGobierno from "../assets/gobierno.jpg";
import logoEscudo from "../assets/logo.png";

// 1. Componente Spinner corporativo integrado
export const Spinner = ({ color = "#136442" }) => {
    const spinnerRef = (el) => {
        if (el) {
            el.animate(
                [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
                { duration: 1000, iterations: Infinity }
            );
        }
    };

    return (
        <svg
            ref={spinnerRef}
            width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
};

export default function SeccionReportes({ listaPredios = [], cargando }) {
    const [busqueda, setBusqueda] = useState("");

    // ── ESTADO DE PAGINACIÓN ──
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;

    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda]);

    // Función auxiliar para formatear ortográficamente el texto del municipio en la vista
    const formatearMunicipio = (texto) => {
        if (!texto) return "N/A";
        return texto
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase());
    };

    // 2. Validación de carga idéntica a las demás vistas
    if (cargando) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px",
                gap: "12px",
                color: "#136442",
                fontSize: "13px",
                fontWeight: "500"
            }}>
                <Spinner color="#136442" />
                <span>Cargando reportes...</span>
            </div>
        );
    }

    const prediosFiltrados = listaPredios.filter((p) => {
        const term = busqueda.toLowerCase();
        const nombrePredio = p.nombre_predio?.toLowerCase() || "";
        const nombreProductor = p.productor?.nombre?.toLowerCase() || "";
        return nombrePredio.includes(term) || nombreProductor.includes(term);
    });

    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const prediosPaginados = prediosFiltrados.slice(indicePrimerElemento, indiceUltimoElemento);
    const totalPaginas = Math.ceil(prediosFiltrados.length / elementosPorPagina);

    const generarPDFPredio = (predio) => {
        if (!predio) return;

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "letter"
        });

        const verdeBarinas = [19, 100, 66];
        const grisOscuro = [40, 40, 40];

        try {
            // Se utilizan los módulos importados arriba para asegurar compatibilidad en Vercel
            doc.addImage(logoGobierno, "JPEG", 12, 5, 42, 16);
            doc.addImage(logoEscudo, "PNG", 57, 8, 28, 10);
        } catch (error) {
            console.warn("Logos institucionales omitidos.", error);
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...verdeBarinas);
        doc.text("MINISTERIO DEL PODER POPULAR PARA LA AGRICULTURA Y TIERRAS", 204, 10, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text("MPPAT — DIRECCIÓN ESTADAL DE REGISTROS AGROPECUARIOS", 204, 14, { align: "right" });

        const fechaEmision = predio.fecha_registro
            ? new Date(predio.fecha_registro).toLocaleDateString()
            : new Date().toLocaleDateString();
        doc.text(`Fecha de Registro: ${fechaEmision}`, 204, 18, { align: "right" });

        doc.setDrawColor(...verdeBarinas);
        doc.setLineWidth(0.6);
        doc.line(12, 25, 204, 25);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);

        // 1. Imprimir la etiqueta en color verde
        doc.setTextColor(...verdeBarinas);
        const tituloVerde = "FICHA TÉCNICA INTEGRAL: ";
        doc.text(tituloVerde, 12, 33);

        // 2. Calcular el ancho del texto verde para posicionar el nombre a continuación
        const anchoTituloVerde = doc.getTextWidth(tituloVerde);

        // 3. Imprimir el nombre del predio en color negro
        doc.setTextColor(0, 0, 0);
        const nombreNegro = (predio.nombre_predio || "SIN NOMBRE").toUpperCase();
        doc.text(nombreNegro, 12 + anchoTituloVerde, 33);

        let currentY = 40;

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
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
            columnStyles: {
                0: { fontStyle: "bold", textColor: grisOscuro, width: 32, fillColor: [250, 250, 250] },
                1: { width: 45 },
                2: { fontStyle: "bold", textColor: grisOscuro, width: 25, fillColor: [250, 250, 250] },
                3: { width: 35 },
                4: { fontStyle: "bold", textColor: grisOscuro, width: 22, fillColor: [250, 250, 250] },
                5: { width: 33 }
            },
            margin: { left: 12, right: 12 }
        });

        currentY = doc.lastAutoTable.finalY + 6;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...verdeBarinas);
        doc.text("II. GEORREFERENCIACIÓN Y UBICACIÓN", 12, currentY);
        doc.line(12, currentY + 2, 204, currentY + 2);

        const datosUbicacion = [
            [
                "MUNICIPIO:", formatearMunicipio(predio.municipio),
                "PARROQUIA:", predio.parroquia || "N/A",
                "COMUNIDAD:", predio.comunidad || "N/A"
            ]
        ];

        autoTable(doc, {
            startY: currentY + 4,
            body: datosUbicacion,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
            columnStyles: {
                0: { fontStyle: "bold", textColor: grisOscuro, width: 25, fillColor: [250, 250, 250] },
                1: { width: 43 },
                2: { fontStyle: "bold", textColor: grisOscuro, width: 25, fillColor: [250, 250, 250] },
                3: { width: 43 },
                4: { fontStyle: "bold", textColor: grisOscuro, width: 25, fillColor: [250, 250, 250] },
                5: { width: 31 }
            },
            margin: { left: 12, right: 12 }
        });

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
            theme: "grid",
            headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold", textColor: [255, 255, 255] },
            styles: { fontSize: 8, cellPadding: 2, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
            columnStyles: { 0: { width: 65 }, 1: { width: 45 }, 2: { width: 45 }, 3: { width: 37 } },
            margin: { left: 12, right: 12 }
        });

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
            headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold", textColor: [255, 255, 255] },
            styles: { fontSize: 8, cellPadding: 1.8, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
            columnStyles: { 0: { width: 140 }, 1: { width: 52 } },
            margin: { left: 12, right: 12 }
        });

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
            headStyles: { fillColor: verdeBarinas, fontSize: 8.5, fontStyle: "bold", textColor: [255, 255, 255] },
            styles: { fontSize: 8, cellPadding: 1.8, font: "helvetica", lineColor: [210, 210, 210], lineWidth: 0.2 },
            columnStyles: { 0: { width: 140 }, 1: { width: 52 } },
            margin: { left: 12, right: 12 }
        });

        const totalPaginasPDF = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPaginasPDF; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(140, 140, 140);
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
            doc.line(12, 268, 204, 268);
            doc.text("Ficha Técnica Integral de Caracterización.", 12, 272);
            doc.text(`Página ${i} de ${totalPaginasPDF}`, 204, 272, { align: "right" });
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
                            <th style={{ fontSize: "14px", padding: "12px" }}>Caracterización</th>
                            <th style={{ fontSize: "14px", padding: "12px" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prediosPaginados.length > 0 ? (
                            prediosPaginados.map((p, index) => {
                                const numeroFila = indicePrimerElemento + index + 1;

                                return (
                                    <tr
                                        key={p.id_predio || index}
                                        style={{
                                            borderBottom: "1px solid #f0f0f0",
                                            backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb"
                                        }}
                                    >
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{numeroFila}</td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{p.nombre_predio}</td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{p.productor?.nombre || "Sin nombre"}</td>
                                        {/* Municipio formateado correctamente en la tabla de reportes */}
                                        <td style={{ fontSize: "13px", padding: "12px" }}>{formatearMunicipio(p.municipio)}</td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>
                                            <span style={{
                                                padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "600",
                                                backgroundColor: p.caracterizacion_completada ? "#dcfce7" : "#fee2e2",
                                                color: p.caracterizacion_completada ? "#166534" : "#991b1b"
                                            }}>
                                                {p.caracterizacion_completada ? "Caracterizado" : "No Caracterizado"}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: "13px", padding: "12px" }}>
                                            <button
                                                onClick={() => generarPDFPredio(p)}
                                                style={{
                                                    backgroundColor: "#f0fdf4", color: "#136442",
                                                    border: "1px solid #136442", padding: "6px 12px",
                                                    borderRadius: "6px", cursor: "pointer", fontSize: "12px"
                                                }}
                                            >
                                                Generar Ficha PDF
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#999" }}>No se encontraron registros.</td></tr>
                        )}
                    </tbody>
                </table>

                {/* ── CONTROLES DE PAGINACIÓN ── */}
                {totalPaginas > 1 && (
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #eee", flexWrap: "wrap", gap: "10px"
                    }}>
                        <span style={{ fontSize: "13px", color: "#666" }}>
                            Mostrando del <strong>{indicePrimerElemento + 1}</strong> al <strong>{Math.min(indiceUltimoElemento, prediosFiltrados.length)}</strong> de <strong>{prediosFiltrados.length}</strong> predios
                        </span>

                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <button
                                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                disabled={paginaActual === 1}
                                style={{
                                    padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc",
                                    backgroundColor: paginaActual === 1 ? "#f5f5f5" : "#fff",
                                    color: paginaActual === 1 ? "#aaa" : "#136442",
                                    cursor: paginaActual === 1 ? "not-allowed" : "pointer",
                                    fontWeight: "bold", fontSize: "12px"
                                }}
                            >
                                Anterior
                            </button>

                            <span style={{ fontSize: "13px", padding: "0 8px", fontWeight: "bold", color: "#333" }}>
                                Página {paginaActual} de {totalPaginas}
                            </span>

                            <button
                                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                disabled={paginaActual === totalPaginas}
                                style={{
                                    padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc",
                                    backgroundColor: paginaActual === totalPaginas ? "#f5f5f5" : "#fff",
                                    color: paginaActual === totalPaginas ? "#aaa" : "#136442",
                                    cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer",
                                    fontWeight: "bold", fontSize: "12px"
                                }}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}