from django.db import models
from django.utils import timezone
from onboarding.models import Company
from employee.models import Employee


class ItemType(models.Model):
    item_type_id = models.AutoField(primary_key=True)
    item_type_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.item_type_name


class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=100, unique=True)
    item_type = models.ForeignKey(ItemType, on_delete=models.CASCADE)

    def __str__(self):
        return self.item_name


class ItemValidity(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE, primary_key=True)
    validity_in_days = models.IntegerField()

    def __str__(self):
        return f"{self.item.item_name} - Validity: {self.validity_in_days} days"


class NewIssuance(models.Model):
    issuance_id = models.CharField(max_length=100, primary_key=True)
    white_level_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    issuance_date = models.DateField(default=timezone.now)
    newIssuance_image = models.ImageField(upload_to='newIssuance_images/', blank=True, null=True,default='null')
    about_the_newissuance= models.CharField(max_length=100,blank=True, null=True, default="NA")

    def __str__(self):
        return f"Issuance ID: {self.issuance_id}, Date: {self.issuance_date}"


class IssuedThings(models.Model):
    issue_id = models.ForeignKey(NewIssuance, on_delete=models.CASCADE)
    item = models.ForeignKey(ItemValidity, on_delete=models.CASCADE)
    expiry_date = models.DateField(blank=True, null=True)

    # def save(self, *args, **kwargs):
    #     if self.issue_id and self.item:
    #         self.expiry_date = self.issue_id.issuance_date + timezone.timedelta(days=self.item.validity_in_days)
    #     super().save(*args, **kwargs)
    #     self.update_upcoming_issue()
    def save(self, *args, **kwargs):
        if self.issue_id and self.item:
            # Ensure 'issuance_date' is a datetime.date object
            if isinstance(self.issue_id.issuance_date, str):
                # Convert string to date (this is a fallback, as it's expected to be a DateField)
                self.issue_id.issuance_date = timezone.datetime.strptime(self.issue_id.issuance_date, "%Y-%m-%d").date()
            
            # Ensure issuance_date is a valid datetime.date object
            if isinstance(self.issue_id.issuance_date, timezone.datetime):
                self.issue_id.issuance_date = self.issue_id.issuance_date.date()  # Ensure it's just a date

            # Now we can safely perform the timedelta addition
            self.expiry_date = self.issue_id.issuance_date + timezone.timedelta(days=self.item.validity_in_days)

        super().save(*args, **kwargs)
        self.update_upcoming_issue()

    def update_upcoming_issue(self):
        remaining_days = (self.expiry_date - timezone.now().date()).days
        UpcomingIssue.objects.update_or_create(
            issue_id=self.issue_id,
            defaults={'issued_thing': self, 'remaining_days': remaining_days}
        )

    def __str__(self):
        return f"{self.issue_id} - {self.item.item.item_name} issued, expires on {self.expiry_date}"


class IssuedToEmployee(models.Model):
    issue_id = models.ForeignKey(NewIssuance, on_delete=models.CASCADE)
    employee_id = models.ForeignKey(Employee, on_delete=models.CASCADE)

    def __str__(self):
        return f"Issued to {self.employee_id} via {self.issue_id}"


class UpcomingIssue(models.Model):
    issue_id = models.OneToOneField(NewIssuance, on_delete=models.CASCADE)
    issued_thing = models.OneToOneField(IssuedThings, on_delete=models.CASCADE, related_name='upcoming_issue')
    remaining_days = models.IntegerField()

    def save(self, *args, **kwargs):
        if self.issued_thing and self.issued_thing.expiry_date:
            self.remaining_days = (self.issued_thing.expiry_date - timezone.now().date()).days
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.issue_id} - {self.issued_thing.item.item.item_name} expires in {self.remaining_days} days"