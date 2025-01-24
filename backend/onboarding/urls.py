from django.urls import path
from .views import AdminOnlyView, RegularUserView, CompanyLoginAPIView, CompanyLogoutAPIView

urlpatterns = [
    path('admin/', AdminOnlyView.as_view(), name='admin-view'),
    path('user/', RegularUserView.as_view(), name='regular-user-view'),
    path('login/', CompanyLoginAPIView.as_view(), name='company-login'),
    path('logout/', CompanyLogoutAPIView.as_view(), name='company-logout'),
    # other paths...
]
