
import pandas as pd
import os
from django.core.management.base import BaseCommand
from stocks.models import Stock
from django.conf import settings

class Command(BaseCommand):
    help = 'Import stocks from CSV (India) or Excel (US) files'

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, required=True, help='Path to the file')
        parser.add_argument('--type', type=str, choices=['india', 'us'], help='Type of stocks: india or us (auto-detected if blank)')

    def handle(self, *args, **options):
        file_path = options.get('file')
        file_type = options.get('type')

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
            return

        # Auto-detect type based on extension or filename
        if not file_type:
            if file_path.endswith('.csv') or 'ind_' in file_path.lower():
                file_type = 'india'
            else:
                file_type = 'us'

        self.stdout.write(f"Importing {file_type.upper()} stocks from: {file_path}")

        try:
            if file_type == 'india':
                # Read CSV
                df = pd.read_csv(file_path)
                for index, row in df.iterrows():
                    symbol = f"{row['Symbol']}.NS"
                    stock, created = Stock.objects.get_or_create(symbol=symbol)
                    
                    stock.name = row['Company Name']
                    stock.exchange = 'NSE'
                    stock.sector = row['Industry']
                    stock.currency = 'INR'
                    stock.save()

                    status_str = 'Created' if created else 'Updated'
                    self.stdout.write(f"{status_str}: {symbol} ({stock.name})")

            else:  # US
                # Read Excel
                df = pd.read_excel(file_path)
                for index, row in df.iterrows():
                    symbol = row['Symbol']
                    stock, created = Stock.objects.get_or_create(symbol=symbol)
                    
                    stock.name = row['Company']
                    stock.exchange = 'NYSE'
                    stock.sector = row.get('Sector', None)
                    stock.current_price = row.get('Price', None)
                    stock.currency = 'USD'
                    stock.save()

                    status_str = 'Created' if created else 'Updated'
                    self.stdout.write(f"{status_str}: {symbol} ({stock.name})")

            self.stdout.write(self.style.SUCCESS(f'Successfully imported stocks from {file_path}'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An error occurred: {str(e)}'))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR('File not found. Please check the file path.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An error occurred: {e}'))
