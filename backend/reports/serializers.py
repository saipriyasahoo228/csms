# serializers.py
from rest_framework import serializers

class AccidentReportFilterSerializer(serializers.Serializer):
    accident_type = serializers.IntegerField(required=False)
    severity_type = serializers.IntegerField(required=False)
