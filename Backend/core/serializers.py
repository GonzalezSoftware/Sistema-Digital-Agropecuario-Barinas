from rest_framework import serializers
from .models import (
    Predio,
    Infraestructura,
    Produccion,
    Productor,
    Servicio,
    PredioServicio,
    LicenciaHierro,
    RubroVegetal,
    ExistenciaAnimal,
    Maquinaria
)

class LicenciaHierroSerializer(serializers.ModelSerializer):

    class Meta:
        model = LicenciaHierro
        fields = '__all__' 

# 1. Definimos primero los serializadores de las tablas hijas
class ProductorSerializer(serializers.ModelSerializer):
    licencias = serializers.SerializerMethodField()
    # Definimos explícitamente para controlar la validación
    cedula_rif = serializers.CharField(validators=[])

    class Meta:
        model = Productor
        fields = ['id', 'cedula_rif', 'nombre', 'telefono', 'correo', 'licencias']

    def get_licencias(self, obj):
        """
        obj es el Productor actual. 
        Buscamos el predio que le pertenece a este productor, y luego 
        traemos las licencias asociadas a ese predio.
        """
        # 1. Buscamos el predio asociado a este productor
        predio = Predio.objects.filter(productor=obj).first()
        
        # 2. Si el productor tiene un predio, buscamos las licencias de ese predio
        if predio:
            licencias_queryset = LicenciaHierro.objects.filter(predio=predio)
            return LicenciaHierroSerializer(licencias_queryset, many=True).data
        
        # 3. Si no tiene predio asignado aún, devolvemos el arreglo vacío
        return []

class InfraestructuraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infraestructura
        exclude = ['predio'] 

class ProduccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produccion
        exclude = ['predio']
 
        
class RubroVegetalSerializer(serializers.ModelSerializer):
    class Meta:
        model = RubroVegetal
        exclude = ['predio']
        
class ExistenciaAnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExistenciaAnimal
        exclude = ['predio']
        
class MaquinariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maquinaria
        exclude = ['predio']                        

# 2. Definimos al final el serializador principal que usa a los anteriores
class PredioSerializer(serializers.ModelSerializer):
    # Agregamos allow_null=True para permitir actualizaciones parciales sin conflictos
    productor = ProductorSerializer(required=False)
    infraestructura = InfraestructuraSerializer(required=False, allow_null=True)
    produccion = ProduccionSerializer(required=False, allow_null=True)
    rubros_vegetales = RubroVegetalSerializer(many=True, required=False, allow_null=True)
    existencia_animal = ExistenciaAnimalSerializer(required=False, allow_null=True)
    maquinaria = MaquinariaSerializer(required=False, allow_null=True)
    servicios = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = Predio
        fields = '__all__'

    def create(self, validated_data):
        # 1. Extracción de datos anidados
        rubros_data = validated_data.pop('rubros_vegetales', [])
        existencia_data = validated_data.pop('existencia_animal', {})
        maquinaria_data = validated_data.pop('maquinaria', {})
        productor_data = validated_data.pop('productor')
        infra_data = validated_data.pop('infraestructura')
        prod_data = validated_data.pop('produccion')
        servicios_nombres = validated_data.pop('servicios', [])

        # 2. Gestión segura del productor
        cedula = productor_data.pop('cedula_rif')
        productor, _ = Productor.objects.update_or_create(
            cedula_rif=cedula,
            defaults=productor_data
        )

        # 3. Creación del predio principal
        predio = Predio.objects.create(productor=productor, **validated_data)

        # 4. Procesamiento de relaciones
        for nombre in servicios_nombres:
            servicio_obj, _ = Servicio.objects.get_or_create(nombre_servicio=nombre)
            PredioServicio.objects.create(predio=predio, servicio=servicio_obj)
            
        for rubro in rubros_data:
            RubroVegetal.objects.create(predio=predio, **rubro)
            
        if existencia_data:
            ExistenciaAnimal.objects.create(predio=predio, **existencia_data)
        
        if maquinaria_data:
            Maquinaria.objects.create(predio=predio, **maquinaria_data)

        Infraestructura.objects.create(predio=predio, **infra_data)
        Produccion.objects.create(predio=predio, **prod_data)
        
        return predio

    # Tu método update ya está definido y funcionará correctamente 
    # una vez que el Serializador deje pasar los datos nulos/parciales.
    
    # ── AQUÍ ESTÁ LA SOLUCIÓN: MÉTODO UPDATE ──
    def update(self, instance, validated_data):

        if instance.caracterizacion_completada:

          raise serializers.ValidationError(
            "Este predio ya fue caracterizado."
        )

        # ─────────────────────────────
        # EXTRAER DATOS ANIDADOS
        # ─────────────────────────────

        productor_data = validated_data.pop('productor', None)

        infra_data = validated_data.pop('infraestructura', None)

        prod_data = validated_data.pop('produccion', None)

        rubros_data = validated_data.pop('rubros_vegetales', None)

        existencia_data = validated_data.pop('existencia_animal', None)

        maquinaria_data = validated_data.pop('maquinaria', None)

        servicios_nombres = validated_data.pop('servicios', None)

        # ─────────────────────────────
        # ACTUALIZAR CAMPOS BÁSICOS
        # ─────────────────────────────

        for attr, value in validated_data.items():

            setattr(instance, attr, value)

        instance.save()

        # ─────────────────────────────
        # ACTUALIZAR PRODUCTOR
        # ─────────────────────────────

        if productor_data and instance.productor:

            productor = instance.productor

            for attr, value in productor_data.items():

                if attr != 'cedula_rif':

                    setattr(productor, attr, value)

            productor.save()

        # ─────────────────────────────
        # ACTUALIZAR INFRAESTRUCTURA
        # ─────────────────────────────

        if infra_data:

            infraestructura, created = Infraestructura.objects.get_or_create(
                predio=instance
            )

            for attr, value in infra_data.items():

                setattr(infraestructura, attr, value)

            infraestructura.save()

        # ─────────────────────────────
        # ACTUALIZAR PRODUCCIÓN
        # ─────────────────────────────

        if prod_data:

            produccion, created = Produccion.objects.get_or_create(
                predio=instance
            )

            for attr, value in prod_data.items():

                setattr(produccion, attr, value)

            produccion.save()

        # ─────────────────────────────
        # ACTUALIZAR RUBROS VEGETALES
        # ─────────────────────────────

        if rubros_data is not None:

            instance.rubros_vegetales.all().delete()

            for rubro in rubros_data:

                RubroVegetal.objects.create(
                    predio=instance,
                    **rubro
                )

        # ─────────────────────────────
        # ACTUALIZAR EXISTENCIA ANIMAL
        # ─────────────────────────────

        if existencia_data is not None:

            existencia_obj, created = ExistenciaAnimal.objects.get_or_create(
                predio=instance
            )

            for attr, value in existencia_data.items():

                setattr(existencia_obj, attr, value)

            existencia_obj.save()

        # ─────────────────────────────
        # ACTUALIZAR MAQUINARIA
        # ─────────────────────────────

        if maquinaria_data is not None:

            maquinaria_obj, created = Maquinaria.objects.get_or_create(
                predio=instance
            )

            for attr, value in maquinaria_data.items():

                setattr(maquinaria_obj, attr, value)

            maquinaria_obj.save()

        # ─────────────────────────────
        # ACTUALIZAR SERVICIOS
        # ─────────────────────────────

        if servicios_nombres is not None:

            PredioServicio.objects.filter(
                predio=instance
            ).delete()

            for nombre in servicios_nombres:

                servicio_obj, _ = Servicio.objects.get_or_create(
                    nombre_servicio=nombre
                )

                PredioServicio.objects.create(
                    predio=instance,
                    servicio=servicio_obj
                )
                

        return instance