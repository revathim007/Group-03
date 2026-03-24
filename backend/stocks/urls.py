
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
    StockForecastView,
    StockKMeansView,
    UserRecommendationAnalysisView,
    ChatbotView,
    AdminDashboardStatsView
)

urlpatterns = [
    path('admin-stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('chatbot/', ChatbotView.as_view(), name='chatbot'),
    path('', StockListView.as_view(), name='stock-list'),
    path('history/<str:symbol>/', StockHistoryView.as_view(), name='stock-history'),
    path('sentiment/<str:symbol>/', SentimentAnalysisView.as_view(), name='stock-sentiment'),
    path('forecast/<str:symbol>/', StockForecastView.as_view(), name='stock-forecast'),
    path('kmeans/<str:symbol>/', StockKMeansView.as_view(), name='stock-kmeans'),
    path('recommendation-analysis/<int:user_id>/', UserRecommendationAnalysisView.as_view(), name='user-recommendation-analysis'),
    path('portfolios/', PortfolioListCreateView.as_view(), name='portfolio-list-create'),
    path('portfolios/<int:pk>/', PortfolioDetailView.as_view(), name='portfolio-detail'),
    path('collections/', CollectionListCreateView.as_view(), name='collection-list-create'),
    path('collections/delete/', CollectionDeleteView.as_view(), name='collection-delete'),
    path('purchases/', PurchaseListCreateView.as_view(), name='purchase-list-create'),
]
