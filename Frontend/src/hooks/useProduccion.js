import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function useDashboardProduccion() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [tabActiva, setTabActiva] = useState("inicio");
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);
    const [statsProduccion, setStatsProduccion] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [predioSeleccionado, setPredioSeleccionado] = useState(null);
    const [editando, setEditando] = useState(false);
    const [predios, setPredios] = useState([]);
    const [predioActivo, setPredioActivo] = useState(null);
    const [listaPredios, setListaPredios] = useState([]);
    const [busquedaCedula, setBusquedaCedula] = useState("");
    const [busqueda, setBusqueda] = useState("");

    // Estados para Licencia de Hierro
    const [licenciaHierro, setLicenciaHierro] = useState({
        poseeLicencia: false,
        fechaEmision: "",
        fechaVencimiento: "",
        observaciones: "",
        imagenHierro: null,
        certificado: null
    });

    const [subCaracterizacion, setSubCaracterizacion] = useState("animal");

    const [rubrosVegetales, setRubrosVegetales] = useState([
        {
            rubro: "",
            hectareas: "",
            estado: "",
            riego: "",
            ciclo_productivo: "",
            tipo_produccion: "",
            produccion_estimada: "",
            destino: ""
        }
    ]);

    const [inventarioInicial, setInventarioInicial] = useState({
        especiesSeleccionadas: [],

        bovinos: {
            toro_reproductor: 0,
            toro_ceba: 0,
            vaca: 0,
            novilla: 0,
            novillo: 0,
            maute: 0,
            mauta: 0,
            becerra: 0,
            becerro: 0,
        },

        capacidadBovina: {
            leche_diaria: 0,
            carne_anual: 0,
            sistemas: [],
        },

        bubalinos: {
            butoro_reproductor: 0,
            butoro_ceba: 0,
            bufala: 0,
            buvilla: 0,
            buvillo: 0,
            bumauta: 0,
            bumaute: 0,
            bucerra: 0,
            bucerro: 0,
        },

        capacidadBubalina: {
            leche_diaria: 0,
            carne_anual: 0,
            partos_anuales: 0,
            reproductores: 0,
            sistemas: [],
        },

        equinos: {
            padrillo: 0,
            caballo_trabajo: 0,
            yegua: 0,
            potra: 0,
            potro: 0,
            potrilla: 0,
            potrillo: 0,
            burro: 0,
            burra: 0,
        },

        capacidadEquina: {
            sistemas: [],
            trabajo_agricola: 0,
            transporte: 0,
            reproduccion: 0,
            deporte: 0,
            exhibicion: 0,
            turismo: 0,
            carga: 0,
        },

        ovinos: {
            carnero: 0,
            oveja: 0,
            borrego: 0,
            borrega: 0,
            cordero: 0,
            cordera: 0,
        },

        capacidadOvina: {
            sistemas: [],
            carne_anual: 0,
            leche_diaria: 0,
            lana_anual: 0,
            cria: 0,
            reproduccion: 0,
            doble_proposito: 0,
            genetica: 0,
        },

        porcinos: {
            berraco: 0,
            cerda_gestante: 0,
            cerda_lactante: 0,
            lechon: 0,
            lechona: 0,
        },

        capacidadPorcina: {
            sistemas: [],
            cria: 0,
            engorde: 0,
            reproduccion: 0,
            ciclo_completo: 0,
            genetica: 0,
            carne_anual: 0,
        },

        caprinos: {
            cabrio: 0,
            cabra: 0,
            cabrillo: 0,
            cabrilla: 0,
            cabrito: 0,
            cabrita: 0,
        },

        capacidadCaprino: {
            sistemas: [],
            vientres: 0,
            engorde: 0,
            leche_diaria: 0,
            carne_anual: 0,
        },

        cunicola: {
            macho: 0,
            madre: 0,
            gazapo: 0,
        },

        capacidadCunicola: {
            sistemas: [],
            jaulas_madre: 0,
            reproductoras: 0,
            carne_anual: 0
        },

        avicola: {
            pollos_engorde: 0,
            gallinas_ponedoras: 0,
            gallinas_descarte: 0,
            codornices: 0,
            patos: 0,
            pavos: 0,
            avestruz: 0,
            guinea: 0,
            otros: 0,
        },

        capacidadAvicola: {
            sistemas: [],
            capacidad_alojamiento: 0,
            produccion_huevos: 0,
            capacidad_lote: 0,
        },

        apicola: {
            colmenas: 0,
        },

        capacidadApicola: {
            sistemas: [],
            colmenas_activas: 0,
            miel_anual: 0,
            nucleos_anuales: 0,
        },

        maquinariaSeleccionada: [],

        maquinaria_ruedas: {
            tractor: 0,
            rotocultor: 0,
            patrol: 0,
            lowboy: 0,
            payloader: 0,
            cosechadora: 0,
            desgranadora: 0,
            basuca: 0,
            remolque: 0,
        },

        implementos: {
            abonadora: 0,
            arados: 0,
            aspergadoras: 0,
            rastra_pesada: 0,
            cultivadora: 0,
            desmalezadora: 0,
            desterronadora: 0,
            encaladora: 0,
            niveladora: 0,
            cegadora: 0,
            sembradora: 0,
            subsolador: 0,
            surcadora: 0,
            trompo_fertilizador: 0,
        },

        riego: {
            electrobomba: 0,
            molino_viento: 0,
            motobomba: 0,
            motor_diesel: 0,
        },

        otros_equipos: {
            cargadora_madera: 0,
            descortezadora: 0,
            motosierra: 0,
            secadora_granos: 0,
            termonebulizadores: 0,
            trilladora: 0,
            acuicultura_aireacion: 0,
            alimentacion_mecanizada: 0,
        },
    });

    // 1. Detección de sesión (Admin o Empleado)
    useEffect(() => {
        const dataProd = sessionStorage.getItem("usuario_produccion");
        const dataAdmin = sessionStorage.getItem("usuario_admin");
        const dataEmpleado = sessionStorage.getItem("usuario_predios");

        if (dataProd) {
            setUsuario(JSON.parse(dataProd));
        } else if (dataAdmin) {
            setUsuario(JSON.parse(dataAdmin));
        } else if (dataEmpleado) {
            const emp = JSON.parse(dataEmpleado);
            setUsuario({ ...emp, esEmpleado: true });
        } else {
            navigate("/predios/login");
        }
    }, [navigate]);

    // 2. Cargar Predios desde la API
    useEffect(() => {
        const obtenerPredios = async () => {
            try {
                setCargando(true);
                const response = await fetch("http://127.0.0.1:8000/api/predios/");
                const data = await response.json();
                const prediosArray = Array.isArray(data) ? data : data.results || [];
                setListaPredios(prediosArray);
            } catch (error) {
                console.error("Error obteniendo predios:", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerPredios();
    }, []);

    // Municipio del empleado (si aplica)
    const municipioEmpleado = usuario?.esEmpleado ? (usuario?.municipio || usuario?.municipio_asignado) : null;

    const listaPrediosBase = municipioEmpleado
        ? listaPredios.filter(p => p.municipio?.toLowerCase() === municipioEmpleado.toLowerCase())
        : listaPredios;

    // 3. CÁLCULO DE ESTADÍSTICAS
    useEffect(() => {
        if (!usuario) return;

        setCargando(true);

        if (!usuario.esEmpleado) {
            // PETICIÓN GLOBAL PARA ADMINISTRADOR
            axios.get("http://127.0.0.1:8000/api/dashboard-produccion/")
                .then(res => {
                    setStatsProduccion(res.data);
                    setCargando(false);
                })
                .catch(err => {
                    console.error("Error cargando el dashboard global:", err);
                    setCargando(false);
                });
        } else {
            // CÁLCULO LOCAL DETALLADO PARA EMPLEADO USANDO LOS MODELOS DE DJANGO
            if (listaPredios.length >= 0) {
                let totalHectareas = 0;
                let prediosCaracterizados = 0;

                let sumBovinos = 0;
                let sumBubalinos = 0;
                let sumEquinos = 0;
                let sumOvinos = 0;
                let sumPorcinos = 0;
                let sumCaprinos = 0;
                let sumAvicola = 0;

                listaPrediosBase.forEach(p => {
                    totalHectareas += parseFloat(p.superficie || 0);
                    if (p.caracterizacion_completada) prediosCaracterizados++;

                    const animalData = p.existencia_animal || {};

                    const sumarJson = (obj) => {
                        if (!obj || typeof obj !== 'object') return 0;
                        return Object.values(obj).reduce((acc, val) => {
                            const num = Number(val);
                            return acc + (isNaN(num) ? 0 : num);
                        }, 0);
                    };

                    sumBovinos += sumarJson(animalData.bovinos);
                    sumBubalinos += sumarJson(animalData.bubalinos);
                    sumEquinos += sumarJson(animalData.equinos);
                    sumOvinos += sumarJson(animalData.ovinos);
                    sumPorcinos += sumarJson(animalData.porcinos);
                    sumCaprinos += sumarJson(animalData.caprinos);
                    sumAvicola += sumarJson(animalData.avicola);
                });

                const totalSemovientesCalculado = sumBovinos + sumBubalinos + sumEquinos + sumOvinos + sumPorcinos + sumCaprinos + sumAvicola;

                setStatsProduccion({
                    cards: {
                        predios_caracterizados: prediosCaracterizados,
                        total_semovientes: totalSemovientesCalculado,
                        total_hectareas: totalHectareas,
                    },
                    graficos: {
                        produccion_general: [
                            { name: "Bovinos", cantidad: sumBovinos },
                            { name: "Bubalinos", cantidad: sumBubalinos },
                            { name: "Porcinos", cantidad: sumPorcinos },
                            { name: "Equinos", cantidad: sumEquinos },
                            { name: "Avícola", cantidad: sumAvicola },
                            { name: "Ovinos/Caprinos", cantidad: sumOvinos + sumCaprinos }
                        ].filter(item => item.cantidad > 0),
                        actividad_reciente: [
                            { name: "Superficie Productiva", value: totalHectareas > 0 ? totalHectareas : 1, color: "#136442" }
                        ]
                    }
                });
                setCargando(false);
            }
        }
    }, [usuario, listaPredios, municipioEmpleado]);

    // --- NUEVAS FUNCIONES DE CONTROL PARA EL FORMULARIO Y MODALES ---

    const seleccionarPredioParaCaracterizar = (predio) => {
        setPredioActivo(predio);
        setMostrarModal(true);
        // Resetear o precargar estados si ya tuviese caracterización previa
        if (predio?.licencia_hierro) {
            setLicenciaHierro({
                poseeLicencia: true,
                fechaEmision: predio.licencia_hierro.fecha_emision || "",
                fechaVencimiento: predio.licencia_hierro.fecha_vencimiento || "",
                observaciones: predio.licencia_hierro.observaciones || "",
                imagenHierro: null,
                certificado: null
            });
        }
    };

    const manejarCambioInventario = (categoria, campo, valor) => {
        setInventarioInicial(prev => ({
            ...prev,
            [categoria]: {
                ...prev[categoria],
                [campo]: valor === "" ? 0 : Number(valor)
            }
        }));
    };

    const manejarCheckboxEspecie = (especie) => {
        setInventarioInicial(prev => {
            const existe = prev.especiesSeleccionadas.includes(especie);
            return {
                ...prev,
                especiesSeleccionadas: existe
                    ? prev.especiesSeleccionadas.filter(e => e !== especie)
                    : [...prev.especiesSeleccionadas, especie]
            };
        });
    };

    const manejarCheckboxMaquinaria = (tipoMaquinaria) => {
        setInventarioInicial(prev => {
            const existe = prev.maquinariaSeleccionada.includes(tipoMaquinaria);
            return {
                ...prev,
                maquinariaSeleccionada: existe
                    ? prev.maquinariaSeleccionada.filter(m => m !== tipoMaquinaria)
                    : [...prev.maquinariaSeleccionada, tipoMaquinaria]
            };
        });
    };

    const agregarRubroVegetal = () => {
        setRubrosVegetales(prev => [
            ...prev,
            { rubro: "", hectareas: "", estado: "", riego: "", ciclo_productivo: "", tipo_produccion: "", produccion_estimada: "", destino: "" }
        ]);
    };

    const eliminarRubroVegetal = (index) => {
        setRubrosVegetales(prev => prev.filter((_, i) => i !== index));
    };

    const manejarCambioRubro = (index, campo, valor) => {
        setRubrosVegetales(prev => {
            const nuevosRubros = [...prev];
            nuevosRubros[index][campo] = valor;
            return nuevosRubros;
        });
    };

    // -------------------------------------------------------------

    const cerrarSesion = () => {
        sessionStorage.removeItem("usuario_produccion");
        sessionStorage.removeItem("usuario_admin");
        sessionStorage.removeItem("usuario_predios");
        navigate("/predios/login");
    };

    const filtrarPredios = listaPrediosBase.filter((p) =>
        p.productor?.cedula_rif?.includes(busquedaCedula)
    );

    const prediosFiltrados = listaPrediosBase.filter((p) => {
        const term = busqueda.toLowerCase();
        const nombrePredio = p.nombre_predio?.toLowerCase() || "";
        const nombreProductor = p.productor?.nombre?.toLowerCase() || "";
        return nombrePredio.includes(term) || nombreProductor.includes(term);
    });

    const guardarLicencia = async (datosActualizados) => {
        const licenciaData = datosActualizados || licenciaHierro;
        if (!licenciaData.poseeLicencia) {
            Swal.fire({ icon: "info", title: "No se requiere registro", text: "No se requiere registro si no posee licencia." });
            return;
        }

        Swal.fire({ title: 'Procesando...', text: 'Guardando datos...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        try {
            const formData = new FormData();
            formData.append("predio", predioActivo.id_predio);
            formData.append("fecha_emision", licenciaData.fechaEmision);
            formData.append("activa", licenciaData.activa ?? true);
            if (licenciaData.fechaVencimiento) formData.append("fecha_vencimiento", licenciaData.fechaVencimiento);
            if (licenciaData.observaciones) formData.append("observaciones", licenciaData.observaciones);
            if (licenciaData.imagenHierro) formData.append("imagen_hierro", licenciaData.imagenHierro);
            if (licenciaData.certificado) formData.append("certificado_pdf", licenciaData.certificado);

            await axios.post("http://127.0.0.1:8000/api/licencias-hierro/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            Swal.fire({ title: '¡Registro Exitoso!', icon: 'success' }).then((res) => {
                if (res.isConfirmed) window.location.reload();
            });
        } catch (error) {
            console.error(error);
            Swal.fire({ title: 'Error al guardar', icon: 'error' });
        }
    };

    const generarPDFPredio = (predio) => {
        if (!predio || !predio.caracterizacion_completada) {
            alert("No se puede exportar el PDF porque la caracterización no está completada.");
            return;
        }
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
        const verdeBarinas = [19, 100, 66];

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(...verdeBarinas);
        doc.text(`FICHA TÉCNICA: ${(predio.nombre_predio || "SIN NOMBRE").toUpperCase()}`, 12, 33);

        doc.save(`Ficha_${(predio.nombre_predio || "Predio").replace(/\s+/g, "_")}.pdf`);
    };

    return {
        usuario, tabActiva, setTabActiva, guardadoExitoso, statsProduccion,
        cargando, mostrarModal, setMostrarModal, predioSeleccionado, setPredioSeleccionado,
        editando, setEditando, predios, predioActivo, setPredioActivo,
        listaPredios: listaPrediosBase,
        busquedaCedula, setBusquedaCedula, busqueda, setBusqueda, prediosFiltrados,
        filtrarPredios, licenciaHierro, setLicenciaHierro, subCaracterizacion, setSubCaracterizacion,
        rubrosVegetales, setRubrosVegetales, inventarioInicial, setInventarioInicial,
        // Funciones auxiliares agregadas:
        seleccionarPredioParaCaracterizar,
        manejarCambioInventario,
        manejarCheckboxEspecie,
        manejarCheckboxMaquinaria,
        agregarRubroVegetal,
        eliminarRubroVegetal,
        manejarCambioRubro,
        cerrarSesion, guardarLicencia, generarPDFPredio, municipioEmpleado
    };
}