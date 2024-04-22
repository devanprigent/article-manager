from django.db import models

class Website(models.Model):
   id = models.AutoField(primary_key=True)
   name = models.TextField()
   url = models.TextField()
   image_url = models.TextField(blank=True)

   def _str_(self):
     return self.name
