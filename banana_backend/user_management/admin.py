from django.contrib import admin

from user_management.models import Club, CustomUser, Member, Position


admin.site.register(CustomUser)
admin.site.register(Club)
admin.site.register(Position)
admin.site.register(Member)
