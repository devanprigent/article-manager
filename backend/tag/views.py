from rest_framework import serializers,viewsets
from tag.models import Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag   
        fields = '__all__'

class TagView(viewsets.ModelViewSet):  
    serializer_class = TagSerializer   
    queryset = Tag.objects.all()
