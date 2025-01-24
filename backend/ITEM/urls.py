from django.urls import path
from .views import IssueItemsToEmployeesAPIView, GetAllItemsDetailView, GetItemDetailView, \
    FetchIssuedItemsAPI, FetchItemWiseIssuedItemsAPI,IssueItemsDetailsAPIView,NewIssuanceUpdateView


urlpatterns = [
    path('getAll/', GetAllItemsDetailView.as_view(), name='get-all-items-detail'),
    path('get/<int:pk>/', GetItemDetailView.as_view(), name='get-item-detail'),
    path('new/', IssueItemsToEmployeesAPIView.as_view(), name='issue-items'),
    path('get-details/',IssueItemsDetailsAPIView.as_view(),name='retrive details by issue_id'),
    path('newissuance-update/',NewIssuanceUpdateView.as_view(),name='update details by issue_id'),
    path('issued/', FetchIssuedItemsAPI.as_view(), name='get_employee_issued_items'),
    path('upcomingIssue/<int:expire_in_days>/', FetchItemWiseIssuedItemsAPI.as_view()),
]