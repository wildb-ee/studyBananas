from django.urls import path

from .views import  addEventMember, createEvent, getEventMembers, getEvents, getIssuedEvents

urlpatterns = [
    path('event/create', createEvent, name = 'create_event'),
    path('event/get/all/<int:club_pk>', getEvents, name= 'get_all_events'),
    path('event/add/member', addEventMember, name= "add_event_member"),
    path('event/get/members/<int:event_id>', getEventMembers, name= 'get_event_members'),
    path('event/get/issued/<int:club_id>', getIssuedEvents, name = 'get_issued_events'),
]