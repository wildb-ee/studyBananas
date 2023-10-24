import uuid
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    bio = models.CharField(max_length=255, blank=True)
    ielts_result = models.FloatField(null=True, blank=True)
    toefl_result = models.IntegerField(null=True, blank=True)
    sat_result = models.IntegerField( blank=True, null=True)


class Club(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, blank=True)
    is_private = models.BooleanField(default=False)
    
    
class Position(models.Model):
    id = models.UUIDField( 
        primary_key = True, 
        default = uuid.uuid4, 
        editable = False) 
    name = models.CharField(max_length=50)


class Member(models.Model):
    club = models.ForeignKey(Club, on_delete=models.CASCADE)
    position = models.ForeignKey(Position, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    
 




