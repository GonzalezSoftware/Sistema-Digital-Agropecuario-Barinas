import random
import requests
from rest_framework import viewsets
from django.db.models import Sum
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Predio, LicenciaHierro, Productor
from .serializers import PredioSerializer, LicenciaHierroSerializer
from .models import Predio, RubroVegetal, ExistenciaAnimal, Maquinaria
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import AdministradorSistema
from rest_framework.decorators import api_view
from rest_framework.response import Response


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
    serializer_class = PredioSerializer

    def get_queryset(self):
        queryset = Predio.objects.select_related(
            'productor', 'infraestructura', 'produccion', 'existencia_animal', 'maquinaria'
        ).prefetch_related(
            'rubros_vegetales', 'predioservicio_set__servicio'
        )

        cedula = self.request.query_params.get('cedula')
        if cedula:
            queryset = queryset.filter(productor__cedula_rif=cedula.strip().upper())

        return queryset

class LicenciaHierroViewSet(viewsets.ModelViewSet):

    queryset = LicenciaHierro.objects.all()
    serializer_class = LicenciaHierroSerializer


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
    predios_caracterizados = Predio.objects.filter(caracterizacion_completada=True).count()

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
                    continue # Salta a la siguiente especie
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
                    pass # Si es un string o texto descriptivo, lo ignora de forma segura
        
    # ── CARD 3: HECTÁREAS SEMBRADAS ────────────────────────────────────
    resultado_hectareas = RubroVegetal.objects.aggregate(total_has=Sum('hectareas'))
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
    sumas_especies = {"Bovino": 0, "Bubalino": 0, "Porcino": 0, "Caprino": 0, "Equino": 0, "Ovino": 0, "Avícola": 0}
    sumas_capacidades = {"Bovinos": 0, "Bubalinos": 0, "Porcinos": 0, "Caprinos": 0, "Equinos": 0, "Ovinos": 0, "Avícola": 0}

    for ex in existencias:
        # 1. Conteo de cabezas reales por especie
        sumas_especies["Bovino"] += total_del_bloque(parse_json(ex.bovinos))
        sumas_especies["Bubalino"] += total_del_bloque(parse_json(ex.bubalinos))
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
        sumas_capacidades["Bovinos"] += extraer_capacidad(getattr(ex, 'capacidadBovina', 0))
        sumas_capacidades["Bubalinos"] += extraer_capacidad(getattr(ex, 'capacidadBubalina', 0))
        sumas_capacidades["Porcinos"] += extraer_capacidad(getattr(ex, 'capacidadPorcina', 0))
        sumas_capacidades["Caprinos"] += extraer_capacidad(getattr(ex, 'capacidadCaprino', 0))
        sumas_capacidades["Equinos"] += extraer_capacidad(getattr(ex, 'capacidadEquina', 0))
        sumas_capacidades["Ovinos"] += extraer_capacidad(getattr(ex, 'capacidadOvina', 0))
        sumas_capacidades["Avícola"] += extraer_capacidad(getattr(ex, 'capacidadAvicola', 0))
        
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

    colores_pie = ["#136442", "#4CAF50", "#82ca9d", "#FFBB28", "#FF8042", "#a4de6c"]
    datos_actividad = [
        {"name": str(k), "value": int(v), "color": colores_pie[i % len(colores_pie)]} 
        for i, (k, v) in enumerate(destinos_dict.items())
    ]
    if not datos_actividad: # Fallback en caso de que esté completamente vacío
        datos_actividad = [{"name": "Sin registros", "value": 0, "color": "#cccccc"}]

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
            try: return int(float(campo_json['cantidad']))
            except (ValueError, TypeError): pass
        if 'total' in campo_json:
            try: return int(float(campo_json['total']))
            except (ValueError, TypeError): pass

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
    credenciales = AdministradorSistema.objects.filter(municipio__isnull=False).values('municipio', 'usuario')
    data = {item['municipio']: {"creado": True, "usuario": item['usuario']} for item in credenciales}
    return Response(data)

