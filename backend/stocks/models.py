from django.db import models
from django.conf import settings
import uuid

class Stock(models.Model):
    symbol = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    exchange = models.CharField(max_length=50, default='NSE') # Default to NSE for Indian stocks
    sector = models.CharField(max_length=100, blank=True, null=True)
    current_price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='INR')
    pe_ratio = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_ratio = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.symbol})"

class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='portfolios')
    portfolio_id = models.CharField(max_length=20, unique=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    stocks = models.ManyToManyField(Stock, through='PortfolioItem', related_name='portfolios')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.portfolio_id:
            # Generate a unique compact ID (e.g., PF-XXXX)
            unique_part = str(uuid.uuid4()).split('-')[0].upper()
            self.portfolio_id = f"PF-{unique_part}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.portfolio_id}) - {self.user.username}"

class PortfolioItem(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='items')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('portfolio', 'stock')

    def __str__(self):
        return f"{self.quantity} shares of {self.stock.symbol} in {self.portfolio.name}"

class Collection(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='collections')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='collected_by')
    portfolio_name = models.CharField(max_length=255, blank=True, null=True)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'stock')

    def __str__(self):
        return f"{self.user.username} - {self.stock.symbol}"

class Purchase(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='purchases')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    purchase_price = models.DecimalField(max_digits=15, decimal_places=2)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    purchased_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} bought {self.quantity} shares of {self.stock.symbol}"
