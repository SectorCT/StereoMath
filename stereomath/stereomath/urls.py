from django.urls import path
from . import views

urlpatterns = [
    path('solution/', views.solution, name='solution')
]
