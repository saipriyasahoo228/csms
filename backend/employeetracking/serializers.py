from rest_framework import serializers
from .models import Training, Trainer, Trainee, TrainingReport, AccidentReporting, AccidentReportedBy, AccidentWorkman, AccidentSupervisor, AccidentReport

class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'

class TraineeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainee
        fields = '__all__'

class TrainingReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingReport
        fields = '__all__'

class TrainingSerializer(serializers.ModelSerializer):
    trainers = TrainerSerializer(many=True, read_only=True)
    trainees = TraineeSerializer(many=True, read_only=True)
    report = TrainingReportSerializer(read_only=True)

    class Meta:
        model = Training
        fields = '__all__'

class AccidentReportedBySerializer(serializers.ModelSerializer):
    class Meta:
        model = AccidentReportedBy
        fields = '__all__'

class AccidentWorkmanSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccidentWorkman
        fields = '__all__'

class AccidentSupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccidentSupervisor
        fields = '__all__'

class AccidentReportSerializer(serializers.ModelSerializer):
    workmen_involved = AccidentWorkmanSerializer(many=True, read_only=True)

    class Meta:
        model = AccidentReport
        fields = '__all__'

class AccidentReportingSerializer(serializers.ModelSerializer):
    reported_by = AccidentReportedBySerializer(many=True, read_only=True)
    workmen = AccidentWorkmanSerializer(many=True, read_only=True)
    supervisors = AccidentSupervisorSerializer(many=True, read_only=True)
    report = AccidentReportSerializer(read_only=True)

    class Meta:
        model = AccidentReporting
        fields = '__all__'
