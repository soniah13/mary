from django.shortcuts import render
from .serializers import UserSerializer
from rest_framework import generics, permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from django.contrib import messages
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.decorators import login_required
from .models import Customer
from .models import Loan
from .models import Payment
from .models import Guarantor
from .serializers import GuarantorSerializer
from .serializers import LoanSerializer,CustomerSerializer,PaymentSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date



# Create your views here.
def index(request):
    return render(request,'index.html')

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return self.request.user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = request.user
        try:
            customer = user.customer
            response.data['customer_id'] = customer.pk
        except AttributeError:
            response.data['customer_id'] = None
        return response


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': "refresh",
                'access': "access_token",
                'customer id':"customer_id",
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)



class userDashboardView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
        }
        return (user_data)
#customers profile

@login_required(login_url='login_user') 
class customerProfileView(APIView):
    permission_classes = [IsAuthenticated]

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def get_customer_profile(request):
    try:
        customer = request.user.customer
    except AttributeError:
        customer = None
    if request.method == 'GET':
        if customer:
            serializer = CustomerSerializer(customer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Customer profile not found for the user.'},
                status=status.HTTP_404_NOT_FOUND
            )
    if request.method == 'PATCH':
        if customer:
            serializer = CustomerSerializer(customer, data=request.data, partial=True)  # partial=True allows partial update
        else:
            return Response(
                {'error': 'Customer profile not found for the user.'},
                status=status.HTTP_404_NOT_FOUND
            )
        if serializer.is_valid():
            serializer.save()  # Save the updated data
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    #def get(self,request):
        #gets the profile of the login customer
        #customer = Customer.objects.get(user=request.user)
        #serializer = CustomerSerializer(customer)
        #return Response(serializer.data)
    
   


# displays the customers loan

@login_required(login_url='login_user') 
class CustomerLoanListView(generics.ListAPIView):
    serializer_class = LoanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return loans associated with the authenticated customer
        return Loan.objects.filter(customer=self.request.user)

# Adminview
class AdminLoanListView(generics.ListAPIView):
    serializer_class = LoanSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        # all loans for admin
        return Loan.objects.all()



#creation of customers


class CustomerListCreateView(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        serializer.save(user=self.request.user)
        return super().perform_create(serializer)




class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


#for viewing 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_loan_limit(request, pk):
    try:
        # Get customer by primary key (customer_id)
        customer = get_object_or_404(Customer, pk=pk)
        # Ensure the customer matches the authenticated user
        if customer.user != request.user:
            return Response({"error": "Unauthorized access to customer data."}, status=status.HTTP_403_FORBIDDEN)
        # Calculate loan limit
        loan_limit = customer.calculate_loan_limit()
        return Response({"loan_limit": loan_limit}, status=status.HTTP_200_OK)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)


class LoanListCreateView(generics.ListCreateAPIView):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Loan.objects.filter(Customer=self.request.user.customer)
    def perform_create(self, serializer):
        #creates losn if user is authenticated
        serializer.save(customer=self.request.user.customer)



#loans that one person has


class LoanDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Loan.objects.all()
    serializer_class =LoanSerializer
    permission_classes = [IsAuthenticated]

#user cannot delete,view or update alon that does not belong to them
    def get_queryset(self):
        return Loan.objects.filter(customer=self.request.user.customer)

#for payment


class PaymentView(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def create(self, request,*args, **kwargs):
        #get data
        loan_id = request.data.get("loan")
        amount = request.data.get("amount")


        try:
            loan = Loan.objects.get(id=loan_id)
            Payment = Payment.objects.create(loan=loan,customer=request.user.customer, amount=amount )
            return Response(PaymentSerializer(Payment).data, status=status.HTTP_201_CREATED)

        except Loan.DoesNotExist:
            return Response({"error":"loan not found"}, status=status.HTTP_404_NOT_FOUND)

#def logout_user(request):
    #logout(request)
    #messages.success(request, ('You are now logged out..'))
    #return redirect(request, '')

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get refresh token from request
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            # Blacklist the token
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid token or already logged out"}, status=status.HTTP_400_BAD_REQUEST)



# Create Guarantor
@api_view(['POST'])
def create_guarantor(request):
    if request.method == 'POST':
        serializer = GuarantorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# List all Guarantors
@api_view(['GET'])
def list_guarantors(request):
    if request.method == 'GET':
        guarantors = Guarantor.objects.all()
        serializer = GuarantorSerializer(guarantors, many=True)
        return Response(serializer.data)

# Retrieve a single Guarantor by ID
@api_view(['GET'])
def get_guarantor(request, pk):
    try:
        guarantor = Guarantor.objects.get(pk=pk)
    except Guarantor.DoesNotExist:
        return Response({'error': 'Guarantor not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = GuarantorSerializer(guarantor)
        return Response(serializer.data)

# Update Guarantor
@api_view(['PUT'])
def update_guarantor(request, pk):
    try:
        guarantor = Guarantor.objects.get(pk=pk)
    except Guarantor.DoesNotExist:
        return Response({'error': 'Guarantor not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = GuarantorSerializer(guarantor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete Guarantor
@api_view(['DELETE'])
def delete_guarantor(request, pk):
    try:
        guarantor = Guarantor.objects.get(pk=pk)
    except Guarantor.DoesNotExist:
        return Response({'error': 'Guarantor not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        guarantor.delete()
        return Response({'message': 'Guarantor deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAdminUser])  # Only admins can access
def admin_dashboard(request):
    # Get all customers
    customers = Customer.objects.all()
    customers_data = CustomerSerializer(customers, many=True).data

    # Get all loans
    loans = Loan.objects.all()
    loans_data = LoanSerializer(loans, many=True).data

    # Get all payments
    payments = Payment.objects.all()
    payments_data = PaymentSerializer(payments, many=True).data

    # Aggregate and return the data
    data = {
        "customers": customers_data,
        "loans": loans_data,
        "payments": payments_data,
    }
    return Response(data)
