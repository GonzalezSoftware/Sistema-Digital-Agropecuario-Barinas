from rest_framework import viewsets
from .models import Predio
from .serializers import PredioSerializer


class PredioViewSet(viewsets.ModelViewSet):

    queryset = Predio.objects.all()

    serializer_class = PredioSerializer
