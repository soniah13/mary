"""
URL configuration for loans project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from myloans.views import *
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/',RegisterUserView.as_view(), name ='register'),
    path('api/login/',LoginView.as_view(), name='login'),
    path('api/token/',TokenObtainPairView.as_view(),name='access_token'),
    path('api/token/refresh/',TokenRefreshView.as_view(),name='refresh_token'),
    path('api-auth',include('rest_framework.urls')),
    path('api/', include('myloans.urls')),
]