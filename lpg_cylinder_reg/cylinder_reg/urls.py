from django.urls import path
from . import views

urlpatterns = [
    path('process_image/', views.process_image, name='process_image'),
    path('', views.index, name='index'),
    path('camera/', views.camera_view, name='camera_view')

]