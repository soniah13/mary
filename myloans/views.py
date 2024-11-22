from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import  api_view, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *
from .serializers import *


# Create your views here.
def index(request):
    return render(request,'index.html')

class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_serializer = UserSerializer(data=request.data)

        if user_serializer.is_valid():
            user = user_serializer.save()
            return Response({
                "user": user_serializer.data,
                "message": "User registered successfully!"
            }, status=status.HTTP_201_CREATED)

        return Response({
            "errors" : user_serializer.errors,
            "message": "User registration failed."
        }, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username

        try:
            token['customer_id'] = user.customer.customer_id
        except AttributeError:
            token['customer_id'] = None
        return token
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        try:
            customer = user.customer
            data['customer_id'] = customer.customer_id
        except Customer.DoesNotExist:
            raise serializers.ValidationError("User does not have a valid customer profile.")
    


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            try:
                customer = user.customer
                refresh = RefreshToken.for_user(user)

                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'customer_id': customer.customer_id,
                }, status=status.HTTP_200_OK)
            except Customer.DoesNotExist:
                return Response({"error": "Customer profile not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def customer_profile_detail(request):
        try:
            customer = request.user.customer
        except AttributeError:
            return Response({"error": "You must be logged in as a customer to access this profile."},
                            status=status.HTTP_403_FORBIDDEN)
        except Customer.DoesNotExist:
            return Response({"error": "Customer profile not found."},
                        status=status.HTTP_404_NOT_FOUND)
        if request.method == 'GET':
            data = {
                "customer_id": customer.customer_id,
                "contact": customer.contact,
                "address": customer.address,
                "firstName": customer.firstName,
                "lastName": customer.lastName,
                "middleName": customer.middleName,
                "isEmployed": customer.isEmployed,
                "income": customer.income,
                
            }
            return Response(data, status=status.HTTP_200_OK)

        elif request.method == 'PATCH':
            serializer = CustomerSerializer(customer, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
class CustomerDashboardView(APIView):
    """
    Handles GET for retrieving the logged-in user's profile.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
            serializer = CustomerSerializer(customer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Customer.DoesNotExist:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

# displays the customers loan  
