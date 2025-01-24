# project/urls.py
from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import is_user_authenticated


urlpatterns = [
    path('admin/', admin.site.urls),
    path('employee/', include('employee.urls')),
    path('accident/', include('accident.urls')),
    path('item/', include('ITEM.urls')),
    path('training/', include('trainings.urls')),
    path('reports/', include('reports.urls')),
    path('reports/', include('itemtracking.urls')),
    path('reports/', include('employeetracking.urls')),
    path('owner/', include('onboarding.urls')),
    path('medical/', include('medical.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('authenticated/', is_user_authenticated, name='is_user_authenticated'),
]


# # Add this line to serve media files during development
# if settings.DEBUG:  # Only serve media files in development mode
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
