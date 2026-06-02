import random
import requests
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Predio, LicenciaHierro
from .serializers import PredioSerializer, LicenciaHierroSerializer



class PredioViewSet(viewsets.ModelViewSet):

    queryset = Predio.objects.all()

    serializer_class = PredioSerializer

class LicenciaHierroViewSet(viewsets.ModelViewSet):

    queryset = LicenciaHierro.objects.all()
    serializer_class = LicenciaHierroSerializer


@api_view(['POST'])
def enviar_codigo_whatsapp(request):

    telefono = request.data.get("telefono")

    codigo = str(random.randint(100000, 999999))

    mensaje = f"""

Código de validación MPPAT

Su código de confirmación es:

{codigo}

No comparta este código.
"""

    url = "https://api.ultramsg.com/instance178120/messages/chat"

    payload = {

        "token": "wukizlc37nijuqyj",

        "to": telefono,

        "body": mensaje
    }

    response = requests.post(url, data=payload)

    return Response({

        "success": True,

        "codigo": codigo,

        "respuesta_whatsapp": response.json()
    })
    

