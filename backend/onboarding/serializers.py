from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('whitelevel_id', 'company_id', 'company_name', 'company_email', 'company_phonenumber', 'company_address')

class CompanyLoginSerializer(serializers.Serializer):
    whitelevel_id = serializers.CharField(max_length=50)
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        whitelevel_id = attrs.get('whitelevel_id')
        password = attrs.get('password')

        if whitelevel_id and password:
            user = authenticate(whitelevel_id=whitelevel_id, password=password, request=self.context.get('request'))
            if not user:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg)
        else:
            msg = 'Must include "whitelevel_id" and "password".'
            raise serializers.ValidationError(msg)

        attrs['user'] = user
        return attrs

    def create(self, validated_data):
        user = validated_data['user']
        refresh = RefreshToken.for_user(user)

        update_last_login(None, user)

        return {
            'whitelevel_id': user.whitelevel_id,
            'token': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }

class CompanyLogoutSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate(self, attrs):
        token = attrs.get('token')

        # You can add additional validation logic here, such as verifying the token.

        return attrs
