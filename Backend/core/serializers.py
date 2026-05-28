from rest_framework import serializers
from .models import (
    Predio,
    Infraestructura,
    Produccion,
    Productor,
    Servicio,
    PredioServicio,
    RubroVegetal,
    ExistenciaAnimal,
    Maquinaria
)


# 1. Definimos primero los serializadores de las tablas hijas
class ProductorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Productor
        fields = '__all__'

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
    productor = ProductorSerializer()
    infraestructura = InfraestructuraSerializer()
    produccion = ProduccionSerializer()
    rubros_vegetales = RubroVegetalSerializer(many=True)
    existencia_animal = ExistenciaAnimalSerializer()
    maquinaria = MaquinariaSerializer()
    # Cambiamos a required=False para que no dé error si no los mandas en el PATCH
    servicios = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)


    class Meta:
        model = Predio
        fields = '__all__'

    def create(self, validated_data):
        # ... (Tu código de create se mantiene igual) ...
        rubros_data = validated_data.pop(
        'rubros_vegetales',
        []
        )
        existencia_data = validated_data.pop(
        'existencia_animal',
        {}
        )
        maquinaria_data = validated_data.pop(
        'maquinaria',
        {}
        )
        productor_data = validated_data.pop('productor')
        infra_data = validated_data.pop('infraestructura')
        prod_data = validated_data.pop('produccion')
        servicios_nombres = validated_data.pop('servicios', [])

        productor, _ = Productor.objects.update_or_create(
            cedula_rif=productor_data.get('cedula_rif'),
            defaults=productor_data
        )

        predio = Predio.objects.create(productor=productor, **validated_data)

        for nombre in servicios_nombres:
            servicio_obj, _ = Servicio.objects.get_or_create(nombre_servicio=nombre)
            PredioServicio.objects.create(predio=predio, servicio=servicio_obj)
            
        for rubro in rubros_data:
         RubroVegetal.objects.create(
         predio=predio,
         **rubro
         )    
         
        if existencia_data:

             ExistenciaAnimal.objects.create(
             predio=predio,
             **existencia_data
             )
         
        if maquinaria_data:

             Maquinaria.objects.create(
             predio=predio,
             **maquinaria_data
              )

        Infraestructura.objects.create(predio=predio, **infra_data)
        Produccion.objects.create(predio=predio, **prod_data)
        return predio

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
                
                
                instance.caracterizacion_completada = True

                instance.save()

        return instance