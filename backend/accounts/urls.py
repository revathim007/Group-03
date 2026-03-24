from django.urls import path
from .views import RegisterView, LoginView, UpdateUsernameView, UpdateEmailView, UpdatePhoneView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('update-username/', UpdateUsernameView.as_view(), name='update-username'),
    path('update-email/', UpdateEmailView.as_view(), name='update-email'),
    path('update-phone/', UpdatePhoneView.as_view(), name='update-phone'),
]
