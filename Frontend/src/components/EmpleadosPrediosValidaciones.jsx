import Swal from "sweetalert2";

export const LIMITES_MUNICIPIOS = {
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

export const POLIGONOS_MUNICIPIOS = {
    "Barinas": [
        [-70.2500, 8.6600], [-70.1800, 8.6600], [-70.1400, 8.6100], [-70.1205, 8.5841],
        [-70.1412, 8.4521], [-70.2314, 8.3214], [-70.3654, 8.3541], [-70.3985, 8.4852],
        [-70.3541, 8.5987], [-70.2854, 8.6124], [-70.2500, 8.6600]
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

export const comprobarPuntoEnPoligono = (point, polygon) => {
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

export const verificarCedulaDuplicada = (cedula, listaPredios, setFormData, setCamposBloqueados, setErrors) => {
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

    const listaSegura = Array.isArray(listaPredios) ? listaPredios : [];
    const cedulaLimpia = String(cedula).trim();
    const registroEncontrado = listaSegura.find(p => {
        const cedulaEnDB = String(p.productor?.cedula_rif || "").replace(/\D/g, '').trim();
        return cedulaEnDB === cedulaLimpia;
    });

    setTimeout(() => {
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

export const validarCampoProductor = (name, value, formData, setErrors, prefijoCedula, listaPredios, municipioEmpleado) => {
    let mensaje = "";
    const listaSegura = Array.isArray(listaPredios) ? listaPredios : [];

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
        setErrors(prev => ({ ...prev, [name]: mensaje }));
        return;
    }

    if (name === "productor_cedula") {
        const esV = prefijoCedula === "V-";
        const min = esV ? 6 : 5;
        const max = 8;
        const soloNumeros = /^[0-9]*$/;

        const existeEnDB = listaSegura.some(p => {
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
        return;
    }

    if (name === "productor_telefono") {
        if (value === "") {
            mensaje = "";
        } else if (!/^[0-9]+$/.test(value)) {
            mensaje = "El teléfono solo debe contener números";
        } else if (value.length !== 10) {
            mensaje = "El teléfono debe tener exactamente 10 dígitos (Ej: 4141234567)";
        } else if (!/^(414|424|416|426|412)[0-9]{7}$/.test(value)) {
            mensaje = "El número debe comenzar con una operadora válida (414, 424, 416, 426, 412)";
        } else {
            const telefonoConPrefijo = `58${value.trim()}`;
            const telefonoYaRegistrado = listaSegura.some(p => {
                const telEnDB = String(p.productor?.telefono || "").trim();
                return telEnDB === telefonoConPrefijo;
            });

            if (telefonoYaRegistrado) {
                mensaje = "Este número de teléfono ya está registrado.";
            } else {
                mensaje = "";
            }
        }

        setErrors(prev => ({ ...prev, [name]: mensaje }));
        return;
    }

    if (name === "productor_correo") {
        if (value === "") {
            mensaje = "";
        } else {
            const regexDominiosPermitidos = /^[^\s@]+@(gmail\.com|hotmail\.com)$/i;
            const esCorreoSospechoso = /(.)\1{4,}/i.test(value.split('@')[0]) ||
                /asdasd|12345|qwerty/i.test(value);

            if (!regexDominiosPermitidos.test(value)) {
                mensaje = "Solo se permiten correos válidos de @gmail.com o @hotmail.com";
            } else if (esCorreoSospechoso) {
                mensaje = "El correo parece falso o inválido. Por favor, verifícalo.";
            } else if (value.split('@')[0].length < 4) {
                mensaje = "El nombre de usuario del correo es demasiado corto";
            } else {
                const correoYaRegistrado = listaSegura.some(p => {
                    const correoEnDB = String(p.productor?.correo || "").toLowerCase().trim();
                    return correoEnDB === value.toLowerCase().trim();
                });

                if (correoYaRegistrado) {
                    mensaje = "Este correo electrónico ya está registrado.";
                }
            }
        }

        setErrors(prev => ({ ...(prev || {}), [name]: mensaje }));
        return;
    }

    if (name === "comunidad" || name === "centro_poblado") {
        const soloLetrasYEspacios = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (value.trim() === "") {
            mensaje = "Indique la localidad";
        } else if (value.length < 3) {
            mensaje = "El nombre es muy corto";
        } else if (value.length > 30) {
            mensaje = "Máximo 30 caracteres permitidos";
        } else if (!soloLetrasYEspacios.test(value)) {
            mensaje = "Solo letras y espacios";
        }
        setErrors(prev => ({ ...prev, [name]: mensaje }));
        return;
    }

    const datosEnTiempoReal = {
        ...formData,
        [name]: value
    };

    if (name === "coordenadas" || name === "municipio") {
        const coordenadasActuales = datosEnTiempoReal.coordenadas;
        const municipioActivo = municipioEmpleado || datosEnTiempoReal.municipio;
        const valorLimpio = coordenadasActuales ? coordenadasActuales.trim() : "";

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

            const coordYaRegistrada = listaSegura.some(p => {
                return String(p.coordenadas || "").trim() === valorLimpio;
            });

            if (coordYaRegistrada) {
                setErrors(prev => ({ ...prev, coordenadas: "Estas coordenadas ya pertenecen a un predio registrado." }));
                return;
            }

            const partes = valorLimpio.split(",");
            const lat = parseFloat(partes[0].trim());
            const lng = parseFloat(partes[1].trim());

            if (!municipioActivo) {
                setErrors(prev => ({ ...prev, coordenadas: "No se detectó el municipio asignado al empleado." }));
                return;
            }

            // Normalizamos la búsqueda para encontrar la clave sin importar si viene en minúsculas o mayúsculas
            const nombreMunicipioBuscado = Object.keys(POLIGONOS_MUNICIPIOS).find(
                m => m.toLowerCase() === municipioActivo.toLowerCase()
            );

            const poligono = nombreMunicipioBuscado ? POLIGONOS_MUNICIPIOS[nombreMunicipioBuscado] : null;
            
            if (poligono) {
                const estaAdentro = comprobarPuntoEnPoligono([lng, lat], poligono);

                if (!estaAdentro) {
                    setErrors(prev => ({
                        ...prev,
                        coordenadas: `Las coordenadas no corresponden geográficamente al municipio asignado (${municipioActivo}).`
                    }));
                    return;
                } else {
                    setErrors(prev => ({ ...prev, coordenadas: "", municipio: "" }));
                }
            } else {
                setErrors(prev => ({
                    ...prev,
                    coordenadas: `No se encontraron límites geográficos configurados para el municipio: ${municipioActivo}`
                }));
                return;
            }
        }
        return;
    }

    if (name === "municipio" || name === "parroquia") {
        if (value === "") mensaje = "Este campo es obligatorio";
        setErrors(prev => ({ ...prev, [name]: mensaje }));
        return;
    }

    if (name === "nombre_predio") {
        if (value.trim() === "") {
            mensaje = "El nombre del predio es obligatorio";
        } else if (value.length < 3) {
            mensaje = "Nombre demasiado corto";
        } else if (value.length > 50) {
            mensaje = "Máximo 50 caracteres";
        }
        setErrors(prev => ({ ...prev, [name]: mensaje }));
        return;
    }

    if (name === "direccion") {
        if (value.trim() === "") {
            mensaje = "La dirección es necesaria para la ubicación física";
        } else if (value.length < 10) {
            mensaje = "Por favor, sea más específico (mín. 10 caracteres)";
        }
        setErrors(prev => ({ ...prev, [name]: mensaje }));
        return;
    }

    if (name === "superficie") {
        const valorNum = parseFloat(value);
        if (value === "") {
            mensaje = "Indique las hectáreas";
        } else if (isNaN(valorNum) || valorNum <= 0) {
            mensaje = "Debe ser un número mayor a 0";
        }
        setErrors(prev => ({ ...prev, [name]: mensaje }));
        return;
    }

    if (name === "tipo_propiedad" || name === "vialidad" || name === "tipo_explotacion") {
        if (value === "") {
            mensaje = "Este campo es obligatorio";
        }
        setErrors(prev => ({ ...prev, [name]: mensaje }));
        return;
    }
};