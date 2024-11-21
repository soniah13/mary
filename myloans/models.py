from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal

# Create your models here.
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default="customer")
    customer_id = models.AutoField(primary_key=True)
    contact = models.CharField(max_length=15)
    address = models.TextField()
    firstName = models.CharField(max_length=100, blank=True)
    lastName = models.CharField(max_length=100, blank=True)
    middleName = models.CharField(max_length=100, blank=True)
    isEmployed = models.BooleanField(default=False)
    income = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    guarantor = models.OneToOneField('Guarantor', on_delete=models.CASCADE,blank=True,null=True,  related_name='customer', default=None)


        
    def __str__(self):
        return f"Customer {self.firstName} "
    
    def calculate_loan_limit(self):
        if self.isEmployed and self.income:
            return self.income * Decimal('0.10')  # 10% of salary
        return Decimal('0.00')

class Loan(models.Model):
    loan_id = models.AutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    status_loan = models.CharField(max_length=20,default="pending")
    purpose = models.CharField(max_length=20)
    date_issued = models.DateField()
    
    def __str__(self):
        return f"Loan {self.loan_id} for {self.amount} issued on {self.date_issued}"

class Profile(models.Model):
    Choices =(
        ('customer' , 'Customer'),
        ('admin', 'Admin'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=10, choices=Choices, default='customer')

    def __str__(self):
        return f"{self.user.username} - {self.role}"
    


class Payment(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20,
                               choices=[('completed', 'Completed'), 
                                        ('pending', 'Pending'),
                                          ('failed', 'Failed')],)

    def __str__(self):
        return f"Payment of {self.amount} for Loan ID {self.loan.id}"
    

class Guarantor(models.Model):
    guarantor_id = models.AutoField(primary_key=True, default= None)
    name = models.CharField(max_length=100, blank=False)
    phoneNumber =models.CharField(max_length=15)
    relationship = models.CharField(max_length=30)


    def __str__(self):
        return f"Guarantor {self.name} "
    


    