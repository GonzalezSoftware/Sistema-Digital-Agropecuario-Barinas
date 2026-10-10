from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from django.contrib import admin
from .views import (
    PredioViewSet, 
    LicenciaHierroViewSet, 
    BitacoraAuditoriaViewSet, 
    buscar_productor, 
    dashboard_produccion_stats, 
    configurar_o_login_admin, 
    guardar_credencial_municipio,  
    obtener_credenciales_municipios, 
    login_admin_api, 
    gestionar_credenciales_noticias, 
    gestionar_noticias, 
    detalle_noticia,
    gestionar_noticias_pendientes,     
    resolver_noticia_pendiente,  
    enviar_codigo_correo, 
    enviar_correo_ficha_predio,
    cambiar_password_admin,
    gestionar_contacto

)

router = DefaultRouter()
router.register(r'predios', PredioViewSet)
router.register(r'licencias-hierro', LicenciaHierroViewSet)
router.register(r'bitacora', BitacoraAuditoriaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('productores/buscar/<str:cedula>/', buscar_productor),
    path('dashboard-produccion/', dashboard_produccion_stats, name='dashboard_stats'),
    path('admin-config/', configurar_o_login_admin, name='admin_config'),
    path('guardar-credencial/', guardar_credencial_municipio, name='guardar_credencial_municipio'),
    path('credenciales-municipios/', obtener_credenciales_municipios, name='credenciales_municipios'),
    path('login-admin/', login_admin_api, name='login_admin_api'),
    path('credenciales-noticias/', gestionar_credenciales_noticias, name='gestionar_credenciales_noticias'),
    path('noticias/', gestionar_noticias, name='gestionar_noticias'),
    path('noticias/<int:pk>/', detalle_noticia, name='detalle_noticia'),
    path('enviar-codigo-correo/', enviar_codigo_correo, name='enviar_codigo_correo'), # <--- Coincide con el frontend
    path('enviar-correo-ficha/', enviar_correo_ficha_predio, name='enviar_correo_ficha'),
    path('admin/cambiar-password/', cambiar_password_admin, name='cambiar_password_admin'),
    path('contacto-info/', gestionar_contacto, name='gestionar_contacto'),
    path('noticias/pendientes/', gestionar_noticias_pendientes, name='gestionar_noticias_pendientes'),
    path('noticias/pendientes/<int:pk>/resolver/', resolver_noticia_pendiente, name='resolver_noticia_pendiente'),
]

# Servir archivos subidos por el usuario en desarrollo local
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)