
import pandas as pd
import os
from django.core.management.base import BaseCommand
from stocks.models import Stock
from django.conf import settings
import yfinance as yf
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seeds the database with both India and US stocks from the root data files'

    def handle(self, *args, **options):
        # 1. Paths to files in project root
        # BASE_DIR: d:\Revathi\Biz Metric Internship\Project 2026\Stoxie\Group-03\backend
        # Files: d:\Revathi\Biz Metric Internship\Project 2026\Stoxie\Group-03\ind_nifty200list.csv
        root_dir = settings.BASE_DIR.parent
        india_file = os.path.join(root_dir, 'ind_nifty200list.csv')
        us_file = os.path.join(root_dir, 'USA Top 200 Stocks.xlsx')

        self.stdout.write(self.style.WARNING(f"Looking for data files in: {root_dir}"))

        # 2. Process India Stocks (NSE)
        if os.path.exists(india_file):
            self.stdout.write(self.style.SUCCESS(f"Importing India stocks from: {india_file}"))
            try:
                df = pd.read_csv(india_file)
                count = 0
                for _, row in df.iterrows():
                    symbol = f"{row['Symbol']}.NS"
                    stock, created = Stock.objects.get_or_create(
                        symbol=symbol,
                        defaults={
                            'name': row['Company Name'],
                            'exchange': 'NSE',
                            'sector': row['Industry'],
                            'currency': 'INR'
                        }
                    )
                    if created: count += 1
                self.stdout.write(self.style.SUCCESS(f"Finished India stocks. Created {count} new entries."))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error importing India stocks: {str(e)}"))
        else:
            self.stdout.write(self.style.ERROR(f"India file not found: {india_file}"))

        # 3. Process US Stocks (NYSE/NASDAQ)
        if os.path.exists(us_file):
            self.stdout.write(self.style.SUCCESS(f"Importing US stocks from: {us_file}"))
            try:
                # The US file is Excel
                df = pd.read_excel(us_file)
                count = 0
                for _, row in df.iterrows():
                    symbol = row['Symbol']
                    stock, created = Stock.objects.get_or_create(
                        symbol=symbol,
                        defaults={
                            'name': row['Company'],
                            'exchange': 'NYSE', # Defaulting to NYSE, yfinance handles both
                            'sector': row.get('Sector', 'N/A'),
                            'currency': 'USD'
                        }
                    )
                    if created: count += 1
                self.stdout.write(self.style.SUCCESS(f"Finished US stocks. Created {count} new entries."))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error importing US stocks: {str(e)}"))
        else:
            self.stdout.write(self.style.ERROR(f"US file not found: {us_file}"))

        # 4. Optional: Initial Price Update for a few key stocks (to show it works)
        # We don't want to update all 400 at once during seed as it takes time, 
        # the app fetches them on-demand or we can have a separate refresh command.
        self.stdout.write(self.style.WARNING("Stock metadata seeded. Prices will be updated on-demand in the app."))
