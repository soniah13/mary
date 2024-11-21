from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import CreateUserView,LoginView, CustomerListCreateView, CustomerDetailView,LoanListCreateView, LoanDetailView,PaymentView
from .views import customer_loan_limit, get_customer_profile,admin_dashboard,userDashboardView
from .views import (create_guarantor, list_guarantors, get_guarantor, update_guarantor,delete_guarantor,
)

router = DefaultRouter()
router.register(r'payments', PaymentView, basename='payment')
urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('api/token/', LoginView.as_view(), name = 'logIn'),
    path('customers/', CustomerListCreateView.as_view(), name='customer-list-create'),
    path('customers/<int:pk>/', CustomerDetailView.as_view(), name='customer-detail'),
    path('customers/profile/', get_customer_profile, name='customer_profile'),
    path('loans/', LoanListCreateView.as_view(), name='loan-list-create'),
    path('loans/<int:pk>/', LoanDetailView.as_view(), name='loan-detail'),
    path('customers/<int:pk>/loan-limit/', customer_loan_limit, name='customer-loan-limit'),
    path('guarantors/', list_guarantors, name='list_guarantors'),  # List all guarantors
    path('guarantors/create/', create_guarantor, name='create_guarantor'),  # Create a new guarantor
    path('guarantors/<int:pk>/', get_guarantor, name='get_guarantor'),  # Retrieve a guarantor by ID
    path('guarantors/<int:pk>/update/', update_guarantor, name='update_guarantor'),  # Update a guarantor by ID
    path('guarantors/<int:pk>/delete/', delete_guarantor, name='delete_guarantor'),  # Delete a guarantor by ID
    path('api/admin/dashboard/', admin_dashboard, name='admin_dashboard'),
    path('dashboard/', userDashboardView.as_view(), name='dashboard'),


  
    path('',include(router.urls)),
]

#POST/api/payments/-create
#GET/api/payment/{id}/ - retrieve specific
#PUT/api/paymenet/{id}/ - update
#DELETE/api/payments/{id}/