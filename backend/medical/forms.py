from django import forms


class NewMedicalCheckUp(forms.Form):
    employee_id = forms.CharField(required=True)
    checkUpDate = forms.CharField(required=True)
