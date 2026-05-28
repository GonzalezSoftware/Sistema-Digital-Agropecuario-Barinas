from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [

        # NUEVOS CAMPOS
        migrations.AddField(
            model_name='predio',
            name='caracterizacion_completada',
            field=models.BooleanField(default=False),
        ),
    ]