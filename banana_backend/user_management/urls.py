from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterApi, addToClub, createClub, deleteClub, deleteClubMember, exitClub, getClubMembers, getClubPosition, getClubs, getPublicClubs, joinClub, updateClubMember, updateProfile, getProfile

urlpatterns = [
    path('signup', RegisterApi.as_view(), name='register_new_user'),
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('edit/profile', updateProfile , name='edit_authenticated_user_profile'),
    path('get/profile', getProfile, name='get_authenticated_user_profile'),
    path('get/clubs', getClubs, name='get_user_clubs'),
    path('exit/club/<int:pk>', exitClub, name='exit_club'),
    path('add/member', addToClub, name = 'add_member_to_club'),
    path('get/members/<int:pk>', getClubMembers, name= 'get_current_club_members'),
    path('update/member', updateClubMember, name='update_club_member'),
    path('delete/member/<int:club_pk>/<int:member_pk>', deleteClubMember, name= 'delete_club_member'),
    path('create/club', createClub, name = 'create_new_club'),
    path('get/club/position/<int:pk>',getClubPosition, name = 'get_your_club_position'),
    path('get/public/clubs', getPublicClubs, name = 'get_public_clubs'),
    path('join/public/club', joinClub, name = 'join_public_club'),
    path('delete/club/<int:pk>', deleteClub, name='delete_club'),
]