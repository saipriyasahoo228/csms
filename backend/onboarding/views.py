from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from .models import Company
from .serializers import CompanyLoginSerializer, CompanyLogoutSerializer


class AdminOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        return Response({"message": "Hello admin!"})

class RegularUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Hello regular user!"})

class CompanyLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CompanyLoginSerializer(data=request.data)
        if serializer.is_valid():
            whitelevel_id = serializer.validated_data['whitelevel_id']
            password = serializer.validated_data['password']
            user = authenticate(request=request, whitelevel_id=whitelevel_id, password=password)
            if user is not None:
                login(request, user)
                return Response({'message': 'Login successful'})
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompanyLogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'})
