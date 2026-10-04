from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import (
    PredioViewSet, 
    LicenciaHierroViewSet, 
    BitacoraAuditoriaViewSet, 
    enviar_codigo_whatsapp, 
    buscar_productor, 
    dashboard_produccion_stats, 
    configurar_o_login_admin, 
    guardar_credencial_municipio,  
    obtener_credenciales_municipios, 
    login_admin_api, 
    gestionar_credenciales_noticias, 
    gestionar_noticias, 
    detalle_noticia,
    gestionar_noticias_pendientes,      # <--- 1. Importa esta vista pendiente
    resolver_noticia_pendiente,         # <--- 2. Importa esta vista para resolver la propuesta
    enviar_correo_ficha_predio
)

router = DefaultRouter()
router.register(r'predios', PredioViewSet)
router.register(r'licencias-hierro', LicenciaHierroViewSet)
router.register(r'bitacora', BitacoraAuditoriaViewSet)

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
    path('enviar-correo-ficha/', enviar_correo_ficha_predio, name='enviar_correo_ficha'),
    
    # ── Rutas para las noticias pendientes de aprobación ──
    path('noticias/pendientes/', gestionar_noticias_pendientes, name='gestionar_noticias_pendientes'),
    path('noticias/pendientes/<int:pk>/resolver/', resolver_noticia_pendiente, name='resolver_noticia_pendiente'),
]

# Servir archivos subidos por el usuario en desarrollo local
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)