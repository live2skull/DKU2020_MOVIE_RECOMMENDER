# Generated by Django 2.2.11 on 2020-11-07 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0011_movieusercomment_is_spoiler'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movieuser',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
    ]
