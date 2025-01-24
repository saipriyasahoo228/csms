from django.contrib import admin
from .models import UserProfile, ROLES_CHOICES, Company


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['mobile_number', 'name', 'email', 'role_text', 'is_active']
    readonly_fields = ['registered_at']

    def role_text(self, obj):
        return dict(ROLES_CHOICES).get(obj.role, 'Unknown')

    role_text.short_description = 'Role'  # Display name for the custom field


admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Company)

