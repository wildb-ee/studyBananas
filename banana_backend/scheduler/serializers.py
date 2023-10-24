from rest_framework import serializers

from scheduler.models import Event, EventMember

class EventSerializer(serializers.ModelSerializer):
    club_name = serializers.CharField(source='club.name')

    class Meta:
        model = Event
        fields = ('id','title', 'description','start_time', 'end_time', 'is_active', 'is_deleted', 'club_name')

class EventMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='participant.user.username')
    event_id = serializers.IntegerField(source='event.id')

    class Meta:
        model = EventMember
        fields = ('event_id', 'username')

