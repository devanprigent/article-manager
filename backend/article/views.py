from rest_framework.views import exception_handler
from rest_framework import serializers,viewsets
from django.http import JsonResponse
from article.models import Article
from tag.models import Tag
from tag.views import TagSerializer

class ArticleSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Article   
        fields = '__all__'

    def create(self, validated_data):
        print(validated_data)
        # Check if an article with the same title and author already exists
        article = Article.objects.filter(title=validated_data['title'], author=validated_data['author'])
        if article.exists():
            raise serializers.ValidationError("Article with the same title and author already exists")
        # Get the tags data from the request
        tags_data = self.context['request'].data.get('tags', [])
        validated_tags = []
        for tag_data in tags_data:
            try:
                tag_object = Tag.objects.get(name=tag_data['name'])
                validated_tags.append(tag_object)
            except Tag.DoesNotExist:
                tag_object = Tag.objects.create(name=tag_data['name'])
                validated_tags.append(tag_object)
        validated_data['tags'] = validated_tags
        article = super().create(validated_data)
        return article
    
    def update(self, instance, validated_data):
        tags_data = self.context['request'].data.get('tags', [])
        validated_tags = []
        for tag_data in tags_data:
            try:
                tag_object = Tag.objects.get(name=tag_data['name'])
                validated_tags.append(tag_object)
            except Tag.DoesNotExist:
                tag_object = Tag.objects.create(name=tag_data['name'])
                validated_tags.append(tag_object)
        instance.tags.set(validated_tags)
        instance.save()
        return super().update(instance, validated_data)

    
class ArticleView(viewsets.ModelViewSet): 
    serializer_class = ArticleSerializer   
    queryset = Article.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            article = serializer.save()
            return Response({'id': article.id}, status=201)  # return the ID in the response
        return Response(serializer.errors, status=400)

    def handle_exception(self, exc):
        response = super().handle_exception(exc)
        if response is not None:
            response.data = {"message": response.data[0]}
        return response
