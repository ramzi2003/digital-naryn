# Generated by Django 5.2 on 2025-04-12 05:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0004_remove_item_photos_delete_photo_item_photos'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='icon',
            field=models.ImageField(blank=True, null=True, upload_to='category_icons/'),
        ),
    ]
