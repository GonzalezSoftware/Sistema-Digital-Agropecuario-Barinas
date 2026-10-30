import { useState } from 'react';
import Swal from 'sweetalert2';

export function useHistorialPredios(listaPredios = [], municipioEmpleado = "") {
    // URL del servidor backend en AWS con HTTPS
    const API_URL = "https://3.145.179.35.nip.io/api/";

    const [busqueda, setBusqueda] = useState("");
    const [predioSeleccionado, setPredioSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [cargandoAccion, setCargandoAccion] = useState(false);

    // Función auxiliar para normalizar textos y comparar sin errores por mayúsculas o espacios
    const normalizarTexto = (texto) => (texto || "").replace(/_/g, " ").trim().toLowerCase();

    // 1. Filtrar la lista en tiempo real por Municipio y Término de búsqueda
    const prediosFiltrados = listaPredios.filter((p) => {
        const municipioFiltroNormalizado = normalizarTexto(municipioEmpleado);
        const municipioPredioNormalizado = normalizarTexto(p.municipio);

        // Si hay un municipio de empleado definido, filtramos estrictamente por él
        const coincideMunicipio = municipioFiltroNormalizado 
            ? municipioPredioNormalizado === municipioFiltroNormalizado 
            : true;

        const term = busqueda.toLowerCase();
        const nombrePredio = p.nombre_predio?.toLowerCase() || "";
        const nombreProductor = p.productor?.nombre?.toLowerCase() || "";
        const coincideBusqueda = nombrePredio.includes(term) || nombreProductor.includes(term);

        return coincideMunicipio && coincideBusqueda;
    });

    // 2. Abrir el detalle del predio
    const manejarVerDetalles = (predio) => {
        setPredioSeleccionado(predio);
        setMostrarModal(true);
    };

    // 3. Actualizar datos del productor
    const actualizarProductor = (campo, valor) => {
        setPredioSeleccionado(prev => ({
            ...prev,
            productor: { ...prev.productor, [campo]: valor }
        }));
    };

    // 4. Actualizar datos generales del predio
    const actualizarPredio = (campo, valor) => {
        const camposInmutables = ['municipio', 'parroquia', 'comunidad', 'coordenadas', 'centro_poblado'];
        if (camposInmutables.includes(campo)) return;

        setPredioSeleccionado(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    // 5. Actualizar infraestructura
    const actualizarInfraestructura = (campo, valor) => {
        setPredioSeleccionado(prev => ({
            ...prev,
            infraestructura: { ...prev.infraestructura, [campo]: parseInt(valor) || 0 }
        }));
    };

    // 6. Actualizar producción
    const actualizarProduccion = (campo, valor) => {
        setPredioSeleccionado(prev => ({
            ...prev,
            produccion: { ...prev.produccion, [campo]: valor }
        }));
    };

    // 7. Guardar cambios reales (PATCH a la API)
    const guardarCambiosReal = async () => {
        if (!predioSeleccionado) return;
        setCargandoAccion(true);
        try {
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");

            let usuarioAccion = "Empleado";
            const adminDataStr = sessionStorage.getItem("usuario_admin");

            if (adminDataStr) {
                try {
                    const adminData = JSON.parse(adminDataStr);
                    const nombreAdmin = adminData.nombre || adminData.username || adminData.usuario || "Administrador";
                    usuarioAccion = `Administrador (${nombreAdmin})`;
                } catch (e) {
                    usuarioAccion = "Administrador";
                }
            } else {
                const empleadoMunicipio = sessionStorage.getItem("municipio_empleado") || window.municipioActualParaBitacora || municipioEmpleado || "Barinas";
                usuarioAccion = `Empleado (${empleadoMunicipio})`;
            }

            const datosAEnviar = {
                ...predioSeleccionado,
                usuario: usuarioAccion
            };

            const response = await fetch(`${API_URL}predios/${predioSeleccionado.id_predio}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(datosAEnviar)
            });

            if (response.ok) {
                await Swal.fire('¡Actualización Exitosa!', 'El predio ha sido guardado.', 'success');
                setEditando(false);
                setMostrarModal(false);
                window.location.reload();
            } else {
                const resultado = await response.json();
                Swal.fire('Error de validación', JSON.stringify(resultado), 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Ocurrió un error al conectar con el servidor.', 'error');
        } finally {
            setCargandoAccion(false);
        }
    };

    // 8. Eliminar predio (DELETE a la API)
    const eliminarDefinitivoReal = async () => {
        if (!predioSeleccionado) return;
        const resultado = await Swal.fire({
            title: '¿ESTÁS SEGURO?',
            text: `Esta acción eliminará permanentemente el predio "${predioSeleccionado.nombre_predio}".`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ce3a3a',
            confirmButtonText: 'Sí, eliminar permanentemente'
        });

        if (!resultado.isConfirmed) return;

        setCargandoAccion(true);
        try {
            const response = await fetch(`${API_URL}predios/${predioSeleccionado.id_predio}/`, {
                method: 'DELETE',
            });

            if (response.ok) {
                Swal.fire('¡Eliminado!', 'El predio ha sido eliminado con éxito.', 'success').then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire('Error', 'No se pudo eliminar el predio.', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargandoAccion(false);
        }
    };

    return {
        busqueda,
        setBusqueda,
        predioSeleccionado,
        setPredioSeleccionado,
        mostrarModal,
        setMostrarModal,
        editando,
        setEditando,
        cargandoAccion,
        prediosFiltrados,
        manejarVerDetalles,
        actualizarProductor,
        actualizarPredio,
        actualizarInfraestructura,
        actualizarProduccion,
        guardarCambiosReal,
        eliminarDefinitivoReal
    };
}