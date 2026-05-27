from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import PredioViewSet

router = DefaultRouter()

router.register(r'predios', PredioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]