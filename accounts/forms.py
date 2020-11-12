from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User as adminuser
from django import forms
from .models import *

class UserForm(ModelForm):
    class Meta:
        model = User
        fields = '__all__'
        exclude = ['user']

class TicketForm(ModelForm):
    class Meta:
        model = Ticket
        fields = '__all__'

class ServiceForm(ModelForm):
    class Meta:
        model = Service
        fields = '__all__'

class ProductForm(ModelForm):
    class Meta:
        model = Product
        fields = '__all__'

class CustomerForm(ModelForm):
    class Meta:
        model = Customer
        fields = '__all__'

# This class is for the session user (login/logout) 
class CreateUserForm(UserCreationForm):
    class Meta:
        model = adminuser
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']