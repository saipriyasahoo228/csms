from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from EMS.views import get_authenticated_user_whitelevel_id
from .models import Employee
from .serializers import EmployeeSerializer, EmployeeNameSerializer,EmployeeDetailsSerializer
from django.db import IntegrityError, transaction, connection

@api_view(['POST'])
def register_employee(request):
    """
    API endpoint to register a new employee.
    """
    if request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            # Handle the intigrity error----------------------------------------------------------------------------------------------------
            try:
                # Attempt to save the employee
                serializer.save()
                return Response({"message": "Employee created successfully"}, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                # If IntegrityError occurs (e.g., duplicate primary key)
                if 'duplicate key value violates unique constraint' in str(e):
                    # Reset sequence to avoid future conflicts (for PostgreSQL)
                    with transaction.atomic():
                        cursor = connection.cursor()
                        cursor.execute('SELECT setval(pg_get_serial_sequence(\'employee_employee\', \'id\'), max(id)) FROM employee_employee')
                    # Try saving again after resetting the sequence
                    serializer.save()
                    return Response({"message": "Employee created successfully (ID conflict resolved)"}, status=status.HTTP_201_CREATED)
                # If it's some other IntegrityError, return a generic response
                return Response({"error": "An error occurred while creating the employee."}, status=status.HTTP_400_BAD_REQUEST)           
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def get_employee_name(request):
    """
    API endpoint to retrieve employee name by employee ID and whitelevel ID.
    """
    if request.method == 'POST':
        employee_id = request.data.get('employee_id', None)
        whitelevel_id = request.data.get('whitelevel_id', None)

        if not employee_id or not whitelevel_id:
            return Response({"error": "Both employee ID and whitelevel ID must be provided in the request data"}, status=status.HTTP_400_BAD_REQUEST)
        if employee_id == 0:
            return Response({"error": "Invalid employee ID provided in the request data"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            employee = Employee.objects.get(employee_id=employee_id, whitelevel_id=whitelevel_id)
        except Employee.DoesNotExist:
            return Response({"error": f"Employee with ID {employee_id} under whitelevel {whitelevel_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = EmployeeNameSerializer(employee)
        return Response(serializer.data)
    
    return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

# @api_view(['POST'])
# def get_employee_details(request):
#     """
#     API endpoint to retrieve employee name by employee ID and whitelevel ID.
#     """
#     if request.method == 'POST':
#         employee_id = request.data.get('employee_id', None)
#         whitelevel_id = request.data.get('whitelevel_id', None)

#         if not employee_id or not whitelevel_id:
#             return Response({"error": "Both employee ID and whitelevel ID must be provided in the request data"}, status=status.HTTP_400_BAD_REQUEST)
#         if employee_id == 0:
#             return Response({"error": "Invalid employee ID provided in the request data"}, status=status.HTTP_400_BAD_REQUEST)
#         try:
#             employee = Employee.objects.get(employee_id=employee_id, whitelevel_id=whitelevel_id)
#         except Employee.DoesNotExist:
#             return Response({"error": f"Employee with ID {employee_id} under whitelevel {whitelevel_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
#         serializer = EmployeeDetailsSerializer(employee)
#         return Response(serializer.data)
    
#     return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST', 'PUT'])
def get_employee_details(request):
    """
    API endpoint to retrieve or partially update employee details, including changing the employee ID.
    """
    employee_id = request.data.get('employee_id', None)
    whitelevel_id = request.data.get('whitelevel_id', None)

    if not employee_id or not whitelevel_id:
        return Response(
            {"error": "Both employee ID and whitelevel ID must be provided in the request data"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if employee_id == 0:
        return Response(
            {"error": "Invalid employee ID provided in the request data"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Fetch the employee record from the database
        employee = Employee.objects.get(employee_id=employee_id, whitelevel_id=whitelevel_id)
    except Employee.DoesNotExist:
        return Response(
            {"error": f"Employee with ID {employee_id} under whitelevel {whitelevel_id} does not exist"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Handle retrieval (POST request)
    if request.method == 'POST':
        serializer = EmployeeDetailsSerializer(employee)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Handle update and reposting (PATCH request)
    elif request.method == 'PUT':
        # Check if a new employee_id is provided
        new_employee_id = request.data.get('new_employee_id', None)
        if new_employee_id:
            # Ensure the new employee_id is unique within the same whitelevel
            if Employee.objects.filter(employee_id=new_employee_id, whitelevel_id=whitelevel_id).exists():
                return Response(
                    {"error": f"Employee ID {new_employee_id} already exists under whitelevel {whitelevel_id}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Update the employee_id explicitly
            employee.employee_id = new_employee_id

        # Update other fields
        serializer = EmployeeDetailsSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # Save changes to the database

            return Response(
                {
                    "message": "Employee details updated successfully, including employee ID" if new_employee_id else "Employee details updated successfully",
                    "updated_data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



@api_view(['GET'])
def search_employee_name(request):
    """
    API endpoint to search employee name containing `nameQuery`.
    """
    if request.method == 'GET':
        employee_name_query = request.GET.get('nameQuery', None)

        if not employee_name_query:
            return Response({"error": "Employee name initials must be provided in the request data"}, status=status.HTTP_400_BAD_REQUEST)

        white_level_id = get_authenticated_user_whitelevel_id(request)
        employees = Employee.objects.filter(employee_name__contains=employee_name_query, whitelevel_id=white_level_id)

        response_data = []
        for employee in employees:
            response_data.append({
                "employee_name": employee.employee_name,
                "employee_id": employee.employee_id,
                
            })
        return Response(response_data, status=status.HTTP_200_OK)

    return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def get_all_employee(request):
        # Assuming get_authenticated_user_whitelevel_id is a utility to fetch the white-level ID
        white_level_id = get_authenticated_user_whitelevel_id(request)
        if not white_level_id:
            return Response({"error": "White-level ID not found for the authenticated user."}, 
                            status=status.HTTP_400_BAD_REQUEST)
        # Fetching employees filtered by white-level ID
        employees = Employee.objects.filter(whitelevel_id=white_level_id)
        # Preparing response data
        response_data = [
            {
                "employee_name": employee.employee_name,
                "employee_id": employee.employee_id,
                "email": employee.email,
                "phonenumber": employee.phonenumber,
                "address": employee.address,
                
            }
            for employee in employees
        ]
        return Response(response_data, status=status.HTTP_200_OK)