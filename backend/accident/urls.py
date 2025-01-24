
from django.urls import path
from .views import NewAccidentReportedView, GetAccidentTypes,AccidentDetailUpdateView,AccidentDetailUpdatePutView

urlpatterns = [
    path('getTypes/', GetAccidentTypes.as_view()),
    path('create/', NewAccidentReportedView.as_view()),
    path('accident-detail-get/',AccidentDetailUpdateView.as_view(),name='accident-details-get'),
    path('accident-details-update/',AccidentDetailUpdatePutView.as_view(),name='accident-form- update')
]