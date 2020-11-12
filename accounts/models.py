from django.db import models
from django.contrib.auth.models import User
# Create your models here.

CATEGORY = (('Category0', 'Category0'),('Category1', 'Category1'),('Category2', 'Category2'),)
STATUS = (('Pending', 'Pending'),('Operating', 'Operating'),('Resolved', 'Resolved'),)

class Customer(models.Model):
    name = models.CharField(max_length=200, null=True)
    main_contact = models.CharField(max_length=200, null=True)
    main_email = models.CharField(max_length=200, null=True)
    phone = models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.name

class User(models.Model):
    name = models.CharField(max_length=200, null=True)
    phone = models.CharField(max_length=200, null=True)
    email = models.CharField(max_length=200, null=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    customer = models.ManyToManyField(Customer)

    def __str__(self):
        return self.name

class Ticket(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE) 
    status = models.CharField(max_length=200, null=True, choices=STATUS)
    description = models.CharField(max_length=1000, null=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.ticket.name

class Tag(models.Model):
    name = models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=200, null=True)
    category = models.CharField(max_length=200, null=True, choices=CATEGORY)
    description = models.CharField(max_length=200, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    tags = models.ManyToManyField(Tag)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200, null=True)
    category = models.CharField(max_length=200, null=True, choices=CATEGORY)
    description = models.CharField(max_length=200, null=True, blank=True)
    tags = models.ManyToManyField(Tag)

    def __str__(self):
        return self.name




