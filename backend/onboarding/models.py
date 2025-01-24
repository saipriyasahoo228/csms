from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone



ROLES_CHOICES = (
    (1, 'Novazen'),
    (2, 'Admin'),
    (3, 'Operator'),
    (4, 'Viewer')
)

def get_user_role_string(user_type_id):
    user_role = dict(ROLES_CHOICES)
    return user_role.get(user_type_id, 'unknown')


class Company(models.Model):
    whitelevel_id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='media/company_logos/', blank=True, null=True)
    email = models.EmailField(max_length=255, unique=True)
    mobile_number = models.CharField(max_length=15, unique=True)
    address = models.TextField()
    is_active = models.BooleanField(default=True)
    registered_at = models.DateTimeField(default=timezone.now)

    def clean(self):
        # Ensure whitelevel_id does not contain spaces
        if ' ' in self.whitelevel_id:
            raise ValidationError("Whitelevel id should not contain spaces.")

    def save(self, *args, **kwargs):
        self.clean()  # Call clean method to perform validation
        is_new = not Company.objects.filter(whitelevel_id=self.whitelevel_id).exists()
        super(Company, self).save(*args, **kwargs)

        if is_new:
            from employee.models import Employee
            company_email_parts = self.email.split('@')
            pseudo_email = f"{self.whitelevel_id}_pseudo_employee@{company_email_parts[1]}"
            # print(f"Creating pseudo employee with email: {pseudo_email}")
            Employee.objects.create(
                whitelevel_id=self,
                employee_id="0",
                employee_name="Pseudo trainer employee",
                email=pseudo_email,
                phonenumber="0000000000",
                address=""
            )

    def __str__(self):
        return self.name


class UserProfileManager(BaseUserManager):
    def create_user(self, mobile_number, email, name, whitelevel_id, role=3, password=None, **extra_fields):
        if not mobile_number:
            raise ValueError(('The Mobile Number field must be set'))
        if not email:
            raise ValueError(('The Email field must be set'))
        if not name:
            raise ValueError(('The Name field must be set'))
        # if not whitelevel_id:
        #     raise ValueError(('The White level ID field must be set'))

        email = self.normalize_email(email)
        user = self.model(mobile_number=mobile_number, email=email, name=name, whitelevel_id=whitelevel_id, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile_number, email, name, whitelevel_id=None, password=None, **extra_fields):
        if not Company.objects.exists():
            Company.objects.create(
                whitelevel_id="1",
                name="Novazen",
                email="binaryscriber@gmail.com",
                mobile_number="9999999999"
            )

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(('Superuser must have is_superuser=True.'))

        return self.create_user(mobile_number, email, name, whitelevel_id, role=1, password=password, **extra_fields)


class UserProfile(AbstractBaseUser, PermissionsMixin):
    whitelevel_id = models.ForeignKey('Company', on_delete=models.CASCADE, null=True)
    mobile_number = models.CharField(max_length=10, unique=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.IntegerField(default=3, choices=ROLES_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    registered_at = models.DateTimeField(default=timezone.now)

    objects = UserProfileManager()

    USERNAME_FIELD = 'mobile_number'
    REQUIRED_FIELDS = ['name', 'email']

    def __str__(self):
        return self.mobile_number
