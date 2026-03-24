from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('customer', 'Customer'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    full_name = models.CharField(max_length=255)
    mpin = models.CharField(max_length=6, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    custom_id = models.CharField(max_length=20, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.custom_id:
            # Generate ID based on role
            prefix = 'SV-A-' if self.role == 'admin' else 'SV-C-'
            last_user = User.objects.filter(role=self.role).order_by('id').last()
            if not last_user:
                new_id_num = 1001
            else:
                try:
                    # Extract numeric part from last_user.custom_id
                    last_num = int(last_user.custom_id.split('-')[-1])
                    new_id_num = last_num + 1
                except (ValueError, IndexError, AttributeError):
                    new_id_num = 1001
            self.custom_id = f"{prefix}{new_id_num}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role}) - {self.custom_id}"
