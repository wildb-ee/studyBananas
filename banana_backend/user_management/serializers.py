from django.contrib.auth import get_user_model
from django.forms import ValidationError
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from user_management.models import Club, Member
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','password','first_name', 'last_name','bio', 'sat_result', 'ielts_result', 'toefl_result')
        extra_kwargs = {
            'password':{'write_only': True},
        }


    def create(self, validated_data):
        
        user = User.objects.create(username=validated_data['username'], first_name = validated_data['first_name'], last_name = validated_data['last_name'], 
                                   bio = validated_data['bio'], sat_result = validated_data['sat_result'], toefl_result = validated_data['toefl_result'],
                                     ielts_result = validated_data['ielts_result'])
        
        user.set_password(validated_data['password'])
        user.save()
        return user
            
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','first_name', 'last_name','bio', 'sat_result', 'ielts_result', 'toefl_result')

class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ('id','name', 'description')

class MemberSerializer(serializers.ModelSerializer):
    position_name = serializers.CharField(source='position.name')
    club_name = serializers.CharField(source= 'club.name',)
    username = serializers.CharField(source='user.username')

    class Meta:
        model = Member
        fields = ('id','position_name', 'club_name', 'username')

class JoinClubSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    
    class Meta: 
        model = Club
        fields = ('name',)

class CreateClubSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Club
        fields = ('name','description', 'is_private')
