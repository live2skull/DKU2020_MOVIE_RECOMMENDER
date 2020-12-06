## 서비스 API의 구현체의 집합입니다.
# @package myapp.views

from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, BasePermission, BasePermissionMetaclass

## 표준 Pagnation을 위한 클래스입니다.
# rest_framework.pagnation.PageNumberPagnation 을 상속해 사용합니다.
class StandardPagnation(PageNumberPagination):
    page_size = 10
    max_page_size = 10
    page_query_param = 'page'


## OPTIONS 요청에 대해 모든 요청을 허용하고, 기본 동작을 실행합니다.
# APIViewMixin 으로써 APIView에 믹스인하여 사용합니다.
class PreFlightSupportAPIViewMixin:

    ## OPTIONS 요청에 대해 체크할 권한입니다. 기본값은 AllowAny 입니다.
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