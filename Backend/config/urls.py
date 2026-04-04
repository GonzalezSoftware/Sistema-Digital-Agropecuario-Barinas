from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls), # <--- Así es lo correcto
    path('api/', include('core.urls')), # <--- Asegúrate de que esto exista
]