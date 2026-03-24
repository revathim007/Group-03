import yfinance as yf
import csv
import os
from django.core.management.base import BaseCommand
from stocks.models import Stock
from decimal import Decimal
from django.conf import settings

class Command(BaseCommand):
    help = 'Seeds the database with stock data from CSV and yfinance'

    def add_arguments(self, parser):
        parser.add_argument('--csv', type=str, help='Path to CSV file containing stock symbols')

    def handle(self, *args, **options):
        stock_list = []
        
        # 1. Load from CSV if provided
        csv_path = options.get('csv')
        if csv_path and os.path.exists(csv_path):
            self.stdout.write(self.style.WARNING(f'Reading from CSV: {csv_path}'))
            try:
                with open(csv_path, mode='r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        symbol = row['Symbol']
                        if not symbol.endswith('.NS'):
                            symbol = f"{symbol}.NS"
                        
                        stock_list.append({
                            'name': row['Company Name'],
                            'symbol': symbol,
                            'exchange': 'NSE',
                            'sector': row.get('Industry', 'N/A')
                        })
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error reading CSV: {str(e)}'))
        else:
            # Default fallback list if no CSV is provided
            stock_list = [
                {'name': 'Reliance Industries', 'symbol': 'RELIANCE.NS', 'exchange': 'NSE'},
                {'name': 'HDFC Bank', 'symbol': 'HDFCBANK.NS', 'exchange': 'NSE'},
                {'name': 'Apple Inc.', 'symbol': 'AAPL', 'exchange': 'NASDAQ'},
                {'name': 'Microsoft Corporation', 'symbol': 'MSFT', 'exchange': 'NASDAQ'},
            ]

        self.stdout.write(self.style.SUCCESS(f'Starting to seed/update {len(stock_list)} stocks...'))

        for stock_data in stock_list:
            symbol = stock_data['symbol']
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                
                # Extract data from yfinance info
                name = info.get('longName', stock_data['name'])
                sector = info.get('sector', stock_data.get('sector', 'N/A'))
                price = info.get('currentPrice') or info.get('regularMarketPrice')
                currency = info.get('currency', 'INR')
                pe_ratio = info.get('trailingPE') or info.get('forwardPE')
                
                # Discount calculation: (Target Price - Current Price) / Target Price
                target_price = info.get('targetMeanPrice')
                discount_ratio = None
                if target_price and price:
                    discount_ratio = ((target_price - price) / target_price) * 100

                # Update or create stock in DB
                stock, created = Stock.objects.update_or_create(
                    symbol=symbol,
                    defaults={
                        'name': name,
                        'exchange': stock_data['exchange'],
                        'sector': sector,
                        'current_price': Decimal(str(price)) if price else None,
                        'currency': currency,
                        'pe_ratio': Decimal(str(pe_ratio)) if pe_ratio else None,
                        'discount_ratio': Decimal(str(discount_ratio)) if discount_ratio else None
                    }
                )
                
                status = 'Created' if created else 'Updated'
                self.stdout.write(self.style.SUCCESS(f'Successfully {status} {name} ({symbol}) - Price: {price}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error seeding {symbol}: {str(e)}'))

        self.stdout.write(self.style.SUCCESS('Seeding completed!'))
