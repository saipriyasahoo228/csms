
import re
from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_id', 'whitelevel_id', 'employee_name', 'email', 'phonenumber', 'address', 'is_active']

    def validate_employee_id(self, value):
        # Ensure employee_id matches a specific format using regex
        if not re.match(r'^[A-Za-z0-9_]+$', value):
            raise serializers.ValidationError("Employee ID must contain only alphanumeric characters and underscores")
        return value

    def validate_phonenumber(self, value):
        # Ensure phone number format is valid (only digits)
        if value and not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits")
        return value

    def validate_employee_name(self, value):
        # Ensure employee name does not contain digits
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("Employee name must not contain digits")
        return value

    def validate_address(self, value):
        # Validate address only if it is provided
        if value:
            # Ensure address only contains alphanumeric characters, spaces, and '-'
            if not re.match(r'^[A-Za-z0-9 -]+$', value):
                raise serializers.ValidationError("Address must contain only letters, numbers, spaces, and dashes")
            # Check that address is at least 10 characters long
            if len(value) < 10:
                raise serializers.ValidationError("Address must be at least 10 characters long")
        return value

    def validate(self, data):
        # Check if address exists before performing additional validation
        if 'address' in data and data['address']:
            address = data['address']
            if len(address) < 10:
                raise serializers.ValidationError({"address": "Address must be at least 10 characters long"})
        return data

    def create(self, validated_data):
        # Example data sanitization or modification before saving
        validated_data['employee_name'] = validated_data['employee_name'].capitalize()
        return super().create(validated_data)

class EmployeeNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_name']

class EmployeeDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_name','employee_id','email','phonenumber','address']
