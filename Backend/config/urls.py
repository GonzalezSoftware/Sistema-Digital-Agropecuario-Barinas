# Ubicación: Backend/config/urls.py (o el urls.py principal que ves en tu imagen)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')), # Esto conecta con core/urls.py
]