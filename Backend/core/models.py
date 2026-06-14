from django.db import models

# ─────────────────────────────
# PRODUCTOR
# ─────────────────────────────
class Productor(models.Model):
    cedula_rif = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    correo = models.CharField(max_length=150, null=True, blank=True)

    class Meta:
        db_table = 'productores'

# ─────────────────────────────
# PREDIO (TABLA PRINCIPAL)
# ─────────────────────────────
class Predio(models.Model):
    id_predio = models.AutoField(primary_key=True, db_column='id_predio')
    productor = models.ForeignKey(Productor, on_delete=models.CASCADE, related_name='predios', null=True, blank=True)

    # Campos de Identificación y Ubicación (según tu Interfaz)
    nombre_predio = models.CharField(max_length=150)
    municipio = models.CharField(max_length=100)
    parroquia = models.CharField(max_length=100, null=True, blank=True)
    comunidad = models.CharField(max_length=150, null=True, blank=True)
    centro_poblado = models.CharField(max_length=150, null=True, blank=True) # <-- NUEVO
    direccion = models.TextField(null=True, blank=True) # <-- NUEVO

    superficie = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    coordenadas = models.CharField(max_length=100, null=True, blank=True, help_text="Latitud, Longitud")

    # Campos de Tenencia y Tipo
    tipo_propiedad = models.CharField(max_length=50, null=True, blank=True) # <-- NUEVO (Público/Privado)
    tenencia = models.CharField(max_length=100) # (Propiedad, Ocupación, etc.)
    vialidad = models.CharField(max_length=50) # (Excelente, Bueno, etc.)
    
    fecha_registro = models.DateTimeField(auto_now_add=True)
    caracterizacion_completada = models.BooleanField(default=False)

    class Meta:
        db_table = 'predios'

# ─────────────────────────────
# INFRAESTRUCTURA
# ─────────────────────────────
class Infraestructura(models.Model):
    predio = models.OneToOneField(Predio, on_delete=models.CASCADE, related_name='infraestructura')
    corrales = models.IntegerField(default=0)
    galpones = models.IntegerField(default=0)
    vaqueras = models.IntegerField(default=0)
    cochineras = models.IntegerField(default=0)
    silos = models.IntegerField(default=0)
    caballerizas = models.IntegerField(default=0)
    feedlot = models.IntegerField(default=0)
    lagunas = models.IntegerField(default=0)
    salas_ordeno = models.IntegerField(default=0)
    queseras = models.IntegerField(default=0)
    casas = models.IntegerField(default=0)
    trapiches = models.IntegerField(default=0)
    establos = models.IntegerField(default=0)

    class Meta:
        db_table = 'infraestructura'

# ─────────────────────────────
# PRODUCCIÓN
# ─────────────────────────────
class Produccion(models.Model):
    predio = models.OneToOneField(Predio, on_delete=models.CASCADE, related_name='produccion')
    tipo_explotacion = models.CharField(max_length=50)
    
    # Registros (Booleanos para los Checkboxes de React)
    registro_sanitario = models.BooleanField(default=False)
    registro_productivo = models.BooleanField(default=False)
    registro_reproductivo = models.BooleanField(default=False)
    registro_financiero = models.BooleanField(default=False)

    class Meta:
        db_table = 'produccion'

# ─────────────────────────────
# SERVICIOS (Muchos a Muchos)
# ─────────────────────────────
class Servicio(models.Model):
    nombre_servicio = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'servicios'

class PredioServicio(models.Model):
    predio = models.ForeignKey(Predio, on_delete=models.CASCADE)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)

    class Meta:
        db_table = 'predio_servicio'
        unique_together = ('predio', 'servicio')

class LicenciaHierro(models.Model):

    predio = models.ForeignKey('Predio', on_delete=models.CASCADE) # o como se llame tu modelo Predio
    codigo_hierro = models.CharField(max_length=100)
    numero_licencia = models.CharField(max_length=100)
    organismo_emisor = models.CharField(max_length=100)
    fecha_emision = models.DateField()
    fecha_vencimiento = models.DateField()
    observaciones = models.TextField(blank=True, null=True)
    certificado_pdf = models.FileField(upload_to='certificados/', blank=True, null=True)
    
    class Meta:
        db_table = "licencias_hierro"

        
# ─────────────────────────────
# RUBROS VEGETALES
# ─────────────────────────────
class RubroVegetal(models.Model):
    predio = models.ForeignKey(
        Predio,
        on_delete=models.CASCADE,
        related_name='rubros_vegetales'
    )

    rubro = models.CharField(max_length=150)
    hectareas = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estado = models.CharField(max_length=100, null=True, blank=True)
    riego = models.CharField(max_length=100, null=True, blank=True)
    ciclo_productivo = models.CharField(max_length=100, null=True, blank=True)
    tipo_produccion = models.CharField(max_length=100, null=True, blank=True)
    produccion_estimada = models.CharField(max_length=100, null=True, blank=True)
    destino = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'rubros_vegetales'
        
        
        
# ─────────────────────────────
# EXISTENCIA ANIMAL
# ─────────────────────────────
class ExistenciaAnimal(models.Model):

    predio = models.OneToOneField(
        Predio,
        on_delete=models.CASCADE,
        related_name='existencia_animal'
    )

    especiesSeleccionadas = models.JSONField(default=list)

    bovinos = models.JSONField(default=dict)
    capacidadBovina = models.JSONField(default=dict)

    bubalinos = models.JSONField(default=dict)
    capacidadBubalina = models.JSONField(default=dict)

    equinos = models.JSONField(default=dict)
    capacidadEquina = models.JSONField(default=dict)

    ovinos = models.JSONField(default=dict)
    capacidadOvina = models.JSONField(default=dict)

    porcinos = models.JSONField(default=dict)
    capacidadPorcina = models.JSONField(default=dict)

    caprinos = models.JSONField(default=dict)
    capacidadCaprino = models.JSONField(default=dict)

    cunicola = models.JSONField(default=dict)
    capacidadCunicola = models.JSONField(default=dict)

    avicola = models.JSONField(default=dict)
    capacidadAvicola = models.JSONField(default=dict)

    apicola = models.JSONField(default=dict)
    capacidadApicola = models.JSONField(default=dict)

    class Meta:
        db_table = 'existencia_animal'
        
        
        
# ─────────────────────────────
# MAQUINARIAS Y EQUIPOS
# ─────────────────────────────
class Maquinaria(models.Model):

    predio = models.OneToOneField(
        Predio,
        on_delete=models.CASCADE,
        related_name='maquinaria'
    )

    maquinariaSeleccionada = models.JSONField(default=list)

    maquinaria_ruedas = models.JSONField(default=dict)

    implementos = models.JSONField(default=dict)

    riego = models.JSONField(default=dict)

    otros_equipos = models.JSONField(default=dict)

    class Meta:
        db_table = 'maquinarias'
        
        