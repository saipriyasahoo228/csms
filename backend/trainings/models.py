from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
from onboarding.models import Company
from employee.models import Employee

class TrainingType(models.Model):
    training_type = models.CharField(max_length=100)

    def __str__(self):
        return self.training_type

class Training(models.Model):
    training_id = models.CharField(max_length=100, unique=True)
    training_date = models.DateField(default=timezone.now)
    whitelevel_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    training_type = models.ForeignKey(TrainingType, on_delete=models.CASCADE)
    training_type_other = models.CharField(max_length=100, blank=True, null=True)
    training_name = models.CharField(max_length=100, blank=True, null=True)
    training_image = models.ImageField(upload_to='training_images/', blank=True, null=True)
    about_the_training = models.CharField(max_length=100,blank=True, null=True, default="NA")

    def __str__(self):
        return f"Training {self.training_id}"

class Trainer(models.Model):
    training = models.ForeignKey(Training, related_name='trainers', on_delete=models.CASCADE)
    trainer_id = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True)
    trainer_name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Trainer: {self.trainer_name} for Training ID: {self.training.training_id}"

class Trainee(models.Model):
    training = models.ForeignKey(Training, related_name='trainees', on_delete=models.CASCADE)
    trainee_id = models.ForeignKey(Employee, on_delete=models.CASCADE)
    trainee_name = models.CharField(max_length=100)

    def __str__(self):
        return f"Trainee: {self.trainee_name} for Training ID: {self.training.training_id}"
    
class TrainingReport(models.Model):
    training = models.OneToOneField(Training, on_delete=models.CASCADE, related_name='report')
    whitelevel_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    training_type = models.ForeignKey(TrainingType, on_delete=models.CASCADE)
    training_date = models.DateField(default=timezone.now)
    trainer_id = models.ForeignKey(Trainer, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"Training Report for Training ID: {self.training.training_id}"

@receiver(post_save, sender=Training)
def create_training_report(sender, instance, created, **kwargs):
    if created:
        trainers = instance.trainers.all()
        for trainer in trainers:
            TrainingReport.objects.create(
                training=instance,
                whitelevel_id=instance.whitelevel_id,
                training_type=instance.training_type,
                training_date=instance.training_date,
                trainer_id=trainer,
            )
