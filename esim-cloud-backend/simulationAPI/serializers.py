import logging
from rest_framework import serializers
from simulationAPI.models import spiceFile, Task

logger = logging.getLogger(__name__)


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = spiceFile
        fields = ('file', 'upload_time', 'file_id', 'task')


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    # user = serializers.ReadOnlyField(source='user.username')
    file = FileSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ('task_id', 'task_time', 'file', 'task_name')

    def create(self, validated_data):
        # Takes file from request and stores it along with a taskid
        files_data = list(self.context.get(
            'view').request.FILES.getlist("file"))[0]
       
        taskname = self.context.get('view').request.data['task_name']
        type_simulation = self.context.get('view').request.data['task_type']        
        task_type1 = "DC SOLVER"
        
        if type_simulation == "Transient":
            task_type1 = "TRANSIENT ANALYSIS"
        elif type_simulation == "DcSolver":
            task_type1 = "DC SOLVER"   
        elif type_simulation == "DcSweep":
            task_type1 = "DC SWEEP"    
        elif type_simulation == "Ac":
            task_type1 = "AC ANALYSIS" 

        logger.info('File Upload')
        task = Task.objects.create(task_name=taskname, task_type =task_type1)
        logger.info('task: '+str(task))
        spiceFile.objects.create(task=task, file=files_data)
        logger.info('Created Object for:' + files_data.name)
        return task

class TaskIdsSerializer(serializers.HyperlinkedModelSerializer):
    file = FileSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ('task_id', 'task_time', 'file', 'task_name')
