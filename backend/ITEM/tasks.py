# tasks.py
from celery import shared_task
from django.utils import timezone
from .models import UpcomingIssue

@shared_task
def update_remaining_days():
    today = timezone.now().date()
    upcoming_issues = UpcomingIssue.objects.all()
    for issue in upcoming_issues:
        issue.remaining_days = (issue.issued_thing.expiry_date - today).days
        issue.save()
