import { useMemo } from "react";

export function useGraficosPredios(listaPredios) {
    const datosGrafico = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        const conteo = listaPredios.reduce((acc, p) => {
            const muni = p.municipio || "Otros";
            acc[muni] = (acc[muni] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(conteo)
            .map(([name, cantidad]) => ({ name, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 6);
    }, [listaPredios]);

    const datosTenencia = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        const conteo = listaPredios.reduce((acc, p) => {
            const tipo = p.tenencia || "No definido";
            acc[tipo] = (acc[tipo] || 0) + 1;
            return acc;
        }, {});

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

        const conteo = {
            Agua: 0,
            Electricidad: 0,
            Gas: 0,
            Internet: 0,
            Teléfono: 0,
            Transporte: 0
        };

        listaPredios.forEach(p => {
            const misServicios = p.servicios_lectura || [];
            if (Array.isArray(misServicios)) {
                misServicios.forEach(s => {
                    if (conteo.hasOwnProperty(s)) {
                        conteo[s]++;
                    }
                });
            }
        });

        return serviciosLabels.map(s => ({
            subject: s,
            A: totalPredios > 0 ? (conteo[s] / totalPredios) * 100 : 0,
            fullMark: 100
        }));
    }, [listaPredios]);

    const datosVialidad = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        const categorias = ["Excelente", "Bueno", "Regular", "Malo"];
        const conteo = { Excelente: 0, Bueno: 0, Regular: 0, Malo: 0 };

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
            const tipo = p.produccion?.tipo_explotacion || "No Definido";

            if (!municipiosMap[mun]) {
                municipiosMap[mun] = {
                    municipio: mun,
                    "Intensivo": 0,
                    "Semi Intensivo": 0,
                    "Extensivo": 0
                };
            }

            if (municipiosMap[mun].hasOwnProperty(tipo)) {
                municipiosMap[mun][tipo]++;
            }
        });

        return Object.values(municipiosMap);
    }, [listaPredios]);

    const datosDispersion = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        return listaPredios.map(p => {
            const infra = p.infraestructura || {};
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
                superficie: parseFloat(p.superficie) || 0,
                infraestructura: totalInfra,
                municipio: p.municipio
            };
        });
    }, [listaPredios]);

    const datosDigitalizacion = useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) return [];

        const total = listaPredios.length;
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

        const agrupado = listaPredios.reduce((acc, p) => {
            const estatus = p.tenencia || "Otros";
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

    return {
        datosGrafico,
        datosTenencia,
        datosServicios,
        datosVialidad,
        datosIntensidad,
        datosDispersion,
        datosDigitalizacion,
        datosLegales
    };
}