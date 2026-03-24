
from django.urls import path
from .views import (
    StockListView, 
    StockHistoryView, 
    PortfolioListCreateView, 
    PortfolioDetailView, 
    CollectionListCreateView, 
    CollectionDeleteView, 
    PurchaseListCreateView,
    SentimentAnalysisView,
    StockForecastView
)

urlpatterns = [
    path('', StockListView.as_view(), name='stock-list'),
    path('history/<str:symbol>/', StockHistoryView.as_view(), name='stock-history'),
    path('sentiment/<str:symbol>/', SentimentAnalysisView.as_view(), name='stock-sentiment'),
    path('forecast/<str:symbol>/', StockForecastView.as_view(), name='stock-forecast'),
    path('portfolios/', PortfolioListCreateView.as_view(), name='portfolio-list-create'),
    path('portfolios/<int:pk>/', PortfolioDetailView.as_view(), name='portfolio-detail'),
    path('collections/', CollectionListCreateView.as_view(), name='collection-list-create'),
    path('collections/delete/', CollectionDeleteView.as_view(), name='collection-delete'),
    path('purchases/', PurchaseListCreateView.as_view(), name='purchase-list-create'),
]
