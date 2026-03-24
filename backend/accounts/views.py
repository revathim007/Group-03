from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class UpdateUsernameView(APIView):
    def post(self, request):
        new_username = request.data.get('new_username')
        user_id = request.data.get('user_id')
        
        if not new_username or not user_id:
            return Response({'error': 'Missing data'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(id=user_id)
            if User.objects.filter(username=new_username).exclude(id=user_id).exists():
                return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.username = new_username
            user.save()
            return Response({'message': 'Username updated successfully', 'user': UserSerializer(user).data})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class UpdateEmailView(APIView):
    def post(self, request):
        new_email = request.data.get('new_email')
        user_id = request.data.get('user_id')
        
        if not new_email or not user_id:
            return Response({'error': 'Missing data'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(id=user_id)
            if User.objects.filter(email=new_email).exclude(id=user_id).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.email = new_email
            user.save()
            return Response({'message': 'Email updated successfully', 'user': UserSerializer(user).data})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class UpdatePhoneView(APIView):
    def post(self, request):
        new_phone = request.data.get('new_phone')
        user_id = request.data.get('user_id')
        
        if not new_phone or not user_id:
            return Response({'error': 'Missing data'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Validation: only digits and 10 digits
        if not new_phone.isdigit() or len(new_phone) != 10:
            return Response({'error': 'Phone number must be exactly 10 digits and contain only numbers'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(id=user_id)
            # Check if phone number is already used by another user
            if User.objects.filter(phone_number=new_phone).exclude(id=user_id).exists():
                return Response({'error': 'Phone number already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.phone_number = new_phone
            user.save()
            return Response({'message': 'Phone number updated successfully', 'user': UserSerializer(user).data})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                return Response({
                    'token': 'placeholder-token',
                    'user': UserSerializer(user).data
                })
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
