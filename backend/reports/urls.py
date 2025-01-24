# urls.py
from django.urls import path


from .views import AccidentReportListAPIView, DashboardAPIView
from trainings.views import TrainingReportListAPIView, FetchOrganizationTrainingTypeWiseCountAPI, EmployeeTrainingReportListAPIView
from ITEM.views import FetchOrganizationItemWiseCountAPI, FetchOrganizationItemTypeWiseCountAPI
from accident.views import FetchOrganizationAccidentTypeWiseCountAPI, EmployeeAccidentAPI
from medical.views import FetchOrganizationMedicalCheckUpCountAPI, FetchOrganizationMedicalCheckUpEmployeeInfoAPI, \
EmployeeMedicalCheckUpAPIView

urlpatterns = [
    path('accident/', AccidentReportListAPIView.as_view(), name='accident-report-list'),
    path('dashboard/', DashboardAPIView.as_view()),
    path('training/', TrainingReportListAPIView.as_view()),
    path('employee/training/', EmployeeTrainingReportListAPIView.as_view()),
    path('employee/accident/', EmployeeAccidentAPI.as_view()),
    path('employee/medicalcheckup/', EmployeeMedicalCheckUpAPIView.as_view()),
    path('organization/items/', FetchOrganizationItemWiseCountAPI.as_view()),
    path('organization/itemTypes/', FetchOrganizationItemTypeWiseCountAPI.as_view()),
    path('organization/trainings/', FetchOrganizationTrainingTypeWiseCountAPI.as_view()),
    path('organization/accidents/', FetchOrganizationAccidentTypeWiseCountAPI.as_view()),
    path('organization/medicalcheckup/', FetchOrganizationMedicalCheckUpCountAPI.as_view()),
    path('organization/medicalcheckup/employeeinfo/', FetchOrganizationMedicalCheckUpEmployeeInfoAPI.as_view()),
]
