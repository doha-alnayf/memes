from django.urls import path
from . import views

urlpatterns = [
    path('', views.editor_home, name='editor_home'),
]
