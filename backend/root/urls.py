from django.contrib import admin
from django.urls import path,include     
from rest_framework import routers       
from article import views as article_views 
from tag import views as tag_views 

router = routers.DefaultRouter()                   
router.register(r'articles', article_views.ArticleView, 'articles')
router.register(r'tags', tag_views.TagView, 'tags')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
