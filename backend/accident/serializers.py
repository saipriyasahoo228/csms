import base64

from rest_framework import serializers
from django.utils import timezone
from .models import (
    AccidentReporting, AccidentReportedBy, AccidentWorkman, AccidentSupervisor,
    AccidentType, PermitStatus, Severity, PpeStatus, Training
)
from employee.models import Employee
from trainings.models import Training
from .models import AccidentReport


class AccidentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccidentType
        fields = ['accident_type_id', 'accident_type']


class PermitStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermitStatus
        fields = ['status_id', 'status_type']


class SeveritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Severity
        fields = ['severity_id', 'severity_type']


class PpeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = PpeStatus
        fields = ['ppe_status_id', 'ppe_type']


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_id', 'employee_name']


class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = ['training_id', 'training_name', 'training_date', 'training_type', 'whitelevel_id']


class AccidentReportedBySerializer(serializers.ModelSerializer):
    employee_id= serializers.SerializerMethodField()
    employee = serializers.SlugRelatedField(slug_field='id',
                                            queryset=Employee.objects.all(),
                                            allow_null=True,
                                            required=False)

    class Meta:
        model = AccidentReportedBy
        fields = ['id', 'employee','employee_id', 'employee_name']

    def get_employee_id(self, obj):
        # Safely return the employee_id if available
        return obj.employee.employee_id if obj.employee_id else None


class AccidentWorkmanSerializer(serializers.ModelSerializer):
    employee_id= serializers.SerializerMethodField()
    employee = serializers.SlugRelatedField(slug_field='id',
                                            queryset=Employee.objects.all(),
                                            allow_null=True,
                                            required=False)

    class Meta:
        model = AccidentWorkman
        fields = ['id', 'employee','employee_id', 'employee_name']

    def get_employee_id(self, obj):
        # Safely return the employee_id if available
        return obj.employee.employee_id if obj.employee_id else None


class AccidentSupervisorSerializer(serializers.ModelSerializer):
    employee_id= serializers.SerializerMethodField()
    employee = serializers.SlugRelatedField(slug_field='id',
                                            queryset=Employee.objects.all(),
                                            allow_null=True,
                                            required=False)

    class Meta:
        model = AccidentSupervisor
        fields = ['id', 'employee', 'employee_id','employee_name']

    def get_employee_id(self, obj):
        # Safely return the employee_id if available
        return obj.employee.employee_id if obj.employee_id else None

class AccidentReportingSerializer(serializers.ModelSerializer):
    accident_type = serializers.PrimaryKeyRelatedField(queryset=AccidentType.objects.all())
    severity = serializers.PrimaryKeyRelatedField(queryset=Severity.objects.all(), required=False, allow_null=True)
    permit_status = serializers.PrimaryKeyRelatedField(queryset=PermitStatus.objects.all(), required=False,
                                                       allow_null=True)
    ppe_status = serializers.PrimaryKeyRelatedField(queryset=PpeStatus.objects.all(), required=False, allow_null=True)
    toolbox_reference_number = serializers.SlugRelatedField(slug_field='training_id', queryset=Training.objects.all(),
                                                            required=False, allow_null=True)
    reported_by = AccidentReportedBySerializer(many=True, required=False)
    workmen = AccidentWorkmanSerializer(many=True, required=False)
    supervisors = AccidentSupervisorSerializer(many=True, required=False)
    toolbox_train = serializers.BooleanField(default=False)  # Add toolbox_train field

    class Meta:
        model = AccidentReporting
        fields = [
            'id', 'accident_reporting_date', 'accident_id', 'accident_type', 'severity',
            'permit_status', 'ppe_status', 'toolbox_train', 'toolbox_reference_number',
           'accident_image',
            'about_the_accident', 'whitelevel', 'reported_by', 'workmen', 'supervisors'
        ]

    def validate_accident_id(self, value):
        if not value.startswith('Acc'):
            raise serializers.ValidationError("Accident ID must start with 'Acc'")
        return value

    def validate_accident_reporting_date(self, value):
        if value > timezone.now().date():
            raise serializers.ValidationError("Accident reporting date cannot be in the future")
        return value

    def create(self, validated_data):
        reported_by_data = validated_data.pop('reported_by', [])
        workmen_data = validated_data.pop('workmen', [])
        supervisors_data = validated_data.pop('supervisors', [])

        accident_reporting = AccidentReporting.objects.create(**validated_data)

        for reported_by in reported_by_data:
            AccidentReportedBy.objects.create(accident=accident_reporting, **reported_by)

        for workman in workmen_data:
            AccidentWorkman.objects.create(accident=accident_reporting, **workman)

        for supervisor in supervisors_data:
            AccidentSupervisor.objects.create(accident=accident_reporting, **supervisor)

        return accident_reporting

    def update(self, instance, validated_data):
        reported_by_data = validated_data.pop('reported_by', [])
        workmen_data = validated_data.pop('workmen', [])
        supervisors_data = validated_data.pop('supervisors', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        self._update_related_models(instance, reported_by_data, AccidentReportedBy)
        self._update_related_models(instance, workmen_data, AccidentWorkman)
        self._update_related_models(instance, supervisors_data, AccidentSupervisor)

        return instance

    def _update_related_models(self, instance, data_list, model):
        model.objects.filter(accident=instance).delete()
        for data in data_list:
            model.objects.create(accident=instance, **data)


class AccidentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccidentReport
        fields = '__all__'
