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