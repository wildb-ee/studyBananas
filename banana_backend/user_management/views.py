from django.shortcuts import render
from rest_framework.response import Response
from user_management.models import Club, Member, Position
from user_management.serializers import  ClubSerializer, CreateClubSerializer, JoinClubSerializer, MemberSerializer, RegisterSerializer, UserSerializer
from rest_framework import generics, permissions
from rest_framework.decorators import api_view,permission_classes
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework.exceptions import APIException

User = get_user_model()

# Create your views here.
class RegisterApi(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    def post(self, request, *args,  **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user,    context=self.get_serializer_context()).data,
            "messages": serializer.errors,
        })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def getProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def updateProfile(request):
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
    return Response({"messages": serializer.errors, "data": serializer.data})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def getClubs(request):
    user = request.user
    try:
        all_member = user.member_set.all()
        clubs = []
        for i in all_member:
            clubs.append(i.club)
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data)
    except:
        raise APIException("Club Detection Error")

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def exitClub(request, pk):
    user = request.user
    to_delete = user.member_set.filter(club__id= pk)
    if not to_delete.exists():
        raise APIException("No Such Club")

    to_delete.first().delete()
    return Response({"message": "User Left the Club Successfully"})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def addToClub(request):
    user = request.user
    serializer = MemberSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    club_name = serializer.data['club_name']
    position_name = serializer.data['position_name']
    username = serializer.data['username']

    current_member = user.member_set.filter(club__name = club_name)

    
    if not current_member.exists():
        raise APIException('Not Member of Club / No Such Club')
    
    if current_member.first().position.name != 'CEO':
        raise APIException('Not CEO of Club')

    new_user = User.objects.filter(username = username)

    if not user.exists():
        raise APIException('No User with Such Name')

    if user == new_user.first():
        raise APIException('Cannot Add Yourself')


    club = Club.objects.get(name = club_name)

    position = Position.objects.filter(name = position_name)

    if not position.exists():
        raise APIException('Position does not Exist')


    new_member = Member.objects.create(user= new_user.first(), club = club, position= position.first())


    return Response({
        "member": MemberSerializer(new_member).data,
        "message":"Member Added Successfully"
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def getClubMembers(request, pk):
    user = request.user

    try:

        current_member = user.member_set.get(club__id= pk)

        members = current_member.club.member_set.all()

        return Response({
            "message": "All members retrieved successfully",
            "members": MemberSerializer(members,many=True).data
        })
    
    except:
        raise APIException("Error Getting Club Members")
    


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def updateClubMember(request):
    user = request.user
    serializer = MemberSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    club_name = serializer.data['club_name']
    position_name = serializer.data['position_name']
    username = serializer.data['username']

    current_member = user.member_set.filter(club__name = club_name)


    if not current_member.exists():
        raise APIException('Not Member of Club / No Such Club')
    
    if current_member.first().position.name != 'CEO':
        raise APIException('Not CEO of Club')

    new_user = User.objects.filter(username = username)

    if not new_user.exists():
        raise APIException('No User with Such Name')

    if user == new_user.first():
        raise APIException('Cannot Update Yourself')
    
    update_member = new_user.first().member_set.filter(club__name = club_name)

    if not update_member.exists():
        raise APIException("No Such Member")

    position = Position.objects.filter(name = position_name)

    if not position.exists():
        raise APIException('Position does not Exist')
    
    um = update_member.first()
    
    um.position = position.first()

    um.save()

    return Response({"message" : "Member Update Successfully", "member": MemberSerializer(um).data})
    


#d
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def deleteClubMember(request, club_pk, member_pk):
    user = request.user

    current_member = user.member_set.filter(club__id = club_pk)

    if not current_member.exists():
        raise APIException('Not Member of Club / No Such Club')
    
    if current_member.first().position.name != 'CEO':
        raise APIException('Not CEO of Club')

    member = Member.objects.filter(club__id = club_pk, id = member_pk)

    if not member.exists():
        raise APIException('No Member with Such Name')

    if current_member.first() == member.first():
        raise APIException('Cannot Delete Yourself')
    
    m = member.first()
    
    m.delete()

    return Response({"message" : "Member Deleted Successfully"})




@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def createClub(request):
    user = request.user
    serializer = CreateClubSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    try:
        club = Club.objects.create(name=serializer.data['name'], description= serializer.data['description'], is_private = serializer.data['is_private'])
        position = Position.objects.get(name='CEO')
        Member.objects.create(user = user, position=position, club=club)
        return Response({"message": "Club Created Successfully"})
    except:
        raise APIException("Error Creating Club")

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def deleteClub(request,pk):
    user = request.user

    current_member = user.member_set.filter(club__id = pk)

    if not current_member.exists():
        raise APIException('Not Member of Club / No Such Club')
    
    if current_member.first().position.name != 'CEO':
        raise APIException('Not CEO of Club')
    
    cm = current_member.first()

    cm.club.delete()

    return Response({"message": "Club Deleted Successfully"})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def joinClub(request):
    user = request.user
    serializer = JoinClubSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    club = Club.objects.filter(name = serializer.data['name'], is_private = False)

    if not club.exists():
        raise APIException('No Such Public Club')
    if Member.objects.filter(user=user, club=club.first()).count()>0:
        raise APIException('You are already a member')

    position = Position.objects.get(Q(name='Active Member') | Q(name='Member'))
    new_member = Member.objects.create(user= user, club = club.first(), position= position )
    return Response({"message": "Success", 'member': MemberSerializer(new_member).data})


    

@api_view(['GET'])
def getPublicClubs(request):
    try:
        public_clubs = Club.objects.filter(is_private = False)
        return Response({"message": "Success", "clubs": ClubSerializer(public_clubs, many=True).data})
    except:
        raise APIException("Error Getting Public Clubs")

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def getClubPosition(request,pk):
    try:
        user = request.user
        current_member = user.member_set.get(club__id= pk)
        return Response({
            "message": "Retrieved successfully",
            "position": MemberSerializer(current_member).data
        })
    except:
        raise APIException("Error Getting Club Position")