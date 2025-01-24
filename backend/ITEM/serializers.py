from rest_framework import serializers

from employee.models import Employee
from .models import ItemType, Item, ItemValidity, NewIssuance, IssuedThings, IssuedToEmployee, UpcomingIssue


class ItemWithValiditySerializer(serializers.ModelSerializer):
    validity_in_days = serializers.IntegerField(source='itemvalidity.validity_in_days', read_only=True)

    class Meta:
        model = Item
        fields = ['item_id', 'item_name', 'item_type', 'validity_in_days']
        depth = 1


class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemType
        fields = ['item_type_id', 'item_type_name']


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('item_id', 'item_name', 'item_type')


class ItemValiditySerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ItemValidity
        fields = ('item', 'validity_in_days')


# class NewIssuanceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = NewIssuance
#         fields = ('issuance_id', 'white_level_id', 'issuance_date', 'newIssuance_image')

class NewIssuanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewIssuance
        fields = '__all__'


class IssuedThingsSerializer(serializers.ModelSerializer):
    item_type_id=serializers.CharField(source="item.item.item_type.item_type_id",read_only=True)
    item_name = serializers.SerializerMethodField()
    # item_name=serializers.CharField(source="item.item.item_name",read_only=True),'item_name'
    class Meta:
        model = IssuedThings
        fields = ('issue_id', 'item','item_name','item_type_id', 'expiry_date')

    def get_item_name(self, obj):
        # Fetch item_name safely from the related models
        return obj.item.item.item_name if obj.item and obj.item.item else None


class IssuedToEmployeeSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(source="employee_id.employee_id", read_only=True)
    employee_name = serializers.SerializerMethodField()
    # employee_name = serializers.CharField(source="employee_id.employee_name", read_only=True)
    class Meta:
        model = IssuedToEmployee
        fields = ('issue_id', 'employee_id','employee','employee_name')

    def get_employee_name(self, obj):
        # Safely fetch employee_name from the related employee_id field
        return obj.employee_id.employee_name if obj.employee_id else None


class UpcomingIssueSerializer(serializers.ModelSerializer):
    issued_thing = IssuedThingsSerializer()

    class Meta:
        model = UpcomingIssue
        fields = ('issue_id', 'issued_thing', 'remaining_days')


