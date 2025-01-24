from django.contrib import admin
from .models import Employee

# Register your models here.
@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'employee_name', 'whitelevel_id', 'email', 'phonenumber', 'is_active')
    list_filter = ('is_active', 'whitelevel_id')
    search_fields = ('employee_id', 'employee_name', 'email', 'phonenumber')
    raw_id_fields = ('whitelevel_id',)  # Allows selecting Company by ID rather than a dropdown

    fieldsets = (
        (None, {
            'fields': ('employee_id', 'whitelevel_id', 'employee_name')
        }),
        ('Contact Information', {
            'fields': ('email', 'phonenumber', 'address')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )

    readonly_fields = ('employee_id',)  # Assuming employee_id should not be editable in admin

    def has_delete_permission(self, request, obj=None):
        return False  # Disables delete permission in admin

