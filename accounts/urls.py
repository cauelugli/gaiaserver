from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),

    path('', views.home, name='home'),
    
    path('tickets/', views.tickets, name='tickets'),
    path('create_ticket/', views.createTicket, name="create_ticket"),
    path('update_ticket/<str:pk>/', views.updateTicket, name="update_ticket"),
    path('delete_ticket/<str:pk>/', views.deleteTicket, name="delete_ticket"),

    path('users/', views.users, name='users'),
    path('create_user/', views.createUser, name="create_user"),
    path('update_user/<str:pk>/', views.updateUser, name='update_user'),
    path('delete_user/<str:pk>/', views.deleteUser, name='delete_user'),
    path('user/<str:pk>/', views.user, name='user'),

    path('services/', views.services, name='services'),
    path('create_service/', views.createService, name="create_service"),
    path('update_service/<str:pk>/', views.updateService, name='update_service'),
    path('delete_service/<str:pk>/', views.deleteService, name='delete_service'),

    path('products/', views.products, name='products'),
    path('create_product/', views.createProduct, name="create_product"),
    path('update_product/<str:pk>/', views.updateProduct, name='update_product'),
    path('delete_product/<str:pk>/', views.deleteProduct, name='delete_product'),

    path('customers/', views.customers, name='customers'),
    path('create_customer/', views.createCustomer, name="create_customer"),
    path('update_customer/<str:pk>/', views.updateCustomer, name='update_customer'),
    path('delete_customer/<str:pk>/', views.deleteCustomer, name='delete_customer'),

    path('account/', views.accountSettings, name='account'),

    path(
        'reset_password/', 
        auth_views.PasswordResetView.as_view(template_name="accounts/password_reset.html"), 
        name="reset_password"),

    path(
        'reset_password_sent/', 
        auth_views.PasswordResetDoneView.as_view(template_name="accounts/password_reset_sent.html"), 
        name="password_reset_done"),

    path(
        'reset/<uidb64>/<token>/', 
        auth_views.PasswordResetConfirmView.as_view(template_name="accounts/password_reset_form.html"), 
        name="password_reset_confirm"),

    path(
        'reset_password_complete/', 
        auth_views.PasswordResetCompleteView.as_view(template_name="accounts/password_reset_done.html"), 
        name="password_reset_complete"),
]