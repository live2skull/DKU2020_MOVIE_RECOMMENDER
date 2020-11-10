# 'corsheaders.middleware.CorsMiddleware'
# 해당 모듈을 올바르게 적용하여 사용였음에도 불구하고 제대로 동작하지 않아
# 임의로 "Access-Control-Allow-Origin 을 적용하는 middleware를 적용하였음.

# https://stackoverflow.com/questions/35760943/how-can-i-enable-cors-on-django-rest-framework

class corsMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response["Access-Control-Allow-Origin"] = "*"

        return response