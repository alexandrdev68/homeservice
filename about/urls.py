from django.conf.urls import url

from about.views import Index

urlpatterns = [
    url(r'^$', Index.as_view(), name='index'),
]