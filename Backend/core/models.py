from django.db import models

class Predio(models.Model):
    # Django crea el ID automáticamente si no lo defines, 
    # pero como lo hicimos manual en SQL, lo mapeamos así:
    nombre_predio = models.CharField(max_length=255)
    codigo_catastral = models.CharField(max_length=100, unique=True)
    actividad = models.CharField(max_length=20)
    superficie = models.DecimalField(max_digits=10, decimal_places=2)
    tipo_suelo = models.CharField(max_length=50)
    clima = models.CharField(max_length=50)
    municipio = models.CharField(max_length=100)
    parroquia = models.CharField(max_length=100)
    sector = models.CharField(max_length=255)
    latitud = models.FloatField(null=True, blank=True)
    longitud = models.FloatField(null=True, blank=True)
    productor_nombre = models.CharField(max_length=255)
    productor_telefono = models.CharField(max_length=20)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    punto_referencia = models.CharField(max_length=255, null=True, blank=True)
    productor_cedula = models.CharField(max_length=20, null=True, blank=True)
    cedula_imagen = models.FileField(upload_to='cedulas/', null=True, blank=True)

    class Meta:
        db_table = 'predios'  # ESTO ES CLAVE: Le dice a Django que use la tabla que ya creaste