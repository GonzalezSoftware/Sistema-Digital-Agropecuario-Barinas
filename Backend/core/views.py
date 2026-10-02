import random
import requests
from rest_framework import viewsets
from django.db.models import Sum
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Predio, LicenciaHierro, Productor, Noticia, BitacoraAuditoria
from .serializers import PredioSerializer, LicenciaHierroSerializer
from .models import Predio, RubroVegetal, ExistenciaAnimal, Maquinaria
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import AdministradorSistema
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from .models import BitacoraAuditoria
from .serializers import BitacoraAuditoriaSerializer


class BitacoraAuditoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BitacoraAuditoria.objects.all().order_by('-fecha_hora')
    serializer_class = BitacoraAuditoriaSerializer


@api_view(['GET'])
def buscar_productor(request, cedula):
    cedula_limpia = cedula.strip().upper()
    try:
        productor = Productor.objects.get(cedula_rif=cedula_limpia)
        return Response({
            "existe": True,
            "nombre": productor.nombre,
            "telefono": productor.telefono,
            "cedula_rif": productor.cedula_rif  # <-- agregado
        })
    except Productor.DoesNotExist:
        return Response({"existe": False}, status=404)


class PredioViewSet(viewsets.ModelViewSet):
    serializer_class = PredioSerializer
    queryset = Predio.objects.all()

    def get_queryset(self):
        queryset = Predio.objects.select_related(
            'productor', 'infraestructura', 'produccion', 'existencia_animal', 'maquinaria'
        ).prefetch_related(
            'rubros_vegetales', 'predioservicio_set__servicio'
        )

        cedula = self.request.query_params.get('cedula')
        if cedula:
            queryset = queryset.filter(
                productor__cedula_rif=cedula.strip().upper())

        return queryset

    def perform_create(self, serializer):
        # Intentamos capturar el usuario o rol enviado desde el frontend; si no viene, asignamos un valor por defecto
        usuario = self.request.data.get(
            'usuario') or self.request.data.get('rol') or 'Empleado'
        predio = serializer.save()

        BitacoraAuditoria.objects.create(
            usuario=usuario,
            accion="CREAR",
            modulo="Predios",
            descripcion=f"Se registró el predio '{predio.nombre_predio}' (ID: {predio.pk}) ubicado en {predio.municipio}"
        )

    def perform_update(self, serializer):
        predio_anterior = self.get_object()
        cambios = []
        
        # 1. Obtenemos los datos enviados desde el frontend
        datos_nuevos = self.request.data

        # 2. Comparar campos generales y de ubicación/tenencia del predio
        campos_predio = {
            'nombre_predio': 'Nombre del Predio',
            'municipio': 'Municipio',
            'parroquia': 'Parroquia',
            'comunidad': 'Comunidad / Sector',
            'centro_poblado': 'Centro Poblado',
            'coordenadas': 'Coordenadas',
            'direccion': 'Dirección Exacta',
            'superficie': 'Superficie (Ha)',
            'tipo_propiedad': 'Tipo de Propiedad',
            'tenencia': 'Tenencia de la Tierra',
            'vialidad': 'Condición Vialidad'
        }

        for campo, etiqueta in campos_predio.items():
            val_nuevo = datos_nuevos.get(campo)
            if val_nuevo is not None:
                val_ant = getattr(predio_anterior, campo, None)
                if str(val_ant) != str(val_nuevo):
                    cambios.append(f"{etiqueta}: '{val_ant}' ➔ '{val_nuevo}'")

        # 3. Comparar datos del productor
        productor_nuevo = datos_nuevos.get('productor', {})
        if predio_anterior.productor:
            prod_ant = predio_anterior.productor
            campos_productor = {
                'nombre': 'Productor (Nombre)',
                'cedula_rif': 'Productor (Cédula / RIF)',
                'telefono': 'Productor (Teléfono)',
                'correo': 'Productor (Correo Electrónico)'
            }
            for campo, etiqueta in campos_productor.items():
                val_nuevo = productor_nuevo.get(campo)
                if val_nuevo is not None:
                    val_ant = getattr(prod_ant, campo, None)
                    if str(val_ant) != str(val_nuevo):
                        cambios.append(f"{etiqueta}: '{val_ant}' ➔ '{val_nuevo}'")

        # 4. Comparar infraestructura
        infraestructura_nueva = datos_nuevos.get('infraestructura', {})
        if hasattr(predio_anterior, 'infraestructura') and predio_anterior.infraestructura:
            infra_ant = predio_anterior.infraestructura
            for campo, val_nuevo in infraestructura_nueva.items():
                if hasattr(infra_ant, campo):
                    val_ant = getattr(infra_ant, campo)
                    if val_ant is not None and val_nuevo is not None and str(val_ant) != str(val_nuevo):
                        nombre_amigable = campo.replace('_', ' ').capitalize()
                        cambios.append(f"Infraestructura ({nombre_amigable}): '{val_ant}' ➔ '{val_nuevo}'")

        # 5. Comparar producción (Tipo de explotación y sistemas de registro)
        produccion_nueva = datos_nuevos.get('produccion', {})
        if hasattr(predio_anterior, 'produccion') and predio_anterior.produccion:
            prod_ant = predio_anterior.produccion
            campos_produccion = {
                'tipo_explotacion': 'Tipo de Explotación',
                'registro_sanitario': 'Registro Sanitario',
                'registro_productivo': 'Registro Productivo',
                'registro_reproductivo': 'Registro Reproductivo',
                'registro_financiero': 'Registro Financiero'
            }
            for campo, etiqueta in campos_produccion.items():
                val_nuevo = produccion_nueva.get(campo)
                if val_nuevo is not None:
                    val_ant = getattr(prod_ant, campo, None)
                    if str(val_ant) != str(val_nuevo):
                        cambios.append(f"{etiqueta}: '{val_ant}' ➔ '{val_nuevo}'")

        # 5.1. Comparar existencia animal (NUEVO - Sin borrar nada previo)
        existencia_nueva = datos_nuevos.get('existencia_animal', {})
        if hasattr(predio_anterior, 'existencia_animal') and predio_anterior.existencia_animal and existencia_nueva:
            exist_ant = predio_anterior.existencia_animal
            for campo, val_nuevo in existencia_nueva.items():
                if hasattr(exist_ant, campo):
                    val_ant = getattr(exist_ant, campo)
                    if val_ant is not None and val_nuevo is not None and str(val_ant) != str(val_nuevo):
                        nombre_amigable = campo.replace('_', ' ').capitalize()
                        cambios.append(f"Existencia Animal ({nombre_amigable}): '{val_ant}' ➔ '{val_nuevo}'")

        # 5.2. Comparar maquinaria (NUEVO - Sin borrar nada previo)
        maquinaria_nueva = datos_nuevos.get('maquinaria', {})
        if hasattr(predio_anterior, 'maquinaria') and predio_anterior.maquinaria and maquinaria_nueva:
            maq_ant = predio_anterior.maquinaria
            for campo, val_nuevo in maquinaria_nueva.items():
                if hasattr(maq_ant, campo):
                    val_ant = getattr(maq_ant, campo)
                    if val_ant is not None and val_nuevo is not None and str(val_ant) != str(val_nuevo):
                        nombre_amigable = campo.replace('_', ' ').capitalize()
                        cambios.append(f"Maquinaria ({nombre_amigable}): '{val_ant}' ➔ '{val_nuevo}'")

        # 5.3. Comparar rubros vegetales (NUEVO - Sin borrar nada previo)
        rubros_nuevos = datos_nuevos.get('rubros_vegetales')
        if rubros_nuevos is not None:
            # Si el frontend envía la lista de rubros, registramos que hubo actualización en esta sección
            cambios.append("Rubros Vegetales actualizados")

        # 6. Comparar servicios básicos (si vienen en la petición)
        servicios_nuevos = datos_nuevos.get('servicios')
        if servicios_nuevos is not None:
            servicios_antiguos = [ps.servicio.nombre_servicio for ps in predio_anterior.predioservicio_set.all()]
            if set(servicios_antiguos) != set(servicios_nuevos):
                cambios.append(f"Servicios Básicos: '{', '.join(servicios_antiguos)}' ➔ '{', '.join(servicios_nuevos)}'")

        # 7. Guardar cambios en la base de datos
        predio = serializer.save()
        
        # 8. Definir módulo, acción y descripción personalizados
        accion = "EDITAR"
        modulo = "Predios"
        
        # Verificamos si los cambios involucran caracterización (rubros, animales, maquinaria)
        es_caracterizacion = any("Rubros Vegetales" in c or "Existencia Animal" in c or "Maquinaria" in c for c in cambios)

        if es_caracterizacion:
            # Usamos "CREAR" (o la palabra que tu frontend pinte en verde, ej. "REGISTRAR" si ya lo ajustaste allá)
            accion = "CREAR" 
            modulo = "Producción"
            descripcion = f"Se caracterizó el predio '{predio.nombre_predio}'"
        else:
            if cambios:
                detalles_texto = "; ".join(cambios)
                descripcion = f"Se editó el predio '{predio.nombre_predio}'. Modificaciones: {detalles_texto}"
            else:
                descripcion = f"Se actualizó la información general del predio '{predio.nombre_predio}'"

        # 9. Registrar en la bitácora
        usuario = datos_nuevos.get('usuario') or 'Empleado'

        BitacoraAuditoria.objects.create(
            usuario=usuario,
            accion=accion,
            modulo=modulo,
            descripcion=descripcion
        )
    
    def perform_destroy(self, instance):
        nombre = instance.nombre_predio
        municipio = instance.municipio
        usuario = self.request.data.get('usuario', 'Administrador')

        instance.delete()

        BitacoraAuditoria.objects.create(
            usuario=usuario,
            accion="ELIMINAR",
            modulo="Predios",
            descripcion=f"Se eliminó el predio '{nombre}' del municipio {municipio}"
        )

class LicenciaHierroViewSet(viewsets.ModelViewSet):
    queryset = LicenciaHierro.objects.all()
    serializer_class = LicenciaHierroSerializer

    def perform_create(self, serializer):
        # Capturamos el nombre real del empleado enviado desde el frontend (ej. "Carlos Gómez" o "Empleado - Juan")
        nombre_empleado = self.request.data.get('empleado') or self.request.data.get('usuario') or self.request.data.get('rol') or 'Empleado'
        
        # Guardamos la licencia
        licencia = serializer.save()
        
        # Obtenemos el nombre y municipio del predio asociado de forma segura
        predio = licencia.predio
        nombre_predio = predio.nombre_predio if predio else "Desconocido"
        nombre_municipio = predio.municipio if (predio and predio.municipio) else "Sin municipio"
        
        # Combinamos el empleado con su municipio para que quede registrado en la bitácora
        usuario_con_municipio = f"{nombre_empleado} ({nombre_municipio})"

        BitacoraAuditoria.objects.create(
            usuario=usuario_con_municipio,
            accion="CREAR",
            modulo="Producción",
            descripcion=f"Se creó y registró la licencia de hierro para el predio '{nombre_predio}' del municipio {nombre_municipio}"
        ) 

    def perform_update(self, serializer):
        # Capturamos el empleado y el rol de manera segura
        nombre_empleado = self.request.data.get('empleado') or self.request.data.get('usuario') or self.request.data.get('rol') or 'Empleado'
        
        # Corregido: Guardamos la licencia correctamente
        licencia = serializer.save()
        
        # Obtenemos el predio desde la licencia
        predio = licencia.predio
        nombre_predio = predio.nombre_predio if predio else "Desconocido"
        nombre_municipio = predio.municipio if (predio and predio.municipio) else "Sin municipio"
        
        usuario_con_municipio = f"{nombre_empleado} ({nombre_municipio})"

        BitacoraAuditoria.objects.create(
            usuario=usuario_con_municipio,
            accion="ACTUALIZAR",
            modulo="Producción",
            descripcion=f"Se actualizó la licencia de hierro del predio '{nombre_predio}' del municipio {nombre_municipio}"
        )

    def perform_destroy(self, instance):
        nombre_empleado = self.request.data.get('empleado') or self.request.data.get('usuario') or self.request.data.get('rol') or 'Administrador'
        
        predio = instance.predio
        nombre_predio = predio.nombre_predio if predio else "Desconocido"
        nombre_municipio = predio.municipio if (predio and predio.municipio) else "Sin municipio"
        
        usuario_con_municipio = f"{nombre_empleado} ({nombre_municipio})"

        instance.delete()

        BitacoraAuditoria.objects.create(
            usuario=usuario_con_municipio,
            accion="ELIMINAR",
            modulo="Producción - Licencia de Hierro",
            descripcion=f"Se eliminó la licencia de hierro del predio '{nombre_predio}' del municipio {nombre_municipio}"
        )

@api_view(['POST'])
def enviar_codigo_whatsapp(request):

    telefono = request.data.get("telefono")

    codigo = str(random.randint(100000, 999999))

    mensaje = f"""

Código de validación MPPAT

Su código de confirmación es:

{codigo}

No comparta este código.
"""

    url = "https://api.ultramsg.com/instance178120/messages/chat"

    payload = {

        "token": "wukizlc37nijuqyj",

        "to": telefono,

        "body": mensaje
    }

    response = requests.post(url, data=payload)

    return Response({

        "success": True,

        "codigo": codigo,

        "respuesta_whatsapp": response.json()
    })


@api_view(['GET'])
def dashboard_produccion_stats(request):
    # ── CARD 1: PREDIOS CARACTERIZADOS ─────────────────────────────────
    predios_caracterizados = Predio.objects.filter(
        caracterizacion_completada=True).count()

# ── CARD 2: CANTIDAD DE SEMOVIENTES REGISTRADOS ─────────────────────
    import json
    total_semovientes = 0
    existencias = ExistenciaAnimal.objects.all()

    for existencia in existencias:
        # Función para forzar la conversión segura a un diccionario nativo
        def obtener_diccionario(campo):
            if isinstance(campo, str):
                try:
                    return json.loads(campo)
                except json.JSONDecodeError:
                    return {}
            return campo if isinstance(campo, dict) else {}

        # Agrupamos los bloques pecuarios principales
        bloques_animales = [
            obtener_diccionario(existencia.bovinos),
            obtener_diccionario(existencia.bubalinos),
            obtener_diccionario(existencia.equinos),
            obtener_diccionario(existencia.ovinos),
            obtener_diccionario(existencia.porcinos),
            obtener_diccionario(existencia.caprinos),
            obtener_diccionario(existencia.cunicola),
            obtener_diccionario(existencia.avicola),
            obtener_diccionario(existencia.apicola)
        ]

        for bloque in bloques_animales:
            if not bloque:
                continue

            # IMPRESIÓN DE DEPURACIÓN: Verás en la consola de tu terminal cómo está estructurado tu JSON real
            print("ESTRUCTURA REAL DEL JSONField:", bloque)

            # ESTRATEGIA A: Si existe explícitamente una llave llamada 'total'
            if 'total' in bloque:
                try:
                    total_semovientes += int(float(bloque['total']))
                    continue  # Salta a la siguiente especie
                except (ValueError, TypeError):
                    pass

            # ESTRATEGIA B: Si no hay llave 'total', sumamos dinámicamente CUALQUIER número dentro del JSON
            # Esto cubre casos donde guardas {'vacas': 10, 'toros': 5, 'becerros': 2}
            for llave, valor in bloque.items():
                # Ignoramos llaves de configuración de interfaz si las hubiera
                if llave.lower() in ['id', 'nombre', 'observaciones', 'tipo']:
                    continue
                try:
                    # Si el valor se puede convertir a número entero, se añade al conteo
                    total_semovientes += int(float(valor))
                except (ValueError, TypeError):
                    pass  # Si es un string o texto descriptivo, lo ignora de forma segura

    # ── CARD 3: HECTÁREAS SEMBRADAS ────────────────────────────────────
    resultado_hectareas = RubroVegetal.objects.aggregate(
        total_has=Sum('hectareas'))
    total_hectareas = resultado_hectareas['total_has'] or 0

# ── GRÁFICOS REALES BASADOS EN TUS MODELOS ──────────────────────────

    # Auxiliar para deserializar JSON con seguridad
    def parse_json(campo):
        if isinstance(campo, str):
            try:
                return json.loads(campo)
            except json.JSONDecodeError:
                return {}
        return campo if isinstance(campo, dict) else {}

    # Auxiliar para sumar numéricamente los desgloses internos de cada especie
    def total_del_bloque(bloque):
        if not bloque:
            return 0
        if 'total' in bloque:
            try:
                return int(float(bloque['total']))
            except (ValueError, TypeError):
                pass
        suma = 0
        for k, v in bloque.items():
            if k.lower() in ['id', 'nombre', 'observaciones', 'tipo']:
                continue
            try:
                suma += int(float(v))
            except (ValueError, TypeError):
                pass
        return suma

    # Inicializadores para los conteos de cabezas y capacidades
    sumas_especies = {"Bovino": 0, "Bubalino": 0, "Porcino": 0,
                      "Caprino": 0, "Equino": 0, "Ovino": 0, "Avícola": 0}
    sumas_capacidades = {"Bovinos": 0, "Bubalinos": 0, "Porcinos": 0,
                         "Caprinos": 0, "Equinos": 0, "Ovinos": 0, "Avícola": 0}

    for ex in existencias:
        # 1. Conteo de cabezas reales por especie
        sumas_especies["Bovino"] += total_del_bloque(parse_json(ex.bovinos))
        sumas_especies["Bubalino"] += total_del_bloque(
            parse_json(ex.bubalinos))
        sumas_especies["Porcino"] += total_del_bloque(parse_json(ex.porcinos))
        sumas_especies["Caprino"] += total_del_bloque(parse_json(ex.caprinos))
        sumas_especies["Equino"] += total_del_bloque(parse_json(ex.equinos))
        sumas_especies["Ovino"] += total_del_bloque(parse_json(ex.ovinos))
        sumas_especies["Avícola"] += total_del_bloque(parse_json(ex.avicola))

        # 2. Conteo de capacidad instalada real (Campos de capacidad)
# Verifica que esta función auxiliar esté convirtiendo correctamente nulos o vacíos
        def extraer_capacidad(val):
            try:
                # Si los datos en tu BD vienen como strings vacíos, Nones o caracteres extraños, esto los rescata devolviendo 0
                return int(float(val)) if val else 0
            except (ValueError, TypeError):
                return 0

        # Verifica que los nombres de los atributos coincidan exactamente con tu modelo ExistenciaAnimal
        sumas_capacidades["Bovinos"] += extraer_capacidad(
            getattr(ex, 'capacidadBovina', 0))
        sumas_capacidades["Bubalinos"] += extraer_capacidad(
            getattr(ex, 'capacidadBubalina', 0))
        sumas_capacidades["Porcinos"] += extraer_capacidad(
            getattr(ex, 'capacidadPorcina', 0))
        sumas_capacidades["Caprinos"] += extraer_capacidad(
            getattr(ex, 'capacidadCaprino', 0))
        sumas_capacidades["Equinos"] += extraer_capacidad(
            getattr(ex, 'capacidadEquina', 0))
        sumas_capacidades["Ovinos"] += extraer_capacidad(
            getattr(ex, 'capacidadOvina', 0))
        sumas_capacidades["Avícola"] += extraer_capacidad(
            getattr(ex, 'capacidadAvicola', 0))

    # ESTRUCTURA GRÁFICO 1: Cantidad por Especie (Barras)
    datos_produccion_general = [
        {"name": k, "cantidad": v} for k, v in sumas_especies.items()
    ]

    # ESTRUCTURA GRÁFICO 2: Destino de Producción Vegetal (Dona / Circular)
    # Agrupa dinámicamente según el destino declarado en tus rubros vegetales
    destinos_dict = {}
    rubros_reg = RubroVegetal.objects.all()
    for r in rubros_reg:
        # Si tienes una propiedad destino, la usamos. Si no, agrupamos dinámicamente por tipo de 'rubro'
        dest = getattr(r, 'destino', None) or getattr(r, 'rubro', 'Otros')
        destinos_dict[dest] = destinos_dict.get(dest, 0) + 1

    colores_pie = ["#136442", "#4CAF50",
                   "#82ca9d", "#FFBB28", "#FF8042", "#a4de6c"]
    datos_actividad = [
        {"name": str(k), "value": int(
            v), "color": colores_pie[i % len(colores_pie)]}
        for i, (k, v) in enumerate(destinos_dict.items())
    ]
    if not datos_actividad:  # Fallback en caso de que esté completamente vacío
        datos_actividad = [
            {"name": "Sin registros", "value": 0, "color": "#cccccc"}]

# ── ESTRUCTURA GRÁFICO 3: Uso Tecnológico y Maquinaria (Radar) ──────────────────
    maquinarias_registro = Maquinaria.objects.all()

    # Inicializamos los contadores de unidades físicas reales
    total_ruedas = 0
    total_implementos = 0
    total_riego = 0
    total_otros = 0

    # Función auxiliar para parsear y sumar las cantidades dentro de cada bloque de maquinaria
    def sumar_unidades_maquinaria(campo_json):
        if not campo_json:
            return 0
        # Forzar a diccionario si viene como string
        if isinstance(campo_json, str):
            try:
                campo_json = json.loads(campo_json)
            except json.JSONDecodeError:
                return 0

        if not isinstance(campo_json, dict):
            return 0

        # Si el JSON tiene una estructura con una llave 'cantidad' o 'total', la usamos
        if 'cantidad' in campo_json:
            try:
                return int(float(campo_json['cantidad']))
            except (ValueError, TypeError):
                pass
        if 'total' in campo_json:
            try:
                return int(float(campo_json['total']))
            except (ValueError, TypeError):
                pass

        # Si guarda elementos individuales como {'tractores': 2, 'cosechadoras': 1}
        suma = 0
        for k, v in campo_json.items():
            if k.lower() in ['id', 'nombre', 'observaciones', 'tipo', 'estatus', 'marca']:
                continue
            try:
                suma += int(float(v))
            except (ValueError, TypeError):
                pass
        return suma

    # Recorremos cada registro de maquinaria en la base de datos para extraer los datos reales
    for maq in maquinarias_registro:
        # 1. Maquinaria de Ruedas (manejando el posible typo de tu modelo)
        if hasattr(maq, 'maquinaria_ruedas'):
            total_ruedas += sumar_unidades_maquinaria(maq.maquinaria_ruedas)
        elif hasattr(maq, 'maquinaria_ruwas'):
            total_ruedas += sumar_unidades_maquinaria(maq.maquinaria_ruwas)

        # 2. Implementos
        if hasattr(maq, 'implementos'):
            total_implementos += sumar_unidades_maquinaria(maq.implementos)

        # 3. Riego
        if hasattr(maq, 'riego'):
            total_riego += sumar_unidades_maquinaria(maq.riego)

        # 4. Otros Equipos
        if hasattr(maq, 'otros'):
            total_otros += sumar_unidades_maquinaria(maq.otros)

    # Gran total de unidades reales registradas en la caracterización
    gran_total_equipos = total_ruedas + total_implementos + total_riego + total_otros

    # Calculamos el porcentaje verdadero basado en la cantidad real de la base de datos
    if gran_total_equipos > 0:
        porcentaje_ruedas = (total_ruedas / gran_total_equipos) * 100
        porcentaje_implementos = (total_implementos / gran_total_equipos) * 100
        porcentaje_riego = (total_riego / gran_total_equipos) * 100
        porcentaje_otros = (total_otros / gran_total_equipos) * 100
    else:
        # Estado inicial equitativo (25% cada uno) si la base de datos está totalmente vacía
        porcentaje_ruedas = 25.0
        porcentaje_implementos = 25.0
        porcentaje_riego = 25.0
        porcentaje_otros = 25.0

    # Estructura final con los cálculos reales procesados
    datos_flujo = [
        {"subject": "Maquinaria Agrícola de Ruedas", "A": porcentaje_ruedas},
        {"subject": "Implementos Agrícolas", "A": porcentaje_implementos},
        {"subject": "Equipos de Riego", "A": porcentaje_riego},
        {"subject": "Otros Equipos", "A": porcentaje_otros},
    ]

    # ── ESTRUCTURA GRÁFICO 4: Capacidad Productiva por Especie (Bar Horizontal) ─────
    datos_estado = [
        {"especie": k, "cantidad": v} for k, v in sumas_capacidades.items()
    ]

    return Response({
        "cards": {
            "predios_caracterizados": predios_caracterizados,
            "total_semovientes": total_semovientes,
            "total_hectareas": float(total_hectareas)
        },
        "graficos": {
            "produccion_general": datos_produccion_general,
            "actividad_reciente": datos_actividad,
            "flujo_sistema": datos_flujo,
            "estado_sistema": datos_estado
        }
    })


@api_view(['GET', 'POST'])
def configurar_o_login_admin(request):
    # Ver si ya existe algún administrador configurado en la BD
    admin_existe = AdministradorSistema.objects.exists()

    if request.method == 'GET':
        # Indicamos a React si ya está configurado o no
        return Response({
            "configurado": admin_existe
        }, status=status.HTTP_200_OK)

    if request.method == 'POST':
        data = request.data
        usuario = data.get('usuario')
        clave = data.get('clave')
        nombre = data.get('nombre', '')

        if not admin_existe:
            # ── REGISTRO ÚNICO (Primer administrador) ──
            if not usuario or not clave or not nombre:
                return Response({"error": "Todos los campos son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

            # Guardamos la contraseña cifrada por seguridad
            nuevo_admin = AdministradorSistema.objects.create(
                nombre=nombre,
                usuario=usuario,
                clave=make_password(clave),
                rol="Administrador Maestro"
            )
            return Response({
                "mensaje": "Administrador registrado con éxito",
                "usuario": {
                    "nombre": nuevo_admin.nombre,
                    "usuario": nuevo_admin.usuario,
                    "rol": nuevo_admin.rol
                }
            }, status=status.HTTP_201_CREATED)
        else:
            # ── INICIO DE SESIÓN ──
            try:
                admin = AdministradorSistema.objects.get(usuario=usuario)
                # Verificamos la contraseña
                if check_password(clave, admin.clave):
                    return Response({
                        "mensaje": "Login exitoso",
                        "usuario": {
                            "nombre": admin.nombre,
                            "usuario": admin.usuario,
                            "rol": admin.rol
                        }
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Credenciales incorrectas."}, status=status.HTTP_400_BAD_REQUEST)
            except AdministradorSistema.DoesNotExist:
                return Response({"error": "El usuario no existe."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def guardar_credencial_municipio(request):
    municipio_id = request.data.get('municipio_id')
    nombre_mun = request.data.get('nombre_municipio')
    usuario = request.data.get('usuario')
    clave = request.data.get('clave')

    if not municipio_id or not usuario or not clave:
        return Response({"error": "Faltan datos obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

    if len(clave) < 8:
        return Response({"error": "La contraseña debe tener al menos 8 caracteres."}, status=status.HTTP_400_BAD_REQUEST)

    # Hashear la contraseña por seguridad
    clave_encriptada = make_password(clave)

    # Guarda o actualiza el registro de forma única por municipio
    admin_mun, creado = AdministradorSistema.objects.update_or_create(
        municipio=municipio_id,
        defaults={
            'nombre': f"Admin {nombre_mun}",
            'usuario': usuario,
            'clave': clave_encriptada,
            'rol': f"Municipio {nombre_mun}"
        }
    )

    return Response({
        "mensaje": "¡Credenciales guardadas exitosamente en la base de datos!",
        "usuario": admin_mun.usuario
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def obtener_credenciales_municipios(request):
    # Retorna la lista de municipios que ya tienen credenciales configuradas
    credenciales = AdministradorSistema.objects.filter(
        municipio__isnull=False).values('municipio', 'usuario')
    data = {item['municipio']: {"creado": True, "usuario": item['usuario']}
            for item in credenciales}
    return Response(data)


@api_view(['POST'])
def login_admin_api(request):
    data = request.data
    usuario = data.get('usuario')
    clave = data.get('clave')

    if not usuario or not clave:
        return Response({"success": False, "message": "Usuario y contraseña obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        admin = AdministradorSistema.objects.get(usuario=usuario)

        # 🚫 Solo bloqueamos si es el Administrador Maestro
        if admin.rol == "Administrador Maestro":
            return Response({"success": False, "message": "Este acceso no está disponible para el Administrador Maestro."}, status=status.HTTP_403_FORBIDDEN)

        # Validamos la contraseña encriptada
        if check_password(clave, admin.clave):
            return Response({
                "success": True,
                "usuario": {
                    "id": admin.id,
                    "nombre": admin.nombre,
                    "usuario": admin.usuario,
                    "rol": admin.rol,
                    "municipio": admin.municipio or ""
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({"success": False, "message": "Usuario o contraseña incorrectos."}, status=status.HTTP_400_BAD_REQUEST)

    except AdministradorSistema.DoesNotExist:
        return Response({"success": False, "message": "Usuario o contraseña incorrectos."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'PUT'])
def gestionar_credenciales_noticias(request):
    if request.method == 'GET':
        try:
            admin_noticias = AdministradorSistema.objects.get(
                rol="Empleado de Noticias")
            return Response({
                "usuario": admin_noticias.usuario,
                "activo": True
            }, status=status.HTTP_200_OK)
        except AdministradorSistema.DoesNotExist:
            return Response({"activo": False}, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        usuario = request.data.get('usuario')
        password = request.data.get('password')

        if not usuario or not password:
            return Response({"error": "El usuario y la contraseña son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

        if len(password) < 8:
            return Response({"error": "La contraseña debe tener al menos 8 caracteres."}, status=status.HTTP_400_BAD_REQUEST)

        clave_encriptada = make_password(password)

        admin_noticias, creado = AdministradorSistema.objects.update_or_create(
            rol="Empleado de Noticias",
            defaults={
                'nombre': "Empleado de Noticias",
                'usuario': usuario,
                'clave': clave_encriptada,
            }
        )

        return Response({
            "mensaje": "¡Credenciales del empleado de noticias actualizadas correctamente!",
            "usuario": admin_noticias.usuario,
            "activo": True
        }, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def gestionar_noticias(request):
    if request.method == 'POST':
        titulo = request.data.get('titulo')
        descripcion = request.data.get('descripcion')
        imagen = request.FILES.get('imagen')

        if not titulo or not descripcion:
            return Response({"error": "El título y la descripción son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

        noticia = Noticia.objects.create(
            titulo=titulo, descripcion=descripcion, imagen=imagen)
        return Response({"mensaje": "¡Noticia registrada con éxito!"}, status=status.HTTP_201_CREATED)

    elif request.method == 'GET':
        noticias = Noticia.objects.all().order_by('-fecha_creacion')
        data = [
            {
                "id": n.id,
                "titulo": n.titulo,
                "descripcion": n.descripcion,
                "imagen": request.build_absolute_uri(n.imagen.url) if n.imagen else None,
                "fecha": n.fecha_creacion
            }
            for n in noticias
        ]
        return Response(data, status=status.HTTP_200_OK)


@api_view(['PUT', 'DELETE'])
def detalle_noticia(request, pk):
    try:
        noticia = Noticia.objects.get(pk=pk)
    except Noticia.DoesNotExist:
        return Response({"error": "Noticia no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    # Capturamos el usuario si viene en el request (o un valor por defecto)
    usuario_actual = request.data.get('usuario', 'Administrador')

    if request.method == 'PUT':
        titulo = request.data.get('titulo', noticia.titulo)
        descripcion = request.data.get('descripcion', noticia.descripcion)
        imagen = request.FILES.get('imagen')

        noticia.titulo = titulo
        noticia.descripcion = descripcion
        if imagen:
            noticia.imagen = imagen
        noticia.save()

        # ── REGISTRO EN BITÁCORA ──
        BitacoraAuditoria.objects.create(
            usuario=usuario_actual,
            accion="EDITAR",
            modulo="Noticias",
            descripcion=f"Se actualizó la noticia: '{noticia.titulo}'"
        )

        return Response({"mensaje": "¡Noticia actualizada con éxito!"}, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        titulo_noticia = noticia.titulo
        noticia.delete()

        # ── REGISTRO EN BITÁCORA ──
        BitacoraAuditoria.objects.create(
            usuario=usuario_actual,
            accion="ELIMINAR",
            modulo="Noticias",
            descripcion=f"Se eliminó la noticia: '{titulo_noticia}'"
        )

        return Response({"mensaje": "¡Noticia eliminada con éxito!"}, status=status.HTTP_200_OK)
