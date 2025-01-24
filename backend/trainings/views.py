import base64
from io import BytesIO
from django.core.files.base import ContentFile
from django.db.models import Count
from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db import transaction
import os
from django.core.files.storage import default_storage
import base64
from django.conf import settings
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from EMS.views import get_authenticated_user_whitelevel_id
from employee.models import Employee
from .models import Training, Trainer, Trainee, TrainingReport
from .serializers import TrainingSerializer,TrainerSerializer,TraineeSerializer,TrainingTypeSerializer
import logging

logger = logging.getLogger(__name__)


training_filter_map = {
    "tool": "TOOL BOX TRAINING",
    "behavioral": "BEHAVIORAL TRAINING",
    "safety": "JOB SAFETY TRAINING",
    "others": "OTHERS"
}




@api_view(['POST'])
def start_training(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                # Get trainers and trainees data
                trainers_data = request.data.get('trainers', [])
                trainees_data = request.data.get('trainees', [])
                white_level_id = get_authenticated_user_whitelevel_id(request)

                training_data = request.data.copy()  # Make a mutable copy of the request data
                training_image_data = training_data.get('training_image', None)  # Get the base64 image string

                # Process the training image only if provided
                if training_image_data:
                    try:
                        # Decode the base64 image data
                        image_data = base64.b64decode(training_image_data)

                        # Create a ContentFile (used to save the image to the model)
                        image = ContentFile(image_data, name="training_image.png")

                        # Update the mutable copy of the data with the image file
                        training_data['training_image'] = image
                    except Exception:
                        return Response({"error": "Invalid base64 image data."}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    # Remove the training_image field from the data if not provided
                    training_data.pop('training_image', None)

                # Serialize the training data
                training_serializer = TrainingSerializer(data=training_data)

                if not training_serializer.is_valid():
                    return Response(training_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                # Save the training instance
                training_instance = training_serializer.save()

                # Save trainers linked to the training instance
                for trainer_data in trainers_data:
                    trainer = Employee.objects.filter(employee_id=trainer_data.get('trainer_id'), whitelevel_id=white_level_id)
                    if trainer.count() == 1:
                        trainer_id = trainer[0]
                        trainer_name = trainer_data.get('trainer_name')

                        if trainer_id:
                            trainer_obj, created = Trainer.objects.get_or_create(
                                training=training_instance,
                                trainer_id=trainer_id,
                                defaults={'trainer_name': trainer_name}
                            )
                            if not created:
                                trainer_obj.trainer_name = trainer_name
                                trainer_obj.save()

                # Save trainees linked to the training instance
                for trainee_data in trainees_data:
                    trainee = Employee.objects.filter(employee_id=trainee_data.get('trainee_id'), whitelevel_id=white_level_id)
                    if trainee.count() == 1:
                        trainee_id = trainee[0]
                        trainee_name = trainee_data.get('trainee_name')

                        if trainee_id:
                            trainee_obj, created = Trainee.objects.get_or_create(
                                training=training_instance,
                                trainee_id=trainee_id,
                                defaults={'trainee_name': trainee_name}
                            )
                            if not created:
                                trainee_obj.trainee_name = trainee_name
                                trainee_obj.save()

                # Create a training report
                TrainingReport.objects.create(
                    training=training_instance,
                    whitelevel_id=training_instance.whitelevel_id,
                    training_type=training_instance.training_type,
                    training_date=training_instance.training_date,
                    trainer_id=training_instance.trainers.first()  # Assuming there's at least one trainer
                )

                # Prepare response data
                response_data = training_serializer.data
                response_data['trainers'] = Trainer.objects.filter(training=training_instance).values('id', 'trainer_id', 'trainer_name')
                response_data['trainees'] = Trainee.objects.filter(training=training_instance).values('id', 'trainee_id', 'trainee_name')

                return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error in start_training: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            

#RETRIVE ALL RECORDS BY GIVING TRAINING_ID AND WHITELEVEL_ID
class TrainingDetailsRetrieveView(APIView):
    def post(self, request):
        # Extract the training_id and whitelevel_id from the request data
        training_id = request.data.get('training_id')
        whitelevel_id = request.data.get('whitelevel_id')

        # Validate if both training_id and whitelevel_id are provided
        if not training_id or not whitelevel_id:
            return Response(
                {"error": "Both training_id and whitelevel_id are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Retrieve the training instance based on training_id and whitelevel_id
            training_instance = get_object_or_404(
                Training,
                training_id=training_id,
                whitelevel_id=whitelevel_id
            )

            # Serialize the training data using the TrainingSerializer
            training_serializer = TrainingSerializer(training_instance)
            training_data = training_serializer.data

            # Check if there is a training image and encode it to base64
            if training_instance.training_image:
                try:
                    # Get the full path of the image from the database
                    image_path = training_instance.training_image.path
                    # Open the image and convert it to base64
                    with open(image_path, 'rb') as image_file:
                        image_base64 = base64.b64encode(image_file.read()).decode('utf-8')
                        # Add the base64 string to the response (without the prefix)
                        training_data['training_image'] = image_base64
                except Exception as e:
                    training_data['training_image'] = None  # Handle errors during file access
            else:
                training_data['training_image'] = None

            # Fetch associated trainers and serialize them using TrainerSerializer
            trainers = Trainer.objects.filter(training=training_instance)
            trainer_serializer = TrainerSerializer(trainers, many=True)

            # Fetch associated trainees and serialize them using TraineeSerializer
            trainees = Trainee.objects.filter(training=training_instance)
            trainee_serializer = TraineeSerializer(trainees, many=True)

            # Prepare the response data
            response_data = {
                **training_data,
                "trainers": trainer_serializer.data,  # Add serialized trainers data
                "trainees": trainee_serializer.data,  # Add serialized trainees data
            }

            # Return the response with training details, trainers, and trainees
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in retrieving training details: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

#UPDATE ALL TRAINING DETAILS 
class TrainingDetailsUpdateView(APIView):
    def put(self, request):
        training_id = request.data.get('training_id')
        whitelevel_id = request.data.get('whitelevel_id')

        if not training_id or not whitelevel_id:
            return Response(
                {"error": "Both training_id and whitelevel_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Retrieve the training instance
            training_instance = get_object_or_404(
                Training, training_id=training_id, whitelevel_id=whitelevel_id
            )

            # Update basic fields
            training_instance.training_name = request.data.get(
                'training_name', training_instance.training_name
            )
            training_instance.training_date = request.data.get(
                'training_date', training_instance.training_date
            )
            training_instance.about_the_training = request.data.get(
                'about_the_training', training_instance.about_the_training
            )

            # Handle image if provided
            training_image_data = request.data.get("training_image")
            if training_image_data:
                try:
                    decoded_image = base64.b64decode(training_image_data)
                    image_name = f"training_image_{training_id}.jpg"
                    training_instance.training_image.save(image_name, ContentFile(decoded_image))
                except Exception as e:
                    return Response(
                        {"error": f"Invalid image format: {str(e)}"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            training_instance.save()

            # Handle trainers
            trainers_data = request.data.get('trainers', [])
            if trainers_data:
                Trainer.objects.filter(training=training_instance).delete()
                for trainer in trainers_data:
                    employee_id = trainer.get("employee_id")
                    trainer_name = trainer.get("trainer_name")

                    # Fetch Employee instance based on whitelevel_id and employee_id
                    employee_instance = get_object_or_404(
                        Employee,
                        employee_id=employee_id,
                        whitelevel_id=whitelevel_id,
                    )
                    Trainer.objects.create(
                        training=training_instance,
                        trainer_id=employee_instance,
                        trainer_name=trainer_name,
                    )

            # Handle trainees
            trainees_data = request.data.get('trainees', [])
            if trainees_data:
                Trainee.objects.filter(training=training_instance).delete()
                for trainee in trainees_data:
                    employee_id = trainee.get("employee_id")
                    trainee_name = trainee.get("trainee_name")

                    # Fetch Employee instance based on whitelevel_id and employee_id
                    employee_instance = get_object_or_404(
                        Employee,
                        employee_id=employee_id,
                        whitelevel_id=whitelevel_id,
                    )
                    Trainee.objects.create(
                        training=training_instance,
                        trainee_id=employee_instance,
                        trainee_name=trainee_name,
                    )

            # Serialize and return the updated response
            training_serializer = TrainingSerializer(training_instance)
            trainers = Trainer.objects.filter(training=training_instance)
            trainer_serializer = TrainerSerializer(trainers, many=True)
            trainees = Trainee.objects.filter(training=training_instance)
            trainee_serializer = TraineeSerializer(trainees, many=True)

            response_data = training_serializer.data
            response_data['trainers'] = trainer_serializer.data
            response_data['trainees'] = trainee_serializer.data

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in updating training details: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TrainingReportListAPIView(generics.ListAPIView):
    def get(self, request):
        response_data = {}

        white_level_id = get_authenticated_user_whitelevel_id(request)
        training_reports = Training.objects.filter(
            whitelevel_id=white_level_id
        ).select_related('training_type')

        filter_training_type = request.GET.get("filter")
        if filter_training_type:
            if filter_training_type not in training_filter_map.keys():
                return Response({"error": "Invalid filter parameter value."}, status=status.HTTP_400_BAD_REQUEST)
            filter_training_type = training_filter_map.get(filter_training_type)
            if filter_training_type:
                training_reports = training_reports.filter(training_type__training_type=filter_training_type)
                response_data[filter_training_type] = []

        for training in training_reports:
            training_name = training.training_type.training_type
            if training.training_type not in response_data:
                response_data[training_name] = []
            temp_training_info = {
                "training_id": training.training_id,
                "training_date": training.training_date,
                "training_name": training.training_name,
                "trainee_count": 0,
                "trainers": [],
                "trainees": [],
                "training_image": None
            }

            # Encode training image in base64 if it exists
            if training.training_image:
                with open(training.training_image.path, "rb") as image_file:
                    # Read the image and encode it to base64
                    encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                    temp_training_info["training_image"] = encoded_image

            trainers = Trainer.objects.filter(training=training)
            for t in trainers:
                temp_training_info["trainers"].append({
                    "trainer_id": t.trainer_id.employee_id,
                    "trainer_name": t.trainer_name
                })
            trainees = Trainee.objects.filter(training=training)
            for t in trainees:
                temp_training_info["trainees"].append({
                    "trainee_id": t.trainee_id.employee_id,
                    "trainee_name": t.trainee_name
                })
                temp_training_info["trainee_count"] += 1

            response_data[training_name].append(temp_training_info)

        return Response({"data": response_data}, status=status.HTTP_200_OK)

class EmployeeTrainingReportListAPIView(generics.ListAPIView):
    def get(self, request):
        response_data = {}

        white_level_id = get_authenticated_user_whitelevel_id(request)
        employee_id = request.GET.get("employeeId")
        if not employee_id:
            return Response({"error": "employeeId param is required."}, status=status.HTTP_400_BAD_REQUEST)

        employee = Employee.objects.filter(employee_id=employee_id, whitelevel_id=white_level_id)
        if employee.count() == 0:
            return Response({"error": f"Employee with Id '{employee_id}' doesn't exist."}, status=status.HTTP_400_BAD_REQUEST)

        trainees = Trainee.objects.filter(trainee_id__employee_id=employee_id)
        training_ids_list = list({trainee.training.id for trainee in trainees})

        training_reports = Training.objects.filter(
            whitelevel_id=white_level_id,
            id__in=training_ids_list
        ).select_related('training_type')

        filter_training_type = request.GET.get("filter")
        if filter_training_type:
            if filter_training_type not in training_filter_map.keys():
                return Response({"error": "Invalid filter parameter value."}, status=status.HTTP_400_BAD_REQUEST)
            filter_training_type = training_filter_map.get(filter_training_type)
            if filter_training_type:
                training_reports = training_reports.filter(training_type__training_type=filter_training_type)

        for training in training_reports:
            training_name = training.training_type.training_type
            if training_name not in response_data:
                response_data[training_name] = []
            temp_training_info = {
                "training_id": training.training_id,
                "training_date": training.training_date,
                "training_name": training.training_name,
                "trainee_count": 0,
                "trainers": [],
                "trainees": [],
                "training_image": None,
                "about_the_training": training.about_the_training  # Include about_the_training
            }

            # Encode training image in base64 if it exists
            if training.training_image:
                with open(training.training_image.path, "rb") as image_file:
                    encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                    temp_training_info["training_image"] = encoded_image

            trainers = Trainer.objects.filter(training=training)
            for trainer in trainers:
                temp_training_info["trainers"].append({
                    "trainer_id": trainer.trainer_id.employee_id,
                    "trainer_name": trainer.trainer_name
                })

            trainees = Trainee.objects.filter(training=training)
            for trainee in trainees:
                temp_training_info["trainees"].append({
                    "trainee_id": trainee.trainee_id.employee_id,
                    "trainee_name": trainee.trainee_name
                })
                temp_training_info["trainee_count"] += 1

            response_data[training_name].append(temp_training_info)

        return Response({"data": response_data}, status=status.HTTP_200_OK)


class FetchOrganizationTrainingTypeWiseCountAPI(APIView):
    def get(self, request):
        # Fetch data with necessary prefetching
        white_level_id = get_authenticated_user_whitelevel_id(request)
        training_type_counts = Training.objects.filter(
                whitelevel_id=white_level_id,
            ).values('training_type__training_type') \
            .annotate(count=Count('id')) \
            .order_by('-training_type__id')


        response_data = {}
        for training_type in training_type_counts:
            response_data[training_type['training_type__training_type']] = training_type['count']

        return Response({'data': response_data}, status=status.HTTP_200_OK)
