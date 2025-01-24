from django.contrib import admin
from .models import Training, Trainer, Trainee, TrainingReport, TrainingType

@admin.register(TrainingType)
class TrainingTypeAdmin(admin.ModelAdmin):
    list_display = ['training_type']

@admin.register(Training)
class TrainingAdmin(admin.ModelAdmin):
    list_display = ['training_id', 'training_date', 'whitelevel_id', 'training_type', 'training_name']
    list_filter = ['training_date', 'whitelevel_id', 'training_type']
    search_fields = ['training_id', 'training_name']

@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ['trainer_name', 'training']
    list_filter = ['training']
    search_fields = ['trainer_name']

@admin.register(Trainee)
class TraineeAdmin(admin.ModelAdmin):
    list_display = ['trainee_name', 'training']
    list_filter = ['training']
    search_fields = ['trainee_name']

@admin.register(TrainingReport)
class TrainingReportAdmin(admin.ModelAdmin):
    list_display = ['training', 'whitelevel_id', 'training_type', 'training_date', 'trainer_id']
    list_filter = ['whitelevel_id', 'training_type', 'training_date']
    search_fields = ['training__training_id']

