# Generated by Django 4.2.14 on 2024-08-09 17:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('employee', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MedicalCheckUp',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('checkup_date', models.DateField()),
                ('next_checkup_date', models.DateField()),
                ('image', models.ImageField(null=True, upload_to='medical_checkup_images/')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employee.employee')),
            ],
            options={
                'db_table': 'medical_check_up',
            },
        ),
    ]
