from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from django.template import RequestContext, loader

# Create your views here.
'''def index(request):
    output = {'text' : "Hello, world. You're at the startpage."}
    template = loader.get_template('startpage/index.html')
    return HttpResponse(template.render(output))
'''
class Index(View):
    def get(self, request):
        output = {'text' : "Hello, world. You're at the startpage."}
        template = loader.get_template('startpage/index.html')
        return HttpResponse(template.render(output))