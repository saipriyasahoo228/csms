from django.db import models
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from trainings.models import Training
from accident.models import AccidentReporting
from ITEM.models import NewIssuance, IssuedThings, IssuedToEmployee
from trainings.serializers import TrainingSerializer
from accident.serializers import AccidentReportingSerializer
from ITEM.serializers import NewIssuanceSerializer, IssuedThingsSerializer, IssuedToEmployeeSerializer

class CombinedReportsView(generics.GenericAPIView):
    def get(self, request, whitelevel_id, employee_id):
        # Retrieve training information
        training_queryset = Training.objects.filter(
            models.Q(whitelevel_id__pk=whitelevel_id) &
            (models.Q(trainers__trainer_id__pk=employee_id) | models.Q(trainees__trainee_id__pk=employee_id))
        ).distinct()
        
        # Retrieve accident reporting information
        accident_reporting_queryset = AccidentReporting.objects.filter(
            models.Q(whitelevel__pk=whitelevel_id) &
            (models.Q(reported_by__employee__pk=employee_id) | models.Q(workmen__employee__pk=employee_id) | models.Q(supervisors__employee__pk=employee_id))
        ).distinct()

        # Retrieve item issuance information
        new_issuance_queryset = NewIssuance.objects.filter(white_level_id__pk=whitelevel_id)
        issued_things_queryset = IssuedThings.objects.filter(issue_id__in=new_issuance_queryset)
        issued_to_employee_queryset = IssuedToEmployee.objects.filter(
            models.Q(issue_id__in=new_issuance_queryset) & models.Q(employee_id__pk=employee_id)
        )

        # Serialize the data
        training_serializer = TrainingSerializer(training_queryset, many=True)
        accident_reporting_serializer = AccidentReportingSerializer(accident_reporting_queryset, many=True)
        new_issuance_serializer = NewIssuanceSerializer(new_issuance_queryset, many=True)
        issued_things_serializer = IssuedThingsSerializer(issued_things_queryset, many=True)
        issued_to_employee_serializer = IssuedToEmployeeSerializer(issued_to_employee_queryset, many=True)

        # Combine the serialized data
        combined_data = {
            'trainings': training_serializer.data,
            'accidents': accident_reporting_serializer.data,
            'new_issuances': new_issuance_serializer.data,
            'issued_things': issued_things_serializer.data,
            'issued_to_employee': issued_to_employee_serializer.data,
        }

        return Response(combined_data, status=status.HTTP_200_OK)
