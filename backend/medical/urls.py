# project/urls.py

from django.urls import path, include

from . import views
from .views import UpcomingMedicalCheckUpAPIView,MedicalCheckUpRetrieveView,MedicalCheckUpBulkUpdateView

urlpatterns = [
    path('create/', views.create_new_medical_check_up, name='create_new_medical_check_up'),
    path('upcoming/<int:upcoming>/', UpcomingMedicalCheckUpAPIView.as_view()),
    path('medical-details/',MedicalCheckUpRetrieveView.as_view(),name='get medical employee details by date-range'),
    path('medical-update/',MedicalCheckUpBulkUpdateView.as_view(),name='medical-update'),

]
