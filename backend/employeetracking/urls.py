from django.urls import path
from .views import CombinedReportsView

urlpatterns = [
    path('jd/<str:whitelevel_id>/<str:employee_id>/', CombinedReportsView.as_view(), name='combined-reports'),
]
