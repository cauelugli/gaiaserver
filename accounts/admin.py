from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Ticket)
admin.site.register(User)
admin.site.register(Service)
admin.site.register(Product)
admin.site.register(Customer)
admin.site.register(Tag)