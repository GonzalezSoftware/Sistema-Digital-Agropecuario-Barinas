# core/admin.py
from django.contrib import admin
from .models import Predio # Importa tus modelos aquí

admin.site.register(Predio)
# Si tienes otros, regístralos igual: admin.site.register(Productor)