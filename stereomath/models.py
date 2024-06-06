from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="admin_profile")
    department = models.CharField(max_length=100)
    bio = models.TextField()

    def __str__(self):
        return f"{self.user.username}'s Admin Profile"

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        AdminProfile.objects.create(user=instance)
    instance.admin_profile.save()
