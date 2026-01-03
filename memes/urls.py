from django.urls import path
from .views import save_meme

urlpatterns = [
    path('save/', save_meme, name='save_meme'),
]
