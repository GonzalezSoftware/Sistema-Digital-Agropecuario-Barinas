from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PredioViewSet

# 1. Definimos el router
router = DefaultRouter()
router.register(r'predios', PredioViewSet)

# 2. Definimos las rutas (OJO: el nombre debe ser minúsculas y sin guiones extra)
urlpatterns = [
    path('', include(router.urls)),
]