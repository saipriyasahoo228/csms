from django.db import models

from employee.models import Employee


class MedicalCheckUp(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    checkup_date = models.DateField(null=False)
    next_checkup_date = models.DateField(null=False)
    image = models.ImageField(upload_to='medical_checkup_images/', null=True)

    class Meta:
        db_table = 'medical_check_up'