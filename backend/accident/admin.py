from django.contrib import admin
from .models import (
    AccidentType,
    PermitStatus,
    Severity,
    PpeStatus,
    AccidentReporting,
    AccidentReportedBy,
    AccidentWorkman,
    AccidentSupervisor,
    AccidentReport
)

@admin.register(AccidentType)
class AccidentTypeAdmin(admin.ModelAdmin):
    list_display = ('accident_type_id', 'accident_type')
    search_fields = ('accident_type',)

@admin.register(PermitStatus)
class PermitStatusAdmin(admin.ModelAdmin):
    list_display = ('status_id', 'status_type')
    search_fields = ('status_type',)

@admin.register(Severity)
class SeverityAdmin(admin.ModelAdmin):
    list_display = ('severity_id', 'severity_type')
    search_fields = ('severity_type',)

@admin.register(PpeStatus)
class PpeStatusAdmin(admin.ModelAdmin):
    list_display = ('ppe_status_id', 'ppe_type')
    search_fields = ('ppe_type',)

class AccidentReportedByInline(admin.TabularInline):
    model = AccidentReportedBy
    extra = 1

class AccidentWorkmanInline(admin.TabularInline):
    model = AccidentWorkman
    extra = 1

class AccidentSupervisorInline(admin.TabularInline):
    model = AccidentSupervisor
    extra = 1

@admin.register(AccidentReporting)
class AccidentReportingAdmin(admin.ModelAdmin):
    list_display = ('accident_id', 'accident_reporting_date', 'accident_type', 'severity', 'whitelevel')
    search_fields = ('accident_id', 'about_the_accident')
    list_filter = ('accident_reporting_date', 'accident_type', 'severity', 'permit_status', 'ppe_status', 'toolbox_train', 'whitelevel')
    inlines = [AccidentReportedByInline, AccidentWorkmanInline, AccidentSupervisorInline]

@admin.register(AccidentReport)
class AccidentReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'accident_report_date', 'accident_id', 'whitelevel_id', 'accident_type', 'severity')
    search_fields = ('accident_id__accident_id',)
    list_filter = ('accident_report_date', 'accident_type', 'severity', 'whitelevel_id')
    filter_horizontal = ('workmen_involved',)

# Register related models directly
@admin.register(AccidentReportedBy)
class AccidentReportedByAdmin(admin.ModelAdmin):
    list_display = ('accident', 'employee', 'employee_name')
    search_fields = ('accident__accident_id', 'employee__employee_name', 'employee_name')

@admin.register(AccidentWorkman)
class AccidentWorkmanAdmin(admin.ModelAdmin):
    list_display = ('accident', 'employee', 'employee_name')
    search_fields = ('accident__accident_id', 'employee__employee_name', 'employee_name')

@admin.register(AccidentSupervisor)
class AccidentSupervisorAdmin(admin.ModelAdmin):
    list_display = ('accident', 'employee', 'employee_name')
    search_fields = ('accident__accident_id', 'employee__employee_name', 'employee_name')
