
import yfinance as yf
from django.core.management.base import BaseCommand
from stocks.models import Stock
from decimal import Decimal
import time

class Command(BaseCommand):
    help = 'Refreshes real-time pricing for all stocks in the database using yfinance'

    def handle(self, *args, **options):
        stocks = Stock.objects.all()
        total = stocks.count()
        self.stdout.write(self.style.WARNING(f"Refreshing prices for {total} stocks..."))

        updated_count = 0
        error_count = 0

        # We can update in chunks to avoid yfinance rate limits or just loop
        for i, stock in enumerate(stocks):
            try:
                ticker = yf.Ticker(stock.symbol)
                # Fetch only current price for efficiency
                info = ticker.info
                price = info.get('currentPrice') or info.get('regularMarketPrice')
                
                if price:
                    stock.current_price = Decimal(str(price))
                    
                    # Also update PE and Target Price if available
                    pe = info.get('trailingPE') or info.get('forwardPE')
                    if pe:
                        stock.pe_ratio = Decimal(str(pe))
                    
                    target = info.get('targetMeanPrice')
                    if target:
                        discount = ((target - float(price)) / target) * 100
                        stock.discount_ratio = Decimal(str(discount))
                    
                    stock.save()
                    updated_count += 1
                
                if (i + 1) % 10 == 0:
                    self.stdout.write(f"Processed {i+1}/{total} stocks...")
                
                # Small sleep to avoid aggressive rate limiting
                # time.sleep(0.1) 

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error updating {stock.symbol}: {str(e)}"))
                error_count += 1

        self.stdout.write(self.style.SUCCESS(f"Finished! Updated: {updated_count}, Errors: {error_count}"))
