from rest_framework import serializers
from .models import Predio, Infraestructura, Produccion, Productor, Servicio, PredioServicio

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

# 2. Definimos al final el serializador principal que usa a los anteriores
class PredioSerializer(serializers.ModelSerializer):
    productor = ProductorSerializer()
    infraestructura = InfraestructuraSerializer()
    produccion = ProduccionSerializer()
    # Cambiamos a required=False para que no dé error si no los mandas en el PATCH
    servicios = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = Predio
        fields = '__all__'

    def create(self, validated_data):
        # ... (Tu código de create se mantiene igual) ...
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

        Infraestructura.objects.create(predio=predio, **infra_data)
        Produccion.objects.create(predio=predio, **prod_data)
        return predio

    # ── AQUÍ ESTÁ LA SOLUCIÓN: MÉTODO UPDATE ──
    def update(self, instance, validated_data):
        # 1. Extraemos datos anidados si vienen en el JSON
        productor_data = validated_data.pop('productor', None)
        infra_data = validated_data.pop('infraestructura', None)
        prod_data = validated_data.pop('produccion', None)

        # 2. Actualizamos el Predio (campos básicos)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 3. Actualizamos al Productor (sin tocar la cédula para evitar el error de duplicado)
        if productor_data:
            productor = instance.productor
            for attr, value in productor_data.items():
                if attr != 'cedula_rif': # Bloqueamos la edición de cédula aquí por seguridad
                    setattr(productor, attr, value)
            productor.save()

        # 4. Actualizamos Infraestructura
        if infra_data:
            infra = instance.infraestructura # Relación OneToOne
            for attr, value in infra_data.items():
                setattr(infra, attr, value)
            infra.save()

        # 5. Actualizamos Producción
        if prod_data:
            produccion = instance.produccion
            for attr, value in prod_data.items():
                setattr(produccion, attr, value)
            produccion.save()

        return instance