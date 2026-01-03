from django.shortcuts import render

# Create your views here.

def editor_home(request):
    return render(request, 'editor/index.html')
