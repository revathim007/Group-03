
import os
import subprocess
import sys
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Exports/Imports the entire database as JSON for easy data portability'

    def add_arguments(self, parser):
        parser.add_argument('action', choices=['export', 'import'], help='Action: export or import')
        parser.add_argument('--file', type=str, default='data_dump.json', help='Filename to use')

    def handle(self, *args, **options):
        action = options['action']
        filename = options['file']
        file_path = os.path.join(settings.BASE_DIR, filename)

        if action == 'export':
            self.stdout.write(self.style.WARNING(f"Exporting database to: {file_path}"))
            try:
                # We use subprocess because call_command('dumpdata') returns a string 
                # that can be HUGE, and writing it manually is safer.
                with open(file_path, 'w', encoding='utf-8') as f:
                    subprocess.check_call(['python', 'manage.py', 'dumpdata', '--exclude', 'contenttypes', '--exclude', 'auth.Permission', '--indent', '2'], stdout=f)
                self.stdout.write(self.style.SUCCESS("Database exported successfully!"))
                self.stdout.write(f"Tip: Push {filename} to git to move your data to the VM.")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Export failed: {str(e)}"))

        elif action == 'import':
            if not os.path.exists(file_path):
                self.stdout.write(self.style.ERROR(f"File not found: {file_path}"))
                return

            self.stdout.write(self.style.WARNING(f"Importing database from: {file_path}"))
            try:
                subprocess.check_call(['python', 'manage.py', 'loaddata', filename])
                self.stdout.write(self.style.SUCCESS("Database imported successfully!"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Import failed: {str(e)}"))
