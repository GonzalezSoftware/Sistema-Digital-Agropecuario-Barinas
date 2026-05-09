from django.contrib import admin
from .models import Productor, Predio, Infraestructura, Produccion, Servicio, PredioServicio

# En la clase Productor
def __str__(self):
    return self.nombre

# En la clase Predio
def __str__(self):
    return f"{self.nombre_predio} - {self.municipio}"

# 1. Definición de los Inlines (Deben ir antes de PredioAdmin)
class InfraestructuraInline(admin.StackedInline):
    model = Infraestructura
    can_delete = False
    verbose_name_plural = 'VI. Infraestructura'

class ProduccionInline(admin.StackedInline):
    model = Produccion
    can_delete = False
    verbose_name_plural = 'VII. Modelo de Producción'

class ServiciosInline(admin.TabularInline):
    model = PredioServicio
    extra = 1 
    verbose_name_plural = 'V. Servicios Básicos'

# 2. Configuración del panel de Predio
@admin.register(Predio)
class PredioAdmin(admin.ModelAdmin):
    fieldsets = (
        ('I. Datos del Productor', {
            'fields': ('productor',)
        }),
        ('II. Georreferenciación y Ubicación', {
            'fields': ('nombre_predio', 'municipio', 'parroquia', 'comunidad', 'centro_poblado', 'direccion', 'este', 'norte')
        }),
        ('III. Identificación del Predio', {
            'fields': ('superficie', 'tipo_propiedad')
        }),
        ('IV. Tenencia y Vialidad', {
            'fields': ('tenencia', 'vialidad')
        }),
    )
    
    # IMPORTANTE: Los inlines van AQUÍ adentro para que Django los reconozca
    inlines = [ServiciosInline, InfraestructuraInline, ProduccionInline]
    
    list_display = ('nombre_predio', 'municipio', 'productor', 'fecha_registro')
    search_fields = ('nombre_predio', 'municipio')

# 3. Otros registros independientes
admin.site.register(Productor)
admin.site.register(Servicio)