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

    // 3. CÁLCULO DE ESTADÍSTICAS GLOBAL Y LOCAL (CON ENFOQUE PRODUCTIVO CORREGIDO)
    useEffect(() => {
        if (!usuario || listaPredios.length === 0) return;

        setCargando(true);

        let totalHectareas = 0;
        let prediosCaracterizados = 0;
        let sumBovinos = 0, sumBubalinos = 0, sumEquinos = 0, sumOvinos = 0, sumPorcinos = 0, sumCaprinos = 0, sumAvicola = 0;

        let destinosVegetalesMap = {};
        let maquinariaRuedasMap = {};
        let capacidadesPecuariasMap = { Leche: 0, Carne: 0, Cria: 0, Engorde: 0, Reproduccion: 0 };

        const prediosAProcesar = usuario.esEmpleado ? listaPrediosBase : listaPredios;

        prediosAProcesar.forEach(p => {
            const supPredio = parseFloat(p.superficie || 0);
            totalHectareas += supPredio;
            if (p.caracterizacion_completada) prediosCaracterizados++;

            // Destino de Producción Vegetal
            const rubros = p.rubros_vegetales || p.produccion?.rubros_vegetales || [];
            if (Array.isArray(rubros)) {
                rubros.forEach(r => {
                    const dest = r.destino || "Comercialización";
                    destinosVegetalesMap[dest] = (destinosVegetalesMap[dest] || 0) + (parseFloat(r.hectareas) || supPredio || 1);
                });
            }

            // Maquinaria de Ruedas (Gráfico de Barras Nº 4)
            const maqData = p.maquinaria || {};
            const ruedas = maqData.maquinaria_ruedas || {};
            Object.entries(ruedas).forEach(([key, val]) => {
                const num = Number(val) || 0;
                if (num > 0) {
                    const labelClean = key.replace(/_/g, ' ').toUpperCase();
                    maquinariaRuedasMap[labelClean] = (maquinariaRuedasMap[labelClean] || 0) + num;
                }
            });

            // Capacidades Pecuarias (Gráfico de Telaraña / Radar - CORREGIDO)
            const animalData = p.existencia_animal || {};
            ['capacidadBovina', 'capacidadBubalina', 'capacidadOvina', 'capacidadPorcina', 'capacidadCaprino'].forEach(capKey => {
                const cap = animalData[capKey] || {};
                
                // Leche diaria
                capacidadesPecuariasMap.Leche += Number(cap.leche_diaria || cap.leche || 0);
                
                // Carne anual
                const pesoCarne = Number(cap.carne_anual || cap.carne || 0);
                capacidadesPecuariasMap.Carne += isNaN(pesoCarne) ? 0 : pesoCarne;
                
                // Cría: Cantidad de partos anuales
                capacidadesPecuariasMap.Cria += Number(cap.partos_anuales || cap.partos || 0);
                
                // Engorde: Capacidad de engorde
                capacidadesPecuariasMap.Engorde += Number(cap.engorde || cap.capacidad_engorde || 0);
                
                // Reproducción: Cantidad de reproductores / reproductoras
                capacidadesPecuariasMap.Reproduccion += Number(cap.reproduccion || cap.reproductores || cap.reproductoras || 0);
            });

            // Conteo de Existencia Animal General
            const sumarJson = (obj) => {
                if (!obj || typeof obj !== 'object') return 0;
                return Object.values(obj).reduce((acc, val) => acc + (isNaN(Number(val)) ? 0 : Number(val)), 0);
            };

            sumBovinos += sumarJson(animalData.bovinos);
            sumBubalinos += sumarJson(animalData.bubalinos);
            sumEquinos += sumarJson(animalData.equinos);
            sumOvinos += sumarJson(animalData.ovinos);
            sumPorcinos += sumarJson(animalData.porcinos);
            sumCaprinos += sumarJson(animalData.caprinos);
            sumAvicola += sumarJson(animalData.avicola);
        });

        const datosDestinoVegetal = Object.keys(destinosVegetalesMap).length > 0 
            ? Object.entries(destinosVegetalesMap).map(([name, value], idx) => ({
                name, value, color: ['#136442', '#28a745', '#8bc34a', '#558b2f'][idx % 4]
              }))
            : [{ name: "Superficie Productiva", value: totalHectareas > 0 ? totalHectareas : 1, color: "#136442" }];

        const datosMaquinaria = Object.keys(maquinariaRuedasMap).length > 0
            ? Object.entries(maquinariaRuedasMap).map(([name, cantidad]) => ({ name, cantidad }))
            : [{ name: "Sin Maquinaria", cantidad: 0 }];

        const datosCapacidadesRadar = [
            { subject: 'Leche (L/día)', A: capacidadesPecuariasMap.Leche, fullMark: Math.max(100, capacidadesPecuariasMap.Leche) },
            { subject: 'Carne (Kg/año)', A: capacidadesPecuariasMap.Carne, fullMark: Math.max(100, capacidadesPecuariasMap.Carne) },
            { subject: 'Cría (Partos/año)', A: capacidadesPecuariasMap.Cria, fullMark: Math.max(100, capacidadesPecuariasMap.Cria) },
            { subject: 'Engorde', A: capacidadesPecuariasMap.Engorde, fullMark: Math.max(100, capacidadesPecuariasMap.Engorde) },
            { subject: 'Reproducción', A: capacidadesPecuariasMap.Reproduccion, fullMark: Math.max(100, capacidadesPecuariasMap.Reproduccion) },
        ];

        const totalSemovientesCalculado = sumBovinos + sumBubalinos + sumEquinos + sumOvinos + sumPorcinos + sumCaprinos + sumAvicola;
        const produccionGeneralCalculada = [
            { name: "Bovinos", cantidad: sumBovinos },
            { name: "Bubalinos", cantidad: sumBubalinos },
            { name: "Porcinos", cantidad: sumPorcinos },
            { name: "Equinos", cantidad: sumEquinos },
            { name: "Avícola", cantidad: sumAvicola },
            { name: "Ovinos/Caprinos", cantidad: sumOvinos + sumCaprinos }
        ].filter(item => item.cantidad > 0);

        if (!usuario.esEmpleado) {
            axios.get("http://127.0.0.1:8000/api/dashboard-produccion/")
                .then(res => {
                    const backendData = res.data || {};
                    setStatsProduccion({
                        ...backendData,
                        cards: {
                            predios_caracterizados: backendData.cards?.predios_caracterizados ?? prediosCaracterizados,
                            total_semovientes: backendData.cards?.total_semovientes ?? totalSemovientesCalculado,
                            total_hectareas: backendData.cards?.total_hectareas ?? totalHectareas,
                        },
                        graficos: {
                            ...(backendData.graficos || {}),
                            produccion_general: backendData.graficos?.produccion_general || produccionGeneralCalculada,
                            destino_produccion_vegetal: backendData.graficos?.destino_produccion_vegetal || datosDestinoVegetal,
                            digitalizacion_radar: datosCapacidadesRadar,
                            tipo_explotacion: datosMaquinaria
                        }
                    });
                    setCargando(false);
                })
                .catch(err => {
                    console.error("Error cargando dashboard global, usando cálculo local:", err);
                    setStatsProduccion({
                        cards: { predios_caracterizados: prediosCaracterizados, total_semovientes: totalSemovientesCalculado, total_hectareas: totalHectareas },
                        graficos: {
                            produccion_general: produccionGeneralCalculada,
                            destino_produccion_vegetal: datosDestinoVegetal,
                            digitalizacion_radar: datosCapacidadesRadar,
                            tipo_explotacion: datosMaquinaria
                        }
                    });
                    setCargando(false);
                });
        } else {
            setStatsProduccion({
                cards: { predios_caracterizados: prediosCaracterizados, total_semovientes: totalSemovientesCalculado, total_hectareas: totalHectareas },
                graficos: {
                    produccion_general: produccionGeneralCalculada,
                    destino_produccion_vegetal: datosDestinoVegetal,
                    digitalizacion_radar: datosCapacidadesRadar,
                    tipo_explotacion: datosMaquinaria
                }
            });
            setCargando(false);
        }
    }, [usuario, listaPredios, municipioEmpleado]);

    // --- FUNCIONES DE CONTROL ---

    const seleccionarPredioParaCaracterizar = (predio) => {
        setPredioActivo(predio);
        setMostrarModal(true);
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