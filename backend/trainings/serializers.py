# serializers.py
import base64
from io import BytesIO
from rest_framework import serializers
from .models import Training, Trainer, Trainee, TrainingType,Employee
from django.db import transaction 
from django.core.files.base import ContentFile
from PIL import Image
import io

class TrainingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingType  # Your actual TrainingType model here
        fields = ['id', 'training_type']  # Include other fields as needed

class TrainerSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source="trainer_id.employee_id", read_only=True)
    class Meta:
        model = Trainer
        fields = ['id', 'trainer_id','trainer_name','employee_id' ]

    def validate(self, data):
        if not data.get('trainer_id'):
            data['trainer_id'] = None  # Ensure trainer_id can be empty or null
        return data

class TraineeSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source="trainee_id.employee_id", read_only=True)
    class Meta:
        model = Trainee
        fields = ['id', 'trainee_id', 'trainee_name','employee_id']

    def validate(self, data):
        if not data.get('trainee_id'):
            raise serializers.ValidationError({"trainee_id": "This field is required."})
        return data

class TrainingSerializer(serializers.ModelSerializer):
     # Serialize 'training_type' using the TrainingTypeSerializer
    

    class Meta:
        model = Training
        fields = ['id', 'training_id', 'training_date', 'whitelevel_id', 'training_type', 'training_name','training_image','about_the_training']
        read_only_fields = ['id']  # Assuming 'id' is auto-generated

        


        

   