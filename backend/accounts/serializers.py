from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'custom_id', 'username', 'email', 'full_name', 'role', 'mpin', 'phone_number']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    mpin = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'full_name', 'role', 'mpin', 'phone_number']

    def validate_phone_number(self, value):
        if value:
            if not value.isdigit() or len(value) != 10:
                raise serializers.ValidationError("Phone number must be exactly 10 digits and contain only numbers.")
            if User.objects.filter(phone_number=value).exists():
                raise serializers.ValidationError("Phone number already exists.")
        return value

    def create(self, validated_data):
        # Extract custom fields with defaults
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        email = validated_data.pop('email', '')
        
        # Create user using the manager
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            **validated_data
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
