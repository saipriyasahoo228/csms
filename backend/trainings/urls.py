# urls.py

from django.urls import path
from . import views
from .views import TrainingDetailsRetrieveView,TrainingDetailsUpdateView,TrainingListView
urlpatterns = [
    path('start/', views.start_training, name='start-training'),
    path('training-details/',TrainingDetailsRetrieveView.as_view(),name='get-training-details'),
    path('training-details-update/',TrainingDetailsUpdateView.as_view(),name='update-training-details'),
    path('alltrainings/', TrainingListView.as_view(), name='training-list'),
]