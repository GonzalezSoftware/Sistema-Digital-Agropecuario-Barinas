import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import escudo from "../../assets/logo2.jpg";
import Swal from 'sweetalert2';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import MapaBarinas from "../../components/MapaBarinas";


import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Legend,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ScatterChart, Scatter, ZAxis,
    RadialBarChart, RadialBar,
    Treemap // <-- Asegúrate de que esté aquí
} from 'recharts';

const generarPDFPredio = (predio) => {

    console.log("DATOS REALES DEL PREDIO RECIBIDOS EN EL PDF:", predio);

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter"
    });

    // Colores base institucionales
    const verdeBarinas = [19, 100, 66];
    const grisOscuro = [40, 40, 40];
    const grisSuave = [245, 247, 246];

    // ────────────────────────────────────────────────────────
    // CINTILLO INSTITUCIONAL SUPERIOR (Logos y Ente)
    // ────────────────────────────────────────────────────────
    try {
        // Se amplió el ancho (width) de ambos logos para mejorar su proporción horizontal
        // doc.addImage(ruta, formato, x, y, ancho, alto)
        doc.addImage("/src/assets/logo.png", "PNG", 12, 5, 22, 16);
        doc.addImage("/src/assets/gobierno.jpg", "JPEG", 37, 5, 28, 16);
    } catch (error) {
        console.warn("No se pudieron cargar las imágenes de los logos en el PDF. Verifique las rutas relativas.", error);
    }

    // Bloque de texto oficial alineado a la derecha
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

    // Línea divisoria del encabezado principal
    doc.setDrawColor(...verdeBarinas);
    doc.setLineWidth(0.6);
    doc.line(12, 25, 204, 25);

    // ────────────────────────────────────────────────────────
    // TÍTULO CENTRAL DE LA FICHA TÉCNICA
    // ────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...verdeBarinas);
    const tituloFicha = `FICHA TÉCNICA: ${(predio.nombre_predio || "SIN NOMBRE").toUpperCase()}`;
    doc.text(tituloFicha, 12, 34);

    // SE ELIMINÓ EL SUBTÍTULO DEL CÓDIGO ÚNICO DE REGISTRO TERRITORIAL (#PRD-7)

    // ────────────────────────────────────────────────────────
    // I. DATOS DEL PRODUCTOR
    // ────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...verdeBarinas);
    doc.text("I. DATOS DEL PRODUCTOR", 12, 44); // Se subió un poco el eje Y (de 49 a 44) para equilibrar el espacio vacío

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(12, 46, 204, 46);

    const datosProductor = [
        ["Nombre Completo:", predio.productor?.nombre || "N/A", "Cédula / RIF:", predio.productor?.cedula_rif || "N/A"],
        ["Teléfono Celular:", predio.productor?.telefono || "N/A", "Correo Electrónico:", predio.productor?.correo || "N/A"]
    ];

    autoTable(doc, {
        startY: 48, // Ajustado acorde a la nueva altura
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

    // ────────────────────────────────────────────────────────
    // II. DATOS DEL PREDIO (Identificación y Ubicación)
    // ────────────────────────────────────────────────────────
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

    // ────────────────────────────────────────────────────────
    // III. INFRAESTRUCTURA DE LA UNIDAD DE PRODUCCIÓN
    // ────────────────────────────────────────────────────────
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

    // ────────────────────────────────────────────────────────
    // IV. RÉGIMEN DE PRODUCCIÓN Y REGISTROS
    // ────────────────────────────────────────────────────────
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

    // ────────────────────────────────────────────────────────
    // V. SERVICIOS BÁSICOS (NORMALIZADO)
    // ────────────────────────────────────────────────────────
    currentY = doc.lastAutoTable.finalY + 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...verdeBarinas);
    doc.text("V. SERVICIOS BÁSICOS INSTALADOS EN EL PREDIO", 12, currentY);
    doc.line(12, currentY + 2, 204, currentY + 2);

    // LÓGICA DE NORMALIZACIÓN:
    // 1. Tomamos el array de la base de datos
    // 2. Convertimos cada elemento a minúsculas, excepto la primera letra
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

    // ────────────────────────────────────────────────────────
    // PIE DE PÁGINA DINÁMICO
    // ────────────────────────────────────────────────────────
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


// MODIFICA ESTA FUNCIÓN EN TU ARCHIVO Dashboard.jsx
const CustomTreemapContent = (props) => {
    const { x, y, width, height, name, index } = props;
    const colors = ['#136442', '#1b8a5b', '#34d399', '#6ee7b7', '#a7f3d0'];

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: colors[index % colors.length],
                    stroke: '#fff',
                    strokeWidth: 1, // Reducimos el borde para que no "contamine" la vista
                }}
            />
            {width > 60 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#F8FAFC" // Usamos un blanco tipo "Humo" (Slate 50) que quita el efecto de brillo agresivo
                    fontSize={10}
                    fontWeight="100" // Bajamos de 600 a 500 para que la letra sea más fina y nítida
                    style={{
                        pointerEvents: 'none',
                        textShadow: 'none', // Forzamos a que no tenga sombras
                        letterSpacing: '0.02em'
                    }}
                >
                    {name}
                </text>
            )}
        </g>
    );
};

// ── ICONOS SVG REALES ──────────────────
const IconInicio = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const IconRegistro = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const IconMapa = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
);

const IconHistorial = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);

const IconReportes = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);


// Corregir iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapaInteractivo = ({ predios }) => {
    // Límites de Barinas para que el mapa no se pierda
    const boundsBarinas = [
        [7.0, -71.8], // Sur-Oeste
        [9.5, -67.5]  // Norte-Este
    ];

    return (
        <MapContainer
            center={[8.6226, -70.2075]}
            zoom={8}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            maxBounds={boundsBarinas}
        >
            {/* Capa de mapa elegante y profesional (Light Mode) */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            />

            {predios.map((p, idx) => {
                // Validación de coordenadas (ajusta según tu formato de DB)
                const coords = p.coordenadas ? p.coordenadas.split(',').map(Number) : null;

                if (coords && coords.length === 2) {
                    return (
                        <Marker key={idx} position={[coords[0], coords[1]]}>
                            <Popup>
                                <div style={{ textAlign: 'center' }}>
                                    <strong style={{ color: '#2d572c' }}>{p.nombre_predio}</strong><br />
                                    <span>Municipio: {p.municipio}</span><br />
                                    <small>Coord: {p.coordenadas}</small>
                                </div>
                            </Popup>
                        </Marker>
                    );
                }
                return null;
            })}

            <ZoomControl position="bottomright" />
        </MapContainer>
    );
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [tabActiva, setTabActiva] = useState("inicio");
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);
    const [listaPredios, setListaPredios] = useState([]);
    const [prefijoCedula, setPrefijoCedula] = useState("V-");
    const [prefijoTelefono, setPrefijoTelefono] = useState("0414");

    const PARROQUIAS_POR_MUNICIPIO = {
        "Barinas": ["Barinas", "Alfredo Arvelo Larriva", "Alto Barinas", "Corazón de Jesús", "El Carmen", "Juan Antonio Rodríguez Domínguez", "Manuel Palacio Fajardo", "Ramón Ignacio Méndez", "Rómulo Betancourt", "Santa Lucía", "Torunos", "Domínguez Martínez"],
        "Alberto Arvelo Torrealba": ["Sabaneta", "Rodríguez Domínguez"],
        "Andrés Eloy Blanco": ["El Cantón", "Santa Cruz de Guahaba", "Puerto Vivas"],
        "Antonio José de Sucre": ["Bum Bum", "Ticoporo", "Andrés Bello"],
        "Arismendi": ["Arismendi", "Guadarrama", "La Unión", "San Antonio"],
        "Bolívar": ["Barinitas", "Altamira de Cáceres", "Calderas"],
        "Cruz Paredes": ["Barrancas", "El Socorro", "Masparrito"],
        "Ezequiel Zamora": ["Santa Bárbara", "José Ignacio del Pumar", "Pedro Briceño Méndez", "Ramón Ignacio Méndez"],
        "Obispos": ["Obispos", "Guasimitos", "El Real", "La Luz"],
        "Pedraza": ["Ciudad Bolivia", "José Ignacio del Pumar", "Páez", "Reyes Cueto"],
        "Rojas": ["Libertad", "Dolores", "Palacios Fajardo", "Santa Rosa"],
        "Sosa": ["Ciudad de Nutrias", "El Regalo", "Puerto de Nutrias", "Santa Catalina"]
    };

    const MUNICIPIOS = [
        "Alberto Arvelo Torrealba", "Andrés Eloy Blanco", "Antonio José de Sucre",
        "Arismendi", "Barinas", "Bolívar", "Cruz Paredes",
        "Ezequiel Zamora", "Obispos", "Pedraza", "Rojas", "Sosa"
    ];

    // Límites geográficos aproximados por Municipio del Estado Barinas (Bounding Boxes)
    // Límites geográficos cartográficos estrictos por Municipio (Estado Barinas)
    // Límites geográficos ultra-estrictos para evitar solapamientos en González Software
    const LIMITES_MUNICIPIOS = {
        "Barinas": { latMin: 8.32, latMax: 8.71, lngMin: -70.40, lngMax: -70.12 },
        "Cruz Paredes": { latMin: 8.64, latMax: 8.95, lngMin: -70.21, lngMax: -69.98 },
        "Obispos": { latMin: 8.35, latMax: 8.82, lngMin: -70.11, lngMax: -69.62 },
        "Bolívar": { latMin: 8.68, latMax: 9.02, lngMin: -70.72, lngMax: -70.22 },
        "Pedraza": { latMin: 7.90, latMax: 8.52, lngMin: -71.12, lngMax: -70.22 },
        "Alberto Arvelo Torrealba": { latMin: 8.42, latMax: 8.81, lngMin: -69.95, lngMax: -69.48 },
        "Antonio José de Sucre": { latMin: 7.92, latMax: 8.38, lngMin: -70.95, lngMax: -70.48 },
        "Arismendi": { latMin: 8.05, latMax: 9.08, lngMin: -68.75, lngMax: -67.45 },
        "Andrés Eloy Blanco": { latMin: 7.22, latMax: 7.78, lngMin: -71.65, lngMax: -71.05 },
        "Ezequiel Zamora": { latMin: 7.35, latMax: 7.98, lngMin: -71.45, lngMax: -70.58 },
        "Rojas": { latMin: 7.98, latMax: 8.48, lngMin: -69.88, lngMax: -69.32 },
        "Sosa": { latMin: 7.82, latMax: 8.35, lngMin: -69.58, lngMax: -69.05 }
    };

    // Polígonos geográficos de Barinas extraídos de OpenStreetMap (Limpios y Optimizados)
    // Estructura político-territorial por Parroquias (Estado Barinas) - González Software
    // Límites cartográficos oficiales por Municipio (Estado Barinas) - González Software
    const POLIGONOS_MUNICIPIOS = {
        "Barinas": [
            [-70.2500, 8.6600], [-70.1800, 8.6600], [-70.1400, 8.6100], [-70.1205, 8.5841],
            [-70.1412, 8.4521], [-70.2314, 8.3214], [-70.3654, 8.3541], [-70.3985, 8.4852],
            [-70.3541, 8.5987], [-70.2854, 8.6124], [-70.2500, 8.6600] // Polígono ampliado (Pasa tu casa perfectamente)
        ],
        "Cruz Paredes": [
            [-70.2112, 8.6610], [-70.2214, 8.7124], [-70.1854, 8.8451], [-70.0842, 8.9485],
            [-69.9841, 8.9124], [-69.9954, 8.7841], [-70.1124, 8.6954], [-70.2112, 8.6610]
        ],
        "Obispos": [
            [-70.1205, 8.5950], [-70.1124, 8.6954], [-69.9954, 8.7841], [-69.8214, 8.8124],
            [-69.6214, 8.5412], [-69.7841, 8.3841], [-69.9541, 8.3521], [-70.1205, 8.5950]
        ],
        "Bolívar": [
            [-70.3985, 8.4852], [-70.3541, 8.5987], [-70.2854, 8.6124], [-70.2112, 8.6432],
            [-70.2214, 8.7124], [-70.2841, 8.8541], [-70.7124, 9.0124], [-70.6541, 8.6841],
            [-70.3985, 8.4852]
        ],
        "Pedraza": [
            [-70.3654, 8.3541], [-70.2314, 8.3214], [-69.9541, 8.3521], [-70.1841, 7.9124],
            [-70.7412, 8.1245], [-71.1124, 8.3412], [-70.8412, 8.5214], [-70.3654, 8.3541]
        ],
        "Alberto Arvelo Torrealba": [
            [-69.9954, 8.7841], [-69.8214, 8.8124], [-69.4841, 8.6214], [-69.7124, 8.4214],
            [-69.9541, 8.3521], [-69.9954, 8.7841]
        ],
        "Antonio José de Sucre": [
            [-70.7412, 8.1245], [-70.5214, 8.3841], [-70.8412, 8.5214], [-70.9451, 8.2412],
            [-70.7412, 8.1245]
        ],
        "Arismendi": [
            [-68.7451, 9.0784], [-67.4512, 8.5412], [-68.1245, 8.0541], [-68.7412, 8.3412],
            [-68.7451, 9.0784]
        ],
        "Andrés Eloy Blanco": [
            [-71.6451, 7.5412], [-71.2142, 7.7841], [-71.0541, 7.2214], [-71.6451, 7.5412]
        ],
        "Ezequiel Zamora": [
            [-71.4451, 7.8412], [-70.5841, 7.9841], [-70.6214, 7.3521], [-71.4451, 7.8412]
        ],
        "Rojas": [
            [-69.8841, 8.4841], [-69.3214, 8.2142], [-69.5412, 7.9841], [-69.8841, 8.4841]
        ],
        "Sosa": [
            [-69.5841, 8.3412], [-69.0541, 8.1241], [-69.2412, 7.8214], [-69.5841, 8.3412]
        ]
    };

    const comprobarPuntoEnPoligono = (point, polygon) => {
        const x = point[0], y = point[1];
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][0], yi = polygon[i][1];
            const xj = polygon[j][0], yj = polygon[j][1];

            const intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    // ── ESTADO INICIAL COMPLETO ─────────────────────────
    const formInicial = {
        // PRODUCTOR
        productor_nombre: "",
        productor_cedula: "",
        productor_telefono: "",
        productor_correo: "",

        // UBICACIÓN
        municipio: "Barinas",
        parroquia: "",
        comunidad: "",
        centro_poblado: "",
        coordenadas: "",

        // PREDIO
        nombre_predio: "",
        direccion: "",
        superficie: "",
        tipo_propiedad: "Privado",

        // TENENCIA
        tenencia: "Propiedad",

        // SERVICIOS
        servicios: [],
        vialidad: "Regular",

        // INFRAESTRUCTURA
        infraestructura: {
            corrales: 0,
            galpones: 0,
            vaqueras: 0,
            cochineras: 0,
            silos: 0,
            caballerizas: 0,
            feedlot: 0,
            lagunas: 0,
            salas_ordeno: 0,
            queseras: 0,
            casas: 0,
            trapiches: 0,
            establos: 0
        },

        // PRODUCCIÓN
        tipo_explotacion: "Extensivo",
        sistemas_registro: []
    };

    const [formData, setFormData] = useState(formInicial);

    //---------------------------------Validaciones del registro-------------------------------------

    const [errors, setErrors] = useState({
        productor_nombre: "",
        productor_cedula: "",
        productor_telefono: "",
        productor_correo: "",
        municipio: "",
        parroquia: "",
        comunidad: "",
        centro_poblado: "",
        coordenadas: ""
    });

    const [camposBloqueados, setCamposBloqueados] = useState(false);

    const verificarCedulaDuplicada = (cedula) => {
        if (!cedula) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Por favor, ingrese una cédula para buscar.',
                didOpen: () => {
                    const popup = Swal.getPopup();
                    if (popup) popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
                }
            });
            return;
        }

        // Animación de carga mientras busca
        Swal.fire({
            title: 'Buscando...',
            text: 'Consultando registros del productor, por favor espere.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                const popup = Swal.getPopup();
                if (popup) popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
            }
        });

        const cedulaLimpia = String(cedula).trim();
        const registroEncontrado = listaPredios.find(p => {
            const cedulaEnDB = String(p.productor?.cedula_rif || "").replace(/\D/g, '').trim();
            return cedulaEnDB === cedulaLimpia;
        });

        setTimeout(() => { // Pequeña pausa para que se aprecie la animación
            if (registroEncontrado) {
                const prod = registroEncontrado.productor;

                setFormData(prev => ({
                    ...prev,
                    productor_nombre: prod.nombre || "",
                    productor_telefono: prod.telefono || "",
                    productor_correo: prod.correo || ""
                }));

                setCamposBloqueados(true);
                setErrors(prev => ({ ...prev, productor_cedula: "" }));

                Swal.fire({
                    icon: 'success',
                    title: '¡Productor encontrado!',
                    text: 'Información cargada exitosamente.',
                    didOpen: () => {
                        const popup = Swal.getPopup();
                        if (popup) popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
                    }
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'No registrado',
                    text: 'Esta cédula no tiene registros previos. Puede continuar con el registro manualmente.',
                    didOpen: () => {
                        const popup = Swal.getPopup();
                        if (popup) popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
                    }
                });
            }
        }, 600);
    };
    const validarCampoProductor = (name, value,) => {
        let mensaje = "";

        if (name === "productor_nombre") {
            if (value.trim().length < 3) {
                mensaje = "El nombre es muy corto";
            } else if (value.length > 40) {
                mensaje = "Máximo 40 caracteres permitidos";
            } else if (/[0-9]/.test(value)) {
                mensaje = "El nombre no debe contener números";
            } else if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(value)) {
                mensaje = "No se permiten signos ni símbolos";
            }
        }
        if (name === "productor_cedula") {
            const esV = prefijoCedula === "V-";
            const min = esV ? 6 : 5;
            const max = 8;
            const soloNumeros = /^[0-9]*$/;

            const existeEnDB = listaPredios.some(p => {
                const cedulaEnDB = String(p.productor?.cedula_rif || "").replace(/\D/g, '').trim();
                return cedulaEnDB === value.trim();
            });

            if (value === "") {
                mensaje = "La cédula es requerida";
            } else if (!soloNumeros.test(value)) {
                mensaje = "Solo se permiten números";
            } else if (value.length < min || value.length > max) {
                mensaje = esV ? `La cédula debe tener entre 6 y 8 dígitos` : `La cédula debe tener entre 5 y 8 dígitos`;
            } else if (existeEnDB) {
                mensaje = "Esta cédula ya está registrada. Presione la lupa para cargar sus datos.";
            } else {
                mensaje = "";
            }

            setErrors(prev => ({ ...prev, [name]: mensaje }));
        }
        if (name === "productor_telefono") {
            // 1. Validaciones de formato
            if (value === "") {
                mensaje = "";
            } else if (!/^[0-9]+$/.test(value)) {
                mensaje = "El teléfono solo debe contener números";
            } else if (value.length !== 10) {
                mensaje = "El teléfono debe tener exactamente 10 dígitos (Ej: 4141234567)";
            } else if (!/^(414|424|416|426|412)[0-9]{7}$/.test(value)) {
                mensaje = "El número debe comenzar con una operadora válida (414, 424, 416, 426, 412)";
            }
            // 2. Validación de duplicados (Ajustada para comparar con el prefijo 58)
            else {
                const telefonoConPrefijo = `58${value.trim()}`;

                const telefonoYaRegistrado = listaPredios.some(p => {
                    // Convertimos a string y quitamos posibles espacios para comparar
                    const telEnDB = String(p.productor?.telefono || "").trim();
                    return telEnDB === telefonoConPrefijo;
                });

                if (telefonoYaRegistrado) {
                    mensaje = "Este número de teléfono ya está registrado.";
                } else {
                    mensaje = ""; // Todo correcto
                }
            }

            setErrors(prev => ({ ...prev, [name]: mensaje }));
        }

        if (name === "productor_correo") {
            if (value === "") {
                mensaje = "";
            } else {
                // 1. Validación de formato y dominios permitidos
                const regexDominiosPermitidos = /^[^\s@]+@(gmail\.com|hotmail\.com)$/i;

                // 2. Validación anti-patrones comunes de correos falsos
                const esCorreoSospechoso = /(.)\1{4,}/i.test(value.split('@')[0]) ||
                    /asdasd|12345|qwerty/i.test(value);

                if (!regexDominiosPermitidos.test(value)) {
                    mensaje = "Solo se permiten correos válidos de @gmail.com o @hotmail.com";
                } else if (esCorreoSospechoso) {
                    mensaje = "El correo parece falso o inválido. Por favor, verifícalo.";
                } else if (value.split('@')[0].length < 4) {
                    mensaje = "El nombre de usuario del correo es demasiado corto";
                }
                // 3. Validación de duplicados: Comparamos con otros productores registrados
                else {
                    const correoYaRegistrado = listaPredios.some(p => {
                        const correoEnDB = String(p.productor?.correo || "").toLowerCase().trim();
                        return correoEnDB === value.toLowerCase().trim();
                    });

                    if (correoYaRegistrado) {
                        mensaje = "Este correo electrónico ya está registrado.";
                    } else {
                        mensaje = ""; // Todo correcto
                    }
                }
            }

            setErrors(prev => ({ ...prev, [name]: mensaje }));
        }
        // --- DENTRO DE validarCampoProductor ---



        if (name === "comunidad" || name === "centro_poblado") {
            const soloLetrasYEspacios = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

            if (value.trim() === "") {
                mensaje = "Indique la localidad";
            } else if (value.length < 3) {
                mensaje = "El nombre es muy corto";
            } else if (value.length > 30) {
                mensaje = "Máximo 30 caracteres permitidos"; // <-- Nueva validación
            } else if (!soloLetrasYEspacios.test(value)) {
                mensaje = "Solo letras y espacios";
            }
        }

        // Creamos una lectura en tiempo real combinando el estado actual con el cambio reciente
        const datosEnTiempoReal = {
            ...formData,
            [name]: value
        };

        // COORDENADAS & GEORREFERENCIACIÓN (Validación por Municipio - González Software)
        if (name === "coordenadas" || name === "municipio") {
            const coordenadasActuales = datosEnTiempoReal.coordenadas;
            const municipioSeleccionado = datosEnTiempoReal.municipio;
            const valorLimpio = coordenadasActuales ? coordenadasActuales.trim() : "";

            // 1. Validación de campo vacío
            if (name === "coordenadas" && valorLimpio === "") {
                setErrors(prev => ({ ...prev, coordenadas: "Pegue las coordenadas de Google Maps" }));
                return;
            }

            if (valorLimpio !== "") {
                const regexCoords = /^-?\d+\.\d+,\s*-?\d+\.\d+$/;

                if (!regexCoords.test(valorLimpio)) {
                    setErrors(prev => ({ ...prev, coordenadas: "Formato inválido. Use: 8.123, -70.123" }));
                    return;
                }

                // 2. NUEVA VALIDACIÓN: Verificar si las coordenadas ya existen en otros predios
                const coordYaRegistrada = listaPredios.some(p => {
                    // Aseguramos comparar strings limpiando espacios
                    return String(p.coordenadas || "").trim() === valorLimpio;
                });

                if (coordYaRegistrada) {
                    setErrors(prev => ({ ...prev, coordenadas: "Estas coordenadas ya pertenecen a un predio registrado." }));
                    return;
                }

                // 3. Validación geográfica (Existente)
                const partes = valorLimpio.split(",");
                const lat = parseFloat(partes[0].trim());
                const lng = parseFloat(partes[1].trim());

                if (!municipioSeleccionado) {
                    setErrors(prev => ({ ...prev, coordenadas: "Seleccione primero un Municipio para verificar los límites." }));
                    return;
                }

                const poligono = POLIGONOS_MUNICIPIOS[municipioSeleccionado];
                if (poligono) {
                    const estaAdentro = comprobarPuntoEnPoligono([lng, lat], poligono);

                    if (!estaAdentro) {
                        setErrors(prev => ({
                            ...prev,
                            municipio: name === "municipio" && value === "" ? "Este campo es obligatorio" : "",
                            coordenadas: `Las coordenadas no corresponden geográficamente al Municipio ${municipioSeleccionado}.`
                        }));
                        return;
                    } else {
                        // Todo correcto: Limpiamos errores
                        setErrors(prev => ({ ...prev, coordenadas: "", municipio: "" }));
                    }
                }
            }
        }
        // Municipio y Parroquia (Obligatorios)
        if (name === "municipio" || name === "parroquia") {
            if (value === "") mensaje = "Este campo es obligatorio";
        }

        // --- SECCIÓN III: IDENTIFICACIÓN DEL PREDIO ---

        // Nombre del Predio
        if (name === "nombre_predio") {
            if (value.trim() === "") {
                mensaje = "El nombre del predio es obligatorio";
            } else if (value.length < 3) {
                mensaje = "Nombre demasiado corto";
            } else if (value.length > 50) {
                mensaje = "Máximo 50 caracteres";
            }
        }

        // Dirección (Detalle de cómo llegar o referencia)
        if (name === "direccion") {
            if (value.trim() === "") {
                mensaje = "La dirección es necesaria para la ubicación física";
            } else if (value.length < 10) {
                mensaje = "Por favor, sea más específico (mín. 10 caracteres)";
            }
        }

        // Superficie (Numérica y mayor a cero)
        if (name === "superficie") {
            const valorNum = parseFloat(value);
            if (value === "") {
                mensaje = "Indique las hectáreas";
            } else if (isNaN(valorNum) || valorNum <= 0) {
                mensaje = "Debe ser un número mayor a 0";
            }
        }

        // Tipo de Propiedad
        if (name === "tipo_propiedad") {
            if (value === "") {
                mensaje = "Seleccione el tipo de propiedad";
            }
        }

        if (name === "vialidad") {
            if (value === "") {
                mensaje = "Debe calificar el estado de la vía de acceso";
            }
        }

        // Validación para los campos de infraestructura: Solo enteros positivos
        const validarInfraestructura = (valor) => {
            if (valor === "") return ""; // Permitimos vacío para que el usuario pueda borrar

            // Regex que verifica que SOLO haya números del inicio al fin
            const soloNumerosEnteros = /^\d+$/;

            if (!soloNumerosEnteros.test(valor)) {
                return "Solo se permiten números enteros";
            }

            return "";
        };

        // --- SECCIÓN VII: MODELO DE PRODUCCIÓN ---

        if (name === "tipo_explotacion") {
            if (value === "") {
                mensaje = "Seleccione el tipo de explotación";
            }
        }

        setErrors(prev => ({ ...prev, [name]: mensaje }));
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        // Actualizamos el dato de forma normal
        setFormData(prev => {
            const nuevoEstado = { ...prev, [name]: value };
            if (name === "municipio") nuevoEstado.parroquia = "";
            return nuevoEstado;
        });

        // Validamos en tiempo real
        validarCampoProductor(name, value);
    };
    //-----------------------------------------------------------------------------------------------


    //GRÁFICOS
    const datosGrafico = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        // Agrupamos: { "Barinas": 5, "Obispos": 2, ... }
        const conteo = listaPredios.reduce((acc, p) => {
            const muni = p.municipio || "Otros";
            acc[muni] = (acc[muni] || 0) + 1;
            return acc;
        }, {});

        // Formateamos para Recharts y ordenamos por cantidad
        return Object.entries(conteo)
            .map(([name, cantidad]) => ({ name, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 6); // Mostramos solo los 6 principales para no saturar
    }, [listaPredios]);

    const datosTenencia = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        const conteo = listaPredios.reduce((acc, p) => {
            const tipo = p.tenencia || "No definido";
            acc[tipo] = (acc[tipo] || 0) + 1;
            return acc;
        }, {});

        // Definimos una paleta de colores verdes y tierras para el sector agro
        const COLORES = ['#136442', '#28a745', '#8bc34a', '#aed581', '#dcedc8', '#558b2f'];

        return Object.entries(conteo).map(([name, value], index) => ({
            name,
            value,
            color: COLORES[index % COLORES.length]
        }));
    }, [listaPredios]);

    const datosServicios = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        const serviciosLabels = ["Agua", "Electricidad", "Gas", "Internet", "Teléfono", "Transporte"];
        const totalPredios = listaPredios.length;

        // 1. Inicializamos contadores en 0
        const conteo = {
            Agua: 0,
            Electricidad: 0,
            Gas: 0,
            Internet: 0,
            Teléfono: 0,
            Transporte: 0
        };

        // 2. Recorremos los predios
        listaPredios.forEach(p => {
            // Usamos 'servicios_lectura' que es el campo que devuelve los nombres desde Django
            const misServicios = p.servicios_lectura || [];

            if (Array.isArray(misServicios)) {
                misServicios.forEach(s => {
                    // Verificamos que el servicio exista en nuestro objeto de conteo
                    if (conteo.hasOwnProperty(s)) {
                        conteo[s]++;
                    }
                });
            }
        });

        // 3. Convertimos a formato Radar (Escala 0 a 100)
        return serviciosLabels.map(s => ({
            subject: s,
            // Calculamos el porcentaje de cobertura en Barinas
            A: totalPredios > 0 ? (conteo[s] / totalPredios) * 100 : 0,
            fullMark: 100
        }));
    }, [listaPredios]);

    const datosVialidad = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        // Definimos las categorías que tú manejas en el formulario
        const categorias = ["Excelente", "Bueno", "Regular", "Malo"];

        const conteo = {
            Excelente: 0,
            Bueno: 0,
            Regular: 0,
            Malo: 0
        };

        listaPredios.forEach(p => {
            if (conteo.hasOwnProperty(p.vialidad)) {
                conteo[p.vialidad]++;
            }
        });

        return categorias.map(cat => ({
            estado: cat,
            cantidad: conteo[cat]
        }));
    }, [listaPredios]);

    const datosIntensidad = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        const municipiosMap = {};

        listaPredios.forEach(p => {
            const mun = p.municipio || "Otros";
            // Obtenemos el valor de la base de datos
            const tipo = p.produccion?.tipo_explotacion || "No Definido";

            if (!municipiosMap[mun]) {
                // Asegúrate de que las claves coincidan exactamente con el string de la DB
                municipiosMap[mun] = {
                    municipio: mun,
                    "Intensivo": 0,
                    "Semi Intensivo": 0, // Cambiado de "Semi-Intensivo" a "Semi Intensivo"
                    "Extensivo": 0
                };
            }

            // Si la clave existe en el objeto, incrementamos
            if (municipiosMap[mun].hasOwnProperty(tipo)) {
                municipiosMap[mun][tipo]++;
            }
        });

        return Object.values(municipiosMap);
    }, [listaPredios]);

    const datosDispersion = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        return listaPredios.map(p => {
            // 1. Extraemos la infraestructura del objeto anidado que envía tu PredioSerializer
            const infra = p.infraestructura || {};

            // 2. Sumamos TODOS los campos que definiste en tu modelo Infraestructura
            const totalInfra =
                (infra.corrales || 0) +
                (infra.galpones || 0) +
                (infra.vaqueras || 0) +
                (infra.cochineras || 0) +
                (infra.silos || 0) +
                (infra.caballerizas || 0) +
                (infra.feedlot || 0) +
                (infra.lagunas || 0) +
                (infra.salas_ordeno || 0) +
                (infra.queseras || 0) +
                (infra.casas || 0) +
                (infra.trapiches || 0) +
                (infra.establos || 0);

            return {
                nombre: p.nombre_predio,
                // 3. CAMBIO CLAVE: Usamos 'superficie' (como dice tu modelo)
                superficie: parseFloat(p.superficie) || 0,
                infraestructura: totalInfra,
                municipio: p.municipio
            };
        });
    }, [listaPredios]);

    const datosDigitalizacion = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        const total = listaPredios.length;

        // Extraemos la data de la relación 'produccion' definida en tu Serializer
        const cuenta = {
            sanitario: listaPredios.filter(p => p.produccion?.registro_sanitario).length,
            productivo: listaPredios.filter(p => p.produccion?.registro_productivo).length,
            reproductivo: listaPredios.filter(p => p.produccion?.registro_reproductivo).length,
            financiero: listaPredios.filter(p => p.produccion?.registro_financiero).length,
        };

        return [
            { name: 'Sanitario', value: (cuenta.sanitario / total) * 100, fill: '#136442' },
            { name: 'Productivo', value: (cuenta.productivo / total) * 100, fill: '#2d8a5c' },
            { name: 'Reproductivo', value: (cuenta.reproductivo / total) * 100, fill: '#52b788' },
            { name: 'Financiero', value: (cuenta.financiero / total) * 100, fill: '#95d5b2' },
        ];
    }, [listaPredios]);

    const datosLegales = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        // Agrupamos la superficie (hectáreas) usando los nombres reales del modelo: 'tenencia' y 'superficie'
        const agrupado = listaPredios.reduce((acc, p) => {
            // Usamos 'tenencia' que es el campo en tu modelo Predio
            const estatus = p.tenencia || "Otros";
            // Usamos 'superficie' que es el campo DecimalField en tu modelo
            const hectareas = parseFloat(p.superficie) || 0;

            acc[estatus] = (acc[estatus] || 0) + hectareas;
            return acc;
        }, {});

        const totalHectareas = Object.values(agrupado).reduce((sum, val) => sum + val, 0);

        return [{
            name: 'Estatus Legal',
            children: Object.entries(agrupado).map(([name, total]) => ({
                name,
                size: total,
                porcentaje: totalHectareas > 0 ? ((total / totalHectareas) * 100).toFixed(2) : 0
            }))
        }];
    }, [listaPredios]);

    //-------------------------------------------------------------------------------------------------

    //Función desactivar Botón
    const esFormularioValido = () => {
        // 1. Que no existan mensajes de error en el estado
        const sinErrores = Object.values(errors).every(error => error === "");

        // 2. Que los campos críticos tengan datos
        const camposObligatorios =
            formData.productor_nombre.trim() !== "" &&
            formData.productor_cedula.trim() !== "" &&
            formData.municipio !== "" &&
            formData.parroquia !== "" &&
            formData.coordenadas.trim() !== "" &&
            formData.nombre_predio.trim() !== "" &&
            formData.superficie !== "" &&
            formData.tipo_propiedad !== "" &&
            formData.vialidad !== "" &&
            formData.tipo_explotacion !== "";

        return sinErrores && camposObligatorios;
    };


    // Obtenemos una lista de los municipios que ya tienen al menos un predio registrado
    const municipiosConRegistros = [...new Set(listaPredios.map(p => p.municipio))];

    // Contamos cuántos hay
    const totalMunicipiosBarinas = MUNICIPIOS.length; // Esto dará 12
    const cantidadCubiertos = municipiosConRegistros.length;

    useEffect(() => {
        const data = sessionStorage.getItem("usuario_predios");
        if (!data) {
            navigate("/predios/login");
        } else {
            setUsuario(JSON.parse(data));
            // CARGA LOS DATOS AQUÍ APENAS INICIA
            obtenerHistorial();
        }
    }, [navigate]);

    // ── AQUÍ VAN LAS FUNCIONES ──

    const [cargando, setCargando] = useState(true);

    const obtenerHistorial = async () => {
        setCargando(true); // Empieza a cargar
        try {
            const response = await fetch('http://127.0.0.1:8000/api/predios/');
            const data = await response.json();
            console.log("Datos brutos del servidor:", data);
            setListaPredios(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargando(false); // Terminó (con éxito o error)
        }
    };

    const [busqueda, setBusqueda] = useState("");

    // Filtramos la lista en tiempo real según el nombre del predio o del productor
    const prediosFiltrados = listaPredios.filter((p) => {
        const term = busqueda.toLowerCase();
        const nombrePredio = p.nombre_predio?.toLowerCase() || "";
        const nombreProductor = p.productor?.nombre?.toLowerCase() || "";

        return nombrePredio.includes(term) || nombreProductor.includes(term);
    });

    const [predioSeleccionado, setPredioSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    // Función para abrir el detalle
    const manejarVerDetalles = (predio) => {
        setPredioSeleccionado(predio);
        setMostrarModal(true);
    };

    const [editando, setEditando] = useState(false);
    // Estado para feedback visual de carga
    const [cargandoAccion, setCargandoAccion] = useState(false);

    const estiloInput = {
        width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #136442",
        fontSize: "14px", marginTop: "5px", outline: "none"
    };

    const estiloP = { margin: "5px 0", fontSize: "14px", color: "#333" };

    const estiloBoton = {
        padding: "10px 18px", color: "#fff", border: "none", borderRadius: "8px",
        cursor: "pointer", fontWeight: "bold", fontSize: "11px", transition: "opacity 0.2s"
    };

    // Handlers de Actualización Visual (Tiempo Real en el Modal)
    const actualizarProductor = (campo, valor) => {
        // 1. Actualizamos el estado de la interfaz
        setPredioSeleccionado(prev => ({
            ...prev,
            productor: { ...prev.productor, [campo]: valor }
        }));

        // 2. Definimos el mapeo para que coincida con tus validaciones (productor_nombre, productor_cedula, etc.)
        const mapaValidacion = {
            nombre: "productor_nombre",
            cedula_rif: "productor_cedula",
            telefono: "productor_telefono",
            correo: "productor_correo"
        };

        // 3. Ejecutamos la validación solo si el campo es uno de los que validamos
        if (mapaValidacion[campo]) {
            validarCampoProductor(mapaValidacion[campo], valor);
        }
    };

    const actualizarPredio = (campo, valor) => {
        // Definimos qué campos tienen prohibido cambiar
        const camposInmutables = ['municipio', 'parroquia', 'comunidad', 'coordenadas', 'centro_poblado'];

        // Si el campo que intentan editar está en la lista negra, simplemente retornamos (no hacemos nada)
        if (camposInmutables.includes(campo)) {
            console.warn(`Intento de edición bloqueado: ${campo} es inmutable.`);
            return;
        }

        // Si es un campo permitido, actualizamos el estado normalmente
        setPredioSeleccionado(prev => ({
            ...prev,
            [campo]: valor
        }));

        // Aquí mantienes tu lógica de validación para los otros campos que SÍ son editables
        if (errors[campo]) {
            validarCampoPredio(campo, valor);
        }
    };

    const actualizarInfraestructura = (campo, valor) => {
        setPredioSeleccionado(prev => ({ ...prev, infraestructura: { ...prev.infraestructura, [campo]: parseInt(valor) || 0 } }));
    };

    const actualizarProduccion = (campo, valor) => {
        setPredioSeleccionado(prev => ({ ...prev, produccion: { ...prev.produccion, [campo]: valor } }));
    };

    // ── ACCIONES REALES API ──

    const guardarCambiosReal = async () => {
        setCargandoAccion(true);

        try {
            // 1. Clonamos el objeto para no modificar el estado original
            const data = JSON.parse(JSON.stringify(predioSeleccionado));

            // 2. Función para limpiar objetos anidados (quitar IDs y campos de solo lectura)
            const limpiar = (obj) => {
                if (!obj || typeof obj !== 'object') return obj;
                delete obj.id; // Elimina el ID que Django a veces rechaza en PATCH anidados
                delete obj.fecha_registro; // Elimina campos que suelen ser solo lectura
                return obj;
            };

            // 3. Limpiamos cada sección
            data.productor = limpiar(data.productor);
            data.infraestructura = limpiar(data.infraestructura);
            data.produccion = limpiar(data.produccion);
            data.existencia_animal = limpiar(data.existencia_animal);
            data.maquinaria = limpiar(data.maquinaria);

            // 4. Limpiamos el objeto principal
            delete data.id_predio;
            delete data.fecha_registro;

            console.log("Enviando a Django (formato diccionario):", data);

            const response = await fetch(`http://127.0.0.1:8000/api/predios/${predioSeleccionado.id_predio}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const resultado = await response.json();

            if (response.ok) {
                Swal.fire('¡Actualización Exitosa!', 'El predio ha sido guardado.', 'success');
            } else {
                console.error("Error detallado:", resultado);
                Swal.fire('Error', JSON.stringify(resultado), 'error');
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargandoAccion(false);
        }
    };

    // 2. ELIMINAR DEFINITIVO (DELETE)
    const eliminarDefinitivoReal = async () => {
        // Alerta de confirmación previa
        const resultado = await Swal.fire({
            title: '¿ESTÁS SEGURO?',
            text: `Esta acción eliminará permanentemente el predio "${predioSeleccionado.nombre_predio}" de la base de datos.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ce3a3a',
            cancelButtonColor: '#cdced0',
            confirmButtonText: 'Sí, eliminar permanentemente',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            didOpen: () => {
                const popup = Swal.getPopup();
                if (popup) popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
            }
        });

        if (!resultado.isConfirmed) return;

        // 1. ANIMACIÓN DE CARGA INICIAL
        Swal.fire({
            title: 'Eliminando...',
            text: 'Procesando la eliminación del predio, por favor espere un momento.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                const popup = Swal.getPopup();
                if (popup) popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
            }
        });

        setCargandoAccion(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/predios/${predioSeleccionado.id_predio}/`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Alerta de Éxito con recarga
                Swal.fire({
                    title: '¡Eliminación Exitosa!',
                    text: 'El predio ha sido eliminado con éxito en el sistema.',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                    confirmButtonText: 'Aceptar',
                    didOpen: () => {
                        const popup = Swal.getPopup();
                        if (popup) popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload(); // Recarga la página después de aceptar
                    }
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor, verifique los permisos del sistema.',
                    icon: 'error',
                    confirmButtonColor: '#ce3a3a',
                    confirmButtonText: 'Entendido',
                    didOpen: () => {
                        const popup = Swal.getPopup();
                        if (popup) popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
                    }
                });
            }
        } catch (error) {
            console.error("Error Red:", error);
            Swal.fire({
                title: 'Error de Red',
                text: 'No se pudo conectar con el servidor para procesar la eliminación.',
                icon: 'error',
                confirmButtonColor: '#d32f2f',
                confirmButtonText: 'Entendido',
                didOpen: () => {
                    const popup = Swal.getPopup();
                    if (popup) popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
                }
            });
        } finally {
            setCargandoAccion(false);
        }
    };
    // ── MANEJADORES DE EVENTOS (SIN RETRASOS NI ESTADOS PEGADOS) ──────────────────────────────


    const manejarCambioTab = (tab) => {

        setTabActiva(tab);
    };

    const manejarChecklist = (item) => {
        setFormData(prev => {
            const existe = prev.servicios.includes(item);
            return {
                ...prev,
                servicios: existe
                    ? prev.servicios.filter(s => s !== item)
                    : [...prev.servicios, item]
            };
        });
    };

    const manejarInfra = (key, e) => {
        // Obtenemos el valor directamente del evento e
        const valorOriginal = e.target.value;

        // Filtramos: solo dejamos los números
        const valorLimpio = valorOriginal.replace(/[^0-9]/g, "");

        // Actualizamos el estado del formulario
        setFormData(prev => ({
            ...prev,
            infraestructura: {
                ...prev.infraestructura,
                [key]: valorLimpio
            }
        }));

        // Opcional: Si quieres mostrar error si intentan meter letras
        if (valorOriginal !== valorLimpio) {
            setErrors(prev => ({
                ...prev,
                [`infra_${key}`]: "Solo se permiten números"
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                [`infra_${key}`]: ""
            }));
        }
    };

    const guardarEnDjango = async () => {

        // 1. ANIMACIÓN DE CARGA INICIAL
        Swal.fire({
            title: 'Procesando...',
            text: 'Guardando datos en el servidor, por favor espere un momento.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                const popup = Swal.getPopup();
                if (popup) popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
            }
        });

        try {
            // 1. Limpieza y formateo del teléfono del productor
            const numeroLimpio = formData.productor_telefono ? formData.productor_telefono.replace(/\D/g, '') : '';
            const telefonoFormateado = numeroLimpio ? `58${numeroLimpio}` : '';

            // 2. Acoplamiento correcto del prefijo a la Cédula (V- o E-)
            const cedulaCompleta = formData.productor_cedula ? `${prefijoCedula}${formData.productor_cedula.trim()}` : '';

            // 3. Validación de consistencia para el arreglo de servicios
            const serviciosFormateados = Array.isArray(formData.servicios) ? formData.servicios : [];

            // 4. SANITIZACIÓN DE INFRAESTRUCTURA: Convertir strings numéricos a Integers puros para DRF
            const infraestructuraSanitizada = {};
            if (formData.infraestructura) {
                Object.keys(formData.infraestructura).forEach((key) => {
                    const valor = formData.infraestructura[key];
                    // Convertimos a entero base 10 de forma segura. Si está vacío o no es un número, pasa a 0.
                    infraestructuraSanitizada[key] = valor !== "" ? parseInt(valor, 10) : 0;
                    if (isNaN(infraestructuraSanitizada[key])) {
                        infraestructuraSanitizada[key] = 0;
                    }
                });
            }

            // 5. Asegurar un arreglo seguro para los sistemas de registro de producción
            const sistemasReg = Array.isArray(formData.sistemas_registro) ? formData.sistemas_registro : [];

            // 6. Construcción del payload final procesado
            const payload = {
                // Datos del Productor formalizados
                productor: {
                    cedula_rif: cedulaCompleta,
                    nombre: formData.productor_nombre?.trim(),
                    telefono: telefonoFormateado,
                    correo: formData.productor_correo?.trim() || null // Si está vacío lo manda como null
                },

                // Datos base del Predio (Campos nativos)
                nombre_predio: formData.nombre_predio?.trim(),
                municipio: formData.municipio,
                parroquia: formData.parroquia,
                comunidad: formData.comunidad?.trim(),
                centro_poblado: formData.centro_poblado?.trim(),
                direccion: formData.direccion?.trim(),
                superficie: formData.superficie !== "" ? parseFloat(formData.superficie) : 0,
                coordenadas: formData.coordenadas?.trim() || null,
                tipo_propiedad: formData.tipo_propiedad,
                tenencia: formData.tenencia,
                vialidad: formData.vialidad,
                servicios: serviciosFormateados,

                // Bloques relacionales limpios y tipados correctamente
                infraestructura: infraestructuraSanitizada,

                produccion: {
                    tipo_explotacion: formData.tipo_explotacion,
                    registro_sanitario: sistemasReg.includes("Sanitario"),
                    registro_productivo: sistemasReg.includes("Productivo"),
                    registro_reproductivo: sistemasReg.includes("Reproductivo"),
                    registro_financiero: sistemasReg.includes("Financiero")
                },

                // Datos complementarios obligatorios por estructura de serializers
                rubros_vegetales: formData.rubros_vegetales || [],
                existencia_animal: formData.existencia_animal || {},
                maquinaria: formData.maquinaria || {}
            };

            console.log("Payload que se envía al servidor:", JSON.stringify(payload, null, 2));

            // 7. Despacho de la petición HTTP
            const response = await fetch('http://127.0.0.1:8000/api/predios/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Descomentar de ser necesario más adelante
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Registro Exitoso!',
                    text: 'El predio ha sido registrado con éxito en el sistema.',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                    confirmButtonText: 'Aceptar',
                    didOpen: () => {
                        const popup = Swal.getPopup();
                        if (popup) popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
                    }
                }).then((result) => {
                    // Esta función se ejecuta cuando el usuario hace clic en "Aceptar"
                    if (result.isConfirmed) {
                        window.location.reload(); // Recarga la página automáticamente
                    }
                });
            } else {
                // Extracción detallada de errores devueltos por los serializadores de Django
                const errorData = await response.json();
                console.error("Errores de validación de Django:", errorData);
                // ── AGREGA ESTA LÍNEA PARA VER AL CULPABLE DIRECTAMENTE ──
                console.dir(errorData.productor);

                Swal.fire({
                    title: 'Error al guardar',
                    text: 'Por favor, verifique los datos introducidos e intente nuevamente.',
                    icon: 'error',
                    confirmButtonColor: '#d32f2f',
                    confirmButtonText: 'Entendido',
                    didOpen: () => {
                        const popup = Swal.getPopup();
                        if (popup) {
                            popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
                        }
                    }
                });
            }
        } catch (error) {
            console.error("Error de red:", error);
            // Cerramos el loading y mostramos error de red
            Swal.fire({
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor.',
                icon: 'error'
            });
        }
    };
    const cerrarSesion = () => {
        sessionStorage.removeItem("usuario_predios");
        navigate("/predios/login");
    };

    if (!usuario) return null;

    return (
        <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Poppins', sans-serif" }}>

            {/* Importación de Poppins Global */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

            {/* ── SIDEBAR REDISEÑADO ── */}
            <aside style={sidebarContainerStyle}>

                {/* Encabezado: Info del Usuario */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "15px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: "18px",
                    marginBottom: "25px"
                }}>
                    <div style={avatarWrapper}>
                        <img
                            src={
                                usuario.foto ||
                                `https://ui-avatars.com/api/?name=${usuario.nombre}&background=136442&color=ffffff&bold=true`
                            }
                            alt="Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                        <span style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            {usuario.nombre}
                        </span>

                        <span style={{
                            fontSize: "11px",
                            color: "#86efac"
                        }}>
                            {usuario.rol || "Analista"}
                        </span>
                    </div>
                </div>

                {/* Navegación */}
                <nav style={{ flex: 1 }}>
                    <MenuItem
                        label="Inicio"
                        active={tabActiva === "inicio"}
                        onClick={() => manejarCambioTab("inicio")}
                        icon={<IconInicio />}
                    />

                    <MenuItem
                        label="Registro"
                        active={tabActiva === "predios"}
                        onClick={() => manejarCambioTab("predios")}
                        icon={<IconRegistro />}
                    />

                    <MenuItem
                        label="Historial"
                        active={tabActiva === "historial"}
                        onClick={() => manejarCambioTab("historial")}
                        icon={<IconHistorial />}
                    />

                    <MenuItem
                        label="Mapa de Predios"
                        active={tabActiva === "mapa"}
                        onClick={() => manejarCambioTab("mapa")}
                        icon={<IconMapa />}
                    />

                    <MenuItem
                        label="Reportes"
                        active={tabActiva === "reportes"}
                        onClick={() => manejarCambioTab("reportes")}
                        icon={<IconReportes />}
                    />
                </nav>

                {/* Botón cerrar sesión */}
                <button onClick={cerrarSesion} style={logoutButtonStyle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        style={{ marginRight: "8px" }}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Cerrar Sesión
                </button>

            </aside>

            {/* ── CONTENIDO PRINCIPAL ── */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <header style={{
                    ...headerContainerStyle,
                    justifyContent: "space-between", // Empuja el logo a la derecha
                    paddingRight: "40px"             // Espaciado lateral
                }}>
                    <div>
                        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                            {tabActiva === "inicio" ? "Dashboard de Gestión" : tabActiva === "mapa" ? "Georreferenciación" : "Ficha Técnica de Censo"}
                        </h2>
                        <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Estado Barinas • Sector Agropecuario</p>
                    </div>

                    {/* --- LOGO MPPAT / ESCUDO --- */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                            src={escudo}
                            alt="Logo MPPAT"
                            style={logoDerechoStyle}
                        />
                    </div>
                </header>

                <section style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
                    {guardadoExitoso && <div style={alertStyle}>¡Registro sincronizado con éxito!</div>}

                    {tabActiva === "inicio" && (

                        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

                            {/* ── CARDS PRINCIPALES ── */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                gap: "24px",
                                marginBottom: "30px"
                            }}>
                                <CardStat
                                    label="Predios Censados"
                                    value={cargando ? <Spinner /> : listaPredios.length}
                                    color="#136442"
                                />

                                <CardStat
                                    label="Superficie Total"
                                    value={cargando ? <Spinner /> : `${listaPredios.reduce((acc, p) => acc + parseFloat(p.superficie || 0), 0).toLocaleString()} Ha`}
                                    color="#136442"
                                />

                                <CardStat
                                    label="Municipios Cubiertos"
                                    value={cargando ? <Spinner /> : `${cantidadCubiertos} / ${totalMunicipiosBarinas}`}
                                    color="#136442"
                                />
                            </div>

                            {/* ── GRÁFICOS ── */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                                gap: "20px"
                            }}>

                                {/* Gráfico 1 - Barras */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Predios por Municipio</h3>
                                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                                        {listaPredios.length === 0 ? (
                                            <div style={{ ...chartPlaceholder, border: 'none' }}>
                                                <p style={{ color: '#999' }}>No hay datos para mostrar</p>
                                            </div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={datosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                    <XAxis
                                                        dataKey="name"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#666', fontSize: 11, fontWeight: 500 }}
                                                    />
                                                    <YAxis
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#666', fontSize: 11 }}
                                                        allowDecimals={false}
                                                        dx={-10}
                                                        // ESTO ES LO QUE BUSCAS:
                                                        // 'dataMax' hace que el tope sea el valor más alto que tengas (ej. 1)
                                                        // + 0.2 es para dejar un mini respiro y que no se corte el borde redondeado
                                                        domain={[0, dataMax => (dataMax <= 1 ? 1 : dataMax + 1)]}
                                                    />
                                                    <Tooltip
                                                        cursor={{ fill: 'rgba(19, 100, 66, 0.05)' }}
                                                        contentStyle={{
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                            fontSize: '12px'
                                                        }}
                                                        itemStyle={{ color: '#136442', fontWeight: 'bold' }}
                                                    />
                                                    <Bar
                                                        dataKey="cantidad"
                                                        radius={[6, 6, 0, 0]}
                                                        barSize={35}
                                                    >
                                                        {datosGrafico.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={index === 0 ? '#136442' : '#4CAF50'}
                                                                fillOpacity={0.8 + (index * -0.1)} // Degradado visual sutil
                                                            />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                </div>

                                {/* Gráfico 2 - Circular */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Estatus Legal de la Tierra</h3>
                                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                                        {listaPredios.length === 0 ? (
                                            <div style={chartPlaceholder}>Sin datos de tenencia</div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={datosTenencia}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60} // Esto lo convierte en Dona
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        animationDuration={1000}
                                                    >
                                                        {datosTenencia.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                    <Legend
                                                        verticalAlign="bottom"
                                                        height={36}
                                                        iconType="circle"
                                                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                </div>

                                {/* Gráfico 3 - Línea */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Cobertura de Servicios Básicos (%)</h3>
                                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                                        {listaPredios.length === 0 ? (
                                            <div style={chartPlaceholder}>Sin datos de servicios</div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={datosServicios}>
                                                    <PolarGrid stroke="#e0e0e0" />
                                                    <PolarAngleAxis
                                                        dataKey="subject"
                                                        tick={{ fill: '#666', fontSize: 11, fontWeight: 'bold' }}
                                                    />
                                                    <PolarRadiusAxis
                                                        angle={30}
                                                        domain={[0, 100]}
                                                        tick={{ fontSize: 10 }}
                                                        axisLine={false}
                                                    />
                                                    <Radar
                                                        name="Cobertura"
                                                        dataKey="A"
                                                        stroke="#136442"
                                                        fill="#136442"
                                                        fillOpacity={0.5}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                        formatter={(value) => [`${value.toFixed(1)}%`, "Cobertura"]}
                                                    />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                </div>

                                {/* Gráfico 4 - Vialidad */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Estado de la Vialidad</h3>
                                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                                        {listaPredios.length === 0 ? (
                                            <div style={chartPlaceholder}>Sin datos de vialidad</div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    layout="vertical" // Esto lo hace horizontal
                                                    data={datosVialidad}
                                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                                    <XAxis type="number" hide />
                                                    <YAxis
                                                        dataKey="estado"
                                                        type="category"
                                                        tick={{ fontSize: 12, fontWeight: 'bold' }}
                                                        width={80}
                                                    />
                                                    <Tooltip
                                                        cursor={{ fill: 'transparent' }}
                                                        contentStyle={{ borderRadius: '10px' }}
                                                    />
                                                    <Bar dataKey="cantidad" radius={[0, 5, 5, 0]} barSize={30}>
                                                        {datosVialidad.map((entry, index) => {
                                                            // Colores según el estado
                                                            const colors = {
                                                                Excelente: '#0d5437', // Verde Oscuro (el mismo del Radar)
                                                                Bueno: '#338261',     // Verde Esmeralda
                                                                Regular: '#82ca9d',    // Verde Suave
                                                                Malo: '#c8e6c9'        // Verde Muy Claro (Pastel)
                                                            };
                                                            return <Cell key={`cell-${index}`} fill={colors[entry.estado] || '#8884d8'} />;
                                                        })}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                </div>

                                {/*Grafico 5*/}

                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Intensidad de Producción por Municipio</h3>
                                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                                        {listaPredios.length === 0 ? (
                                            <div style={{ ...chartPlaceholder, border: 'none' }}>
                                                <p style={{ color: '#999' }}>No hay datos para mostrar</p>
                                            </div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={datosIntensidad}
                                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                    <XAxis
                                                        dataKey="municipio"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#666', fontSize: 11, fontWeight: 500 }}
                                                    />
                                                    <YAxis
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#666', fontSize: 11 }}
                                                        allowDecimals={false}
                                                        dx={-10}
                                                        domain={[0, dataMax => (dataMax <= 1 ? 1 : dataMax + 0.5)]}
                                                    />
                                                    <Tooltip
                                                        cursor={{ fill: 'rgba(19, 100, 66, 0.05)' }}
                                                        contentStyle={{
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                            fontSize: '12px'
                                                        }}
                                                    />
                                                    <Legend
                                                        verticalAlign="top"
                                                        align="right"
                                                        iconType="circle"
                                                        wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                                                    />

                                                    {/* Al añadir stackId="a" a todas, Recharts las une en una sola barra por municipio */}
                                                    <Bar
                                                        dataKey="Intensivo"
                                                        fill="#136442"
                                                        barSize={35}
                                                        radius={[6, 6, 6, 6]}
                                                    />
                                                    <Bar
                                                        dataKey="Semi Intensivo"
                                                        fill="#4CAF50"
                                                        barSize={35}
                                                        radius={[6, 6, 6, 6]}
                                                    />
                                                    <Bar
                                                        dataKey="Extensivo"
                                                        fill="#82ca9d"
                                                        barSize={35}
                                                        radius={[6, 6, 6, 6]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                </div>

                                {/* Gráfico 6 - Dispersión: Superficie vs Infraestructura */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Relación Superficie vs. Infraestructura</h3>
                                    <div style={{ width: '100%', height: 350, marginTop: '20px' }}>
                                        {listaPredios.length === 0 ? (
                                            <div style={{ ...chartPlaceholder, border: 'none' }}>
                                                <p style={{ color: '#999' }}>No hay datos para mostrar</p>
                                            </div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                    <XAxis
                                                        type="number"
                                                        dataKey="superficie"
                                                        name="Superficie"
                                                        unit=" Ha"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#666', fontSize: 11 }}
                                                    />
                                                    <YAxis
                                                        type="number"
                                                        dataKey="infraestructura"
                                                        name="Infraestructura"
                                                        unit=" und"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#666', fontSize: 11 }}
                                                        allowDecimals={false}
                                                    />
                                                    <Tooltip
                                                        cursor={{ strokeDasharray: '3 3' }}
                                                        contentStyle={{
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                            fontSize: '12px'
                                                        }}
                                                    />
                                                    <Scatter
                                                        name="Predios"
                                                        data={datosDispersion}
                                                        fill="#136442"
                                                        fillOpacity={0.6}
                                                    />
                                                </ScatterChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                </div>

                                {/* Gráfico de Sistemas de Registro - Ajustado */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Sistemas de Registro Adoptados</h3>
                                    <div style={{ width: '100%', height: 350, marginTop: '10px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadialBarChart
                                                cx="40%"
                                                cy="50%"
                                                innerRadius="20%"  // Más pequeño el centro para dar más espacio a los anillos
                                                outerRadius="90%"
                                                barSize={20}       // Barras un poco más gruesas para que se note el color
                                                data={datosDigitalizacion}
                                                startAngle={90}    // Comienza arriba
                                                endAngle={-270}   // Da la vuelta completa
                                            >
                                                <RadialBar
                                                    minAngle={15}
                                                    background={{ fill: '#f0f0f0' }}
                                                    clockWise
                                                    dataKey="value"
                                                    radius={[10, 10, 10, 10]}
                                                >
                                                    {
                                                        datosDigitalizacion.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={[
                                                                '#064e3b', // Sanitario
                                                                '#059669', // Productivo
                                                                '#34d399', // Reproductivo
                                                                '#a7f3d0'  // Financiero
                                                            ][index]} />
                                                        ))
                                                    }
                                                </RadialBar>

                                                <Legend
                                                    iconSize={10}
                                                    layout="vertical"
                                                    verticalAlign="middle"
                                                    align="right"
                                                    wrapperStyle={{
                                                        lineHeight: '45px',
                                                        fontSize: '11px',
                                                        right: '0px',
                                                        fontWeight: 500,
                                                        color: '#666'
                                                    }}
                                                />

                                                <Tooltip
                                                    formatter={(value, name, props) => [
                                                        `${parseFloat(value).toFixed(2)}%`,
                                                        `Registro ${props.payload.name}`
                                                    ]}
                                                    contentStyle={{
                                                        borderRadius: '12px',
                                                        border: 'none',
                                                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '-20px' }}>
                                        Grado de formalización de la producción
                                    </p>
                                </div>

                                {/* Gráfico 2 - Treemap de Tenencia de Tierras (González Software) */}
                                <div style={chartCard}>
                                    <h3 style={chartTitle}>Distribución por Tenencia (Superficie)</h3>
                                    <div style={{ width: '100%', height: 350, marginTop: '20px' }}>
                                        {listaPredios.length === 0 ? (
                                            <div style={{ ...chartPlaceholder, border: 'none' }}>
                                                <p style={{ color: '#999' }}>No hay datos de superficie en Aiven</p>
                                            </div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <Treemap
                                                    data={datosLegales}
                                                    dataKey="size"
                                                    aspectRatio={4 / 3}
                                                    stroke="#fff"
                                                    content={<CustomTreemapContent />}
                                                >
                                                    <Tooltip
                                                        contentStyle={{
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                            fontSize: '12px'
                                                        }}
                                                        formatter={(value, name, props) => [
                                                            `${value} Hectáreas (${props.payload.porcentaje}%)`,
                                                            props.payload.name
                                                        ]}
                                                    />
                                                </Treemap>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '11px', color: '#666', textAlign: 'center', marginTop: '10px' }}>
                                        Basado en el campo 'superficie' de la base de datos db-agro-barinas
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {tabActiva === "predios" && (
                        <div style={{ maxWidth: "950px", margin: "0 auto" }}>

                            <FormSection title="I. Datos del Productor">
                                <div style={grid3}>
                                    {/* Nombre Completo */}
                                    <InputField
                                        label="Nombre Completo"
                                        name="productor_nombre"
                                        value={formData.productor_nombre}
                                        onChange={manejarCambio}
                                        error={errors.productor_nombre}
                                        disabled={camposBloqueados}
                                    />

                                    {/* Cédula */}
                                    <InputField
                                        label="Cédula"
                                        name="productor_cedula"
                                        value={formData.productor_cedula}
                                        onChange={(e) => {
                                            e.target.value = e.target.value.replace(/\D/g, '');
                                            manejarCambio(e);
                                        }}
                                        error={errors.productor_cedula}
                                        disabled={camposBloqueados}
                                        maxLength={8}
                                        prefix={
                                            <select
                                                value={prefijoCedula}
                                                onChange={(e) => setPrefijoCedula(e.target.value)}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: "none",
                                                    outline: "none",
                                                    color: "#475569",
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                    padding: "0 10px",
                                                    cursor: "pointer",
                                                    height: "100%"
                                                }}
                                            >
                                                <option value="V-">V-</option>
                                                <option value="E-">E-</option>
                                            </select>
                                        }
                                    />

                                    {/* Teléfono */}
                                    <InputField
                                        label="Teléfono"
                                        name="productor_telefono"
                                        value={formData.productor_telefono}
                                        onChange={(e) => {
                                            e.target.value = e.target.value.replace(/\D/g, '');
                                            manejarCambio(e);
                                        }}
                                        error={errors.productor_telefono}
                                        disabled={camposBloqueados}
                                        maxLength={10}
                                        placeholder="4141234567"
                                        prefix={
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                padding: "0 12px",
                                                color: "#475569",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                userSelect: "none",
                                                height: "100%"
                                            }}>
                                                <span>🇻🇪</span>
                                                <span>+58</span>
                                            </div>
                                        }
                                    />

                                    {/* Correo (Columna 1) */}
                                    <InputField
                                        label="Correo (Opcional)"
                                        name="productor_correo"
                                        value={formData.productor_correo}
                                        onChange={manejarCambio}
                                        error={errors.productor_correo}
                                        disabled={camposBloqueados}
                                    />

                                    {/* Descripción y Lupa (Columnas 2 y 3 invertidas) */}
                                    <div style={{
                                        gridColumn: "span 2",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-end", // Empuja todo hacia la derecha
                                        gap: "12px",
                                        marginTop: "24px"
                                    }}>
                                        <span style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
                                            Si el productor ya se encuentra registrado, presionar la lupa para cargar sus datos.
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => verificarCedulaDuplicada(formData.productor_cedula)}
                                            disabled={camposBloqueados}
                                            title="Buscar productor"
                                            style={{
                                                padding: "8px",
                                                backgroundColor: "transparent",
                                                color: camposBloqueados ? "#cbd5e1" : "#16a34a",
                                                border: "1px solid #16a34a",
                                                borderRadius: "50%",
                                                cursor: camposBloqueados ? "not-allowed" : "pointer",
                                                height: "42px",
                                                width: "42px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "transform 0.2s"
                                            }}
                                        >
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </FormSection>

                            <FormSection title="II. Georreferenciación y Ubicación">
                                <div style={grid3}>
                                    <SelectField
                                        label="Municipio"
                                        name="municipio"
                                        options={Object.keys(PARROQUIAS_POR_MUNICIPIO)}
                                        onChange={manejarCambio}
                                        error={errors.municipio}
                                    />
                                    <SelectField
                                        label="Parroquia"
                                        name="parroquia"
                                        options={formData.municipio ? PARROQUIAS_POR_MUNICIPIO[formData.municipio] : []}
                                        onChange={manejarCambio}
                                        disabled={!formData.municipio}
                                        error={errors.parroquia}
                                    />
                                    <InputField
                                        label="Comunidad / Sector"
                                        name="comunidad"
                                        value={formData.comunidad}
                                        onChange={manejarCambio}
                                        error={errors.comunidad}
                                    />
                                    <InputField
                                        label="Centro Poblado"
                                        name="centro_poblado"
                                        value={formData.centro_poblado}
                                        onChange={manejarCambio}
                                        error={errors.centro_poblado}
                                    />

                                    <InputField
                                        label="Coordenadas (Latitud, Longitud)"
                                        name="coordenadas"
                                        value={formData.coordenadas}
                                        placeholder="Ej: 8.097364, -69.312631"
                                        onChange={manejarCambio}
                                        error={errors.coordenadas}
                                    />
                                </div>
                            </FormSection>

                            <FormSection title="III. Identificación del Predio">
                                <div style={grid3}>
                                    <InputField
                                        label="Nombre del Predio"
                                        name="nombre_predio"
                                        value={formData.nombre_predio}
                                        onChange={manejarCambio}
                                        error={errors.nombre_predio}
                                        maxLength={50}
                                    />
                                    <InputField
                                        label="Dirección"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={manejarCambio}
                                        error={errors.direccion}
                                        placeholder="Ej: Carretera vieja, entrada al lado de la escuela"
                                    />
                                    <InputField
                                        label="Superficie (Ha)"
                                        type="number"
                                        name="superficie"
                                        value={formData.superficie}
                                        onChange={manejarCambio}
                                        error={errors.superficie}
                                    />

                                    <SelectField
                                        label="Tipo de Propiedad"
                                        name="tipo_propiedad"
                                        value={formData.tipo_propiedad}
                                        options={["Público", "Privado"]}
                                        onChange={manejarCambio}
                                        error={errors.tipo_propiedad}
                                    />
                                </div>
                            </FormSection>

                            <FormSection title="IV. Tenencia de la Tierra">
                                <div style={gridCheck}>
                                    {[
                                        "Propiedad", "Ocupación", "Comunidad", "Título Supletorio",
                                        "Arrendamiento", "Adjudicación", "Concesión",
                                        "Derecho de Permanencia", "Aparcería", "Otra"
                                    ].map(t => (
                                        <label key={t} style={radioLabel}>
                                            <input
                                                type="radio"
                                                name="tenencia"
                                                value={t}
                                                checked={formData.tenencia === t}
                                                onChange={manejarCambio}
                                            /> {t}
                                        </label>
                                    ))}
                                </div>
                            </FormSection>

                            <FormSection title="V. Servicios Básicos">
                                <div style={gridCheck}>
                                    {["Agua", "Electricidad", "Gas", "Internet", "Teléfono", "Transporte"].map(s => (
                                        <label key={s} style={radioLabel}>
                                            <input
                                                type="checkbox"
                                                checked={formData.servicios.includes(s)}
                                                onChange={() => manejarChecklist(s)}
                                            /> {s}
                                        </label>
                                    ))}
                                </div>

                                <div style={{ marginTop: "20px" }}>
                                    <SelectField
                                        label="Condición de la Vialidad"
                                        name="vialidad"
                                        value={formData.vialidad} // Asegúrate de tener el value conectado
                                        options={["Excelente", "Bueno", "Regular", "Malo"]}
                                        onChange={manejarCambio}
                                        error={errors.vialidad} // <--- Feedback visual
                                    />
                                </div>
                            </FormSection>

                            <FormSection title="VI. Infraestructura">
                                <div style={grid3}>
                                    {Object.keys(formData.infraestructura).map((key) => (
                                        <InputField
                                            key={key}
                                            label={key.replace("_", " ").toUpperCase()}
                                            type="text"
                                            inputMode="numeric"
                                            value={formData.infraestructura[key] || ""} // Agregamos el || "" por seguridad
                                            onChange={(e) => manejarInfra(key, e)} // <--- Pasamos el evento 'e' completo
                                            error={errors[`infra_${key}`]}
                                            placeholder="0"
                                        />
                                    ))}
                                </div>
                            </FormSection>

                            <FormSection title="VII. Modelo de Producción">
                                <SelectField
                                    label="Tipo de Explotación"
                                    name="tipo_explotacion"
                                    value={formData.tipo_explotacion}
                                    options={["Intensivo", "Semi Intensivo", "Extensivo"]}
                                    onChange={manejarCambio}
                                    error={errors.tipo_explotacion} // <--- Vinculación del error
                                />

                                <div style={{ marginTop: "20px" }}>
                                    <p style={labelStyle}>Sistemas de Registro</p>
                                    <div style={gridCheck}>
                                        {["Sanitario", "Productivo", "Reproductivo", "Financiero"].map(s => (
                                            <label key={s} style={radioLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.sistemas_registro.includes(s)}
                                                    onChange={() => {
                                                        const existe = formData.sistemas_registro.includes(s);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            sistemas_registro: existe
                                                                ? prev.sistemas_registro.filter(i => i !== s)
                                                                : [...prev.sistemas_registro, s]
                                                        }));
                                                    }}
                                                /> {s}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </FormSection>

                            <div style={{ textAlign: "right", paddingBottom: "50px" }}>
                                <button
                                    onClick={guardarEnDjango}
                                    disabled={!esFormularioValido()} // Se desactiva si el form no es válido
                                    style={{
                                        ...btnPrincipal,
                                        backgroundColor: esFormularioValido() ? "#136442" : "#ccc", // Gris si está desactivado
                                        cursor: esFormularioValido() ? "pointer" : "not-allowed", // Cursor de bloqueo
                                        opacity: esFormularioValido() ? 1 : 0.7,
                                        boxShadow: esFormularioValido() ? "0 4px 14px rgba(19, 100, 66, 0.3)" : "none"
                                    }}
                                >
                                    Finalizar Registro
                                </button>
                            </div>
                        </div>
                    )}

                    {tabActiva === "historial" && (
                        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

                            {/* ── TÍTULO Y BUSCADOR ── */}
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

                            {/* ── TABLA DE REGISTROS ── */}
                            <div style={{
                                backgroundColor: "#fff", padding: "20px", borderRadius: "12px",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eee", overflowX: "auto"
                            }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "2px solid #136442", color: "#136442" }}>
                                            {/* Cambiado de ID a # */}
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
                                                    key={p.id_predio}
                                                    style={{
                                                        borderBottom: "1px solid #f0f0f0",
                                                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb"
                                                    }}
                                                >
                                                    {/* Aquí usamos index + 1 para el contador */}
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{index + 1}</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.nombre_predio}</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.productor?.nombre || "Sin nombre"}</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.municipio}</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.superficie} Ha</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>
                                                        <button onClick={() => manejarVerDetalles(p)} style={{ backgroundColor: "#f0fdf4", color: "#136442", border: "1px solid #136442", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                                                            Ver Detalles
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

                            {/* ── MODAL INTEGRAL DE FICHA TÉCNICA ── */}
                            {mostrarModal && predioSeleccionado && (
                                <div style={{
                                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                                    backgroundColor: "rgba(0,0,0,0.7)", display: "flex",
                                    justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "15px"
                                }}>
                                    <div style={{
                                        backgroundColor: "#fff", width: "100%", maxWidth: "950px", maxHeight: "95vh",
                                        borderRadius: "12px", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                                        display: "flex", flexDirection: "column"
                                    }}>
                                        {/* Encabezado Dinámico */}
                                        <div style={{
                                            backgroundColor: editando ? "#136442" : "#136442",
                                            padding: "18px 25px", color: "#fff", display: "flex",
                                            justifyContent: "space-between", alignItems: "center",
                                            position: "sticky", top: 0, zIndex: 10, transition: "background-color 0.3s"
                                        }}>
                                            <h3 style={{ margin: 0, fontSize: "16px" }}>
                                                {cargandoAccion ? "PROCESANDO..." : editando ? "MODO EDICIÓN ACTIVADO" : `FICHA TÉCNICA: ${predioSeleccionado.nombre_predio.toUpperCase()}`}
                                            </h3>
                                            <button onClick={() => { if (!cargandoAccion) { setMostrarModal(false); setEditando(false); } }} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "22px" }}>✕</button>
                                        </div>

                                        <div style={{ padding: "30px", opacity: cargandoAccion ? 0.5 : 1, pointerEvents: cargandoAccion ? 'none' : 'auto' }}>

                                            {/* I. DATOS DEL PRODUCTOR UNIFICADOS CON DISEÑO DE EDICIÓN */}
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px", marginBottom: "35px" }}>
                                                <div style={{ gridColumn: "span 3", borderBottom: "2px solid #136442", paddingBottom: "5px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "14px" }}>I. DATOS DEL PRODUCTOR</strong>
                                                </div>

                                                {/* NOMBRE COMPLETO */}
                                                <div>
                                                    {editando ? (
                                                        <InputField
                                                            label="Nombre Completo"
                                                            name="nombre"
                                                            value={predioSeleccionado.productor?.nombre || ""}
                                                            onChange={(e) => actualizarProductor('nombre', e.target.value)}
                                                            error={errors?.productor_nombre}
                                                        />
                                                    ) : (
                                                        <InputField
                                                            label="Nombre Completo"
                                                            name="nombre"
                                                            value={predioSeleccionado.productor?.nombre || "N/A"}
                                                            disabled
                                                        />
                                                    )}
                                                </div>

                                                {/* CÉDULA / RIF - Deshabilitado para evitar cambios */}
                                                <div>
                                                    {editando ? (
                                                        <InputField
                                                            label="Cédula / RIF"
                                                            name="productor_cedula"
                                                            value={predioSeleccionado.productor?.cedula_rif || ""}
                                                            onChange={(e) => actualizarProductor('cedula_rif', e.target.value)}
                                                            error={errors?.productor_cedula}
                                                            disabled={true} // <--- Esto inhabilita el campo
                                                            style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} // Estilo opcional para indicar que no es editable
                                                        />
                                                    ) : (
                                                        <InputField
                                                            label="Cédula / RIF"
                                                            name="productor_cedula"
                                                            value={predioSeleccionado.productor?.cedula_rif || "N/A"}
                                                            disabled
                                                        />
                                                    )}
                                                </div>

                                                {/* TELÉFONO */}
                                                <div>
                                                    {editando ? (
                                                        <InputField
                                                            label="Teléfono"
                                                            name="telefono"
                                                            value={predioSeleccionado.productor?.telefono || ""}
                                                            onChange={(e) => actualizarProductor('telefono', e.target.value)}
                                                            error={errors?.productor_telefono}
                                                        />
                                                    ) : (
                                                        <InputField
                                                            label="Teléfono"
                                                            name="telefono"
                                                            value={predioSeleccionado.productor?.telefono || "N/A"}
                                                            disabled
                                                        />
                                                    )}
                                                </div>

                                                {/* CORREO ELECTRÓNICO */}
                                                <div style={{ gridColumn: "span 3" }}>
                                                    {editando ? (
                                                        <InputField
                                                            label="Correo Electrónico"
                                                            name="correo"
                                                            value={predioSeleccionado.productor?.correo || ""}
                                                            onChange={(e) => actualizarProductor('correo', e.target.value)}
                                                            error={errors?.productor_correo}
                                                        />
                                                    ) : (
                                                        <InputField
                                                            label="Correo Electrónico"
                                                            name="correo"
                                                            value={predioSeleccionado.productor?.correo || "N/A"}
                                                            disabled
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* II. GEORREFERENCIACIÓN Y UBICACIÓN - MODO BLOQUEADO */}
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px", marginBottom: "35px" }}>
                                                <div style={{ gridColumn: "span 3", borderBottom: "2px solid #136442", paddingBottom: "5px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "14px" }}>II. GEORREFERENCIACIÓN Y UBICACIÓN</strong>
                                                </div>

                                                {/* MUNICIPIO, PARROQUIA, COMUNIDAD, COORDENADAS, CENTRO POBLADO */}
                                                {/* Todos estos campos se muestran igual tanto si es modo 'editando' o 'visualización' */}

                                                <div>
                                                    <InputField
                                                        label="Municipio"
                                                        name="municipio"
                                                        value={predioSeleccionado.municipio || "N/A"}
                                                        disabled={true} // Siempre deshabilitado
                                                    />
                                                </div>

                                                <div>
                                                    <InputField
                                                        label="Parroquia"
                                                        name="parroquia"
                                                        value={predioSeleccionado.parroquia || "N/A"}
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <InputField
                                                        label="Comunidad / Sector"
                                                        name="comunidad"
                                                        value={predioSeleccionado.comunidad || "N/A"}
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div style={{ gridColumn: "span 2" }}>
                                                    <InputField
                                                        label="Coordenadas (Latitud y Longitud)"
                                                        name="coordenadas"
                                                        value={predioSeleccionado.coordenadas || "Sin coordenadas registradas"}
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div>
                                                    <InputField
                                                        label="Centro Poblado"
                                                        name="centro_poblado"
                                                        value={predioSeleccionado.centro_poblado || "N/A"}
                                                        disabled={true}
                                                    />
                                                </div>
                                            </div>

                                            {/* III y IV. IDENTIFICACIÓN Y TENENCIA UNIFICADOS CON DISEÑO DE EDICIÓN */}
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px", marginBottom: "35px" }}>
                                                <div style={{ gridColumn: "span 3", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "14px" }}>III. IDENTIFICACIÓN Y IV. TENENCIA</strong>
                                                </div>

                                                {/* DIRECCIÓN EXACTA */}
                                                <div style={{ gridColumn: "span 2" }}>
                                                    {editando ? (
                                                        <InputField
                                                            label="Dirección Exacta"
                                                            name="direccion"
                                                            value={predioSeleccionado.direccion || ""}
                                                            onChange={(e) => actualizarPredio('direccion', e.target.value)}
                                                            error={errors?.direccion}
                                                        />
                                                    ) : (
                                                        <InputField
                                                            label="Dirección Exacta"
                                                            name="direccion"
                                                            value={predioSeleccionado.direccion || "N/A"}
                                                            disabled
                                                        />
                                                    )}
                                                </div>

                                                {/* SUPERFICIE (HA) */}
                                                <div>
                                                    {editando ? (
                                                        <InputField
                                                            label="Superficie (Ha)"
                                                            name="superficie"
                                                            type="number"
                                                            value={predioSeleccionado.superficie || ""}
                                                            onChange={(e) => actualizarPredio('superficie', e.target.value)}
                                                            error={errors?.superficie}
                                                        />
                                                    ) : (
                                                        <InputField
                                                            label="Superficie (Ha)"
                                                            name="superficie"
                                                            value={predioSeleccionado.superficie ? `${predioSeleccionado.superficie} Ha` : "N/A"}
                                                            disabled
                                                        />
                                                    )}
                                                </div>

                                                {/* TIPO DE PROPIEDAD */}
                                                <div>
                                                    {editando ? (
                                                        <>
                                                            <small style={{ color: "#888", fontWeight: "bold", display: "block", marginBottom: "4px" }}>TIPO DE PROPIEDAD</small>
                                                            <select
                                                                style={estiloInput}
                                                                value={predioSeleccionado.tipo_propiedad || ""}
                                                                onChange={(e) => actualizarPredio('tipo_propiedad', e.target.value)}
                                                            >
                                                                <option value="Público">Público</option>
                                                                <option value="Privado">Privado</option>
                                                            </select>
                                                        </>
                                                    ) : (
                                                        <InputField
                                                            label="Tipo de Propiedad"
                                                            name="tipo_propiedad"
                                                            value={predioSeleccionado.tipo_propiedad || "N/A"}
                                                            disabled
                                                        />
                                                    )}
                                                </div>

                                                {/* TENENCIA DE LA TIERRA */}
                                                <div>
                                                    {editando ? (
                                                        <InputField
                                                            label="Tenencia de la Tierra"
                                                            name="tenencia"
                                                            value={predioSeleccionado.tenencia || ""}
                                                            onChange={(e) => actualizarPredio('tenencia', e.target.value)}
                                                            error={errors?.tenencia}
                                                        />
                                                    ) : (
                                                        <InputField
                                                            label="Tenencia de la Tierra"
                                                            name="tenencia"
                                                            value={predioSeleccionado.tenencia || "N/A"}
                                                            disabled
                                                        />
                                                    )}
                                                </div>

                                                {/* CONDICIÓN VIALIDAD */}
                                                <div>
                                                    {editando ? (
                                                        <>
                                                            <small style={{ color: "#888", fontWeight: "bold", display: "block", marginBottom: "4px" }}>CONDICIÓN VIALIDAD</small>
                                                            <select
                                                                style={estiloInput}
                                                                value={predioSeleccionado.vialidad || ""}
                                                                onChange={(e) => actualizarPredio('vialidad', e.target.value)}
                                                            >
                                                                <option value="Excelente">Excelente</option>
                                                                <option value="Bueno">Bueno</option>
                                                                <option value="Regular">Regular</option>
                                                                <option value="Malo">Malo</option>
                                                            </select>
                                                        </>
                                                    ) : (
                                                        <InputField
                                                            label="Condición Vialidad"
                                                            name="vialidad"
                                                            value={predioSeleccionado.vialidad || "N/A"}
                                                            disabled
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* VI. INFRAESTRUCTURA UNIFICADA */}
                                            <div style={{ marginBottom: "35px" }}>
                                                <div style={{ borderBottom: "2px solid #136442", paddingBottom: "5px", marginBottom: "15px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "14px" }}>VI. INFRAESTRUCTURA</strong>
                                                </div>
                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
                                                    {[
                                                        { k: 'corrales', l: 'CORRALES' }, { k: 'galpones', l: 'GALPONES' }, { k: 'vaqueras', l: 'VAQUERAS' },
                                                        { k: 'cochineras', l: 'COCHINERAS' }, { k: 'silos', l: 'SILOS' }, { k: 'caballerizas', l: 'CABALLERIZAS' },
                                                        { k: 'feedlot', l: 'FEEDLOT' }, { k: 'lagunas', l: 'LAGUNAS' }, { k: 'salas_ordeno', l: 'SALAS ORDEÑO' },
                                                        { k: 'queseras', l: 'QUESERAS' }, { k: 'casas', l: 'CASAS' }, { k: 'trapiches', l: 'TRAPICHES' }, { k: 'establos', l: 'ESTABLOS' }
                                                    ].map((item) => {
                                                        const valorAsignado = Number(predioSeleccionado.infraestructura?.[item.k] || 0);
                                                        const tieneCantidad = valorAsignado > 0;

                                                        return (
                                                            <div
                                                                key={item.k}
                                                                style={{
                                                                    border: "1px solid",
                                                                    borderColor: tieneCantidad ? "#bbf7d0" : "#e2e8f0",
                                                                    padding: "12px 10px",
                                                                    borderRadius: "8px",
                                                                    textAlign: "center",
                                                                    backgroundColor: tieneCantidad ? "#f0fdf4" : "#fff",
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    minHeight: "75px",
                                                                    transition: "all 0.2s ease"
                                                                }}
                                                            >
                                                                {/* El label superior se queda exactamente igual en ambos modos */}
                                                                <small style={{
                                                                    color: "#64748b",
                                                                    fontSize: "10px",
                                                                    fontWeight: "700",
                                                                    letterSpacing: "0.5px",
                                                                    display: "block",
                                                                    marginBottom: "6px"
                                                                }}>
                                                                    {item.l}
                                                                </small>

                                                                {editando ? (
                                                                    /* En modo edición, el input se mimetiza con la tarjeta */
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={valorAsignado}
                                                                        onChange={(e) => actualizarInfraestructura(item.k, e.target.value)}
                                                                        style={{
                                                                            width: "100%",
                                                                            background: "transparent",
                                                                            border: "none",
                                                                            outline: "none",
                                                                            textAlign: "center",
                                                                            fontWeight: "bold",
                                                                            fontSize: "18px",
                                                                            color: tieneCantidad ? "#136442" : "#333",
                                                                            padding: 0,
                                                                            margin: 0,
                                                                            fontFamily: "inherit"
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    /* En modo lectura, solo se muestra el texto plano */
                                                                    <span style={{
                                                                        fontWeight: "bold",
                                                                        fontSize: "18px",
                                                                        color: tieneCantidad ? "#136442" : "#333"
                                                                    }}>
                                                                        {valorAsignado}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* ── V. SERVICIOS BÁSICOS (CORREGIDO PARA USAR SERVICIOS_LECTURA) ── */}
                                            <div style={{ marginBottom: "35px" }}>
                                                <div style={{ borderBottom: "2px solid #136442", paddingBottom: "5px", marginBottom: "15px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "14px" }}>V. SERVICIOS BÁSICOS</strong>
                                                </div>
                                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                    {[
                                                        { id: 'Agua', l: 'Agua' },
                                                        { id: 'Electricidad', l: 'Electricidad' },
                                                        { id: 'Gas', l: 'Gas' },
                                                        { id: 'Internet', l: 'Internet' },
                                                        { id: 'Teléfono', l: 'Teléfono' },
                                                        { id: 'Transporte', l: 'Transporte' }
                                                    ].map((srv) => {
                                                        // Evaluamos la existencia del servicio usando 'servicios_lectura' tal cual viene de tu base de datos
                                                        const poseeServicio = predioSeleccionado.servicios_lectura?.includes(srv.id);

                                                        return (
                                                            <div
                                                                key={srv.id}
                                                                onClick={() => {
                                                                    if (editando) {
                                                                        // Definimos el nuevo array mapeado
                                                                        const nuevosServicios = poseeServicio
                                                                            ? predioSeleccionado.servicios_lectura.filter(s => s !== srv.id)
                                                                            : [...(predioSeleccionado.servicios_lectura || []), srv.id];

                                                                        // Llamamos a tu función de actualización del estado local del predio
                                                                        actualizarPredio('servicios_lectura', nuevosServicios);
                                                                    }
                                                                }}
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "8px",
                                                                    padding: "10px 18px",
                                                                    borderRadius: "8px",
                                                                    // Si lo posee se resalta con el verde principal, si no, se queda en gris tenue
                                                                    backgroundColor: poseeServicio ? "#136442" : "#f1f5f9",
                                                                    color: poseeServicio ? "#fff" : "#475569",
                                                                    fontSize: "12px",
                                                                    fontWeight: "500",
                                                                    border: "1px solid",
                                                                    borderColor: poseeServicio ? "#136442" : "#cbd5e1",
                                                                    cursor: editando ? "pointer" : "default",
                                                                    transition: "all 0.2s ease",
                                                                    boxShadow: poseeServicio ? "0 2px 4px rgba(19,100,66,0.2)" : "none"
                                                                }}
                                                            >
                                                                {/* Indicador visual dinámico */}
                                                                <span style={{
                                                                    fontSize: "14px",
                                                                    fontWeight: "bold",
                                                                    color: poseeServicio ? "#fff" : "#94a3b8"
                                                                }}>
                                                                    {poseeServicio ? "✓" : "○"}
                                                                </span>
                                                                {srv.l}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* VII. MODELO DE PRODUCCIÓN */}
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "25px" }}>
                                                <div style={{ border: "1px solid #e0e0e0", padding: "15px", borderRadius: "8px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "13px", display: "block", marginBottom: "10px" }}>TIPO DE EXPLOTACIÓN</strong>
                                                    {editando ? (
                                                        <select style={estiloInput} value={predioSeleccionado.produccion?.tipo_explotacion || ""} onChange={(e) => actualizarProduccion('tipo_explotacion', e.target.value)}>
                                                            <option value="Intensivo">Intensivo</option>
                                                            <option value="Semi Intensivo">Semi Intensivo</option>
                                                            <option value="Extensivo">Extensivo</option>
                                                        </select>
                                                    ) : (
                                                        <span style={{ fontSize: "18px", fontWeight: "bold" }}>{predioSeleccionado.produccion?.tipo_explotacion}</span>
                                                    )}
                                                </div>
                                                <div style={{ border: "1px solid #e0e0e0", padding: "15px", borderRadius: "8px" }}>
                                                    <strong style={{ color: "#136442", fontSize: "13px", display: "block", marginBottom: "10px" }}>SISTEMAS DE REGISTRO</strong>
                                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                        {[
                                                            { k: 'registro_sanitario', l: 'SANITARIO' }, { k: 'registro_productivo', l: 'PRODUCTIVO' },
                                                            { k: 'registro_reproductivo', l: 'REPRODUCTIVO' }, { k: 'registro_financiero', l: 'FINANCIERO' }
                                                        ].map((reg) => (
                                                            <div
                                                                key={reg.k}
                                                                onClick={() => editando && actualizarProduccion(reg.k, !predioSeleccionado.produccion?.[reg.k])}
                                                                style={{
                                                                    display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "20px",
                                                                    backgroundColor: predioSeleccionado.produccion?.[reg.k] ? "#136442" : "#f0f0f0",
                                                                    color: predioSeleccionado.produccion?.[reg.k] ? "#fff" : "#999",
                                                                    fontSize: "11px", fontWeight: "bold", cursor: editando ? "pointer" : "default", transition: "all 0.2s"
                                                                }}
                                                            >
                                                                {predioSeleccionado.produccion?.[reg.k] ? "✓" : "○"} {reg.l}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── BOTONERA FINAL FUNCIONAL ── */}
                                        <div style={{
                                            padding: "20px 30px", backgroundColor: "#f4f4f4", display: "flex",
                                            justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #ddd",
                                            position: "sticky", bottom: 0, zIndex: 10
                                        }}>
                                            <button
                                                onClick={eliminarDefinitivoReal}
                                                disabled={cargandoAccion}
                                                style={{ ...estiloBoton, backgroundColor: "#ce3a3a", opacity: cargandoAccion ? 0.5 : 1 }}
                                            >
                                                ELIMINAR
                                            </button>

                                            <button
                                                onClick={() => editando ? guardarCambiosReal() : setEditando(true)}
                                                // Se añade 'true' para deshabilitar el botón, manteniendo el estado de carga
                                                disabled={true}
                                                style={{
                                                    ...estiloBoton,
                                                    backgroundColor: "#808080", // Opcional: un color gris para indicar que está inactivo
                                                    opacity: 0.6,
                                                    cursor: "not-allowed"
                                                }}
                                            >
                                                {cargandoAccion ? "PROCESANDO..." : editando ? "CONFIRMAR CAMBIOS" : "EDITAR FICHA"}
                                            </button>

                                            <button
                                                onClick={() => setEditando(false)}
                                                disabled={cargandoAccion || !editando}
                                                style={{ ...estiloBoton, backgroundColor: "#6b7280", opacity: (cargandoAccion || !editando) ? 0.5 : 1 }}
                                            >
                                                SOLO VISUALIZAR
                                            </button>

                                            <button
                                                onClick={() => { setMostrarModal(false); setEditando(false); }}
                                                disabled={cargandoAccion}
                                                style={{ ...estiloBoton, backgroundColor: "#374151", opacity: cargandoAccion ? 0.5 : 1 }}
                                            >
                                                SALIR DE FICHA
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {tabActiva === "mapa" && (
                        <div style={{ maxWidth: "1200px", margin: "0 auto", animation: "fadeIn 0.5s" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>

                                {/* SECCIÓN SUPERIOR: EL MAPA A TODO ANCHO */}
                                <div style={{
                                    width: "100%",
                                    backgroundColor: "#fff",
                                    borderRadius: "16px",
                                    padding: "12px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                    border: "1px solid #e0e0e0",
                                    height: "600px"
                                }}>

                                    <div style={{ height: "100%", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                                        <MapaBarinas predios={listaPredios} />
                                    </div>
                                </div>

                                {/* SECCIÓN INFERIOR: RESUMEN POR MUNICIPIO EN CUADRÍCULA */}
                                <div style={{
                                    width: "100%",
                                    backgroundColor: "#fff",
                                    padding: "25px",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                                    border: "1px solid #eee"
                                }}>
                                    <h4 style={{
                                        color: "#136442",
                                        marginBottom: "20px",
                                        fontWeight: "700",
                                        borderBottom: "2px solid #ccc",
                                        paddingBottom: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        fontSize: "14px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px"
                                    }}>
                                        Distribución por Municipios
                                    </h4>

                                    {/* Grid organizado para los contadores */}
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                                        gap: "15px"
                                    }}>
                                        {MUNICIPIOS.map(muni => {
                                            const total = listaPredios.filter(p => p.municipio === muni).length;
                                            const tieneRegistros = total > 0;

                                            return (
                                                <div key={muni} style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    padding: "15px 10px",
                                                    borderRadius: "8px",
                                                    border: `1px solid ${tieneRegistros ? "#bbf7d0" : "#e5e7eb"}`,
                                                    backgroundColor: tieneRegistros ? "#f0fdf4" : "#f9fafb",
                                                    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                                                    transition: "all 0.2s ease",
                                                    cursor: "default"
                                                }}>
                                                    {/* Nombre del Municipio */}
                                                    <span style={{
                                                        fontSize: "10px",
                                                        fontWeight: "bold",
                                                        color: tieneRegistros ? "#136442" : "#6b7280",
                                                        marginBottom: "6px",
                                                        textAlign: "center",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.5px"
                                                    }}>
                                                        {muni}
                                                    </span>

                                                    {/* Contador Numérico */}
                                                    <span style={{
                                                        fontSize: "20px",
                                                        fontWeight: "bold",
                                                        color: tieneRegistros ? "#136442" : "#1f2937",
                                                        lineHeight: "1"
                                                    }}>
                                                        {total}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {tabActiva === "reportes" && (
                        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

                            {/* ── TÍTULO Y BUSCADOR (Exactamente igual al historial) ── */}
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

                            {/* ── TABLA DE REGISTROS (Reportes con numeración dinámica) ── */}
                            <div style={{
                                backgroundColor: "#fff", padding: "20px", borderRadius: "12px",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eee", overflowX: "auto"
                            }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "2px solid #136442", color: "#136442" }}>
                                            {/* Cambiado de ID a # para indicar numeración */}
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
                                                    key={p.id_predio}
                                                    style={{
                                                        borderBottom: "1px solid #f0f0f0",
                                                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb"
                                                    }}
                                                >
                                                    {/* Se usa index + 1 para enumerar desde 1 */}
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{index + 1}</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.nombre_predio}</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.productor?.nombre || "Sin nombre"}</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.municipio}</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>{p.superficie} Ha</td>
                                                    <td style={{ fontSize: "13px", padding: "12px" }}>
                                                        <button
                                                            onClick={() => {
                                                                const servicios = p.servicios_lectura || [];
                                                                const predioParaPDF = {
                                                                    ...p,
                                                                    servicios_lectura: servicios
                                                                };
                                                                generarPDFPredio(predioParaPDF);
                                                            }}
                                                            style={{ backgroundColor: "#f0fdf4", color: "#136442", border: "1px solid #136442", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                                                        >
                                                            Generar Ficha PDF
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                                                    No se encontraron registros.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    )}

                </section>
            </main>
        </div>
    );
}

// ── COMPONENTES REUTILIZABLES MEJORADOS ──────────────────────────────────────────────
const MenuItem = ({ label, active, onClick, icon }) => (
    <div
        onClick={onClick}
        style={{
            padding: "14px 18px",
            borderRadius: "14px",
            cursor: "pointer",
            marginBottom: "6px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "all 0.25s ease",
            backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
            color: active ? "#fff" : "#a7f3d0",
            boxShadow: active ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
            fontWeight: active ? "600" : "400",

            // 🔥 QUITA EFECTO BLANCO AL HACER CLICK
            outline: "none",
            WebkitTapHighlightColor: "transparent",
            userSelect: "none"
        }}
        onMouseDown={(e) => e.preventDefault()} // evita “flash” de focus
    >
        {icon}
        <span style={{ fontSize: "14px" }}>{label}</span>
    </div>
);

const FormSection = ({ title, children }) => (
    <div style={{ background: "#fff", padding: "28px", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "24px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "13px", color: "#136442", marginBottom: "25px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>{title}</h3>
        {children}
    </div>
);

const InputField = ({ label, error, prefix, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>{label}</label>

        {/* Este contenedor ahora maneja el borde, el fondo y agrupa el select con el input */}
        <div
            style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "8px", // Mantiene el redondeado de tu UI
                overflow: "hidden",  // Corta las esquinas del select para que no sobresalgan
                transition: "all 0.2s ease",
                // Si hay error, el contenedor completo se pone rojo
                border: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                backgroundColor: error ? "#fef2f2" : "#f8fafc"
            }}
            // Clase utilitaria por si necesitas detectar el foco general
            className="focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500"
        >
            {/* Si pasamos un prefijo (el combobox), se renderiza aquí al inicio */}
            {prefix && (
                <div style={{
                    height: "42px", // Asegura la misma altura del input
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: error ? "#fee2e2" : "#f1f5f9", // Fondo gris suave o rojizo si hay error
                    borderRight: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                }}>
                    {prefix}
                </div>
            )}

            {/* Tu input original, ahora limpio de bordes y fondos propios */}
            <input
                {...props}
                style={{
                    ...inputStyle,
                    border: "none",            // Le quitamos el borde porque ahora lo maneja el div superior
                    backgroundColor: "transparent", // Hereda el fondo del contenedor
                    width: "100%",
                    height: "42px",
                    outline: "none",
                    boxShadow: "none",
                    margin: 0
                }}
            />
        </div>

        {/* Mensaje de error justo debajo */}
        {error && (
            <p style={{
                color: "#ef4444",
                fontSize: "11px",
                marginTop: "5px",
                fontWeight: "600",
                animation: "fadeIn 0.3s ease"
            }}>
                {error}
            </p>
        )}
    </div>
);
const SelectField = ({ label, options, error, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>{label}</label>
        <select
            {...props}
            style={{
                ...inputStyle,
                border: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0"
            }}
        >
            <option value="">Seleccione una opción...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        {error && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "5px", fontWeight: "600" }}>{error}</p>}
    </div>
);
const CardStat = ({ label, value, color }) => (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "20px", borderTop: `4px solid ${color}`, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px", fontWeight: "500" }}>{label}</p>
        <h3 style={{ margin: "10px 0 0", fontSize: "28px", color: "#1e293b", fontWeight: "700" }}>{value}</h3>
    </div>
);

const chartCard = {
    background: "#fff",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0"
};

const chartTitle = {
    fontSize: "14px",
    fontWeight: "700",
    color: "#136442",
    marginBottom: "15px"
};

const chartPlaceholder = {
    height: "200px",
    background: "#f1f5f9",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
    border: "2px dashed #cbd5e1"
};

// ── ESTILOS SIDEBAR Y GENERAL ──────────────────────────────────────────────────
const sidebarContainerStyle = {
    width: "290px", backgroundColor: "#136442", padding: "25px",
    display: "flex", flexDirection: "column", color: "#fff", boxShadow: "4px 0 10px rgba(0,0,0,0.05)"
};
const brandContainer = { display: "flex", alignItems: "center", gap: "12px", marginBottom: "35px", paddingLeft: "10px" };
const logoSquare = { width: "38px", height: "38px", background: "#fff", color: "#136442", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "14px" };
const brandText = { fontSize: "18px", fontWeight: "700", letterSpacing: "-0.5px" };
const userCardStyle = { display: "flex", alignItems: "center", gap: "12px", padding: "15px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "18px", marginBottom: "30px" };
const avatarWrapper = { width: "45px", height: "45px", borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)" };
const userNameStyle = { fontSize: "14px", fontWeight: "600", color: "#fff" };
const userRoleLabel = { fontSize: "11px", color: "#86efac" };
const sectionLabel = { fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.4)", letterSpacing: "1.5px", marginBottom: "15px", paddingLeft: "10px" };
const logoutButtonStyle = { background: "rgba(255,255,255,0.05)", color: "#fca5a5", border: "none", padding: "14px", borderRadius: "15px", cursor: "pointer", fontWeight: "600", fontSize: "13px", marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center" };
const headerContainerStyle = { height: "85px", background: "#fff", display: "flex", alignItems: "center", padding: "0 40px", borderBottom: "1px solid #f1f5f9" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", backgroundColor: "#f8fafc" };
const labelStyle = { display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "8px" };
const grid3 = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" };
const gridCheck = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "15px" };
const radioLabel = { fontSize: "13px", color: "#334155", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px", background: "#f1f5f9", borderRadius: "8px" };
const btnPrincipal = { background: "#136442", color: "#fff", border: "none", padding: "16px 40px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(19, 100, 66, 0.3)" };
const alertStyle = { background: "#136442", color: "#fff", padding: "15px 25px", borderRadius: "12px", marginBottom: "20px", fontWeight: "500", textAlign: "center" };
const logoDerechoStyle = {
    height: "40px", // Un poco más grande para que destaque
    width: "auto",
    objectFit: "contain",
    opacity: "0.9"
};

const thStyle = { padding: "15px", fontWeight: "600" };
const tdStyle = { padding: "12px 15px", fontSize: "14px", color: "#333" };
const btnSmall = {
    backgroundColor: "#136442",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px"
};

const Spinner = ({ color = "#136442" }) => {
    // Creamos una referencia para el elemento
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
