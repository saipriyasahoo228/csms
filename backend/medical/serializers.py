from rest_framework import serializers
from .models import MedicalCheckUp

class MedicalCheckUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalCheckUp
        fields = '__all__'