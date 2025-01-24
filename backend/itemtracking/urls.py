from django.urls import path
from .views import IssuedItemsView

urlpatterns = [
    path('item/', IssuedItemsView.as_view(), name='issued-items'),
]
