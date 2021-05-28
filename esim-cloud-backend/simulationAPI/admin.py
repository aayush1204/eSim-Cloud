from django.contrib import admin
from simulationAPI.models import Task, spiceFile

# Register your models here.
# admin.site.register(Task)
admin.site.register(spiceFile)
# @admin.register(Task)
# class TaskAdmin(admin.ModelAdmin):
#     list_display = ('task_time', 'task_id')

admin.site.register(Task)