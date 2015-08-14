from django.conf.urls import url
from django.conf.urls.static import static


from startpage.views import Index

urlpatterns = [
    url(r'^$', Index.as_view(), name='index'),
]