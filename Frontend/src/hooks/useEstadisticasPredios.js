import { useMemo } from 'react';

export function useEstadisticasPredios(listaPredios) {
    return useMemo(() => {
        if (!listaPredios || listaPredios.length === 0) {
            return {
                totalPredios: 0,
                superficieTotal: 0,
                municipiosCubiertos: 0,
                totalMunicipiosBarinas: 12,
                datosGrafico: [],
                datosTenencia: [],
                datosServicios: [],
                datosVialidad: [],
                datosIntensidad: [],
                datosDispersion: [],
                datosLegales: []
            };
        }

        const totalPredios = listaPredios.length;

        const superficieTotal = listaPredios.reduce((acc, p) => {
            return acc + parseFloat(p.superficie || 0);
        }, 0);

        // 1. Agrupar por Municipio (Gráfico de Barras)
        const conteoMunicipios = {};
        listaPredios.forEach(p => {
            const mun = p.municipio || "Sin municipio";
            conteoMunicipios[mun] = (conteoMunicipios[mun] || 0) + 1;
        });

        const datosGrafico = Object.keys(conteoMunicipios).map(mun => ({
            name: mun,
            cantidad: conteoMunicipios[mun]
        }));

        // 2. Agrupar por Estatus Legal / Tenencia (Gráfico de Dona)
        const coloresTenencia = ['#136442', '#4CAF50', '#81C784', '#FF9800', '#2196F3', '#9C27B0'];
        const conteoTenencia = {};
        
        listaPredios.forEach(p => {
            const tenencia = p.estatus_legal || p.tenencia || "No especificado"; 
            conteoTenencia[tenencia] = (conteoTenencia[tenencia] || 0) + 1;
        });

        const datosTenencia = Object.keys(conteoTenencia).map((tenencia, index) => ({
            name: tenencia,
            value: conteoTenencia[tenencia],
            color: coloresTenencia[index % coloresTenencia.length]
        }));

        // 3. Cobertura de Servicios Básicos (Radar Chart) usando servicios_lectura
        const serviciosLabels = ["Agua", "Electricidad", "Gas", "Internet", "Teléfono", "Transporte"];
        const conteoServicios = {
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
                    if (conteoServicios.hasOwnProperty(s)) {
                        conteoServicios[s]++;
                    }
                });
            }
        });

        const datosServicios = serviciosLabels.map(s => ({
            subject: s,
            A: totalPredios > 0 ? (conteoServicios[s] / totalPredios) * 100 : 0,
            fullMark: 100
        }));

        const municipiosCubiertos = new Set(
            listaPredios.map(p => p.municipio).filter(Boolean)
        ).size;

        // 4. Agrupar por Estado de la Vialidad (Bar Chart Horizontal)
        const estadosVialidadOrden = ["Excelente", "Bueno", "Regular", "Malo"];
        const conteoVialidad = {
            Excelente: 0,
            Bueno: 0,
            Regular: 0,
            Malo: 0
        };

        listaPredios.forEach(p => {
            const estado = p.vialidad || p.estado_vialidad || "No especificado";
            if (conteoVialidad.hasOwnProperty(estado)) {
                conteoVialidad[estado]++;
            }
        });

        const datosVialidad = estadosVialidadOrden.map(estado => ({
            estado: estado,
            cantidad: conteoVialidad[estado]
        }));

        // 5. Agrupar Intensidad de Producción por Municipio (Bar Chart Multi-serie)
        const municipiosMap = {};

        listaPredios.forEach(p => {
            const mun = p.municipio || "Otros";
            const tipo = p.produccion?.tipo_explotacion || "No Definido";

            if (!municipiosMap[mun]) {
                municipiosMap[mun] = {
                    municipio: mun,
                    "Intensivo": 0,
                    "Semi Intensivo": 0,
                    "Extensivo": 0,
                    "No Definido": 0
                };
            }

            if (municipiosMap[mun].hasOwnProperty(tipo)) {
                municipiosMap[mun][tipo]++;
            }
        });

        const datosIntensidad = Object.values(municipiosMap);
        
        // 6. Relación Superficie vs Infraestructura (Scatter Chart)
        const datosDispersion = listaPredios.map(p => {
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
                nombre: p.nombre_predio || p.nombre || "Predio sin nombre",
                superficie: parseFloat(p.superficie) || 0,
                infraestructura: totalInfra,
                municipio: p.municipio || "Sin municipio"
            };
        });

        // 7. Distribución por Tenencia / Situación Legal (Treemap)
        const agrupado = listaPredios.reduce((acc, p) => {
            const estatus = p.tenencia || "Otros";
            const hectareas = parseFloat(p.superficie) || 0;

            acc[estatus] = (acc[estatus] || 0) + hectareas;
            return acc;
        }, {});

        const totalHectareas = Object.values(agrupado).reduce((sum, val) => sum + val, 0);

        const coloresTreemap = ['#136442', '#2d8a5e', '#4caf50', '#82ca9d', '#a5d6a7', '#c8e6c9'];

        const datosLegales = [{
            name: 'Estatus Legal',
            children: Object.entries(agrupado).map(([name, total], index) => ({
                name,
                size: parseFloat(total.toFixed(2)),
                porcentaje: totalHectareas > 0 ? ((total / totalHectareas) * 100).toFixed(1) : 0,
                fill: coloresTreemap[index % coloresTreemap.length]
            }))
        }];


        return {
            totalPredios,
            superficieTotal,
            municipiosCubiertos,
            totalMunicipiosBarinas: 12,
            datosGrafico,
            datosTenencia,
            datosServicios,
            datosVialidad,
            datosIntensidad,
            datosDispersion,
            datosLegales
        };
    }, [listaPredios]);
}