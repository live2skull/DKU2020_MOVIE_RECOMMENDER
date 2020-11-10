from rest_framework.pagination import PageNumberPagination

class StandardPagnation(PageNumberPagination):
    page_size = 10
    max_page_size = 10
    page_query_param = 'page'

