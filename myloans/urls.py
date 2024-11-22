from django.urls import path
from .views import *



urlpatterns = [
    path('user/register/', RegisterUserView.as_view(), name='register'),
    path('api/token/', LoginView.as_view(), name = 'logIn'),
    path("customers/profile/", customer_profile_detail, name="customer_dashboard"),
    path("customers/profile/<int:customer_id>/", customer_profile_detail, name="customer_profile_detail"),

]

#POST/api/payments/-create
#GET/api/payment/{id}/ - retrieve specific
#PUT/api/paymenet/{id}/ - update
#DELETE/api/payments/{id}/