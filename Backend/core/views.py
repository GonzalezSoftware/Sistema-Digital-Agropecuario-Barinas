from rest_framework import viewsets  # <--- ESTA ES LA QUE FALTA
from .models import Predio
from .serializers import PredioSerializer

class PredioViewSet(viewsets.ModelViewSet):
    queryset = Predio.objects.all()
    serializer_class = PredioSerializer