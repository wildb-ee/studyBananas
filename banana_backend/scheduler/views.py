from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework.decorators import api_view,permission_classes

from user_management.models import Member
from .models import Event, EventMember
from rest_framework.exceptions import APIException
from .serializers import EventMemberSerializer, EventSerializer
from django.db.models import Q

# Create your views here.
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def getEvents(request, club_pk):
    user = request.user 
    club_member = user.member_set.filter(club__id= club_pk)

    if not club_member.exists():
        raise APIException("No Access To Such Club")

    events = club_member.first().club.event_set.all()
    
    return Response({"message": "Events Retrieved Successfully", "events":EventSerializer(events, many=True).data})



#Create Event


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def createEvent(request):
    user = request.user

    serializer = EventSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    club_member= user.member_set.filter(club__name = serializer.data["club_name"])


    if not club_member.exists():
        raise APIException("Not Member")
    
    
    if club_member.first().position.name != "CEO":
        raise APIException("Not CEO")
    
    
    event = Event.objects.create(title=serializer.data['title'], description=serializer.data['description'],
                                start_time=serializer.data['start_time'],end_time=serializer.data['end_time'],
                                issued_by= club_member.first(), club = club_member.first().club)
    return Response({"message": "Event Created Successfully", "event":EventSerializer(event).data})
    
    


#Add Event Members

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def addEventMember(request):
    user = request.user

    serializer = EventMemberSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    event_flt = Event.objects.filter(id= serializer.data['event_id'])

    if not event_flt.exists() or not user.member_set.filter(club = event_flt.first().club).exists() :
        raise APIException("No Access To Such Event")

    event = Event.objects.get(id= serializer.data['event_id'])
    club_member= user.member_set.get(club = event.club)
    member =  event.club.member_set.get(user__username = serializer.data['username'])
   
    if club_member.position.name != "CEO":
        raise APIException("Not CEO")
    
    event_member = EventMember.objects.create(event = event, participant = member)
    
    return Response({"message": "Event Member Created Successfully", "member":EventMemberSerializer(event_member).data})
   

    


#Get Event Members

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def getEventMembers(request,event_id):
    user = request.user
    
    event = Event.objects.filter(id = event_id)

    if not event.exists():
        raise APIException("Does not Exist")

    
    if not Member.objects.filter(club = event.first().club, user = user).exists():
        raise APIException("Not Member")

    event_members = event.first().eventmember_set.all()

    return Response({"message": "Event Members Retrieved Successfully", "member":EventMemberSerializer(event_members, many= True).data})

    

#Delete Event Members

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def deleteEventMember(request,em_pk):
    pass



#Delete Event

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def deleteEvent(request, club_pk, em_pk):
    pass



#Update Event

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def updateEvent(request):
    pass

#Get Running Events

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def getRunningEvents(request):
    pass


#See Your Events (Participant)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def getParticipatingEvents(request):
    pass



#See Your Events (Issuer)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def getIssuedEvents(request,club_id):
    user = request.user
    membership = user.member_set.filter(club__id =club_id)
    if not membership.exists():
        raise APIException("Not Member")
    
    if membership.first().position.name != "CEO":
        raise APIException("Not CEO")
    
    events = membership.first().event_set.all()

    return Response({"message": "Issued Events Retrieved Successfully", "events":EventSerializer(events, many=True).data})

