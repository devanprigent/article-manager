from rest_framework import serializers,viewsets
from article.models import Article
from tag.models import Tag
from tag.views import TagSerializer

class ArticleSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Article   
        fields = '__all__'

    def create(self, validated_data):
        tags_data = self.context['request'].data.get('tags', [])
        validated_tags = []
        for tag_data in tags_data:
            try:
                tag_object = Tag.objects.get(nom=tag_data['nom'])
                validated_tags.append(tag_object)
            except Tag.DoesNotExist:
                tag_object = Tag.objects.create(nom=tag_data['nom'])
                validated_tags.append(tag_object)
        validated_data['tags'] = validated_tags
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        tags_data = self.context['request'].data.get('tags', [])
        validated_tags = []
        for tag_data in tags_data:
            try:
                tag_object = Tag.objects.get(nom=tag_data['nom'])
                validated_tags.append(tag_object)
            except Tag.DoesNotExist:
                tag_object = Tag.objects.create(nom=tag_data['nom'])
                validated_tags.append(tag_object)
        instance.tags.set(validated_tags)
        instance.save()
        return super().update(instance, validated_data)

    
class ArticleView(viewsets.ModelViewSet): 
    serializer_class = ArticleSerializer   
    queryset = Article.objects.all()
