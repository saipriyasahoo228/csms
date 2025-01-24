from django.contrib import admin
from .models import ItemType, Item, ItemValidity, NewIssuance, IssuedThings, IssuedToEmployee, UpcomingIssue

# Register your models here.

@admin.register(ItemType)
class ItemTypeAdmin(admin.ModelAdmin):
    list_display = ('item_type_id', 'item_type_name')

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('item_id', 'item_name', 'item_type')

@admin.register(ItemValidity)
class ItemValidityAdmin(admin.ModelAdmin):
    list_display = ('item', 'validity_in_days')

@admin.register(NewIssuance)
class NewIssuanceAdmin(admin.ModelAdmin):
    list_display = ('issuance_id', 'white_level_id', 'issuance_date')

@admin.register(IssuedThings)
class IssuedThingsAdmin(admin.ModelAdmin):
    list_display = ('issue_id', 'item', 'expiry_date')

@admin.register(IssuedToEmployee)
class IssuedToEmployeeAdmin(admin.ModelAdmin):
    list_display = ('issue_id', 'employee_id')

@admin.register(UpcomingIssue)
class UpcomingIssueAdmin(admin.ModelAdmin):
    list_display = ('issue_id', 'issued_thing', 'remaining_days')