from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
# Asegúrate de incluir 'BitacoraAuditoriaViewSet' en esta importación:
from .views import (
    PredioViewSet, 
    LicenciaHierroViewSet, 
    BitacoraAuditoriaViewSet,  # <--- 1. Importa tu viewset de bitácora aquí
    enviar_codigo_whatsapp, 
    buscar_productor, 
    dashboard_produccion_stats, 
    configurar_o_login_admin, 
    guardar_credencial_municipio,  
    obtener_credenciales_municipios, 
    login_admin_api, 
    gestionar_credenciales_noticias, 
    gestionar_noticias, 
    detalle_noticia
)

router = DefaultRouter()
router.register(r'predios', PredioViewSet)
router.register(r'licencias-hierro', LicenciaHierroViewSet)
router.register(r'bitacora', BitacoraAuditoriaViewSet) # <--- 2. Registra la ruta de la bitácora aquí

urlpatterns = [
    path('', include(router.urls)),
    path('enviar-codigo/', enviar_codigo_whatsapp),
    path('productores/buscar/<str:cedula>/', buscar_productor),
    path('dashboard-produccion/', dashboard_produccion_stats, name='dashboard_stats'),
    path('admin-config/', configurar_o_login_admin, name='admin_config'),
    path('guardar-credencial/', guardar_credencial_municipio, name='guardar_credencial_municipio'),
    path('credenciales-municipios/', obtener_credenciales_municipios, name='credenciales_municipios'),
    path('login-admin/', login_admin_api, name='login_admin_api'),
    path('credenciales-noticias/', gestionar_credenciales_noticias, name='gestionar_credenciales_noticias'),
    path('noticias/', gestionar_noticias, name='gestionar_noticias'),
    path('noticias/<int:pk>/', detalle_noticia, name='detalle_noticia'),
]

# Servir archivos subidos por el usuario en desarrollo local
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)