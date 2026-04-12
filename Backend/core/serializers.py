from rest_framework import serializers
from .models import Predio

class PredioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Predio
        fields = '__all__' # Queremos que use todos los campos del formulario