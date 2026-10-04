import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { validarCampoProductor } from "../components/EmpleadosPrediosValidaciones";

export const grid3 = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" };
export const gridCheck = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" };
export const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" };
export const inputStyle = { width: "100%", padding: "10px 14px", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" };
export const radioLabel = { fontSize: "13px", color: "#334155", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px", background: "#f1f5f9", borderRadius: "8px" };

export const PARROQUIAS_POR_MUNICIPIO = {
    "Barinas": ["Barinas", "Alfredo Arvelo Larriva", "Alto Barinas", "Corazón de Jesús", "El Carmen", "Juan Antonio Rodríguez Domínguez", "Manuel Palacio Fajardo", "Ramón Ignacio Méndez", "Rómulo Betancourt", "Santa Lucía", "Torunos", "San Silvestre"],
    "Alberto Arvelo Torrealba": ["Sabaneta", "Rodriguez Domínguez"],
    "Andrés Eloy Blanco": ["El Cantón", "Santa Cruz de Guacas", "Puerto Vivas"],
    "Antonio José de Sucre": ["Ticoporo", "Andrés Bello", "Úrica"],
    "Arismendi": ["Arismendi", "Guadarrama", "La Unión", "San Antonio"],
    "Bolívar": ["Barinitas", "Altamira de Cáceres", "Calderas"],
    "Cruz Paredes": ["Barrancas", "El Socorro", "Masparrito"],
    "Ezequiel Zamora": ["Santa Bárbara", "José Ignacio del Pumar", "Pedro Briceño Méndez", "Ramón Ignacio Méndez"],
    "Obispos": ["Obispos", "Guasimitos", "El Real", "La Luz"],
    "Pedraza": ["Ciudad Bolivia", "José Ignacio del Pumar", "Páez", "Reyes Cueto"],
    "Rojas": ["Libertad", "Dolores", "Palacios Fajardo", "Santa Rosa"],
    "Sosa": ["Ciudad de Nutrias", "El Regalo", "Puerto de Nutrias", "Santa Catalina"]
};

export const FormSection = ({ title, children }) => (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#136442", marginBottom: "20px", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px" }}>
            {title}
        </h3>
        {children}
    </div>
);

// Reemplaza tu antiguo InputField por este completo:
export const InputField = ({ label, error, prefix, labelStyle, inputStyle, ...props }) => {
    // Depuración: Muestra en la consola el campo y el error actual que recibe
    console.log(`[InputField] Campo: "${props.name || 'sin nombre'}" | Error recibido:`, error);

    return (
        <div style={{ marginBottom: "15px" }}>
            {label && <label style={labelStyle || { fontSize: "12px", fontWeight: "600", color: "#374151" }}>{label}</label>}
            <div style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "all 0.2s ease",
                border: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                backgroundColor: props.disabled ? "#e2e8f0" : (error ? "#fef2f2" : "#f8fafc")
            }}>
                {prefix && (
                    <div style={{
                        height: "42px",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: error ? "#fee2e2" : "#f1f5f9",
                        borderRight: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                        padding: "0 10px"
                    }}>
                        {prefix}
                    </div>
                )}
                <input
                    {...props}
                    style={{
                        ...(inputStyle || { width: "100%", padding: "10px 14px", fontSize: "13px" }),
                        height: "42px",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        margin: 0,
                        cursor: props.disabled ? "not-allowed" : "text",
                        color: props.disabled ? "#475569" : "#1e293b",
                        fontWeight: props.disabled ? "600" : "normal"
                    }}
                />
            </div>
            {error && (
                <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "5px", fontWeight: "600" }}>
                    {error}
                </p>
            )}
        </div>
    );
};
export const SelectField = ({ label, options = [], error, value, onChange, name, disabled, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>{label}</label>
        <select
            name={name}
            value={value || ""}
            onChange={onChange}
            disabled={disabled}
            {...props}
            style={{
                ...inputStyle,
                height: "42px",
                borderRadius: "8px",
                border: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                backgroundColor: disabled ? "#e2e8f0" : (error ? "#fef2f2" : "#f8fafc"),
                cursor: disabled ? "not-allowed" : "pointer",
                color: disabled ? "#475569" : "#1e293b",
                fontWeight: disabled ? "600" : "normal"
            }}
        >
            <option value="" disabled>Seleccione...</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
        {error && (
            <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "5px", fontWeight: "600" }}>
                {error}
            </p>
        )}
    </div>
);

// Custom Hook para manejar toda la lógica de negocio y eventos
export function useEmpleadosRegistroPrediosLogic({ formData, setFormData, setErrors,errors, municipioEmpleado, prefijoCedula, listaPredios}) {
    
    const manejarCambio = (e) => {
        const { name, value } = e.target;

        // 1. Actualizamos el valor en el formData en tiempo real
        setFormData((prev) => ({
            ...(prev || {}),
            [name]: value
        }));

        // 2. Delegamos toda la validación a tu archivo externo EmpleadosPrediosValidaciones
        if (typeof validarCampoProductor === "function") {
            validarCampoProductor(name, value, formData, setErrors, listaPredios, municipioEmpleado);
        }
    };

    useEffect(() => {
        if (municipioEmpleado && formData.municipio !== municipioEmpleado) {
            setFormData(prev => ({
                ...(prev || {}),
                municipio: municipioEmpleado
            }));
        }
    }, [municipioEmpleado, formData.municipio, setFormData]);

    const obtenerParroquias = () => {
        const muniActual = municipioEmpleado || formData.municipio || "";
        if (!muniActual) return [];

        const limpiarStr = (str) =>
            str ? str.toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

        const muniLimpio = limpiarStr(muniActual);

        const municipioKey = Object.keys(PARROQUIAS_POR_MUNICIPIO).find(
            m => limpiarStr(m) === muniLimpio
        );

        return municipioKey ? PARROQUIAS_POR_MUNICIPIO[municipioKey] : [];
    };

    const listaParroquias = obtenerParroquias();

    const manejarInfra = (key, e) => {
        const valorOriginal = e.target.value;
        const valorLimpio = valorOriginal.replace(/[^0-9]/g, "");

        setFormData(prev => ({
            ...(prev || {}),
            infraestructura: {
                ...((prev || {}).infraestructura || {}),
                [key]: valorLimpio
            }
        }));

        setErrors(prev => ({
            ...(prev || {}),
            [`infra_${key}`]: valorOriginal !== valorLimpio ? "Solo se permiten números" : ""
        }));
    };

    const manejarChecklist = (campo, item) => {
        setFormData(prev => {
            const currentPrev = prev || {};
            const listaActual = Array.isArray(currentPrev[campo]) ? currentPrev[campo] : [];
            const existe = listaActual.includes(item);
            return {
                ...currentPrev,
                [campo]: existe
                    ? listaActual.filter(s => s !== item)
                    : [...listaActual, item]
            };
        });
    };

    // AQUÍ COLOCAS LA FUNCIÓN QUE VALIDA EL FORMULARIO COMPLETO
    const esFormularioValido = () => {
        const camposRequeridos = [
            "productor_nombre",
            "productor_cedula",
            "productor_telefono",
            "parroquia",
            "comunidad",
            "centro_poblado",
            "coordenadas",
            "nombre_predio",
            "direccion",
            "superficie",
            "tipo_propiedad",
            "tenencia",
            "vialidad",
            "tipo_explotacion"
        ];

        const todosLlenos = camposRequeridos.every(campo => {
            const valor = formData[campo];
            if (Array.isArray(valor)) return valor.length > 0;
            return valor !== undefined && valor !== null && String(valor).trim() !== "";
        });

        const sinErrores = Object.values(errors).every(error => !error || error.trim() === "");

        return todosLlenos && sinErrores;
    };

    const guardarEnDjango = async () => {
        Swal.fire({
            title: 'Procesando...',
            text: 'Guardando datos en el servidor, por favor espere un momento.',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            const numeroLimpio = formData.productor_telefono ? formData.productor_telefono.replace(/\D/g, '') : '';
            const telefonoFormateado = numeroLimpio ? `58${numeroLimpio}` : '';
            const cedulaCompleta = formData.productor_cedula ? `${prefijoCedula}${formData.productor_cedula.trim()}` : '';
            const serviciosFormateados = Array.isArray(formData.servicios) ? formData.servicios : [];

            const infraestructuraSanitizada = {};
            const infraBase = formData.infraestructura || {};

            Object.keys(infraBase).forEach((key) => {
                const valor = infraBase[key];
                infraestructuraSanitizada[key] = valor !== "" && valor !== undefined ? parseInt(valor, 10) : 0;
                if (isNaN(infraestructuraSanitizada[key])) {
                    infraestructuraSanitizada[key] = 0;
                }
            });

            const sistemasReg = Array.isArray(formData.sistemas_registro) ? formData.sistemas_registro : [];

            const payload = {
                usuario: municipioEmpleado ? `Empleado (${municipioEmpleado})` : "Empleado (Barinas)",
                productor: {
                    cedula_rif: cedulaCompleta,
                    nombre: formData.productor_nombre?.trim(),
                    telefono: telefonoFormateado,
                    correo: formData.productor_correo?.trim() || null
                },
                nombre_predio: formData.nombre_predio?.trim(),
                municipio: municipioEmpleado || formData.municipio,
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
                infraestructura: infraestructuraSanitizada,
                produccion: {
                    tipo_explotacion: formData.tipo_explotacion,
                    registro_sanitario: sistemasReg.includes("Sanitario"),
                    registro_productivo: sistemasReg.includes("Productivo"),
                    registro_reproductivo: sistemasReg.includes("Reproductivo"),
                    registro_financiero: sistemasReg.includes("Financiero")
                }
            };

            const response = await fetch('http://127.0.0.1:8000/api/predios/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Registro Exitoso!',
                    text: 'El predio ha sido registrado con éxito en el sistema.',
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                }).then((result) => {
                    if (result.isConfirmed) { window.location.reload(); }
                });
            } else {
                Swal.fire({ title: 'Error al guardar', text: 'Verifique los datos e intente nuevamente.', icon: 'error' });
            }
        } catch (error) {
            Swal.fire({ title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', icon: 'error' });
        }
    };

    return {
        listaParroquias,
        manejarCambio,
        manejarInfra,
        manejarChecklist,
        guardarEnDjango,
        esFormularioValido
    };
}