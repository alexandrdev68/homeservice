from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, loader

# Create your views here.
def index(request):
    output = {'text':"Hello, world. You're at the aboutpage."}
    template = loader.get_template('about/index.html')
    return HttpResponse(template.render(output))

