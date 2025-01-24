from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EMS.settings')

app = Celery('EMS')

# Using a string here means the worker will not have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

from ITEM.tasks import update_remaining_days

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls update_remaining_days() every day at midnight.
    sender.add_periodic_task(
        crontab(hour=0, minute=0),
        update_remaining_days.s(),
    )
