from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import PredioViewSet, LicenciaHierroViewSet, enviar_codigo_whatsapp, buscar_productor


router = DefaultRouter()
router.register(r'predios', PredioViewSet)
router.register(r'licencias-hierro', LicenciaHierroViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('enviar-codigo/',enviar_codigo_whatsapp),
    path('productores/buscar/<str:cedula>/', buscar_productor),
]

# Servir archivos subidos por el usuario en desarrollo local
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

