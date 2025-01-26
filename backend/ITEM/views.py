import base64
from django.core.exceptions import ValidationError  # Add this import at the top of your file
from io import BytesIO
import random  # Import random module
import string  # Import string module
from django.utils.crypto import get_random_string
from django.core.files.base import ContentFile
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Prefetch, Count, Q
from datetime import date, timedelta
from EMS.views import get_authenticated_user_whitelevel_id
from employee.models import Employee
from .models import IssuedThings, IssuedToEmployee, Item, ItemValidity,NewIssuance
from .serializers import NewIssuanceSerializer, IssuedThingsSerializer, IssuedToEmployeeSerializer, \
    ItemWithValiditySerializer
from datetime import date
import os
import datetime
from django.core.files.storage import FileSystemStorage
from django.core.files.storage import default_storage
import logging
from django.shortcuts import get_object_or_404

class GetAllItemsDetailView(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemWithValiditySerializer


class GetItemDetailView(generics.RetrieveAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemWithValiditySerializer









class IssueItemsToEmployeesAPIView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        # Deserialize and validate NewIssuance data
        issuance_data = data.get('issuance', {})

        # Handle the image upload only if it's provided
        image_data = issuance_data.get('newIssuance_image')
        if image_data:
            try:
                # If the image data is base64-encoded without the prefix
                if image_data.startswith('data:image'):
                    image_data = image_data.split(';base64,')[1]

                # Convert the base64 string into image content
                extension = 'png'  # Assuming the image is PNG (you can adjust the logic to detect format if needed)
                image_data = ContentFile(base64.b64decode(image_data), name=f"image.{extension}")
                issuance_data["newIssuance_image"] = image_data
            except Exception as e:
                return Response({"error": "Failed to decode image", "details": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        # If no image is provided, simply skip the image handling

        # Serialize and save the NewIssuance instance
        new_issuance_serializer = NewIssuanceSerializer(data=issuance_data)
        if new_issuance_serializer.is_valid():
            new_issuance = new_issuance_serializer.save()
        else:
            return Response(new_issuance_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Deserialize and validate IssuedThings data
        issued_things_data = data.get('issued_things', [])
        for item_data in issued_things_data:
            item_data['issue_id'] = new_issuance.issuance_id
            today = date.today()
            item_validity = ItemValidity.objects.get(item=item_data.get("item")).validity_in_days
            item_data['expiry_date'] = today + datetime.timedelta(days=item_validity)
            issued_things_serializer = IssuedThingsSerializer(data=item_data)

            if issued_things_serializer.is_valid():
                issued_things_serializer.save()
            else:
                return Response(issued_things_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Deserialize and validate IssuedToEmployee data
        issued_to_employees_data = data.get('employees', [])
        for employee_data in issued_to_employees_data:
            employee_data['issue_id'] = new_issuance.issuance_id
            employee = Employee.objects.filter(employee_id=employee_data["employee_id"], whitelevel_id=employee_data["whitelevel_id"])
            if employee.count() == 1:
                employee_data['employee_id'] = employee[0].id
            issued_to_employee_serializer = IssuedToEmployeeSerializer(data=employee_data)

            if issued_to_employee_serializer.is_valid():
                issued_to_employee_serializer.save()
            else:
                print(issued_to_employee_serializer.errors)
                return Response(issued_to_employee_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Items issued successfully"}, status=status.HTTP_201_CREATED)

#By passing whitelevel_id and issue_id get all details
class IssueItemsDetailsAPIView(APIView):
    def post(self, request, *args, **kwargs):
        issue_id = request.data.get('issue_id')
        
        if not issue_id:
            return Response({"error": "issue_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the NewIssuance record
        try:
            new_issuance = NewIssuance.objects.get(issuance_id=issue_id)
        except NewIssuance.DoesNotExist:
            return Response({"error": "NewIssuance not found for the given issue_id"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch related records for IssuedThings and IssuedToEmployee
        issued_things = IssuedThings.objects.filter(issue_id=new_issuance)
        issued_things_data = IssuedThingsSerializer(issued_things, many=True).data

        issued_to_employees = IssuedToEmployee.objects.filter(issue_id=new_issuance)
        issued_to_employees_data = IssuedToEmployeeSerializer(issued_to_employees, many=True).data

        # Serialize the NewIssuance data
        new_issuance_data = NewIssuanceSerializer(new_issuance).data

        # Check if the NewIssuance has an associated image and return it as base64
        if new_issuance.newIssuance_image:  # Assuming your image field is called 'image' in NewIssuance model
            with open(new_issuance.newIssuance_image.path, "rb") as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                # Prepare the image without the prefix (just the base64 string)
                new_issuance_data["newIssuance_image"] = encoded_image  # This will hold the base64 string

        # Prepare the response data
        response_data = {
            "new_issuance": new_issuance_data,
            "issued_things": issued_things_data,
            "issued_to_employees": issued_to_employees_data,
        }

        # Return the response
        return Response(response_data, status=status.HTTP_200_OK)





# Set up the logger
logger = logging.getLogger(__name__)


#RETRIVE ALL ITEM DETAILS BY PASSING WHITELEVEL_ID
class ItemsByWhiteLevelAPIView(APIView):
    """
    POST API to retrieve all item records for a given whitelevel_id.
    Includes Base64 encoded image and corresponding employee details.
    """

    def post(self, request, *args, **kwargs):
        whitelevel_id = request.data.get('whitelevel_id')

        if not whitelevel_id:
            return Response({"error": "whitelevel_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch all NewIssuance records for the given whitelevel_id
            new_issuances = NewIssuance.objects.filter(white_level_id=whitelevel_id)

            # Prepare data for response
            response_data = []

            for issuance in new_issuances:
                # Serialize issuance details
                issuance_data = NewIssuanceSerializer(issuance).data

                # Convert the image to Base64 if it exists
                if issuance.newIssuance_image:
                    with open(issuance.newIssuance_image.path, "rb") as image_file:
                        encoded_image = base64.b64encode(image_file.read()).decode("utf-8")
                        issuance_data["newIssuance_image"] = encoded_image

                # Fetch and serialize IssuedThings related to the issuance
                issued_things = IssuedThings.objects.filter(issue_id=issuance.issuance_id)
                issued_things_data = IssuedThingsSerializer(issued_things, many=True).data

                # Fetch and serialize IssuedToEmployee related to the issuance
                issued_to_employees = IssuedToEmployee.objects.filter(issue_id=issuance.issuance_id)
                issued_to_employees_data = IssuedToEmployeeSerializer(issued_to_employees, many=True).data

                # Add all data to the response
                response_data.append({
                    "issuance": issuance_data,
                    "issued_things": issued_things_data,
                    "issued_to_employees": issued_to_employees_data,
                })

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": "An error occurred", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NewIssuanceUpdateView(APIView):
    def put(self, request, *args, **kwargs):
        issuance_id = request.data.get('issuance_id')
        whitelevel_id = request.data.get('whitelevel_id')

        # Validate input parameters
        if not issuance_id or not whitelevel_id:
            return Response(
                {"error": "Both issuance_id and whitelevel_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Retrieve the new issuance instance
            new_issuance_instance = get_object_or_404(
                NewIssuance, issuance_id=issuance_id, white_level_id=whitelevel_id
            )

            # Update NewIssuance fields from request data
            new_issuance_instance.issuance_date = request.data.get(
                'issuance_date', new_issuance_instance.issuance_date
            )
            new_issuance_instance.about_the_newissuance = request.data.get(
                'about_the_newissuance', new_issuance_instance.about_the_newissuance
            )

            # Handle image upload and save
            newIssuance_image_data = request.data.get('newIssuance_image')
            if newIssuance_image_data:
                # Decode the base64 image data
                try:
                    # Remove the 'data:image/png;base64,' part of the string
                    if newIssuance_image_data.startswith('data:image'):
                        image_data = newIssuance_image_data.split(';base64,')[1]
                    else:
                        image_data = newIssuance_image_data
                    
                    # Generate a unique filename
                    image_filename = f"newIssuance_images/image_{get_random_string(8)}.png"
                    image_content = ContentFile(base64.b64decode(image_data))
                    
                    # Save the image to the model
                    new_issuance_instance.newIssuance_image.save(image_filename, image_content)
                except Exception as e:
                    return Response(
                        {"error": f"Invalid image format or decoding error: {str(e)}"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # Save the updated NewIssuance instance
            new_issuance_instance.save()

            # Handling IssuedThings updates (if present in the request)
            issued_things_data = request.data.get('issued_things', [])
            if issued_things_data:
                # Delete existing issued things related to this issuance_id
                IssuedThings.objects.filter(issue_id=new_issuance_instance).delete()
                
                # Create new issued things entries
                for issued_thing in issued_things_data:
                    item_id = issued_thing.get('item')
                    expiry_date = issued_thing.get('expiry_date')

                    # Get the corresponding ItemValidity instance
                    item_validity_instance = get_object_or_404(ItemValidity, item_id=item_id)
                    IssuedThings.objects.create(
                        issue_id=new_issuance_instance,
                        item=item_validity_instance,
                        expiry_date=expiry_date,
                    )

            # Handling IssuedToEmployee updates (if present in the request)
            issued_to_employees_data = request.data.get('issued_to_employees', [])
            if issued_to_employees_data:
                # Delete existing issued to employees related to this issuance_id
                IssuedToEmployee.objects.filter(issue_id=new_issuance_instance).delete()

                # Create new IssuedToEmployee entries
                for issued_to_employee in issued_to_employees_data:
                    employee_input_id = issued_to_employee.get('employee')

                    # Fetch the actual employee ID using the employee's input ID
                    employee_instance = get_object_or_404(Employee, employee_id=employee_input_id)

                    IssuedToEmployee.objects.create(
                        issue_id=new_issuance_instance,
                        employee_id=employee_instance
                    )

            # Serialize the updated NewIssuance
            new_issuance_serializer = NewIssuanceSerializer(new_issuance_instance)
            issued_things = IssuedThings.objects.filter(issue_id=new_issuance_instance)
            issued_to_employees = IssuedToEmployee.objects.filter(issue_id=new_issuance_instance)

            # Serialize related models
            issued_things_serializer = IssuedThingsSerializer(issued_things, many=True)
            issued_to_employees_serializer = IssuedToEmployeeSerializer(issued_to_employees, many=True)

            # Prepare full response data
            response_data = new_issuance_serializer.data
            response_data['issued_things'] = issued_things_serializer.data
            response_data['issued_to_employees'] = issued_to_employees_serializer.data

            return Response(response_data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response(
                {"error": f"Validation error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class FetchIssuedItemsAPI(APIView):
    def get(self, request, expire_in_days=None):
        # Fetch data with necessary prefetching
        white_level_id = get_authenticated_user_whitelevel_id(request)
        employee_id = request.GET.get('employeeId')

        query_filter = Q(employee_id__whitelevel_id_id=white_level_id)
        if employee_id:
            query_filter &= Q(employee_id__employee_id=employee_id)
        issued_to_employees = (
            IssuedToEmployee.objects
            .filter(query_filter)
            .select_related('employee_id', 'issue_id')
            .prefetch_related(
                Prefetch(
                    'issue_id__issuedthings_set',
                    queryset=IssuedThings.objects
                    .filter(expiry_date__gt=datetime.date.today())
                    .prefetch_related('item')
                )
            )
        )

        filter_item_type = None
        if request.GET.get("filter"):
            filter_item_type = request.GET.get("filter")
            # issued_to_employees = issued_to_employees.filter(issue_id__issuedthings__item__item__item_type__item_type_name='Tool')

        merged_data = {}
        total_issues = 0
        for issued_to_employee in issued_to_employees:
            employee = issued_to_employee.employee_id
            issue = issued_to_employee.issue_id

            if employee.employee_id not in merged_data:
                merged_data[employee.employee_id] = {
                    "employee_id": employee.employee_id,
                    "employee_name": employee.employee_name,
                    "items": []
                }

            for issued_thing in issue.issuedthings_set.all():
                if filter_item_type and filter_item_type != issued_thing.item.item.item_type.item_type_name:
                    continue
                if expire_in_days and issued_thing.expiry_date - datetime.date.today() > datetime.timedelta(days=expire_in_days):
                    continue
                about_the_newissuance=issued_to_employee.issue_id.about_the_newissuance
                # Handle newIssuance_image without the prefix
                newIssuance_image = issued_to_employee.issue_id.newIssuance_image
                if newIssuance_image and newIssuance_image.name:
                    with open(newIssuance_image.path, "rb") as image_file:
                        image_data = image_file.read()
                        try:
                            new_issuance_image_base64 = base64.b64encode(image_data).decode('utf-8')
                        except UnicodeDecodeError:
                            new_issuance_image_base64 = None
                else:
                    new_issuance_image_base64 = None

                merged_data[employee.employee_id]["items"].append({
                    "issuance_id": issue.issuance_id,
                    "item_name": issued_thing.item.item.item_name,
                    "item_type": issued_thing.item.item.item_type.item_type_name,
                    "issue_date": issue.issuance_date,
                    "expiry_date": issued_thing.expiry_date,
                    "newIssuance_image": new_issuance_image_base64,
                    "about_the_newissuance": about_the_newissuance
                    
                    
                })
                total_issues += 1

        response_data = {
            "total_issues": total_issues,
            "data": list(merged_data.values()),
        }

        return Response(response_data, status=status.HTTP_200_OK)


class FetchItemWiseIssuedItemsAPI(APIView):
    def get(self, request, expire_in_days=None):
        # Fetch data with necessary prefetching
        white_level_id = get_authenticated_user_whitelevel_id(request)
        issued_to_employees = (
            IssuedToEmployee.objects
            .filter(employee_id__whitelevel_id_id=white_level_id)
            .select_related('employee_id', 'issue_id')
            .prefetch_related(
                Prefetch(
                    'issue_id__issuedthings_set',
                    queryset=IssuedThings.objects
                    .filter(expiry_date__gt=datetime.date.today())
                    .prefetch_related('item')
                )
            )
        )

        filter_item_type = None
        if request.GET.get("filter"):
            filter_item_type = request.GET.get("filter")
            # issued_to_employees = issued_to_employees.filter(issue_id__issuedthings__item__item__item_type__item_type_name='Tool')

        merged_data = {}
        total_issues = 0
        for issued_to_employee in issued_to_employees:

            employee = issued_to_employee.employee_id
            issue = issued_to_employee.issue_id

            for issued_thing in issue.issuedthings_set.all():
                item_type_name = issued_thing.item.item.item_type.item_type_name
                item_name = issued_thing.item.item.item_name
                if filter_item_type and filter_item_type != item_type_name:
                    continue
                if expire_in_days and issued_thing.expiry_date - datetime.date.today() > datetime.timedelta(days=expire_in_days):
                    continue

                if item_type_name not in merged_data:
                    merged_data[item_type_name] = {}
                if item_name not in merged_data[item_type_name]:
                    merged_data[item_type_name][item_name] = {
                        "count": 0,
                        "issued_to": []
                    }

               

                merged_data[item_type_name][item_name]["issued_to"].append({
                    
                    "employee_id": employee.employee_id,
                    "employee_name": employee.employee_name,
                    "issue_date": issue.issuance_date,
                    "expiry_date": issued_thing.expiry_date,
                    
                })
                merged_data[item_type_name][item_name]["count"] = merged_data[item_type_name][item_name]["count"] + 1
                total_issues += 1

        response_data = {
            "total_issues": total_issues,
            "data": merged_data
        }
        return Response(response_data, status=status.HTTP_200_OK)


class FetchOrganizationItemWiseCountAPI(APIView):
    def get(self, request):
        # Fetch data with necessary prefetching
        white_level_id = get_authenticated_user_whitelevel_id(request)
        filter_item_type = request.GET.get("filter")
        if filter_item_type and filter_item_type in ["Tool", "PPE", "Dress"]:
            issued_item_counts = IssuedThings.objects.filter(
                    issue_id__white_level_id=white_level_id,
                    expiry_date__gt=datetime.date.today(),
                    item__item__item_type__item_type_name=filter_item_type
                ) \
                .values('item__item__item_id', 'item__item__item_name') \
                .annotate(count=Count('id'))

            response_data = {}
            for item_count in issued_item_counts:
                response_data[item_count['item__item__item_name']] = item_count['count']

            return Response({'data': response_data}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid Filter'}, status=status.HTTP_400_BAD_REQUEST)


class FetchOrganizationItemTypeWiseCountAPI(APIView):
    def get(self, request):
        # Fetch data with necessary prefetching
        white_level_id = get_authenticated_user_whitelevel_id(request)
        filter_item_type = request.GET.get("filter")
        if filter_item_type and filter_item_type in ["Tool", "PPE", "Dress"]:
            issued_item_counts = IssuedThings.objects.filter(
                    issue_id__white_level_id=white_level_id,
                    expiry_date__gt=datetime.date.today(),
                    item__item__item_type__item_type_name=filter_item_type
                ) \
                .values('item__item__item_type__item_type_name') \
                .annotate(count=Count('item'))

            response_data = {}
            for item_count in issued_item_counts:
                response_data[item_count['item__item__item_type__item_type_name']] = item_count['count']

            return Response({'data': response_data}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid Filter'}, status=status.HTTP_400_BAD_REQUEST)
