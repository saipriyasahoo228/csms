from rest_framework import serializers
from ITEM.models import NewIssuance, IssuedThings, IssuedToEmployee
from onboarding.models import Company
from employee.models import Employee
from django.utils import timezone

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']  # Adjust fields as necessary

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_id', 'employee_name']  # Use the correct field names from the Employee model

class IssuedThingsSerializer(serializers.ModelSerializer):
    validity = serializers.SerializerMethodField()

    class Meta:
        model = IssuedThings
        fields = ['issue_id', 'item', 'expiry_date', 'validity']

    def get_validity(self, obj):
        if obj.expiry_date:
            remaining_days = (obj.expiry_date - timezone.now().date()).days
            return remaining_days
        return None

class IssuedToEmployeeSerializer(serializers.ModelSerializer):
    employee_id = EmployeeSerializer()
   
    class Meta:
        model = IssuedToEmployee
        fields = ['employee_id']

class NewIssuanceSerializer(serializers.ModelSerializer):
    issued_things = IssuedThingsSerializer(source='issuedthings_set', many=True)
    issued_to_employees = IssuedToEmployeeSerializer(source='issuedtoemployee_set', many=True)

    class Meta:
        model = NewIssuance
        fields = ['issuance_date', 'issued_things', 'issued_to_employees']
