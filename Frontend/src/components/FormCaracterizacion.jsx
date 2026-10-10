// src/components/FormCaracterizacion.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── CONSTANTES Y ESTILOS INTEGRADOS ──────────────────────────
const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#f8fafc",
};

const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "8px",
};

const grid3 = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
};

const gridCheck = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "15px",
};

const radioLabel = {
    fontSize: "13px",
    color: "#334155",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "10px",
    background: "#f1f5f9",
    borderRadius: "8px",
};

const btnPrincipal = {
    background: "#136442",
    color: "#fff",
    border: "none",
    padding: "16px 40px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(19, 100, 66, 0.3)",
};

// ── COMPONENTES INTEGRADOS ──────────────────────────────────
export const FormSection = ({ title, children }) => (
    <div
        style={{
            background: "#fff",
            padding: "28px",
            borderRadius: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            marginBottom: "24px",
            border: "1px solid #e2e8f0",
        }}
    >
        <h3
            style={{
                fontSize: "13px",
                color: "#136442",
                marginBottom: "25px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
            }}
        >
            {title}
        </h3>
        {children}
    </div>
);

export const InputField = ({ label, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>{label}</label>
        <input {...props} style={inputStyle} />
    </div>
);

export const SelectField = ({ label, options, error, ...props }) => (
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

export default function FormCaracterizacion({
    predioActivo,
    rubrosVegetales,
    setRubrosVegetales,
    inventarioInicial,
    setInventarioInicial,
    setTabActiva,
    subCaracterizacion,
    setSubCaracterizacion,
    modo = "caracterizacion",
}) {

    const [codigoGenerado, setCodigoGenerado] = useState("");
    const [erroresFilas, setErroresFilas] = useState({});

    // ── EFECTO PARA GESTIONAR DATOS SEGÚN EL MODO Y EL PREDIO ACTIVO ──────────────────
    useEffect(() => {
        if (predioActivo) {
            if (modo === "actualizacion") {
                if (predioActivo.rubros_vegetales && Array.isArray(predioActivo.rubros_vegetales)) {
                    setRubrosVegetales(predioActivo.rubros_vegetales);
                } else {
                    setRubrosVegetales([]);
                }

                setInventarioInicial((prev) => ({
                    ...prev,
                    especiesSeleccionadas: predioActivo.existencia_animal?.especiesSeleccionadas || [],
                    ...(predioActivo.existencia_animal || {}),
                    ...(predioActivo.maquinaria || {}),
                }));
            } else {
                setRubrosVegetales([]);
                setInventarioInicial((prev) => ({
                    ...prev,
                    especiesSeleccionadas: [],
                    bovinos: { toro_reproductor: 0, toro_ceba: 0, vaca: 0, novilla: 0, novillo: 0, maute: 0, mauta: 0, becerra: 0, becerro: 0 },
                    capacidadBovina: { leche_diaria: 0, carne_anual: 0, sistemas: [] },
                    bubalinos: { butoro_reproductor: 0, butoro_ceba: 0, bufala: 0, buvilla: 0, buvillo: 0, bumauta: 0, bumaute: 0, bucerra: 0, bucerro: 0 },
                    capacidadBubalina: { leche_diaria: 0, carne_anual: 0, partos_anuales: 0, reproductores: 0, sistemas: [] },
                    equinos: { padrillo: 0, caballo_trabajo: 0, yegua: 0, potra: 0, potro: 0, potrilla: 0, potrillo: 0, burro: 0, burra: 0 },
                    capacidadEquina: { sistemas: [], trabajo_agricola: 0, transporte: 0, reproduccion: 0, deporte: 0, exhibicion: 0, turismo: 0, carga: 0 },
                    ovinos: { carnero: 0, oveja: 0, borrego: 0, borrega: 0, cordero: 0, cordera: 0 },
                    capacidadOvina: { sistemas: [], carne_anual: 0, leche_diaria: 0, lana_anual: 0, cria: 0, reproduccion: 0, doble_proposito: 0, genetica: 0 },
                    porcinos: { berraco: 0, cerda_gestante: 0, cerda_lactante: 0, lechon: 0, lechona: 0 },
                    capacidadPorcina: { sistemas: [], cria: 0, engorde: 0, reproduccion: 0, ciclo_completo: 0, genetica: 0, carne_anual: 0 },
                    caprinos: { cabrio: 0, cabra: 0, cabrillo: 0, cabrilla: 0, cabrito: 0, cabrita: 0 },
                    capacidadCaprino: { sistemas: [], vientres: 0, engorde: 0, leche_diaria: 0, carne_anual: 0 },
                    cunicola: { macho: 0, madre: 0, gazapo: 0 },
                    capacidadCunicola: { sistemas: [], jaulas_madre: 0, reproductoras: 0, carne_anual: 0 },
                    avicola: { pollos_engorde: 0, gallinas_ponedoras: 0, gallinas_descarte: 0, codornices: 0, patos: 0, pavos: 0, avestruz: 0, guinea: 0, otros: 0 },
                    capacidadAvicola: { sistemas: [], capacidad_alojamiento: 0, produccion_huevos: 0, capacidad_lote: 0 },
                    apicola: { colmenas: 0 },
                    capacidadApicola: { sistemas: [], colmenas_activas: 0, miel_anual: 0, nucleos_anuales: 0 },
                    maquinariaSeleccionada: [],
                    maquinaria_ruedas: { tractor: 0, rotocultor: 0, patrol: 0, lowboy: 0, payloader: 0, cosechadora: 0, desgranadora: 0, basuca: 0, remolque: 0 },
                    implementos: { abonadora: 0, arados: 0, aspergadoras: 0, rastra_pesada: 0, cultivadora: 0, desmalezadora: 0, desterronadora: 0, encaladora: 0, niveladora: 0, cegadora: 0, sembradora: 0, subsolador: 0, surcadora: 0, trompo_fertilizador: 0 },
                    riego: { electrobomba: 0, molino_viento: 0, motobomba: 0, motor_diesel: 0 },
                    otros_equipos: { cargadora_madera: 0, descortezadora: 0, motosierra: 0, secadora_granos: 0, termonebulizadores: 0, trilladora: 0, acuicultura_aireacion: 0, alimentacion_mecanizada: 0 },
                }));
            }
        }
    }, [predioActivo, modo]);

    const ModernCheckbox = ({ label, checked, onChange }) => (
        <div
            onClick={() => onChange(!checked)}
            style={{
                ...radioLabel,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: checked ? "2px solid #136442" : "1px solid #cbd5e1",
                backgroundColor: checked ? "#f0fdf4" : "#fff",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                userSelect: "none",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "6px",
                    border: checked ? "none" : "2px solid #cbd5e1",
                    backgroundColor: checked ? "#136442" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                }}
            >
                {checked && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                )}
            </div>
            <span>{label}</span>
        </div>
    );

    const LISTA_RUBROS_VEGETALES = [
        "Caraota", "Maíz Blanco", "Maíz Amarillo", "Arroz", "Sorgo",
        "Café", "Cacao", "Caña de Azúcar", "Yuca", "Plátano",
        "Cambur", "Auyama", "Tomate", "Cebolla", "Pimentón",
    ].sort((a, b) => a.localeCompare(b));

    const agregarRubroVegetal = () => {
        setRubrosVegetales((prev) => [
            ...prev,
            { rubro: "", hectareas: "", estado: "", riego: "", ciclo_productivo: "", tipo_produccion: "", produccion_estimada: "", destino: "" },
        ]);
    };

    const eliminarRubroVegetal = (index) => {
        setRubrosVegetales((prev) => prev.filter((_, i) => i !== index));
    };

    const actualizarRubroVegetal = (index, campo, valor) => {
        if ((campo === "hectareas" || campo === "produccion_estimada") && valor !== "" && Number(valor) < 0) return;

        setRubrosVegetales((prev) => {
            const copia = [...prev];
            copia[index] = { ...copia[index], [campo]: valor };
            return copia;
        });

        let mensajeError = "";
        if (campo === "hectareas" || campo === "produccion_estimada") {
            if (valor === "") mensajeError = "Este campo es requerido";
            else if (isNaN(valor) || Number(valor) <= 0) mensajeError = "Debe ser un número mayor a 0";
            else if (Number(valor) > 1000000) mensajeError = "Cantidad exagerada. Verifique.";
        }
        if (campo === "rubro") {
            if (valor.trim() === "") mensajeError = "Seleccione un rubro";
            else if (/[0-9]/.test(valor)) mensajeError = "El rubro no puede contener números";
        }

        setErroresFilas((prev) => ({ ...prev, [`${index}-${campo}`]: mensajeError }));
    };

    const generarObjetoPDF = (predio) => {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
        const verdeBarinas = [19, 100, 66];
        const grisOscuro = [40, 40, 40];

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

        const fechaEmision = predio.fecha_registro ? new Date(predio.fecha_registro).toLocaleDateString() : new Date().toLocaleDateString();
        doc.text(`Fecha de Registro: ${fechaEmision}`, 204, 18, { align: "right" });

        doc.setDrawColor(...verdeBarinas);
        doc.setLineWidth(0.6);
        doc.line(12, 25, 204, 25);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...verdeBarinas);
        doc.text(`FICHA TÉCNICA INTEGRAL: ${(predio.nombre_predio || "SIN NOMBRE").toUpperCase()}`, 12, 33);

        let currentY = 40;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...verdeBarinas);
        doc.text("I. DATOS DEL PRODUCTOR", 12, currentY);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(12, currentY + 2, 204, currentY + 2);

        autoTable(doc, {
            startY: currentY + 4,
            body: [["NOMBRE COMPLETO:", predio.productor?.nombre || "N/A", "CÉDULA / RIF:", predio.productor?.cedula_rif || "N/A", "TELÉFONO:", predio.productor?.telefono || "N/A"]],
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

        const fileSanitizado = `Ficha_Tecnica_Integral_${(predio.nombre_predio || "Predio").replace(/\s+/g, "_")}.pdf`;
        doc.save(fileSanitizado);
        return doc;
    };

    const guardarInventario = async () => {
        if (!predioActivo?.id_predio) {
            Swal.fire({ icon: "warning", title: "Predio no seleccionado", text: "Debe seleccionar un predio", confirmButtonColor: '#136442' });
            return;
        }

        const correoProductor = predioActivo?.productor?.correo;
        if (!correoProductor) {
            Swal.fire({ icon: "warning", title: "Correo no disponible", text: "El productor seleccionado no tiene un correo electrónico registrado.", confirmButtonColor: '#136442' });
            return;
        }

        let codigoServidor = "";
        const esCaracterizacion = modo === "caracterizacion";
        const tituloPregunta = esCaracterizacion ? "¿Guardar caracterización?" : "¿Guardar actualización productiva?";

        const confirmacion = await Swal.fire({
            title: tituloPregunta,
            text: `Se enviará un código de validación al correo del productor (${correoProductor}).`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#136442",
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const envio = await axios.post("http://127.0.0.1:8000/api/enviar-codigo-correo/", { correo: correoProductor });
            codigoServidor = envio.data.codigo.toString();
            setCodigoGenerado(codigoServidor);

            await Swal.fire({
                icon: "success",
                title: "Código enviado",
                text: `El código de verificación fue enviado al correo: ${correoProductor}`,
                confirmButtonColor: "#136442",
            });
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error de envío", text: "No se pudo enviar el código de validación al correo.", confirmButtonColor: "#d32f2f" });
            return;
        }

        const { value: codigoUsuario } = await Swal.fire({
            title: "Validación del Productor",
            input: "text",
            inputLabel: "Ingrese el código enviado al correo del productor",
            inputPlaceholder: "Ingrese el código",
            confirmButtonText: "Validar",
            confirmButtonColor: "#136442",
            showCancelButton: true,
        });

        if (!codigoUsuario) return;

        if (codigoUsuario !== codigoServidor) {
            Swal.fire({ icon: "error", title: "Código incorrecto", text: "El código ingresado no coincide.", confirmButtonColor: "#d32f2f" });
            return;
        }

        Swal.fire({
            title: 'Procesando...',
            text: 'Guardando cambios y enviando ficha técnica al correo, por favor espere.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            let usuarioAccion = "Empleado";
            const adminDataStr = sessionStorage.getItem("usuario_admin");

            if (adminDataStr) {
                try {
                    const adminData = JSON.parse(adminDataStr);
                    usuarioAccion = `Administrador (${adminData.nombre || adminData.username || "Administrador"})`;
                } catch (e) {
                    usuarioAccion = "Administrador";
                }
            }

            const data = {
                ...(modo === "caracterizacion" ? { caracterizacion_completada: true } : {}),
                usuario: usuarioAccion,
                rubros_vegetales: rubrosVegetales,
                existencia_animal: {
                    especiesSeleccionadas: inventarioInicial.especiesSeleccionadas,
                    bovinos: inventarioInicial.bovinos,
                    capacidadBovina: inventarioInicial.capacidadBovina,
                    bubalinos: inventarioInicial.bubalinos,
                    capacidadBubalina: inventarioInicial.capacidadBubalina,
                    equinos: inventarioInicial.equinos,
                    capacidadEquina: inventarioInicial.capacidadEquina,
                    ovinos: inventarioInicial.ovinos,
                    capacidadOvina: inventarioInicial.capacidadOvina,
                    porcinos: inventarioInicial.porcinos,
                    capacidadPorcina: inventarioInicial.capacidadPorcina,
                    caprinos: inventarioInicial.caprinos,
                    capacidadCaprino: inventarioInicial.capacidadCaprino,
                    cunicola: inventarioInicial.cunicola,
                    capacidadCunicola: inventarioInicial.capacidadCunicola,
                    avicola: inventarioInicial.avicola,
                    capacidadAvicola: inventarioInicial.capacidadAvicola,
                    apicola: inventarioInicial.apicola,
                    capacidadApicola: inventarioInicial.capacidadApicola,
                },
                maquinaria: {
                    maquinariaSeleccionada: inventarioInicial.maquinariaSeleccionada,
                    maquinaria_ruedas: inventarioInicial.maquinaria_ruedas,
                    implementos: inventarioInicial.implementos,
                    riego: inventarioInicial.riego,
                    otros_equipos: inventarioInicial.otros_equipos,
                },
            };

            await axios.patch(`http://127.0.0.1:8000/api/predios/${predioActivo.id_predio}/`, data);

            const predioActualizadoParaPDF = {
                ...predioActivo,
                rubros_vegetales: rubrosVegetales,
                existencia_animal: data.existencia_animal,
                maquinaria: data.maquinaria
            };

            const docPDF = generarObjetoPDF(predioActualizadoParaPDF);
            const pdfBlob = docPDF.output("blob");

            const formData = new FormData();
            formData.append("id_predio", predioActivo.id_predio);
            formData.append("correo", correoProductor);
            formData.append("pdf_file", pdfBlob, `Ficha_Tecnica_Integral_${(predioActivo.nombre_predio || "Predio").replace(/\s+/g, "_")}.pdf`);

            await axios.post("http://127.0.0.1:8000/api/enviar-correo-ficha/", formData);

            Swal.fire({
                icon: "success",
                title: modo === "caracterizacion" ? "Caracterización guardada" : "Actualización guardada",
                text: "La información fue validada y se ha enviado la ficha técnica en PDF al correo del productor.",
                confirmButtonColor: "#136442",
            }).then((result) => {
                if (result.isConfirmed) window.location.reload();
            });

        } catch (error) {
            Swal.fire({ icon: "error", title: "Error al procesar", text: "Ocurrió un problema en el servidor.", confirmButtonColor: "#d32f2f" });
        }
    };

    return (
        <div style={{ maxWidth: "950px", margin: "0 auto" }}>
            {/* 🔴 BLOQUE DE VALIDACIÓN */}
            {!predioActivo ? (
                <FormSection title="⚠️ Selección requerida">
                    <p style={{ color: "#64748b" }}>
                        Debes seleccionar un predio antes de registrar inventario.
                    </p>
                </FormSection>
            ) : (
                <>
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginBottom: "25px",
                        }}
                    >
                        <button
                            onClick={() => setSubCaracterizacion("animal")}
                            style={btnPrincipal}
                        >
                            Existencia Animal
                        </button>

                        <button
                            onClick={() => setSubCaracterizacion("vegetal")}
                            style={btnPrincipal}
                        >
                            Producción Vegetal
                        </button>

                        <button
                            onClick={() => setSubCaracterizacion("maquinaria")}
                            style={btnPrincipal}
                        >
                            Maquinarias
                        </button>
                    </div>

                    {subCaracterizacion === "animal" && (
                        <FormSection title="Existencia Animal">
                            <div style={gridCheck}>
                                {[
                                    "Bovino",
                                    "Bubalino",
                                    "Equino",
                                    "Ovino",
                                    "Porcino",
                                    "Caprino",
                                    "Cunicola",
                                    "Avicola",
                                    "Apicola",
                                ].map((item) => {
                                    // Evaluamos si la especie actual ya está seleccionada
                                    const estaSeleccionado =
                                        inventarioInicial.especiesSeleccionadas.includes(item);

                                    return (
                                        <ModernCheckbox
                                            key={item}
                                            label={item}
                                            checked={estaSeleccionado}
                                            onChange={() => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    especiesSeleccionadas: estaSeleccionado
                                                        ? prev.especiesSeleccionadas.filter(
                                                            (i) => i !== item,
                                                        ) // Si existe, la quita
                                                        : [...prev.especiesSeleccionadas, item], // Si no existe, la agrega
                                                }));
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Bovino") && (
                            <FormSection title="Bovinos">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.bovinos).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.bovinos[item] ?? ""}
                                            onKeyDown={(e) => {
                                                // Bloquea el signo menos (-), la letra e, el signo más (+) y el punto decimal (.)
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;

                                                // Establece el límite máximo de caracteres (ej. máximo 6 dígitos, ej. 999,999)
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    bovinos: {
                                                        ...prev.bovinos,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>

                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginTop: "15px",
                                    }}
                                >
                                    Total Bovinos:{" "}
                                    {Object.values(inventarioInicial.bovinos).reduce(
                                        (a, b) => (Number(a) || 0) + (Number(b) || 0),
                                        0,
                                    )}
                                </p>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Bovino") && (
                            <FormSection title="Capacidad Productiva Bovina">
                                {/* SISTEMAS PRODUCTIVOS */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "700",
                                            color: "#136442",
                                            marginBottom: "15px",
                                            fontSize: "15px",
                                        }}
                                    >
                                        Sistemas Productivos
                                    </p>

                                    <div style={gridCheck}>
                                        {[
                                            "Cría",
                                            "Ceba",
                                            "Doble propósito",
                                            "Lechería",
                                            "Genética",
                                        ].map((item) => {
                                            const existe =
                                                inventarioInicial.capacidadBovina.sistemas.includes(
                                                    item,
                                                );

                                            return (
                                                <ModernCheckbox
                                                    key={item}
                                                    label={item}
                                                    checked={existe}
                                                    onChange={() => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBovina: {
                                                                ...prev.capacidadBovina,
                                                                sistemas: existe
                                                                    ? prev.capacidadBovina.sistemas.filter(
                                                                        (s) => s !== item,
                                                                    )
                                                                    : [...prev.capacidadBovina.sistemas, item],
                                                            },
                                                        }));
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* CAMPOS DINÁMICOS PROTEGIDOS CONTRA NEGATIVOS */}
                                <div style={{ marginTop: "25px" }}>
                                    <div style={grid3}>
                                        {/* LECHE */}
                                        {(inventarioInicial.capacidadBovina.sistemas.includes(
                                            "Lechería",
                                        ) ||
                                            inventarioInicial.capacidadBovina.sistemas.includes(
                                                "Doble propósito",
                                            )) && (
                                                <InputField
                                                    label="Producción de leche diaria (L)"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadBovina.leche_diaria ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBovina: {
                                                                ...prev.capacidadBovina,
                                                                leche_diaria: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* CARNE */}
                                        {(inventarioInicial.capacidadBovina.sistemas.includes(
                                            "Ceba",
                                        ) ||
                                            inventarioInicial.capacidadBovina.sistemas.includes(
                                                "Doble propósito",
                                            )) && (
                                                <InputField
                                                    label="Producción carne anual (Kg)"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadBovina.carne_anual ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBovina: {
                                                                ...prev.capacidadBovina,
                                                                carne_anual: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* CRÍA */}
                                        {inventarioInicial.capacidadBovina.sistemas.includes(
                                            "Cría",
                                        ) && (
                                                <InputField
                                                    label="Cantidad de partos anuales"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadBovina.partos_anuales ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBovina: {
                                                                ...prev.capacidadBovina,
                                                                partos_anuales: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* GENÉTICA */}
                                        {inventarioInicial.capacidadBovina.sistemas.includes(
                                            "Genética",
                                        ) && (
                                                <InputField
                                                    label="Cantidad de reproductores"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadBovina.reproductores ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBovina: {
                                                                ...prev.capacidadBovina,
                                                                reproductores: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}
                                    </div>
                                </div>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Bubalino") && (
                            <FormSection title="Bubalinos">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.bubalinos).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.bubalinos[item] ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    bubalinos: {
                                                        ...prev.bubalinos,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>

                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginTop: "15px",
                                    }}
                                >
                                    Total Bubalinos:{" "}
                                    {Object.values(inventarioInicial.bubalinos).reduce(
                                        (a, b) => (Number(a) || 0) + (Number(b) || 0),
                                        0,
                                    )}
                                </p>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Bubalino") && (
                            <FormSection title="Capacidad Productiva Bubalina">
                                {/* SISTEMAS PRODUCTIVOS */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "700",
                                            color: "#136442",
                                            marginBottom: "15px",
                                            fontSize: "15px",
                                        }}
                                    >
                                        Sistemas Productivos
                                    </p>

                                    <div style={gridCheck}>
                                        {[
                                            "Cría",
                                            "Ceba",
                                            "Doble propósito",
                                            "Lechería",
                                            "Genética",
                                        ].map((item) => {
                                            const existe =
                                                inventarioInicial.capacidadBubalina.sistemas.includes(
                                                    item,
                                                );
                                            return (
                                                <ModernCheckbox
                                                    key={item}
                                                    label={item}
                                                    checked={existe}
                                                    onChange={() => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBubalina: {
                                                                ...prev.capacidadBubalina,
                                                                sistemas: existe
                                                                    ? prev.capacidadBubalina.sistemas.filter(
                                                                        (s) => s !== item,
                                                                    )
                                                                    : [...prev.capacidadBubalina.sistemas, item],
                                                            },
                                                        }));
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* CAMPOS DINÁMICOS */}
                                <div style={{ marginTop: "25px" }}>
                                    <div style={grid3}>
                                        {/* LECHE */}
                                        {(inventarioInicial.capacidadBubalina.sistemas.includes(
                                            "Lechería",
                                        ) ||
                                            inventarioInicial.capacidadBubalina.sistemas.includes(
                                                "Doble propósito",
                                            )) && (
                                                <InputField
                                                    label="Producción de leche diaria (L)"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadBubalina.leche_diaria ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBubalina: {
                                                                ...prev.capacidadBubalina,
                                                                leche_diaria: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* CARNE */}
                                        {(inventarioInicial.capacidadBubalina.sistemas.includes(
                                            "Ceba",
                                        ) ||
                                            inventarioInicial.capacidadBubalina.sistemas.includes(
                                                "Doble propósito",
                                            )) && (
                                                <InputField
                                                    label="Producción carne anual (Kg)"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadBubalina.carne_anual ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBubalina: {
                                                                ...prev.capacidadBubalina,
                                                                carne_anual: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* CRÍA */}
                                        {inventarioInicial.capacidadBubalina.sistemas.includes(
                                            "Cría",
                                        ) && (
                                                <InputField
                                                    label="Cantidad de partos anuales"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadBubalina.partos_anuales ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBubalina: {
                                                                ...prev.capacidadBubalina,
                                                                partos_anuales: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* GENÉTICA */}
                                        {inventarioInicial.capacidadBubalina.sistemas.includes(
                                            "Genética",
                                        ) && (
                                                <InputField
                                                    label="Cantidad de reproductores"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadBubalina.reproductores ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBubalina: {
                                                                ...prev.capacidadBubalina,
                                                                reproductores: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}
                                    </div>
                                </div>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Equino") && (
                            <FormSection title="Equinos">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.equinos).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.equinos[item] ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    equinos: {
                                                        ...prev.equinos,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>

                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginTop: "15px",
                                    }}
                                >
                                    Total Equinos:{" "}
                                    {Object.values(inventarioInicial.equinos).reduce(
                                        (a, b) => (Number(a) || 0) + (Number(b) || 0),
                                        0,
                                    )}
                                </p>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Equino") && (
                            <FormSection title="Capacidad Productiva Equina">
                                {/* SISTEMAS PRODUCTIVOS */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "700",
                                            color: "#136442",
                                            marginBottom: "15px",
                                            fontSize: "15px",
                                        }}
                                    >
                                        Sistemas Productivos
                                    </p>

                                    <div style={gridCheck}>
                                        {[
                                            { nombre: "Trabajo agrícola", llave: "trabajo_agricola" },
                                            { nombre: "Transporte", llave: "transporte" },
                                            { nombre: "Reproducción", llave: "reproduccion" },
                                            { nombre: "Deporte", llave: "deporte" },
                                            { nombre: "Exhibición", llave: "exhibicion" },
                                            { nombre: "Turismo", llave: "turismo" },
                                            { nombre: "Carga", llave: "carga" },
                                        ].map((item) => (
                                            <ModernCheckbox
                                                key={item.nombre}
                                                label={item.nombre}
                                                checked={inventarioInicial.capacidadEquina.sistemas.includes(
                                                    item.nombre,
                                                )}
                                                onChange={() => {
                                                    setInventarioInicial((prev) => {
                                                        const existe = prev.capacidadEquina.sistemas.includes(item.nombre);
                                                        const nuevosSistemas = existe
                                                            ? prev.capacidadEquina.sistemas.filter((s) => s !== item.nombre)
                                                            : [...prev.capacidadEquina.sistemas, item.nombre];

                                                        return {
                                                            ...prev,
                                                            capacidadEquina: {
                                                                ...prev.capacidadEquina,
                                                                sistemas: nuevosSistemas,
                                                                // Si se desmarca, resetea automáticamente su cantidad a "" o 0
                                                                ...(existe ? { [item.llave]: "" } : {}),
                                                            },
                                                        };
                                                    });
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* CAMPOS DINÁMICOS */}
                                <div style={{ marginTop: "25px" }}>
                                    <div style={grid3}>
                                        {[
                                            {
                                                sistema: "Trabajo agrícola",
                                                llave: "trabajo_agricola",
                                                label: "Cantidad para trabajo agrícola",
                                            },
                                            {
                                                sistema: "Transporte",
                                                llave: "transporte",
                                                label: "Cantidad para transporte",
                                            },
                                            {
                                                sistema: "Reproducción",
                                                llave: "reproduccion",
                                                label: "Animales reproductores",
                                            },
                                            {
                                                sistema: "Deporte",
                                                llave: "deporte",
                                                label: "Equinos para deporte",
                                            },
                                            {
                                                sistema: "Exhibición",
                                                llave: "exhibicion",
                                                label: "Equinos de exhibición",
                                            },
                                            {
                                                sistema: "Turismo",
                                                llave: "turismo",
                                                label: "Equinos para turismo",
                                            },
                                            {
                                                sistema: "Carga",
                                                llave: "carga",
                                                label: "Equinos de carga",
                                            },
                                        ].map(
                                            ({ sistema, llave, label }) =>
                                                inventarioInicial.capacidadEquina.sistemas.includes(
                                                    sistema,
                                                ) && (
                                                    <InputField
                                                        key={llave}
                                                        label={label}
                                                        type="number"
                                                        min="0"
                                                        value={inventarioInicial.capacidadEquina[llave] ?? ""}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            const LIMITE_DIGITOS = 6;
                                                            if (val.length > LIMITE_DIGITOS) return;

                                                            setInventarioInicial((prev) => ({
                                                                ...prev,
                                                                capacidadEquina: {
                                                                    ...prev.capacidadEquina,
                                                                    [llave]: val === "" ? "" : Number(val),
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                ),
                                        )}
                                    </div>
                                </div>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Ovino") && (
                            <FormSection title="Ovinos">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.ovinos).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.ovinos[item] ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    ovinos: {
                                                        ...prev.ovinos,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>

                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginTop: "15px",
                                    }}
                                >
                                    Total Ovinos:{" "}
                                    {Object.values(inventarioInicial.ovinos).reduce(
                                        (a, b) => (Number(a) || 0) + (Number(b) || 0),
                                        0,
                                    )}
                                </p>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Ovino") && (
                            <FormSection title="Capacidad Productiva Ovina">
                                {/* SISTEMAS PRODUCTIVOS */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "700",
                                            color: "#136442",
                                            marginBottom: "15px",
                                            fontSize: "15px",
                                        }}
                                    >
                                        Sistemas Productivos
                                    </p>

                                    <div style={gridCheck}>
                                        {[
                                            { nombre: "Carne", llave: "carne_anual" },
                                            { nombre: "Leche", llave: "leche_diaria" },
                                            { nombre: "Lana", llave: "lana_anual" },
                                            { nombre: "Cría", llave: "cria" },
                                            { nombre: "Reproducción", llave: "reproduccion" },
                                            { nombre: "Doble propósito", llave: "doble_proposito" },
                                            { nombre: "Genética", llave: "genetica" },
                                        ].map((item) => (
                                            <ModernCheckbox
                                                key={item.nombre}
                                                label={item.nombre}
                                                checked={inventarioInicial.capacidadOvina.sistemas.includes(
                                                    item.nombre,
                                                )}
                                                onChange={() => {
                                                    setInventarioInicial((prev) => {
                                                        const existe = prev.capacidadOvina.sistemas.includes(item.nombre);
                                                        const nuevosSistemas = existe
                                                            ? prev.capacidadOvina.sistemas.filter((s) => s !== item.nombre)
                                                            : [...prev.capacidadOvina.sistemas, item.nombre];

                                                        return {
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                sistemas: nuevosSistemas,
                                                                // Si se desmarca, resetea automáticamente su valor a ""
                                                                ...(existe ? { [item.llave]: "" } : {}),
                                                            },
                                                        };
                                                    });
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* CAMPOS DINÁMICOS */}
                                <div style={{ marginTop: "25px" }}>
                                    <div style={grid3}>
                                        {/* CARNE */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Carne",
                                        ) && (
                                                <InputField
                                                    label="Producción carne anual (Kg)"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadOvina.carne_anual ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                carne_anual: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* LECHE */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Leche",
                                        ) && (
                                                <InputField
                                                    label="Producción leche diaria (L)"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadOvina.leche_diaria ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                leche_diaria: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* LANA */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Lana",
                                        ) && (
                                                <InputField
                                                    label="Producción lana anual (Kg)"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadOvina.lana_anual ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                lana_anual: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* CRÍA */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Cría",
                                        ) && (
                                                <InputField
                                                    label="Animales destinados a cría"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadOvina.cria ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                cria: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* REPRODUCCIÓN */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Reproducción",
                                        ) && (
                                                <InputField
                                                    label="Reproductores activos"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadOvina.reproduccion ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                reproduccion: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* DOBLE PROPÓSITO */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Doble propósito",
                                        ) && (
                                                <InputField
                                                    label="Animales doble propósito"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadOvina.doble_proposito ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                doble_proposito: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* GENÉTICA */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Genética",
                                        ) && (
                                                <InputField
                                                    label="Animales de genética"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadOvina.genetica ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                genetica: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}
                                    </div>
                                </div>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Porcino") && (
                            <FormSection title="Porcinos">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.porcinos).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.porcinos[item] ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    porcinos: {
                                                        ...prev.porcinos,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>

                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginTop: "15px",
                                    }}
                                >
                                    Total Porcinos:{" "}
                                    {Object.values(inventarioInicial.porcinos).reduce(
                                        (a, b) => (Number(a) || 0) + (Number(b) || 0),
                                        0,
                                    )}
                                </p>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Porcino") && (
                            <FormSection title="Capacidad Productiva Porcina">
                                {/* SISTEMAS PRODUCTIVOS */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "700",
                                            color: "#136442",
                                            marginBottom: "15px",
                                            fontSize: "15px",
                                        }}
                                    >
                                        Sistemas Productivos
                                    </p>

                                    <div style={gridCheck}>
                                        {[
                                            "Cría",
                                            "Engorde",
                                            "Reproducción",
                                            "Ciclo completo",
                                            "Genética",
                                            "Producción de carne",
                                        ].map((item) => (
                                            <ModernCheckbox
                                                key={item}
                                                label={item}
                                                checked={inventarioInicial.capacidadPorcina.sistemas.includes(item)}
                                                onChange={() => {
                                                    const existe = inventarioInicial.capacidadPorcina.sistemas.includes(item);

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            sistemas: existe
                                                                ? prev.capacidadPorcina.sistemas.filter((s) => s !== item)
                                                                : [...prev.capacidadPorcina.sistemas, item],
                                                        },
                                                    }));
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* CAMPOS DINÁMICOS */}
                                <div style={{ marginTop: "25px" }}>
                                    <div style={grid3}>
                                        {/* CRÍA */}
                                        {inventarioInicial.capacidadPorcina.sistemas.includes("Cría") && (
                                            <InputField
                                                label="Cantidad destinada a cría"
                                                type="number"
                                                min="0"
                                                value={inventarioInicial.capacidadPorcina.cria ?? ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const LIMITE_DIGITOS = 6;
                                                    if (val.length > LIMITE_DIGITOS) return;

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            cria: val === "" ? "" : Number(val),
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                        {/* ENGORDE */}
                                        {inventarioInicial.capacidadPorcina.sistemas.includes("Engorde") && (
                                            <InputField
                                                label="Capacidad de engorde"
                                                type="number"
                                                min="0"
                                                value={inventarioInicial.capacidadPorcina.engorde ?? ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const LIMITE_DIGITOS = 6;
                                                    if (val.length > LIMITE_DIGITOS) return;

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            engorde: val === "" ? "" : Number(val),
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                        {/* REPRODUCCIÓN */}
                                        {inventarioInicial.capacidadPorcina.sistemas.includes("Reproducción") && (
                                            <InputField
                                                label="Reproductores activos"
                                                type="number"
                                                min="0"
                                                value={inventarioInicial.capacidadPorcina.reproduccion ?? ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const LIMITE_DIGITOS = 6;
                                                    if (val.length > LIMITE_DIGITOS) return;

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            reproduccion: val === "" ? "" : Number(val),
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                        {/* CICLO COMPLETO */}
                                        {inventarioInicial.capacidadPorcina.sistemas.includes("Ciclo completo") && (
                                            <InputField
                                                label="Capacidad ciclo completo"
                                                type="number"
                                                min="0"
                                                value={inventarioInicial.capacidadPorcina.ciclo_completo ?? ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const LIMITE_DIGITOS = 6;
                                                    if (val.length > LIMITE_DIGITOS) return;

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            ciclo_completo: val === "" ? "" : Number(val),
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                        {/* GENÉTICA */}
                                        {inventarioInicial.capacidadPorcina.sistemas.includes("Genética") && (
                                            <InputField
                                                label="Animales de genética"
                                                type="number"
                                                min="0"
                                                value={inventarioInicial.capacidadPorcina.genetica ?? ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const LIMITE_DIGITOS = 6;
                                                    if (val.length > LIMITE_DIGITOS) return;

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            genetica: val === "" ? "" : Number(val),
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                        {/* PRODUCCIÓN CARNE */}
                                        {inventarioInicial.capacidadPorcina.sistemas.includes("Producción de carne") && (
                                            <InputField
                                                label="Producción carne anual (Kg)"
                                                type="number"
                                                min="0"
                                                value={inventarioInicial.capacidadPorcina.carne_anual ?? ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const LIMITE_DIGITOS = 6;
                                                    if (val.length > LIMITE_DIGITOS) return;

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            carne_anual: val === "" ? "" : Number(val),
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Caprino") && (
                            <FormSection title="Caprinos">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.caprinos).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.caprinos[item] ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    caprinos: {
                                                        ...prev.caprinos,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>

                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginTop: "15px",
                                    }}
                                >
                                    Total Caprinos:{" "}
                                    {Object.values(inventarioInicial.caprinos).reduce(
                                        (a, b) => (Number(a) || 0) + (Number(b) || 0),
                                        0,
                                    )}
                                </p>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Caprino") && (
                            <FormSection title="Capacidad Productiva Caprina">
                                {/* SISTEMAS PRODUCTIVOS */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "700",
                                            color: "#136442",
                                            marginBottom: "15px",
                                            fontSize: "15px",
                                        }}
                                    >
                                        Sistemas Productivos Caprinos
                                    </p>
                                    <div style={gridCheck}>
                                        {[
                                            "Cría y Recría",
                                            "Engorde",
                                            "Producción de Leche",
                                            "Producción de Carne",
                                            "Doble Propósito",
                                            "Genética",
                                        ].map((item) => (
                                            <ModernCheckbox
                                                key={item}
                                                label={item}
                                                checked={inventarioInicial.capacidadCaprino.sistemas.includes(
                                                    item,
                                                )}
                                                onChange={() => {
                                                    const existe =
                                                        inventarioInicial.capacidadCaprino.sistemas.includes(
                                                            item,
                                                        );
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadCaprino: {
                                                            ...prev.capacidadCaprino,
                                                            sistemas: existe
                                                                ? prev.capacidadCaprino.sistemas.filter(
                                                                    (s) => s !== item,
                                                                )
                                                                : [...prev.capacidadCaprino.sistemas, item],
                                                        },
                                                    }));
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* CAMPOS DINÁMICOS */}
                                <div style={{ marginTop: "25px" }}>
                                    <div style={grid3}>
                                        {inventarioInicial.capacidadCaprino.sistemas.includes(
                                            "Cría y Recría",
                                        ) && (
                                                <InputField
                                                    label="Vientres en producción"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadCaprino.vientres ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadCaprino: {
                                                                ...prev.capacidadCaprino,
                                                                vientres: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {inventarioInicial.capacidadCaprino.sistemas.includes(
                                            "Engorde",
                                        ) && (
                                                <InputField
                                                    label="Capacidad de engorde (Cabezas)"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadCaprino.engorde ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadCaprino: {
                                                                ...prev.capacidadCaprino,
                                                                engorde: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {inventarioInicial.capacidadCaprino.sistemas.includes(
                                            "Producción de Leche",
                                        ) && (
                                                <InputField
                                                    label="Producción diaria promedio (Lts)"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadCaprino.leche_diaria ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadCaprino: {
                                                                ...prev.capacidadCaprino,
                                                                leche_diaria: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {(inventarioInicial.capacidadCaprino.sistemas.includes(
                                            "Producción de Carne",
                                        ) ||
                                            inventarioInicial.capacidadCaprino.sistemas.includes(
                                                "Doble Propósito",
                                            )) && (
                                                <InputField
                                                    label="Producción carne estimado anual (Kg)"
                                                    type="number"
                                                    min="0"
                                                    value={inventarioInicial.capacidadCaprino.carne_anual ?? ""}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const LIMITE_DIGITOS = 6;
                                                        if (val.length > LIMITE_DIGITOS) return;

                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadCaprino: {
                                                                ...prev.capacidadCaprino,
                                                                carne_anual: val === "" ? "" : Number(val),
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}
                                    </div>
                                </div>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Cunicola") && (
                            <FormSection title="Cunícola">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.cunicola).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.cunicola[item] ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    cunicola: {
                                                        ...prev.cunicola,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>

                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginTop: "15px",
                                    }}
                                >
                                    Total Cunícola:{" "}
                                    {Object.values(inventarioInicial.cunicola).reduce(
                                        (a, b) => (Number(a) || 0) + (Number(b) || 0),
                                        0,
                                    )}
                                </p>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Cunicola") && (
                            <FormSection title="Capacidad Productiva Cunícola">
                                {/* SISTEMAS PRODUCTIVOS */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "700",
                                            color: "#136442",
                                            marginBottom: "15px",
                                            fontSize: "15px",
                                        }}
                                    >
                                        Sistemas Productivos Cunícolas
                                    </p>
                                    <div style={gridCheck}>
                                        {[
                                            "Producción de Carne",
                                            "Pie de Cría (Genética)",
                                            "Mascotas / Peletería",
                                        ].map((item) => {
                                            const existe = inventarioInicial.capacidadCunicola.sistemas.includes(item);
                                            return (
                                                <ModernCheckbox
                                                    key={item}
                                                    label={item}
                                                    checked={existe}
                                                    onChange={() => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadCunicola: {
                                                                ...prev.capacidadCunicola,
                                                                sistemas: existe
                                                                    ? prev.capacidadCunicola.sistemas.filter((s) => s !== item)
                                                                    : [...prev.capacidadCunicola.sistemas, item],
                                                            },
                                                        }));
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* CAMPOS DINÁMICOS */}
                                <div style={{ marginTop: "25px" }}>
                                    <div style={grid3}>
                                        <InputField
                                            label="Número total de jaulas madre"
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.capacidadCunicola.jaulas_madre ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    capacidadCunicola: {
                                                        ...prev.capacidadCunicola,
                                                        jaulas_madre: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />

                                        {inventarioInicial.capacidadCunicola.sistemas.includes("Producción de Carne") && (
                                            <InputField
                                                label="Canales / Carne estimada anual (Kg)"
                                                type="number"
                                                min="0"
                                                value={inventarioInicial.capacidadCunicola.carne_anual ?? ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const LIMITE_DIGITOS = 6;
                                                    if (val.length > LIMITE_DIGITOS) return;

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadCunicola: {
                                                            ...prev.capacidadCunicola,
                                                            carne_anual: val === "" ? "" : Number(val),
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                        {inventarioInicial.capacidadCunicola.sistemas.includes("Pie de Cría (Genética)") && (
                                            <InputField
                                                label="Conejas reproductoras activas"
                                                type="number"
                                                min="0"
                                                value={inventarioInicial.capacidadCunicola.reproductoras ?? ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const LIMITE_DIGITOS = 6;
                                                    if (val.length > LIMITE_DIGITOS) return;

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadCunicola: {
                                                            ...prev.capacidadCunicola,
                                                            reproductoras: val === "" ? "" : Number(val),
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Avicola") && (
                            <FormSection title="Avícola">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.avicola).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.avicola[item] ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    avicola: {
                                                        ...prev.avicola,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>

                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginTop: "15px",
                                    }}
                                >
                                    Total Avícola:{" "}
                                    {Object.values(inventarioInicial.avicola).reduce(
                                        (a, b) => (Number(a) || 0) + (Number(b) || 0),
                                        0,
                                    )}
                                </p>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Avicola") && (
                            <FormSection title="Capacidad Productiva Avícola">
                                {/* SISTEMAS PRODUCTIVOS */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "700",
                                            color: "#136442",
                                            marginBottom: "15px",
                                            fontSize: "15px",
                                        }}
                                    >
                                        Sistemas Productivos Avícolas
                                    </p>
                                    <div style={gridCheck}>
                                        {[
                                            "Producción de Huevo (Postura)",
                                            "Pollo de Engorde",
                                            "Recría / Levantes",
                                            "Aves de Traspatio (Doble Propósito)",
                                        ].map((item) => {
                                            const existe = inventarioInicial.capacidadAvicola.sistemas.includes(item);
                                            return (
                                                <ModernCheckbox
                                                    key={item}
                                                    label={item}
                                                    checked={existe}
                                                    onChange={() => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadAvicola: {
                                                                ...prev.capacidadAvicola,
                                                                sistemas: existe
                                                                    ? prev.capacidadAvicola.sistemas.filter((s) => s !== item)
                                                                    : [...prev.capacidadAvicola.sistemas, item],
                                                            },
                                                        }));
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* CAMPOS DINÁMICOS */}
                                <div style={{ marginTop: "25px" }}>
                                    <div style={grid3}>
                                        {inventarioInicial.capacidadAvicola.sistemas.includes(
                                            "Producción de Huevo (Postura)"
                                        ) && (
                                                <>
                                                    <InputField
                                                        label="Capacidad de alojamiento (Avícola)"
                                                        type="number"
                                                        min="0"
                                                        value={inventarioInicial.capacidadAvicola.capacidad_alojamiento ?? ""}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            const LIMITE_DIGITOS = 6;
                                                            if (val.length > LIMITE_DIGITOS) return;

                                                            setInventarioInicial((prev) => ({
                                                                ...prev,
                                                                capacidadAvicola: {
                                                                    ...prev.capacidadAvicola,
                                                                    capacidad_alojamiento: val === "" ? "" : Number(val),
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                    <InputField
                                                        label="Producción diaria (Cartones/Huevos)"
                                                        type="number"
                                                        min="0"
                                                        value={inventarioInicial.capacidadAvicola.produccion_huevos ?? ""}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            const LIMITE_DIGITOS = 6;
                                                            if (val.length > LIMITE_DIGITOS) return;

                                                            setInventarioInicial((prev) => ({
                                                                ...prev,
                                                                capacidadAvicola: {
                                                                    ...prev.capacidadAvicola,
                                                                    produccion_huevos: val === "" ? "" : Number(val),
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                </>
                                            )}

                                        {inventarioInicial.capacidadAvicola.sistemas.includes("Pollo de Engorde") && (
                                            <InputField
                                                label="Capacidad por ciclo / lote"
                                                type="number"
                                                min="0"
                                                value={inventarioInicial.capacidadAvicola.capacidad_lote ?? ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const LIMITE_DIGITOS = 6;
                                                    if (val.length > LIMITE_DIGITOS) return;

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadAvicola: {
                                                            ...prev.capacidadAvicola,
                                                            capacidad_lote: val === "" ? "" : Number(val),
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Apicola") && (
                            <FormSection title="Apícola">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.apicola).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.apicola[item] ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    apicola: {
                                                        ...prev.apicola,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>

                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginTop: "15px",
                                    }}
                                >
                                    Total Colmenas:{" "}
                                    {Object.values(inventarioInicial.apicola).reduce(
                                        (a, b) => (Number(a) || 0) + (Number(b) || 0),
                                        0,
                                    )}
                                </p>
                            </FormSection>
                        )}

                    {subCaracterizacion === "animal" &&
                        inventarioInicial.especiesSeleccionadas.includes("Apicola") && (
                            <FormSection title="Capacidad Productiva Apícola">
                                {/* SISTEMAS PRODUCTIVOS */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: "700",
                                            color: "#136442",
                                            marginBottom: "15px",
                                            fontSize: "15px",
                                        }}
                                    >
                                        Sistemas Productivos Apícolas
                                    </p>
                                    <div style={gridCheck}>
                                        {[
                                            "Producción de Miel",
                                            "Producción de Derivados (Polen/Cera)",
                                            "Crianza de Reinas y Núcleos",
                                        ].map((item) => {
                                            const existe = inventarioInicial.capacidadApicola.sistemas.includes(item);
                                            return (
                                                <ModernCheckbox
                                                    key={item}
                                                    label={item}
                                                    checked={existe}
                                                    onChange={() => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadApicola: {
                                                                ...prev.capacidadApicola,
                                                                sistemas: existe
                                                                    ? prev.capacidadApicola.sistemas.filter((s) => s !== item)
                                                                    : [...prev.capacidadApicola.sistemas, item],
                                                            },
                                                        }));
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* CAMPOS DINÁMICOS */}
                                <div style={{ marginTop: "25px" }}>
                                    <div style={grid3}>
                                        <InputField
                                            label="Número de colmenas activas"
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.capacidadApicola.colmenas_activas ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    capacidadApicola: {
                                                        ...prev.capacidadApicola,
                                                        colmenas_activas: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />

                                        {inventarioInicial.capacidadApicola.sistemas.includes("Producción de Miel") && (
                                            <InputField
                                                label="Producción estimada anual (Kg/Litros)"
                                                type="number"
                                                min="0"
                                                value={inventarioInicial.capacidadApicola.miel_anual ?? ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const LIMITE_DIGITOS = 6;
                                                    if (val.length > LIMITE_DIGITOS) return;

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadApicola: {
                                                            ...prev.capacidadApicola,
                                                            miel_anual: val === "" ? "" : Number(val),
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                        {inventarioInicial.capacidadApicola.sistemas.includes("Crianza de Reinas y Núcleos") && (
                                            <InputField
                                                label="Núcleos producidos por año"
                                                type="number"
                                                min="0"
                                                value={inventarioInicial.capacidadApicola.nucleos_anuales ?? ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const LIMITE_DIGITOS = 6;
                                                    if (val.length > LIMITE_DIGITOS) return;

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadApicola: {
                                                            ...prev.capacidadApicola,
                                                            nucleos_anuales: val === "" ? "" : Number(val),
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </FormSection>
                        )}

                    {subCaracterizacion === "vegetal" && (
                        <FormSection title="Producción Vegetal">
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "24px",
                                    marginBottom: "20px",
                                }}
                            >
                                {rubrosVegetales.map((item, index) => {
                                    // Base de estilos estilizada para los select de esta sección
                                    const selectStyleBase = {
                                        ...inputStyle,
                                        appearance: "none",
                                        WebkitAppearance: "none",
                                        MozAppearance: "none",
                                        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "right 12px center",
                                        backgroundSize: "16px",
                                        paddingRight: "40px",
                                        cursor: "pointer",
                                        backgroundColor: "#ffffff",
                                        borderRadius: "10px",
                                        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                                    };

                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                border: "1px solid #e2e8f0",
                                                borderRadius: "14px",
                                                padding: "20px",
                                                background: "#ffffff",
                                                position: "relative",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                                            }}
                                        >
                                            {/* Encabezado del ítem */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    marginBottom: "15px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontWeight: "600",
                                                        color: "#475569",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    Rubro #{index + 1}
                                                </span>
                                            </div>

                                            {/* Grid estructurado simétricamente */}
                                            <div style={grid3}>
                                                {/* 1. Campo Rubro como SELECT */}
                                                <div>
                                                    <label style={labelStyle}>Rubro</label>
                                                    <select
                                                        style={{
                                                            ...selectStyleBase,
                                                            borderColor: erroresFilas[`${index}-rubro`] ? "#dc2626" : "#e2e8f0",
                                                        }}
                                                        value={item.rubro}
                                                        onChange={(e) =>
                                                            actualizarRubroVegetal(index, "rubro", e.target.value)
                                                        }
                                                    >
                                                        <option value="">Seleccione un Rubro</option>
                                                        {LISTA_RUBROS_VEGETALES.map((rubroNombre) => (
                                                            <option key={rubroNombre} value={rubroNombre}>
                                                                {rubroNombre}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {erroresFilas[`${index}-rubro`] && (
                                                        <span style={{ color: "#dc2626", fontSize: "11px", display: "block", marginTop: "4px" }}>
                                                            {erroresFilas[`${index}-rubro`]}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* 2. Campo Hectáreas */}
                                                <div>
                                                    <InputField
                                                        label="Hectáreas Sembradas (ha)"
                                                        type="number"
                                                        min="0"
                                                        value={item.hectareas}
                                                        onChange={(e) => {
                                                            const valorIngresado = parseFloat(e.target.value) || 0;
                                                            const superficieTotal = parseFloat(predioActivo?.superficie) || 0;

                                                            // Actualizamos el estado normalmente
                                                            actualizarRubroVegetal(index, "hectareas", e.target.value);

                                                            // Validación en tiempo real sobre el objeto de errores de la fila
                                                            if (valorIngresado > superficieTotal) {
                                                                setErroresFilas(prev => ({
                                                                    ...prev,
                                                                    [`${index}-hectareas`]: `No puede superar la superficie total del predio (${superficieTotal} ha).`
                                                                }));
                                                            } else {
                                                                // Si el valor es correcto, removemos el error de este campo
                                                                setErroresFilas(prev => {
                                                                    const copiaErrores = { ...prev };
                                                                    delete copiaErrores[`${index}-hectareas`];
                                                                    return copiaErrores;
                                                                });
                                                            }
                                                        }}
                                                        style={{
                                                            borderColor: erroresFilas[`${index}-hectareas`] ? "#dc2626" : "#e2e8f0",
                                                        }}
                                                    />
                                                    {erroresFilas[`${index}-hectareas`] && (
                                                        <span style={{ color: "#dc2626", fontSize: "11px", display: "block", marginTop: "4px", fontWeight: "500" }}>
                                                            {erroresFilas[`${index}-hectareas`]}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* 3. Estado del Cultivo */}
                                                <div>
                                                    <label style={labelStyle}>Estado del Cultivo</label>
                                                    <select
                                                        style={{
                                                            ...selectStyleBase,
                                                            borderColor: erroresFilas[`${index}-estado`] ? "#dc2626" : "#e2e8f0",
                                                        }}
                                                        value={item.estado}
                                                        onChange={(e) =>
                                                            actualizarRubroVegetal(index, "estado", e.target.value)
                                                        }
                                                    >
                                                        <option value="">Seleccione</option>
                                                        <option value="Excelente">Excelente</option>
                                                        <option value="Bueno">Bueno</option>
                                                        <option value="Regular">Regular</option>
                                                        <option value="Malo">Malo</option>
                                                    </select>
                                                    {erroresFilas[`${index}-estado`] && (
                                                        <span style={{ color: "#dc2626", fontSize: "11px", display: "block", marginTop: "4px" }}>
                                                            {erroresFilas[`${index}-estado`]}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* 4. Tipo de Riego */}
                                                <div>
                                                    <label style={labelStyle}>Tipo de Riego</label>
                                                    <select
                                                        style={{
                                                            ...selectStyleBase,
                                                            borderColor: erroresFilas[`${index}-riego`] ? "#dc2626" : "#e2e8f0",
                                                        }}
                                                        value={item.riego}
                                                        onChange={(e) =>
                                                            actualizarRubroVegetal(index, "riego", e.target.value)
                                                        }
                                                    >
                                                        <option value="">Seleccione</option>
                                                        <option value="Secano">Secano</option>
                                                        <option value="Goteo">Goteo</option>
                                                        <option value="Aspersión">Aspersión</option>
                                                        <option value="Inundación">Inundación</option>
                                                    </select>
                                                    {erroresFilas[`${index}-riego`] && (
                                                        <span style={{ color: "#dc2626", fontSize: "11px", display: "block", marginTop: "4px" }}>
                                                            {erroresFilas[`${index}-riego`]}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* 5. Ciclo Productivo */}
                                                <div>
                                                    <label style={labelStyle}>Ciclo Productivo</label>
                                                    <select
                                                        style={{
                                                            ...selectStyleBase,
                                                            borderColor: erroresFilas[`${index}-ciclo_productivo`] ? "#dc2626" : "#e2e8f0",
                                                        }}
                                                        value={item.ciclo_productivo}
                                                        onChange={(e) =>
                                                            actualizarRubroVegetal(index, "ciclo_productivo", e.target.value)
                                                        }
                                                    >
                                                        <option value="">Seleccione</option>
                                                        <option value="Corto">Corto</option>
                                                        <option value="Semipermanente">Semipermanente</option>
                                                        <option value="Permanente">Permanente</option>
                                                        <option value="Anual">Anual</option>
                                                    </select>
                                                    {erroresFilas[`${index}-ciclo_productivo`] && (
                                                        <span style={{ color: "#dc2626", fontSize: "11px", display: "block", marginTop: "4px" }}>
                                                            {erroresFilas[`${index}-ciclo_productivo`]}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* 6. Tipo de Producción */}
                                                <div>
                                                    <label style={labelStyle}>Tipo de Producción</label>
                                                    <select
                                                        style={{
                                                            ...selectStyleBase,
                                                            borderColor: erroresFilas[`${index}-tipo_produccion`] ? "#dc2626" : "#e2e8f0",
                                                        }}
                                                        value={item.tipo_produccion}
                                                        onChange={(e) =>
                                                            actualizarRubroVegetal(index, "tipo_produccion", e.target.value)
                                                        }
                                                    >
                                                        <option value="">Seleccione</option>
                                                        <option value="Tradicional">Tradicional</option>
                                                        <option value="Tecnificada">Tecnificada</option>
                                                        <option value="Orgánica">Orgánica</option>
                                                        <option value="Intensiva">Intensiva</option>
                                                        <option value="Extensiva">Extensiva</option>
                                                    </select>
                                                    {erroresFilas[`${index}-tipo_produccion`] && (
                                                        <span style={{ color: "#dc2626", fontSize: "11px", display: "block", marginTop: "4px" }}>
                                                            {erroresFilas[`${index}-tipo_produccion`]}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* 7. Campo Producción Estimada */}
                                                <div>
                                                    <InputField
                                                        label="Producción Estimada (Kg)"
                                                        type="number"
                                                        min="0"
                                                        value={item.produccion_estimada}
                                                        onChange={(e) =>
                                                            actualizarRubroVegetal(index, "produccion_estimada", e.target.value)
                                                        }
                                                        style={{
                                                            borderColor: erroresFilas[`${index}-produccion_estimada`] ? "#dc2626" : "#e2e8f0",
                                                        }}
                                                    />
                                                    {erroresFilas[`${index}-produccion_estimada`] && (
                                                        <span style={{ color: "#dc2626", fontSize: "11px", display: "block", marginTop: "4px" }}>
                                                            {erroresFilas[`${index}-produccion_estimada`]}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* 8. Destino de Producción */}
                                                <div>
                                                    <label style={labelStyle}>Destino de Producción</label>
                                                    <select
                                                        style={{
                                                            ...selectStyleBase,
                                                            borderColor: erroresFilas[`${index}-destino`] ? "#dc2626" : "#e2e8f0",
                                                        }}
                                                        value={item.destino}
                                                        onChange={(e) =>
                                                            actualizarRubroVegetal(index, "destino", e.target.value)
                                                        }
                                                    >
                                                        <option value="">Seleccione</option>
                                                        <option value="Consumo">Consumo</option>
                                                        <option value="Venta">Venta</option>
                                                        <option value="Mixto">Mixto</option>
                                                        <option value="Industrial">Industrial</option>
                                                    </select>
                                                    {erroresFilas[`${index}-destino`] && (
                                                        <span style={{ color: "#dc2626", fontSize: "11px", display: "block", marginTop: "4px" }}>
                                                            {erroresFilas[`${index}-destino`]}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Contenedor del botón eliminar */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "flex-end",
                                                        height: "100%",
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => eliminarRubroVegetal(index)}
                                                        style={{
                                                            background: "#dc2626",
                                                            color: "#fff",
                                                            border: "none",
                                                            padding: "10px 20px",
                                                            borderRadius: "10px",
                                                            cursor: "pointer",
                                                            width: "100%",
                                                            height: "42px",
                                                            fontWeight: "500",
                                                            marginBottom: "15px",
                                                            transition: "background 0.2s ease",
                                                        }}
                                                        onMouseOver={(e) => e.currentTarget.style.background = "#b91c1c"}
                                                        onMouseOut={(e) => e.currentTarget.style.background = "#dc2626"}
                                                    >
                                                        Eliminar Rubro
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Botón principal de agregar */}
                            <button
                                type="button"
                                onClick={agregarRubroVegetal}
                                style={{
                                    background: "#136442",
                                    color: "#fff",
                                    border: "none",
                                    padding: "12px 20px",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    transition: "background 0.2s ease",
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = "#0f5235"}
                                onMouseOut={(e) => e.currentTarget.style.background = "#136442"}
                            >
                                <span style={{ fontSize: "16px" }}>+</span> Agregar Rubro
                            </button>
                        </FormSection>
                    )}

                    {subCaracterizacion === "maquinaria" && (
                        <FormSection title="Maquinarias y Equipos">
                            <div style={gridCheck}>
                                {[
                                    "Maquinaria Agrícola de Ruedas",
                                    "Implementos Agrícolas",
                                    "Equipos de Riego",
                                    "Otros Equipos",
                                ].map((item) => {
                                    const existe = inventarioInicial.maquinariaSeleccionada.includes(item);
                                    return (
                                        <ModernCheckbox
                                            key={item}
                                            label={item}
                                            checked={existe}
                                            onChange={() => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    maquinariaSeleccionada: existe
                                                        ? prev.maquinariaSeleccionada.filter((i) => i !== item)
                                                        : [...prev.maquinariaSeleccionada, item],
                                                }));
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </FormSection>
                    )}

                    {subCaracterizacion === "maquinaria" &&
                        inventarioInicial.maquinariaSeleccionada.includes("Maquinaria Agrícola de Ruedas") && (
                            <FormSection title="Maquinaria Agrícola de Ruedas">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.maquinaria_ruedas).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.maquinaria_ruedas[item] ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    maquinaria_ruedas: {
                                                        ...prev.maquinaria_ruedas,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>
                            </FormSection>
                        )}

                    {subCaracterizacion === "maquinaria" &&
                        inventarioInicial.maquinariaSeleccionada.includes("Implementos Agrícolas") && (
                            <FormSection title="Implementos Agrícolas">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.implementos).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.implementos[item] ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    implementos: {
                                                        ...prev.implementos,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>
                            </FormSection>
                        )}

                    {subCaracterizacion === "maquinaria" &&
                        inventarioInicial.maquinariaSeleccionada.includes("Equipos de Riego") && (
                            <FormSection title="Equipos de Riego">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.riego).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.riego[item] ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    riego: {
                                                        ...prev.riego,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>
                            </FormSection>
                        )}

                    {subCaracterizacion === "maquinaria" &&
                        inventarioInicial.maquinariaSeleccionada.includes("Otros Equipos") && (
                            <FormSection title="Otros Equipos">
                                <div style={grid3}>
                                    {Object.keys(inventarioInicial.otros_equipos).map((item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            min="0"
                                            value={inventarioInicial.otros_equipos[item] ?? ""}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const LIMITE_DIGITOS = 6;
                                                if (val.length > LIMITE_DIGITOS) return;

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    otros_equipos: {
                                                        ...prev.otros_equipos,
                                                        [item]: val === "" ? "" : Number(val),
                                                    },
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>
                            </FormSection>
                        )}

                    {/* 💾 BOTÓN GUARDAR */}
                    <div style={{ textAlign: "right", paddingBottom: "40px" }}>
                        <button onClick={guardarInventario} style={btnPrincipal}>
                            Guardar Inventario
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
