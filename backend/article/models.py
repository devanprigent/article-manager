from django.db import models
from tag.models import Tag

class Article(models.Model):
   id = models.AutoField(primary_key=True)
   nom = models.TextField()
   auteur = models.TextField()
   url_site = models.TextField()
   url_article = models.TextField()
   date = models.IntegerField()
   summary = models.TextField()
   read = models.BooleanField(default=False)
   favoris = models.BooleanField(default=False)
   tags = models.ManyToManyField(Tag, blank=True)
   date_creation = models.DateTimeField(auto_now_add=True)
   date_modification = models.DateTimeField(auto_now=True)

   def _str_(self):
     return self.titre
