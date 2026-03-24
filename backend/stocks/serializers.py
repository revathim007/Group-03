from rest_framework import serializers
from .models import Stock, Portfolio, Collection, Purchase, PortfolioItem
from accounts.models import User

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'symbol', 'name', 'exchange', 'sector', 'current_price', 'currency', 'pe_ratio', 'discount_ratio', 'last_updated']

class PortfolioItemSerializer(serializers.ModelSerializer):
    stock = StockSerializer(read_only=True)
    stock_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = PortfolioItem
        fields = ['stock', 'stock_id', 'quantity']

class PortfolioSerializer(serializers.ModelSerializer):
    items = PortfolioItemSerializer(many=True, read_only=True)
    # stocks_data will handle the input list of {stock_id, quantity}
    stocks_data = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=False
    )

    class Meta:
        model = Portfolio
        fields = ['id', 'portfolio_id', 'name', 'description', 'items', 'stocks_data', 'created_at']
        read_only_fields = ['portfolio_id', 'created_at']

    def create(self, validated_data):
        stocks_data = validated_data.pop('stocks_data', [])
        portfolio = Portfolio.objects.create(**validated_data)
        for item in stocks_data:
            stock = Stock.objects.get(id=item['stock_id'])
            PortfolioItem.objects.create(
                portfolio=portfolio,
                stock=stock,
                quantity=item.get('quantity', 1)
            )
        return portfolio

    def update(self, instance, validated_data):
        stocks_data = validated_data.pop('stocks_data', None)
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        
        if stocks_data is not None:
            # For simplicity, we'll just add/update items
            for item in stocks_data:
                stock = Stock.objects.get(id=item['stock_id'])
                PortfolioItem.objects.update_or_create(
                    portfolio=instance,
                    stock=stock,
                    defaults={'quantity': item.get('quantity', 1)}
                )
        return instance

class CollectionSerializer(serializers.ModelSerializer):
    stock = StockSerializer(read_only=True)
    stock_id = serializers.IntegerField(write_only=True)
    user_id = serializers.IntegerField(write_only=True)
    portfolio_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    portfolio_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Collection
        fields = ['id', 'stock', 'stock_id', 'user_id', 'portfolio_name', 'portfolio_id', 'added_at']

    def create(self, validated_data):
        stock_id = validated_data.pop('stock_id')
        user_id = validated_data.pop('user_id')
        portfolio_name = validated_data.get('portfolio_name')
        portfolio_id = validated_data.get('portfolio_id')
        stock = Stock.objects.get(id=stock_id)
        user = User.objects.get(id=user_id)
        
        collection, created = Collection.objects.update_or_create(
            user=user,
            stock=stock,
            defaults={
                'portfolio_name': portfolio_name,
                'portfolio_id': portfolio_id
            }
        )
        return collection

class PurchaseSerializer(serializers.ModelSerializer):
    stock = StockSerializer(read_only=True)
    stock_id = serializers.IntegerField(write_only=True)
    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Purchase
        fields = ['id', 'stock', 'stock_id', 'user_id', 'quantity', 'purchase_price', 'total_amount', 'portfolio_name', 'purchased_at']
        read_only_fields = ['purchase_price', 'total_amount', 'purchased_at']

    def create(self, validated_data):
        stock_id = validated_data.pop('stock_id')
        user_id = validated_data.pop('user_id')
        stock = Stock.objects.get(id=stock_id)
        user = User.objects.get(id=user_id)
        quantity = validated_data['quantity']
        
        # Ensure we have a valid price, default to 0 if None
        price_val = stock.current_price if stock.current_price is not None else 0
        purchase_price = price_val
        total_amount = price_val * quantity
        
        purchase = Purchase.objects.create(
            user=user,
            stock=stock,
            purchase_price=purchase_price,
            total_amount=total_amount,
            **validated_data
        )
        return purchase
