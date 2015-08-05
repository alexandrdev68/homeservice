from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, loader

# Create your views here.
def index(request):
    output = "Hello, world. You're at the startpage."
    template = loader.get_template('startpage/index.html')
    return HttpResponse(template.render(output))