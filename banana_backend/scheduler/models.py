from datetime import datetime
import uuid
from django.db import models
from django.contrib.auth import get_user_model

from user_management.models import Club, Member

User = get_user_model()


# Create your models here.


class EventManager(models.Manager):

    def get_all_events(self, member):
        events = Event.objects.filter(member=member, is_active=True, is_deleted=False)
        return events

    def get_running_events(self, member):
        running_events = Event.objects.filter(
            member = member,
            is_active=True,
            is_deleted=False,
            end_time__gte=datetime.now().date(),
        ).order_by("start_time")
        return running_events



class Event(models.Model):
    
    issued_by = models.ForeignKey(Member, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    club = models.ForeignKey(Club, on_delete=models.CASCADE )    

    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_private = models.BooleanField(default=True)


    objects = EventManager()
    class Meta:
        unique_together = ["title", "issued_by"]

    

class EventMember(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    participant = models.ForeignKey(
        Member, on_delete=models.CASCADE
    )

    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["event", "participant"]

