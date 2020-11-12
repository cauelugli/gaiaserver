from django.shortcuts import render, redirect 
from django.http import HttpResponse
from django.forms import inlineformset_factory
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate
from django.contrib.auth import login as loginn # So I can call my func 'def login' 
from django.contrib.auth import logout as logoutt # and not have the framework overwritten ;)
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group

from .models import *
from .forms import *
from .filters import *
from .decorators import *

# Login, Logout, Register and Home

def logout(request):
    logoutt(request)
    return redirect('login')

@unauthenticated_user
def login(request):
    if request.method =='POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            loginn(request, user)
            return redirect('home')
        else:
            messages.info(request, 'Username or Password is incorrect')

    context = {}
    return render(request, 'accounts/login.html', context)

@unauthenticated_user
def register(request):
    form = CreateUserForm()
    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')                    
            messages.success(request, 'Account was created for ' + username)
            return redirect('login')
        else:
            print('form.errors', form.errors, "\n")
            messages.info(request, form.errors)

    context = {'form': form }
    return render(request, 'accounts/register.html', context)

@login_required(login_url='login')
def home(request):
    tickets = Ticket.objects.all()
    services = Service.objects.all()
    users = User.objects.all()
    total_tickets = tickets.count()
    pending = tickets.filter(status='Pending').count()
    operating = tickets.filter(status='Operating').count()
    resolved = tickets.filter(status='Resolved').count()

    context = {
        'tickets': tickets,
        'services': services,
        'users': users,
        'total_tickets': total_tickets,
        'pending': pending,
        'operating': operating,
        'resolved': resolved
    }
    return render(request, 'accounts/dashboard.html', context)

# Login, Logout, Register and Index
# Ticket Section

@login_required(login_url='login')
def tickets(request):
    tickets = Ticket.objects.all()

    if request.method == 'POST' and request.POST['delete-id']:
        Ticket.objects.get(pk=request.POST['delete-id']).delete()
        return redirect('tickets')

    context = {'tickets': tickets }
    return render(request, 'accounts/tickets.html', context)

@login_required(login_url='login')
def createTicket(request):
	form = TicketForm()
	if request.method == 'POST':
		form = TicketForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect('tickets')

	context = {'form':form}
	return render(request, 'accounts/ticket_add.html', context)

@login_required(login_url='login')
def updateTicket(request, pk):
    ticket = Ticket.objects.get(id=pk)    
    form = TicketForm(instance=ticket)
    if request.method == 'POST':
        form = TicketForm(request.POST, instance=ticket)
        if form.is_valid():
            form.save()
            return redirect('tickets')

    context = {'form': form }
    return render(request, 'accounts/ticket_update.html', context)

@login_required(login_url='login')
def deleteTicket(request, pk):
    ticket = Ticket.objects.get(id=pk) 
    if request.method == 'POST':
        ticket.delete()
        return redirect('tickets')

    context = {'ticket': ticket }
    return render(request, 'accounts/ticket_delete.html', context)

# Ticket Section
# User Section

@login_required(login_url='login')
def users(request):
    users = User.objects.all()
    context = {'users': users }
    return render(request, 'accounts/users.html', context)

@login_required(login_url='login')
def user(request, pk):
    user = User.objects.get(id=pk)
    tickets = user.tickets_set.all()
    ticket_count = tickets.count()

    myFilter = TicketFilter(request.GET, queryset=tickets)
    tickets = myFilter.qs

    context = {
        'user': user,
        'tickets': tickets,
        'ticket_count': ticket_count,
        'myFilter': myFilter
    }
    return render(request, 'accounts/user.html', context)

@login_required(login_url='login')
def createUser(request):
	form = UserForm()
	if request.method == 'POST':
		form = UserForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect('users')

	context = {'form':form}
	return render(request, 'accounts/user_add.html', context)

@login_required(login_url='login')
def updateUser(request, pk):
    user = User.objects.get(id=pk)    
    form = UserForm(instance=user)
    if request.method == 'POST':
        form = UserForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            return redirect('users')

    context = {'form': form }
    return render(request, 'accounts/user_update.html', context)

@login_required(login_url='login')
def deleteUser(request, pk):
    user = User.objects.get(id=pk) 
    if request.method == 'POST':
        print(user)
        user.delete()
        return redirect('users')

    context = {'user': user }
    return render(request, 'accounts/user_delete.html', context)

# User Section
# Service Section

@login_required(login_url='login')
def services(request):
    services = Service.objects.all()
    context = {'services': services }
    return render(request, 'accounts/services.html', context)

@login_required(login_url='login')
def createService(request):
	form = ServiceForm()
	if request.method == 'POST':
		form = ServiceForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect('services')

	context = {'form':form}
	return render(request, 'accounts/service_add.html', context)

@login_required(login_url='login')
def updateService(request, pk):
    service = Service.objects.get(id=pk)    
    form = ServiceForm(instance=service)
    if request.method == 'POST':
        form = ServiceForm(request.POST, instance=service)
        if form.is_valid():
            form.save()
            return redirect('services')

    context = {'form': form }
    return render(request, 'accounts/service_update.html', context)

@login_required(login_url='login')
def deleteService(request, pk):
    service = Service.objects.get(id=pk) 
    if request.method == 'POST':
        service.delete()
        return redirect('services')

    context = {'service': service }
    return render(request, 'accounts/service_delete.html', context)

# Service Section
# Product Section

@login_required(login_url='login')
def products(request):
    products = Product.objects.all()
    if request.method == 'POST' and request.POST['delete-id']:
        Product.objects.get(pk=request.POST['delete-id']).delete()
        return redirect('products')

    context = {'products': products }
    return render(request, 'accounts/products.html', context)

@login_required(login_url='login')
def createProduct(request):
	form = ProductForm()
	if request.method == 'POST':
		form = ProductForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect('products')

	context = {'form':form}
	return render(request, 'accounts/product_add.html', context)

@login_required(login_url='login')
def updateProduct(request, pk):
    product = Product.objects.get(id=pk)    
    form = ProductForm(instance=product)
    if request.method == 'POST':
        form = ProductForm(request.POST, instance=product)
        if form.is_valid():
            form.save()
            return redirect('products')

    context = {'form': form }
    return render(request, 'accounts/product_update.html', context)

@login_required(login_url='login')
def deleteProduct(request, pk):
    product = Product.objects.get(id=pk) 
    if request.method == 'POST':
        product.delete()
        return redirect('products')

    context = {'product': product }
    return render(request, 'accounts/product_delete.html', context)

# Product Section
# Customer Section

@login_required(login_url='login')
def customers(request):
    customers = Customer.objects.all()
    if request.method == 'POST' and request.POST['delete-id']:
        Customer.objects.get(pk=request.POST['delete-id']).delete()
        return redirect('customers')

    context = {'customers': customers }
    return render(request, 'accounts/customers.html', context)

@login_required(login_url='login')
def createCustomer(request):
	form = CustomerForm()
	if request.method == 'POST':
		form = CustomerForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect('customers')

	context = {'form':form}
	return render(request, 'accounts/customer_add.html', context)

@login_required(login_url='login')
def updateCustomer(request, pk):
    customer = Customer.objects.get(id=pk)    
    form = CustomerForm(instance=customer)
    if request.method == 'POST':
        form = CustomerForm(request.POST, instance=customer)
        if form.is_valid():
            form.save()
            return redirect('customers')

    context = {'form': form }
    return render(request, 'accounts/customer_update.html', context)

@login_required(login_url='login')
def deleteCustomer(request, pk):
    customer = Customer.objects.get(id=pk) 
    if request.method == 'POST':
        customer.delete()
        return redirect('customers')

    context = {'customer': customer }
    return render(request, 'accounts/customer_delete.html', context)

# Customer Section
# Account / Profile Section

@login_required(login_url='login')
def accountSettings(request):
    profile = request.user
    form = UserForm(instance=profile)
    if request.method =='POST':
        form = UserForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()

    context = {'form': form}
    return render(request, 'accounts/account_settings.html', context)

# Account / Profile Section