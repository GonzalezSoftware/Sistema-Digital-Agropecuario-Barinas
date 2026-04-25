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
    productor = models.ForeignKey(Productor, on_delete=models.SET_NULL, null=True)

    nombre_predio = models.CharField(max_length=150)
    direccion = models.TextField(null=True, blank=True)
    superficie = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    municipio = models.CharField(max_length=100)
    parroquia = models.CharField(max_length=100, null=True, blank=True)
    comunidad = models.CharField(max_length=150, null=True, blank=True)
    centro_poblado = models.CharField(max_length=150, null=True, blank=True)

    utm_este = models.CharField(max_length=10, null=True, blank=True)
    utm_norte = models.CharField(max_length=10, null=True, blank=True)

    tipo_propiedad = models.CharField(max_length=20, null=True, blank=True)
    tenencia = models.CharField(max_length=100)

    vialidad = models.CharField(max_length=50)

    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'predios'


# ─────────────────────────────
# SERVICIOS
# ─────────────────────────────
class Servicio(models.Model):
    nombre_servicio = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'servicios'


# ─────────────────────────────
# RELACIÓN PREDIO - SERVICIOS
# ─────────────────────────────
class PredioServicio(models.Model):
    predio = models.ForeignKey(Predio, on_delete=models.CASCADE)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)

    class Meta:
        db_table = 'predio_servicio'
        unique_together = ('predio', 'servicio')


# ─────────────────────────────
# INFRAESTRUCTURA
# ─────────────────────────────
class Infraestructura(models.Model):
    predio = models.OneToOneField(Predio, on_delete=models.CASCADE)

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
    predio = models.OneToOneField(Predio, on_delete=models.CASCADE)

    tipo_explotacion = models.CharField(max_length=50)

    registro_sanitario = models.BooleanField(default=False)
    registro_productivo = models.BooleanField(default=False)
    registro_reproductivo = models.BooleanField(default=False)
    registro_financiero = models.BooleanField(default=False)

    class Meta:
        db_table = 'produccion'