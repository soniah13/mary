from django.contrib.auth.models import User
from .models import Loan, Customer,Payment,Guarantor
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# User serializer for registration
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# Custom JWT serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        # Assuming user has a 'profile' with a 'role' field
        if hasattr(user, 'profile') and hasattr(user.profile, 'role'):
            token['role'] = user.profile.role
        return token

class CustomerSerializer(serializers.ModelSerializer):
    loan_limit = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = '__all__'

        
    def get_loan_limit(self,obj):
        return obj.calculate_loan_limit()

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model= Payment
        fields = '__all__'


class GuarantorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guarantor
        fields = '__all__'

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

