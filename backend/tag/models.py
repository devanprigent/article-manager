from django.db import models

class Tag(models.Model):
   id = models.AutoField(primary_key=True)
   name = models.TextField()
   date_creation = models.DateTimeField(auto_now_add=True)
   date_modification = models.DateTimeField(auto_now=True)

   def _str_(self):
     return self.name
