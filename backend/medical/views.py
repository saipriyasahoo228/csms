import json
import base64
import os
from io import BytesIO
from PIL import Image
from datetime import datetime

import uuid

from django.db.models import Q 
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from EMS.views import get_authenticated_user_whitelevel_id
from employee.models import Employee
from reports.views import get_current_fiscal_year_start
from .models import MedicalCheckUp


def decode_base64_image(base64_string):
    # Remove the image type header (if present)
    if base64_string.startswith('data:image'):
        header, encoded_image = base64_string.split(';base64,')
    else:
        encoded_image = base64_string

    # Decode the base64 string
    decoded_image = base64.b64decode(encoded_image)
    return decoded_image


def save_image(decoded_image, image_path):
    with open(image_path, 'wb') as f:
        f.write(decoded_image)


@api_view(['POST'])
def create_new_medical_check_up(request):
    data = json.loads(request.body)
    check_up_date = data.get('checkUpDate')
    next_check_up_date = data.get('nextCheckUpDate')
    employees_list = data.get('employees')
    image = data.get('image')
    decoded_image = decode_base64_image(image)

    import uuid
    filename = str(uuid.uuid4()) + '.jpg'
    image_path = os.path.join('media', 'medical_checkup_images', filename)
    save_image(decoded_image, image_path)

    response = {}

    for emp in employees_list:
        e = Employee.objects.filter(employee_id=emp.get("employee_id"), whitelevel_id=emp.get("whitelevel_id"))

        if e.count() > 0:
            empl = e[0]
            mc = MedicalCheckUp.objects.filter(employee=empl.id).order_by('-checkup_date')
            todays_date = datetime.now().date()
            if mc.count() > 0:
                last_checkup = (todays_date - mc[0].checkup_date).days
                if 0 <= last_checkup <= 365:
                    response[emp.get("employee_id")] = {
                        "result": "error",
                        "message": "Medical checkup for " + e[0].employee_name + " was already done on " + str(mc[0].checkup_date)
                    }
                    continue

            # Create MedicalCheckUp Instance
            medical_checkup = MedicalCheckUp(
                checkup_date=check_up_date,
                next_checkup_date=next_check_up_date,
                employee=empl,
                image=image_path
            )
            medical_checkup.save()
            response[emp.get("employee_id")] = {
                "result": "success",
                "message": "Medical checkup saved successfully for " + e[0].employee_name
            }
        else:
            response[emp.get("employee_id")] = {
                "result": "error",
                "message": "Employee doesn't exist."
            }

    return Response(response, status=status.HTTP_201_CREATED)

class MedicalCheckUpRetrieveView(APIView):
    def post(self, request):
        data = request.data
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        whitelevel_id = data.get('whitelevel_id')

        # Check if required data is present in the request
        if not (start_date and end_date and whitelevel_id):
            return Response(
                {"error": "start_date, end_date, and whitelevel_id are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Convert start_date and end_date to date objects
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch all medical checkups matching the criteria
        checkups = MedicalCheckUp.objects.filter(
            Q(checkup_date__range=(start_date, end_date)) &
            Q(employee__whitelevel_id=whitelevel_id)
        ).select_related('employee')

        if not checkups.exists():
            return Response(
                {"message": "No medical checkups found for the given criteria."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Prepare response data
        checkup_details = {
            "checkup_date": str(start_date),
            "next_checkup_date": str(end_date),
            "employees": []
        }

        for checkup in checkups:
            encoded_image = None
            if checkup.image:
                try:
                    # Open the image file and encode its content
                    with open(checkup.image.path, 'rb') as image_file:
                        encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                except Exception as e:
                    # Log the error (you can log it to a log file or Django's error log)
                    print(f"Error encoding image for checkup ID {checkup.id}: {e}")
                    encoded_image = None  # Handle any errors during file access

            checkup_details["employees"].append({
                "id": checkup.id,
                "employee_id": checkup.employee.employee_id,
                "employee_name": checkup.employee.employee_name,
                "image": encoded_image  # Encoded image in Base64
            })

        return Response(checkup_details, status=status.HTTP_200_OK)
#MedicalCheckup Update
class MedicalCheckUpBulkUpdateView(APIView):
    def put(self, request):
        data = request.data

        # Extract data from request
        checkup_date = data.get("checkup_date")
        next_checkup_date = data.get("next_checkup_date")
        whitelevel_id = data.get("whitelevel_id")
        employees = data.get("employees", [])
        image_base64 = data.get("image")

        # Validate required fields
        if not (checkup_date and next_checkup_date and whitelevel_id and employees and image_base64):
            return Response(
                {"error": "checkup_date, next_checkup_date, whitelevel_id, employees, and image are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Convert checkup_date and next_checkup_date to date objects
            checkup_date = datetime.strptime(checkup_date, '%Y-%m-%d').date()
            next_checkup_date = datetime.strptime(next_checkup_date, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Decode the image once and process
        try:
            image_data = base64.b64decode(image_base64)
            
            # Generate a UUID for the image filename
            image_filename = f"{uuid.uuid4()}.jpg"  # Generates a UUID with .jpg extension
            image_file_path = os.path.join("media", "medical_checkup_images", image_filename)

            # Save the decoded image to disk
            with open(image_file_path, "wb") as image_file:
                image_file.write(image_data)

            # Modify image_url to use backslashes in the file path
            image_url = os.path.join("media","medical_checkup_images", image_filename).replace("/", "\\")
        except Exception as e:
            return Response(
                {"error": f"Failed to process the image: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Process each employee's data
        response_employees = []
        for employee_data in employees:
            employee_id = employee_data.get("employee_id")
            employee_name = employee_data.get("employee_name")

            if not (employee_id and employee_name):
                return Response(
                    {"error": "Each employee must have employee_id and employee_name."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Fetch the employee by whitelevel_id and employee_id
            employee = Employee.objects.filter(employee_id=employee_id, whitelevel_id=whitelevel_id).first()
            if not employee:
                return Response(
                    {"error": f"Employee with ID {employee_id} and whitelevel_id {whitelevel_id} not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Fetch the MedicalCheckUp record; it must exist for PUT
            checkup = MedicalCheckUp.objects.filter(employee=employee).first()
            if not checkup:
                return Response(
                    {"error": f"No MedicalCheckUp record found for employee {employee_id}."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Update the checkup details and image for all employees
            checkup.checkup_date = checkup_date
            checkup.image = image_url  # Save the image URL
            checkup.save()

            # Append the employee data to the response
            response_employees.append({
                "employee_id": employee.employee_id,
                "employee_name": employee.employee_name,
                "checkup_date": str(checkup.checkup_date),
                #"image_url": checkup.image.replace("/", "\\") if checkup.image else None  # Ensure single backslash in the URL here too
            })

        # Final response with all details
        return Response(
            {
                "message": "Medical checkups updated successfully.",
                "checkup_date": str(checkup_date),
                "next_checkup_date": str(next_checkup_date),
                "whitelevel_id": whitelevel_id,
                "employees": response_employees
            },
            status=status.HTTP_200_OK
        )
class FetchOrganizationMedicalCheckUpCountAPI(APIView):
    def get(self, request):
        # Fetch data with necessary prefetching
        white_level_id = get_authenticated_user_whitelevel_id(request)
        fiscal_year_start_date = get_current_fiscal_year_start()
        medical_checkups = MedicalCheckUp.objects.filter(
            employee__whitelevel_id=white_level_id,
            checkup_date__gte=fiscal_year_start_date
        )
        return Response({'data': {'count': medical_checkups.count()}}, status=status.HTTP_200_OK)


class FetchOrganizationMedicalCheckUpEmployeeInfoAPI(APIView):
    def get(self, request):
        # Fetch data with necessary prefetching
        white_level_id = get_authenticated_user_whitelevel_id(request)
        fiscal_year_start_date = get_current_fiscal_year_start()
        medical_checkups = MedicalCheckUp.objects.filter(
            employee__whitelevel_id=white_level_id,
            checkup_date__gte=fiscal_year_start_date
        )
        response_data = []

        for medical_checkup in medical_checkups:
            response_data.append({
                "employee_id": medical_checkup.employee.employee_id,
                "employee_name": medical_checkup.employee.employee_name,
                "checkup_date": medical_checkup.checkup_date
            })
        return Response({'data': response_data}, status=status.HTTP_200_OK)




class EmployeeMedicalCheckUpAPIView(APIView):
    def get(self, request):
        white_level_id = get_authenticated_user_whitelevel_id(request)
        employee_id = request.GET.get("employeeId")
        
        if not employee_id:
            return Response({"error": "employeeId param is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch employee based on employee_id and whitelevel_id
        employee = Employee.objects.filter(employee_id=employee_id, whitelevel_id=white_level_id).first()

        if not employee:
            return Response({"error": f"Employee with Id '{employee_id}' doesn't exist."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Fetch medical checkups related to the employee
        medical_checkups = MedicalCheckUp.objects.filter(employee=employee)

        if not medical_checkups:
            return Response({"message": f"No medical checkups found for employee with Id '{employee_id}'."},
                            status=status.HTTP_404_NOT_FOUND)

        response_data = []
        for medical_checkup in medical_checkups:  
            image_data = "Image not available"  # Default message when no image is found
            
            if medical_checkup.image:
                try:
                    with BytesIO() as image_buffer:
                        # Open the image using Pillow and save it to the buffer in PNG format
                        image = Image.open(medical_checkup.image)
                        image.save(image_buffer, format='PNG') 
                        image_buffer.seek(0)
                        encoded_image = base64.b64encode(image_buffer.read()).decode('utf-8')
                        image_data = encoded_image
                except Exception as e:
                    # Log the error if there's an issue with processing the image
                    image_data = "Error processing image"

            # Append the medical checkup data along with the image or placeholder message
            response_data.append({
                "employee_id": medical_checkup.employee.employee_id,
                "employee_name": medical_checkup.employee.employee_name,
                "checkup_date": medical_checkup.checkup_date,
                "image": image_data
            })
        
        return Response({'data': response_data}, status=status.HTTP_200_OK)

class UpcomingMedicalCheckUpAPIView(APIView):
    def get(self, request, upcoming=None):
        white_level_id = get_authenticated_user_whitelevel_id(request)

        if not upcoming:
            return Response({"error": "upcoming param is required."}, status=status.HTTP_400_BAD_REQUEST)

        medical_checkups = MedicalCheckUp.objects.filter(employee__whitelevel_id=white_level_id)

        upcoming_medical_checkups = []
        todays_date = datetime.now().date()
        for medical_checkup in medical_checkups:
            if (medical_checkup.next_checkup_date - todays_date).days < upcoming:
                upcoming_medical_checkups.append({
                    "employee_id": medical_checkup.employee.employee_id,
                    "employee_name": medical_checkup.employee.employee_name,
                    "checkup_date": medical_checkup.checkup_date
                })

        return Response({'data': upcoming_medical_checkups}, status=status.HTTP_200_OK)
