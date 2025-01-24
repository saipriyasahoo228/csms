from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
from onboarding.models import Company
from employee.models import Employee
from trainings.models import Training


class AccidentType(models.Model):
    accident_type_id = models.AutoField(primary_key=True)
    accident_type = models.CharField(max_length=100)

    def __str__(self):
        return self.accident_type


class PermitStatus(models.Model):
    status_id = models.AutoField(primary_key=True)
    status_type = models.CharField(max_length=100)

    def __str__(self):
        return self.status_type


class Severity(models.Model):
    severity_id = models.AutoField(primary_key=True)
    severity_type = models.CharField(max_length=100)

    def __str__(self):
        return self.severity_type


class PpeStatus(models.Model):
    ppe_status_id = models.AutoField(primary_key=True)
    ppe_type = models.CharField(max_length=100)

    def __str__(self):
        return self.ppe_type


class AccidentReporting(models.Model):
    accident_reporting_date = models.DateField(default=timezone.now)
    accident_id = models.CharField(max_length=20, unique=True)
    accident_type = models.ForeignKey(AccidentType, on_delete=models.CASCADE)
    severity = models.ForeignKey(Severity, on_delete=models.CASCADE, null=True, blank=True)
    permit_status = models.ForeignKey(PermitStatus, on_delete=models.CASCADE, null=True, blank=True)
    ppe_status = models.ForeignKey(PpeStatus, on_delete=models.CASCADE, null=True, blank=True)
    toolbox_train = models.BooleanField(default=False)
    toolbox_reference_number = models.ForeignKey(Training, on_delete=models.CASCADE, blank=True, null=True)
    accident_image = models.ImageField(upload_to='accident_images/', blank=True, null=True)
    about_the_accident = models.TextField(blank=True, null=True)
    whitelevel = models.ForeignKey(Company, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if self.toolbox_train and not self.toolbox_reference_number:
            from django.core.exceptions import ValidationError
            raise ValidationError("Toolbox reference number is required if toolbox train is True")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.accident_id} - {self.accident_type} - {getattr(self.severity, 'severity_type', 'nearmiss')}"


@receiver(post_save, sender=AccidentReporting)
def create_accident_report(sender, instance, created, **kwargs):
    if created:
        AccidentReport.objects.create(
            accident_report_date=instance.accident_reporting_date,
            whitelevel_id=instance.whitelevel,
            accident_type=instance.accident_type,
            severity=instance.severity,
            accident_id=instance
        )


class AccidentReportedBy(models.Model):
    accident = models.ForeignKey(AccidentReporting, related_name='reported_by', on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True)
    employee_name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.accident} - {self.employee}"


class AccidentWorkman(models.Model):
    accident = models.ForeignKey(AccidentReporting, related_name='workmen', on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True)
    employee_name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.accident} - {self.employee}"


class AccidentSupervisor(models.Model):
    accident = models.ForeignKey(AccidentReporting, related_name='supervisors', on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True)
    employee_name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.accident} - {self.employee}"


class AccidentReport(models.Model):
    accident_report_date = models.DateField(default=timezone.now)
    whitelevel_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    accident_type = models.ForeignKey(AccidentType, on_delete=models.CASCADE)
    severity = models.ForeignKey(Severity, on_delete=models.CASCADE, null=True, blank=True)
    accident_id = models.OneToOneField(AccidentReporting, on_delete=models.CASCADE)
    workmen_involved = models.ManyToManyField(AccidentWorkman)

    def save(self, *args, **kwargs):
        # Automatically fill fields from related AccidentReporting instance
        if not self.pk:  # Check if instance is being created
            self.whitelevel_id = self.accident_id.whitelevel
            self.accident_type = self.accident_id.accident_type
            self.severity = self.accident_id.severity
            super().save(*args, **kwargs)
            self.workmen_involved.set(self.accident_id.workmen.all())  # Set many-to-many field after saving
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f"Report {self.id} for Accident {self.accident_id.accident_id}"

    class Meta:
        verbose_name_plural = 'Accident Reports'
