from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, BasePermission, BasePermissionMetaclass

class StandardPagnation(PageNumberPagination):
    page_size = 10
    max_page_size = 10
    page_query_param = 'page'


## TODO: ListAPIVIew 및 하위 구현 클래스에도 적용 가능한가?

class PreFlightSupportAPIViewMixin:

    """
    OPTIONS 요쳥이 들어왔을 경우, 모든 요청을 허용하고 기본 동작을 실행합니다.

    [확인사항] 제대로 동작하지 않을 경우, URL 이 정확한지 (끝부분의 '/' 문자 등) 확인해야 합니다.
    """


    permission_class = AllowAny

    def __init__(self):
        # BasePermission이 아닌 BasePermissionMetaclass입니다.
        # TODO: MetaClass, 타입 및 object type compare에 대해 알아보기.
        assert isinstance(self.permission_class, BasePermissionMetaclass)

    def get_permissions(self):
        # views.py -> get_permission() 참조
        # 클래스를 인스턴스화 하여 반환합니다.
        return (self.permission_class(), ) if self.request.method == 'OPTIONS' \
            else super().get_permissions()

    def options(self, request, *args, **kwargs):
        # 해당 메서드가 사용됨을 APIView를 상속한 클래스에서 정의해야만
        # get_permissions 함수가 실행됩니다.
        return super().options(request, *args, **kwargs)