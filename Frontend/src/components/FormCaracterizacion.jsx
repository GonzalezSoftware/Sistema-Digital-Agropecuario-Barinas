// src/components/FormCaracterizacion.jsx
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
    FormSection,
    btnPrincipal,
    gridCheck,
    radioLabel,
    grid3,
    InputField,
    labelStyle,
    inputStyle,
    SelectField,
} from "../pages/Produccion/DashboardProduccion";

export default function FormCaracterizacion({
    predioActivo,
    rubrosVegetales,
    setRubrosVegetales,
    inventarioInicial,
    setInventarioInicial,
    setTabActiva,
    subCaracterizacion,
    setSubCaracterizacion,
}) {

    const [codigoGenerado, setCodigoGenerado] = useState("");
    const [codigoIngresado, setCodigoIngresado] = useState("");
    // ── COMPONENTE DE INPUT NUMÉRICO CON TIPOGRAFÍA HEREDADA ──────────────────
    const NumericInputField = ({
        label,
        value,
        onChange,
        placeholder = "0",
        min = 0,
    }) => {
        return (
            <div style={{ marginBottom: "15px" }}>
                {label && <label style={labelStyle}>{label}</label>}
                <input
                    type="number"
                    min={min}
                    placeholder={placeholder}
                    value={value ?? ""}
                    onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e" || e.key === "+") {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => {
                        const valorIngresado = parseInt(e.target.value, 10);
                        const valorLimpio =
                            isNaN(valorIngresado) || valorIngresado < min
                                ? min
                                : valorIngresado;
                        onChange(valorLimpio);
                    }}
                    style={{
                        ...inputStyle, // <--- Hereda el estilo exacto de tus otros inputs
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                />
            </div>
        );
    };

    // ── COMPONENTE DE CHECKBOX / SWITCH CON TIPOGRAFÍA HEREDADA ──────────────────
    const ModernCheckbox = ({ label, checked, onChange }) => {
        return (
            <div
                onClick={() => onChange(!checked)}
                style={{
                    ...radioLabel, // <--- Usa la base original (tipografía, cursor, colores bases)
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
                {/* Cuadro de verificación moderno */}
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
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    )}
                </div>
                {/* El texto mantendrá la tipografía nativa de la app */}
                <span>{label}</span>
            </div>
        );
    };

    // Lista de rubros vegetales comunes ordenada alfabéticamente
    const LISTA_RUBROS_VEGETALES = [
        "Caraota",
        "Maíz Blanco",
        "Maíz Amarillo",
        "Arroz",
        "Sorgo",
        "Café",
        "Cacao",
        "Caña de Azúcar",
        "Yuca",
        "Plátano",
        "Cambur",
        "Auyama",
        "Tomate",
        "Cebolla",
        "Pimentón",
    ].sort((a, b) => a.localeCompare(b)); // Esto asegura el orden alfabético estricto

    // Dentro de FormCaracterizacion, arriba:
    const [erroresFilas, setErroresFilas] = useState({});

    const agregarRubroVegetal = () => {
        setRubrosVegetales((prev) => [
            ...prev,
            {
                rubro: "",
                hectares: "",
                estado: "",
                riego: "",
                ciclo_productivo: "",
                tipo_produccion: "",
                produccion_estimada: "",
                destino: "",
            },
        ]);
    };

    const eliminarRubroVegetal = (index) => {
        setRubrosVegetales((prev) => prev.filter((_, i) => i !== index));
    };

    const actualizarRubroVegetal = (index, campo, valor) => {
        // Validación preventiva para que no permita escribir números negativos
        if (
            (campo === "hectareas" || campo === "produccion_estimada") &&
            valor !== ""
        ) {
            if (Number(valor) < 0) {
                return; // Bloquea el cambio inmediatamente si es negativo
            }
        }

        // 1. Actualizamos el estado normal del rubro
        setRubrosVegetales((prev) => {
            const copia = [...prev];
            copia[index][campo] = valor;
            return copia;
        });

        // 2. Validación en tiempo real del campo modificado
        let mensajeError = "";

        if (campo === "hectareas" || campo === "produccion_estimada") {
            if (valor === "") {
                mensajeError = "Este campo es requerido";
            } else if (isNaN(valor) || Number(valor) <= 0) {
                mensajeError = "Debe ser un número mayor a 0";
            } else if (Number(valor) > 10000) {
                mensajeError = "Cantidad exagerada. Verifique.";
            }
        }

        if (campo === "rubro") {
            if (valor.trim() === "") {
                mensajeError = "Seleccione un rubro";
            } else if (/[0-9]/.test(valor)) {
                mensajeError = "El rubro no puede contener números";
            }
        }

        // 3. Guardamos el error apuntando exactamente al índice y columna afectada
        setErroresFilas((prev) => ({
            ...prev,
            [`${index}-${campo}`]: mensajeError,
        }));
    };

    const guardarInventario = async () => {
        if (!predioActivo?.id_predio) {
            Swal.fire({
                icon: "warning",
                title: "Predio no seleccionado",
                text: "Debe seleccionar un predio",
                confirmButtonColor: '#136442',
                didOpen: () => {
                    const popup = Swal.getPopup();
                    if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
                },
            });
            return;
        }

        // ─────────────────────────────
        // CONFIRMACIÓN
        // ─────────────────────────────
        const confirmacion = await Swal.fire({
            title: "¿Guardar caracterización?",
            text: "Se enviará un código de validación al productor.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#136442",
            didOpen: () => {
                const popup = Swal.getPopup();
                if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
            },
        });

        if (!confirmacion.isConfirmed) return;

        // ─────────────────────────────
        // ENVIAR WHATSAPP (Django genera el código)
        // ─────────────────────────────
        let codigoServidor = "";
        try {
            const telefono = predioActivo?.productor?.telefono;
            const envio = await axios.post("http://127.0.0.1:8000/api/enviar-codigo/", { telefono });

            codigoServidor = envio.data.codigo.toString();
            setCodigoGenerado(codigoServidor);
            console.log("CÓDIGO RECIBIDO DEL SERVIDOR:", codigoServidor);

            await Swal.fire({
                icon: "success",
                title: "Código enviado",
                text: "El código fue enviado al WhatsApp del productor",
                confirmButtonColor: "#136442",
                didOpen: () => {
                    const popup = Swal.getPopup();
                    if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
                },
            });
        } catch (error) {
            console.error("Error enviando WhatsApp:", error);
            Swal.fire({
                icon: "error",
                title: "Error de comunicación",
                text: "No se pudo enviar el código de validación.",
                confirmButtonColor: "#d32f2f",
                didOpen: () => {
                    const popup = Swal.getPopup();
                    if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
                },
            });
            return;
        }

        // ─────────────────────────────
        // PEDIR CÓDIGO
        // ─────────────────────────────
        const { value: codigoUsuario } = await Swal.fire({
            title: "Validación del Productor",
            input: "text",
            inputLabel: "Ingrese el código enviado al WhatsApp del productor",
            inputPlaceholder: "Ingrese el código",
            confirmButtonText: "Validar",
            confirmButtonColor: "#136442",
            showCancelButton: true,
            didOpen: () => {
                const popup = Swal.getPopup();
                if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
            },
        });

        if (!codigoUsuario) {
            Swal.fire({
                icon: "warning",
                title: "Proceso cancelado",
                confirmButtonColor: "#136442",
                didOpen: () => {
                    const popup = Swal.getPopup();
                    if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
                },
            });
            return;
        }

        // ─────────────────────────────
        // VALIDAR CÓDIGO
        // ─────────────────────────────
        if (codigoUsuario !== codigoServidor) {
            Swal.fire({
                icon: "error",
                title: "Código incorrecto",
                text: "No se pudo validar al productor",
                confirmButtonColor: "#d32f2f",
                didOpen: () => {
                    const popup = Swal.getPopup();
                    if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
                },
            });
            return;
        }

        // ─────────────────────────────
        // ANIMACIÓN DE CARGA (Evita el doble envío al procesar con Django)
        // ─────────────────────────────
        Swal.fire({
            title: 'Procesando...',
            text: 'Guardando caracterización en el servidor, por favor espere.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                const popup = Swal.getPopup();
                if (popup) popup.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
            }
        });

        // ─────────────────────────────
        // DATA PARA DJANGO
        // ─────────────────────────────
        try {
            const data = {
                caracterizacion_completada: true,

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

            console.log("DATOS ENVIADOS:", data);

            const response = await axios.patch(
                `http://127.0.0.1:8000/api/predios/${predioActivo.id_predio}/`,
                data,
            );

            console.log(response.data);

            // ─────────────────────────────
            // ÉXITO Y ACTUALIZACIÓN DE PÁGINA
            // ─────────────────────────────
            Swal.fire({
                icon: "success",
                title: "Caracterización guardada",
                text: "La información fue validada por el productor",
                confirmButtonColor: "#136442",
                confirmButtonText: "Aceptar",
                didOpen: () => {
                    const popup = Swal.getPopup();
                    if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload(); // Recarga la página inmediatamente
                }
            });

        } catch (error) {
            console.error("ERROR:", error.response?.data || error.message);

            Swal.fire({
                icon: "error",
                title: "Error al guardar",
                text: "Ocurrió un problema en el servidor al procesar el inventario.",
                confirmButtonColor: "#d32f2f",
                confirmButtonText: "Entendido",
                didOpen: () => {
                    const popup = Swal.getPopup();
                    if (popup) popup.style.setProperty("font-family", "'Poppins', sans-serif", "important");
                },
            });
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.bovinos[item]}
                                            onChange={(nuevoValor) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    bovinos: {
                                                        ...prev.bovinos,
                                                        [item]: nuevoValor,
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
                                        (a, b) => a + b,
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
                                                <NumericInputField
                                                    label="Producción de leche diaria (L)"
                                                    value={inventarioInicial.capacidadBovina.leche_diaria}
                                                    onChange={(nuevoValor) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBovina: {
                                                                ...prev.capacidadBovina,
                                                                leche_diaria: nuevoValor,
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
                                                <NumericInputField
                                                    label="Producción carne anual (Kg)"
                                                    value={inventarioInicial.capacidadBovina.carne_anual}
                                                    onChange={(nuevoValor) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBovina: {
                                                                ...prev.capacidadBovina,
                                                                carne_anual: nuevoValor,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* CRÍA */}
                                        {inventarioInicial.capacidadBovina.sistemas.includes(
                                            "Cría",
                                        ) && (
                                                <NumericInputField
                                                    label="Cantidad de partos anuales"
                                                    value={inventarioInicial.capacidadBovina.partos_anuales} // Asegúrate de tener esta clave en tu estado inicial
                                                    onChange={(nuevoValor) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBovina: {
                                                                ...prev.capacidadBovina,
                                                                partos_anuales: nuevoValor,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* GENÉTICA */}
                                        {inventarioInicial.capacidadBovina.sistemas.includes(
                                            "Genética",
                                        ) && (
                                                <NumericInputField
                                                    label="Cantidad de reproductores"
                                                    value={inventarioInicial.capacidadBovina.reproductores} // Asegúrate de tener esta clave en tu estado inicial
                                                    onChange={(nuevoValor) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBovina: {
                                                                ...prev.capacidadBovina,
                                                                reproductores: nuevoValor,
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.bubalinos[item]}
                                            onChange={(nuevoValor) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    bubalinos: {
                                                        ...prev.bubalinos,
                                                        [item]: nuevoValor,
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
                                        (a, b) => a + b,
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
                                                <NumericInputField
                                                    label="Producción de leche diaria (L)"
                                                    value={inventarioInicial.capacidadBubalina.leche_diaria}
                                                    onChange={(nuevoValor) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBubalina: {
                                                                ...prev.capacidadBubalina,
                                                                leche_diaria: nuevoValor,
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
                                                <NumericInputField
                                                    label="Producción carne anual (Kg)"
                                                    value={inventarioInicial.capacidadBubalina.carne_anual}
                                                    onChange={(nuevoValor) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBubalina: {
                                                                ...prev.capacidadBubalina,
                                                                carne_anual: nuevoValor,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* CRÍA */}
                                        {inventarioInicial.capacidadBubalina.sistemas.includes(
                                            "Cría",
                                        ) && (
                                                <NumericInputField
                                                    label="Cantidad de partos anuales"
                                                    value={
                                                        inventarioInicial.capacidadBubalina.partos_anuales
                                                    }
                                                    onChange={(nuevoValor) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBubalina: {
                                                                ...prev.capacidadBubalina,
                                                                partos_anuales: nuevoValor,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* GENÉTICA */}
                                        {inventarioInicial.capacidadBubalina.sistemas.includes(
                                            "Genética",
                                        ) && (
                                                <NumericInputField
                                                    label="Cantidad de reproductores"
                                                    value={
                                                        inventarioInicial.capacidadBubalina.reproductores
                                                    }
                                                    onChange={(nuevoValor) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadBubalina: {
                                                                ...prev.capacidadBubalina,
                                                                reproductores: nuevoValor,
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.equinos[item]}
                                            onChange={(valorLimpio) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    equinos: {
                                                        ...prev.equinos,
                                                        [item]: valorLimpio,
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
                                        (a, b) => a + b,
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
                                                onChange={(nuevoChecked) => {
                                                    setInventarioInicial((prev) => {
                                                        const nuevosSistemas = !nuevoChecked
                                                            ? prev.capacidadEquina.sistemas.filter(
                                                                (s) => s !== item.nombre,
                                                            )
                                                            : [...prev.capacidadEquina.sistemas, item.nombre];

                                                        return {
                                                            ...prev,
                                                            capacidadEquina: {
                                                                ...prev.capacidadEquina,
                                                                sistemas: nuevosSistemas,
                                                                // Si pasa a falso (se desmarca), resetea automáticamente su cantidad a 0
                                                                ...(!nuevoChecked ? { [item.llave]: 0 } : {}),
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
                                                // Solo renderiza el input numérico si el sistema está seleccionado
                                                inventarioInicial.capacidadEquina.sistemas.includes(
                                                    sistema,
                                                ) && (
                                                    <NumericInputField
                                                        key={llave}
                                                        label={label}
                                                        value={inventarioInicial.capacidadEquina[llave]}
                                                        onChange={(valorLimpio) => {
                                                            setInventarioInicial((prev) => ({
                                                                ...prev,
                                                                capacidadEquina: {
                                                                    ...prev.capacidadEquina,
                                                                    [llave]: valorLimpio,
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.ovinos[item]}
                                            onChange={(valorLimpio) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    ovinos: {
                                                        ...prev.ovinos,
                                                        [item]: valorLimpio,
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
                                        (a, b) => a + b,
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
                                                onChange={(nuevoChecked) => {
                                                    setInventarioInicial((prev) => {
                                                        const nuevosSistemas = !nuevoChecked
                                                            ? prev.capacidadOvina.sistemas.filter(
                                                                (s) => s !== item.nombre,
                                                            )
                                                            : [...prev.capacidadOvina.sistemas, item.nombre];

                                                        return {
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                sistemas: nuevosSistemas,
                                                                // Limpia el valor numérico a 0 de forma reactiva al desmarcar la opción
                                                                ...(!nuevoChecked ? { [item.llave]: 0 } : {}),
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
                                                <NumericInputField
                                                    label="Producción carne anual (Kg)"
                                                    value={inventarioInicial.capacidadOvina.carne_anual}
                                                    onChange={(valorLimpio) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                carne_anual: valorLimpio,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* LECHE */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Leche",
                                        ) && (
                                                <NumericInputField
                                                    label="Producción leche diaria (L)"
                                                    value={inventarioInicial.capacidadOvina.leche_diaria}
                                                    onChange={(valorLimpio) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                leche_diaria: valorLimpio,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* LANA */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Lana",
                                        ) && (
                                                <NumericInputField
                                                    label="Producción lana anual (Kg)"
                                                    value={inventarioInicial.capacidadOvina.lana_anual}
                                                    onChange={(valorLimpio) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                lana_anual: valorLimpio,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* CRÍA */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Cría",
                                        ) && (
                                                <NumericInputField
                                                    label="Animales destinados a cría"
                                                    value={inventarioInicial.capacidadOvina.cria}
                                                    onChange={(valorLimpio) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                cria: valorLimpio,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* REPRODUCCIÓN */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Reproducción",
                                        ) && (
                                                <NumericInputField
                                                    label="Reproductores activos"
                                                    value={inventarioInicial.capacidadOvina.reproduccion}
                                                    onChange={(valorLimpio) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                reproduccion: valorLimpio,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* DOBLE PROPÓSITO */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Doble propósito",
                                        ) && (
                                                <NumericInputField
                                                    label="Animales doble propósito"
                                                    value={inventarioInicial.capacidadOvina.doble_proposito}
                                                    onChange={(valorLimpio) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                doble_proposito: valorLimpio,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            )}

                                        {/* GENÉTICA */}
                                        {inventarioInicial.capacidadOvina.sistemas.includes(
                                            "Genética",
                                        ) && (
                                                <NumericInputField
                                                    label="Animales de genética"
                                                    value={inventarioInicial.capacidadOvina.genetica}
                                                    onChange={(valorLimpio) => {
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadOvina: {
                                                                ...prev.capacidadOvina,
                                                                genetica: valorLimpio,
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.porcinos[item]}
                                            onChange={(val) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    porcinos: {
                                                        ...prev.porcinos,
                                                        [item]: val,
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
                                        (a, b) => a + b,
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
                                            <NumericInputField
                                                label="Cantidad destinada a cría"
                                                value={inventarioInicial.capacidadPorcina.cria}
                                                onChange={(val) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            cria: val,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                        {/* ENGORDE */}
                                        {inventarioInicial.capacidadPorcina.sistemas.includes("Engorde") && (
                                            <NumericInputField
                                                label="Capacidad de engorde"
                                                value={inventarioInicial.capacidadPorcina.engorde}
                                                onChange={(val) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            engorde: val,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                        {/* REPRODUCCIÓN */}
                                        {inventarioInicial.capacidadPorcina.sistemas.includes("Reproducción") && (
                                            <NumericInputField
                                                label="Reproductores activos"
                                                value={inventarioInicial.capacidadPorcina.reproduccion}
                                                onChange={(val) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            reproduccion: val,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                        {/* CICLO COMPLETO */}
                                        {inventarioInicial.capacidadPorcina.sistemas.includes("Ciclo completo") && (
                                            <NumericInputField
                                                label="Capacidad ciclo completo"
                                                value={inventarioInicial.capacidadPorcina.ciclo_completo}
                                                onChange={(val) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            ciclo_completo: val,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                        {/* GENÉTICA */}
                                        {inventarioInicial.capacidadPorcina.sistemas.includes("Genética") && (
                                            <NumericInputField
                                                label="Animales de genética"
                                                value={inventarioInicial.capacidadPorcina.genetica}
                                                onChange={(val) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            genetica: val,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                        {/* PRODUCCIÓN CARNE */}
                                        {inventarioInicial.capacidadPorcina.sistemas.includes("Producción de carne") && (
                                            <NumericInputField
                                                label="Producción carne anual (Kg)"
                                                value={inventarioInicial.capacidadPorcina.carne_anual}
                                                onChange={(val) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            carne_anual: val,
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.caprinos[item]}
                                            onChange={(val) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    caprinos: {
                                                        ...prev.caprinos,
                                                        [item]: val,
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
                                        (a, b) => a + b,
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
                                                <NumericInputField
                                                    label="Vientres en producción"
                                                    value={
                                                        inventarioInicial.capacidadCaprino.vientres || ""
                                                    }
                                                    onChange={(val) =>
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadCaprino: {
                                                                ...prev.capacidadCaprino,
                                                                vientres: val,
                                                            },
                                                        }))
                                                    }
                                                />
                                            )}
                                        {inventarioInicial.capacidadCaprino.sistemas.includes(
                                            "Engorde",
                                        ) && (
                                                <NumericInputField
                                                    label="Capacidad de engorde (Cabezas)"
                                                    value={inventarioInicial.capacidadCaprino.engorde || ""}
                                                    onChange={(val) =>
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadCaprino: {
                                                                ...prev.capacidadCaprino,
                                                                engorde: val,
                                                            },
                                                        }))
                                                    }
                                                />
                                            )}
                                        {inventarioInicial.capacidadCaprino.sistemas.includes(
                                            "Producción de Leche",
                                        ) && (
                                                <NumericInputField
                                                    label="Producción diaria promedio (Lts)"
                                                    value={
                                                        inventarioInicial.capacidadCaprino.leche_diaria || ""
                                                    }
                                                    onChange={(val) =>
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadCaprino: {
                                                                ...prev.capacidadCaprino,
                                                                leche_diaria: val,
                                                            },
                                                        }))
                                                    }
                                                />
                                            )}
                                        {(inventarioInicial.capacidadCaprino.sistemas.includes(
                                            "Producción de Carne",
                                        ) ||
                                            inventarioInicial.capacidadCaprino.sistemas.includes(
                                                "Doble Propósito",
                                            )) && (
                                                <NumericInputField
                                                    label="Producción carne estimado anual (Kg)"
                                                    value={
                                                        inventarioInicial.capacidadCaprino.carne_anual || ""
                                                    }
                                                    onChange={(val) =>
                                                        setInventarioInicial((prev) => ({
                                                            ...prev,
                                                            capacidadCaprino: {
                                                                ...prev.capacidadCaprino,
                                                                carne_anual: val,
                                                            },
                                                        }))
                                                    }
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.cunicola[item]}
                                            onChange={(val) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    cunicola: {
                                                        ...prev.cunicola,
                                                        [item]: val,
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
                                        (a, b) => a + b,
                                        0
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
                                        <NumericInputField
                                            label="Número total de jaulas madre"
                                            value={inventarioInicial.capacidadCunicola.jaulas_madre}
                                            onChange={(val) =>
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    capacidadCunicola: {
                                                        ...prev.capacidadCunicola,
                                                        jaulas_madre: val,
                                                    },
                                                }))
                                            }
                                        />

                                        {inventarioInicial.capacidadCunicola.sistemas.includes("Producción de Carne") && (
                                            <NumericInputField
                                                label="Canales / Carne estimada anual (Kg)"
                                                value={inventarioInicial.capacidadCunicola.carne_anual}
                                                onChange={(val) =>
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadCunicola: {
                                                            ...prev.capacidadCunicola,
                                                            carne_anual: val,
                                                        },
                                                    }))
                                                }
                                            />
                                        )}

                                        {inventarioInicial.capacidadCunicola.sistemas.includes("Pie de Cría (Genética)") && (
                                            <NumericInputField
                                                label="Conejas reproductoras activas"
                                                value={inventarioInicial.capacidadCunicola.reproductoras}
                                                onChange={(val) =>
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadCunicola: {
                                                            ...prev.capacidadCunicola,
                                                            reproductoras: val,
                                                        },
                                                    }))
                                                }
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.avicola[item]}
                                            onChange={(val) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    avicola: {
                                                        ...prev.avicola,
                                                        [item]: val,
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
                                        (a, b) => a + b,
                                        0
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
                                                    <NumericInputField
                                                        label="Capacidad de alojamiento (Avícola)"
                                                        value={inventarioInicial.capacidadAvicola.capacidad_alojamiento}
                                                        onChange={(val) =>
                                                            setInventarioInicial((prev) => ({
                                                                ...prev,
                                                                capacidadAvicola: {
                                                                    ...prev.capacidadAvicola,
                                                                    capacidad_alojamiento: val,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                    <NumericInputField
                                                        label="Producción diaria (Cartones/Huevos)"
                                                        value={inventarioInicial.capacidadAvicola.produccion_huevos}
                                                        onChange={(val) =>
                                                            setInventarioInicial((prev) => ({
                                                                ...prev,
                                                                capacidadAvicola: {
                                                                    ...prev.capacidadAvicola,
                                                                    produccion_huevos: val,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </>
                                            )}

                                        {inventarioInicial.capacidadAvicola.sistemas.includes("Pollo de Engorde") && (
                                            <NumericInputField
                                                label="Capacidad por ciclo / lote"
                                                value={inventarioInicial.capacidadAvicola.capacidad_lote}
                                                onChange={(val) =>
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadAvicola: {
                                                            ...prev.capacidadAvicola,
                                                            capacidad_lote: val,
                                                        },
                                                    }))
                                                }
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.apicola[item]}
                                            onChange={(val) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    apicola: {
                                                        ...prev.apicola,
                                                        [item]: val,
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
                                        (a, b) => a + b,
                                        0
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
                                        <NumericInputField
                                            label="Número de colmenas activas"
                                            value={inventarioInicial.capacidadApicola.colmenas_activas}
                                            onChange={(val) =>
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    capacidadApicola: {
                                                        ...prev.capacidadApicola,
                                                        colmenas_activas: val,
                                                    },
                                                }))
                                            }
                                        />

                                        {inventarioInicial.capacidadApicola.sistemas.includes("Producción de Miel") && (
                                            <NumericInputField
                                                label="Producción estimada anual (Kg/Litros)"
                                                value={inventarioInicial.capacidadApicola.miel_anual}
                                                onChange={(val) =>
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadApicola: {
                                                            ...prev.capacidadApicola,
                                                            miel_anual: val,
                                                        },
                                                    }))
                                                }
                                            />
                                        )}

                                        {inventarioInicial.capacidadApicola.sistemas.includes("Crianza de Reinas y Núcleos") && (
                                            <NumericInputField
                                                label="Núcleos producidos por año"
                                                value={inventarioInicial.capacidadApicola.nucleos_anuales}
                                                onChange={(val) =>
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadApicola: {
                                                            ...prev.capacidadApicola,
                                                            nucleos_anuales: val,
                                                        },
                                                    }))
                                                }
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.maquinaria_ruedas[item]}
                                            onChange={(val) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    maquinaria_ruedas: {
                                                        ...prev.maquinaria_ruedas,
                                                        [item]: val,
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.implementos[item]}
                                            onChange={(val) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    implementos: {
                                                        ...prev.implementos,
                                                        [item]: val,
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.riego[item]}
                                            onChange={(val) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    riego: {
                                                        ...prev.riego,
                                                        [item]: val,
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
                                        <NumericInputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            value={inventarioInicial.otros_equipos[item]}
                                            onChange={(val) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    otros_equipos: {
                                                        ...prev.otros_equipos,
                                                        [item]: val,
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
