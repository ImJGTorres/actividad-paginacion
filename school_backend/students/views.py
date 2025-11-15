from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Student, StudentGroup
from .serializers import StudentSerializer, StudentGroupSerializer
from rest_framework.pagination import PageNumberPagination

# LOS COMENTARIOS SON PARA SABER QUE ES LO QUE ANDO HACIENDO, ES PARA NO PERDERME CUANDO LO VUELVA A LEER

# clase de paginacion personalizada para el ViewSet de estudiantes
class StudentPagination(PageNumberPagination):
    page_size = 10  # numero de estudiantes por pagina (por defecto)
    page_size_query_param = 'page_size'  # permite cambiar el tamaño via query param (?page_size=20)


class StudentGroupViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar StudentGroups.
    
    Permite realizar operaciones CRUD (Create, Read, Update, Delete)
    sobre los grupos de estudiantes.
    """
    queryset = StudentGroup.objects.all()
    serializer_class = StudentGroupSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['name', 'room_number']
    search_fields = ['name', 'room_number']
    ordering_fields = ['name', 'created_at', 'updated_at']
    ordering = ['-created_at']


class StudentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar Students.

    Permite realizar operaciones CRUD (Create, Read, Update, Delete)
    sobre los estudiantes.
    """
    # QuerySet optimizado con select_related para evitar N+1 queries en la relacion con 'group'
    queryset = Student.objects.select_related('group').all()
    serializer_class = StudentSerializer
    # configuracion de filtros, busqueda y ordenamiento
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['code', 'email', 'group']  # filtros exactos por campos
    search_fields = ['full_name', 'code', 'email']  # busqueda de texto en estos campos
    ordering_fields = ['full_name', 'code', 'email', 'group']  # campos por los que se puede ordenar
    ordering = ['code']  # ordenamiento por defecto
    # aplicar la clase de paginacion personalizada
    pagination_class = StudentPagination

