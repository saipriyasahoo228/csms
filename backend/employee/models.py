from django.db import models
from onboarding.models import Company
from django.db.models.signals import pre_save
from django.dispatch import receiver


class Employee(models.Model):
    id = models.AutoField(primary_key=True)
    employee_id = models.CharField(max_length=50)
    whitelevel_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    employee_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, null=True, blank=True)
    phonenumber = models.CharField(max_length=15,null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('employee_id', 'whitelevel_id')

    def __str__(self):
        return f"{self.employee_id} - {self.employee_name}"

    def get_employee_id(self):
        return self.employee_id
    def get_employee_name(self):
        return self.employee_name

@receiver(pre_save, sender=Employee)
def set_default_role(sender, instance, **kwargs):
    # Remove the following logic if role field is removed and not needed
    pass
