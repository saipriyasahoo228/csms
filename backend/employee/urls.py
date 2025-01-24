# employee/urls.py

from django.urls import path
from .views import register_employee, get_employee_name, search_employee_name,get_all_employee,get_employee_details

urlpatterns = [
    path('register/', register_employee, name='employee_register'),
    path('name/', get_employee_name, name='employee_name'),
    path('search/', search_employee_name),
    path('employees_details/',get_all_employee, name='Get all employee details'),
    path('employee_details/',get_employee_details, name='Get single employee details')
]