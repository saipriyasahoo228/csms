import base64
from io import BytesIO
import os
import random
import string
from django.core.files.base import ContentFile
import base64
from django.db.models import Count, Q
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.files.images import get_image_dimensions
from EMS.views import get_authenticated_user_whitelevel_id
from employee.models import Employee
from rest_framework.exceptions import ValidationError
from .models import AccidentType, PermitStatus, Severity, PpeStatus, AccidentReporting, AccidentWorkman,AccidentReportedBy,AccidentSupervisor
from .serializers import AccidentReportingSerializer, AccidentTypeSerializer, PermitStatusSerializer, \
    SeveritySerializer, PpeStatusSerializer,AccidentReportedBySerializer,AccidentWorkmanSerializer,AccidentSupervisorSerializer

accident_filter_map = {
    "nearmiss": 1,
    "accident": 2,
    "violation": 3
}

def decode_base64_image(base64_string):
  
    if base64_string.startswith('data:accident_image'):
        header, encoded_image = base64_string.split(';base64,')
    else:
        encoded_image = base64_string

    decoded_image = base64.b64decode(encoded_image)
    return decoded_image

class GetAccidentTypes(APIView):
    def get(self, request):
        accident_types = AccidentType.objects.all()
        permit_statuses = PermitStatus.objects.all()
        severities = Severity.objects.all()
        ppe_statuses = PpeStatus.objects.all()

        accident_type_serializer = AccidentTypeSerializer(accident_types, many=True)
        response_data = {'accident_types': accident_type_serializer.data}
        for accident_type in accident_type_serializer.data:
            if accident_type['accident_type'] == "Accident":
                permit_status_serializer = PermitStatusSerializer(permit_statuses, many=True)
                severity_serializer = SeveritySerializer(severities, many=True)
                ppe_status_serializer = PpeStatusSerializer(ppe_statuses, many=True)

                accident_type.update({
                    'permit_statuses': permit_status_serializer.data,
                    'severities': severity_serializer.data,
                    'ppe_statuses': ppe_status_serializer.data,
                })
                break

        return Response(response_data)






class NewAccidentReportedView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            accident_image_data = request.data.get("accident_image", None)

            # Process the accident image only if it is provided
            if accident_image_data:
                try:
                    # Decode base64 image data
                    accident_image = decode_base64_image(accident_image_data)

                    # Create a ContentFile for the image
                    request.data["accident_image"] = ContentFile(accident_image, name='accident_image.jpg')
                except Exception:
                    return Response({"error": "Invalid base64 image data."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Remove the field if not provided
                request.data.pop("accident_image", None)

            # Get white level ID for the authenticated user
            white_level_id = get_authenticated_user_whitelevel_id(request)

            # Process reported_by, workmen, and supervisors to map employee IDs
            for i in range(len(request.data.get("reported_by", []))):
                employee_id = request.data["reported_by"][i].get("employee")
                e = Employee.objects.get(employee_id=employee_id, whitelevel_id=white_level_id)
                request.data["reported_by"][i]["employee"] = e.id

            for i in range(len(request.data.get("workmen", []))):
                employee_id = request.data["workmen"][i].get("employee")
                e = Employee.objects.get(employee_id=employee_id, whitelevel_id=white_level_id)
                request.data["workmen"][i]["employee"] = e.id

            for i in range(len(request.data.get("supervisors", []))):
                employee_id = request.data["supervisors"][i].get("employee")
                e = Employee.objects.get(employee_id=employee_id, whitelevel_id=white_level_id)
                request.data["supervisors"][i]["employee"] = e.id

            # Serialize the data
            serializer = AccidentReportingSerializer(data=request.data)

            # Validate and save the data
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Employee.DoesNotExist:
            return Response({"error": "Employee not found."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





#Accident Form Update
class AccidentDetailUpdateView(APIView):

    def post(self, request, *args, **kwargs):
        accident_id = request.data.get("accident_id")
        white_level_id = request.data.get("whitelevel_id")

        if not accident_id or not white_level_id:
            return Response(
                {"detail": "Accident ID and White Level ID are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Fetch the accident reporting instance
            accident_reporting = AccidentReporting.objects.get(
                accident_id=accident_id, whitelevel_id=white_level_id
            )
        except AccidentReporting.DoesNotExist:
            return Response(
                {"detail": "Accident with this ID does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Fetch related records
        reported_by_data = AccidentReportedBySerializer(
            accident_reporting.reported_by.all(), many=True
        ).data
        workmen_data = AccidentWorkmanSerializer(
            accident_reporting.workmen.all(), many=True
        ).data
        supervisors_data = AccidentSupervisorSerializer(
            accident_reporting.supervisors.all(), many=True
        ).data

        # Prepare the response with the image as Base64 without the prefix
        accident_data = AccidentReportingSerializer(accident_reporting).data
        if accident_reporting.accident_image:
            # Read the image file and return only the base64 string, without the prefix
            with open(accident_reporting.accident_image.path, "rb") as image_file:
                image_base64_string = base64.b64encode(image_file.read()).decode()
                accident_data["accident_image"] = image_base64_string

        response_data = {
            "accident_id": accident_data.get("accident_id"),
            "whitelevel_id": accident_data.get("whitelevel"),
            "date_of_accident": accident_data.get("accident_reporting_date"),
            "about":accident_data.get("about_the_accident"),
            "incident_type":accident_data.get("accident_type"),
            "permit_status":accident_data.get("permit_status"),
            "ppe_status":accident_data.get("ppe_status"),
            "severity":accident_data.get("severity"),
            "toolbox_train":accident_data.get("toolbox_tain"),
            "toolbox_refno":accident_data.get("toolbox_reference_number"),
            "accident_image": accident_data.get("accident_image"),
            "reported_by": reported_by_data,
            "workmen": workmen_data,
            "supervisors": supervisors_data,
        }

        return Response(response_data, status=status.HTTP_200_OK)
    

class AccidentDetailUpdatePutView(APIView):

    def decode_base64_image(self, base64_string):
        """
        Decodes the base64 image string to binary data.
        Assumes the string might start with 'data:image/jpeg;base64,'.
        """
        if base64_string.startswith('data:'):
            # Remove the prefix, as we are only interested in the base64 string
            header, encoded_image = base64_string.split(';base64,')
        else:
            encoded_image = base64_string

        decoded_image = base64.b64decode(encoded_image)
        return decoded_image

    def map_employee_ids(self, employees, white_level_id):
        """
        Maps employee_id to the corresponding Employee instance ID,
        handling the special case where employee_id = 0 should map to Employee ID 11.
        """
        for employee in employees:
            employee_id = employee.get("employee_id")
            if employee_id == 0:
                employee["employee"] = 11  # Special case: employee_id 0 maps to Employee ID 11
            else:
                try:
                    employee_instance = Employee.objects.get(employee_id=employee_id, whitelevel_id=white_level_id)
                    employee["employee"] = employee_instance.id
                except Employee.DoesNotExist:
                    employee["employee"] = None  # If employee not found, leave it as None
        return employees

    def put(self, request, *args, **kwargs):
        # Get required data from the request body
        accident_id = request.data.get("accident_id")
        white_level_id = request.data.get("whitelevel_id")

        if not accident_id or not white_level_id:
            return Response(
                {"detail": "Accident ID and White Level ID are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Fetch the accident reporting instance
            accident_reporting = AccidentReporting.objects.get(
                accident_id=accident_id, whitelevel_id=white_level_id
            )
        except AccidentReporting.DoesNotExist:
            return Response(
                {"detail": "Accident with this ID does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Handle the base64 image if it's provided
        accident_image_data = request.data.get("accident_image")
        if accident_image_data:
            try:
                # Decode the base64 image and prepare it for saving
                decoded_image = self.decode_base64_image(accident_image_data)
                # Save the image to the ImageField
                request.data["accident_image"] = ContentFile(decoded_image, name=f"accident_image_{accident_id}.jpg")
            except Exception as e:
                return Response(
                    {"error": f"Error decoding or saving base64 image: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Map employee IDs to corresponding Employee IDs in the related lists
        reported_by_data = self.map_employee_ids(request.data.get("reported_by", []), white_level_id)
        workmen_data = self.map_employee_ids(request.data.get("workmen", []), white_level_id)
        supervisors_data = self.map_employee_ids(request.data.get("supervisors", []), white_level_id)

        # Update the data with the mapped employee IDs
        request.data["reported_by"] = reported_by_data
        request.data["workmen"] = workmen_data
        request.data["supervisors"] = supervisors_data

        # Perform a partial update for other fields
        serializer = AccidentReportingSerializer(
            instance=accident_reporting, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Fetch related records after the update
        reported_by_data = AccidentReportedBySerializer(
            accident_reporting.reported_by.all(), many=True
        ).data
        workmen_data = AccidentWorkmanSerializer(
            accident_reporting.workmen.all(), many=True
        ).data
        supervisors_data = AccidentSupervisorSerializer(
            accident_reporting.supervisors.all(), many=True
        ).data

        # Prepare the response with updated data
        accident_data = serializer.data

        if accident_reporting.accident_image:
            # Read the updated image file and encode it to base64
            with open(accident_reporting.accident_image.path, "rb") as image_file:
                image_base64_string = base64.b64encode(image_file.read()).decode()
                accident_data["accident_image"] = image_base64_string

        response_data = {
            "accident_id": accident_data.get("accident_id"),
            "date_of_accident": accident_data.get("accident_reporting_date"),
            "about": accident_data.get("about_the_accident"),
            "incident_type": accident_data.get("accident_type"),
            "permit_status": accident_data.get("permit_status"),
            "ppe_status": accident_data.get("ppe_status"),
            "severity": accident_data.get("severity"),
            "toolbox_train": accident_data.get("toolbox_train"),
            "toolbox_refno": accident_data.get("toolbox_reference_number_id"),
            "accident_image": accident_data.get("accident_image"),
            "reported_by": reported_by_data,
            "workmen": workmen_data,
            "supervisors": supervisors_data,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class FetchOrganizationAccidentTypeWiseCountAPI(APIView):
    def get(self, request):
        # Fetch data with necessary prefetching
        white_level_id = get_authenticated_user_whitelevel_id(request)
        accident_type_counts = AccidentReporting.objects.filter(
                whitelevel__whitelevel_id=white_level_id,
            ).values('accident_type__accident_type') \
            .annotate(count=Count('id')) \
            .order_by('-accident_type__accident_type_id')

        response_data = {}
        for accident_type in accident_type_counts:
            response_data[accident_type['accident_type__accident_type']] = accident_type['count']

        return Response({'data': response_data}, status=status.HTTP_200_OK)


class EmployeeAccidentAPI(APIView):
    def get(self, request):
        # Fetch data with necessary prefetching
        white_level_id = get_authenticated_user_whitelevel_id(request)
        employee_id = request.GET.get("employeeId")

        filter_accident_type = request.GET.get("filter")
        if filter_accident_type:
            if filter_accident_type not in accident_filter_map.keys():
                return Response({"error": "Invalid filter parameter value."}, status=status.HTTP_400_BAD_REQUEST)
            filter_accident_type = accident_filter_map.get(filter_accident_type)

        if not employee_id:
            return Response({"error": "employeeId param is required."}, status=status.HTTP_400_BAD_REQUEST)

        employee = Employee.objects.filter(employee_id=employee_id, whitelevel_id=white_level_id)
        if employee.count() == 0:
            return Response({"error": "Employee with Id '" + employee_id + "' doesn't exist."},
                            status=status.HTTP_400_BAD_REQUEST)

        accident_workmen = AccidentWorkman.objects.filter(employee__employee_id=employee_id)
        accident_ids_list = list({workman.accident.id for workman in accident_workmen})


        query_filter = Q(
            whitelevel__whitelevel_id=white_level_id,
            id__in=accident_ids_list
        )

        if filter_accident_type:
            query_filter &= Q(accident_type__accident_type_id=filter_accident_type)

        accidents = AccidentReporting.objects.filter(query_filter).order_by('-accident_reporting_date')

        response_data = []
        for accident in accidents:

            accident_image_base64 = None  # Default value for image
            if accident.accident_image:  # Check if an image exists
                with accident.accident_image.open("rb") as image_file:
                    accident_image_base64 = base64.b64encode(image_file.read()).decode('utf-8')  # Encode to base64
            accident_info = {
                'reference_number': accident.accident_id,
                'date': accident.accident_reporting_date,
                'type': accident.accident_type.accident_type,
                'about': accident.about_the_accident,
                'accident_image': accident_image_base64,
                
            }
            if accident.accident_type.accident_type_id == 2:
                accident_info['severity_id'] = accident.severity.severity_id
                accident_info['severity'] = accident.severity.severity_type
                accident_info['ppe_status'] = accident.ppe_status.ppe_type
                accident_info['permit_status'] = accident.permit_status.status_type
                accident_info['toolbox_training'] = accident.toolbox_train
                accident_info['toolbox_training_reference_number'] = accident.toolbox_reference_number.training_id if accident.toolbox_reference_number else None
            response_data.append(accident_info)

        return Response({'data': response_data}, status=status.HTTP_200_OK)